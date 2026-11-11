#!/usr/bin/env python3
"""Render a diorama (3D toy) reel through a local browser.

python -I render.py sheet STORY.js OUT.png [t ...]        draw key moments on one contact sheet
python -I render.py video STORY.js OUT.mp4 [--voice F]    render the full video, mixing in a voiceover if given

STORY.js must set window.REEL = { DURATION, draw(ctx, t), score(k) }. Fonts load from Google Fonts,
so the first run needs internet. Needs Python playwright, ffmpeg, and Edge or Chromium.
"""
import argparse
import asyncio
import base64
import math
import os
import shutil
import struct
import subprocess
import tempfile

from playwright.async_api import async_playwright

refs = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "references")
kit = os.path.dirname(refs)
SOUND = os.path.join(os.path.dirname(os.path.dirname(kit)), "mysteryreels", "kit", "references", "sound.js")
if not os.path.exists(SOUND):
    SOUND = os.path.join(refs, "sound.js")
read = lambda p: open(p, encoding="utf-8").read()
ap = argparse.ArgumentParser()
ap.add_argument("mode", choices=["sheet", "video"])
ap.add_argument("story")
ap.add_argument("out")
ap.add_argument("times", nargs="*", type=float)
ap.add_argument("--voice")
ap.add_argument("--timing", help="timing.js from voice.py, for stories that follow window.TIMING")
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--workers", type=int, default=4)
a = ap.parse_args()
FONTS = ['400 60px "Lilita One"']
THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"
HTML = (
    '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
    'family=Lilita+One&display=block"></head>'
    '<body style="margin:0"><canvas id="c" width="720" height="1280"></canvas></body></html>'
)
ff = lambda *x: subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *x], check=True)
SHOT = '(t)=>{const c=document.getElementById("c"),x=c.getContext("2d",{willReadFrequently:true});x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;REEL.draw(x,t);return c.toDataURL("image/png")}'


GL = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"]


async def launch(p):
    try:
        return await p.chromium.launch(channel="msedge", args=GL)
    except Exception:
        return await p.chromium.launch(args=GL)


async def page(b):
    pg = await b.new_page(viewport={"width": 720, "height": 1280})
    pg.on("pageerror", lambda e: print("page error:", e))
    await pg.set_content(HTML)
    ok = await pg.evaluate("async (fs)=>{await Promise.all(fs.map(f=>document.fonts.load(f,'AaZz09'))); await document.fonts.ready; return fs.every(f=>document.fonts.check(f))}", FONTS)
    if not ok:
        print("WARNING: some fonts did not load, so text will use a fallback")
    three = os.path.join(refs, "three.min.js")
    if os.path.exists(three):
        await pg.add_script_tag(content=read(three))
    else:
        await pg.add_script_tag(url=THREE_URL)
    for f in [SOUND, os.path.join(refs, "diorama.js"), os.path.join(refs, "city.js"), os.path.join(refs, "life.js"), os.path.join(refs, "wedding.js"), os.path.join(refs, "hook.js"), *([os.path.join(refs, "toy3d.js")] if os.path.exists(os.path.join(refs, "toy3d.js")) else []), *([os.path.join(refs, "hands.js")] if os.path.exists(os.path.join(refs, "hands.js")) else []), *([os.path.join(refs, "diy3d.js")] if os.path.exists(os.path.join(refs, "diy3d.js")) else [])]:
        await pg.add_script_tag(content=read(f))
    await pg.evaluate("async () => { if (window.HANDS_READY) await window.HANDS_READY; }")  # rigged hand models (hands.js) load async
    for f in [*([a.timing] if a.timing else []), a.story]:
        await pg.add_script_tag(content=read(f))
    return pg


async def main():
    work = tempfile.mkdtemp()
    frames = os.path.join(work, "f")
    os.makedirs(frames)
    async with async_playwright() as p:
        b = await launch(p)
        pg = await page(b)
        if a.mode == "sheet":
            dur = await pg.evaluate("REEL.DURATION")
            ts = a.times or [dur * (i + 0.5) / 12 for i in range(12)]
            for i, t in enumerate(ts):
                url = await pg.evaluate(SHOT, t)
                open(os.path.join(frames, f"k{i:02d}.png"), "wb").write(base64.b64decode(url.split(",")[1]))
            cols = min(len(ts), 6)
            ff("-framerate", "1", "-start_number", "0", "-i", os.path.join(frames, "k%02d.png"), "-vf", f"scale=300:-1,tile={cols}x{(len(ts) + cols - 1) // cols}:padding=6:color=gray", "-frames:v", "1", a.out)
        else:
            dur = await pg.evaluate("REEL.DURATION")
            n = math.ceil(dur * a.fps)
            r = await pg.evaluate(
                """async(vo)=>{const s=await SOUND.renderOffline(REEL.score,REEL.DURATION,48000,{voiceover:vo});
                const u=new Uint8Array(s.inter.buffer);let bin='';for(let i=0;i<u.length;i+=32768)bin+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(bin)}""",
                bool(a.voice),
            )
            data = base64.b64decode(r)
            fx = os.path.join(work, "fx.wav")
            with open(fx, "wb") as f:
                f.write(b"RIFF" + struct.pack("<I", 36 + len(data)) + b"WAVEfmt " + struct.pack("<IHHIIHH", 16, 3, 2, 48000, 48000 * 8, 8, 32) + b"data" + struct.pack("<I", len(data)) + data)

            async def worker(k):
                wp = await page(b)
                for i in range(k, n, a.workers):
                    url = await wp.evaluate(SHOT, i / a.fps)
                    open(os.path.join(frames, f"f{i:05d}.png"), "wb").write(base64.b64decode(url.split(",")[1]))

            await asyncio.gather(*[worker(k) for k in range(a.workers)])
            video = os.path.join(work, "v.mp4")
            ff("-framerate", str(a.fps), "-i", os.path.join(frames, "f%05d.png"), "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", video)
            mix = os.path.join(work, "mix.wav")
            if a.voice:
                ff("-i", a.voice, "-i", fx, "-filter_complex", f"[0:a]aresample=48000,apad=whole_dur={dur},asplit=2[v1][v2];[1:a]aresample=48000[fx0];[fx0][v1]sidechaincompress=threshold=0.05:ratio=3[fx];[v2][fx]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-16:TP=-1.5,aresample=48000,atrim=0:{dur}[a]", "-map", "[a]", mix)
            else:
                ff("-i", fx, "-af", f"loudnorm=I=-16:TP=-1.5,aresample=48000,atrim=0:{dur}", mix)
            ff("-i", video, "-i", mix, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", a.out)
            print("wrote", a.out)
        await b.close()
    shutil.rmtree(work)


asyncio.run(main())
