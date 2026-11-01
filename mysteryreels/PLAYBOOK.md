# elitesendgame: fictional mysteries told by people who were there

Instagram @elitesendgame. Noir comic style, English, first person. Voice `eCGXfCpGinKGrwYNoBuo` in `config.json`: never change it.
Read `kit/SKILL.md` for the look and the engine, and copy the structure of the newest reel of the same story.

## Daily job: one new episode of each of the three stories

1. Read every `script.json` of a story, in order, before writing its next part. Continuity is the whole point.
2. Make the next episode of **all three stories**. Next id = highest number in `reels/` + 1, as `NNN-slug`. Each folder has `script.json`, `reel.js`, `meta.json`.
3. Add each id to the end of its story's list in `schedule.json` "series". Never reorder or remove anything, and never touch the other keys.
4. Check frames (below), then push to main. The push makes the voice, the video and the Release `elite-<id>` by itself. Push one episode at a time, wait for its Release, and download the MP4 to check a few frames and its length.
5. If a render fails, read the log, fix and push. If it stays broken, take the id out of `schedule.json` and say so in your report.

Credits are tight: at most 450 characters of `say` text per episode, and never re-voice without need.

## The three stories

| Slot IST | Story | Series tag on the first frame | Narrator | Where it goes |
|---|---|---|---|---|
| 06:00 | **The Witness** | `THE WITNESS: FILE N` | Daniel, a night worker. Pulled deeper each file: Level Nine, who runs it, what the guards are. Later files take him to other famous secret places | The people behind Level Nine want him as a witness, not a victim |
| 20:30 | **The Last Dinner** | `THE LAST DINNER: PART N` | D. Marlow, a waiter. Offered the eighth chair at a table of seven masks | What the table does, what each crossed-out name was, and whether he can get up alive |
| 01:00 | **Room Four** | `ROOM FOUR: PART N` | A cleaner at Area 51, who meets his older self behind a door, then finds a second him at home | Which one is real, and why the older one is warning him |

Series tag in `N.tag`, with `N.note` "A fictional story" just under it, on the first frame of every episode. Tease the next part at the end with a tag like `FILE 4 COMING` or `PART 3 COMING`.

## Rules for every episode

- 25-35 seconds, 8-11 short lines, about 5-7 shots. The first line is the hook. End on a cliffhanger.
- `say` is spoken words with numbers spelled out. `cap` is at most two short lines with one `*RED` word.
- Every time comes from `window.TIMING`. Only ink, paper and one red. Check the frames: nothing clipped, captions readable, nothing that looks like something else by accident.
- Never repeat a twist. Every episode must change what the viewer thinks is going on.

**Fiction limits, always:**
- The secret groups are invented. Never a real religion, caste, community, nationality or ethnic group, and no coded version of one: no bankers-run-the-world, blood or puppet-master tropes, no real hate symbols.
- No real living person, company or government official as a villain. Real places are only settings.
- No gore, sexual content, suicide or self-harm, weapon or crime instructions, medical or election claims, or real tragedies.
- Never present any of it as true.

`meta.json`: `{ "title": "...", "caption": "A fictional story. <Series and part>. <A two-sided question>", "hashtags": ["fiction", "scarystories", "mystery", "creepy", "horrorstory", "noir", "storytime"] }`

## Checking frames

```bash
python3 mysteryreels/kit/scripts/voice.py mysteryreels/reels/<id>/script.json /tmp/<id> --engine estimate
python3 mysteryreels/kit/scripts/render.py sheet mysteryreels/reels/<id>/reel.js /tmp/<id>/sheet.png --timing /tmp/<id>/timing.js
```
If Google Fonts can't load, the sheet uses fallback text; judge layout only. The real fonts load in the render on GitHub.
