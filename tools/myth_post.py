#!/usr/bin/env python3
"""Post the Hindi mythology reels (mythreels/) to Instagram AND YouTube at the same moment.

Usage: python3 tools/myth_post.py [--dry-run] [--now] [--id 002-ravan-shani]

Same pattern as tools/toy_post.py, with two differences. Reels go out STRICTLY in mythreels/schedule.json "queue" order
(they are numbered parts of a series, so there is no best_for_slot reordering, and an unrendered reel holds the queue).
Slots before "start_at" in schedule.json never count, so a new or resumed queue doesn't post missed slots.
Add "paused": "reason" to schedule.json to stop posting.

A run looks for an unused slot between 3 hours ago and 4 h 15 min from now, uploads the Short scheduled for the slot,
uploads the Reel, waits, and publishes it on the minute. Everything is recorded in mythreels/posted.json.

Environment: IG_MYTH_ACCESS_TOKEN, IG_MYTH_USER_ID and YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (the workflow
fills these from the YT_MYTH_* secrets), GH_TOKEN, GITHUB_REPOSITORY.
"""
import argparse, datetime as dt, json, os, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import youtube_publish as yt  # noqa: E402
from first_comment import first_comment, post_first_comment, guard_slot  # noqa: E402

MYTH = os.path.join(ROOT, 'mythreels')
REELS, LOG, CONF = os.path.join(MYTH, 'reels'), os.path.join(MYTH, 'posted.json'), os.path.join(MYTH, 'schedule.json')
API = 'https://graph.instagram.com/' + json.load(open(os.path.join(ROOT, 'config.json'))).get('instagram', {}).get('api_version', 'v26.0')
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')
TAG = 'mythreel-'
OFFSET = '+05:30'
yt.CATEGORY = '27'  # Education
UTC = dt.timezone.utc


def now():
    return dt.datetime.now(UTC).replace(tzinfo=None)


def save(log):
    json.dump(log, open(LOG, 'w'), indent=1)


def slots_around(t, conf):
    """Every posting slot (naive UTC) from yesterday to tomorrow, none before start_at."""
    start = dt.datetime.strptime(conf['start_at'], '%Y-%m-%dT%H:%MZ')
    out = []
    for d in (-1, 0, 1):
        day = (t + dt.timedelta(hours=5, minutes=30) + dt.timedelta(days=d)).date().isoformat()
        out += [yt.slot_utc(day, hhmm, OFFSET) for hhmm in conf['times_ist']]
    return sorted(s for s in out if s >= start)


def rendered(rid):
    import requests
    r = requests.get(f'https://github.com/{REPO}/releases/download/{TAG}{rid}/{rid}.mp4', stream=True, timeout=60)
    r.close()
    return r.url if r.status_code == 200 else None


def texts(rid):
    meta = json.load(open(os.path.join(REELS, rid, 'meta.json'), encoding='utf-8'))
    tags = [t.lstrip('#') for t in meta.get('hashtags', [])]
    body = meta['caption'].strip()
    title = meta['title'].strip()
    if len(title) + 8 <= 100:
        title += ' #shorts'
    ig_cap = body + '\n\n' + ' '.join('#' + t for t in tags)
    yt_desc = body + '\n\n' + ' '.join('#' + t for t in tags) + ' #shorts'
    return title, yt_desc, ['shorts'] + tags, ig_cap, body.split('\n')[0]


# ---------------------------------------------------------------- Instagram

def ig_api(method, path, **data):
    import requests
    h = {'Authorization': 'Bearer ' + os.environ['IG_MYTH_ACCESS_TOKEN']}
    r = requests.request(method, API + path, headers=h, json=data if method == 'POST' else None,
                         params=data if method == 'GET' else None, timeout=120)
    j = r.json() if r.headers.get('content-type', '').startswith(('application/json', 'text/javascript')) else {'raw': r.text}
    if r.status_code != 200 or 'error' in j:
        raise RuntimeError(f'{method} {path} -> {r.status_code} {json.dumps(j)[:600]}')
    return j


def ig_post(rid, url, cap, key, at):
    ig = os.environ['IG_MYTH_USER_ID']
    recent = ig_api('GET', f'/{ig}/media', fields='id,caption,timestamp', limit=25).get('data', [])
    dup = next((m for m in recent if (m.get('caption') or '').startswith(key)), None)
    if dup:
        print(f'{rid} is already on Instagram (media {dup["id"]}); recording it')
        return {'media_id': dup['id'], 'posted_at': dup.get('timestamp')}
    cid = ig_api('POST', f'/{ig}/media', media_type='REELS', video_url=url, caption=cap, share_to_feed=True)['id']
    print('Instagram container', cid, flush=True)
    for _ in range(40):  # up to ~13 minutes
        time.sleep(20)
        st = ig_api('GET', f'/{cid}', fields='status_code,status').get('status_code')
        print('Instagram status', st, flush=True)
        if st == 'FINISHED':
            break
        if st in ('ERROR', 'EXPIRED'):
            raise RuntimeError(f'Instagram could not process {rid} ({st})')
    else:
        raise RuntimeError('Instagram did not finish processing the video in time')
    wait = (at - now()).total_seconds()
    if wait > 0:
        print(f'Instagram ready; publishing at {at:%H:%M} UTC (in {wait:.0f} s)', flush=True)
        time.sleep(wait)
    guard_slot(ig_api, ig)
    m = ig_api('POST', f'/{ig}/media_publish', creation_id=cid)
    print(f'Instagram: published {rid} -> media {m["id"]}')
    post_first_comment(ig_api, m['id'], first_comment('myth', rid, os.path.join(REELS, rid, 'meta.json')))
    return {'media_id': m['id'], 'posted_at': dt.datetime.now(UTC).isoformat(timespec='seconds')}


# ---------------------------------------------------------------- YouTube

def yt_post(tok, rid, title, desc, tags, at):
    d = tempfile.mkdtemp()
    if not yt.release_assets(TAG + rid, d):
        raise RuntimeError(f'could not download Release {TAG}{rid}')
    yid, st = yt.upload(tok, os.path.join(d, rid + '.mp4'), title, desc, tags, at, yt.localized('myth', rid, desc))
    if os.path.exists(os.path.join(d, 'cover.jpg')):
        try:
            yt.set_thumb(tok, yid, os.path.join(d, 'cover.jpg'))
        except Exception as e:  # custom thumbnails need a verified channel; the Short still posts
            print(f'::notice::thumbnail not set ({str(e)[:120]})')
    print(f'YouTube: https://youtu.be/{yid} ({st["privacyStatus"]}{", goes public " + st["publishAt"] if "publishAt" in st else ""})')
    return {'id': yid, 'url': f'https://youtu.be/{yid}', 'publish_utc': st.get('publishAt', 'now'), 'title': title}


# ---------------------------------------------------------------- both

def post(rid, at, log, tok, slot_key):
    """Put reel rid on whichever platform it is still missing from, going live at `at`."""
    title, desc, tags, ig_cap, key = texts(rid)
    url = rendered(rid)
    if not url:
        raise RuntimeError(f'{rid} has no Release {TAG}{rid}')
    e = log.setdefault(rid, {})
    if slot_key and 'slot' not in e:
        e['slot'] = slot_key
    save(log)
    err = None
    if 'youtube' not in e:  # YouTube first: it schedules itself for `at`, so it can go up early
        try:
            e['youtube'] = yt_post(tok, rid, title, desc, tags, at)
            save(log)
        except RuntimeError as x:
            if any(k in str(x) for k in ('quotaExceeded', 'uploadLimitExceeded', 'rateLimitExceeded')):
                print(f'::warning::YouTube upload quota used up; {rid} will go to YouTube on the next run.')
            else:
                print(f'::error::YouTube failed for {rid}: {str(x)[:400]}')
            err = x
    if 'instagram' not in e:
        try:
            e['instagram'] = ig_post(rid, url, ig_cap, key, at)
            save(log)
        except RuntimeError as x:
            print(f'::error::Instagram failed for {rid}: {str(x)[:400]}')
            err = err or x
    return err


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--now', action='store_true', help='post the next reel straight away')
    ap.add_argument('--id', help='post this reel straight away')
    a = ap.parse_args()
    conf = json.load(open(CONF, encoding='utf-8'))
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    t = now()
    if conf.get('paused') and not a.dry_run:
        print(f'paused: {conf["paused"]}')
        return

    ids = conf['queue']
    half = [r for r in ids if r in log and not ('instagram' in log[r] and 'youtube' in log[r])]
    queue = [r for r in ids if r not in log]

    slot = None
    if a.id:
        if a.id not in ids:
            sys.exit(f'{a.id} is not in mythreels/schedule.json')
    elif not a.now:
        used = {e.get('slot') for e in log.values()}
        due = [s for s in slots_around(t, conf) if t - dt.timedelta(hours=3) <= s <= t + dt.timedelta(minutes=255)
               and s.strftime('%Y-%m-%dT%H:%MZ') not in used]
        slot = due[0] if due else None
        if not slot and not half and not a.dry_run:
            nxt = next((s for s in slots_around(t, conf) if s > t), None)
            print(f'no slot due now; next slot {nxt:%Y-%m-%d %H:%M} UTC; {len(queue)} reel(s) waiting' if nxt else 'no slot due now')
            return

    pick = a.id or (queue[0] if queue else None)
    held = bool(pick and not a.id and not rendered(pick))  # keeps the parts in order
    at = slot or t
    print(f'unfinished: {half or "none"}\nnext reel: {pick or "NONE - queue is empty"}{" (HELD: no Release yet)" if held else ""}\n'
          f'goes live: {f"{slot:%Y-%m-%d %H:%M} UTC" if slot else "now" if (a.now or a.id) else "at the next slot"}\n'
          f'waiting after it: {max(len(queue) - 1, 0)}')
    if pick:
        print('---\n' + texts(pick)[3] + '\n---\nfirst comment: ' + str(first_comment('myth', pick, os.path.join(REELS, pick, 'meta.json'))))

    need = ['IG_MYTH_ACCESS_TOKEN', 'IG_MYTH_USER_ID', 'YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN']
    missing = [k for k in need if not os.environ.get(k)]
    if missing:
        print(f'::notice::Mythology reels are not connected yet (missing: {", ".join(missing)}). Nothing posted.')
        return
    me = ig_api('GET', '/me', fields='user_id,username')
    print(f"Instagram: posting as @{me.get('username')}")
    tok = yt.token()
    if a.dry_run:
        print('YouTube sign-in OK (channel name not readable with the upload-only permission)')
        print('dry run: nothing posted')
        return

    errs = []
    for rid in half:  # a reel that made it to only one platform: finish it now
        print(f'finishing {rid} on the platform it is missing from')
        own = log[rid].get('slot')
        own = dt.datetime.strptime(own, '%Y-%m-%dT%H:%MZ') if own else t
        errs.append(post(rid, max(t, own), log, tok, None))
    if held:
        print(f'::warning::{pick} has no Release yet, so this slot is skipped to keep the parts in order.')
    elif pick and (slot or a.now or a.id):
        errs.append(post(pick, at, log, tok, slot.strftime('%Y-%m-%dT%H:%MZ') if slot else None))
    elif not pick and slot:
        print('::warning::The mythology queue is empty: no reel left to post.')
    if any(errs):
        sys.exit(1)


if __name__ == '__main__':
    main()
