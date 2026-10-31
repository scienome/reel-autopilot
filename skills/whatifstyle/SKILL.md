---
name: whatifstyle
description: Make a vertical 9:16 "What if...?" science explainer reel in the Flat Science style (bright flat vector art, big-head cartoon characters, zooms from a person into their body or cells, small coloured label tags, big number cards, day-by-day escalation, a looping ending), timed to a voiceover, as an HTML player and an MP4. Use this whenever the user types /whatifstyle, or asks for a "what if" short, a flat vector, Kurzgesagt-like or colourful cartoon science video, or a "what happens to your body if..." reel, even if they only give a topic.
---

# Flat Science "What if" reel (/whatifstyle)

Turn a topic, script or voiceover into a 720x1280 reel of about 45-60 seconds: an HTML player plus an MP4. The art is drawn in code, so no image generator is needed. Build on the kit rather than redrawing the style, because the kit is what keeps every reel looking like one channel.

## What's in this skill

| File | What it is | When to read it |
|---|---|---|
| `assets/example_water.js` | A complete reel, "What if you stopped drinking water?" | First: copy it and swap the story |
| `references/flatkit.js` | `FLAT`: `person`, `SET` (bedroom, office, lab, warm, space), `cellField`, `brain`, `blob`, `xray`, `spiral`, `tag`, `stat`, `meter`, `calendar`, `dayCard`, `caption`, `say`, `cam`, `camAt`, `runShots`, `endCard` | Before the storyboard |
| `references/harness.js`, `references/sound.js` | Helpers and synthesized effects | Include unchanged |
| `assets/player_body.html` | The player page | Page body |
| `scripts/build_page.py`, `render_reel.py`, `voice_segments.py` | Build the page, render the MP4, measure a voice take | See below |

## The formula

Follow this shape, whatever the topic. It is what makes people stay.

1. **Hook, 0-7 s.** A person in one calm scene. The caption is the "What if...?" question, word by word.
2. **The first sign, 7-13 s.** A small, relatable effect, with a label and one number.
3. **Zoom inside, 13-24 s.** An `xray` circle opens on the body, the camera dives through it, and we are among cells or organs. Label each new thing as it appears. This is the "wow" part.
4. **It gets worse, 24-35 s.** Back out with a time tag ("Day 2", "Day 3"). Each stage has its own colour world and a stronger effect. Peak with the wildest image, such as the `spiral`.
5. **The surprise, 35-41 s.** One unexpected true fact, usually a real record or study: a new warm-coloured set, a `dayCard` or `calendar` counting up, a big `stat`.
6. **Takeaway, 41-47 s.** Return to the opening room, changed. One short line.
7. **Loop, last 3 s.** `endCard` "What if...?", ending close to the first frame so the reel replays cleanly.

**Script rules:** 110-150 words. Short sentences. Every line must be something you can show. Spell numbers as they should be spoken in the voice text. Check every fact, keep the sources in `FACTS`, and never state a health claim more strongly than the source does. Never present a dangerous stunt as something to try; end on the safe takeaway.

## Workflow

1. **Script.** Write it, or take the user's, and list the facts relied on.
2. **Time it.** With audio: `python scripts/voice_segments.py voice.mp3`, then set shot times and `say()` times from it. Without audio: estimate 2.7 words a second and say the times are estimates.
3. **Build.** Copy `example_water.js` to `reel.js`. Replace the shots, `DURATION`, `FACTS` and `scoreSound`. Draw new props in the kit's language (see the rules below), and add them to `reel.js`; add one to the kit only if other reels will use it.
4. **Build the pages**, from the skill folder:

```bash
python scripts/build_page.py assets/player_body.html render.html references/harness.js references/sound.js references/flatkit.js reel.js --title "Reel name"
```

Add `--voice voice.mp3 --poster 3` and a different output name for the version to watch in a browser.

5. **Check frames.** Draw about 14 moments and look at them before rendering (use playwright: open the page, call `seek(t)`, save the canvas). Look for the checks below.
6. **Render.**

```bash
python scripts/render_reel.py render.html reel.mp4 --voice voice.mp3 --workers 6
```

Needs playwright with chromium, and ffmpeg. Leave out `--voice` for a sound-effects-only preview. Check a few frames of the final MP4, then send it.

## The look

- **Flat colour, no outlines.** Shade with a darker tone of the same colour, never with black. Light comes from soft beams and glows.
- **Each stage has its own world:** violet night, sky-blue day, orange-warm for records, mint lab, deep indigo for the ending. Stay in the `P` palette.
- **Characters:** big head, large white eyes, heavy lids for tiredness, tube limbs, mitten hands. Show state through `mood`: `ok`, `happy`, `tired`, `drained`, `sad`, `shock`, `dizzy`. Keep one lead character across the whole reel.
- **The camera never stops.** Every shot pushes slowly (`camAt`). Move between ideas by zooming through something, and use a hard wipe or flash only for a new chapter. Aim for 6-8 shots, each 5-12 s, with something new appearing every 2-3 s inside it.

## Text

- **Captions** in the top third, at least 48 px, with one hot word in colour. Short phrases only; the voice carries the rest.
- **`tag`** names a thing, with a leader line to it. At least 25 px.
- **`stat`** holds the one big number. Roll numbers up over time.
- Keep key text out of the top 10% and the bottom 20%, where reel apps put their buttons.

## Checks

- Captions and tags never cover a face or each other.
- `xray` circles sit on the head or organ they zoom into, and the camera's last key lands on that same point.
- Science on screen is right, and every number matches a source in `FACTS`.
- Inside a shot, `caption` and `say` use `u` (seconds into the shot), not `t`, or every caption shows at once.
- Frames are a pure function of t: use `H.rng(seed)`, never `Math.random`.
- Make it original: new topics, scripts and characters. Do not copy another channel's script, characters or scenes.

## Sound

Cue effects in `window.scoreSound(k)` with `k.play(name, time, opts)`, from the same times as the picture: `whoosh` on zooms, `shutter` on flashes, `pop` on tags and `tick` on counters (both with `{ minor: true }`), `impact` on the worst moment, `ding` or `success` on the surprise, `sparkle` on the ending.

## Using it in this repo

For a real channel, make a new series folder following `mythreels/` (`reels/<id>/script.json`, `story.js`, `meta.json`), with this kit in `libs`. That needs its own workflow and poster, so confirm the channel with the owner before posting anything.
