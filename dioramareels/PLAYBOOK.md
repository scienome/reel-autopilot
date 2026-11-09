# Elites Endgame city reels: batch playbook

The channel's only format since 6 Nov 2026 (noir is retired and paused). Read `README.md` (kit and sets) and `HANDOFF.md`
section 12e (format, rules, pipeline) first. Copy the structure of the newest reels, `reels/009-debt-sold` and `reels/010-dead-tenants`.

## What to make
- "You live in this city": a hypothetical second-person story in the 3D diorama city. Strong themes so far: money and subscription
  traps, family stakes, survival and panic, debt sold to invented collectors, ghosts. Every reel needs a new twist; read every
  `meta.json` and `script.json` first and never repeat one.
- **Owed follow-ups come first:** Mom's Plan Part 3 (004 ends on "PART 3"), and the door reveal for 007-survive-this-city (007 is held back
  from the queue until its reveal exists; when the reveal is made, add 007 and then the reveal to the queue, in that order).
- 7-8 lines, 20-30 seconds. The first line is the cold hook, spoken from 0 s, with `D.hookCard` on frame 0. End on a comment question.
- Captions at y 845 on wide shots, y 960-985 on close-ups. Faces never under a caption.

## Limits, always
- Labelled fiction (`D.fiction`, and "Fiction." in the caption). Invented people, companies and gangs only. Never a real person,
  company, religion, community or group, and no thin aliases of living people. No gore. Any fact used must be real and checkable.

## Files
`reels/<id>/script.json` (`{"lines": [{"shot", "cap", "say", "cold"}]}`, numbers as words in `say`), `reel.js`, `meta.json`
(`title`, `caption` ending "Fiction. <question>", `hashtags`). Next id = highest number in `reels/` + 1, as `NNN-slug`.

## Check, push, render, queue
1. Contact sheet before pushing: estimate a `timing.js` the way `tools/toy3d_sheet.py` does, then
   `python3 dioramareels/kit/scripts/render.py sheet dioramareels/reels/<id>/reel.js out/<id>/sheet.png --timing out/<id>/timing.js`.
   The first run needs three.js: `tools/toy3d_sheet.py` shows how to fetch it when the CDN is blocked. LOOK at the sheet: no page errors,
   hook readable, nobody cut off, captions clear of faces. Fix and check again.
2. Push the reel folder to main. "Make diorama reels (parallel)" (`make-diorama-parallel.yml`) voices and renders every changed reel on
   its own runner (CPU, 30-60 minutes) and publishes `diorama-<id>`. Push a reel as soon as it passes its check, so renders overlap.
3. When the Release exists, add the id to the end of `schedule.json` "queue". Never reorder or remove ids, never touch other keys.
4. If a render fails, read the log, fix and push again. If it stays broken, leave it out of the queue and say so.
