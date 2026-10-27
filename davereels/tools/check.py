#!/usr/bin/env python3
"""Draw key frames of a Mechanic reel (by default the middle of every shot) into a contact sheet, to check before rendering.

Usage: python3 tools/check.py reels/<id> [--times 1.5 6.2 ...] [--out DIR] [--full]

Works on estimated timing when there is no voiceover yet. Prints page errors, the shot list and per-frame draw times.
Writes DIR/sheet.png (4 across) and, with --full, every frame as DIR/f_<t>.png at full size.
"""
import argparse, asyncio, json, os, sys, tempfile
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, HH = json.load(open(os.path.join(ROOT, 'config.json'))).get('size', [720, 1280])
TW, TH = W // 2, HH // 2
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build import libs  # noqa: E402


async def main(a):
    out = a.out or os.path.join(ROOT, 'out', os.path.basename(a.reel.rstrip('/')) + '_check')
    os.makedirs(out, exist_ok=True)
    html = '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><canvas id="c" width="' + str(W) + '" height="' + str(HH) + '"></canvas><script>' + libs(a.reel) + '</script></body></html>'
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': W, 'height': HH})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'warning' and errs.append('warn: ' + m.text))
        await pg.set_content(html); await pg.wait_for_timeout(500)
        await pg.evaluate("document.fonts.load('800 62px \"Montserrat\"')")
        info = json.loads(await pg.evaluate('JSON.stringify({D: LESSON.DURATION, SH: LESSON.SH || [], M: LESSON.MEASURED})'))
        sh, D = info['SH'], info['D']
        print(f'duration {D:.1f}s, {len(sh)} shots, timing {"measured from the voice" if info["M"] else "ESTIMATED"}')
        for i, s in enumerate(sh):
            print(f'  {s[1]:6.2f}s  {s[0]}')
        times = a.times or [round((s[1] + (sh[i + 1][1] if i + 1 < len(sh) else D)) / 2, 2) for i, s in enumerate(sh)]
        from PIL import Image, ImageDraw
        frames = []
        for t in times:
            ms = await pg.evaluate(f'(()=>{{const c=document.getElementById("c"),x=c.getContext("2d",{{willReadFrequently:true}});const t0=performance.now();LESSON.explainer(x,{W},{HH},{t});return performance.now()-t0}})()')
            f = os.path.join(out if a.full else tempfile.mkdtemp(), f'f_{t:06.2f}.png'); await (await pg.query_selector('#c')).screenshot(path=f)
            frames.append((t, Image.open(f).convert('RGB').resize((TW, TH))))
            print(f'  frame {t:7.2f}s  {ms:5.0f} ms')
        await b.close()
    if errs:
        print('PAGE ERRORS/WARNINGS:', *errs, sep='\n  ')
    cols = 4; rows = (len(frames) + cols - 1) // cols
    im = Image.new('RGB', (cols * TW, rows * TH), 'black'); d = ImageDraw.Draw(im)
    for i, (t, f) in enumerate(frames):
        x, y = (i % cols) * TW, (i // cols) * TH; im.paste(f, (x, y)); d.rectangle([x, y, x + 90, y + 24], fill='black'); d.text((x + 6, y + 6), f'{t:.2f}s', fill='white')
    im.save(os.path.join(out, 'sheet.png')); print('sheet', os.path.join(out, 'sheet.png'))
    if any('error' in e.lower() for e in errs):
        sys.exit(1)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('--times', type=float, nargs='*'); ap.add_argument('--out'); ap.add_argument('--full', action='store_true')
    asyncio.run(main(ap.parse_args()))
