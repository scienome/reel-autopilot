# Mechanic YouTube videos (16:9, low-poly "how it works")

4-5 minute 1920x1080 explainers in the Mechanic style, voiced by ElevenLabs (Brian) and rendered on GitHub.
Each video gets 3 vertical Shorts in `mechreels/reels/` that open on its most shocking moment and point to the full video.

## How it works
1. Each video is a folder in `videos/` with:
   - `script.json` – chapters -> beats -> phrases (numbers spelled out). Chapters become YouTube chapter timestamps.
   - `story.js` – the animation on `style/mech_base.js`; every event hangs on `V(beatId, 'WORD')`. No closing brace at the end.
   - `meta.json` – title, description, tags, sources, footer (the comment question), and `libs`: shared prop files
     (e.g. `mechreels/props/gimli.js`, also used by that video's Shorts).
2. Pushing to `mechvideos/videos/**` on `main` runs **Make mechanic videos**: ElevenLabs voice chapter by chapter with
   word timestamps -> 1080p render -> `thumbnail.jpg` (from `LESSON.thumbnail`) -> `youtube.txt` (title, description with
   chapter times, sources, tags) -> Release `mechvideo-<id>`.
3. The voice is committed back (`voice.mp3`, `timing.json`, `voice_chunks/`), so re-renders cost no ElevenLabs credits.

## Local tools
- `python tools/check.py videos/<id> [--times 3 60]` – key frames (estimated timing until a voice exists).
- `python tools/produce.py videos/<id> --no-voice --end 10` – a short silent test render.

## Videos
| # | Video | Shorts |
|---|---|---|
| 001 | How a Jet Flew With No Engines (The Gimli Glider) | mechreels 02, 03, 04 |
| 002 | Why Plane Windows Are Round (3 Jets Fell Apart First) | mechreels 05, 06, 07 |
| 003 | What Happens If an Elevator Cable Snaps? | mechreels 08, 09, 10 |
