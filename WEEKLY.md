# Batch run: how to write the next 21 reels

These are the instructions for the scheduled Claude run (every 3 days, the day after the Dave reels run). It writes
21 new reels (a week at 3 a day), checks how they look, opens a pull request, waits while GitHub Actions voices and
renders them onto the pull request, checks the videos, and then merges the pull request itself: the owner asked for
this to be fully automatic. The posting job publishes 3 a day (7:30 AM, 1:30 PM and 9:30 PM IST) from the queue.
The queue is allowed to pile up (each run adds 21; posting uses 9 every 3 days).

## 0. Resume an unfinished batch first (usage limits)
A run can stop halfway (for example when the Claude usage limit is reached). A backup run fires 5 hours after each
main run. Every run starts by checking for an open pull request titled "Reels for the week of ...":
- If one is open and its last commit is less than 90 minutes old, or a "Make reels" run on it is queued or in progress, another run is still working
  on it: stop at once with a one-line report.
- If one is open: do NOT start a new batch. Finish it: write any of its 21 reels that are missing (the pull request
  description lists the plan), wait for the renders, check the videos and merge it.
- If none is open and a "Reels for the week of ..." pull request was merged today or yesterday (IST): this is a
  backup run and there is nothing to do. Stop at once with a one-line report.
- Otherwise start a new batch. Open the pull request early (as soon as the first reels are committed) with the full
  plan of 21 ids, titles and premises in its description, so a later run can pick it up.

## 1. Get oriented

- Read `posted.json`, the titles in `reels/*/meta.json` and the scripts in `reels/*/script.json`, so this week's
  topics are new. Never repeat a premise, a punchline or a "twist" from an earlier reel.
- Always write 21 new reels, whatever is still waiting in the queue.
- Reel ids continue the numbering: `NNNN-short-slug` (for example `0015-who-ate-the-last-slice`).

## 2. Write each reel

**The account:** savage, dark relationship comedy. The same couple (him in mustard, her in red), Violet Room style
(soft 3D mannequin-doll cartoon). The owner wants it **as dark and savage as the limits below allow**: petty revenge,
passive-aggressive wars, red flags, in-law warfare, exes showing up, jealousy that backfires, "divorce speedrun"
energy, villain-level pettiness, and a cruel twist at the end that makes people tag their partner and fight in the
comments. Both of them get to be the villain; alternate who wins. End on a savage punchline or a dark twist, or
(sometimes) a twisted-sweet one. Every reel is a real story: hook, escalation, twist, punchline (see
`engagement/RULES.md`).

**Use the whole world, not just the couch** (`style/kit_couch.js`, `makeCouch`): at least 2-3 locations per reel
(`set`: living, bedroom, kitchen, restaurant, car, mall, party, wedding, street), outfits that fit the moment
(`outfit`: suit, pajamas, gym, party, dress, bride, wedding, apron, winter, towel), and the extra cast when the story
needs them (`extras`: mil = mother-in-law, dad, bff, bro, ex, exgirl, delivery, waiter, cop, boss, kid) plus pets
(`pets`: dog, cat). Give each character a clear role (the mother-in-law who always takes his side, the ex who
"just happened" to be at the same restaurant, the dog who knows everything).

**Hard limits (they keep the account alive):** no sexual content or innuendo, no nudity; no jokes about domestic
violence, abuse, self-harm or real tragedies; nobody actually gets hurt (slapstick only); no insults about looks,
weight, race, religion or disability. Dark means savage behaviour and twists, not cruelty about who people are.

Premises that work (never reuse one): she "accidentally" sells his PS5 to pay for the holiday he forgot; his
mother-in-law moves in "for one week" (day 400); he fakes being sick to skip her friend's party and her friends
show up with soup and a camera; the ex sits at the next table and the waiter knows both their orders; they both
secretly cancel the same anniversary dinner; the dog testifies; the wedding vows include receipts; she reads his
search history out loud; he puts the thermostat in a safe; "I'm fine" escalates into a cold war with lawyers.

**Script (`script.json`):** 20-35 seconds, about 55-90 words. A hook in the first line ("Has this ever happened to
you?", "POV:", "Every couple has this fight."), short punchy phrases, the twist near the end, a 2-6 word closer.
Spell numbers as words. Quoted lines are read by the same narrator.

```json
[ { "id": "hook", "phrases": ["Has this ever happened to you?"] },
  { "id": "ask",  "phrases": ["You ask one simple question.", "Where do you wanna eat?"] } ]
```

Each beat id names one shot-sized moment. Phrases are joined with spaces and sent as one voiceover.

**`meta.json`:** `{ "title": "...", "caption": "one or two lines + a call to tag someone", "hashtags": [6-9 tags], "first_comment": "..." }`.

**Engagement:** follow `engagement/RULES.md` for every reel: a hook in the first second, something changing every
2-3 seconds, the twist in the last 5 seconds, an ending that loops back into the start, 20-35 seconds, a caption
ending in a two-sided question or "tag the one who...", and a `first_comment` hot take or playful vote.

**`story.js`:** the picture. **Write it with `makeCouch`** (`style/kit_couch.js`, documented at the top of that
file): one short spec per shot (camera, his and her pose and face, phones, props, reaction effects such as `q`,
`bubble`, `card`, `stamp`, `hearts`, `twist`, `nope`). Shots, captions (built from script.json, with `keys` in
yellow), cut sounds and effect sounds are automatic, so a reel is about 4 KB instead of 18 KB. Write the custom
`STORY` shape below only for something makeCouch can't do. Do not end the file with a closing brace (the build adds it).

The building blocks (used by makeCouch, and available directly):

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
(about 4-5 minutes per reel, so 1.5-2 hours for 21).

## 5. Check the videos and merge

- Wait until the "Make reels" run on the pull request has finished and `out/<id>.mp4` exists for all 21 reels.
  If a reel failed, read the job log, fix it, push to the branch and wait for the re-render.
- Spot-check every new MP4 (a few frames with ffmpeg): voice present, captions readable, nothing broken.
  A reel that is still broken after a fix: remove its folder and its out/ files from the branch rather than ship it.
- Merge the pull request into main (squash or merge commit). The posting job picks the reels up from the queue in
  name order. Do not run the posting workflow by hand. Do not change `config.json`'s voice (ElevenLabs stays as it is).
- Finish with a short report: the new reels (id, title), how many are now waiting in the queue, anything removed or
  failed and why.
