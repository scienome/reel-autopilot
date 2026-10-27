# Toy reels (Brick Toy style, Steve's voice)

Vertical 9:16 explainer reels in the Brick Toy style, voiced by ElevenLabs (Steve, `IvUJKFyjVb5hItY9dJAT`) and rendered on GitHub.

## How it works
1. Each reel is a folder in `reels/` with `script.json` (the words, by beat), `story.js` (the animation) and `meta.json` (title, caption, hashtags, cover time).
2. Pushing a change to `toyreels/reels/**` on `main` runs **Make toy reels** (`.github/workflows/make-toyreels.yml`).
3. GitHub voices the script, times every word from the voice, renders the MP4 and publishes it under **Releases** as `toyreel-<id>` with `cover.jpg` and `caption.txt`.
4. The voice is committed back to the repo, so a re-render never pays ElevenLabs twice.

To remake one reel by hand: Actions → Make toy reels → Run workflow → type the folder name.

## The first 10
| # | Reel | Series |
|---|---|---|
| 01 | The Mona Lisa heist (1911) | Greatest Heists 1/4 |
| 02 | D.B. Cooper (1971) | Greatest Heists 2/4 |
| 03 | The Antwerp diamond heist (2003) | Greatest Heists 3/4 |
| 04 | The Gardner Museum heist (1990) | Greatest Heists 4/4 |
| 05 | How long can you go without sleep? | Your Weird Body |
| 06 | Does cracking your knuckles cause arthritis? | Your Weird Body |
| 07 | Why do you get goosebumps? | Your Weird Body |
| 08 | What happens to your body in space? | Your Weird Body |
| 09 | What happens in your body in one second? | Your Weird Body |
| 10 | The man who hiccupped for 68 years | Your Weird Body |

## Local tools
- `python tools/check.py reels/<id> --times 3 10` – draws key frames to `out/<id>_check/`.
- `python tools/produce.py reels/<id> --no-voice` – silent render on estimated timing.
