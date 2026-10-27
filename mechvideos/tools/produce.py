#!/usr/bin/env python3
"""Make one finished Mechanic YouTube video: voiceover (ElevenLabs, chapter by chapter) -> timing -> 1080p render
-> thumbnail -> upload text.

Usage: python3 tools/produce.py videos/<id> [--no-voice] [--workers N] [--end SECONDS]

Output in out/<id>/: <id>.mp4 (1920x1080, 30 fps), thumbnail.jpg (1280x720), youtube.txt (title, description with
chapter timestamps, sources, comment question, tags). --no-voice renders a silent cut on estimated timing.
"""
import argparse, asyncio, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build import build, libs  # noqa: E402

ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--no-voice', action='store_true')
ap.add_argument('--workers', type=int, default=os.cpu_count() or 2); ap.add_argument('--end', type=float)
a = ap.parse_args()
video = os.path.abspath(a.video); vid = os.path.basename(video); out = os.path.join(ROOT, 'out', vid); os.makedirs(out, exist_ok=True)

if not a.no_voice:
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'voice.py'), video], check=True)
page = build(video, os.path.join(tempfile.mkdtemp(), 'render.html'))
cmd = [sys.executable, os.path.join(ROOT, 'tools', 'render_video.py'), page, os.path.join(out, vid + '.mp4'), '--workers', str(a.workers)]
if not a.no_voice: cmd += ['--voice', os.path.join(video, 'voice.mp3')]
if a.end: cmd += ['--end', str(a.end)]
subprocess.run(cmd, check=True)


async def thumb_and_chapters():
    from playwright.async_api import async_playwright
    html = '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><canvas id="th" width="1920" height="1080"></canvas><script>' + libs(video) + '</script></body></html>'
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
        await pg.set_content(html); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.fonts.load('800 62px \"Montserrat\"')")
        await pg.evaluate('(()=>{const c=document.getElementById("th");LESSON.thumbnail(c.getContext("2d",{willReadFrequently:true}),1920,1080)})()')
        png = os.path.join(tempfile.mkdtemp(), 't.png'); await (await pg.query_selector('#th')).screenshot(path=png)
        ch = json.loads(await pg.evaluate('JSON.stringify(LESSON.CHAPTERS)')); await b.close()
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', png, '-vf', 'scale=1280:720:flags=lanczos', '-q:v', '2', os.path.join(out, 'thumbnail.jpg')], check=True)
    return ch

chapters = asyncio.run(thumb_and_chapters())
meta = json.load(open(os.path.join(video, 'meta.json')))
stamp = lambda t: f'{int(t // 60)}:{int(t % 60):02d}'
lines = [f'0:00 {chapters[0]["title"]}'] + [f'{stamp(c["t"])} {c["title"]}' for c in chapters[1:]]
desc = meta['description'].strip() + '\n\nChapters\n' + '\n'.join(lines)
if meta.get('sources'): desc += '\n\nSources\n' + '\n'.join('- ' + s for s in meta['sources'])
if meta.get('footer'): desc += '\n\n' + meta['footer'].strip()
open(os.path.join(out, 'youtube.txt'), 'w').write(f"TITLE\n{meta['title']}\n\nDESCRIPTION\n{desc}\n\nTAGS\n{', '.join(meta.get('tags', []))}\n")
print('done:', out)
