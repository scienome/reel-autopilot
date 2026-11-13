#!/usr/bin/env python3
"""Post elitesendgame reels (mysteryreels/) to Instagram, one slot at a time, in mysteryreels/schedule.json order.

Usage: python3 tools/elite_post.py [--dry-run] [--now]

Add "paused": "reason" to schedule.json to stop posting. A dry run only checks the sign-in and shows the next reel.
Everything is recorded in mysteryreels/posted.json. Environment: IG_ELITE_ACCESS_TOKEN, IG_ELITE_USER_ID.
"""
import argparse, datetime as dt, json, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from first_comment import guard_slot  # noqa: E402
import requests  # noqa: E402

HOME = os.path.join(ROOT, 'mysteryreels')
REELS, LOG, CONF = os.path.join(HOME, 'reels'), os.path.join(HOME, 'posted.json'), os.path.join(HOME, 'schedule.json')
API = 'https://graph.instagram.com/' + json.load(open(os.path.join(ROOT, 'config.json'))).get('instagram', {}).get('api_version', 'v26.0')
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')
TAG = 'elite-'
UTC = dt.timezone.utc


def now():
    return dt.datetime.now(UTC).replace(tzinfo=None)


def ig_api(method, path, **data):
    h = {'Authorization': 'Bearer ' + os.environ['IG_ELITE_ACCESS_TOKEN']}
    r = requests.request(method, API + path, headers=h, json=data if method == 'POST' else None,
                         params=data if method == 'GET' else None, timeout=120)
    j = r.json() if r.headers.get('content-type', '').startswith(('application/json', 'text/javascript')) else {'raw': r.text}
    if r.status_code != 200 or 'error' in j:
        raise RuntimeError(f'{method} {path} -> {r.status_code} {json.dumps(j)[:600]}')
    return j


def slots(t, conf):
    start = dt.datetime.strptime(conf['start_at'], '%Y-%m-%dT%H:%MZ')
    out = []
    for d in (-1, 0, 1):
        day = (t + dt.timedelta(hours=5, minutes=30) + dt.timedelta(days=d)).date()
        for hhmm in conf['times_ist']:
            h, m = map(int, hhmm.split(':'))
            out.append(dt.datetime(day.year, day.month, day.day, h, m) - dt.timedelta(hours=5, minutes=30))
    return sorted(s for s in out if s >= start)


def caption(rid):
    meta = json.load(open(os.path.join(REELS, rid, 'meta.json'), encoding='utf-8'))
    body = meta['caption'].strip()
    return body + '\n\nFollow for the next file 🔔' + '\n\n' + ' '.join('#' + x.lstrip('#') for x in meta.get('hashtags', [])[:5]), body.split('\n')[0]


def post(rid, at):
    url = f'https://github.com/{REPO}/releases/download/{TAG}{rid}/{rid}.mp4'
    r = requests.get(url, stream=True, timeout=60)
    r.close()
    if r.status_code != 200:
        raise RuntimeError(f'{rid} has no Release {TAG}{rid}')
    cap, key = caption(rid)
    ig = os.environ['IG_ELITE_USER_ID']
    recent = ig_api('GET', f'/{ig}/media', fields='id,caption,timestamp', limit=25).get('data', [])
    dup = next((m for m in recent if (m.get('caption') or '').startswith(key)), None)
    if dup:
        print(f'{rid} is already on Instagram (media {dup["id"]}); recording it')
        return {'media_id': dup['id'], 'posted_at': dup.get('timestamp')}
    cid = ig_api('POST', f'/{ig}/media', media_type='REELS', thumb_offset=300, video_url=r.url, caption=cap, share_to_feed=True)['id']
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
        print(f'ready; publishing at {at:%H:%M} UTC (in {wait:.0f} s)', flush=True)
        time.sleep(wait)
    guard_slot(ig_api, ig)
    m = ig_api('POST', f'/{ig}/media_publish', creation_id=cid)
    print(f'Instagram: published {rid} -> media {m["id"]}')
    return {'media_id': m['id'], 'posted_at': dt.datetime.now(UTC).isoformat(timespec='seconds')}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--now', action='store_true', help='post the next reel straight away')
    a = ap.parse_args()
    conf = json.load(open(CONF, encoding='utf-8'))
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    if conf.get('paused') and not a.dry_run:
        print(f'paused: {conf["paused"]}')
        return
    missing = [k for k in ('IG_ELITE_ACCESS_TOKEN', 'IG_ELITE_USER_ID') if not os.environ.get(k)]
    if missing:
        print(f'::notice::elitesendgame is not connected yet (missing: {", ".join(missing)}). Nothing posted.')
        return
    me = ig_api('GET', '/me', fields='user_id,username')
    print(f"Instagram: posting as @{me.get('username')}")
    series = conf['series']  # { 'HH:MM' IST: [ids] }: each slot belongs to one story, in episode order
    for hhmm, ids in series.items():
        waiting = [r for r in ids if r not in log]
        print(f'{hhmm} IST: next {waiting[0] if waiting else "NONE"}; {len(waiting)} waiting')
    if a.dry_run:
        print('dry run: nothing posted')
        return
    t = now()
    if a.now:
        rid = next(r for ids in series.values() for r in ids if r not in log) if not conf.get('first') or conf['first'] in log else conf['first']
        log[rid] = post(rid, t)
        json.dump(log, open(LOG, 'w'), indent=1)
        return
    used = {e.get('slot') for e in log.values()}
    due = [s for s in slots(t, conf) if t - dt.timedelta(hours=3) <= s <= t + dt.timedelta(minutes=255) and s.strftime('%Y-%m-%dT%H:%MZ') not in used]
    if not due:
        print('no slot due now')
        return
    at = due[0]
    ist = (at + dt.timedelta(hours=5, minutes=30)).strftime('%H:%M')
    rid = next((r for r in series.get(ist, []) if r not in log), None)
    if not rid:
        print(f'::warning::the {ist} IST story has no episode left to post.')
        return
    e = post(rid, at)
    e['slot'] = at.strftime('%Y-%m-%dT%H:%MZ')
    log[rid] = e
    json.dump(log, open(LOG, 'w'), indent=1)


if __name__ == '__main__':
    main()
