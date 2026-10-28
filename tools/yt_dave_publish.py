#!/usr/bin/env python3
"""Upload the Dave reels (davereels) to YouTube as Shorts, scheduled for the same slots as on Instagram.

Usage: python3 tools/yt_dave_publish.py [--dry-run] [--only ID]

Reads davereels/schedule.json (08:30 / 12:30 / 20:30 IST, null = no slot). Each reel is uploaded from its Release
"davereel-<id>" and set to go public at its slot (YouTube publishes it then); a slot already in the past goes public
straight away. Reels listed in "posted_by_hand" (posted early on Instagram) go public straight away too.
Earliest slots first. Title, description and tags come from the reel's meta.json, with #shorts added.
Uploads are recorded in davereels/youtube_posted.json, so nothing is uploaded twice.

If YouTube's daily upload quota runs out, the run stops cleanly and
the next run (every 2 hours) carries on, earliest slot first.

Uses the same sign-in and upload code as tools/youtube_publish.py (YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN,
GH_TOKEN), so Shorts land on the same channel.
"""
import argparse, datetime as dt, json, os, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from youtube_publish import slot_utc, token, upload, release_assets  # noqa: E402

DAVE = os.path.join(ROOT, 'davereels')
SCHED, LOG = os.path.join(DAVE, 'schedule.json'), os.path.join(DAVE, 'youtube_posted.json')


def yt_time(s, date, hhmm):
    """YouTube can use a different time than Instagram: schedule.json "youtube_times": {"12:30": {"to": "14:30",
    "until": "2026-11-03"}} moves that slot on YouTube only, up to and including the "until" date."""
    o = s.get('youtube_times', {}).get(hhmm)
    return o['to'] if o and date <= o.get('until', '9999-12-31') else hhmm


def plan():
    s = json.load(open(SCHED)); off = s.get('timezone_offset', '+05:30'); times = s['times']
    now = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)
    items = [(now, rid) for rid in s.get('posted_by_hand', [])]
    items += [(slot_utc(d['date'], yt_time(s, d['date'], times[i]), off), rid) for d in s['days'] for i, rid in enumerate(d['reels']) if rid]
    return sorted(items)


def reschedule(tok, yid, when):
    """Move a not-yet-public scheduled Short to a new publish time."""
    import requests
    body = {'id': yid, 'status': {'privacyStatus': 'private', 'publishAt': when.strftime('%Y-%m-%dT%H:%M:%S.000Z'), 'selfDeclaredMadeForKids': False, 'embeddable': True}}
    r = requests.put('https://www.googleapis.com/youtube/v3/videos?part=status', headers={'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=60)
    if r.status_code != 200:
        raise RuntimeError(f'reschedule failed {r.status_code}: {r.text[:400]}')
    return body['status']['publishAt']


def texts(rid):
    meta = json.load(open(os.path.join(DAVE, 'reels', rid, 'meta.json')))
    tags = [t.lstrip('#') for t in meta.get('hashtags', [])]
    body = '\n'.join(l for l in meta['caption'].strip().split('\n') if '[LINK]' not in l)
    title = meta['title'].strip()
    if len(title) + 8 <= 100:
        title += ' #shorts'
    return title, body + '\n\n' + ' '.join('#' + t for t in tags) + ' #shorts', ['shorts'] + tags


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--only')
    a = ap.parse_args()
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    have_keys = all(os.environ.get(k) for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'))
    if not have_keys and not a.dry_run:
        print('::notice::YouTube publishing is not connected: add the YT_CLIENT_ID, YT_CLIENT_SECRET and YT_REFRESH_TOKEN secrets. Nothing uploaded.')
        return
    tok = token() if have_keys and not a.dry_run else None
    done = 0
    # Shorts already uploaded but scheduled for a time that has since changed (and still in the future): move them
    now = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)
    for when, rid in plan():
        e = log.get(rid)
        if not e or e.get('publish_utc', 'now') == 'now' or (a.only and rid != a.only):
            continue
        old = dt.datetime.strptime(e['publish_utc'], '%Y-%m-%dT%H:%M:%S.000Z')
        if old == when or old <= now + dt.timedelta(minutes=15) or when <= now + dt.timedelta(minutes=15):
            continue
        if a.dry_run:
            print(f'{rid}: would move from {old:%Y-%m-%d %H:%M} to {when:%Y-%m-%d %H:%M} UTC'); continue
        try:
            e['publish_utc'] = reschedule(tok, e['id'], when)
        except RuntimeError as err:  # e.g. the sign-in only has the youtube.upload permission: leave the time as it is
            print(f'::warning::{rid}: could not move its publish time ({str(err)[:120]}...). It stays at {old:%Y-%m-%d %H:%M} UTC.')
            continue
        json.dump(log, open(LOG, 'w'), indent=1); done += 1
        print(f'{rid}: moved from {old:%Y-%m-%d %H:%M} to {when:%Y-%m-%d %H:%M} UTC ({e["url"]})')
    for when, rid in plan():
        if (a.only and rid != a.only) or rid in log:
            continue
        title, desc, tags = texts(rid)
        if a.dry_run:
            print(f'{rid}: would upload "{title}" for {when:%Y-%m-%d %H:%M} UTC'); continue
        d = tempfile.mkdtemp()
        if not release_assets('davereel-' + rid, d):
            print(f'{rid}: not rendered yet (no Release davereel-{rid}); will try again next run'); continue
        print(f'{rid}: uploading "{title}" for {when:%Y-%m-%d %H:%M} UTC', flush=True)
        try:
            yid, st = upload(tok, os.path.join(d, rid + '.mp4'), title, desc, tags, when)
        except RuntimeError as e:
            if 'quotaExceeded' in str(e) or 'uploadLimitExceeded' in str(e) or 'rateLimitExceeded' in str(e):
                print(f'::notice::YouTube upload quota used up for today after {done} upload(s); the next run carries on with {rid}.')
                break
            raise
        log[rid] = {'id': yid, 'url': f'https://youtu.be/{yid}', 'publish_utc': st.get('publishAt', 'now'), 'title': title}
        json.dump(log, open(LOG, 'w'), indent=1); done += 1
        print(f'   -> https://youtu.be/{yid} ({st["privacyStatus"]}{", goes public " + st["publishAt"] if "publishAt" in st else ""})')
    if not done and not a.dry_run:
        print('nothing new uploaded')


if __name__ == '__main__':
    main()
