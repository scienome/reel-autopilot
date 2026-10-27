# Mechanic reels (low-poly "how it works", 9:16)

Vertical engineering explainers in the Mechanic style (garage + red stand, sunset test road, x-ray glass parts, glowing
flow beads, one-word captions), voiced by ElevenLabs and rendered on GitHub. Same flow as the Brick Toy reels: Claude
writes the reel, you push (or Claude pushes), GitHub does the voice and the render.

## How it works
1. Each reel is a folder in `reels/` with:
   - `script.json` – the voiceover, by beat: `[{ "id": "hook", "text": "..." }, ...]`. Numbers spelled out.
   - `story.js` – the animation, built on `style/mech_base.js` (renderer, sets, props, FX, captions). Every visual
     event hangs on a word time `V(beatId, 'WORD')`. Do not end the file with a closing brace (the build adds it).
   - `meta.json` – title, caption, hashtags, `cover_t`, sources, and optional `libs` (shared prop files such as `mechreels/props/gimli.js`).
2. Pushing a change to `mechreels/reels/**` on `main` runs **Make mechanic reels** (`.github/workflows/make-mechreels.yml`).
3. GitHub sends the script to ElevenLabs' with-timestamps endpoint, so every word gets an exact start time; the
   animation re-times itself to the take, renders the MP4 and publishes a Release `mechreel-<id>` with the MP4,
   `cover.jpg`, `caption.txt` and `<id>_player.html` (interactive player with the voice built in).
4. The voice (`voice.mp3`, `timing.json`, `voice_raw.json`) is committed back, so a re-render never pays ElevenLabs twice.
   Changing the script text or the voice in `config.json` makes a new take.

To remake one reel by hand: Actions → Make mechanic reels → Run workflow → type the folder name.

## Voice
`config.json` → `voice.voice_id` (Brian, `nPczCjzI2devNBz1zQrb`, an ElevenLabs default voice) and `voice.model_id`.
Changing the voice (or anything in `style/`) and pushing to main remakes every Mechanic reel with the new voice. Needs the
`ELEVENLABS_API_KEY` repository secret. A reel is about 1,000–1,300 characters.

## Local tools
- `python tools/check.py reels/<id> [--times 3 10]` – key frames to `out/<id>_check/sheet.png` (estimated timing until a voice exists).
- `python tools/produce.py reels/<id> --no-voice` – silent render on estimated timing.
- `python tools/build.py reels/<id> out/player.html --voice` – the interactive player page.

## Reels
| # | Reel |
|---|---|
| 01 | How a car's differential works |
| 02 | One number emptied this jet's tanks (Short for mechvideo 001) |
| 03 | The tiny propeller that saved 69 people (Short for mechvideo 001) |
| 04 | A jet landed in the middle of a car race (Short for mechvideo 001) |
| 05 | Why plane windows can't be square (Short for mechvideo 002) |
| 06 | The first jet airliner kept falling apart (Short for mechvideo 002) |
| 07 | Your plane is a metal balloon (Short for mechvideo 002) |
| 08 | He cut the only rope, on purpose (Short for mechvideo 003) |
| 09 | She fell 75 floors in an elevator and lived (Short for mechvideo 003) |
| 10 | Why elevators have so many cables (Short for mechvideo 003) |
| 11 | The pressure at the Titanic's depth (Short for mechvideo 004) |
| 12 | Why Titan's carbon fibre hull failed (Short for mechvideo 004) |
| 13 | The Titan implosion took milliseconds (Short for mechvideo 004) |
| 14 | What a goose does to a jet engine (Short for mechvideo 005) |
| 15 | 208 seconds to land on a river (Short for mechvideo 005) |
| 16 | Why landing on water is so hard (Short for mechvideo 005) |
