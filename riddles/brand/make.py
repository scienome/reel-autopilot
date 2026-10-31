import asyncio, base64, pathlib
from playwright.async_api import async_playwright
K = pathlib.Path(r'C:\Users\amang\reel-autopilot\skills\whatifstyle')
H = pathlib.Path(__file__).parent
font = base64.b64encode((K / 'assets/Montserrat.ttf').read_bytes()).decode()
js = '\n'.join((K / 'references' / f).read_text(encoding='utf-8') for f in ['harness.js', 'flatkit.js', 'animals.js', 'riddlekit.js']) + (H / 'art.js').read_text(encoding='utf-8')
html = f'<!doctype html><style>@font-face{{font-family:Montserrat;font-weight:100 900;src:url(data:font/ttf;base64,{font})}}</style><canvas id=c></canvas><script>{js}</script>'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.set_content(html); await pg.evaluate("document.fonts.load('900 80px Montserrat')"); await pg.wait_for_timeout(500)
        for fn, out in [('profile', 'socho-zara-profile.png'), ('cover', 'socho-zara-youtube-cover.png')]:
            d = await pg.evaluate(f"({fn}(), document.getElementById('c').toDataURL('image/png'))")
            (H / out).write_bytes(base64.b64decode(d.split(',')[1]))
        print('errors', errs); await b.close()
asyncio.run(main())
