#!/usr/bin/env python3
"""Post to Gears & Glitches, Instagram AND YouTube at the same minute: Dave reels and mechanic Shorts, mixed.

Usage: python3 tools/ig_mech_post.py [--dry-run] [--id 02-hitler-maus-tank | --id mechreel-05-comet-square-windows]

Three slots a day at davereels/schedule.json "times" (08:30, 12:30, 20:30 IST). Each slot posts the next item,
alternating a Dave reel and a mechanic Short (if one kind has nothing rendered left, the other goes). Dave reels go in
schedule.json order (that file still sets their YouTube times), mechanic Shorts in folder order (not anatomy videos).
A run handles the first unused slot between 3 hours ago and 4 h 15 min from now (runs start 4, 3 and 2 hours early
because GitHub starts scheduled runs up to ~2 hours late): it uploads the MP4 from the item's Release, waits for
Instagram to process it, then publishes on the exact minute. One post per run. --id posts that item now.
The same item goes to the Gears YouTube channel as a Short first, uploaded in that run with publishAt = the slot (so
YouTube makes it public on the same minute). That keeps both platforms at 3 a day. An item already public on YouTube
from before (in youtube_posted.json / davereels/youtube_posted.json) is not uploaded again. If one platform fails,
the next run finishes the item there first. Full 16:9 videos are separate (tools/youtube_publish.py, 1 a day).

Caption: the reel's meta.json caption and hashtags; a "[LINK]" line becomes a pointer to the YouTube channel. Before
publishing it checks the account's recent posts for the same first caption line, so a re-run never posts twice.
Posts are recorded in ig_posted.json (Dave by id, mechanic Shorts as "mechreel-<id>", each with its slot and its
"youtube" upload; only this script writes that file, so two workflows never fight over a log).

Environment: IG_GG_ACCESS_TOKEN, IG_GG_USER_ID (the Gears & Glitches Instagram account, Instagram API with
Instagram Login), YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (the Gears YouTube channel), GH_TOKEN, GITHUB_REPOSITORY. Without the token it explains what is missing and exits cleanly.
"""
import argparse, datetime as dt, json, os, sys, time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from first_comment import first_comment, post_first_comment, guard_slot, SlotTaken, best_for_slot, is_afternoon  # noqa: E402
import youtube_publish as yt  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REELS = os.path.join(ROOT, 'davereels', 'reels')
SCHED, LOG = os.path.join(ROOT, 'davereels', 'schedule.json'), os.path.join(ROOT, 'ig_posted.json')
API = 'https://graph.instagram.com/' + json.load(open(os.path.join(ROOT, 'config.json'))).get('instagram', {}).get('api_version', 'v26.0')
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')
TAG = 'davereel-'
MECH = os.path.join(ROOT, 'mechreels', 'reels')
ANATOMY = {'27-cubital-fossa'}  # anatomy videos are not Gears & Glitches posts
YT_LOGS = {'dave': os.path.join(ROOT, 'davereels', 'youtube_posted.json'), 'mech': os.path.join(ROOT, 'youtube_posted.json')}


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


def split(logkey):
    return ('mech', logkey[len('mechreel-'):]) if logkey.startswith('mechreel-') else ('dave', logkey)


def yt_log(kind):
    p = YT_LOGS[kind]
    return json.load(open(p)) if os.path.exists(p) else {}


def on_youtube(logkey, log):
    return 'youtube' in log.get(logkey, {}) or logkey in yt_log(split(logkey)[0])


def yt_texts(kind, rid, folder):
    meta = json.load(open(os.path.join(folder, rid, 'meta.json')))
    tags = [t.lstrip('#') for t in meta.get('hashtags', []) if t.lstrip('#') != 'shorts']
    body = meta['caption'].strip()
    if '[LINK]' in body:  # the full video this Short belongs to, if it is already on the channel
        s = json.load(open(os.path.join(ROOT, 'schedule.json')))
        vid = next(('mechvideo-' + d['video'] for d in s['days'] if rid in d.get('shorts', [])), None)
        v = yt_log('mech').get(vid)
        body = '\n'.join(l.replace('[LINK]', v['url']) if v else '▶ Full video on our channel' if '[LINK]' in l else l for l in body.split('\n'))
    title = meta['title'].strip()
    if len(title) + 8 <= 100:
        title += ' #shorts'
    return title, body + '\n\n' + ' '.join('#' + t for t in tags) + ' #shorts', ['shorts'] + tags


def yt_existing(tok, title):
    """A video with this title among the channel's latest 50 uploads (best effort: needs a read scope)."""
    import requests
    h = {'Authorization': 'Bearer ' + tok}; g = 'https://www.googleapis.com/youtube/v3/'
    try:
        ch = requests.get(g + 'channels', params={'part': 'contentDetails', 'mine': 'true'}, headers=h, timeout=60).json()
        up = ch['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        items = requests.get(g + 'playlistItems', params={'part': 'snippet', 'playlistId': up, 'maxResults': 50}, headers=h, timeout=60).json()['items']
    except Exception:
        return None
    return next((i['snippet']['resourceId']['videoId'] for i in items if i['snippet']['title'].strip() == title.strip()), None)


def yt_post(tok, logkey, at):
    import tempfile
    kind, rid = split(logkey); _, folder, tag = item(kind, rid)
    title, desc, tags = yt_texts(kind, rid, folder)
    old = yt_existing(tok, title)
    if old:
        print(f'::warning::{rid} is already on the YouTube channel (https://youtu.be/{old}); not uploading it again')
        return {'id': old, 'url': f'https://youtu.be/{old}', 'publish_utc': 'already there', 'title': title}
    d = tempfile.mkdtemp()
    if not yt.release_assets(tag + rid, d):
        raise RuntimeError(f'could not download Release {tag}{rid}')
    yid, st = yt.upload(tok, os.path.join(d, rid + '.mp4'), title, desc, tags, at.replace(tzinfo=None))
    e = {'id': yid, 'url': f'https://youtu.be/{yid}', 'publish_utc': st.get('publishAt', 'now'), 'title': title}
    print(f'YouTube: https://youtu.be/{yid} ({st["privacyStatus"]}{", goes public " + st["publishAt"] if "publishAt" in st else ""})', flush=True)
    return e


def ig_post(logkey, at):
    kind, rid = split(logkey); _, folder, tag = item(kind, rid)
    cap, key = caption(rid, folder)
    url = video_url(rid, tag)[0]
    if not url:
        raise RuntimeError(f'no Release {tag}{rid}')
    ig = os.environ['IG_GG_USER_ID']
    # never post the same reel twice: look for its first caption line among the latest posts
    recent = api('GET', f'/{ig}/media', fields='id,caption,timestamp', limit=25).get('data', [])
    dup = next((m for m in recent if (m.get('caption') or '').startswith(key)), None)
    if dup:
        print(f'{rid} is already on Instagram (media {dup["id"]}); recording it')
        return {'media_id': dup['id'], 'posted_at': dup.get('timestamp')}
    cid = api('POST', f'/{ig}/media', media_type='REELS', video_url=url, caption=cap, share_to_feed=True)['id']
    print('Instagram container', cid, flush=True)
    for _ in range(40):  # up to ~13 minutes
        time.sleep(20)
        st = api('GET', f'/{cid}', fields='status_code,status').get('status_code')
        print('Instagram status', st, flush=True)
        if st == 'FINISHED':
            break
        if st in ('ERROR', 'EXPIRED'):
            raise RuntimeError(f'Instagram could not process {rid} ({st})')
    else:
        raise RuntimeError('Instagram did not finish processing the video in time')
    wait = (at - dt.datetime.now(dt.timezone.utc)).total_seconds()
    if wait > 0:
        print(f'Instagram ready; publishing at {at:%H:%M} UTC (in {wait:.0f} s)', flush=True); time.sleep(wait)
    guard_slot(api, ig)
    m = api('POST', f'/{ig}/media_publish', creation_id=cid)
    print(f'Instagram: published {rid} -> media {m["id"]}')
    post_first_comment(api, m['id'], first_comment('dave', logkey, os.path.join(folder, rid, 'meta.json')))
    return {'media_id': m['id'], 'posted_at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')}


def post(logkey, at, log, tok):
    """Put the item on whichever platform it is still missing from, going live at `at`. Returns an error or None."""
    e = log[logkey]; err = None
    if tok and not on_youtube(logkey, log):  # YouTube first: it schedules itself for `at`, so it can go up early
        try:
            e['youtube'] = yt_post(tok, logkey, at); json.dump(log, open(LOG, 'w'), indent=1)
        except RuntimeError as x:
            print(f'::error::YouTube failed for {logkey}: {str(x)[:400]}'); err = x
    if 'media_id' not in e:
        try:
            e.update(ig_post(logkey, at)); json.dump(log, open(LOG, 'w'), indent=1)
        except SlotTaken as x:  # another run already posted in this slot: leave this item for a later slot
            print(f'::warning::{x}')
            if 'youtube' not in e: log.pop(logkey, None)
            json.dump(log, open(LOG, 'w'), indent=1)
        except RuntimeError as x:
            print(f'::error::Instagram failed for {logkey}: {str(x)[:400]}'); err = err or x
    return err


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--id')
    a = ap.parse_args()
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    now = dt.datetime.now(dt.timezone.utc)
    # items posted under this system (they have a slot) that are still missing a platform
    # (also anything posted on Instagram after the switch to this system, 28 Oct 14:30 UTC, by a run still on older code)
    half = [k for k, e in log.items() if (e.get('slot') or e.get('posted_at', '') >= '2026-10-28T14:30')
            and ('media_id' not in e or not on_youtube(k, log))]
    if a.id:
        kind, rid = split(a.id)
        if not os.path.exists(os.path.join(item(kind, rid)[1], rid, 'meta.json')):
            sys.exit(f'{a.id} is not a Dave reel or a mechanic Short')
        slot = now
    else:
        due = [s2 for s2 in slots_near(now) if now - dt.timedelta(hours=3) <= s2 <= now + dt.timedelta(minutes=255) and not slot_used(s2, log)]
        if not due and not half:
            print('no slot due now; next: ' + f"{next(s2 for s2 in slots_near(now) if s2 > now):%Y-%m-%d %H:%M} UTC"); return
        slot = due[0] if due else None
        rid = None
        if slot:
            # alternate: the kind that did not post last goes next
            last = max(((k, e.get('slot') or e.get('posted_at') or '') for k, e in log.items()), key=lambda kv: kv[1], default=(None, ''))[0]
            order = ['mech', 'dave'] if last and not str(last).startswith('mechreel-') else ['dave', 'mech']
            for kind in order:
                ready = []
                for r in (dave_order() if kind == 'dave' else mech_order()):
                    key0, folder, tag = item(kind, r)
                    if key0 in log: continue
                    if video_url(r, tag)[0]: ready.append(r)
                    if len(ready) == 3: break
                folder = item(kind, 'x')[1]
                rid = best_for_slot(ready, lambda r: os.path.join(folder, r, 'meta.json'), is_afternoon(slot.replace(tzinfo=None)))
                if rid: break
            if not rid:
                print('::warning::Nothing rendered left to post on Gears & Glitches.')
    print(f'unfinished: {half or "none"}')
    if rid:
        logkey, folder, tag = item(kind, rid)
        cap = caption(rid, folder)[0]
        url, code, size = video_url(rid, tag)
        print(f'{logkey} ({kind}): slot {slot:%Y-%m-%d %H:%M} UTC\nvideo: HTTP {code}, {size} bytes\n'
              f'YouTube: {"already there" if on_youtube(logkey, log) else "upload, public at the slot"}\ncaption:\n{cap}\n'
              f'first comment: {first_comment("dave", logkey, os.path.join(folder, rid, "meta.json"))}\n')
        if not url:
            print(f'::warning::{rid} has no rendered Release yet ({tag}{rid}); will try again next run'); rid = None
    if not os.environ.get('IG_GG_ACCESS_TOKEN') or not os.environ.get('IG_GG_USER_ID'):
        print('::notice::Instagram is not connected yet: add the IG_GG_ACCESS_TOKEN and IG_GG_USER_ID repository secrets. Nothing posted.'); return
    me = api('GET', '/me', fields='user_id,username')
    print(f"Instagram: posting as @{me.get('username')}")
    if not all(os.environ.get(k) for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN')):
        print('::warning::YouTube is not connected (YT_CLIENT_* secrets missing): posting to Instagram only.'); tok = None
    else:
        tok = yt.token()
    if a.dry_run:
        print('dry run: nothing posted'); return
    errs = []
    for k in half:
        own = dt.datetime.strptime(log[k]['slot'], '%Y-%m-%dT%H:%MZ').replace(tzinfo=dt.timezone.utc) if log[k].get('slot') else now
        print(f'finishing {k} on the platform it is missing from'); errs.append(post(k, max(now, own), log, tok))
    if rid:
        logkey = item(kind, rid)[0]
        log.setdefault(logkey, {}).setdefault('slot', slot.strftime('%Y-%m-%dT%H:%MZ')); json.dump(log, open(LOG, 'w'), indent=1)
        errs.append(post(logkey, slot, log, tok))
    if any(errs):
        sys.exit(1)


if __name__ == '__main__':
    main()
