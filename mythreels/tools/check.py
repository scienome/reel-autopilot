#!/usr/bin/env python3
"""Draw a reel's key frames (the middle of every shot) into one contact sheet, to check framing before rendering.

Usage: python3 tools/check.py reels/<id> [sheet.png] [--times 1.5 6.2 ...]

Works with estimated timing (no voiceover needed). Prints page errors, the shot list and per-frame render time.
"""
import argparse, asyncio, json, os, sys, tempfile
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build import build  # noqa: E402


async def main(a):
    page = build(a.reel, os.path.join(tempfile.mkdtemp(), 'check.html'))
    html = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + open(page).read() + '</body></html>'
    out = a.sheet or os.path.join(ROOT, 'out', os.path.basename(a.reel.rstrip('/')) + '_check.png')
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 720, 'height': 1280})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.set_content(html); await pg.wait_for_timeout(1200)
        info = json.loads(await pg.evaluate('JSON.stringify({D: DURATION, SH: LESSON.SH})'))
        sh = info['SH']; D = info['D']
        times = a.times or [round((s[1] + (sh[i + 1][1] if i + 1 < len(sh) else D)) / 2 + 0.4, 2) for i, s in enumerate(sh)]
        print('duration', D); [print(f'  shot {i + 1:2d} {s[0]:12s} {s[1]:6.2f}') for i, s in enumerate(sh)]
        shots = []
        for t in times:
            ms = await pg.evaluate(f'(()=>{{const t0=performance.now();seek({t});return performance.now()-t0}})()')
            f = os.path.join(tempfile.mkdtemp(), f'{t}.png'); await (await pg.query_selector('#c')).screenshot(path=f); shots.append(f)
            print(f'  frame {t:6.2f}s  {ms:.0f} ms')
        await b.close()
    from PIL import Image
    W, H, cols = 240, 427, 6
    rows = (len(shots) + cols - 1) // cols
    im = Image.new('RGB', (W * min(cols, len(shots)), H * rows), 'black')
    for i, f in enumerate(shots):
        im.paste(Image.open(f).convert('RGB').resize((W, H)), ((i % cols) * W, (i // cols) * H))
    os.makedirs(os.path.dirname(out), exist_ok=True); im.save(out)
    print('sheet', out)
    if errs:
        print('PAGE ERRORS:', *errs, sep='\n  '); sys.exit(1)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('sheet', nargs='?'); ap.add_argument('--times', nargs='*', type=float)
    asyncio.run(main(ap.parse_args()))
