#!/usr/bin/env python3
"""Post the new-style Elites Endgame reels to YouTube as Shorts, in dioramareels/schedule.json "queue" order.

Usage: python3 tools/elite_youtube.py [--dry-run]

Each run looks for the next posting time within 5 hours. If that time has no reel yet, it takes the next reel in the queue
from its diorama-<id> Release and uploads it scheduled for that exact time. Nothing goes out while schedule.json has "paused".
Environment: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (the workflow fills these from the YT_ELITE_* secrets), GH_TOKEN.
"""
import argparse, datetime as dt, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import youtube_publish as yt  # noqa: E402

HOME = os.path.join(ROOT, 'dioramareels')
LOG = os.path.join(HOME, 'youtube_posted.json')
IST = dt.timedelta(hours=5, minutes=30)
yt.CATEGORY = '24'


def texts(rid):
    meta = json.load(open(os.path.join(HOME, 'reels', rid, 'meta.json'), encoding='utf-8'))
    tags = [t.lstrip('#') for t in meta.get('hashtags', [])]
    title = meta['title'].strip()
    if len(title) + 8 <= 100:
        title += ' #shorts'
    return title, meta['caption'].strip() + '\n\n' + ' '.join('#' + t for t in tags) + ' #shorts', ['shorts'] + tags


def has_video(rid):
    import requests
    try:
        return requests.head(f"https://github.com/{os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')}/releases/download/diorama-{rid}/{rid}.mp4", allow_redirects=False, timeout=30).status_code in (200, 302)
    except Exception:
        return False


def next_slot(times, now, taken=()):
    best = None
    for d in (0, 1):
        day = (now + IST).date() + dt.timedelta(days=d)
        for s in times:
            h, m = map(int, s.split(':'))
            t = dt.datetime.combine(day, dt.time(h, m)) - IST
            if now < t <= now + dt.timedelta(hours=5) and t.strftime('%Y-%m-%dT%H:%MZ') not in taken and (best is None or t < best):
                best = t
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    cfg = json.load(open(os.path.join(HOME, 'schedule.json'), encoding='utf-8'))
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    todo = [r for r in cfg['queue'] if r not in log]
    tok = yt.token()  # stops with a clear message if the sign-in fails
    print('YouTube sign-in OK')
    print(f"reels left in the queue: {len(todo)}. Next: {todo[:3]}")
    if a.dry_run:
        for rid in todo:
            print(f'{rid}: would upload "{texts(rid)[0]}"')
        print('dry run: nothing posted')
        return
    if cfg.get('paused'):
        print(f"::notice::Elites Endgame YouTube is paused: {cfg['paused']}")
        return
    now = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)
    slot = next_slot(cfg['times_ist'], now, {v.get('slot') for v in log.values()})
    if not slot or not todo:
        print('no posting time within 5 hours, or the queue is empty')
        return
    key = slot.strftime('%Y-%m-%dT%H:%MZ')
    if any(v.get('slot') == key for v in log.values()):
        print(f'{key} already has a reel')
        return
    ready = [r for r in todo if has_video(r)]  # a reel whose render isn't finished yet waits; the next ready one goes
    if not ready:
        print('no rendered reel in the queue yet')
        return
    rid = ready[0]
    out = os.path.join(ROOT, 'out', rid)
    os.makedirs(out, exist_ok=True)
    subprocess.run(['gh', 'release', 'download', 'diorama-' + rid, '-p', '*.mp4', '-D', out, '--clobber'], check=True)
    title, desc, tags = texts(rid)
    vid, _ = yt.upload(tok, os.path.join(out, rid + '.mp4'), title, desc, tags, slot, lang='en', category='24')  # Entertainment (was Science & Tech)
    log[rid] = {'id': vid, 'url': f'https://youtu.be/{vid}', 'title': title, 'slot': key}
    json.dump(log, open(LOG, 'w'), indent=1)
    print(f'{rid}: https://youtu.be/{vid}, goes public at {key}')


if __name__ == '__main__':
    main()
