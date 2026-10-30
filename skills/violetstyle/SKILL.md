---
name: "violetstyle"
description: "Make a vertical 9:16 reel in the Violet Room soft 3D cartoon style (mannequin-jointed characters, cosy living room, navy-violet couch, bold white/yellow captions) timed to a voiceover. Use for /violetstyle or this style."
---

# Violet Room reel (/violetstyle)

Turn a topic, script or voiceover into a vertical 9:16 (720x1280) reel in the Violet Room style: an interactive HTML player (artifact) plus, when a shell is available, a rendered MP4 with the voiceover mixed over the sound effects. Use this skill when the user types /violetstyle, or asks for a violet style, soft 3D cartoon, relatable "has this ever happened to you" couple/sitcom reel or a "what if..." faceless short in this style, even if they only give a topic and no script or voiceover yet.

The style is already built. A working renderer with every recipe the look needs, plus the player and the timing and render scripts, ship in this skill's folder. Build each new reel on that code rather than redrawing the style from scratch: that is what keeps it looking like the real medium, and it saves a lot of time.

## Step 0: copy the style files

The style files ship inside this skill's own folder (next to this SKILL.md): `references/`, `assets/` and `scripts/`. Copy that folder into a working directory in the scratchpad and work from the copy. Nothing needs fetching.

If the files are missing from the skill folder, say so plainly and ask the user to re-upload the complete skill zip.

| File | What it is | When to read it |
|---|---|---|
| `references/violet.js` | The reference style: the soft-3D renderer (`Scene` with `ball`, `limb`, `rbox`, `cyl`, `quad`, `shadow`, `doll`, `render`), the sets (`livingRoom`, `couch`, `coffeeTable`, `nightStreet`, `nightSky`), props (`remote`, `phone`, `popcorn`, `tv`), the 2D accents (`FX.speed`, `FX.burst`, `FX.ring`, `FX.dots`, `FX.heart`, `FX.qmark`, `FX.sweat`, `FX.sparkle`, `FX.buzz`), `caption`, `finish`, `shotCam`, `popU`, `ramp`, an example explainer ("Why are yawns contagious?"), a hero frame and its sound design | Before the storyboard: read it fully, it is the style |
| `references/harness.js` | The H helper library (seeded rng, noise, easing, colour, layers, vignette) | Include unchanged |
| `references/sound.js` | The SOUND kit (synthesized effects, voiceover mode, live and offline rendering) | Include unchanged; skim the named sounds |
| `assets/player_body.html` | The 9:16 player: letterboxed canvas, play/pause, scrub, time, sound toggle, loop, "Load voiceover" with drag and drop, built-in voiceover support, `window.seek` | Use as the page body |
| `scripts/voice_segments.py` | Measures where the voice speaks (segments and pauses) from the loudness envelope | When you have the audio |
| `scripts/build_page.py` | Injects the JS into the player body; optionally embeds the voiceover | To make the artifact and the render page |
| `scripts/render_reel.py` | Renders the page to MP4 frame by frame, renders the effects offline, mixes the voice on top with the effects ducked | For the final video |

## Workflow

### 1. Gather the content

- **Topic only**: write a voice-ready script first: about 30-60 s, short punchy sentences in second person, and a relatable hook such as "Has this ever happened to you?" or a "What if..." question.
  - This style is at its best with a small everyday story: two characters, one situation, a twist, and a warm or funny ending.
  - Spell out numbers the way they should be spoken, since text-to-speech tools read digits unpredictably.
  - Check any fact or number before it goes in the script, and list the ones you relied on.
  - Give the user the script so they can record or generate it (for example with ElevenLabs), and offer an SRT with your estimated timing as a pacing guide.
- **Script without audio**: storyboard on estimated timing (about 2.7 words per second, ~0.35 s pause at a full stop, ~0.2 s at a comma). Say clearly that the times are estimates, and re-time when the audio arrives.
- **Audio attached** (mp3, wav, m4a): that take is the clock. Measure it (step 2).
- **SRT or word timestamps pasted**: use them directly.

### 2. Time it from the voiceover: the BEATS table

Every time in the animation comes from one BEATS table, so a new take only means editing the table.

1. Run `python3 scripts/voice_segments.py voice.mp3`. It lists the speech segments and the pause before each one.
2. Split the script into phrases at sentence ends, commas and colons, and map them onto the segments in order. Most map one to one. A phrase can span several segments when the voice pauses inside it.
3. When a long segment hides a word break you need, `--dips START END` lists the deep quiet points inside it.
4. Store each beat as `{ id, phrases: [[text, [[t0, t1], ...], starts?], ...] }`. `starts` (optional) gives the word index where each segment begins when the break falls on a known word. Inside a segment, place words by syllable count. This lands reveals within a fraction of a second without a speech-recognition model.
5. Helpers: `W(id, word, n)` returns a word's time and `V(...)` returns that time minus 0.12 s. Visuals lead the word by up to 0.2 s and never lag it.
6. `DURATION` = end of the last word + about 1 s.

Captions in this style change in short chunks (two to five words), so also split each phrase into caption chunks and time each chunk from its first word.

### 3. Storyboard first, then wait for the user's OK

Make one HTML artifact with a grid of panels, one per beat (about 6-10), each a 720x1280 canvas showing that beat's key frame drawn with the real renderer, so the panels already look like the finished piece. Use 3-4 columns on desktop and 1 on phones. Still frames only.

Under each panel show:
- the beat number;
- its start and end time;
- the exact on-screen text (caption chunks);
- how it gets there from the previous panel: a continuous shot (what carries over and how it moves) or a cut (wide to close-up, reverse angle, or a new place, and why the story wants it);
- its key sounds.

Below the grid, list the facts and numbers you assumed, and the script with times.

Render the key frames headless first and look at them (see "Checking frames"). Then publish, and wait for approval or changes before building.

### 4. Build the animation

Create `engine.js` from a copy of `references/violet.js`:
- Keep the renderer, sets, props, FX, caption, finishing and helpers.
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

The script needs playwright with chromium, ffmpeg and the font installed locally. Google Fonts is often unreachable from a sandbox, so take Montserrat from GitHub:
```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/google/fonts.git /tmp/gf && cd /tmp/gf && git sparse-checkout set ofl/montserrat
mkdir -p ~/.local/share/fonts && cp "ofl/montserrat/Montserrat[wght].ttf" ~/.local/share/fonts/ && fc-cache -f
```
If the font can't be installed, say so: the MP4 would use a fallback face, while the HTML player still loads Montserrat in the user's browser.

Spot-check a few frames from the MP4, then send it to the user.

## The style (keep the medium, change the story)

**Look.** A soft, smooth 3D cartoon, like a cosy animated short:
- **Characters:** articulated mannequin dolls with ball joints at shoulders, elbows, wrists and knees, puffy padded sweaters (mustard for him, red for her), dark navy trousers, mitten hands.
- **Heads and faces:** big oval heads with large glossy eyes (dark or green irises, white highlights), thick short brows, a small nose bump and a simple mouth. He has chunky low-poly spiky hair; she has a smooth bob with a fringe and a ponytail.
- **The set:** a living room with a sage-green wall, a framed landscape painting (pale sky, sun, green hills), a little pop-art frame, a wall shelf of books and a low-poly plant.
- **Furniture:** a navy-violet couch with rounded cushions, a terracotta rug and a wooden coffee table.
- **Light and lens:** warm lamp light from the upper left, deep cool shadows and soft depth of field on everything behind the subject.
- **Colour grade:** moody and warm, with darkened top and bottom edges and a strong vignette.

**Motion.** Short shots with hard cuts, alternating wide couch shots with big face close-ups and the occasional reverse angle over the couch or an exterior establishing shot. The camera pushes in slowly through every shot. Characters react fast: heads turn, eyes widen, an arm snaps up. Captions pop in chunk by chunk. 2D cartoon accents snap on over the 3D for emphasis.

**How it explains.**
- **Captions:** big, heavy white uppercase (Montserrat Black) with a dark outline and shadow, one or two lines in the upper part of the frame. They change every two to five words, and the key word is in yellow.
- **Emphasis kit:**
  - white speed lines for "suddenly";
  - a comic sunburst behind a face for the realisation;
  - a red ring with a white X for the wrong thing, and a green ring or tick for the right thing;
  - a dotted white trail for a movement;
  - floating glossy hearts for affection;
  - a chunky "?" for confusion;
  - a blue sweat drop for awkwardness;
  - sparkles.
- **Numbers**, when a story needs one: say them in the caption. This style uses no tags or charts. A number can sit on a prop's screen (a phone or TV) if it fits the scene.
- **Endings:** end on a warm beat (hearts, a cuddle) or an exterior establishing shot (the house at night, lights going out).

**Rules that keep it looking right**
- Build every character with `doll()` and every prop from the renderer's parts (`ball`, `limb`, `rbox`, `cyl`, `quad`). New props then share the soft shading, warm light and depth of field. Build new subjects for the topic (a kitchen, a car interior, a bedroom, an office, a phone screen) from these parts, in the same palette and lighting. Pose characters with the `arms`, `legs`, `lean`, `head` and `face` options.
- Run `finish()` (warm lamp pool, bloom, grade, edge darkening, vignette, grain) and give every 3D shot depth of field (`render(..., { dof })`; smaller values blur more, 0 turns it off). They are what make it read as a rendered short rather than flat 3D.
- Every frame is a pure function of t. All randomness comes from `H.rng(seed)` / `H.makeNoise(seed)`, never `Math.random`. Caching static textures is fine.
- **Painter's order:** items draw back to front by depth. Use `bias` to fix the rare wrong order: negative draws later, as for props resting on a table top.
- **Legibility on a phone at 720x1280:**
  - captions at least 50px (the reference uses 58px Montserrat Black), and any other text the story depends on at least 28px;
  - keep captions out of the top 10% and keep everything important out of the bottom 20%, where reel apps overlay their UI;
  - frame each shot so faces sit in the middle band, between the captions and the bottom safe zone.
- **Faces carry the story:** pick an expression for every shot (`eyes`: open, wide, happy, closed; `mouth`: smile, flat, frown, o, open, yawn; `brows`: worried > 0, cross < 0; `look`; `blush`; `lids`). Close-ups should show a clear reaction.
- **Flow:** decide shot by shot. A new idea or a reaction usually gets a hard cut, and close-ups and wides alternate. When the next idea builds on the last, stay in the shot and let the characters act. Keep each shot at least about 1.5 s.
- Keep frames fast, well under 150 ms in software rendering. The reference runs about 30-130 ms; the far layer is blurred by downscaling, which is cheap. Avoid canvas `filter: blur` per item.

## Sound (voiceover mode)

Score it fully with the kit, in a light sitcom manner:
- a soft `whoosh` on each hard cut;
- a tiny `pop` as each caption chunk lands;
- cartoon accents for reactions (`jump` for surprise, a falling triangle `tone` for a yawn or a sigh, `riser` into a realisation);
- `buzz` plus `thud` for the wrong answer;
- `impact` plus `success` or `ding` for the realisation;
- `pop` or `blip` plinks for hearts and sparkles;
- `click` for a light switch or phone;
- ticks or crickets for night.

How to schedule them:
- Mark small frequent sounds `{ minor: true }`, and call `SOUND.live` / `SOUND.renderOffline` with `{ voiceover: true }`. That mode drops beds and music, plays minor sounds at about 60% and keeps the voice on top.
- Keep the big hits at full volume, placed in pauses or on stressed words.
- Every sound starts on the frame its event appears, using the same BEATS times as the picture.

## Checking frames

Before showing the storyboard and before rendering, draw the key moments headless and look at them. Use playwright to load a small page that includes the harness, the kit and the engine, call `explainer(ctx, 720, 1280, t)` and screenshot the canvas. For the reference file itself, define `window.registerStyle = (s) => { window.STYLE = s; }` after loading harness.js, then call `STYLE.explainer(...)`.

What to look for:
- captions clipped or colliding with faces;
- faces cut off at the sides (the frame is narrow);
- hair covering the eyes;
- arms bending the wrong way (`arms` = [forward, outward, elbow bend]);
- props drawn behind the furniture they rest on (fix with `bias`);
- anything drawn behind the camera;
- whether the timing reads: the reaction lands on the word.

Fix what you see, then look once more.

## Delivering

Finish with the artifact link and the MP4 (when rendered), with one line on how the timing was set (measured from the take, or estimated). Offer one natural next step, such as nudging a moment by its timestamp.