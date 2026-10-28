#!/usr/bin/env python3
"""Fill the `videos` branch with every finished MP4, one folder per series, plus an index (README.md).

Usage (from the main checkout): python3 tools/sync_videos.py <path to a checkout of the videos branch>

  couch-sarcasm/   CouchSarcasm reels   (out/<id>.mp4 on main)
  dave-reels/      Gears & Glitches     (Releases davereel-<id>)
  toy-reels/       Brick Toy reels      (Releases toyreel-<id>)
  mechanic-shorts/ Mechanic Shorts      (Releases mechreel-<id>)
  anatomy/         Anatomy videos       (Releases mechreel-<id> listed in ANATOMY)
Long YouTube videos are over GitHub's 100 MB file limit, so the index links to their Releases instead.
Only new or changed files are copied. Needs GH_TOKEN and GITHUB_REPOSITORY.
"""
import json, os, shutil, sys
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')
H = {'Authorization': 'Bearer ' + os.environ.get('GH_TOKEN', ''), 'Accept': 'application/vnd.github+json'}
ANATOMY = {'27-cubital-fossa'}
MAX = 95 * 1024 * 1024  # GitHub refuses files over 100 MB


def load(p, default):
    p = os.path.join(ROOT, p)
    return json.load(open(p)) if os.path.exists(p) else default


def title(folder, rid):
    p = os.path.join(ROOT, folder, rid, 'meta.json')
    return json.load(open(p)).get('title', rid) if os.path.exists(p) else rid


def releases():
    out, page = [], 1
    while True:
        r = requests.get(f'https://api.github.com/repos/{REPO}/releases', headers=H, params={'per_page': 100, 'page': page}, timeout=60)
        r.raise_for_status(); batch = r.json(); out += batch
        if len(batch) < 100: return out
        page += 1


def put(dst, src_path=None, url=None, size=None):
    """Copy or download a file unless an identical-size copy is already there. True if it changed."""
    if os.path.exists(dst) and size is not None and os.path.getsize(dst) == size:
        return False
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if src_path:
        shutil.copyfile(src_path, dst)
    else:
        with requests.get(url, stream=True, timeout=600) as r:
            r.raise_for_status()
            with open(dst, 'wb') as f:
                for chunk in r.iter_content(1 << 20): f.write(chunk)
    print('updated', os.path.relpath(dst))
    return True


def main():
    vids = os.path.abspath(sys.argv[1])
    couch_log = load('posted.json', []); couch_posted = {p['id'] for p in couch_log if not p.get('skipped')}
    couch_skipped = {p['id'] for p in couch_log if p.get('skipped')}
    dave_ig, dave_yt = load('ig_posted.json', {}), load('davereels/youtube_posted.json', {})
    toy_log, yt_log = load('toyreels/posted.json', {}), load('youtube_posted.json', {})
    rows = {k: [] for k in ('couch-sarcasm', 'dave-reels', 'toy-reels', 'mechanic-shorts', 'anatomy')}
    longs = []

    # CouchSarcasm: rendered into out/ on main
    for f in sorted(os.listdir(os.path.join(ROOT, 'out'))):
        if not f.endswith('.mp4'): continue
        rid = f[:-4]; src = os.path.join(ROOT, 'out', f)
        put(os.path.join(vids, 'couch-sarcasm', f), src_path=src, size=os.path.getsize(src))
        rows['couch-sarcasm'].append((rid, title('reels', rid), 'Posted on Instagram' if rid in couch_posted else 'Skipped (older kind, never posted)' if rid in couch_skipped else 'Waiting to post'))

    for rel in sorted(releases(), key=lambda r: r['tag_name']):
        tag = rel['tag_name']; prefix, _, rid = tag.partition('-')
        mp4 = next((a for a in rel['assets'] if a['name'].endswith('.mp4')), None)
        if not mp4: continue
        if prefix in ('mechvideo', 'video') or mp4['size'] > MAX:
            yt = yt_log.get(tag, {})
            longs.append((rid, rel.get('name') or rid, rel['html_url'], yt.get('url', ''))); continue
        if prefix == 'davereel':
            folder, st = 'dave-reels', ('Posted on Instagram' if 'media_id' in dave_ig.get(rid, {}) else 'Skipped (older kind, never posted)' if dave_ig.get(rid, {}).get('skipped') else 'Waiting to post') + (' · on YouTube' if rid in dave_yt or 'youtube' in dave_ig.get(rid, {}) else '')
            name = title('davereels/reels', rid)
        elif prefix == 'toyreel':
            e = toy_log.get(rid, {}); folder, name = 'toy-reels', title('toyreels/reels', rid)
            st = 'Skipped (never posted)' if e.get('skipped') else 'Posted (Instagram + YouTube)' if 'instagram' in e and 'youtube' in e else 'Waiting to post'
        elif prefix == 'mechreel':
            if not os.path.isdir(os.path.join(ROOT, 'mechreels', 'reels', rid)): continue  # removed from the repo
            folder = 'anatomy' if rid in ANATOMY else 'mechanic-shorts'; name = title('mechreels/reels', rid)
            yt = yt_log.get(tag) or dave_ig.get(tag, {}).get('youtube'); st = (f"YouTube: {yt['publish_utc'][:10]}" if yt else 'Not on YouTube') + (' · posted on Instagram' if 'media_id' in dave_ig.get(tag, {}) else '')
        else:
            continue
        put(os.path.join(vids, folder, rid + '.mp4'), url=mp4['browser_download_url'], size=mp4['size'])
        rows[folder].append((rid, name, st))

    names = {'couch-sarcasm': 'CouchSarcasm (couple comedy)', 'dave-reels': 'Dave (Gears & Glitches)', 'toy-reels': 'Toy reels (Brick Toy)', 'mechanic-shorts': 'Mechanic Shorts (YouTube)', 'anatomy': 'Anatomy'}
    md = ['# All videos', '', 'Every finished video, one folder per series. Click a folder, then a file, then **View raw** (or the download',
          'button) to play it. This page updates itself after every render.', '']
    for k, rs in rows.items():
        if not rs: continue
        md += [f'## {names[k]} ({len(rs)})', f'Folder: [`{k}/`]({k}/)', '', '| Video | Title | Status |', '|---|---|---|']
        md += [f'| [{rid}]({k}/{rid}.mp4) | {t} | {s} |' for rid, t, s in rs] + ['']
    if longs:
        md += ['## Long YouTube videos', 'Too big for a GitHub folder (over 100 MB), so they live in Releases:', '', '| Video | Download | YouTube |', '|---|---|---|']
        md += [f'| {t} | [Release]({u}) | {y} |' for rid, t, u, y in longs]
    open(os.path.join(vids, 'README.md'), 'w').write('\n'.join(md) + '\n')


if __name__ == '__main__':
    main()
