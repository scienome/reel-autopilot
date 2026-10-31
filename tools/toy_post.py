#!/usr/bin/env python3
"""Post the toy reels (toyreels/, Brick Toy style) to Instagram AND YouTube at the same moment.

Usage: python3 tools/toy_post.py [--dry-run] [--now] [--id 05-body-no-sleep]

Reels go out strongest first (meta.json "potential", ties in folder order), the next one not yet posted that has a Release "toyreel-<id>", at
the times in toyreels/posting.json (IST). A run looks for a slot between 3 hours ago and 4 h 15 min from now that
has not been used yet (GitHub starts scheduled runs up to ~2 hours late, so runs are set 4, 3 and 2 hours early and
the one that starts first waits for the exact minute). For that slot it:
  1. uploads the MP4 to YouTube as a Short, scheduled to go public at the slot (YouTube publishes it then),
  2. uploads it to Instagram, waits for processing, then publishes the Reel at the slot.
So both go live together. Everything is recorded in toyreels/posted.json, so nothing is posted twice; if one
platform fails, the next run finishes that reel on the missing platform first (straight away), then the slot.

--now posts the next reel straight away (ignores the slots); --id picks a specific reel (implies --now).
Nothing is posted until BOTH accounts are connected, so the two stay in step.

Environment: IG_TOY_ACCESS_TOKEN, IG_TOY_USER_ID (Instagram API with Instagram Login) and YT_CLIENT_ID,
YT_CLIENT_SECRET, YT_REFRESH_TOKEN (the workflow fills these from the YT_TOY_* secrets: the toy reels channel),
GH_TOKEN, GITHUB_REPOSITORY.
"""
import argparse, datetime as dt, json, os, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import youtube_publish as yt  # noqa: E402
from first_comment import first_comment, post_first_comment, guard_slot  # noqa: E402

TOY = os.path.join(ROOT, 'toyreels')
REELS, LOG, CONF = os.path.join(TOY, 'reels'), os.path.join(TOY, 'posted.json'), os.path.join(TOY, 'posting.json')
API = 'https://graph.instagram.com/' + json.load(open(os.path.join(ROOT, 'config.json'))).get('instagram', {}).get('api_version', 'v26.0')
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')
TAG = 'toyreel-'
yt.CATEGORY = '27'  # Education
UTC = dt.timezone.utc


def now():
    return dt.datetime.now(UTC).replace(tzinfo=None)


def save(log):
    json.dump(log, open(LOG, 'w'), indent=1)


def slots_around(t, conf):
    """Every posting slot (naive UTC) from yesterday to tomorrow."""
    out = []
    for d in (-1, 0, 1):
        day = (t + dt.timedelta(hours=5, minutes=30) + dt.timedelta(days=d)).date().isoformat()
        out += [yt.slot_utc(day, hhmm, conf.get('timezone_offset', '+05:30')) for hhmm in conf['times_ist']]
    return sorted(out)


def rendered(rid):
    import requests
    r = requests.get(f'https://github.com/{REPO}/releases/download/{TAG}{rid}/{rid}.mp4', stream=True, timeout=60)
    r.close()
    return r.url if r.status_code == 200 else None


def texts(rid):
    meta = json.load(open(os.path.join(REELS, rid, 'meta.json')))
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
    h = {'Authorization': 'Bearer ' + os.environ['IG_TOY_ACCESS_TOKEN']}
    r = requests.request(method, API + path, headers=h, json=data if method == 'POST' else None,
                         params=data if method == 'GET' else None, timeout=120)
    j = r.json() if r.headers.get('content-type', '').startswith(('application/json', 'text/javascript')) else {'raw': r.text}
    if r.status_code != 200 or 'error' in j:
        raise RuntimeError(f'{method} {path} -> {r.status_code} {json.dumps(j)[:600]}')
    return j


def ig_post(rid, url, cap, key, at):
    ig = os.environ['IG_TOY_USER_ID']
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
    post_first_comment(ig_api, m['id'], first_comment('toy', rid, os.path.join(REELS, rid, 'meta.json')))
    return {'media_id': m['id'], 'posted_at': dt.datetime.now(UTC).isoformat(timespec='seconds')}


# ---------------------------------------------------------------- YouTube

def yt_post(tok, rid, title, desc, tags, at):
    d = tempfile.mkdtemp()
    if not yt.release_assets(TAG + rid, d):
        raise RuntimeError(f'could not download Release {TAG}{rid}')
    yid, st = yt.upload(tok, os.path.join(d, rid + '.mp4'), title, desc, tags, at, yt.localized('toy', rid, desc))
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
    conf = json.load(open(CONF))
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    t = now()

    ids = sorted(d for d in os.listdir(REELS) if os.path.exists(os.path.join(REELS, d, 'meta.json')))
    half = [r for r in ids if r in log and not ('instagram' in log[r] and 'youtube' in log[r])]
    def rank(r):  # the True Stories format goes first (owner, 31 Oct 2026), then strongest first; older reels still post after them
        m = json.load(open(os.path.join(REELS, r, 'meta.json'), encoding='utf-8'))
        return (m.get('format') != 'true-story', -m.get('potential', 5))
    queue = sorted((r for r in ids if r not in log), key=rank)

    if a.id:
        if a.id not in ids:
            sys.exit(f'{a.id} is not a reel in toyreels/reels')
        slot = None
    elif a.now:
        slot = None
    else:
        used = {e.get('slot') for e in log.values()}
        due = [s for s in slots_around(t, conf) if t - dt.timedelta(hours=3) <= s <= t + dt.timedelta(minutes=255)
               and s.strftime('%Y-%m-%dT%H:%MZ') not in used]
        slot = due[0] if due else None
        if not slot and not half:
            nxt = next(s for s in slots_around(t, conf) if s > t)
            print(f'no slot due now; next slot {nxt:%Y-%m-%d %H:%M} UTC; {len(queue)} reel(s) waiting')
            return

    pick = a.id or next((r for r in queue if rendered(r)), None)
    unrendered = [r for r in queue[:queue.index(pick)]] if pick in queue else []
    at = slot or t
    print(f'unfinished: {half or "none"}\nnext reel: {pick or "NONE - queue is empty"}'
          f'{" (skipping unrendered: " + ", ".join(unrendered) + ")" if unrendered else ""}\n'
          f'goes live: {f"{slot:%Y-%m-%d %H:%M} UTC" if slot else "now" if (a.now or a.id) else "at the next slot"}\n'
          f'waiting after it: {max(len(queue) - 1, 0)}')
    if pick:
        print('---\n' + texts(pick)[3] + '\n---\nfirst comment: ' + str(first_comment('toy', pick, os.path.join(REELS, pick, 'meta.json'))))

    need = ['IG_TOY_ACCESS_TOKEN', 'IG_TOY_USER_ID', 'YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN']
    missing = [k for k in need if not os.environ.get(k)]
    if missing:
        print(f'::notice::Toy reels are not connected yet (missing: {", ".join(missing)}). Nothing posted.')
        return
    me = ig_api('GET', '/me', fields='user_id,username')
    print(f"Instagram: posting as @{me.get('username')}")
    tok = yt.token()
    if a.dry_run:
        import requests
        ch = requests.get('https://www.googleapis.com/youtube/v3/channels', params={'part': 'snippet', 'mine': 'true'},
                          headers={'Authorization': 'Bearer ' + tok}, timeout=60).json()
        name = (ch.get('items') or [{}])[0].get('snippet', {}).get('title')
        print(f'YouTube: posting to the channel "{name}"' if name else
              'YouTube sign-in OK (channel name not readable: add the youtube.readonly scope to see it)')
        print('dry run: nothing posted')
        return

    errs = []
    for rid in half:  # a reel that made it to only one platform: finish it now
        print(f'finishing {rid} on the platform it is missing from')
        own = log[rid].get('slot')
        own = dt.datetime.strptime(own, '%Y-%m-%dT%H:%MZ') if own else t
        errs.append(post(rid, max(t, own), log, tok, None))
    if pick and (slot or a.now or a.id):
        errs.append(post(pick, at, log, tok, slot.strftime('%Y-%m-%dT%H:%MZ') if slot else None))
    elif not pick and slot:
        print('::warning::The toy reel queue is empty: no rendered reel left to post. The Claude batch adds 21 more every 3 days.')
    if any(errs):
        sys.exit(1)


if __name__ == '__main__':
    main()
