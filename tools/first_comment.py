"""The first comment the account posts on its own reel right after publishing (see engagement/README.md)."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def first_comment(series, rid, meta_path=None):
    """The reel's own meta.json "first_comment", else engagement/<series>.json, else None."""
    if meta_path and os.path.exists(meta_path):
        fc = json.load(open(meta_path)).get('first_comment')
        if fc:
            return fc
    p = os.path.join(ROOT, 'engagement', series + '.json')
    return json.load(open(p)).get(rid) if os.path.exists(p) else None


def post_first_comment(api, media_id, text):
    """Best effort: a missing permission never fails the post."""
    if not text:
        return
    try:
        api('POST', f'/{media_id}/comments', message=text)
        print(f'first comment posted: {text}')
    except Exception as e:  # noqa: BLE001
        print(f'::warning::First comment not posted ({str(e)[:200]}). The Instagram token needs the instagram_business_manage_comments permission.')


class SlotTaken(RuntimeError):
    """Something was already published on this account in the last minutes (another run got there first)."""


def guard_slot(api, ig, minutes=45):
    """Call right before media_publish: if the account already has a post from the last `minutes`, raise SlotTaken.
    Two runs can overlap (GitHub delays, a lost log commit); this keeps one post per slot whatever the logs say."""
    import datetime as dt
    recent = api('GET', f'/{ig}/media', fields='id,timestamp', limit=3).get('data', [])
    now = dt.datetime.now(dt.timezone.utc)
    for m in recent:
        ts = dt.datetime.strptime(m['timestamp'], '%Y-%m-%dT%H:%M:%S%z')
        if (now - ts).total_seconds() < minutes * 60:
            raise SlotTaken(f'the account already posted media {m["id"]} at {m["timestamp"]}; not posting a second one in this slot')
