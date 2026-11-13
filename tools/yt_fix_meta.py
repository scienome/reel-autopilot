#!/usr/bin/env python3
"""Correct the language and category of a channel's earlier YouTube Shorts (13 Nov 2026: every channel was uploading as
English audio in Science & Technology, so YouTube tested its Shorts on the wrong audience).

Usage: python3 tools/yt_fix_meta.py CHANNEL [--max 15]      CHANNEL: elite | toy | pulse | pov
Uses the channel's YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN (set by its posting workflow). Cheap on quota: it reads
50 videos per call (1 unit each) and only updates the ones that are wrong (50 units each), at most --max per run.
"""
import argparse, json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import youtube_publish as yt  # noqa: E402

# channel: (posting log, how to read the video id, keep entry?, language, category)
CH = {
    'elite': ('dioramareels/youtube_posted.json', lambda e: e.get('id'), lambda k: True, 'en', '24'),   # Entertainment
    'toy': ('toyreels/posted.json', lambda e: (e.get('youtube') or {}).get('id'), lambda k: True, 'en', '24'),  # Entertainment
    'pulse': ('pulsereels/posted.json', lambda e: (e.get('youtube') or {}).get('id'), lambda k: True, 'en', '17'),  # Sports
    'pov': ('ig_posted.json', lambda e: (e.get('youtube') or {}).get('id'), lambda k: k.startswith('povreel-'), 'en', '23'),  # Comedy (only the Thought Bubble Shorts; mechanic Shorts stay Science & Tech)
}
SETTINGS = {k: dict(lang=v[3], category=v[4]) for k, v in CH.items()}


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('channel', choices=CH); ap.add_argument('--max', type=int, default=15); a = ap.parse_args()
    import requests
    path, vid, keep, lang, cat = CH[a.channel]
    log = json.load(open(os.path.join(ROOT, path)))
    ids = [vid(e) for k, e in log.items() if isinstance(e, dict) and keep(k) and vid(e)]
    tok = yt.token(); h = {'Authorization': 'Bearer ' + tok}; fixed = 0
    for i in range(0, len(ids), 50):
        r = requests.get('https://www.googleapis.com/youtube/v3/videos', params={'part': 'snippet', 'id': ','.join(ids[i:i + 50])}, headers=h, timeout=60).json()
        for it in r.get('items', []):
            sn = it['snippet']
            if sn.get('categoryId') == cat and sn.get('defaultAudioLanguage', '').startswith(lang):
                continue
            if fixed >= a.max:
                break
            body = {'id': it['id'], 'snippet': {k: sn[k] for k in ('title', 'description', 'tags') if k in sn}}
            body['snippet'].update(categoryId=cat, defaultLanguage=lang, defaultAudioLanguage=lang)
            u = requests.put('https://www.googleapis.com/youtube/v3/videos?part=snippet', headers=dict(h, **{'Content-Type': 'application/json'}), data=json.dumps(body), timeout=60)
            if u.status_code == 200:
                fixed += 1
            else:
                print(f'::notice::{it["id"]}: {u.status_code} {u.text[:150]}'); break
    print(f'{a.channel}: {fixed} older Shorts set to language {lang}, category {cat}')


if __name__ == '__main__':
    main()
