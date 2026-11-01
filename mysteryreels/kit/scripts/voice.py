#!/usr/bin/env python3
"""Make the voiceover line by line, and write the timing that the animation follows.

python -I voice.py SCRIPT.json OUTDIR --engine elevenlabs --voice-id ID [--env-file .env.local]
python -I voice.py SCRIPT.json OUTDIR --engine windows       a built-in preview voice, not for publishing
python -I voice.py SCRIPT.json OUTDIR --engine estimate      timing only, with no audio
python -I voice.py SCRIPT.json OUTDIR --list-voices --env-file .env.local

SCRIPT.json: { "lines": [ { "shot": "hook", "cap": "CAPTION *WORD", "say": "Words as spoken." } ] }
Writes voice.wav and timing.js (window.TIMING). Generated lines are kept in OUTDIR/lines, so a re-run only pays
for lines whose text or voice changed. The ElevenLabs key comes from ELEVENLABS_API_KEY or from --env-file.
"""
import argparse
import difflib
import hashlib
import json
import os
import subprocess
import urllib.error
import urllib.request
import wave

API = "https://api.elevenlabs.io/v1"
LINE_GAP, SHOT_GAP, LEAD_IN, TAIL = 0.2, 0.42, 0.25, 1.8
ap = argparse.ArgumentParser()
ap.add_argument("script", nargs="?")
ap.add_argument("out", nargs="?")
ap.add_argument("--engine", choices=["elevenlabs", "windows", "estimate"], default="elevenlabs")
ap.add_argument("--voice-id")
ap.add_argument("--model", default="eleven_multilingual_v2")
ap.add_argument("--env-file")
ap.add_argument("--list-voices", action="store_true")
ap.add_argument("--alignment", help="timings from a finished one-take ElevenLabs voice, instead of generating lines")
a = ap.parse_args()


def api_key():
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key and a.env_file and os.path.exists(a.env_file):
        for ln in open(a.env_file, encoding="utf-8"):
            if ln.strip().startswith("ELEVENLABS_API_KEY="):
                key = ln.split("=", 1)[1].strip().strip("\"'")
    if not key:
        raise SystemExit("No ElevenLabs key found. Add ELEVENLABS_API_KEY=... to your .env.local file.")
    return key


def request(path, body=None):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body else None, headers={"xi-api-key": api_key(), "Content-Type": "application/json"})
    try:
        return urllib.request.urlopen(req, timeout=120).read()
    except urllib.error.HTTPError as e:
        raise SystemExit(f"ElevenLabs refused the request ({e.code}): {e.read().decode(errors='replace')[:400]}")


def to_wav(src, dst):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-ac", "1", "-ar", "44100", "-sample_fmt", "s16", dst], check=True)


def eleven(text, prev, nxt, path):
    mp3 = path + ".mp3"
    body = {"text": text, "model_id": a.model, "previous_text": prev, "next_text": nxt, "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.3}}
    open(mp3, "wb").write(request(f"/text-to-speech/{a.voice_id}?output_format=mp3_44100_128", body))
    to_wav(mp3, path)


def windows(text, path):
    raw = path + ".raw.wav"
    ps = "Add-Type -AssemblyName System.Speech; $s=New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SelectVoice('Microsoft David Desktop'); $s.Rate=0; $s.SetOutputToWaveFile($env:OUT_WAV); $s.Speak($env:SAY_TEXT); $s.Dispose()"
    subprocess.run(["powershell.exe", "-NoProfile", "-Command", ps], check=True, env={**os.environ, "OUT_WAV": os.path.abspath(raw), "SAY_TEXT": text})
    to_wav(raw, path)
    os.remove(raw)


if a.list_voices:
    for v in json.loads(request("/voices"))["voices"]:
        print(v["voice_id"], "|", v["name"], "|", v.get("category", ""), "|", ", ".join(str(x) for x in (v.get("labels") or {}).values()))
    raise SystemExit
if not a.script or not a.out:
    ap.error("SCRIPT.json and OUTDIR are required")
if a.engine == "elevenlabs" and not a.voice_id and not a.alignment:
    raise SystemExit("Choose a voice with --voice-id. Use --list-voices to see your voices.")

lines = json.load(open(a.script, encoding="utf-8"))["lines"]
if a.alignment:  # one finished take with ElevenLabs character timings, sent as all the lines joined by spaces
    al = json.load(open(a.alignment, encoding="utf-8"))
    chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    spoken = "".join(chars)
    text = " ".join(ln["say"] for ln in lines)
    idx = {}
    for x, y, n in difflib.SequenceMatcher(None, text, spoken, autojunk=False).get_matching_blocks():
        idx.update({x + k: y + k for k in range(n)})
    timed, pos = [], 0
    for ln in lines:
        hits = [idx[i] for i in range(pos, pos + len(ln["say"])) if i in idx]
        timed.append({"shot": ln["shot"], "cap": ln["cap"], "t0": round(st[hits[0]], 3), "t1": round(en[hits[-1]], 3)})
        pos += len(ln["say"]) + 1
    shots = {}
    for ln in timed:
        shots.setdefault(ln["shot"], round(max(0, ln["t0"] - 0.14), 3))
    duration = round(timed[-1]["t1"] + TAIL, 2)
    os.makedirs(a.out, exist_ok=True)
    open(os.path.join(a.out, "timing.js"), "w", encoding="utf-8").write("window.TIMING = " + json.dumps({"lines": timed, "shots": shots, "duration": duration}, ensure_ascii=False) + ";\n")
    print(f"{len(lines)} lines timed from the take, {duration}s, wrote timing.js")
    raise SystemExit
store = os.path.join(a.out, "lines")
os.makedirs(store, exist_ok=True)
tag = f"{a.engine}:{a.voice_id}:{a.model}"
t = LEAD_IN
timed, pcm, last_shot = [], [], None
for i, ln in enumerate(lines):
    if last_shot is not None:
        gap = SHOT_GAP if ln["shot"] != last_shot else LINE_GAP
        t += gap
        pcm.append(b"\0\0" * int(gap * 44100))
    elif a.engine != "estimate":
        pcm.append(b"\0\0" * int(LEAD_IN * 44100))
    if a.engine == "estimate":
        dur = len(ln["say"].split()) / 2.5 + 0.2
    else:
        prev = lines[i - 1]["say"] if i else ""
        nxt = lines[i + 1]["say"] if i + 1 < len(lines) else ""
        name = hashlib.sha1(f"{tag}|{prev}|{ln['say']}|{nxt}".encode()).hexdigest()[:16] + ".wav"
        path = os.path.join(store, name)
        if not os.path.exists(path):
            print("voicing:", ln["say"])
            eleven(ln["say"], prev, nxt, path) if a.engine == "elevenlabs" else windows(ln["say"], path)
        with wave.open(path) as w:
            pcm.append(w.readframes(w.getnframes()))
            dur = w.getnframes() / w.getframerate()
    timed.append({"shot": ln["shot"], "cap": ln["cap"], "t0": round(t, 3), "t1": round(t + dur, 3)})
    t += dur
    last_shot = ln["shot"]

duration = round(t + TAIL, 2)
shots = {}
for ln in timed:
    shots.setdefault(ln["shot"], round(max(0, ln["t0"] - LEAD_IN), 3))
if a.engine != "estimate":
    with wave.open(os.path.join(a.out, "voice.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(44100)
        w.writeframes(b"".join(pcm))
open(os.path.join(a.out, "timing.js"), "w", encoding="utf-8").write("window.TIMING = " + json.dumps({"lines": timed, "shots": shots, "duration": duration}, ensure_ascii=False) + ";\n")
print(f"{len(lines)} lines, {duration}s, engine {a.engine}, wrote timing.js")
