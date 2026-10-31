# Riddle channel (no account yet, nothing posts)

Hinglish animal riddles in the `skills/whatifstyle` style. The owner approved the mix on 31 Oct 2026. Voice:
`lOJWQNMBIzoU3N0EnOya`. MP4s of week 1 are in the Release `riddle-week1`. `week1.json` holds the 7-day plan, titles,
captions and first comments.

| Reels | Code (`skills/whatifstyle/assets/`) | Voice | Lengths |
|---|---|---|---|
| jungle-court | `example_court.js` | `voice/court` | `voice_lengths_court.js` |
| amavasya, bridge, doors | `riddle_amavasya.js`, `riddle_bridge.js`, `riddle_doors.js` | `voice/batch1` | `voice_lengths_batch1.js` |
| the other 17 | `riddle_week.js`, picked with `window.RID` (d-t) | `voice/batch2` | `voice_lengths_batch2.js` |

Lines to voice go in a JSON list here (`batch1_lines.json`, `batch2_lines.json`). Run the "Voice audition" workflow with
`voices=<id>`, `lang=lines:riddles/<file>.json`, `mine=false`. It publishes one MP3 per line to the Release
`voice-audition`, replacing what was there, so copy new takes into `voice/` at once.

Build a page by joining, in order: `references/harness.js`, `sound.js`, `flatkit.js`, `animals.js`, `riddlekit.js`, the
lengths file, for `riddle_week.js` a `window.RID='d';` line, then the reel file (`scripts/build_page.py`). `example_court.js`
does not need `riddlekit.js`. Mix the line MP3s onto one track, each at its shot's start in `window.SHOT_STARTS`. Render with
`scripts/render_reel.py PAGE OUT.mp4 --voice TRACK.mp3 --music`.
