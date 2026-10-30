---
name: "mechanicskill"
description: "Make a vertical 9:16 \"how it works\" engineering reel in the Mechanic low-poly 3D style (garage + red stand or sunset test road, x-ray glass parts, glowing flow beads, one-word captions), timed to a voiceover. Use for /mechanicskill."
---

# Mechanic reel (/mechanicskill)

Turn a topic, script or voiceover into a vertical 9:16 (720x1280) "how it works" engineering reel in the Mechanic style. The output is an interactive HTML player (artifact) plus, when a shell is available, a rendered MP4 with the voiceover mixed over the sound effects.

Use this skill when the user types /mechanicskill, or asks for a low-poly 3D engineering explainer, an engineering.animated-style reel, or a "how does a car engine / brake / gearbox / jet engine / rocket / electric car work" short. It applies even if they only give a topic and no script or voiceover yet.

The style is already built. A working renderer with every recipe the look needs, plus the player and the timing and render scripts, ship in this skill's folder. Build each new reel on that code rather than redrawing the style from scratch: that is what keeps it looking like the real medium.

## Step 0: copy the style files

The style files ship inside this skill's own folder (next to this SKILL.md): `references/`, `assets/` and `scripts/`. Copy that folder into a working directory in the scratchpad and work from the copy. Nothing needs fetching.

If the files are missing from the skill folder, say so plainly and ask the user to re-upload the complete skill zip.

| File | What it is | When to read it |
|---|---|---|
| `references/mech.js` | The reference style: the low-poly renderer (`Scene` with `box`, `cyl`, `rod`, `tube`, `ico`, `quad`, `arrow`, `beads`, `face`, `render`), cameras (`orbit`, `dolly`), animation helpers (`popU`, `ramp`, `flyIn`), sets (`garage`, `stand`, `testRoad`, `sunsetSky`, `tree`, `barrier`, `gantry`), props (`car`, `fuelDrop`, `gauge`), 2D overlays (`FX.spin`, `FX.no`, `FX.heat`, `FX.sparks`, `FX.confetti`), the one-word caption (`word`, `captionAt`, `wordsFrom`), `finish`, an example explainer ("How car brakes work"), a hero frame and its sound design | Before the storyboard: read it fully, it is the style |
| `references/harness.js` | The H helper library (seeded rng, noise, easing, colour, layers, vignette) | Include unchanged |
| `references/sound.js` | The SOUND kit (synthesized effects, voiceover mode, live and offline rendering) | Include unchanged; skim the named sounds |
| `assets/player_body.html` | The 9:16 player: letterboxed canvas, play/pause, scrub, time, sound toggle, loop, "Load voiceover" with drag and drop, built-in voiceover support, `window.seek` | Use as the page body |
| `scripts/voice_segments.py` | Measures where the voice speaks (segments and pauses) from the loudness envelope | When you have the audio |
| `scripts/build_page.py` | Injects the JS into the player body; optionally embeds the voiceover | To make the artifact and the render page |
| `scripts/render_reel.py` | Renders the page to MP4 frame by frame, renders the effects offline, mixes the voice on top with the effects ducked | For the final video |

## Workflow

### 1. Gather the content

- **Topic only**: write a voice-ready script first: about 45-90 s, plain spoken sentences that walk through the machine part by part. Name each part or flow on the sentence where it appears, give a problem then a solution ("But there's a problem... so engineers added..."), and end with a satisfying finale.
  - Spell out numbers the way they should be spoken, since text-to-speech tools read digits unpredictably.
  - Engineering facts matter here. Check every mechanism, number and claim before it goes in the script, and list the ones you relied on, with sources when you looked them up.
  - Give the user the script so they can record or generate it (for example with ElevenLabs), and offer an SRT with your estimated timing as a pacing guide.
- **Script without audio**: storyboard on estimated timing (about 2.7 words per second, ~0.35 s pause at a full stop, ~0.2 s at a comma). Say clearly that the times are estimates, and re-time when the audio arrives.
- **Audio attached** (mp3, wav, m4a): that take is the clock. Measure it (step 2).
- **SRT or word timestamps pasted**: use them directly.

### 2. Time it from the voiceover

The captions in this style are ONE word at a time, so word timing matters more than in other styles.

1. Run `python3 scripts/voice_segments.py voice.mp3`. It lists the speech segments and the pause before each one.
2. Split the script into phrases at sentence ends, commas and colons, and map them onto the segments in order. A phrase can span several segments when the voice pauses inside it. When a long segment hides a word break you need, `--dips START END` lists the deep quiet points inside it.
3. Store the script as `[[text, [[t0, t1], ...]], ...]` and pass it to `wordsFrom()`. It places every word inside its segments by syllable count and returns `[{ w, t }]`, the caption track. `captionAt(words, t)` gives the word to show.
4. Hang every visual event on a word time (`wt('WORD')` in the example): a part flies in on its name, a casing turns to glass on "inside", beads start flowing on "fuel" or "air", an arrow grows on "pushes". Visuals lead the word by up to 0.2 s and never lag it.
5. `DURATION` = end of the last word + about 1 s.

### 3. Storyboard first, then wait for the user's OK

Make one HTML artifact with a grid of panels, one per beat (about 6-10), each a 720x1280 canvas showing that beat's key frame drawn with the real renderer, so the panels already look like the finished piece. Use 3-4 columns on desktop and 1 on phones. Still frames only.

Under each panel show:
- the beat number;
- its start and end time;
- the words spoken and the key caption words;
- what is built or revealed, and how the camera moves (orbit, dolly or cut);
- its key sounds.

Below the grid, list the facts and numbers you assumed (with sources), and the script with times.

Render the key frames headless first and look at them (see "Checking frames"). Then publish, and wait for approval or changes before building.

### 4. Build the animation

Create `engine.js` from a copy of `references/mech.js`:
- Keep the renderer, cameras, sets, props, FX, caption, finishing and helpers.
- Replace the example (`SCRIPT`, `brakeRig`, `EXPLAIN`, `HERO`) and the `registerStyle({...})` call with your story.
- Export the contract the player expects:

```js
window.LESSON = { BEATS, DURATION, explainer: (ctx, W, H_, t) => { /* your shots */ } };
function scoreSound(k) { /* effects, times from the word track */ }
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

The script needs playwright with chromium, ffmpeg and the font installed locally. Google Fonts is often unreachable from a sandbox, so take Montserrat from GitHub:
```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/google/fonts.git /tmp/gf && cd /tmp/gf && git sparse-checkout set ofl/montserrat
mkdir -p ~/.local/share/fonts && cp "ofl/montserrat/Montserrat[wght].ttf" ~/.local/share/fonts/ && fc-cache -f
```
If the font can't be installed, say so: the MP4 would use a fallback face, while the HTML player still loads Montserrat in the user's browser.

Spot-check a few frames from the MP4, then send it to the user.

## The style (keep the medium, change the story)

**Look.** Low-poly, flat-shaded 3D like a warm Blender render, in two worlds:
- **The garage:**
  - warm plaster walls and dark wood roof beams;
  - a cream tiled floor;
  - a red tool chest, a cork board, blue oil drums and stacked tyres;
  - the machine sitting on a red tubular stand in the middle of the floor.
- **The test road at sunset:**
  - a pastel lavender-to-peach sky;
  - low-poly hills and faceted trees;
  - dark asphalt with orange dashes;
  - white concrete barriers with orange stripes;
  - a steel truss gantry.

**Machines and parts:**
- Metal parts are silver steel or dark iron; accents are red, blue and orange.
- Casings turn to translucent glass with bright edges to reveal the parts inside.
- Working fluids get a colour of their own: teal or light blue for air and coolant, orange or cream for fuel and oil.

**Light and grade:** soft shadows on the floor, gentle depth of field, a warm grade with darkened top and bottom edges.

**Motion.** The camera never stops: slow orbits around the machine and dollies in and out, with a cut only when the place or scale changes (garage to road, whole machine to one part). Parts fly in and seat one by one as they are named, and moving parts keep moving: discs, wheels, crankshafts, pistons and fans. Beads stream along every pipe that is carrying something.

**How it explains.**
- **Captions:** ONE word at a time, centred in the middle of the frame, in heavy white caps (Montserrat ExtraBold) with a thin dark outline and soft shadow. Each word replaces the last exactly as it is spoken. No keyword colours, no second line.
- **Building up:** start from an empty stand or road and add the machine part by part as the script names each one.
- **X-ray:** fade a casing to glass (`alpha`) when the story goes inside.
- **Flows:** glowing dotted beads along a path (`beads`), revealed and moving in the flow direction.
- **Forces and motion:** flat 3D arrows (`arrow`): green for traction and direction of travel, yellow or orange for pushing, light blue for lift or air.
- **Rotation:** a light-blue arc (`FX.spin`).
- **Small 3D props as icons:** fuel drops, gauges, sparks.
- **Problems:** a red "no" ring (`FX.no`), heat waves (`FX.heat`), parts glowing hot.
- **Finale:** confetti (`FX.confetti`) and a closing wide shot of the finished machine or the vehicle on the road.

**Rules that keep it looking right**
- Model every machine accurately for the topic from the renderer's parts (`box`, `cyl`, `rod`, `tube`, `ico`, `face` for custom prisms, `arrow`). Keep it low-poly, but get the mechanism right: correct part names, correct order of events, correct direction of flows and forces. Double-check the engineering.
- Give every machine in the garage the red `stand` under it. On the road, use `testRoad` with `sunsetSky` as `env.bg`.
- Run `finish()` on every frame and keep `render(..., { dof })` on (about 0.33). Shadows are on by default.
- Every frame is a pure function of t. All randomness comes from `H.rng(seed)` / `H.makeNoise(seed)`, never `Math.random`. Caching static meshes and textures is fine.
- **Painter's order:** faces sort back to front by their centre depth. Glass shows the parts inside because both of its sides draw. If a small part pokes through a large face wrongly, split the large face or move the part slightly.
- **Legibility on a phone at 720x1280:**
  - the caption word is 62px Montserrat ExtraBold in the middle of the frame;
  - keep the machine's most important part near the caption but not hidden behind it (the caption sits at 47% of the height);
  - keep everything important out of the bottom 20%, where reel apps overlay their UI.
- Keep frames well under 150 ms in software rendering. The reference runs about 80-130 ms. Build only what the shot can see.

## Sound (voiceover mode)

Score it fully with the kit, in workshop sounds:
- metal clunks (`tock` + a short bright noise) as parts seat;
- `whoosh` on camera moves and cuts;
- hydraulic or air hiss (filtered `noise`) while beads flow;
- `count` ticks while a gauge climbs;
- a sizzle for heat;
- engine hum (`tone` or brown `noise`) while things spin, and tyre roar on the road;
- a squeal (narrow band `noise`) for friction;
- `thud` for a stop;
- `success`, `ding` and `sparkle` for the finale.

How to schedule them:
- Mark small frequent sounds `{ minor: true }`, and call `SOUND.live` / `SOUND.renderOffline` with `{ voiceover: true }`. That mode drops beds and music, plays minor sounds at about 60% and keeps the voice on top.
- Every sound starts on the frame its event appears, using the same word times as the picture.

## Checking frames

Before showing the storyboard and before rendering, draw the key moments headless and look at them. Use playwright to load a small page that includes the harness, the kit and the engine, call `explainer(ctx, 720, 1280, t)` and screenshot the canvas. For the reference file itself, define `window.registerStyle = (s) => { window.STYLE = s; }` after loading harness.js, then call `STYLE.explainer(...)`.

What to look for:
- the machine filling the middle of the frame (not lost in the room, not cropped);
- the caption covering the part being named;
- parts floating or intersecting wrongly;
- glass hiding the internals (lower its alpha);
- flows going the wrong way;
- arrows pointing the wrong way;
- anything drawn behind the camera;
- whether the timing reads: the part appears on its word.

Fix what you see, then look once more.

## Delivering

Finish with the artifact link and the MP4 (when rendered), with one line on how the timing was set (measured from the take, or estimated). Offer one natural next step, such as nudging a moment by its timestamp.