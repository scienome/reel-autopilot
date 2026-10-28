#!/usr/bin/env python3
"""Post the next reel in the queue to Instagram (Instagram API with Instagram Login).

Usage: python3 tools/post.py [--dry-run] [--reel <id>]

The queue is every reels/<id> folder (in name order) that has out/<id>.mp4 on the main branch and is not yet in
posted.json. The video must be publicly reachable, so the repo is public and the URL is the raw GitHub file.
Environment: IG_ACCESS_TOKEN, IG_USER_ID, GITHUB_REPOSITORY (set by Actions), POST_BRANCH (default main).
Caption: reels/<id>/meta.json -> caption + hashtags. Appends the result to posted.json.
"""
import argparse, datetime, glob, json, os, sys, time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from first_comment import first_comment, post_first_comment  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = json.load(open(os.path.join(ROOT, 'config.json')))
API = 'https://graph.instagram.com/' + CFG['instagram'].get('api_version', 'v26.0')
LOG = os.path.join(ROOT, 'posted.json')


def queue():
    done = {p['id'] for p in json.load(open(LOG))} if os.path.exists(LOG) else set()
    ids = [os.path.basename(p) for p in sorted(glob.glob(os.path.join(ROOT, 'reels', '*')))]
    return [i for i in ids if i not in done and os.path.exists(os.path.join(ROOT, 'out', i + '.mp4'))]


def caption_for(rid):
    mp = os.path.join(ROOT, 'reels', rid, 'meta.json')
    meta = json.load(open(mp)) if os.path.exists(mp) else {}
    tags = meta.get('hashtags') or CFG['instagram'].get('default_hashtags', [])
    cap = meta.get('caption', '').strip()
    return (cap + '\n\n' + ' '.join('#' + t.lstrip('#') for t in tags)).strip()


def api(method, path, **data):
    import requests
    h = {'Authorization': 'Bearer ' + os.environ['IG_ACCESS_TOKEN']}
    r = requests.request(method, API + path, headers=h, json=data if method == 'POST' else None, params=data if method == 'GET' else None, timeout=120)
    j = r.json() if r.headers.get('content-type', '').startswith(('application/json', 'text/javascript')) else {'raw': r.text}
    if r.status_code != 200 or 'error' in j:
        raise RuntimeError(f'{method} {path} -> {r.status_code} {json.dumps(j)[:600]}')
    return j


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--reel')
    ap.add_argument('--at', help='publish slots in UTC, e.g. 07:30,14:30: upload early, then publish exactly on the slot')
    a = ap.parse_args()
    target = None
    if a.at and not a.dry_run:
        now = datetime.datetime.now(datetime.timezone.utc)
        slots = []
        for s in a.at.split(','):
            hh, mm = map(int, s.split(':'))
            for day in (0, 1):  # today's and tomorrow's slots: runs start up to 4 hours early, across midnight
                slots.append(now.replace(hour=hh, minute=mm, second=0, microsecond=0) + datetime.timedelta(days=day))
        # the slot this run belongs to: the next one within 4 h 15 min (runs start 4, 3 and 2 hours early because
        # GitHub starts scheduled runs up to ~2 hours late), or one that passed less than 90 minutes ago (a very late run)
        cands = [s for s in sorted(slots) if now - datetime.timedelta(minutes=90) < s <= now + datetime.timedelta(minutes=255)]
        if not cands:
            print('no posting slot near now; nothing to do'); return
        target = cands[0]
        log = json.load(open(LOG)) if os.path.exists(LOG) else []
        if any(datetime.datetime.fromisoformat(p['posted_at']) > target - datetime.timedelta(hours=3) for p in log):
            print(f'already posted for the {target:%H:%M} UTC slot (backup run): nothing to do'); return
        print(f'slot {target:%H:%M} UTC; publishing exactly then')
    q = queue()
    rid = a.reel or (q[0] if q else None)
    if not rid:
        print('::error::The queue is empty: no rendered reels left to post. Merge the next weekly batch.')
        sys.exit(1)
    repo, branch = os.environ.get('GITHUB_REPOSITORY', 'OWNER/REPO'), os.environ.get('POST_BRANCH', 'main')
    url = f'https://raw.githubusercontent.com/{repo}/{branch}/out/{rid}.mp4'
    cap = caption_for(rid)
    print(f'next reel: {rid}  ({len(q)} in queue)\nvideo: {url}\ncaption:\n{cap}\nfirst comment: {first_comment("couch", rid, os.path.join(ROOT, "reels", rid, "meta.json"))}\n')
    if a.dry_run:
        # check everything short of posting: the token, the account, and that the video link downloads
        import requests
        if os.environ.get('IG_ACCESS_TOKEN'):
            me = api('GET', '/me', fields='user_id,username')
            print(f"token OK: @{me.get('username')} (id {me.get('user_id')}, secret IG_USER_ID {'matches' if str(me.get('user_id')) == os.environ.get('IG_USER_ID') else 'DOES NOT MATCH'})")
        r = requests.get(url, stream=True, timeout=60)
        print(f'video link: HTTP {r.status_code}, {r.headers.get("content-length")} bytes, {r.headers.get("content-type")}')
        if r.status_code != 200:
            sys.exit('the video link does not download')
        return
    ig = os.environ['IG_USER_ID']
    c = api('POST', f'/{ig}/media', media_type='REELS', video_url=url, caption=cap, share_to_feed=True)
    cid = c['id']; print('container', cid)
    for _ in range(30):  # up to ~10 minutes
        time.sleep(20)
        st = api('GET', f'/{cid}', fields='status_code,status').get('status_code')
        print('status', st)
        if st == 'FINISHED':
            break
        if st in ('ERROR', 'EXPIRED'):
            raise RuntimeError(f'Instagram could not process the video ({st}). Check that the repo is public and {url} downloads.')
    else:
        raise RuntimeError('Instagram did not finish processing the video in time')
    if target:
        wait = (target - datetime.datetime.now(datetime.timezone.utc)).total_seconds()
        if wait > 0:
            print(f'video ready; waiting {wait:.0f} s to publish at {target:%H:%M:%S} UTC', flush=True); time.sleep(wait)
    m = api('POST', f'/{ig}/media_publish', creation_id=cid)
    log = json.load(open(LOG)) if os.path.exists(LOG) else []
    log.append({'id': rid, 'media_id': m['id'], 'posted_at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')})
    json.dump(log, open(LOG, 'w'), indent=1)
    print('published', rid, 'media', m['id'], f'({len(q) - 1} left in queue)')
    post_first_comment(api, m['id'], first_comment('couch', rid, os.path.join(ROOT, 'reels', rid, 'meta.json')))
    if len(q) - 1 <= 2:
        print(f'::warning::Only {len(q) - 1} reels left in the queue.')


if __name__ == '__main__':
    main()
