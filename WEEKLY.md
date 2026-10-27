# Weekly batch: how to write the next 14 reels

These are the instructions for the weekly Claude run. It writes 14 new reels for the week, checks how they look,
and opens a pull request. GitHub Actions then voices and renders them. The owner watches them and merges the pull
request to approve, and the posting job publishes 2 a day (7:30 AM and 9:30 PM IST).

## 1. Get oriented

- Read `posted.json`, the titles in `reels/*/meta.json` and the scripts in `reels/*/script.json`, so this week's
  topics are new. Never repeat a premise, a punchline or a "twist" from an earlier reel.
- Count the rendered but unposted reels (folders with `out/<id>.mp4` that are not in `posted.json`). If 14 or more
  are still waiting, write only enough to bring the queue to 14 + 14, and say so in the pull request.
- Reel ids continue the numbering: `NNNN-short-slug` (for example `0015-who-ate-the-last-slice`).

## 2. Write each reel

**The account:** sarcastic couple comedy. The same couple on the same navy-violet couch, in the Violet Room style
(soft 3D mannequin-doll cartoon, cosy living room). Every reel is one tiny everyday argument with a sarcastic line
and a twist, ending warm (hearts) or on a smug punchline. Both of them get to be the sarcastic one; alternate who
"wins". Keep it affectionate. No insults about looks, weight, money or family, and nothing mean-spirited.

Good premises: "I'm fine", the thermostat war, "five more minutes", splitting the blanket, who finished the show
without the other, "we need to talk" (about the dishes), the last slice, the plans they cancelled with relief,
"Do I look okay?", the "quick" trip to the shop, the phone at dinner, spoilers, the alarm snooze.

**Script (`script.json`):** 25-40 seconds, about 60-95 words. A hook in the first line ("Has this ever happened to
you?", "POV:", "Every couple has this fight."), short punchy phrases, the twist near the end, a 2-6 word closer.
Spell numbers as words. Quoted lines are read by the same narrator.

```json
[ { "id": "hook", "phrases": ["Has this ever happened to you?"] },
  { "id": "ask",  "phrases": ["You ask one simple question.", "Where do you wanna eat?"] } ]
```

Each beat id names one shot-sized moment. Phrases are joined with spaces and sent as one voiceover.

**`meta.json`:** `{ "title": "...", "caption": "one or two lines + a call to tag someone", "hashtags": [6-9 tags] }`.

**`story.js`:** the picture. Copy `reels/0001-anything-is-fine/story.js` as the starting point and keep its shape.
Do not end the file with a closing brace (the build adds it). What it can use:

- Timing: `const BEATS = window.SCRIPT; const { V, DURATION } = REEL_TIMING(BEATS);`
  `V(beatId, word, n?)` is the start time of a word (minus 0.12 s). Every time in the reel comes from `V`.
  Times are estimated while writing and become exact once the voiceover exists.
- Shots: `SH = [[name, start], ...]` starting with `['hook', 0]`, each later shot starting at `V(beat, firstWord) - 0.15`.
  `shotAt = makeShotAt(SH, DURATION)`. 8-11 shots, each at least about 1.5 s, hard cuts that alternate wide couch
  shots with face close-ups.
- Captions: `CAPS = [[V(beat, word), [['LINE', 'ONE'], [K('KEY'), 'WORD']]], ...]`, chunks of 2-5 words in
  capitals, one yellow keyword `K(...)` in most chunks, timed from the chunk's first word. `caps = makeCaps(CAPS)`.
- The couple: `BOY(S, { arms, head, face, lean, yaw })`, `GIRL(S, {...})` (seated on the couch at x = -0.62 and
  +0.62). Faces: `eyes` open | wide | happy | closed, `mouth` smile | flat | frown | o | open | yawn,
  `brows` (worried > 0, cross < 0), `look: [dx, dy]`, `lids` (0-1, bored or smug), `blush`.
  `arms = [[forward, outward, elbowBend], [...]]` for left and right. `midHands(doll)` gives the point between
  the hands; `doll.hands[i].p` each hand; `doll.head` the head centre.
- Sets and props: `livingRoom(S, { table: true })`, `couch`, `coffeeTable`, `nightStreet` + `nightSky`, `phone`,
  `remote`, `popcorn`, `tv`, and any new prop built from `S.rbox`, `S.cyl`, `S.ball`, `S.limb`, `S.quad`
  (same palette and lighting). 2D icons: `drawFood(ctx, 'pizza' | 'burger' | 'sushi', size)`, `sticker(...)`,
  `foodScreen(kind)` for a phone screen. Add new 2D icons inside the story when a reel needs them.
- Accents: `FX.speed`, `FX.burst` (draw before `S.render` with `{ dof: 0, bg: 'rgba(0,0,0,0)' }`), `FX.ring`
  (red with 'x' = wrong, green with 'tick' = right), `FX.dots`, `FX.heart`, `FX.qmark`, `FX.sweat`,
  `FX.sparkle`, `FX.buzz`. Helpers `shotCam`, `popU`, `ramp`. Finish every frame with `caps(...)` then
  `finish(ctx, W, H_, t, flash)`.
- Sound: `scoreSound(k)` with a whoosh on every cut, a minor pop on every caption chunk, cartoon accents on the
  reactions, buzz + thud for a wrong thing, impact + success for the twist, pops for hearts. Same `V` times.
- Export: `window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) }; window.scoreSound = scoreSound;`

Camera framing that works (720x1280 portrait): wide couch `E [0.2, 1.55, 3.6]` looking at `[0, 1.0, -0.35]`;
his close-up `E [-0.74, 1.62, 1.0]` at `[-0.62, 1.58, -0.42]`; her close-up `E [0.72, 1.6, 1.0]` at
`[0.62, 1.56, -0.42]`; two-shot `E [0, 1.55, 2.8]` at `[0, 1.28, -0.4]`. Push in slowly through each shot with
`shotCam`.

**Legibility rules:** captions stay in the top third (the default y), faces in the middle band, nothing important in
the bottom 20 % (Instagram's buttons) or the top 10 %. Captions at least 50 px (the default 58 px is right).

## 3. Check every reel

Run `python3 tools/check.py reels/<id>` (needs playwright + chromium + the Montserrat font from `fonts/`) and look at
the contact sheet it writes to `out/<id>_check.png`. Fix and re-check until: no page errors, captions clear of faces,
no face cut off at the frame edge, no arm bending the wrong way, props in front of what they rest on, and each
reaction reads at a glance. Frames should draw in under 150 ms.

## 4. Open the pull request

Commit only `reels/<id>/script.json`, `story.js` and `meta.json` for the new reels to a branch
`week-YYYY-MM-DD`, push, and open a pull request titled `Reels for the week of <date>` whose description lists each
reel's id, title and full script. The "Make reels" workflow then voices and renders them onto the pull request
(about 4-5 minutes per reel). Finish by telling the owner the pull request is up and what the week's reels are about.
