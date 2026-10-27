#!/usr/bin/env python3
"""Draw key frames of a video (by default the middle of every shot) into contact sheets, to check before rendering.

Usage: python3 tools/check.py videos/<id> [--times 1.5 6.2 ...] [--out DIR] [--thumb]

Works on estimated timing when there is no voiceover yet. Prints page errors, the shot list and per-frame times.
Sheets are written as DIR/sheet_N.png (12 frames each, 4 across) and the thumbnail as DIR/thumbnail.png with --thumb.
"""
import argparse, asyncio, json, os, sys, tempfile
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build import libs  # noqa: E402


async def main(a):
    out = a.out or os.path.join(ROOT, 'out', os.path.basename(a.video.rstrip('/')) + '_check')
    os.makedirs(out, exist_ok=True)
    html = '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><canvas id="c" width="1920" height="1080"></canvas><canvas id="th" width="1920" height="1080"></canvas><script>' + libs(a.video) + '</script></body></html>'
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.set_content(html); await pg.wait_for_timeout(800)
        await pg.evaluate("document.fonts.load('800 40px \"Poppins\"')")
        if errs:
            print('PAGE ERRORS:', *errs, sep='\n  '); sys.exit(1)
        info = json.loads(await pg.evaluate('JSON.stringify({D: LESSON.DURATION, SH: LESSON.SH, CH: LESSON.CHAPTERS})'))
        sh, D = info['SH'], info['D']
        print(f'duration {D:.1f}s ({D / 60:.2f} min), {len(sh)} shots')
        for c in info['CH']:
            print(f'  chapter {int(c["t"] // 60)}:{int(c["t"] % 60):02d} {c["title"]}')
        times = a.times or [round((s[1] + (sh[i + 1][1] if i + 1 < len(sh) else D)) / 2 + 0.3, 2) for i, s in enumerate(sh)]
        names = {}
        for i, s in enumerate(sh):
            names[i] = s[0]
        from PIL import Image, ImageDraw
        frames, slow = [], []
        for t in times:
            ms = await pg.evaluate(f'(()=>{{const c=document.getElementById("c"),x=c.getContext("2d",{{willReadFrequently:true}});const t0=performance.now();LESSON.explainer(x,1920,1080,{t});return performance.now()-t0}})()')
            f = os.path.join(tempfile.mkdtemp(), 'f.png'); await (await pg.query_selector('#c')).screenshot(path=f)
            frames.append((t, Image.open(f).convert('RGB').resize((480, 270))))
            if ms > 400: slow.append((t, ms))
            print(f'  frame {t:7.2f}s  {ms:5.0f} ms')
        if errs:
            print('PAGE ERRORS:', *errs, sep='\n  '); sys.exit(1)
        if a.thumb:
            await pg.evaluate('(()=>{const c=document.getElementById("th");LESSON.thumbnail(c.getContext("2d",{willReadFrequently:true}),1920,1080)})()')
            await (await pg.query_selector('#th')).screenshot(path=os.path.join(out, 'thumbnail.png')); print('thumbnail', os.path.join(out, 'thumbnail.png'))
        await b.close()
    for n in range(0, len(frames), 12):
        part = frames[n:n + 12]; rows = (len(part) + 3) // 4
        im = Image.new('RGB', (4 * 480, rows * 270), 'black'); d = ImageDraw.Draw(im)
        for i, (t, f) in enumerate(part):
            x, y = (i % 4) * 480, (i // 4) * 270; im.paste(f, (x, y)); d.rectangle([x, y, x + 120, y + 26], fill='black'); d.text((x + 6, y + 6), f'{t:.1f}s', fill='white')
        im.save(os.path.join(out, f'sheet_{n // 12 + 1}.png')); print('sheet', os.path.join(out, f'sheet_{n // 12 + 1}.png'))
    if slow:
        print('SLOW FRAMES (over 400 ms):', slow)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--times', nargs='*', type=float); ap.add_argument('--out'); ap.add_argument('--thumb', action='store_true')
    asyncio.run(main(ap.parse_args()))
