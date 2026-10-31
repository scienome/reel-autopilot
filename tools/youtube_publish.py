#!/usr/bin/env python3
"""Upload the full mechanic videos to YouTube, one a day, a few hours before their time (YouTube publishes them then).

Only the full 16:9 videos are uploaded here, and only within 6 hours of their slot, so nothing sits scheduled for
days. The Shorts in schedule.json are posted by tools/ig_mech_post.py instead (3 a day, same minute as Instagram).

Usage: python3 tools/youtube_publish.py [--dry-run] [--only ID]

Reads schedule.json (repo root):
  { "timezone_offset": "+05:30",
    "times": { "video": "07:30", "shorts": ["12:30", "17:30", "21:30"] },
    "days": [ { "date": "2026-11-02", "video": "001-gimli-glider",
                "shorts": ["02-gimli-fuel-mistake", "03-gimli-tiny-propeller", "04-gimli-racetrack-landing"] } ] }

For each day: the full video is uploaded first (from Release "mechvideo-<id>": MP4, thumbnail.jpg, youtube.txt), then each
Short (from Release "mechreel-<id>": MP4, caption.txt) with "[LINK]" in its caption replaced by the video's youtu.be link.
Anything not rendered yet is skipped and picked up on the next run. Uploaded items are recorded in youtube_posted.json.
If a slot is already in the past, the item goes public immediately.

Environment: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (OAuth, scope youtube.upload), GH_TOKEN (to download
Release assets). Without the YouTube secrets it explains what is missing and exits cleanly.
"""
import argparse, datetime as dt, json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHED = os.path.join(ROOT, 'schedule.json')
LOG = os.path.join(ROOT, 'youtube_posted.json')
CATEGORY = '28'  # Science & Technology


def slot_utc(date, hhmm, off):
    sign = 1 if off[0] == '+' else -1
    oh, om = map(int, off[1:].split(':'))
    local = dt.datetime.fromisoformat(f'{date}T{hhmm}:00')
    return local - sign * dt.timedelta(hours=oh, minutes=om)


def token():
    import requests
    r = requests.post('https://oauth2.googleapis.com/token', data={
        'client_id': os.environ['YT_CLIENT_ID'], 'client_secret': os.environ['YT_CLIENT_SECRET'],
        'refresh_token': os.environ['YT_REFRESH_TOKEN'], 'grant_type': 'refresh_token'}, timeout=60)
    if r.status_code != 200:
        sys.exit(f'::error::Google sign-in failed ({r.status_code}): {r.text[:300]}. If it says invalid_grant, the refresh token expired or was revoked: make a new one (and check the app is "In production", not "Testing").')
    return r.json()['access_token']


def localized(series, rid, desc):
    """Translated titles and descriptions for a Short, from i18n/<series>.json ({rid: {lang: {title, caption}}}), as YouTube
    `localizations`. The description keeps the English hashtag block. None when the reel has no translations."""
    p = os.path.join(ROOT, 'i18n', series + '.json')
    e = json.load(open(p)).get(rid) if os.path.exists(p) else None
    if not e:
        return None
    tail = desc.rsplit('\n\n', 1)[1] if '\n\n' in desc else ''
    out = {}
    for lang, v in e.items():
        t = v['title'].strip()
        if len(t) + 8 <= 100:
            t += ' #shorts'
        out[lang] = {'title': t[:100], 'description': (v['caption'].strip() + ('\n\n' + tail if tail else ''))[:4900]}
    return out


def upload(tok, mp4, title, desc, tags, publish_at, loc=None):
    import requests
    now = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)
    status = {'selfDeclaredMadeForKids': False, 'embeddable': True}
    if publish_at > now + dt.timedelta(minutes=20):
        status.update(privacyStatus='private', publishAt=publish_at.strftime('%Y-%m-%dT%H:%M:%S.000Z'))
    else:
        status['privacyStatus'] = 'public'
    body = {'snippet': {'title': title[:100], 'description': desc[:4900], 'tags': tags[:30], 'categoryId': CATEGORY,
                        'defaultLanguage': 'en', 'defaultAudioLanguage': 'en'}, 'status': status}
    size = os.path.getsize(mp4)
    def start(body, parts):
        return requests.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=' + parts,
                             headers={'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json; charset=UTF-8',
                                      'X-Upload-Content-Type': 'video/mp4', 'X-Upload-Content-Length': str(size)}, data=json.dumps(body), timeout=120)
    if loc:  # translated titles / descriptions (Hindi, Spanish, Portuguese...): shown to viewers who use YouTube in that language
        r = start(dict(body, localizations=loc), 'snippet,status,localizations')
        if r.status_code != 200:
            print(f'::warning::YouTube refused the translations ({r.status_code}: {r.text[:200]}); uploading without them')
            r = start(body, 'snippet,status')
    else:
        r = start(body, 'snippet,status')
    if r.status_code != 200:
        raise RuntimeError(f'upload start failed {r.status_code}: {r.text[:500]}')
    with open(mp4, 'rb') as f:
        u = requests.put(r.headers['Location'], headers={'Content-Type': 'video/mp4', 'Content-Length': str(size)}, data=f, timeout=1800)
    if u.status_code not in (200, 201):
        raise RuntimeError(f'upload failed {u.status_code}: {u.text[:500]}')
    return u.json()['id'], status


def existing(tok, title):
    """(video id, privacy) of a video with this title among the channel's latest 50 uploads, or None (best effort: needs a read scope)."""
    import requests
    h = {'Authorization': 'Bearer ' + tok}; g = 'https://www.googleapis.com/youtube/v3/'
    try:
        ch = requests.get(g + 'channels', params={'part': 'contentDetails', 'mine': 'true'}, headers=h, timeout=60).json()
        up = ch['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        items = requests.get(g + 'playlistItems', params={'part': 'snippet,status', 'playlistId': up, 'maxResults': 50}, headers=h, timeout=60).json()['items']
    except Exception:
        return None
    return next(((i['snippet']['resourceId']['videoId'], i.get('status', {}).get('privacyStatus')) for i in items if i['snippet']['title'].strip() == title.strip()[:100]), None)


def make_public(tok, vid):
    """Publish a private or scheduled video now (best effort: needs the youtube scope). True if it worked."""
    import requests
    r = requests.put('https://www.googleapis.com/youtube/v3/videos?part=status', headers={'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json'},
                     data=json.dumps({'id': vid, 'status': {'privacyStatus': 'public', 'selfDeclaredMadeForKids': False, 'embeddable': True}}), timeout=60)
    return r.status_code == 200


def set_thumb(tok, vid, jpg):
    import requests
    with open(jpg, 'rb') as f:
        r = requests.post(f'https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={vid}', headers={'Authorization': 'Bearer ' + tok, 'Content-Type': 'image/jpeg'}, data=f, timeout=120)
    if r.status_code != 200:
        print(f'::warning::Custom thumbnail not set ({r.status_code}). YouTube only allows custom thumbnails on phone-verified channels: youtube.com/verify. {r.text[:200]}')


def release_assets(tag, d):
    p = subprocess.run(['gh', 'release', 'download', tag, '--dir', d, '--clobber'], cwd=ROOT, capture_output=True, text=True)
    return p.returncode == 0


def parse_youtube_txt(path):
    s = open(path, encoding='utf-8').read()
    sec = lambda name: re.search(rf'^{name}\n(.*?)(?=\n\n[A-Z]+\n|\Z)', s, re.S | re.M)
    title = sec('TITLE').group(1).strip()
    desc = sec('DESCRIPTION').group(1).strip()
    tags = [t.strip() for t in sec('TAGS').group(1).split(',') if t.strip()]
    return title, desc, tags


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--only')
    a = ap.parse_args()
    sched = json.load(open(SCHED)); off = sched.get('timezone_offset', '+05:30'); times = sched['times']
    if sched.get('paused'):  # the owner paused Mechanic: upload nothing
        print(f"::notice::Mechanic videos are paused: {sched['paused']}"); return
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    have_keys = all(os.environ.get(k) for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'))
    if not have_keys and not a.dry_run:
        print('::notice::YouTube publishing is not connected yet: add the YT_CLIENT_ID, YT_CLIENT_SECRET and YT_REFRESH_TOKEN repository secrets. Nothing uploaded.')
        return
    tok = token() if have_keys and not a.dry_run else None
    changed = False
    for day in sched['days']:
        vid_id = day['video']; vkey = 'mechvideo-' + vid_id
        items = [(vkey, 'video', vid_id, slot_utc(day['date'], times['video'], off))]
        items += [('mechreel-' + s, 'short', s, slot_utc(day['date'], times['shorts'][i % len(times['shorts'])], off)) for i, s in enumerate(day['shorts'])]
        for key, kind, ident, when in items:
            if kind == 'short': continue  # Shorts: tools/ig_mech_post.py
            if when > dt.datetime.now(dt.timezone.utc).replace(tzinfo=None) + dt.timedelta(hours=6) and not a.only: continue
            if a.only and ident != a.only: continue
            if key in log: continue
            if kind == 'short' and vkey not in log and not a.dry_run:
                print(f'{ident}: waiting for the full video {vid_id} to be uploaded first'); continue
            d = tempfile.mkdtemp()
            if not release_assets(key, d):
                print(f'{ident}: not rendered yet (no Release {key}), will try again next run'); continue
            if kind == 'video':
                title, desc, tags = parse_youtube_txt(os.path.join(d, 'youtube.txt'))
                mp4 = os.path.join(d, ident + '.mp4')
            else:
                cap = open(os.path.join(d, 'caption.txt'), encoding='utf-8').read().strip()
                title = cap.split('\n', 1)[0].strip()
                body = cap.split('\n', 1)[1].strip() if '\n' in cap else ''
                link = f"https://youtu.be/{log[vkey]['id']}" if vkey in log else '[LINK]'
                desc = body.replace('[LINK]', link) + '\n\n#shorts'
                tags = ['shorts'] + [t.lstrip('#') for t in re.findall(r'#(\w+)', body)]
                mp4 = os.path.join(d, ident + '.mp4')
            print(f'{ident}: {"would upload" if a.dry_run else "uploading"} "{title}" for {when:%Y-%m-%d %H:%M} UTC')
            if a.dry_run:
                print('   ' + desc.replace('\n', '\n   ')[:600]); continue
            yid, st = upload(tok, mp4, title, desc, tags, when)
            if kind == 'video' and os.path.exists(os.path.join(d, 'thumbnail.jpg')):
                set_thumb(tok, yid, os.path.join(d, 'thumbnail.jpg'))
            log[key] = {'id': yid, 'url': f'https://youtu.be/{yid}', 'publish_utc': st.get('publishAt', 'now'), 'title': title}
            json.dump(log, open(LOG, 'w'), indent=1); changed = True
            print(f'   -> https://youtu.be/{yid} ({st["privacyStatus"]}{", goes public " + st["publishAt"] if "publishAt" in st else ""})')
    if not changed:
        print('nothing new to upload')


if __name__ == '__main__':
    main()
