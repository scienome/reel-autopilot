# Pulse reels — bodybuilding / fitness science channel (new, 3 Nov 2026)

Flat-vector "what happens inside your body" explainers, 9:16, about 35-50 s. Style skill: `skills/pulsestyle` (claude.ai
skill /pulsestyle; its reference files live on the "Pulse Sample" artifact). Everything this series needs is in this folder.

- **Voice:** ElevenLabs `cBTYF7NiJbR8Bvmdeuse`, model `eleven_v4` (owner's pick, 3 Nov). Source of truth: `config.json`.
  Never change it without asking the owner.
- **Engine:** `kit/pulse.js` (library: palette, flat shading, gym, lifter, fibres, filaments, fat cells, triglycerides, blood
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

## Content rules
- Hook in the first second (title card + something moving on frame 0), a scene change every 3-4 s, zoom-through whenever
  the story goes deeper, numbers as counting pop-ups, loop-friendly ending.
- Real science only: verify every fact with 2 sources, list them in `sources`, flag debated claims. General, evidence-based
  advice only: no steroids, crash diets, extreme cutting or body shaming.
- The lifter is the channel's own character; never add another channel's mascots, names or scenes.

## Topic backlog (owner liked the list, 3 Nov)
001 where fat goes (done) · stop training 30 days / muscle memory · lactic acid isn't the burn · soreness ≠ growth ·
skipping sleep after leg day · why the last rep shakes · what creatine does · what a pump is · myostatin / Belgian Blue ·
100 push-ups a day for a month · protein window myth · muscle can't turn into fat · only-protein diet (rabbit starvation) ·
lifting on an empty stomach · the heart never rests.
