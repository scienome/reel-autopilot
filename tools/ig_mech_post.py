#!/usr/bin/env python3
"""Post to the Gears & Glitches Instagram: Dave reels (davereels) and mechanic Shorts (mechreels), mixed.

Usage: python3 tools/ig_mech_post.py [--dry-run] [--id 02-hitler-maus-tank | --id mechreel-05-comet-square-windows]

Three slots a day at davereels/schedule.json "times" (08:30, 12:30, 20:30 IST). Each slot posts the next item,
alternating a Dave reel and a mechanic Short (if one kind has nothing rendered left, the other goes). Dave reels go in
schedule.json order (that file still sets their YouTube times), mechanic Shorts in folder order (not anatomy videos).
A run handles the first unused slot between 3 hours ago and 4 h 15 min from now (runs start 4, 3 and 2 hours early
because GitHub starts scheduled runs up to ~2 hours late): it uploads the MP4 from the item's Release, waits for
Instagram to process it, then publishes on the exact minute. One post per run. --id posts that item now.

Caption: the reel's meta.json caption and hashtags; a "[LINK]" line becomes a pointer to the YouTube channel. Before
publishing it checks the account's recent posts for the same first caption line, so a re-run never posts twice.
Posts are recorded in ig_posted.json (Dave by id, mechanic Shorts as "mechreel-<id>", each with its slot).

Environment: IG_GG_ACCESS_TOKEN, IG_GG_USER_ID (the Gears & Glitches Instagram account, Instagram API with
Instagram Login), GITHUB_REPOSITORY. Without the token it explains what is missing and exits cleanly.
"""
import argparse, datetime as dt, json, os, sys, time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from first_comment import first_comment, post_first_comment  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REELS = os.path.join(ROOT, 'davereels', 'reels')
SCHED, LOG = os.path.join(ROOT, 'davereels', 'schedule.json'), os.path.join(ROOT, 'ig_posted.json')
API = 'https://graph.instagram.com/' + json.load(open(os.path.join(ROOT, 'config.json'))).get('instagram', {}).get('api_version', 'v26.0')
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')
TAG = 'davereel-'
MECH = os.path.join(ROOT, 'mechreels', 'reels')
ANATOMY = {'27-cubital-fossa'}  # anatomy videos are not Gears & Glitches posts


def slot_utc(date, hhmm, off):
    sign = 1 if off[0] == '+' else -1
    oh, om = map(int, off[1:].split(':'))
    return (dt.datetime.fromisoformat(f'{date}T{hhmm}:00') - sign * dt.timedelta(hours=oh, minutes=om)).replace(tzinfo=dt.timezone.utc)


def dave_order():
    """Dave reels in schedule.json order (posted-by-hand ones first)."""
    s = json.load(open(SCHED)); off = s.get('timezone_offset', '+05:30'); times = s['times']
    items = [(slot_utc(d['date'], times[i], off), rid) for d in s['days'] for i, rid in enumerate(d['reels']) if rid]
    return list(dict.fromkeys(s.get('posted_by_hand', []) + [rid for _, rid in sorted(items)]))


def mech_order():
    return sorted(d for d in os.listdir(MECH) if d not in ANATOMY and os.path.exists(os.path.join(MECH, d, 'meta.json')))


def slots_near(now):
    s = json.load(open(SCHED)); off = s.get('timezone_offset', '+05:30')
    out = []
    for k in (-1, 0, 1):
        day = (now + dt.timedelta(hours=5, minutes=30) + dt.timedelta(days=k)).date().isoformat()
        out += [slot_utc(day, hhmm, off) for hhmm in s['times']]
    return sorted(out)


def slot_used(slot, log):
    key = slot.strftime('%Y-%m-%dT%H:%MZ')
    for e in log.values():
        if e.get('slot') == key: return True
        pa = e.get('posted_at')
        if pa and abs((dt.datetime.fromisoformat(pa.replace('Z', '+00:00')) - slot).total_seconds()) < 45 * 60: return True
    return False


def item(kind, rid):
    """(log key, folder, release tag prefix, first-comment series) for a Dave reel or a mechanic Short."""
    return (rid, REELS, TAG) if kind == 'dave' else ('mechreel-' + rid, MECH, 'mechreel-')


def api(method, path, **data):
    import requests
    h = {'Authorization': 'Bearer ' + os.environ['IG_GG_ACCESS_TOKEN']}
    r = requests.request(method, API + path, headers=h, json=data if method == 'POST' else None, params=data if method == 'GET' else None, timeout=120)
    j = r.json() if r.headers.get('content-type', '').startswith(('application/json', 'text/javascript')) else {'raw': r.text}
    if r.status_code != 200 or 'error' in j:
        raise RuntimeError(f'{method} {path} -> {r.status_code} {json.dumps(j)[:600]}')
    return j


def video_url(rid, tag=TAG):
    """The Release asset URL, resolved past GitHub's redirect to the direct file link Instagram can fetch."""
    import requests
    url = f'https://github.com/{REPO}/releases/download/{tag}{rid}/{rid}.mp4'
    r = requests.get(url, stream=True, timeout=60, allow_redirects=True)
    r.close()
    return (r.url if r.status_code == 200 else None), r.status_code, r.headers.get('content-length')


def caption(rid, folder=REELS):
    meta = json.load(open(os.path.join(folder, rid, 'meta.json')))
    lines = meta['caption'].strip().split('\n')
    body = '\n'.join(l if '[LINK]' not in l else '▶ Full video on our YouTube channel: Gears & Glitches' for l in lines)
    tags = ' '.join('#' + t.lstrip('#') for t in meta.get('hashtags', []))
    return f'{body}\n\n{tags}', body.split('\n')[0]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--id')
    a = ap.parse_args()
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    now = dt.datetime.now(dt.timezone.utc)
    if a.id:
        kind, rid = ('mech', a.id[len('mechreel-'):]) if a.id.startswith('mechreel-') else ('dave', a.id)
        if not os.path.exists(os.path.join(item(kind, rid)[1], rid, 'meta.json')):
            sys.exit(f'{a.id} is not a Dave reel or a mechanic Short')
        slot = now
    else:
        due = [s2 for s2 in slots_near(now) if now - dt.timedelta(hours=3) <= s2 <= now + dt.timedelta(minutes=255) and not slot_used(s2, log)]
        if not due:
            print('no slot due now; next: ' + f"{next(s2 for s2 in slots_near(now) if s2 > now):%Y-%m-%d %H:%M} UTC"); return
        slot = due[0]
        # alternate: the kind that did not post last goes next
        last = max(log.items(), key=lambda kv: kv[1].get('posted_at', ''), default=(None, {}))[0]
        order = ['mech', 'dave'] if last and not str(last).startswith('mechreel-') else ['dave', 'mech']
        pick = None
        for kind in order:
            for rid in (dave_order() if kind == 'dave' else mech_order()):
                key0, folder, tag = item(kind, rid)
                if key0 in log: continue
                if video_url(rid, tag)[0]: pick = (kind, rid); break
            if pick: break
        if not pick:
            print('::warning::Nothing rendered left to post on Gears & Glitches.'); return
        kind, rid = pick
    logkey, folder, tag = item(kind, rid)
    cap, key = caption(rid, folder)
    url, code, size = video_url(rid, tag)
    print(f'{logkey} ({kind}): slot {slot:%Y-%m-%d %H:%M} UTC\nvideo: HTTP {code}, {size} bytes\ncaption:\n{cap}\nfirst comment: {first_comment("dave", logkey, os.path.join(folder, rid, "meta.json"))}\n')
    if not url:
        print(f'::warning::{rid} has no rendered Release yet ({tag}{rid}); will try again next run'); return
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
        log[logkey] = {'media_id': dup['id'], 'posted_at': dup.get('timestamp', now.isoformat(timespec='seconds')), 'slot': slot.strftime('%Y-%m-%dT%H:%MZ')}
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
    log[logkey] = {'media_id': m['id'], 'posted_at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'slot': slot.strftime('%Y-%m-%dT%H:%MZ')}
    json.dump(log, open(LOG, 'w'), indent=1)
    print(f'published {rid} -> media {m["id"]}')
    post_first_comment(api, m['id'], first_comment('dave', logkey, os.path.join(folder, rid, 'meta.json')))


if __name__ == '__main__':
    main()
