# Pulse reels — bodybuilding / fitness science channel (new, 3 Nov 2026)

Channel name: **Musclyth** (owner's pick, 3 Nov). The folder, kit and secrets keep the working name "Pulse".

Flat-vector "what happens inside your body" explainers, 9:16, about 35-50 s. Style skill: `skills/pulsestyle` (claude.ai
skill /pulsestyle; its reference files live on the "Pulse Sample" artifact). Everything this series needs is in this folder.

- **Voice:** ElevenLabs `cBTYF7NiJbR8Bvmdeuse`, model `eleven_v4` (owner's pick, 3 Nov). Source of truth: `config.json`.
  Never change it without asking the owner.
- **Engine:** `kit/pulse.js` (props pack 2 added 4 Nov: gym kit, muscle map, side-view lifter, supplements, food, body parts, charts; every prop shown in `kit/props_gallery.js` and listed in `skills/pulsestyle/SKILL.md`) (library: palette, flat shading, gym, lifter, fibres, filaments, fat cells, triglycerides, blood
  vessel, mitochondria, molecules, lungs, counters, stamps, bubbles, scale, treadmill, captions, zoom-through / slide
  transitions, `P.sequence`). `kit/harness.js`, `kit/sound.js`, `kit/player_body.html`, `kit/render_reel.py`. Font: Nunito (`fonts/`).
- **Reel folder** `reels/NNN-slug/`: `script.json` `{"lines":[{"say":"..."}]}` (numbers spelled as words), `story.js`
  (starts `(function () {`, NO closing `})();` — the build adds it; use `P.reelScript()`, `P.words`, `P.mergeWords` for
  digit captions, `P.wt(WORDS, 'word', n)` exact-word times, export `window.LESSON` + `window.scoreSound`), `meta.json`
  (title, caption, hashtags, first_comment, cover_t, potential, sources). `voice_lines/` is made by GitHub.
- **Check locally:** `python3 tools/pulse_make.py <id> --sheet [extra times]` → `out/<id>/sheet.png`;
  `python3 tools/pulse_make.py <id> --no-voice` → silent MP4.
- **Render:** push to main → `make-pulse.yml` voices each line, renders, publishes Release `pulse-<id>`
  (mp4, cover.jpg, caption.txt, player.html). Workflow copy: `make-pulse.yml.txt`.
- **Posting:** NOT set up. The channel has no Instagram/YouTube accounts yet (owner is choosing a handle). When they
  exist: add `IG_PULSE_*` / `YT_PULSE_*` secrets, a schedule file and a poster, and ask the owner for post times.

## CHANNEL PLAN: the complete fitness pack (owner, 4 Nov 2026). This overrides the backlog below.

One channel, four numbered series that rotate, so every day has a mix. Each reel says its series and part on frame 0
(`P.label` under the title) and ends with "Next: <next topic>" so people follow the series.

| Series | Tag on screen | What it is | Pilot |
|---|---|---|---|
| **Why Does This Happen?** | `Why Does This Happen? #N` | Things everyone notices in the gym or body but nobody knows why. Hook = the question. | 005-why-last-rep-shakes |
| **Muscle Building** | `Muscle Building · Part N` | A step-by-step course in how to grow muscle: signal, protein, volume, rest, progress. | 006-how-muscle-grows |
| **Exercise Series** | `Exercise Series · Part N` | One lift per episode: what it really works, one myth or mistake, form cues. | 007-the-squat |
| **Supplement Series** | `Supplement Series · Part N` | One supplement per episode: what it does, what the evidence says, usual dose, who should be careful. | 008-creatine |

**Rotation (owner, 4 Nov): 4 posts a day, one from each series every day** (28 reels a week, 7 per series).

**Next topics, in order:**
- Why: the pump · knees cracking · side stitch when running · red face when lifting · hungrier on rest days · why you can't sleep after evening training · morning stiffness · why one side is stronger · goosebumps/shivers after a hard set · why you feel sick after leg day · why muscles twitch at night · why you sweat more as you get fitter.
- Muscle Building: how much protein (2) · how many sets a week (3) · how heavy and how many reps (4) · how close to failure (5) · rest between sets (6) · progressive overload (7) · sleep and growth (8) · eating in a surplus (9) · beginner gains and why they slow (10) · can you build muscle and lose fat at once (11) · deload weeks (12).
- Exercise: deadlift · bench press · pull-up · overhead press · hip thrust · barbell row · lunges · push-up · plank · dips · Romanian deadlift · calf raise.
- Supplements: protein powder · caffeine · beta-alanine · fish oil · vitamin D · BCAAs (mostly not needed) · pre-workout · electrolytes · collagen · fat burners (what the evidence says).

**Week 1 (made 4 Nov, 28 reels: 4 a day, one from each series, in this order):**
| Day | Why Does This Happen? | Muscle Building | Exercise | Supplements |
|---|---|---|---|---|
| 1 | 009-the-pump (#2) | 010-how-much-protein (2) | 011-the-deadlift (2) | 013-protein-powder (2) |
| 2 | 012-knees-crack (#3) | 016-sets-per-week (3) | 014-bench-press (3) | 019-caffeine (3) |
| 3 | 015-side-stitch (#4) | 022-heavy-or-light (4) | 017-pull-up (4) | 025-bcaas (4) |
| 4 | 018-red-face (#5) | 028-train-to-failure (5) | 020-overhead-press (5) | 030-fish-oil (5) |
| 5 | 021-sweat-when-fit (#6) | 031-sleep-and-growth (6) | 023-hip-thrust (6) | 032-vitamin-d (6) |
| 6 | 024-evening-workout-sleep (#7) | 033-eat-more-to-grow (7) | 026-barbell-row (7) | 034-beta-alanine (7) |
| 7 | 027-heart-keeps-racing (#8) | 035-progressive-overload (8) | 029-push-ups (8) | 036-pre-workout (8) |
Pilots 005-008 are part 1 of each series and post first. Next up: Why #9 one side stronger, MB 9 build muscle and lose fat at once,
Supp 9 electrolytes, Ex 9 Romanian deadlift (each reel's "Next:" card already promises these).
**How a reel is built now:** `story.js` calls `P.reel({ merge, scenes, sfx })` (kit/pulse.js, props pack 3), so a reel is
just its scenes; see any of 009-029. Check with `python3 tools/pulse_make.py <id> --sheet`.

**Supplement rules:** evidence only, say how strong it is, give the dose used in studies, add "Ask a doctor first" for
any group at risk, and put "General information, not medical advice." in the caption. No brand names, no buying links,
nothing banned or prescription-only.

## Content rules
- Hook in the first second (title card + something moving on frame 0), a scene change every 3-4 s, zoom-through whenever
  the story goes deeper, numbers as counting pop-ups, loop-friendly ending.
- Real science only: verify every fact with 2 sources, list them in `sources`, flag debated claims. General, evidence-based
  advice only: no steroids, crash diets, extreme cutting or body shaming.
- The lifter is the channel's own character; never add another channel's mascots, names or scenes.

## Topic backlog (owner liked the list, 3 Nov)
001 where fat goes · 002 muscle memory · 003 lactic acid myth · 004 soreness ≠ growth (all done 3 Nov) ·
skipping sleep after leg day · why the last rep shakes · what creatine does · what a pump is · myostatin / Belgian Blue ·
100 push-ups a day for a month · protein window myth · muscle can't turn into fat · only-protein diet (rabbit starvation) ·
lifting on an empty stomach · the heart never rests.

## Brand and setup
- Profile picture, YouTube banner, highlight covers, bio text: `brand/` (see `brand/BIO.md`).
- Posting setup, step by step (built-in browser): `SETUP_PROMPT.md`.
