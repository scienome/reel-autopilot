#!/usr/bin/env python3
"""Render a player page to MP4: frames via window.seek, effects via SOUND.renderOffline, voice mixed on top.

Usage: python3 render_reel.py PAGE.html OUT.mp4 [--voice voice.mp3] [--fps 30] [--workers 4]

PAGE.html must be the build WITHOUT the embedded voiceover. It must expose window.seek(t), window.DURATION and
window.scoreSound, and draw into <canvas id="c">. Fonts must be installed locally (see SKILL.md) because a headless
renderer may not reach Google Fonts. Needs playwright (chromium) and ffmpeg.
"""
import argparse, asyncio, base64, math, os, shutil, struct, subprocess, tempfile
from playwright.async_api import async_playwright
ap = argparse.ArgumentParser(); ap.add_argument('page'); ap.add_argument('out'); ap.add_argument('--voice')
ap.add_argument('--fps', type=int, default=30); ap.add_argument('--workers', type=int, default=4); ap.add_argument('--crf', type=int, default=20)
a = ap.parse_args()
work = tempfile.mkdtemp(); frames = os.path.join(work, 'frames'); os.makedirs(frames)
HTML = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + open(a.page).read() + '</body></html>'

async def page(b):
    pg = await b.new_page(viewport={'width': 720, 'height': 1280})
    pg.on('pageerror', lambda e: print('page error:', e))
    await pg.set_content(HTML); await pg.wait_for_timeout(1500)
    ok = await pg.evaluate('document.fonts.check(\'800 62px "Montserrat"\')')
    if not ok: print('WARNING: Montserrat is not available; text will use a fallback face')
    return pg

async def worker(b, idx):
    pg = await page(b)
    for i in idx:
        url = await pg.evaluate(f'(()=>{{seek({i}/{a.fps});return document.getElementById("c").toDataURL("image/png")}})()')
        open(os.path.join(frames, f'f{i:05d}.png'), 'wb').write(base64.b64decode(url.split(',')[1]))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await page(b)
        dur = await pg.evaluate('DURATION'); n = math.ceil(dur * a.fps); print(f'duration {dur}s, {n} frames')
        r = await pg.evaluate('''async()=>{const s=await SOUND.renderOffline(window.scoreSound, DURATION, 48000, {voiceover:true});
          const u=new Uint8Array(s.inter.buffer);let bin='';for(let i=0;i<u.length;i+=32768)bin+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return {b:btoa(bin),peak:s.peak}}''')
        data = base64.b64decode(r['b']); print('effects peak', round(r['peak'], 3))
        with open(os.path.join(work, 'fx.wav'), 'wb') as f:
            f.write(b'RIFF' + struct.pack('<I', 36 + len(data)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 3, 2, 48000, 48000 * 8, 8, 32) + b'data' + struct.pack('<I', len(data)) + data)
        await asyncio.gather(*[worker(b, range(k, n, a.workers)) for k in range(a.workers)])
        await b.close()
        return dur

dur = asyncio.run(main())
ff = lambda *args: subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *args], check=True)
video = os.path.join(work, 'video.mp4'); fx = os.path.join(work, 'fx.wav'); mix = os.path.join(work, 'mix.wav')
ff('-framerate', str(a.fps), '-i', os.path.join(frames, 'f%05d.png'), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', str(a.crf), '-pix_fmt', 'yuv420p', video)
if a.voice:
    # voice on top, effects ducked under it; the voice is padded to the full length so nothing gets cut short
    ff('-i', a.voice, '-i', fx, '-filter_complex',
       f'[0:a]aresample=48000,apad=whole_dur={dur},loudnorm=I=-17:TP=-2,aresample=48000,asplit=2[v1][v2];'
       '[1:a]loudnorm=I=-26:TP=-4:LRA=20,aresample=48000[fx0];[fx0][v1]sidechaincompress=threshold=0.05:ratio=3:attack=10:release=250[fx];'
       f'[v2][fx]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,atrim=0:{dur}[a]', '-map', '[a]', mix)
else:
    ff('-i', fx, '-af', f'loudnorm=I=-16:TP=-1.5,atrim=0:{dur}', '-ar', '48000', mix)
ff('-i', video, '-i', mix, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', a.out)
shutil.rmtree(work); print('wrote', a.out)
