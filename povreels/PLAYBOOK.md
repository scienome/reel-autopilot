# Gears & Glitches POV: the batch playbook

Any Claude session (scheduled or asked in chat) follows this to make new **"YOU are the only one who..."** episodes with
the same look, voices and quality every time. Folder: `povreels/`. Posts 07:30, 12:30, 20:30 IST (Instagram
@gearsandglitches + the Gears YouTube channel) from `schedule.json`, via `tools/ig_mech_post.py` (kind "pov").

## 0. Setup and claim
1. `git checkout main && git pull origin main`. Scheduled/batch runs: `python3 tools/claim.py start pov-batch` first
   (exit 3 = stop with one line); `claim.py beat pov-batch --note "..."` after every push; `claim.py done pov-batch` at
   the end (HANDOFF.md §7b).
2. Local check tool: same Playwright setup as `couchnew/PLAYBOOK.md` §0, then
   `cd povreels && PLAYWRIGHT_BROWSERS_PATH=$SP/pwb python3 tools/check.py reels/<id> $SP/<id>.png`.

## 0b. Resume first
`povreels/batch_log.json` works exactly like the couch one: finish an `in_progress` batch's ids before anything new;
otherwise append the planned ids as `in_progress` and push with `[skip ci]` before writing reels.

## 1. How many
Keep the queue **at least 2 days (6 episodes) ahead**; a scheduled batch makes **9 episodes**. Left = ids in
`schedule.json` "queue" with no `povreel-<id>` entry in the root `ig_posted.json`.

## 2. The show
- The viewer is the hero: "You're the only person on Earth who can hear what dogs think." **The camera is YOU**: nobody
  plays the hero; characters look into the lens; their thoughts pop up as clouds (`thought()`), counters as badges.
- **Shape (25-40 s):** impossible premise in the first second → 3-5 escalating "Day one / Day thirty" or "at work / at
  dinner" beats where the character speaks in their own voice → one moment that really lands emotionally (grandma,
  the old dog, the baby who wants to sleep "for her") → a twist → "Part two?".
- **The owner wants MORE MIXES:** dogs, cats, more animals (birds, parrots, hamsters, fish, horses, cows...), babies,
  kids, grandparents, bosses, exes, objects with feelings (car, phone, fridge). Crazy, funny, 18+ edge allowed
  (no explicit sexual content, nothing about real people). Never repeat a premise (read every `reels/*/script.json`).
- Made so far: 001 dog thoughts, 002 cat thoughts, 003 dog loves cat, 004 pets home alone, 005 vet visit, 006 shelter
  dog, 007 search history, 008 lie counter, 009 baby thoughts, 010 car thoughts, 011 parrot, 012 goldfish, 013 fridge,
  014 pigeons, 015 phone, 016 grandpa, 017 cow, 018 boss. Kit extras in `lib/pov.js`: `bird()` (parrot/pigeon/any
  bird), `fish()`, `cow()`, `objFace()` (cartoon eyes on any object). Reuse voices by cast key: parrot/pigeon `pug`,
  fish `cat`, fridge `car`, phone `friend`, grandpa `dad`, cow `husky`.

## 3. Files per episode (`reels/NNN-slug/`)
- `script.json`: `[ {"id": "hook", "who": "narrator" | <cast key>, "phrases": [...]}, ... ]`. Every character line
  is voiced in its own voice from `config.json` "cast": narrator (Adam), `dog`/`cat`/`baby` (cute voice
  `FgiNpTIapnCbaD6xiqIo`), `pug`/`chihuahua`/`cat2` (naughty/bully voice `zJrRUu1KEcKH8qdpNaPJ`), `husky`, `poodle`,
  `dad`, `boss`, `date`, `mum`, `grandma`, `car`, `friend`. A new character needs a cast entry (+ `cast_fallback`);
  pick from the ElevenLabs library voices already used, and ask the owner before adding a brand-new voice.
- `meta.json`: title (<70 chars, emoji), caption (2 lines + a question), 8 hashtags (`pov`, topic tags, `funny`,
  `animation`, `relatable`, `whatif`, `reels`), `first_comment`, `cover_t`, **`"libs": ["lib/pov.js"]`**.
- `audio.json`: music that shifts mood with the story (playful → tender → playful), 5-8 sfx on words. See
  `tools/eleven_audio.py`.
- `story.js`: `makeCouch({ keys: [...caption keywords], shots: ({ V, first }) => ({ <beat>: spec }) })` from the shared
  `style/kit_couch.js` (read its header). Start the file with `const NOONE = { hide: true };` and give every shot
  `he: NOONE, she: NOONE` (the couple is hidden). Sets: `living | bedroom | kitchen | restaurant | car | mall | party |
  wedding | street`; cameras `[[eye0], [target0], [eye1], [target1]]` at eye height ~1.4-1.7 (the viewer's eyes).
  People: `extras: [{ who: 'mil' | 'dad' | 'bff' | 'bro' | 'ex' | 'exgirl' | 'delivery' | 'waiter' | 'cop' | 'boss' | 'kid', x, z, yaw, sit, arms, face, outfit, s }]`
  (a baby = `kid` with `s: 0.55`). The 3D engine's box is `S.rbox(...)` (there is no `S.box`), and helper names must not
  clash with kit globals (`phone`, `plane`, `cam`, `P`, `C`...): an "already declared" page error means rename yours. Animals and overlays from `lib/pov.js`: `dog(S, {...})`, `cat(S, {...})`,
  `thought(ctx, S, at, text, u)`, `floatCard(...)`, `badge(...)`. Copy the closest existing episode (001-006 animals,
  007-010 people/objects).
- Make it move: a cut or a reaction every 2-3 s, thoughts pop on their line (`popU(t, first(beat), 0.3)`), `fx` (hearts,
  sparkle, card 'PART 2?').

## 4. Check (mandatory), push, wait
- `tools/check.py` every episode; fix PAGE ERRORS (a `V()` word must be in that beat, e.g. "politician's").
- LOOK at the sheet: thought clouds and badges not covering faces or the captions (top band); characters fully in frame
  (pull the camera back when an extra is cut off); nobody seen from behind unless intended; night tint where it's night.
- Known traps: random numbers inside a per-vertex transform make giant shards; extras too close to the camera fill the
  frame; badges anchored on a head in a close-up cover the face (anchor them beside the head).
- Push 3-4 episodes per commit, waiting until no "Make POV reels" run is queued. Wait for each Release `povreel-<id>`,
  download the MP4, check duration, audio (~-15 dB) and frames; the job log must show every line voiced and no
  "sfx skipped".
- Append the ids to `povreels/schedule.json` "queue" (mix animals / people / objects; strongest first), push, set the
  batch `done`. Report ids + titles, rendered, days ahead, failures. In chat: send each MP4.
