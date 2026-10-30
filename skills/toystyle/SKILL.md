---
name: toystyle
description: Make a vertical 9:16 animated explainer reel in the "Brick Toy" style (chunky plastic brick figures, studs, toy dioramas on a grass lawn or blue tiled studio, red plastic number tags, popping keyword captions), timed to a voiceover, as an interactive HTML player and a rendered MP4. Use this whenever the user types /toystyle, asks for a brick toy, toy brick, LEGO-like, blocky toy or plastic toy style video, reel, short or explainer, or wants a "what if..." faceless short in a toy style, even if they only give a topic and no script or voiceover yet.
---

# Brick Toy reel (/toystyle)

Turn a topic, script or voiceover into a vertical 9:16 (720x1280) explainer reel in the Brick Toy style: an interactive HTML player (artifact) plus, when a shell is available, a rendered MP4 with the voiceover mixed over the sound effects.

The style is already built. `references/bricktoy.js` is a working renderer with every recipe the look needs, and the scripts handle timing, page assembly and rendering. Build each new reel on that code rather than redrawing the style from scratch: that is what keeps it looking like the real medium, and it saves a lot of time.

## What's in this skill

| File | What it is | When to read it |
|---|---|---|
| `references/bricktoy.js` | The reference style: the plastic renderer (`Scene` with `box`, `cyl`, `brick`, `figure`, `tag`, `render`), the sets (`grassSet`, `studioSet`), the finishing pass (`finish`, `grain`), `caption`, `shutter`, `shotCam`, `popU`, `machine`, `portrait`, an example explainer ("How does AI learn?"), a hero frame and its sound design | Before the storyboard: read it fully, it is the style |
| `references/harness.js` | The H helper library (seeded rng, noise, easing, colour, layers, vignette) | Include unchanged |
| `references/sound.js` | The SOUND kit (synthesized effects, voiceover mode, live and offline rendering) | Include unchanged; skim the named sounds |
| `assets/player_body.html` | The 9:16 player: letterboxed canvas, play/pause, scrub, time, sound toggle, loop, "Load voiceover" with drag and drop, built-in voiceover support, `window.seek` | Use as the page body |
| `scripts/voice_segments.py` | Measures where the voice speaks (segments and pauses) from the loudness envelope | When you have the audio |
| `scripts/build_page.py` | Injects the JS into the player body; optionally embeds the voiceover | To make the artifact and the render page |
| `scripts/render_reel.py` | Renders the page to MP4 frame by frame, renders the effects offline, mixes the voice on top with the effects ducked | For the final video |

## Workflow

### 1. Gather the content

- **Topic only**: write a voice-ready script first (about 45-60 s, roughly 130-160 words, short punchy sentences, the hook as a question). Spell out numbers the way they should be spoken ("two point three kilowatt-hours"), since text-to-speech tools read digits unpredictably. Check every fact and number before it goes in the script and list the ones you relied on. Give the user the script so they can record it or generate it (for example with ElevenLabs), and offer an SRT with your estimated timing as a pacing guide.
- **Script without audio**: storyboard on estimated timing (about 2.7 words per second, ~0.35 s pause at a full stop, ~0.2 s at a comma), say clearly that the times are estimates, and re-time when the audio arrives.
- **Audio attached** (mp3, wav, m4a): that take is the clock. Measure it (step 2).
- **SRT or word timestamps pasted**: use them directly.

### 2. Time it from the voiceover: the BEATS table

Every time in the animation comes from one BEATS table, so a new take only means editing the table.

1. Run `python3 scripts/voice_segments.py voice.mp3`. It lists the speech segments and the pause before each one.
2. Split the script into phrases at sentence ends, commas and colons, and map them onto the segments in order. Most map one to one. A phrase can span several segments when the voice pauses inside it ("Plan A: | the disguise").
3. When a long segment hides a word break you need, `--dips START END` lists the deep quiet points inside it.
4. Store each beat as `{ id, phrases: [[text, [[t0, t1], ...], starts?], ...] }`. `starts` (optional) gives the word index where each segment begins when the break falls on a known word. Inside a segment, place words by syllable count. This lands reveals within a fraction of a second without a speech-recognition model.
5. Helpers: `W(id, word, n)` returns a word's time and `V(...)` returns that time minus 0.12 s. Visuals lead the word by up to 0.2 s and never lag it.
6. `DURATION` = end of the last word + about 1 s.

Shot changes sit in the pauses between beats. A shot can cut on the first word of the next beat.

### 3. Storyboard first, then wait for the user's OK

Make one HTML artifact with a grid of panels, one per beat (about 6-10), each a 720x1280 canvas showing that beat's key frame drawn with the real renderer, so the panels already look like the finished piece. Use 3-4 columns on desktop and 1 on phones. Still frames only.

Under each panel show:
- the beat number;
- its start and end time;
- the exact on-screen text (captions, tags);
- how it gets there from the previous panel: a continuous shot (what carries over and how it moves) or a scene change (which transition, and why the story wants one);
- its key sounds.

Below the grid, list the facts and numbers you assumed, and the script with times.

Render the key frames headless first and look at them (see "Checking frames"). Then publish, and wait for approval or changes before building.

### 4. Build the animation

Create `engine.js` from a copy of `references/bricktoy.js`:
- Keep the renderer, sets, finishing, caption, tag, shutter and helpers.
- Replace `EXPLAIN`, `HERO` and the `registerStyle({...})` call with your story.
- Export the contract the player expects:

```js
window.LESSON = { BEATS, DURATION, explainer: (ctx, W, H_, t) => { /* your shots */ } };
function scoreSound(k) { /* effects, times from BEATS */ }
window.scoreSound = scoreSound;
```

Then assemble two pages:

```bash
python3 scripts/build_page.py assets/player_body.html reel.html references/harness.js references/sound.js engine.js --voice voice.mp3 --title "Reel name" --poster 4.0
python3 scripts/build_page.py assets/player_body.html render.html references/harness.js references/sound.js engine.js
```

Publish `reel.html` as the artifact; keep `render.html` for frame rendering. The player also accepts a voiceover dropped onto it, and the loaded audio becomes the clock.

### 5. Render the MP4 (when you have a shell)

```bash
python3 scripts/render_reel.py render.html reel.mp4 --voice voice.mp3
```

The script needs playwright with chromium, ffmpeg and the fonts installed locally. Google Fonts is often unreachable from a sandbox, so take Poppins from GitHub:
```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/google/fonts.git /tmp/gf && cd /tmp/gf && git sparse-checkout set ofl/poppins
mkdir -p ~/.local/share/fonts && cp ofl/poppins/Poppins-{SemiBold,ExtraBold}.ttf ~/.local/share/fonts/ && fc-cache -f
```
If the fonts can't be installed, say so: the MP4 would use a fallback face, while the HTML player still loads Poppins in the user's browser.

Spot-check a few frames from the MP4, then send it to the user.

## The style (keep the medium, change the story)

**Look.** Chunky plastic brick figures in a bright toy diorama: bevelled bricks with studs and glossy plastic highlights; block characters with cube heads, printed faces and caps or hard hats; soft shadows on a grass lawn (sky, puffy clouds, soft-focus trees) or a blue tiled studio sweep; a soft-focus background; big red plastic number tags with white numerals.

**Motion.** Bricks drop in and snap together with a bounce. Figures bob, wave and jump. Tags pop in (back-ease) and count up, re-printed every frame as the number climbs. Captions pop in word by word. The camera pushes in slowly through every shot and cuts hard between shots. A new chapter can be revealed by the roll-up shutter.

**How it explains.** Short shots with hard cuts, each one a small diorama.
- **Captions:** one or two lines in the upper third. Words pop in as they are spoken, with the key word in a toy colour (green `g`, yellow `y`, orange `o`, red `r` in `caption()`).
- **Numbers:** they live on red plastic tags in the lower third. A tag turns green when the number reaches its final value, if that value is a good outcome.
- **Wrong moments:** a red brick X slams on with a camera push-in and a flash.
- **Right moments:** a green brick tick pops on.

**Rules that keep it looking right**
- Draw every subject with the renderer's plastic parts (`box`, `cyl`, `brick`, `figure`, `tag`), so new props share the bevels, highlights and shadows. Build new subjects accurately for the topic (an engine, a heart, a volcano, a planet cutaway) from these parts. Carry over the reference's props (the teal machine, the cat and dog photo cubes) only when they genuinely fit, and double-check the science shown.
- Run `finish()` (bloom, warm grade, vignette, grain) and the soft-focus background on every frame at the reference strength. They are what make it read as a toy photo rather than flat 3D.
- Every frame is a pure function of t. All randomness comes from `H.rng(seed)` / `H.makeNoise(seed)`, never `Math.random`, and a random value used inside a transform callback must be drawn once outside it (one draw per vertex shreds the shape). Caching static textures is fine.
- **Legibility on a phone at 720x1280:** headlines and captions at least 44px (the reference uses 50px), every label the story depends on at least 28px, key numbers at least 64px on screen. Keep captions and key numbers out of the top 10% and the bottom 20%, where reel apps overlay their UI. Frame each shot so its subject fills most of the frame between the caption band and the bottom safe zone.
- **Captions are this style's text**, as in the source videos. Show the key phrase being spoken rather than every word of a long sentence; labels and numbers otherwise go on tags.
- **Flow:** decide shot by shot. A new idea often gets a hard cut (the medium's own way). When the next idea builds on the last, keep the same diorama and let things grow, stack, swap or count on. Use the shutter for a big reveal or a turn in the story. Avoid both a cut on every sentence and one endless shot.
- Keep frames fast, well under 100 ms where possible. The reference runs about 55-110 ms in software rendering. The grass blades are batched by colour and width, and the background renders at quarter resolution; keep those tricks.

## Sound (voiceover mode)

Score it fully with the kit, in the medium's own sounds:
- brick clacks and stud clicks as bricks land;
- soft plastic tocks for figures;
- pops for tags and captions;
- plastic-dial ticks for counters;
- a tiny swish on each hard cut;
- `roller` for the shutter and conveyors;
- `slap`, `thud` and `buzz` for a wrong answer;
- `success`, `ding` and `sparkle` for right answers and the takeaway.

How to schedule them:
- Mark small frequent sounds `{ minor: true }`, and call `SOUND.live` / `SOUND.renderOffline` with `{ voiceover: true }`. That mode drops beds and music, plays minor sounds at about 60% and keeps the voice on top.
- Keep the big hits at full volume, placed in pauses or on stressed words.
- Every sound starts on the frame its event appears, using the same BEATS times as the picture.

## Checking frames

Before showing the storyboard and before rendering, draw the key moments headless and look at them. Use playwright to load a small page that includes the harness, the kit and the engine, call `explainer(ctx, 720, 1280, t)` and screenshot the canvas.

What to look for:
- text clipped at the edges, or captions colliding with tags or props;
- props cut off at the sides (the frame is narrow, so keep subjects within about ±2 world units at the subject's depth);
- arms rotating the wrong way (`figure` arms: positive = raised outward);
- anything drawn behind the camera;
- whether the timing reads: a number visible as it is spoken.

Fix what you see, then look once more.

## Delivering

Finish with the artifact link and the MP4 (when rendered), with one line on how the timing was set (measured from the take, or estimated). Offer one natural next step, such as nudging a moment by its timestamp.
