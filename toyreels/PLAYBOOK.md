# Toy reels: the scheduled-run playbook

A scheduled Claude session runs this **once a week**. Each run writes **21 new toy reels** (a week at 3 a day), pushes
them to `main`, and GitHub voices them with **Steve** (ElevenLabs `IvUJKFyjVb5hItY9dJAT`, set in
`toyreels/config.json`; never change it) and renders them into `toyreel-<id>` Releases. The posting workflow
(`.github/workflows/post-toyreels.yml`) then posts them in folder order, 3 a day (10:00, 15:00, 20:00 IST), to
Instagram and YouTube at the same moment. Nothing else needs doing by hand.

## 0. Setup (fresh cloud session)
- Repo: `scienome/reel-autopilot`, push straight to `main` (the owner wants that). Clone it if it is not there.
- Local check tool: `pip install playwright==1.48.0 pillow numpy`, then point it at the pre-installed Chromium:
  `mkdir -p $SP/pwb/chromium-1140 && ln -s /opt/pw-browsers/chromium-*/chrome-linux64 $SP/pwb/chromium-1140/chrome-linux && touch $SP/pwb/chromium-1140/INSTALLATION_COMPLETE`
  (`$SP` = your scratchpad) and run checks as `PLAYWRIGHT_BROWSERS_PATH=$SP/pwb python3 tools/check.py reels/<id>`
  from `toyreels/`. Copy `toyreels/fonts/*.ttf` into `~/.local/share/fonts` and run `fc-cache -f` first.
- If the `/toystyle` skill is available, load it: it describes the Brick Toy style. The existing reels in
  `toyreels/reels/` are the reference either way. Copy their patterns exactly.

## 0b. Resume an unfinished batch first (usage limits)
A backup run fires 6 hours after each main run. Every run starts by reading `toyreels/batch_log.json`:
`[{ "batch": "2026-10-29", "ids": ["11-...", ...], "status": "in_progress" | "done", "updated": "<UTC time>" }]`.
- Keep `"updated"` current on every push. If the newest entry is `in_progress` and `"updated"` is less than 90 minutes
  old (or a "Make toy reels" run is queued or in progress), another run is still working: stop with a one-line report.
- If the newest entry is `in_progress`: do NOT start a new batch. Finish it: write the reels in `ids` that are missing,
  push them, wait for the renders, then set `"status": "done"`.
- If the newest entry is `done` and its `batch` date is today or yesterday (IST): nothing to do; stop with a one-line report.
- Otherwise start a new batch: before writing any reel, append an entry with the planned ids and
  `"status": "in_progress"`, commit and push it with `[skip ci]`. Set `"done"` at the end.

## 1. Plan the week
- Read every `toyreels/reels/*/meta.json` and `script.json`, `toyreels/README.md` (the reel list) and
  `toyreels/posted.json`. Never repeat a topic.
- Next number = highest folder number + 1. Folder ids: `NN-series-slug` (e.g. `11-heist-lufthansa`, `14-body-yawning`).
- Posting order is folder order, so number the reels in the order they should post. Mix series across the week.
- Series that work: **Greatest Heists in Bricks** (multi-part, "Part N/4"), **Your Weird Body**, plus new ones in the
  same spirit: "What if...?" scenarios, history's strangest true stories, how everyday things work, animal
  superpowers, space oddities. Favour instantly clickable hooks and very visual moments that suit toy bricks.
  Keep a multi-part series in consecutive numbers and push all of its parts in the same commit.

## 2. Rules for every reel
- Facts correct; every number checked against a reliable source, listed in `meta.json` `sources`.
- Family friendly: no gore, no blood, no hate symbols, no brand logos, nothing defamatory about real people,
  no current tragedies. Real victims are never the joke.
- Voiceover 25-45 seconds (about 70-120 words), a hook in the first line, short spoken phrases, ends on a question to
  the viewer or a "follow for Part N" line. **Numbers spelled out** in `script.json` (Steve reads them); map them to
  digits on screen with `captions.say`, as the existing reels do. No [brackets] in `script.json`.
- `meta.json`: `title`, `caption` (a hook line + one fact + emoji, plus "Part N of M: follow for Part N+1!" in a
  series), 7-10 `hashtags` (always include `toybricks`), `sources`, `cover_t` on a strong frame.

## 3. Build each reel
- `script.json` (beats with ids and phrases), `story.js` (`makeReel({...})` with one shot per beat, shots timed on
  words with `V(beat, 'word')`), `meta.json`. Copy the structure of the newest existing reels.
- Do not edit `toyreels/style/`, `toyreels/config.json` (the voice and size), `toyreels/tools/`, or anything outside
  `toyreels/reels/`, `toyreels/README.md` and `toyreels/batch_log.json`. Never touch `toyreels/posted.json`,
  `toyreels/posting.json` or the workflows.

## 4. Check, push, wait
- Run `tools/check.py` on every reel and LOOK at the contact sheets: no page errors, characters and props in frame,
  labels readable, no overlapping text. Fix and re-check. Never push an unchecked reel.
- Push a few reels at a time (a series together) to `main` with their README rows, waiting before each push until no
  "Make toy reels" run is queued or in progress. Each push renders only the changed reels.
- Wait for every new `toyreel-<id>` Release to exist (`gh api repos/scienome/reel-autopilot/releases`). If a render
  fails, read its log, fix the reel and push again, or re-run "Make toy reels" for it.
- Set the batch to `"done"`. Do not run the posting workflow by hand.

## 5. Report
A short plain-language report: the 21 new reels (id and title), how many are rendered, how many are now waiting to
post, anything that failed and why.
