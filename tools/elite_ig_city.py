#!/usr/bin/env python3
"""Post the new-style reels to @elitesendgame on Instagram at the same slots as YouTube, in dioramareels/schedule.json order.

Usage: python3 tools/elite_ig_city.py [--dry-run]

Uses the posting code in tools/elite_post.py, from the diorama-<id> Releases, and records dioramareels/instagram_posted.json.
Environment: IG_ELITE_ACCESS_TOKEN, IG_ELITE_USER_ID.
"""
import argparse, datetime as dt, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import elite_post as ep  # noqa: E402

HOME = os.path.join(ROOT, 'dioramareels')
LOG = os.path.join(HOME, 'instagram_posted.json')
ep.REELS = os.path.join(HOME, 'reels')
ep.TAG = 'diorama-'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    cfg = json.load(open(os.path.join(HOME, 'schedule.json'), encoding='utf-8'))
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    todo = [r for r in cfg['queue'] if r not in log]
    me = ep.ig_api('GET', '/me', fields='user_id,username')
    print(f"Instagram: posting as @{me.get('username')}; {len(todo)} reels left; next {todo[:3]}")
    if a.dry_run:
        print('dry run: nothing posted on Instagram')
        return
    if cfg.get('paused') or not todo:
        print('paused or queue empty')
        return
    t = ep.now()
    used = {e.get('slot') for e in log.values()}
    conf = {'start_at': '2026-11-05T19:31Z', 'times_ist': cfg['times_ist']}  # the first new reel goes out at 06:00 IST on 6 Nov
    due = [s for s in ep.slots(t, conf) if t - dt.timedelta(hours=3) <= s <= t + dt.timedelta(minutes=255) and s.strftime('%Y-%m-%dT%H:%MZ') not in used]
    if not due:
        print('no Instagram slot due now')
        return
    at, rid = due[0], todo[0]
    e = ep.post(rid, at)
    e['slot'] = at.strftime('%Y-%m-%dT%H:%MZ')
    log[rid] = e
    json.dump(log, open(LOG, 'w'), indent=1)


if __name__ == '__main__':
    main()
