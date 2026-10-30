# CouchSarcasm sitcom: the batch playbook

Any Claude session (scheduled or asked in chat) follows this to make new **CouchSarcasm** episodes with the same look,
voices and quality every time. The approved model is **`reels/e001-the-ring`** ("perfect", owner, 29 Oct 2026); the
house style below is what made it work. Folder: `couchnew/`. Posts 07:30, 13:30, 21:30 IST from `schedule.json`.

## 0. Setup and claim
1. `git checkout main && git pull origin main`. Scheduled/batch runs: `python3 tools/claim.py start couch-batch` first
   (exit 3 = someone else owns it: stop with one line). `claim.py beat couch-batch --note "..."` after every push,
   `claim.py done couch-batch` at the end. See HANDOFF.md §7b.
2. Local check tool (cloud session, `$SP` = scratchpad): `pip install playwright==1.48.0 pillow numpy`, then
   `mkdir -p $SP/pwb/chromium-1140 && ln -s /opt/pw-browsers/chromium-*/chrome-linux64 $SP/pwb/chromium-1140/chrome-linux && touch $SP/pwb/chromium-1140/INSTALLATION_COMPLETE`
   and run `cd couchnew && PLAYWRIGHT_BROWSERS_PATH=$SP/pwb python3 tools/check.py reels/<id> $SP/<id>.png`.
   (Any way of pointing Playwright at the pre-installed Chromium works.)

## 0b. Resume first
`couchnew/batch_log.json` = `[{ "batch": "YYYY-MM-DD", "ids": [...], "status": "in_progress" | "done", "updated": UTC }]`.
- Newest entry `in_progress`: finish exactly those ids (write the missing ones, push, wait for Releases, add to the
  queue), then set `done`.
- Otherwise, before writing anything: append an entry with the planned ids, `in_progress`, push it with `[skip ci]`.

## 1. How many
Keep the queue **at least 2 days (6 episodes) ahead**. A scheduled batch makes **9 episodes** (3 days). Count what is
left: ids in `schedule.json` "queue" that are not in the root `posted.json`.

## 2. The show
- **Cast** (2D adult cartoon, `toon/adult.js` CAST): **Sam** (yellow hoodie, spiky hair, stubble, a well-meaning idiot),
  **Maya** (his girlfriend, now fiancée: red crop top, hoops, sarcastic), **Mum** (Maya's mum: grey curls, glasses,
  pearls, cardigan, deadpan, always wins). Guests available: `boss`, `date`, `dad`, `grandma`, `friend`, `sister`. Voiced guests (config "cast"): `dad` (Maya's dad, George), `friend` (Danny, Chris), `doc` (the doctor, Daniel; draw him as `boss` with a white-coat `style`).
- **Continuity:** it's a running story. e001 The Ring (ring in a doughnut, Mum swallowed it, Sam proposed to Mum in
  hospital) → e002 Thursday (ring "arrived", tongs, wedding at the hospital) → e003 Mum Moves In (Day 40, wifi
  "SamPackYourBags") → e004 Sam Cooks (fire, "funeral") → e005 The Birthday (30 candles, sprinklers) → e006 The Dress
  (Mum in the wedding dress, "something old") → e007 The Dad (Maya's dad, Mum wins the arm wrestle) → e008 The Wedding
  Planner (Mum plans it all, doughnut cake) → e009 The Stag Night (bingo with Mum) → e010 The Vows (Mum deletes them,
  "I promise to never cook again") → e011 The Wedding (in the hospital, Mum objects to the cake, eats the ring AGAIN:
  "Mm. Crunchy.") → e012 The Honeymoon (Mum in the middle seat) → e013 The First Fight (thermostat; Mum keeps the
  remote) → e014 The Baby News (Sam faints, Mum moves in) → e015 Baby Names (Mum's name is Brenda) → e016 Sam Babyproofs
  (locks himself in the cupboard) → e017 The Gender Reveal (Mum's scarf on fire; it's a girl). Next: the birth, baby
  Brenda, Sam as a dad, Mum as grandma. Call back to earlier jokes now and then. Never repeat a premise or punchline (read every `reels/e*/script.json` first).
- **Shape (20-35 s, 9-13 lines):** cold open or hook line in the first second → 2-4 escalating beats, each a short line
  (2-8 words) with a visible reaction → a twist → Mum's deadpan punchline (or Sam's disaster) → narrator "Part two?"
  (or "Part three?"). Lines are snappy; most beats are one speaker. The best jokes are Mum being calmly savage.
- **Humour:** relatable couple / in-law comedy, adult edge OK (no explicit sexual content, no slurs, no violence beyond
  cartoon slapstick, nothing about real people).
- **Rejected, never again:** text-message format, "what she says vs what she means", the 3D couple (root `reels/`).

## 3. Files per episode (`reels/eNNN-slug/`)
- `script.json`: `[ {"id": "c1", "who": "sam" | "maya" | "mum" | "narrator", "phrases": ["...", "..."]}, ... ]`.
  Numbers spelled out. The narrator only does time cards ("Six hours earlier.", "Day forty.") and "Part two?".
- `meta.json`: `title` (<70 chars, emoji), `caption` (2 lines + a question, emoji), `hashtags` (8, include
  `couplehumor`, `motherinlaw`, `relationships`, `animation`, `cartoon`, `funny`, `sitcom`, `reels`), `first_comment`,
  `cover_t`, **`"libs": ["toon/adult.js", "toon/sitcom.js"]`**.
- **Translations (free, YouTube only):** add the reel to `i18n/couch.json` as
  `"<id>": {"hi": {"title", "caption"}, "es": {...}, "pt": {...}}` (natural Hindi, Spanish, Brazilian Portuguese;
  same emojis; titles under 90 chars). The YouTube upload sends them as localized titles/descriptions,
  so viewers with those languages see them translated. A missing entry only means English. Lives outside `reels/`,
  so editing it never triggers a render.
- `audio.json`: music prompt "Quirky adult animated sitcom underscore: bouncy slap bass, playful muted brass stabs, light
  drums, cheeky and fast, <one twist for this episode>, no vocals" (gain -6, tail 3) + 5-8 sfx pinned to words, including
  2-3 **short sitcom audience** laughs/oohs (gain -8 to -10) after the punchlines. See `tools/eleven_audio.py`.
- `story.js`: `SITCOM((h) => ({ <beat id>: shot, ... }), { noSub: [...], sound: (k, h) => {...} })`
  (harness `toon/sitcom.js`; copy `reels/e002-thursday` .. `e006-the-dress`, which use it). A beat without its own
  shot stays on the previous camera. `h` gives `V(beat, word)`, `first(beat)`, `talking`, `pulse`, `char`, `AT`
  (`armsAt`), `timeCard`, `partTwo`. `char(ctx, who, x, y, scale, t, opts, xs)` fills in talking mouths and eye lines.
- Shots: `{ set: 'living' | 'cafe' | 'hospital' | 'kitchen', setOpt, cam: [[cx, cy, zoom], [cx, cy, zoom]], shake, draw(ctx, t), over(ctx, W, H_, t) }`.
  Standard positions in the 720x1280 set: feet at y 1140-1160, scale 0.8-0.82; Maya x≈150, Sam x≈360, Mum x≈580.
  Wide `[[370, 760, 1.0], [370, 770, 1.06]]`; close-up on a face `[[x, 730, 1.9], [x, 720, 2.2]]`.
- Kit (`toon/adult.js`, read its header): poses `stand | kneel | sit | bed`, `walk`, `bob`, `lean`, `squash`,
  arms `down | hips | cross | point | shrug | wave | facepalm | hold | cheeks | up | phone` (blend with `AT(t, [[t0, pose], ...])`),
  `hold: doughnut | phone | box | ring | tongs | cake | cakeout | pan | mug | suitcase | remote`, faces (eyes, mouth,
  brows, tears, blush, sweat, look), `style` overrides per shot (e.g. the wedding gown `{ outfit: 'gown', top: '#fbfbff', top2: '#dfe4ee', veil: true }`),
  `ADULT.sfxWord`, `ADULT.fire`, `ADULT.bed/blanket`, `ADULT.poly/oval/line` for new props, `FX.sparkle`, `FX.heart`.
  New props or sets go in `toon/adult.js` (check e001 still renders after editing it).
- Make it move: something changes every 2-3 s (cut, pose change, sfxWord, shake on the loud line, hearts, rain...).

## 4. Check (mandatory), push, wait
- `tools/check.py` on every episode. Read the printed PAGE ERRORS (a `V()` word that isn't in that beat is the usual
  one: `"politician's"` is not `"politician"`). LOOK at the sheet: faces not under the subtitles (bottom third),
  close-ups framed on the speaker, nobody cut off at the edges, props visible, each reaction readable.
- Known traps: random numbers inside a per-vertex transform make giant shards (compute positions first, then draw);
  a frame sampled just before a short line's cut can look wrong on the sheet only (check the moment itself with `--times`).
- Push 3-4 episodes per commit; wait until no "Make couch pilots" run is queued before the next push (a second queued
  run cancels the first). If renders got lost: run "Make couch pilots" by hand with the reel box empty.
- Wait for each Release `couchnew-<id>`; download the MP4 and check duration, audio level (ffmpeg volumedetect around
  -15 dB) and a few frames. Fix and re-push failures.
- Then append the ids to `couchnew/schedule.json` "queue" (in story order) and push. Set the batch `done`.
- Report: the episodes (id + title), rendered, days of queue ahead, anything that failed. In chat: send each MP4.
