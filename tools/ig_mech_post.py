#!/usr/bin/env python3
"""Post the Gears & Glitches Shorts (mechreels) to Instagram as Reels, at the same slots as on YouTube.

Usage: python3 tools/ig_mech_post.py [--dry-run] [--id 05-comet-square-windows]

Reads schedule.json (the same plan the YouTube publisher uses): each day's Shorts go out at times.shorts (IST).
A run picks the first Short whose slot is between 3 hours ago and 40 minutes from now, has a Release
"mechreel-<id>" and is not yet in ig_posted.json. It uploads the MP4 from that Release, waits for Instagram to
process it, then publishes on the exact minute of the slot. One Reel per run. Slots missed by more than 3 hours
are not posted late (use --id to post one by hand).

Caption: the Short's title, its meta.json caption with "Full video: [LINK]" turned into the YouTube link of the
day's video (from youtube_posted.json) plus "link in bio", and its hashtags (#shorts swapped for #reels).
Before publishing it checks the account's recent posts for the same title, so a re-run never posts twice.

Environment: IG_GG_ACCESS_TOKEN, IG_GG_USER_ID (the Gears & Glitches Instagram account, Instagram API with
Instagram Login), GITHUB_REPOSITORY. Without the token it explains what is missing and exits cleanly.
"""
import argparse, datetime as dt, json, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHED, YT_LOG, LOG = (os.path.join(ROOT, f) for f in ('schedule.json', 'youtube_posted.json', 'ig_posted.json'))
API = 'https://graph.instagram.com/' + json.load(open(os.path.join(ROOT, 'config.json'))).get('instagram', {}).get('api_version', 'v26.0')
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')


def slot_utc(date, hhmm, off):
    sign = 1 if off[0] == '+' else -1
    oh, om = map(int, off[1:].split(':'))
    return (dt.datetime.fromisoformat(f'{date}T{hhmm}:00') - sign * dt.timedelta(hours=oh, minutes=om)).replace(tzinfo=dt.timezone.utc)


def plan():
    s = json.load(open(SCHED)); off = s.get('timezone_offset', '+05:30'); times = s['times']['shorts']
    return [(slot_utc(d['date'], times[i % len(times)], off), sid, d['video']) for d in s['days'] for i, sid in enumerate(d['shorts'])]


def api(method, path, **data):
    import requests
    h = {'Authorization': 'Bearer ' + os.environ['IG_GG_ACCESS_TOKEN']}
    r = requests.request(method, API + path, headers=h, json=data if method == 'POST' else None, params=data if method == 'GET' else None, timeout=120)
    j = r.json() if r.headers.get('content-type', '').startswith(('application/json', 'text/javascript')) else {'raw': r.text}
    if r.status_code != 200 or 'error' in j:
        raise RuntimeError(f'{method} {path} -> {r.status_code} {json.dumps(j)[:600]}')
    return j


def video_url(sid):
    """The Release asset URL, resolved past GitHub's redirect to the direct file link Instagram can fetch."""
    import requests
    url = f'https://github.com/{REPO}/releases/download/mechreel-{sid}/{sid}.mp4'
    r = requests.get(url, stream=True, timeout=60, allow_redirects=True)
    r.close()
    return (r.url if r.status_code == 200 else None), r.status_code, r.headers.get('content-length')


def caption(sid, vid):
    meta = json.load(open(os.path.join(ROOT, 'mechreels', 'reels', sid, 'meta.json')))
    yt = json.load(open(YT_LOG)).get('mechvideo-' + vid, {}) if os.path.exists(YT_LOG) else {}
    link = yt.get('url')
    full = f'Full video on YouTube: {link} (link in bio)' if link else 'Full video on our YouTube channel (link in bio)'
    body = meta['caption'].strip().replace('Full video: [LINK]', full)
    tags = [t.lstrip('#') for t in meta.get('hashtags', []) if t.lstrip('#') != 'shorts'] + ['reels']
    return f"{meta['title']}\n\n{body}\n\n" + ' '.join('#' + t for t in tags), meta['title']


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--id')
    a = ap.parse_args()
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    now = dt.datetime.now(dt.timezone.utc)
    items = plan()
    if a.id:
        pick = next(((s, i, v) for s, i, v in items if i == a.id), None) or sys.exit(f'{a.id} is not in schedule.json')
        pick = (now, pick[1], pick[2])
    else:
        due = [(s, i, v) for s, i, v in items if i not in log and now - dt.timedelta(hours=3) <= s <= now + dt.timedelta(minutes=40)]
        if not due:
            nxt = next(((s, i) for s, i, v in sorted(items) if i not in log and s > now), None)
            print('no Short due now' + (f'; next: {nxt[1]} at {nxt[0]:%Y-%m-%d %H:%M} UTC' if nxt else '; nothing left in schedule.json'))
            return
        pick = sorted(due)[0]
    slot, sid, vid = pick
    cap, title = caption(sid, vid)
    url, code, size = video_url(sid)
    print(f'{sid}: slot {slot:%Y-%m-%d %H:%M} UTC\nvideo: HTTP {code}, {size} bytes\ncaption:\n{cap}\n')
    if not url:
        print(f'::warning::{sid} has no rendered Release yet (mechreel-{sid}); will try again next run'); return
    if not os.environ.get('IG_GG_ACCESS_TOKEN') or not os.environ.get('IG_GG_USER_ID'):
        print('::notice::Instagram is not connected yet: add the IG_GG_ACCESS_TOKEN and IG_GG_USER_ID repository secrets. Nothing posted.'); return
    me = api('GET', '/me', fields='user_id,username')
    print(f"posting as @{me.get('username')}")
    if a.dry_run:
        return
    ig = os.environ['IG_GG_USER_ID']
    # never post the same Short twice: look for its title among the latest posts
    recent = api('GET', f'/{ig}/media', fields='id,caption,timestamp', limit=25).get('data', [])
    dup = next((m for m in recent if (m.get('caption') or '').startswith(title)), None)
    if dup:
        print(f'{sid} is already on Instagram (media {dup["id"]}); recording it')
        log[sid] = {'media_id': dup['id'], 'posted_at': dup.get('timestamp', now.isoformat(timespec='seconds'))}
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
            raise RuntimeError(f'Instagram could not process {sid} ({st})')
    else:
        raise RuntimeError('Instagram did not finish processing the video in time')
    wait = (slot - dt.datetime.now(dt.timezone.utc)).total_seconds()
    if wait > 0:
        print(f'ready; publishing at {slot:%H:%M} UTC (in {wait:.0f} s)', flush=True); time.sleep(wait)
    m = api('POST', f'/{ig}/media_publish', creation_id=cid)
    log[sid] = {'media_id': m['id'], 'posted_at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')}
    json.dump(log, open(LOG, 'w'), indent=1)
    print(f'published {sid} -> media {m["id"]}')


if __name__ == '__main__':
    main()
