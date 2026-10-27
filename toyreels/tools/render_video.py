#!/usr/bin/env python3
"""Render a video page to an MP4 at the size in config.json: frames streamed straight into ffmpeg (no frame files), several workers each
rendering one stretch of the timeline, effects rendered offline, the voiceover mixed on top with the effects ducked.

Usage: python3 tools/render_video.py PAGE.html OUT.mp4 [--voice voice.mp3] [--fps 30] [--workers N] [--crf 18] [--end SECONDS]

PAGE.html is the build WITHOUT an embedded voice (tools/build.py). Needs playwright (chromium), ffmpeg and the fonts.
"""
import argparse, asyncio, base64, math, os, shutil, struct, subprocess, tempfile, time
from playwright.async_api import async_playwright

ap = argparse.ArgumentParser(); ap.add_argument('page'); ap.add_argument('out'); ap.add_argument('--voice')
ap.add_argument('--fps', type=int, default=30); ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
ap.add_argument('--crf', type=int, default=18); ap.add_argument('--end', type=float)
a = ap.parse_args()
work = tempfile.mkdtemp()
HTML = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + open(a.page).read() + '</body></html>'
SR = 48000
import json as _j
W, HH = _j.load(open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'config.json'))).get('size', [1920, 1080])


async def open_page(b):
    pg = await b.new_page(viewport={'width': W, 'height': HH})
    pg.on('pageerror', lambda e: print('page error:', e))
    await pg.set_content(HTML); await pg.wait_for_timeout(1500)
    ok = await pg.evaluate('document.fonts.check(\'600 50px "Poppins"\') && document.fonts.check(\'800 40px "Poppins"\')')
    if not ok: print('WARNING: Poppins is not available; text will use a fallback face')
    return pg


async def segment(b, k, f0, f1, done):
    pg = await open_page(b)
    seg = os.path.join(work, f'seg{k:02d}.mp4')
    ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', str(a.fps), '-c:v', 'mjpeg', '-i', '-',
                           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', str(a.crf), '-pix_fmt', 'yuv420p', '-r', str(a.fps), seg], stdin=subprocess.PIPE)
    for i in range(f0, f1):
        url = await pg.evaluate(f'(()=>{{seek({i}/{a.fps});return document.getElementById("c").toDataURL("image/jpeg",0.93)}})()')
        ff.stdin.write(base64.b64decode(url.split(',', 1)[1])); done[0] += 1
    ff.stdin.close(); ff.wait()
    await pg.close()
    return seg


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await open_page(b)
        dur = await pg.evaluate('DURATION'); dur = min(dur, a.end) if a.end else dur
        n = math.ceil(dur * a.fps); print(f'duration {dur:.1f}s, {n} frames, {a.workers} workers')
        # effects: render offline once, then pull the samples out in slices (a 5-minute float buffer is too big for one call)
        await pg.evaluate(f'(async()=>{{window.__fx=await SOUND.renderOffline(window.scoreSound,{dur},{SR},{{voiceover:true}});}})()')
        total = await pg.evaluate('window.__fx.inter.length'); chunks = []
        for s in range(0, total, SR * 2 * 10):
            chunks.append(base64.b64decode(await pg.evaluate(f'''(()=>{{const u=new Uint8Array(window.__fx.inter.buffer,{s * 4},{min(SR * 2 * 10, total - s) * 4});let bin='';for(let i=0;i<u.length;i+=32768)bin+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(bin)}})()''')))
        data = b''.join(chunks)
        with open(os.path.join(work, 'fx.wav'), 'wb') as f:
            f.write(b'RIFF' + struct.pack('<I', 36 + len(data)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 3, 2, SR, SR * 8, 8, 32) + b'data' + struct.pack('<I', len(data)) + data)
        await pg.close()
        done, step = [0], math.ceil(n / a.workers)
        tasks = [asyncio.create_task(segment(b, k, k * step, min(n, (k + 1) * step), done)) for k in range(a.workers) if k * step < n]
        t0 = time.time()
        while not all(t.done() for t in tasks):
            await asyncio.sleep(15); el = time.time() - t0
            if done[0]: print(f'  {done[0]}/{n} frames, {el / 60:.1f} min, ~{(n - done[0]) * el / done[0] / 60:.1f} min left', flush=True)
        segs = [t.result() for t in tasks]
        await b.close()
        return dur, segs

dur, segs = asyncio.run(main())
ff = lambda *args: subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *args], check=True)
lst = os.path.join(work, 'segs.txt'); open(lst, 'w').write(''.join(f"file '{s}'\n" for s in segs))
video = os.path.join(work, 'video.mp4'); ff('-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', video)
fx, mix = os.path.join(work, 'fx.wav'), os.path.join(work, 'mix.wav')
if a.voice:
    ff('-i', a.voice, '-i', fx, '-filter_complex',
       f'[0:a]aresample={SR},apad=whole_dur={dur},loudnorm=I=-16:TP=-2,aresample={SR},asplit=2[v1][v2];'
       f'[1:a]loudnorm=I=-27:TP=-4:LRA=20,aresample={SR}[fx0];[fx0][v1]sidechaincompress=threshold=0.05:ratio=3:attack=10:release=250[fx];'
       f'[v2][fx]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11,aresample={SR},atrim=0:{dur}[a]', '-map', '[a]', mix)
else:
    ff('-i', fx, '-af', f'loudnorm=I=-16:TP=-1.5,atrim=0:{dur}', '-ar', str(SR), mix)
ff('-i', video, '-i', mix, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', a.out)
shutil.rmtree(work); print('wrote', a.out)
