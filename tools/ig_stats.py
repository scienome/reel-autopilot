"""Read-only Instagram stats for one account: every recent reel with views, reach, watch time, likes, shares, saves.

Usage: python3 tools/ig_stats.py <ELITE|TOY|GG|MYTH|...>   (reads IG_<NAME>_ACCESS_TOKEN and IG_<NAME>_USER_ID)
Writes engagement/stats/<name>.json and prints a table. Posts nothing, changes nothing on Instagram.
Insights need the instagram_business_manage_insights permission; without it only likes and comments show.
"""
import json, os, sys, datetime, requests
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = 'https://graph.instagram.com/' + json.load(open(os.path.join(ROOT, 'config.json'))).get('instagram', {}).get('api_version', 'v26.0')
name = sys.argv[1].upper()
tok, uid = os.environ.get(f'IG_{name}_ACCESS_TOKEN'), os.environ.get(f'IG_{name}_USER_ID')
if not tok or not uid: sys.exit(f'missing IG_{name}_ACCESS_TOKEN / IG_{name}_USER_ID')
H = {'Authorization': 'Bearer ' + tok}
def get(path, **p):
    r = requests.get(f'{API}/{path}', headers=H, params=p, timeout=30)
    return r.json()
prof = get(uid, fields='username,followers_count,media_count')
out = {'account': name, 'username': prof.get('username'), 'followers': prof.get('followers_count'), 'fetched': datetime.datetime.utcnow().isoformat() + 'Z', 'reels': []}
url, n = f'{uid}/media', 0
page = get(url, fields='id,caption,timestamp,like_count,comments_count,permalink,media_product_type', limit=50)
warned = False
while page.get('data') and n < 150:
    for m in page['data']:
        n += 1
        row = {k: m.get(k) for k in ('id', 'timestamp', 'like_count', 'comments_count', 'permalink')}
        row['caption'] = (m.get('caption') or '')[:90]
        ins = get(f"{m['id']}/insights", metric='views,reach,saved,shares,total_interactions,ig_reels_avg_watch_time,ig_reels_video_view_total_time')
        if 'data' in ins:
            for d in ins['data']: row[d['name']] = (d.get('values') or [{}])[0].get('value', d.get('total_value', {}).get('value'))
        elif not warned:
            print('insights error:', ins.get('error', {}).get('message')); warned = True
        out['reels'].append(row)
    nxt = page.get('paging', {}).get('next')
    if not nxt: break
    page = requests.get(nxt, headers=H, timeout=30).json()
os.makedirs(os.path.join(ROOT, 'engagement', 'stats'), exist_ok=True)
json.dump(out, open(os.path.join(ROOT, 'engagement', 'stats', f'{name.lower()}.json'), 'w'), indent=1, ensure_ascii=False)
print(f"@{out['username']} followers {out['followers']} reels {len(out['reels'])}")
for r in out['reels']:
    w = r.get('ig_reels_avg_watch_time'); w = f'{w/1000:.1f}s' if isinstance(w, (int, float)) else '-'
    print(f"{r['timestamp'][:16]} views {r.get('views','-'):>6} reach {r.get('reach','-'):>6} watch {w:>6} like {r.get('like_count')} sh {r.get('shares','-')} sv {r.get('saved','-')} | {r['caption'][:60]!r}")
