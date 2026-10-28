# Mechanic Shorts: the batch playbook

YouTube Shorts in the Mechanic style (low-poly, x-ray parts, glowing flow beads, one-word captions), voiced by the
ElevenLabs voice in `mechreels/config.json` (Brian) and rendered on GitHub as `mechreel-<id>` Releases. The YouTube
publisher (`tools/youtube_publish.py`, root `schedule.json`) uploads each one scheduled for its slot.

## 0. Setup and resuming
- Repo `scienome/reel-autopilot`, push straight to `main`. Local check tool: same setup as `davereels/PLAYBOOK.md`
  section 0, run `tools/check.py` from `mechreels/`.
- `mechreels/batch_log.json` (`[{ "batch": date, "ids": [...], "status": "in_progress" | "done", "updated": UTC }]`)
  works exactly like the Dave one: finish an `in_progress` batch before starting a new one.

## 1. What the Shorts are now
**"How it works" with a shock.** Every Short explains ONE real mechanism through a true story people can't believe:
the engineering behind a disaster, a near-miss, a crazy invention or a record. The hook is the shocking fact; the
explanation is the payoff; the ending makes people argue in the comments. Follow `engagement/RULES.md` (hook in the
first second, a change every 2-3 seconds, the twist in the last 5 seconds, a looping ending, 30-45 seconds).
- Facts correct, numbers checked, sources in `meta.json`. No jokes about real victims; when people died, say it
  plainly and keep the humour on the engineering. No gore. Living people only through their real words, never shown.
- Script 80-120 words, numbers spelled out. Title under 70 characters, a hook not a label ("This $1 part sank the
  Titanic"). Caption: one learn line + a two-sided question. 6-9 hashtags including `gearsandglitches` and `shorts`.
  A Short that belongs to a long video keeps `Full video: [LINK]` in its caption; a standalone Short leaves it out.

## 2. Build each Short with makeMech
- `meta.json` `libs`: `["davereels/props/dave.js", "davereels/props/dave_kit.js", "mechreels/props/mech_kit.js"]`
  plus any prop files the story needs (existing ones in `mechreels/props/`, or a new one).
- `story.js` with `makeMech` (documented at the top of `mechreels/props/mech_kit.js`): one short spec per shot.
  Use 2-3 real locations from the shared set list (garage, road, sky, space, lab, launchpad, factory, ocean, city,
  office, stage, desert) and the dummy crew for every human role (engineer, boss, scientist, general, astronaut,
  pilot...). Spend the effort on the one mechanism: x-ray glass parts and flow beads that make it click.
- `end: { text: 'FULL VIDEO ON THE CHANNEL', at }` for Shorts of a long video, or a question card for standalone ones.
- Check every Short with `tools/check.py` and look at the frames. Never push an unchecked Short.

## 3. Schedule and render
- Push a few Shorts at a time to `main` (wait until no "Make mechanic reels" run is queued); each push renders the
  changed ones. If a run was cancelled, run "Make mechanic reels" by hand with the reel box empty.
- Add the days to the root `schedule.json`: `{ "date": "YYYY-MM-DD", "video": null, "shorts": ["id1", "id2", "id3"] }`
  for standalone Shorts (posted at the `times.shorts` slots). Only add days after the last scheduled date.
- Do not touch `davereels/`, `toyreels/`, `reels/`, `style/`, any `config.json`, the posting workflows or
  `youtube_posted.json`.
