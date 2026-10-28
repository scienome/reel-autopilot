# Dave reels: the scheduled-run playbook

A scheduled Claude session runs this every 3 days. Each run makes **a full week: 7 days, 21 Reels**, scheduled
right after the last date already in `davereels/schedule.json` (3 a day at 08:30 / 12:30 / 20:30 IST), all rendered
on GitHub before their slot. Posting uses 9 Reels every 3 days, so the queue grows by about 12 per run; that is
intended (the owner wants the bigger buffer).

## 0. Setup (fresh cloud session)
- Repo: `scienome/reel-autopilot`, push straight to `main` (the owner wants that). Clone it if it is not there.
- Local check tool: `pip install playwright==1.48.0 pillow numpy`, then point it at the pre-installed Chromium:
  `mkdir -p $SP/pwb/chromium-1140 && ln -s /opt/pw-browsers/chromium-*/chrome-linux64 $SP/pwb/chromium-1140/chrome-linux && touch $SP/pwb/chromium-1140/INSTALLATION_COMPLETE`
  and run checks as `PLAYWRIGHT_BROWSERS_PATH=$SP/pwb python3 tools/check.py reels/<id>` from `davereels/`.
  Copy `davereels/fonts/*.ttf` into `~/.local/share/fonts` and run `fc-cache -f` first.
- `GH_TOKEN` in the environment can read Releases and Actions runs through the GitHub API.

## 0b. Resume an unfinished batch first (usage limits)
A run can stop halfway (for example when the Claude usage limit is reached). A backup run fires 5 hours after each
main run, and every run starts by checking `davereels/batch_log.json`:
`[{ "batch": "2026-10-31", "ids": ["22-...", ...], "days": ["2026-11-04", ...], "status": "in_progress" | "done", "updated": "<UTC time>" }]`.
- Keep `"updated"` (UTC time) on the entry current: update it with every push. If the newest entry is `in_progress`
  and `"updated"` is less than 90 minutes old, another run is still working on it: stop at once with a one-line report.
- If the newest entry is `in_progress`: do NOT start a new batch. Finish that one: write the reels in `ids` that are
  missing, push the days that are not yet in `schedule.json`, wait for the renders, then set `"status": "done"`.
- If the newest entry is `done` and its `batch` date is today or yesterday (IST): this is a backup run and there is
  nothing to do. Stop at once with a one-line report.
- Otherwise start a new batch: before writing any reel, append an entry with the planned ids and days and
  `"status": "in_progress"`, commit and push it (`[skip ci]` is fine: it holds no reel folders). Set `"done"` at the end.


- Read `davereels/schedule.json`, `davereels/README.md` (the reel list) and `ig_posted.json`.
- Days to add: the 7 days after the last scheduled date (if that date is in the past, start from tomorrow, IST).
- Next reel number = highest existing folder number + 1 (`22-...`, `23-...`). Folder ids: `NN-short-slug`.
- Next "R.I.P. Dave #N" = last card number used + 1 (check the latest `ripCard(..., N, ...)` in the newest story.js).
- Pick the MOST HILARIOUS true stories you can find: absurd engineering fails, ridiculous inventions, ego-driven
  disasters, insane public demos gone wrong, bizarre military/space/science projects, laws of physics winning
  embarrassingly. The best ones make people laugh and then say "wait, that's REAL?". Favour stories with a big,
  visual, slapstick moment for Dave. Prefer famous or instantly-clickable hooks.
- Pick NEW stories only: never repeat a topic already in `davereels/reels/`. Order each day so its strongest hook
  goes at 20:30 IST, the next at 12:30, the weakest at 08:30.

## 2. The rules for every Reel (non-negotiable)
- One real mechanism per Reel, explained correctly; every number checked against a reliable source, listed in `sources`.
- Tone: dark, shocking, funny, educational. Jokes land on bad decisions, physics, egos and Dave; never on real victims.
  When real people died, say it plainly, show no people in that moment, and keep jokes away from it.
- Living people appear only through what they really said or did (quotes on a card, word for word), never shown, never hurt.
- No Nazi or other hate symbols, no Holocaust references, no gore or blood: slapstick deaths only (squash, launch,
  puff, blown away, smoking pile). No brand logos.
- Avoid politics-for-its-own-sake and current tragedies; nothing defamatory or speculative about real people.
- Voiceover 110-170 words, deadpan, short sentences, ends on a dry punchline. Numbers spelled out in script.json.
  [Brackets] are only for planning on-screen action; they never go in script.json.
- Caption (meta.json): a dark one-liner, one learn line, a comment question. 6-9 hashtags including `gearsandglitches`.
  No YouTube link. Title in `title`. `cover_t` on a strong frame. `libs` always includes `davereels/props/dave.js`.

## 3. Build each Reel
- Follow `davereels/README.md` and copy the patterns of the existing `reels/*/story.js` (shots on word times
  `V(beat, 'word')`, `tagLabel` for numbers, `ripCard(ctx, W, H, N, ripU(t), t, { cause })` at the end,
  `ripSound(k, REEL_WORDS.end + 0.45)`, `window.LESSON` / `window.scoreSound` at the bottom, no closing brace).
- Do not edit `davereels/style/` or `davereels/config.json` (that re-renders every Dave Reel), nor anything in
  `mechreels/`, `mechvideos/`, root `schedule.json`, `youtube_posted.json`, `tools/youtube_publish.py`.
  Adding options to `davereels/props/dave.js` is fine if existing calls keep working.
- Check every Reel with `tools/check.py` (default sheet plus `--times` covering every shot) and LOOK at the sheet:
  Dave visible and not cropped, nothing blocking him, captions not covering key action, no page errors.
  Common fixes: camera inside a big object (move it out), huge faces culled near the camera (use `bg: true` quads),
  dark side of objects (key light comes from -x, +y, +z), emoji do not render (draw shapes instead).
- Never push a Reel that has not passed the check.

## 4. Push and schedule, one day at a time
- For each day, earliest first: one commit with that day's 3 reel folders AND that day's entry appended to
  `davereels/schedule.json` (times 08:30 / 12:30 / 20:30) AND the rows added to the README table. Push to `main`.
- Before EACH push, wait until no "Make Dave reels" run is queued or pending (a third queued run cancels the pending one).
- Never push `davereels/**` changes with `[skip ci]` unless they contain no reel folders.
- After the last push, wait until every new `davereel-<id>` Release exists (API: `releases/tags/davereel-<id>`).
  If a render fails, read the job log, fix, re-check, push again. If it still fails, set that slot to `null` in the
  schedule (the poster skips it) and say so in the report.
- Spot-check each new Release MP4 (a few frames with ffmpeg) for voice, length and the R.I.P. card.
- Do not run the Instagram workflow by hand: the scheduled runs post at 08:30 / 12:30 / 20:30 IST on their own.

## 5. Report (short, plain language)
New Reels and their slots (IST), what rendered, anything skipped or failed and why, the next R.I.P. number.
