#!/usr/bin/env python3
"""Put each couple reel on the couch reels YouTube channel as a Short, right after it is posted on Instagram.

Usage: python3 tools/couch_youtube.py [--dry-run]

Runs after every "Post reel" run (.github/workflows/post-couch-youtube.yml). Takes the reels in posted.json that went
to Instagram (they have a media_id) and are not yet in couch_youtube_posted.json, and uploads out/<id>.mp4 as a public
Short (title, caption and hashtags from reels/<id>/meta.json), so it shows on YouTube a few minutes after Instagram.
Reels that reached Instagram while the YouTube secrets were missing are recorded as skipped, so connecting the channel
later does not dump a backlog on it. If YouTube refuses (quota), the reel is tried again after the next Instagram post.
Environment: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (the workflow fills these from the YT_COUCH_* secrets).
"""
import argparse, datetime as dt, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import youtube_publish as yt  # noqa: E402
import couch_source as src  # noqa: E402

CFG = json.load(open(os.path.join(ROOT, 'config.json')))
POSTED = os.path.join(ROOT, 'posted.json')
LOG = os.path.join(ROOT, 'couch_youtube_posted.json')
yt.CATEGORY = '24' if CFG.get('queue') == 'riddles' else '23'  # Entertainment for riddles, else Comedy


def texts(rid):
    mp = src.meta_path(rid)
    meta = json.load(open(mp, encoding='utf-8')) if os.path.exists(mp) else {}
    tags = [t.lstrip('#') for t in (meta.get('hashtags') or CFG['instagram'].get('default_hashtags', []))]
    title = (meta.get('title') or rid.split('-', 1)[-1].replace('-', ' ').capitalize()).strip()
    if len(title) + 8 <= 100:
        title += ' #shorts'
    desc = meta.get('caption', '').strip() + '\n\n' + ' '.join('#' + t for t in tags) + ' #shorts'
    return title, desc, ['shorts'] + tags


def save(log):
    json.dump(log, open(LOG, 'w'), indent=1)


def main():
    if CFG.get('paused'):  # the owner paused CouchSarcasm (config.json "paused"): post nothing
        print(f"::notice::CouchSarcasm is paused: {CFG['paused']}"); return
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    todo = [p['id'] for p in json.load(open(POSTED)) if p.get('media_id') and p['id'] not in log]
    print(f"on Instagram, not yet on YouTube: {', '.join(todo) or 'none'}")
    if not all(os.environ.get(k) for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN')):
        print('::notice::The couch YouTube channel is not connected (YT_COUCH_CLIENT_ID, YT_COUCH_CLIENT_SECRET, '
              'YT_COUCH_REFRESH_TOKEN). Nothing uploaded.')
        if not a.dry_run and todo:
            for rid in todo:
                log[rid] = {'skipped': 'on Instagram before the YouTube channel was connected'}
            save(log)
        return
    tok = yt.token()  # stops with a clear message if the sign-in fails
    if a.dry_run:
        for rid in todo:
            print(f'{rid}: would upload "{texts(rid)[0]}"')
        print('dry run: YouTube sign-in OK, nothing posted')
        return
    for rid in todo:
        mp4 = src.local_mp4(rid)
        if not mp4:
            print(f'::warning::{rid}: its video is missing, so it cannot go to YouTube')
            log[rid] = {'skipped': 'video missing'}; save(log); continue
        title, desc, tags = texts(rid)
        old = yt.existing(tok, title)
        if old:
            print(f'{rid} is already on YouTube (https://youtu.be/{old[0]}, {old[1]}); not uploading it again')
            log[rid] = {'id': old[0], 'url': f'https://youtu.be/{old[0]}', 'title': title, 'uploaded_at': 'already there'}; save(log); continue
        try:
            yid, _ = yt.upload(tok, mp4, title, desc, tags, dt.datetime.now(dt.timezone.utc).replace(tzinfo=None), yt.localized('couch', rid, desc))
        except RuntimeError as e:
            print(f'::warning::{rid} not uploaded; it is tried again after the next Instagram post. {str(e)[:300]}')
            break
        log[rid] = {'id': yid, 'url': f'https://youtu.be/{yid}', 'title': title,
                    'uploaded_at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')}
        save(log)
        print(f'{rid}: https://youtu.be/{yid} (public)')


if __name__ == '__main__':
    main()
