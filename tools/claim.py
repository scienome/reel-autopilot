#!/usr/bin/env python3
"""One run only, across every Claude account.

Several Claude accounts (or a main run and its backup) may have scheduled tasks for the same job. Before doing ANY
work, a run must claim the job here. The lock is a file in the repo, `locks/<job>.json`, and claiming it is a git
push: if two runs race, git rejects the second push, so only one can win.

    python3 tools/claim.py start <job>      # exit 0 = you own the job, do it.  exit 3 = STOP, someone else has it / it's done
    python3 tools/claim.py beat <job>       # heartbeat: run after every push or every ~30 min while working
    python3 tools/claim.py done <job>       # mark finished (other runs in the same window then stop)
    python3 tools/claim.py status [<job>]   # show the lock(s)

Rules used by `start` (all times UTC in the file, windows in IST days):
  * status "done" and finished within the last --window days (default 1: today or yesterday IST)  -> exit 3
  * status "in_progress", owned by someone else, heartbeat younger than --stale minutes (default 90) -> exit 3
  * status "in_progress", heartbeat older than --stale  -> the other run died (usage limit etc.): take it over, exit 0.
    The previous owner and its notes stay in the file under "history", so the new run can finish the same batch
    (read the series' batch_log.json / PR to see which items are still missing).
  * anything else -> claim, exit 0

Owner name: $CLAIM_OWNER, else "<hostname>-<random>" saved in .git/claim-owner (stable for this checkout). Set CLAIM_OWNER to something that identifies the account,
e.g. CLAIM_OWNER=acct2-toybatch.

Job names in use: toy-batch, couch-batch, pov-batch, mech-batch (add new ones freely, one per scheduled job).
Run from the repo root of a clean checkout of main. Lock commits use [skip ci] so they never start a render.
"""
import argparse, datetime as D, json, os, socket, subprocess, sys, tempfile

IST = D.timezone(D.timedelta(hours=5, minutes=30))
ROOT = subprocess.run(['git', 'rev-parse', '--show-toplevel'], capture_output=True, text=True).stdout.strip() or '.'


def git(*a, check=True):
    r = subprocess.run(['git', '-C', ROOT, *a], capture_output=True, text=True)
    if check and r.returncode:
        raise RuntimeError(f"git {' '.join(a)} failed: {r.stderr.strip()}")
    return r


def now():
    return D.datetime.now(D.timezone.utc)


def iso(t):
    return t.strftime('%Y-%m-%dT%H:%M:%SZ')


def parse(s):
    return D.datetime.strptime(s, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=D.timezone.utc)


def rel(job):
    return f'locks/{job}.json'


# The lock is read from and written to origin/main directly with git plumbing, so the working folder (which may hold
# unfinished reels) is never touched, and the local branch is never moved.

def sync():
    git('fetch', '-q', 'origin', 'main')


def read(job):
    r = git('show', f'origin/main:{rel(job)}', check=False)
    return json.loads(r.stdout) if r.returncode == 0 else None


def push(job, lock, msg):
    body = json.dumps(lock, indent=1) + '\n'
    if read(job) == lock:
        return True  # nothing changed (same second, same owner)
    blob = subprocess.run(['git', '-C', ROOT, 'hash-object', '-w', '--stdin'], input=body,
                          capture_output=True, text=True, check=True).stdout.strip()
    idx = os.path.join(tempfile.gettempdir(), f'claim-index-{os.getpid()}')
    env = dict(os.environ, GIT_INDEX_FILE=idx)
    try:
        run = lambda *a: subprocess.run(['git', '-C', ROOT, *a], env=env, capture_output=True, text=True, check=True).stdout.strip()
        run('read-tree', 'origin/main')
        run('update-index', '--add', '--cacheinfo', f'100644,{blob},{rel(job)}')
        tree = run('write-tree')
        commit = run('commit-tree', tree, '-p', 'origin/main', '-m', f'{msg} [skip ci]')
    finally:
        if os.path.exists(idx):
            os.remove(idx)
    # A plain (non-force) push only succeeds if nobody else pushed since our fetch: that is the atomic claim.
    return git('push', '-q', 'origin', f'{commit}:refs/heads/main', check=False).returncode == 0


def owner():
    # Stable for the whole run: $CLAIM_OWNER, else a name saved inside this checkout's .git on first use.
    if os.environ.get('CLAIM_OWNER'):
        return os.environ['CLAIM_OWNER']
    f = git('rev-parse', '--git-path', 'claim-owner').stdout.strip()
    f = f if os.path.isabs(f) else os.path.join(ROOT, f)
    if not os.path.exists(f):
        with open(f, 'w') as fh:
            fh.write(f'{socket.gethostname()}-{os.urandom(3).hex()}')
    return open(f).read().strip()


def decide(lock, me, window, stale):
    if not lock:
        return 'claim', 'no lock yet'
    t = now()
    if lock.get('status') == 'done':
        fin = parse(lock['updated']).astimezone(IST).date()
        if (t.astimezone(IST).date() - fin).days <= window:
            return 'stop', f"done {lock['updated']} by {lock.get('owner')}"
        return 'claim', 'previous run done, new window'
    age = (t - parse(lock['updated'])).total_seconds() / 60
    if lock.get('owner') == me:
        return 'claim', 'already mine'
    if age < stale:
        return 'stop', f"in progress by {lock.get('owner')}, heartbeat {age:.0f} min ago"
    return 'takeover', f"stale ({age:.0f} min) run by {lock.get('owner')}"


def start(job, window, stale):
    me = owner()
    for _ in range(4):
        sync()
        lock = read(job)
        verdict, why = decide(lock, me, window, stale)
        if verdict == 'stop':
            print(f'STOP {job}: {why}')
            return 3
        if why == 'already mine' and lock.get('status') == 'in_progress':
            print(f'OK {job}: already claimed by {me}, carry on')
            return 0
        hist = (lock or {}).get('history', [])
        if verdict == 'takeover':
            hist = (hist + [{k: lock.get(k) for k in ('owner', 'started', 'updated', 'status', 'note')}])[-10:]
        new = {'job': job, 'status': 'in_progress', 'owner': me,
               'started': lock['started'] if lock and lock.get('owner') == me and lock.get('status') == 'in_progress'
                          else iso(now()),
               'updated': iso(now()), 'note': (lock or {}).get('note', '') if verdict == 'takeover' else '',
               'history': hist}
        if push(job, new, f'Claim {job} ({verdict}) by {me}'):
            print(f'OK {job}: claimed by {me} ({why})')
            return 0
    print(f'STOP {job}: lost the race 4 times, another run is claiming it')
    return 3


def touch(job, status, note):
    me = owner()
    for _ in range(4):
        sync()
        lock = read(job)
        if not lock or lock.get('owner') != me:
            print(f'STOP {job}: not mine any more (owner {lock and lock.get("owner")}). Stop working.')
            return 3
        lock.update(updated=iso(now()), status=status)
        if note is not None:
            lock['note'] = note
        if push(job, lock, f'{"Finish" if status == "done" else "Heartbeat"} {job} by {me}'):
            print(f'OK {job}: {status} {lock["updated"]}')
            return 0
    print(f'WARN {job}: could not push the heartbeat; retry later')
    return 1


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cmd', choices=['start', 'beat', 'done', 'status'])
    ap.add_argument('job', nargs='?')
    ap.add_argument('--window', type=int, default=1, help='days a "done" lock blocks new runs (default 1)')
    ap.add_argument('--stale', type=int, default=90, help='minutes before an in_progress lock counts as dead')
    ap.add_argument('--note', help='short progress note saved in the lock (e.g. "ids 56-62 pushed")')
    a = ap.parse_args()
    if a.cmd == 'status':
        sync()
        names = git('ls-tree', '--name-only', 'origin/main', 'locks/', check=False).stdout.split()
        for n in names:
            job = os.path.basename(n)[:-5]
            if not a.job or job == a.job:
                l = read(job)
                print(f"{l['job']}: {l['status']} by {l.get('owner')} updated {l['updated']} {l.get('note', '')}")
        return 0
    if not a.job:
        ap.error('job name needed')
    if a.cmd == 'start':
        return start(a.job, a.window, a.stale)
    return touch(a.job, 'done' if a.cmd == 'done' else 'in_progress', a.note)


if __name__ == '__main__':
    sys.exit(main())
