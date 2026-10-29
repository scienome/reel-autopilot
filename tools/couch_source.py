"""Where a CouchSarcasm post comes from: the old reels (reels/<id>, out/<id>.mp4 on main) or the new sitcom episodes
(couchnew/reels/<id>, video in the Release couchnew-<id>). config.json "queue": "couchnew" makes the poster take the
episodes in couchnew/schedule.json "queue" order instead of the old reels."""
import json, os, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEW = os.path.join(ROOT, 'couchnew')
REPO = os.environ.get('GITHUB_REPOSITORY', 'scienome/reel-autopilot')


def is_new(rid):
    return os.path.isdir(os.path.join(NEW, 'reels', rid))


def new_queue():
    p = os.path.join(NEW, 'schedule.json')
    if not os.path.exists(p):
        return []
    s = json.load(open(p))
    if s.get('paused'):
        print(f"::notice::the new couch episodes are paused: {s['paused']}"); return []
    return list(s.get('queue', []))


def meta_path(rid):
    return os.path.join(NEW if is_new(rid) else ROOT, 'reels', rid, 'meta.json')


def release_url(rid):
    return f'https://github.com/{REPO}/releases/download/couchnew-{rid}/{rid}.mp4'


def video_url(rid, branch='main'):
    """A URL Instagram can fetch: the Release file resolved past GitHub's redirect, or the raw out/ file."""
    if not is_new(rid):
        return f'https://raw.githubusercontent.com/{REPO}/{branch}/out/{rid}.mp4'
    import requests
    r = requests.get(release_url(rid), stream=True, timeout=60, allow_redirects=True); r.close()
    return r.url if r.status_code == 200 else None


def rendered(rid):
    return os.path.exists(os.path.join(ROOT, 'out', rid + '.mp4')) if not is_new(rid) else bool(video_url(rid))


def local_mp4(rid):
    """The MP4 on disk (for YouTube): out/<id>.mp4, or the Release file downloaded to a temp folder (None if missing)."""
    p = os.path.join(ROOT, 'out', rid + '.mp4')
    if os.path.exists(p) or not is_new(rid):
        return p if os.path.exists(p) else None
    import requests
    r = requests.get(release_url(rid), timeout=300, allow_redirects=True)
    if r.status_code != 200:
        return None
    p = os.path.join(tempfile.mkdtemp(), rid + '.mp4'); open(p, 'wb').write(r.content); return p
