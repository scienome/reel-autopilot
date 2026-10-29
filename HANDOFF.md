# MASTER PROMPT: paste this into any new Claude session

You are taking over my faceless-reels autopilot. Repo: **github.com/scienome/reel-autopilot** (branch `main`). Read this file
(`HANDOFF.md`) and the README files in each folder first. Then check the state (GitHub Actions runs, Releases, the schedule files) and
either continue the open tasks below, or ask me if something is unclear. Talk to me simply; I check results on my phone.

## Channels and what is live
| Channel | Folder | Style | Posts (IST) | State |
|---|---|---|---|---|
| Toy (Brick toy "what if") | `toyreels/` | LEGO-like 3D toys | 06:00, 12:30, 20:30 | live |
| CouchSarcasm (couch) | `couchnew/` (new); old `reels/` at root is retired | 2D adult cartoon sitcom (Sam, Maya, Mum), one voice per character, laugh track | 07:30, 13:30, 21:30 (02:00/08:00/16:00 UTC) | resumes 30 Oct with e001 |
| Gears & Glitches | `povreels/` (new); `davereels/` is PAUSED, I rejected Dave | 3D soft "violet" style "YOU are the only one who..." POV stories, many voices | 07:30, 12:30, 20:30 | resumes 30 Oct with 001 |

Every reel posts to Instagram **and** YouTube Shorts automatically (GitHub Actions cron). Never run posting workflows by hand unless I ask.

## How it works
- A push that changes `<series>/reels/<id>/` triggers a render workflow (`make-povreels.yml`, `make-couchnew.yml`). It voices the
  script with ElevenLabs (per-line, cached in `voice_lines/`), generates music and sfx (`audio.json`, cached in `eleven/`),
  renders a 9:16 MP4 and publishes a GitHub Release `povreel-<id>` / `couchnew-<id>`.
- The posters only post reels whose Release exists, in queue order:
  - `couchnew/schedule.json`, used because root `config.json` has `"queue": "couchnew"`; poster: `tools/post.py` + `tools/couch_youtube.py`.
  - `povreels/schedule.json`; poster: `tools/ig_mech_post.py`, kind "pov".
  - Add `"paused": "reason"` to a schedule file to stop that series.
- Episode files: `script.json` (beats `{id, who, phrases}`), `story.js` (animation), `meta.json` (title, caption, hashtags,
  first_comment, libs), `audio.json`.
- Voices:
  - Narrator for all channels: Adam `s3TPKV1kjDlVtZbl4Ksh`.
  - Couch cast (`couchnew/config.json`): Sam = Stevie `IvUJKFyjVb5hItY9dJAT`, Maya = Jessica, Mum = Alice.
  - Gears cast (`povreels/config.json`): cute pets and babies = `FgiNpTIapnCbaD6xiqIo`; naughty or bully characters = `zJrRUu1KEcKH8qdpNaPJ`; plus Helen, George, Daniel and others. `cast_fallback` covers voices that get refused.
- Couch cartoon kit: `couchnew/toon/adult.js` (characters, sets living/cafe/hospital/kitchen, props) and `toon/sitcom.js` (episode harness).
  Gears 3D kit: shared `style/` engine + `povreels/lib/pov.js` (dog, cat, thought bubbles, badges).
- Local check: build the reel page and screenshot frames (see `tools/check.py` in each series) before pushing. Verify every
  video before telling me it is good.

## What I approved / rejected
- Couch: **e001 "The Ring" approved ("perfect")**. Rejected: text-message format, "what she says vs means", the old couch reels.
- Gears: keep the **3D POV style**. I want "more and more mixes": dogs, cats, more animals, birds, more humans; crazy, funny,
  make people feel something; 18+ humour allowed (not on the toy channel: no sexual content there).
- Dave reels: rejected completely (paused).

## Current content (2 days+)
- Couch queue: e001-the-ring, e002-thursday, e003-mum-moves-in, e004-sam-cooks, e005-the-birthday, e006-the-dress.
- Gears queue: 001-dog-thoughts, 007-search-history, 002-cat-thoughts, 008-lie-counter, 003-dog-loves-cat,
  010-car-thoughts, 004-pets-home-alone, 009-baby-thoughts, 005-vet-visit, 006-shelter-dog.

## Open tasks (as of 29 Oct 2026, 23:40 IST)
1. Renders of Gears 001-010 and couch e002-e006 were running. Check each Release exists; if any failed, read the log, fix, and
   re-run it (workflow_dispatch with `reel=<id>`). A 2:30 IST re-check was scheduled. **Morning posts must work**: couch
   07:30 IST (e001), Gears 07:30 IST (001).
2. Send me every finished reel one by one (download the Release MP4, check it, send it).
3. After that: keep both queues at least 2 days ahead with new episodes in the same styles. Ask me before changing a style.

## Rules
- Commit messages end with a Co-Authored-By line; no model names in commits.
- Don't post manually; don't delete published things without asking.
