# Socho Zara: the riddle batch playbook

Hinglish animal riddle reels. A batch is **21 reels**, every third day. Everything runs in the cloud: you write the folders,
GitHub voices and renders them (`make-riddles.yml`), and the Couch accounts' posters post them at 06:00, 12:00 and 20:30 IST.
Art style and kit: `skills/whatifstyle/SKILL.md`, `references/flatkit.js`, `animals.js`, `riddlekit.js`, `riddleengine.js`.

## 0. Resume first

Claim the job first (HANDOFF §7b). Read `riddles/batch_log.json` (create it as `[]` if missing). If the last batch is
`in_progress`, finish its missing reels instead of starting new ones. Otherwise append
`{"batch": N, "ids": [...], "status": "in_progress"}` and push it with `[skip ci]` before writing reels.

## 1. Choose riddles: they must be good

The owner's rule: riddles that make people think, so they stay, comment and follow.
- A real "aha", solvable from what's on screen. No trick wording, no joke answers, no answer that needs outside knowledge.
- **Prove every answer.** Work through every case in writing, or run a small script for logic and number riddles. Check that
  no second answer also fits, and that the wrong answer you call out really is wrong. A wrong riddle costs the channel more
  than a missing one.
- **Never repeat.** Read every title in `riddles/meta/` and `riddles/week1.json` first. A riddle with new animals is still a repeat.
- Prefer original or less common riddles. Write new detective cases where the clue is on screen from the start, like
  `riddle_amavasya.js`: they earn rewatches. Keep classics to about a third.
- **Better fewer than weak.** If you can't find 21 good ones, make fewer and say so in your report.
- Each batch: about 7 quick traps (20–30 s), 7 mystery or visual riddles, 7 harder ones. Under 60 s each.
- No invented claims ("only 1% can solve this"). No sexual content, no gore, no real people. Cartoon stakes only.

## 2. The reel folder: `riddles/reels/riddle-<slug>/`

Copy `riddles/example/riddle-example/`. Longer real examples: the definitions in `skills/whatifstyle/assets/riddle_week.js`.
- `lines.json`: the voice, one entry per shot, ids `r_<shot id>`. Hindi in Devanagari, spoken Hinglish. Short lines, numbers
  as words. Every shot needs a line: hook, setup shots, think, r1, r2..., cta.
- `story.js`: calls `F.runRiddle('r', {...})`. Shot order: `hook`, setup ids, `think`, `r1`, `r2`..., `cta`.
  Shared props are in `F.kit`, worlds in `F.SET`. Draw new props in the same flat style.

Then write `riddles/meta/riddle-<slug>.json`: `title` (no answer in it), `caption` (no answer), `hashtags`, `first_comment`.

Language: voice in Devanagari, on-screen text in Roman Hinglish. Voice: `riddles/config.json`. **Never change the voice without asking.**

## 3. The look that keeps people watching

- First second: the problem, with something moving. Say the stakes in the hook.
- Many characters and elements: animals, birds, props, a real world behind them. Something changes every 2–3 s.
- The 5-second countdown is automatic in `think`. Ask for something specific: a number, a name, a door.
- Reveal step by step. The last answer shot is the "aha". `cta` asks for a comment and shows Follow.
- Keep the thing the riddle depends on visible. Text never covers a face. Nothing the story needs in the top 10% or bottom 15%.
- The first shots must never give away the answer. Check this on purpose.

## 4. Check, push, wait

```
python3 tools/riddle_make.py riddles/reels/<id> --sheet /tmp/<id>.jpg
```
Costs no credits. LOOK at the sheet. Fix anything wrong. Then:
- Push 3–4 reels per commit straight to main, and wait until no "Make riddle reels" run is queued before the next push.
  GitHub keeps only one queued run. If reels were lost, run the workflow by hand with the reel box empty.
- Run `python3 tools/claim.py beat riddle-batch --note "..."` after every push.
- Wait for every Release named `<id>`. Download each MP4, pull a few frames, check its audio and duration.
- A reel that won't render or looks wrong doesn't go in the queue.

## 5. Queue and finish

Append the finished ids to `riddles/schedule.json` "queue". Each day of three slots should run quick, mystery, harder. Never
touch ids already posted. Add new ids only, and don't add them to `release_ids`. Set the batch `done` in `batch_log.json`, push,
then `python3 tools/claim.py done riddle-batch`. Report in plain language: titles, how many made, days of queue ahead, anything that failed.

Don't change `config.json`, posting tools, workflows, or other series. Never run posting workflows by hand.
