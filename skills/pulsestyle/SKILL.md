---
name: pulsestyle
description: Make a vertical 9:16 body-science / fitness reel in the Pulse flat-vector style (indigo/violet worlds, the orange-sweatband lifter, zoom-through from body to cells, pill labels, counting numbers, small captions), timed to a voiceover. Use for /pulsestyle, the Pulse bodybuilding channel, or any "what happens inside your body when you train" short.
---

# Pulse reel (/pulsestyle)

Turn a topic, script or voiceover into a 720x1280 science reel of about 35-50 seconds for the Pulse bodybuilding /
fitness-science channel: an MP4 (and an interactive HTML player). Everything is drawn in code. Build on the kit, never
redraw the style from scratch: the kit is what keeps every reel looking like one channel.

The style was made from reference Shorts but is ORIGINAL: its own lifter, palette and title treatment. Never add birds,
mascots, names or scenes from any existing channel.

## Where things live

- **In the reel-autopilot repo (normal case):** the live series is `pulsereels/` (read `pulsereels/README.md` first).
  Kit: `pulsereels/kit/`. Tool: `tools/pulse_make.py`. Workflow: `.github/workflows/make-pulse.yml`. Reels:
  `pulsereels/reels/NNN-slug/` with `script.json`, `story.js`, `meta.json`. Push to main → GitHub voices, renders and
  publishes Release `pulse-<id>`.
- **Standalone (no repo):** the same files are next to this SKILL.md: `references/pulse.js` (the kit), `references/harness.js`,
  `references/sound.js`, `assets/player_body.html`, `assets/Nunito[wght].ttf`, `scripts/build_page.py`, `render_reel.py`,
  `voice_segments.py`. `assets/example_legday_standalone.js` is a complete self-timed reel for this mode.

| File | What it is | When to read it |
|---|---|---|
| `assets/example_fat_story.js` + `example_fat_script.json` | Reel 001 "Where does your fat go?" (repo format) | First: copy it and swap the story |
| `references/pulse.js` | The kit (see list below) | Before the storyboard |
| `references/harness.js`, `sound.js` | Helpers (H.rng, H.ease) and synthesized effects | Include unchanged |

## Voice

ElevenLabs voice **`cBTYF7NiJbR8Bvmdeuse`**, model `eleven_v4` (owner's pick, 3 Nov 2026; source of truth
`pulsereels/config.json`). Never change it without asking. In the repo, GitHub Actions voices every line (secret
`ELEVENLABS_API_KEY`); sessions usually can't reach api.elevenlabs.io directly, so don't try to voice locally.

## Workflow (repo)

1. **Topic.** Pick from the backlog in `pulsereels/README.md`; never repeat a topic (read existing `meta.json` titles).
2. **Facts.** Verify every claim and number with 2 sources; list them in `meta.json` `sources`; say "in mouse studies" or
   similar when the evidence is limited. General, evidence-based advice only: no steroids, crash diets, extreme cutting or
   body shaming.
3. **Script** (`script.json` `{"lines":[{"say":"..."}]}`): 8-10 short spoken lines, about 90-110 words, numbers spelled as
   words. Line 1 = shocking hook question. Then the myth / problem, the body's mechanism step by step, a number payoff, and
   a practical punchline that loops back to the hook.
4. **Story** (`story.js`): starts `(function () {` and has NO closing `})();` (the build adds it). Pattern:
   ```js
   const SCRIPT = P.reelScript();                                   // measured take when GitHub voices it, else estimated
   const WORDS = P.mergeWords(P.words(SCRIPT), [['eight point four', '8.4 kg']]);  // digits in captions
   const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
   const wt = (k, n) => P.wt(WORDS, k, n);                         // exact word, nth occurrence (punctuation ignored)
   const SEQ = [{ t: 0, draw: hook }, { t: wt('your') - 0.7, draw: cells, tr: 'zoom', focus: [x, y] }, { t: ..., draw: ..., tr: 'slide' }];
   function explainer(ctx, W, H, t) { P.sequence(ctx, 720, 1280, t, SEQ); P.finish(ctx, 720, 1280); P.caption(ctx, 720, 1280, P.captionAt(CHUNKS, t)); }
   window.LESSON = { BEATS, DURATION, explainer }; window.scoreSound = scoreSound;
   ```
   Every visual event hangs on a word time. Check that each `wt()` word really occurs that many times (common words like
   "your", "one", "that", "so" repeat).
5. **Meta** (`meta.json`): `title` (<70 chars, curiosity + emoji), `caption` (ends with a two-sided question), 6-10
   `hashtags`, `first_comment` (playful vote), `cover_t` (most striking early frame), `potential` (honest 1-10), `sources`.
6. **Check:** `python3 tools/pulse_make.py <id> --sheet [extra times]` → `out/<id>/sheet.png`. Look at it (below). Fix, re-check.
7. **Push** to main (one commit for a batch: the workflow renders every reel the push changed). Wait for Release
   `pulse-<id>`, download the MP4, pull frames + check audio with ffmpeg, then send it.

## The look (keep the medium, change the story)

- **Flat vector, NO outlines.** Every shape uses `P.flat` two-tone shading (light rim top-left, indigo-tinted shade rim
  bottom-right). Rounded, chunky, friendly. Saturated colours on deep gradients.
- **Worlds:** `P.gym` (aqua room, windows, light shafts, dumbbell racks: hook and finale) and `P.bg` inside the body:
  `deep` (tissue, cells), `violet` (molecules, close-ups), `plum` (pain, burn, swelling), `night` (blood, drama). Add
  `P.bgCells` for parallax depth in every inside scene.
- **The lifter** `P.lifter(ctx, x, feetY, scale, pose)`: round head, spiky dark hair, orange sweatband, teal tank top, navy
  shorts. Pose: `squat`, `arms` / `arms2` / `mix` (`down | bar | press | flex | curl`), `bulk`, `belly`, `wince`, `shock`,
  `pant` (open mouth, pass t*6), `run` (pass t*9), `smile`, `look`, `blink`, `bar: true`, `plate` colour. Same character
  in every reel.
- **Anatomy and props:** `P.fiber` (banded muscle fibre; `grow`, `tears`, `tearK`, `heal`, `slide`), `P.nuclei` (glowing
  nuclei along a fibre), `P.filaments` (actin/myosin), `P.rip`, `P.cellStar` (stem / repair / immune cells), `P.fatCell`,
  `P.trig` (triglyceride; `split`), `P.vessel` + `P.rbc` (bloodstream), `P.mito` (mitochondrion; `glow`), `P.molecule`
  (`co2`, `h2o`, `o2`), `P.ion` (H+), `P.lactate`, `P.lungs`, `P.heart`, `P.brain`, `P.liver`, `P.flow` (particle streams),
  `P.puff` (breath), `P.drop`, `P.sweat`, `P.scale`, `P.treadmill`, `P.barbell`, `P.calendar`, `P.moon`, `P.shaker`,
  `P.egg`, `P.battery`, `P.wanted` (WANTED poster + INNOCENT stamp).
- **Props pack 2 (fitness pack, 4 Nov):** see `kit/props_gallery.js` for every one in use.
  - *Gym:* `P.dumbbell`, `P.kettlebell` (label), `P.plate` (r, colour, label), `P.bench` (incline), `P.pullupBar`, `P.rope` (jump
    rope, swings with t), `P.stopwatch` (frac sweep, label), `P.bottle` (water level).
  - *Supplements:* `P.tub` (label, sub, accent), `P.scoop`, `P.pill` (two-tone capsule), `P.softgel` (fish oil), `P.coffee`
    (steam), `P.sun` (vitamin D), `P.evidence(ctx, x, y, level 0-3)` (NO EVIDENCE / WEAK / MODERATE / STRONG badge).
  - *Food:* `P.chicken`, `P.steak`, `P.rice`, `P.banana`, `P.broccoli`, `P.milk`, `P.platePie(ctx, x, y, r, [[frac, colour, label]], k)`.
  - *Body:* `P.bone`, `P.knee` (side view; `bend`, `glow`), `P.spine` (`curve`, `hi` vertebra), `P.neuron` (motor neuron with a
    travelling signal), `P.kidney`, `P.stomach` (`full`), `P.protein` (amino-acid chain built bead by bead), `P.ecg` (heart
    trace; `bpm`), `P.thermometer`, `P.bed` (sleeping lifter with Zzz).
  - *Muscle map:* `P.musclemap(ctx, x, y, s, 'front' | 'back', { zone: 0..1 }, colour)`. Front zones: shoulders, chest, biceps,
    forearms, abs, obliques, quads, adductors, calves. Back: traps, rear, lats, triceps, lowback, glutes, hamstrings, calves.
    The Exercise series uses this for "what it really works".
  - *Side-view lifter (form):* `P.lifterSide(ctx, x, feetY, s, pose, { k, bar, wince, smile, facing, bulk })`, poses `stand`,
    `hinge` (deadlift / RDL), `squat` (bar on the upper back), `row`, `press` (overhead), `hang` (pull-up; k lifts him),
    `pushup` (k = down), `plank`. Returns hip / shoulder / hand / knee points for glows and arrows. Same character as `P.lifter`.
  - *Charts and UI:* `P.check(ctx, text, x, y, ok, k)` (tick / cross rows), `P.verdict` (MYTH / FACT badge), `P.versus` (A vs B
    panels with draw callbacks, `win`), `P.lineChart` (values 0..1, k draws it), `P.progress`, `P.ring` (rest timer),
    `P.reps(ctx, x, y, done, total)`, `P.seriesTag` (frame-0 series pill).
- **Props pack 3 (4 Nov):** `P.face` (big close-up head: `red` flush, `puff` held breath, `sleepy`, `shock`, `smile`, `wince`, `sweat`),
  `P.gauge` (dial with green/amber/red zones), `P.skinLayer` (skin cross-section: sweat glands pumping drops, vessel that widens),
  `P.jointBubble` (joint fluid; bubble forms and pops, `gap` opens the joint), `P.clock` (analog, h:m), `P.receptor` (lock-and-key:
  `adenosine` / `caffeine`, `blocked`), `P.aminos` (9 essential amino acids, `hi` = [0,1,2] for the BCAAs), `P.arm` (flexed arm
  close-up, `pump` swells it and pops veins), `P.week` (7-day strip with set dots), `P.arcArrow` (curved motion arrow),
  `P.lifterBench` (`bench` press and `hipthrust`, k = depth).
- **`P.reel({ merge, scenes: (A) => [...], sfx: (A) => [...] })`** builds the whole reel: captions, sequence, beats and a base sound score.
  Each scene is `{ at, name, tr, focus, draw(ctx, t) }`; `A` has `L(i)` line starts, `wt`, `pop`, `ramp`, `blink`, `W`, `H`, `PAL`,
  `A.hookTitle(ctx, lines, seriesTag)` for frame 0 and `A.next(ctx, t, 'TOPIC')` for the "Next:" card.
- **Text:** `P.title` (hook title, amber fill / white rim / indigo outline, on screen from frame 0), `P.label` (pill tags,
  colour-coded, optional `sub` and `stem`), `P.counter` + `P.countTo` (big counting numbers), `P.bubble`, `P.qmarks`,
  `P.stampX` (myth busted), `P.meter` (bar charts), `P.arrowFlat`, `P.caption` (2-3 words, white, 73% height, last).
- **FX:** `P.zap` (pain sparks), `P.glow`, `P.sparkles`, `P.confetti` (finale), `P.shake`.
- **Motion:** `P.push` slow push-in inside every scene; something moves everywhere. `tr: 'zoom'` (zoom-through into the
  exact body part) whenever the story goes deeper; `tr: 'slide'` for a change of time / place. A new shot every 3-4 s.
  Pop-ins overshoot (`H.ease.back`). Every frame is a pure function of t; randomness only from `H.rng(seed)`.

## Engagement rules

Hook in the first second (title + moving lifter on frame 0, spoken question). A myth or surprise in the first 5 s.
Numbers count up on screen. Payoff near the end, punchline that loops to the start. 35-50 s.

## Checking the sheet

No page errors or slow frames (the tool prints them). Labels and titles clear of the caption line (y about 900-970) and of
each other; nothing important in the bottom 20%; the zoom-through aims at the right body part; each label appears on its
word; counters don't overlap; flows and arrows go the right way; the lifter's arms bend the right way.

## Sound

`scoreSound(k)`: `riser` + `pop` on the title, `whoosh` on zooms, `swish` on slides, `pop` on each label, `count` ticks
while numbers count, `stamp` + `error` on a busted myth, `glitch` / `impact` on damage, `buzz` (minor) for pain, `blip`
runs for cells arriving, `thud` on reps, `paper` on calendar flips, `powerup` / `success` / `sparkle` on the payoff. Mark
small repeated sounds `{ minor: true }`. GitHub mixes the voice on top with effects ducked.
