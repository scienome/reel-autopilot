#!/usr/bin/env python3
"""Post the Gears & Glitches Dave reels (davereels) to Instagram as Reels.

Usage: python3 tools/ig_mech_post.py [--dry-run] [--id 02-hitler-maus-tank]

Reads davereels/schedule.json: each day's reels go out at times[0..2] (IST); a null slot posts nothing.
A run picks the first reel whose slot is between 3 hours ago and 100 minutes from now, has a Release
"davereel-<id>" and is not yet in ig_posted.json. It uploads the MP4 from that Release, waits for Instagram to
process it, then publishes on the exact minute of the slot. One Reel per run. Slots missed by more than 3 hours
are not posted late (use --id to post one by hand; --id takes any reel folder in davereels/reels and posts it now).

Caption: the reel's meta.json caption (no title line, no YouTube link) and its hashtags. If a caption still has
"[LINK]" in it (optional), that line is dropped. Before publishing it checks the account's recent posts for the
same first caption line, so a re-run never posts twice.

Environment: IG_GG_ACCESS_TOKEN, IG_GG_USER_ID (the Gears & Glitches Instagram account, Instagram API with
Instagram Login), GITHUB_REPOSITORY. Without the token it explains what is missing and exits cleanly.
"""
import argparse, datetime as dt, json, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REELS = os.path.join(ROOT, 'davereels', 'reels')
SCHED, LOG = os.path.join(ROOT, 'davereels', 'schedule.json'), os.path.join(ROOT, 'ig_posted.json')
API = 'https://graph.instagram.com/' + json.load(open(os.path.join(ROOT, 'config.json'))).get('instagram', {}).get('api_version', 'v26.0')
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')
TAG = 'davereel-'


def slot_utc(date, hhmm, off):
    sign = 1 if off[0] == '+' else -1
    oh, om = map(int, off[1:].split(':'))
    return (dt.datetime.fromisoformat(f'{date}T{hhmm}:00') - sign * dt.timedelta(hours=oh, minutes=om)).replace(tzinfo=dt.timezone.utc)


def plan():
    s = json.load(open(SCHED)); off = s.get('timezone_offset', '+05:30'); times = s['times']
    return [(slot_utc(d['date'], times[i], off), rid) for d in s['days'] for i, rid in enumerate(d['reels']) if rid]


def api(method, path, **data):
    import requests
    h = {'Authorization': 'Bearer ' + os.environ['IG_GG_ACCESS_TOKEN']}
    r = requests.request(method, API + path, headers=h, json=data if method == 'POST' else None, params=data if method == 'GET' else None, timeout=120)
    j = r.json() if r.headers.get('content-type', '').startswith(('application/json', 'text/javascript')) else {'raw': r.text}
    if r.status_code != 200 or 'error' in j:
        raise RuntimeError(f'{method} {path} -> {r.status_code} {json.dumps(j)[:600]}')
    return j


def video_url(rid):
    """The Release asset URL, resolved past GitHub's redirect to the direct file link Instagram can fetch."""
    import requests
    url = f'https://github.com/{REPO}/releases/download/{TAG}{rid}/{rid}.mp4'
    r = requests.get(url, stream=True, timeout=60, allow_redirects=True)
    r.close()
    return (r.url if r.status_code == 200 else None), r.status_code, r.headers.get('content-length')


def caption(rid):
    meta = json.load(open(os.path.join(REELS, rid, 'meta.json')))
    body = '\n'.join(l for l in meta['caption'].strip().split('\n') if '[LINK]' not in l)
    tags = ' '.join('#' + t.lstrip('#') for t in meta.get('hashtags', []))
    return f'{body}\n\n{tags}', body.split('\n')[0]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--id')
    a = ap.parse_args()
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    now = dt.datetime.now(dt.timezone.utc)
    items = plan()
    if a.id:
        if not os.path.exists(os.path.join(REELS, a.id, 'meta.json')):
            sys.exit(f'{a.id} is not a reel in davereels/reels')
        pick = (now, a.id)
    else:
        due = [(s, i) for s, i in items if i not in log and now - dt.timedelta(hours=3) <= s <= now + dt.timedelta(minutes=100)]
        if not due:
            nxt = next(((s, i) for s, i in sorted(items) if i not in log and s > now), None)
            print('no reel due now' + (f'; next: {nxt[1]} at {nxt[0]:%Y-%m-%d %H:%M} UTC' if nxt else '; nothing left in davereels/schedule.json'))
            return
        pick = sorted(due)[0]
    slot, rid = pick
    cap, key = caption(rid)
    url, code, size = video_url(rid)
    print(f'{rid}: slot {slot:%Y-%m-%d %H:%M} UTC\nvideo: HTTP {code}, {size} bytes\ncaption:\n{cap}\n')
    if not url:
        print(f'::warning::{rid} has no rendered Release yet ({TAG}{rid}); will try again next run'); return
    if not os.environ.get('IG_GG_ACCESS_TOKEN') or not os.environ.get('IG_GG_USER_ID'):
        print('::notice::Instagram is not connected yet: add the IG_GG_ACCESS_TOKEN and IG_GG_USER_ID repository secrets. Nothing posted.'); return
    me = api('GET', '/me', fields='user_id,username')
    print(f"posting as @{me.get('username')}")
    if a.dry_run:
        return
    ig = os.environ['IG_GG_USER_ID']
    # never post the same reel twice: look for its first caption line among the latest posts
    recent = api('GET', f'/{ig}/media', fields='id,caption,timestamp', limit=25).get('data', [])
    dup = next((m for m in recent if (m.get('caption') or '').startswith(key)), None)
    if dup:
        print(f'{rid} is already on Instagram (media {dup["id"]}); recording it')
        log[rid] = {'media_id': dup['id'], 'posted_at': dup.get('timestamp', now.isoformat(timespec='seconds'))}
        json.dump(log, open(LOG, 'w'), indent=1); return
    c = api('POST', f'/{ig}/media', media_type='REELS', video_url=url, caption=cap, share_to_feed=True)
    cid = c['id']; print('container', cid)
    for _ in range(40):  # up to ~13 minutes
        time.sleep(20)
        st = api('GET', f'/{cid}', fields='status_code,status').get('status_code')
        print('status', st, flush=True)
        if st == 'FINISHED':
            break
        if st in ('ERROR', 'EXPIRED'):
            raise RuntimeError(f'Instagram could not process {rid} ({st})')
    else:
        raise RuntimeError('Instagram did not finish processing the video in time')
    wait = (slot - dt.datetime.now(dt.timezone.utc)).total_seconds()
    if wait > 0:
        print(f'ready; publishing at {slot:%H:%M} UTC (in {wait:.0f} s)', flush=True); time.sleep(wait)
    m = api('POST', f'/{ig}/media_publish', creation_id=cid)
    log[rid] = {'media_id': m['id'], 'posted_at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')}
    json.dump(log, open(LOG, 'w'), indent=1)
    print(f'published {rid} -> media {m["id"]}')


if __name__ == '__main__':
    main()
