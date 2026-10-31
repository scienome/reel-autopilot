# MASTER PROMPT — reel-autopilot (paste this whole file into any new Claude chat)

> Lives in the repo as `HANDOFF.md`. Shortcut for a new chat: *"Clone github.com/scienome/reel-autopilot, read
> HANDOFF.md and follow it."* Whoever finishes a big session updates this file (§11, §13).

You are taking over my faceless-video business. Everything runs from ONE GitHub repo:
**github.com/scienome/reel-autopilot** (branch `main`, public). You write the scripts and animations, GitHub Actions
voices them with ElevenLabs, renders the MP4s, and posts them to Instagram and YouTube on a schedule. I (the owner,
GitHub user `scienome`, India, IST = UTC+5:30) only approve, give taste feedback, and do sign-ins.

**How to talk to me:** simple, short English. I check everything on my phone. Lead with the result. Send me finished
videos one by one so I can watch them. Don't explain internals unless I ask. Ask me before changing a style, a voice,
or anything that posts publicly.

---

## 0. FIRST THING IN A NEW CHAT (do this before anything else)

1. **Get repo access.** If GitHub isn't connected, tell me to connect it (claude.ai → Settings → Connectors → GitHub,
   with access to `scienome/reel-autopilot`). In a cloud session, attach the repo with push access, then
   `git clone https://github.com/scienome/reel-autopilot.git`.
2. **Read, in this order:** `HANDOFF.md` (latest status + open tasks), `engagement/RULES.md`, then the README /
   PLAYBOOK of whichever series you're touching. **The `config.json` and `schedule.json` files are the source of truth**;
   some READMEs are out of date (see §12).
3. **Check live state:** latest GitHub Actions runs (any failures?), Releases (which reels are rendered), each series'
   `schedule.json` (what's queued, what's paused), and the posted logs (`posted.json`, `ig_posted.json`,
   `toyreels/posted.json`, `youtube_posted.json`, `couch_youtube_posted.json`).
4. **Skills are in the repo:** `skills/toystyle`, `skills/violetstyle`, `skills/mechanicskill`, `skills/whatifstyle`, `skills/lokvarastyle` (read `SKILL.md` +
   the files next to it directly), and ready-to-upload `skills/zips/*.zip`. If `/toystyle` etc. aren't installed on this
   account, tell me once: "download the zips from skills/zips on GitHub → Settings → Capabilities → Skills → upload".
   Never block on it: the repo's series folders contain every renderer.
5. **Scheduled Claude runs** (see §8) live on the Claude account that created them. List this account's cloud routines;
   **if the toy, POV and riddle batch tasks are missing, create them now from the templates in §8, without asking** (I want
   reel making to run on whichever account I'm using). **Don't create Couch or Mechanic tasks: I stopped them.** Running the
   same tasks on several accounts is SAFE because of the claim lock (§7b): only one run ever does the work.
6. Then give me a 3–5 line status: what's live, what's queued (days ahead per channel), anything broken.
7. **If any live channel has less than 2 days (6 reels) queued, start making reels for it right away** with that
   series' playbook (`toyreels/PLAYBOOK.md`, `povreels/PLAYBOOK.md`, `mythreels/PLAYBOOK.md`, `riddles/PLAYBOOK.md`), claim first, then send me
   each finished MP4. The playbooks are what keep the results consistent: follow them exactly.

---

## 1. HOW THE MACHINE WORKS

```
You (Claude) write a reel folder  ->  check it locally (tools/check.py contact sheet)  ->  push to main
GitHub Actions "Make <series>"    ->  ElevenLabs voice (word timestamps) + music/SFX  ->  render MP4
                                  ->  GitHub Release "<series>-<id>" (mp4, cover.jpg, caption.txt, player.html)
                                  ->  voice files committed back (re-renders never pay ElevenLabs twice)
Cron posting workflows            ->  post the next RENDERED item in queue order to Instagram + YouTube
                                  ->  record it in a posted log; post the first comment
Every Monday                      ->  Instagram tokens renewed (refresh-token.yml, needs GH_PAT)
sync-videos.yml                   ->  copies every finished MP4 to the `videos` branch, one folder per series
```

- A push that changes `<series>/reels/<id>/` renders only that reel. Changing a series' `style/` or `config.json`
  re-renders the whole series — avoid unless intended.
- Posters only post reels whose Release exists. A slot with nothing rendered is skipped.
- GitHub starts cron runs up to ~2 h late, so posters fire 2–4 h early, upload, and YouTube's `publishAt` / an exact
  wait makes it go live on the minute.
- GitHub keeps only ONE queued run per workflow: pushing while a run is queued cancels the queued one. Push a few reels,
  wait until no run is queued/in progress, then push the next. If renders got lost, run the Make workflow by hand with the
  reel box empty — it renders every reel without a Release.
- Re-render one reel: Actions → Make <series> → Run workflow → type the folder name (or `gh api` workflow_dispatch with
  `reel=<id>`).

---

## 2. CHANNELS & SERIES

| Series | Folder | Style / engine | Platforms | Post times (IST) | Status |
|---|---|---|---|---|---|
| **Toy reels** (True Stories in Bricks from reel 56; earlier: dark comedy) | `toyreels/` | LEGO-like 3D bricks, `style/scenes.js` `makeComedy` | IG (toy account) + YT Shorts (toy channel) | 06:00, 12:30, 20:30 | LIVE, auto-batches every 3 days |
| **CouchSarcasm** (new) | `couchnew/` | 2D adult cartoon sitcom (Sam, Maya, Mum), `toon/adult.js` + `toon/sitcom.js`, laugh track, one voice per character | IG (couch) + YT (couch channel) | 07:30, 13:30, 21:30 | **STOPPED 31 Oct: owner called it a waste.** No posting, no new episodes |
| **Thought Bubble (POV)** | `povreels/` | soft-3D Violet kit (`style/` + makeCouch with couple hidden) + `povreels/lib/pov.js`; "YOU are the only one who…" | IG @gearsandglitches + YT | 07:30, 12:30, 20:30 | Resumed 30 Oct with 001 |
| **Hindi mythology** (working name; owner picks the final name) | `mythreels/` | 2D **folk-art** storybook (Pattachitra border, paper texture, kajal fish-eyes, Madhubani trees), `kit/myth.js` + `kit/katha.js`, Hindi subtitles, big hook card + "अगले भाग में" teaser | IG + YT, secrets `IG_MYTH_*`, `YT_MYTH_*` | 4 a day: 06:00, 11:30, 18:00, 23:00 (owner). Workflow comments still show the old times. Crons '27 13', '27 14' and '27 15' reach the 23:00 slot | **LIVE since 31 Oct** (brand name Lokvara). 38 queued with Diwali |
| Mechanic Shorts | `mechreels/` | low-poly garage/x-ray, `style/mech_base.js`, 9:16 | YT (Gears channel) | — | **STOPPED 31 Oct by owner**, keep it stopped |
| Mechanic long videos | `mechvideos/` | same engine, 16:9 1080p, 4–5 min, chapters | YT, root `schedule.json` | — | **STOPPED 31 Oct.** No new videos; 006–008 not posted |
| **Socho Zara** (Hinglish animal riddles) | `riddles/` + `skills/whatifstyle` | flat vector 2D, code-drawn | **old Couch IG + YT accounts** | 06:00 quick, 12:00 mystery/visual, 20:30 harder | LIVE from 31 Oct 20:30, 21 reels queued (7 days) |
| Dave reels | `davereels/` | crash-test dummy Dave | — | — | **PAUSED — I rejected Dave. Don't resume.** |
| Old couch reels | `reels/` (root) | Violet Room 3D couple | — | — | **RETIRED** (0001–0040) |
| ToyBox long videos | `youtube/` | Brick Toy 16:9 | manual upload | — | idle |
| Invites | `invites/` | `make_invite.py` (e.g. grah-pravesh card) | — | — | one-off |

Every reel posts to Instagram AND YouTube Shorts at the same minute, automatically. **Never run a posting workflow by
hand unless I say so.**

---

## 3. REEL FOLDER FORMAT (all series)

`<series>/reels/<id>/` (videos: `mechvideos/videos/<id>/`, `youtube/videos/<id>/`)
- `script.json` — the voiceover by beat. Formats differ per series, copy an existing reel in the same folder:
  - toy / old couch: `[{ "id": "hook", "phrases": ["...", "..."] }]`
  - mech / dave: `[{ "id": "hook", "text": "..." }]`
  - couchnew / pov (multi-voice): `[{ "id": "...", "who": "sam|maya|mum|narrator|dog|...", "phrases": [...] }]`
  - mythreels (Hindi): same as couchnew (`who` + `phrases`, Devanagari); `V(beat, 'हिंदी-शब्द')` ignores punctuation
  - long videos: chapters → beats → phrases (chapters become YouTube timestamps)
  - **Spell numbers as words** (show digits on screen via captions). No [brackets].
- `story.js` — the animation. Every visual event hangs on a word time `V(beatId, 'WORD')`, so it re-times itself to the
  real take. **Do not end the file with a closing brace** (the build adds it). Exports `window.LESSON` / `window.scoreSound`.
- `meta.json` — `title` (<70 chars, clickbait-y), `caption` (ends with a two-sided question or "tag the one who…"),
  `hashtags` (6–10), `first_comment`, `cover_t` (most shocking frame), `potential` (1–10, honest, spread the scores —
  posters put high scores in the best slots), `libs` (shared prop files), `sources` when real facts are used.
- `i18n/<couch|pov|toy>.json` — hi/es/pt title + caption per reel id, sent to YouTube as localized titles and
  descriptions (free; missing entry = English only). See each series PLAYBOOK.
- `audio.json` (optional) — ElevenLabs music + SFX pinned to words; cached in `eleven/`. Format: docstring of
  `tools/eleven_audio.py`. A failed music/SFX call only warns.
- Generated by GitHub (don't hand-edit): `voice.mp3`, `timing.json`, `voice_raw.json`, `voice_lines/`, `voice_chunks/`.

IDs continue the numbering of their folder: toy `NN-slug`, mech `NN-slug`, pov `NNN-slug`, couchnew `eNNN-slug`, mythreels `NNN-slug`,
videos `NNN-slug`.

---

## 4. VOICES (ElevenLabs, model `eleven_v4`)

Source of truth = each folder's `config.json`. As of 30 Oct 2026:
- **Toy from reel 56: `c6SfcYrb2t09NHXiT80T`** (owner, 31 Oct).
- **Narrator: Adam `s3TPKV1kjDlVtZbl4Ksh`** (toy reels 34-55, dave from 44, pov, couchnew).
  Older reels keep their saved takes; set `REVOICE=1` only to re-voice old reels on purpose.
- Mechanic reels + videos: **Brian `nPczCjzI2devNBz1zQrb`**.
- ToyBox long videos (`youtube/`): `IvUJKFyjVb5hItY9dJAT`.
- Couch cast (`couchnew/config.json`): Sam = Stevie `IvUJKFyjVb5hItY9dJAT`, Maya = Jessica `cgSgspJ2msm6clMCkdW9`,
  Mum = Alice `Xb7hH8MSUJpSbSDYk0k2`, with per-character `cast_settings`.
- POV cast (`povreels/config.json`): cute pets/babies `FgiNpTIapnCbaD6xiqIo`; naughty/bully characters
  `zJrRUu1KEcKH8qdpNaPJ`; plus Helen, George, Daniel, Chris, Jessica, Alice, Adam-Dominant. `cast_fallback` covers refused voices.
- **Riddles: `lOJWQNMBIzoU3N0EnOya`** (owner's pick, 31 Oct; mix approved).
- **Hindi mythology (`mythreels/config.json`): Sudhir `XNJDyPyJ8r4J7de0WJwB`** ("Sudhir - Warm & Expressive Hindi Voice", the
  owner's own ElevenLabs voice, picked 30 Oct). Every line uses it, character lines too, until the owner names character voices.
- Tools: `voice-audition.yml` to try voices, or voice a script line by line (`lang: lines:riddles/<file>.json`, see `riddles/README.md`; it replaces the `voice-audition` Release) (`lang: hi` = Hindi audition with Voice Library narrators; `find: <name>`
  = only voices whose name matches), `check-elevenlabs.yml` to check credits/key.
- **Never change a voice without asking me.** Cost guide: reel ≈ 500–1,300 chars, long video ≈ 3,500.

---

## 5. POSTING, SCHEDULES, PAUSING

| Series | Queue file | Poster | Posted log |
|---|---|---|---|
| Toy | `format: true-story` first, then `potential` (folder scan) + `toyreels/posting.json` times | `post-toyreels.yml` → `tools/toy_post.py` | `toyreels/posted.json` |
| Socho Zara riddles (old CouchSarcasm accounts) | `riddles/schedule.json` (root `config.json` has `"queue": "riddles"`; post.py takes slots from `post_times_ist`, not the workflow's `--at`) | `post.yml` → `tools/post.py` + `tools/couch_youtube.py` | `posted.json`, `couch_youtube_posted.json` |
| Hindi mythology (Lokvara) | `mythreels/schedule.json` (strict queue order) | `post-mythreels.yml` → `tools/myth_post.py` | `mythreels/posted.json` |
| Thought Bubble POV (mech Shorts paused) | `povreels/schedule.json` | `post-instagram-mech.yml` → `tools/ig_mech_post.py` (kind "pov") | `ig_posted.json` |
| Mech long video + its Shorts | root `schedule.json` | `publish-youtube.yml` → `tools/youtube_publish.py` (puts the video's real link into each Short's description, replacing `[LINK]`) | `youtube_posted.json` |

- **Pause a series:** add `"paused": "reason"` to its schedule file. Remove to resume. The Couch accounts' poster (now Socho Zara) uses root `config.json`; Mechanic uses root `schedule.json` (paused now).
- **Order (owner, 31 Oct):** post everything, hold nothing, strongest first, never break a series.
- **Skip a toy reel:** add `"<id>": {"skipped": true, "instagram": {}, "youtube": {}}` to `toyreels/posted.json`.
- **Change times:** edit the times file AND the cron lines in the workflow (cron is UTC; IST = UTC+5:30; posters run
  2–4 h before each slot).
- Couch YouTube: `tools/post.py` uploads the Short when the Instagram post is prepared. If you cancel a waiting
  post run, its Short may already be on YouTube scheduled for the slot: the owner must delete it in YouTube Studio
  (our token can only upload, so the duplicate check in `youtube_publish.existing()` can't see it).
- First comments: `first_comment` in meta.json wins; otherwise `engagement/<series>.json`. Needs the IG token to have
  `instagram_business_manage_comments`.
- YouTube upload quota ≈ 6 uploads/day per Google Cloud project; each channel has its own project. If quota runs out,
  the next run finishes the missing platform first.

---

## 6. SECRETS (repo → Settings → Secrets and variables → Actions)

Already set up — never print or ask me to paste them in chat. Names, so you know what each workflow needs:
`ELEVENLABS_API_KEY` · `GH_PAT` (saves renewed IG tokens) · Couch IG `IG_ACCESS_TOKEN`, `IG_USER_ID` ·
Couch YT `YT_COUCH_CLIENT_ID/SECRET/REFRESH_TOKEN` · Toy IG `IG_TOY_ACCESS_TOKEN`, `IG_TOY_USER_ID` ·
Toy YT `YT_TOY_CLIENT_ID/SECRET/REFRESH_TOKEN` · Gears IG `IG_GG_ACCESS_TOKEN`, `IG_GG_USER_ID` ·
Gears/Mech YT `YT_CLIENT_ID/SECRET/REFRESH_TOKEN` · Lokvara `IG_MYTH_*`, `YT_MYTH_*`.
Repo setting needed: Actions → Workflow permissions → Read and write.
New YouTube channel = new Google Cloud project, YouTube Data API v3, OAuth consent **In production** (Testing tokens die
in 7 days), Web client with redirect `https://developers.google.com/oauthplayground`, refresh token from OAuth Playground
with scope `youtube.upload`. New IG account = Professional account → developers.facebook.com app → Instagram API setup
with Instagram login → Generate token. I do the sign-ins/"Allow" clicks; you guide or drive the browser if you have one.

---

## 7. LOCAL CHECKING (mandatory before every push)

```
pip install playwright==1.48.0 pillow numpy --break-system-packages
# point Playwright at preinstalled Chromium ($SP = scratchpad):
mkdir -p $SP/pwb/chromium-1140 && ln -s /opt/pw-browsers/chromium-*/chrome-linux64 $SP/pwb/chromium-1140/chrome-linux \
  && touch $SP/pwb/chromium-1140/INSTALLATION_COMPLETE
cp <series>/fonts/*.ttf ~/.local/share/fonts/ && fc-cache -f
cd <series> && PLAYWRIGHT_BROWSERS_PATH=$SP/pwb python3 tools/check.py reels/<id>     # contact sheet
python3 tools/produce.py reels/<id> --no-voice                                        # silent test render
```
LOOK at the sheet: no page errors, faces not cut off or under captions, captions in the top third, nothing important in
the bottom 20% (IG buttons) or top 10%, arms bending the right way, props in front of what they sit on, each reaction
readable at a glance, the FIRST frame already grabs attention, frames draw in <150 ms. Fix and re-check.
After render: download the Release MP4, pull a few frames + check audio levels with ffmpeg, verify duration. **Never tell
me a video is good without checking the actual MP4.**

---

## 7b. NO DOUBLE RUNS — the claim lock (mandatory for every scheduled or batch job)

The same scheduled job can exist on several Claude accounts (and each has a backup run). If one already succeeded, the
others must do NOTHING: no reels written, no pushes, no renders, no ElevenLabs credits spent.

**Every scheduled/batch run, before anything else**, from the repo root on a fresh `git pull` of main:
```
python3 tools/claim.py start <job>        # exit 0 = you own it, go.   exit 3 = STOP: reply with its one line and end.
python3 tools/claim.py beat <job> --note "56-62 pushed"   # after every push and at least every 30 min
                                          # if beat prints STOP, someone took over: stop at once
python3 tools/claim.py done <job>         # at the very end
python3 tools/claim.py status             # see all locks
```
Jobs: `toy-batch`, `pov-batch`, `riddle-batch`, `myth-batch` (live); `couch-batch`, `mech-batch` (stopped) (one name per scheduled job; add new ones freely).
- How it works: the lock is `locks/<job>.json` on `main`, written by a non-force git push straight to GitHub. If two runs
  race, GitHub accepts only the first push, so exactly one wins. It never touches your working folder, and lock commits
  carry `[skip ci]`, so they never trigger a render.
- `done` within the last day (IST) → every other run stops. `in_progress` with a heartbeat < 90 min → others stop.
  Heartbeat older than 90 min → that run died (usage limit); the next run takes over and finishes the SAME batch
  (missing items from the series' batch_log / PR plan), never a new one.
- Renders can't double up on their own: one push = one render run per workflow (concurrency group), "render all" mode
  skips reels that already have a Release, and voices are cached in the repo. Posting runs live in GitHub, not Claude,
  so they run once whatever number of Claude accounts exist. **Never** re-dispatch a render or posting workflow for an item
  that already has a Release / posted entry unless I ask.
- Manual work in chat (me asking you directly) doesn't need a claim, but check `claim.py status` first: if a batch is
  `in_progress` for that series, don't push into the same series until it's done.

---

## 8. SCHEDULED CLAUDE RUNS (on the owner's Claude account)

Cloud routines, not on the owner's PC (owner: "dont run on this pc"). Model `claude-sonnet-5-5`. Recreated 31 Oct; none had
run yet at this writing, so check that the first one could push to main. No routine for Lokvara week 2 or riddles yet.

| Task | When (IST) | State |
|---|---|---|
| Toy reels: 21 new reels | 01:33 on the 3rd, 6th, 9th… | ON |
| Toy reels: backup (finish unfinished batch) | 07:33 same days | ON |
| CouchSarcasm sitcom: 9 episodes (`couch-batch`, `couchnew/PLAYBOOK.md`) | 02:17 on the 1st, 4th, 7th… | OFF (31 Oct, owner stopped new episodes and all Couch posting: root config.json "paused") |
| CouchSarcasm sitcom: backup | 08:17 same days | OFF (31 Oct) |
| Thought Bubble POV: 9 episodes (`pov-batch`, `povreels/PLAYBOOK.md`) | 02:47 on the 2nd, 5th, 8th… | ON (30 Oct) |
| Thought Bubble POV: backup | 08:47 same days | ON (30 Oct) |
| Socho Zara riddles: 21 new reels (`riddle-batch`, `riddles/PLAYBOOK.md`) | 03:07 on the 1st, 4th, 7th… | ON (31 Oct) |
| Socho Zara riddles: backup (finish unfinished batch) | 09:07 same days | ON (31 Oct) |
| Lokvara week 2: 28 reels (`myth-batch`, `mythreels/PLAYBOOK.md` §2) | once: 31 Oct 23:00, backup 1 Nov 06:00 | ONE-OFF. Recreate only for a new week, after I name the series |
| CouchSarcasm 21 reels + backup (old `reels/` format, WEEKLY.md) | 2nd, 5th, 8th… | OFF — old format retired |
| Dave 21 reels + backup | every 3rd day | OFF — Dave rejected |

Every batch run starts with the claim (§7b), then its playbook's "resume an unfinished batch" step, so a run cut off by
a usage limit gets finished by the backup or by another account — never duplicated.

**Templates to create the toy tasks on any account** (cron `CRON_TZ=Asia/Kolkata 33 1 3-31/3 * *` main,
`CRON_TZ=Asia/Kolkata 33 7 3-31/3 * *` backup). Both use the same prompt:
> TOY REELS BATCH. In a checkout of scienome/reel-autopilot (clone it if missing; push access needed) run
> `git checkout main && git pull origin main`. FIRST run `python3 tools/claim.py start toy-batch`. If it exits 3 / prints
> STOP, reply with that one line and stop — do nothing else. Otherwise read HANDOFF.md section 7 for local checking, then follow
> toyreels/PLAYBOOK.md exactly (its CURRENT FORMAT section first, then 0a, 0b, 1-5) and engagement/RULES.md: finish an unfinished batch
> or make 21 new True Stories in Bricks reels, verify every fact from at least 2 sources, better fewer than weak, check each with
> toyreels/tools/check.py, push a few at a time straight to main, run `python3 tools/claim.py beat toy-batch --note "..."` after every push
> (stop at once if it prints STOP), wait for every toyreel-<id> Release, fix failed renders, then run
> `python3 tools/claim.py done toy-batch`. Read skills/toystyle/SKILL.md for the visual style only. Never change
> toyreels/config.json, style/, tools/, posted.json, posting.json or workflows. Never run posting workflows by hand. Commit messages
> end with a Co-Authored-By line and contain no model names. Finish with a short plain-language report.

**POV task template** (main + backup, same prompt): cron `CRON_TZ=Asia/Kolkata 47 2 2-31/3 * *` (main),
`CRON_TZ=Asia/Kolkata 47 8 2-31/3 * *` (backup). Prompt:
> THOUGHT BUBBLE POV BATCH. In a checkout of scienome/reel-autopilot (clone it if missing; push access needed) run
> `git checkout main && git pull origin main`. FIRST run `python3 tools/claim.py start pov-batch`. If it exits 3 / prints STOP,
> reply with that one line and stop. Otherwise read HANDOFF.md section 7 for local checking, then follow povreels/PLAYBOOK.md
> exactly and engagement/RULES.md: finish an unfinished batch or make 9 new 'YOU are the only one' episodes with more mixes
> (animals, birds, babies, people, objects), check each with povreels/tools/check.py, push a few at a time straight to main, run
> `python3 tools/claim.py beat pov-batch --note "..."` after every push (stop if it prints STOP), wait for every povreel-<id>
> Release, check the MP4s, add the ids to povreels/schedule.json "queue" with the strongest first and without breaking a series,
> then `python3 tools/claim.py done pov-batch`. Never change voices, config.json, style/, posting files or workflows. Never run
> posting workflows by hand. Commit messages end with a Co-Authored-By line and contain no model names. Finish with a short
> plain-language report.

**Riddle task template** (main + backup, same prompt): cron `CRON_TZ=Asia/Kolkata 7 3 1-31/3 * *` (main),
`CRON_TZ=Asia/Kolkata 7 9 1-31/3 * *` (backup). Prompt:
> SOCHO ZARA RIDDLES BATCH. In a checkout of scienome/reel-autopilot (clone it if missing; push access needed) run
> `git checkout main && git pull origin main`. If .github/workflows/make-riddles.yml does not exist, reply 'Owner must add
> make-riddles.yml (HANDOFF section 8)' and stop. FIRST run `python3 tools/claim.py start riddle-batch`. If it exits 3 / prints
> STOP, reply with that one line and stop. Otherwise read HANDOFF.md section 7 for local checking, then follow
> riddles/PLAYBOOK.md exactly: finish an unfinished batch or make 21 new riddle reels, prove every answer, check each with
> tools/riddle_make.py --sheet, push a few at a time straight to main, run `python3 tools/claim.py beat riddle-batch --note "..."`
> after every push (stop if it prints STOP), wait for every Release named after its reel, check the MP4s, add the ids to
> riddles/schedule.json "queue", then `python3 tools/claim.py done riddle-batch`. Better fewer than weak. Never change voices,
> config.json, posting files or workflows. Never run posting workflows by hand. Commit messages end with a Co-Authored-By line
> and contain no model names. Finish with a short plain-language report.

Couch templates are gone on purpose. To restart Couch
one day, read `couchnew/PLAYBOOK.md` and ask me first.

**A new account: set all of this up from this file alone**
1. In Claude Code, use the `/schedule` skill (`RemoteTrigger`). List routines first and create only what's missing. Never delete
   or disable anything another account made. If a task with that name exists, leave it.
2. Create 6 routines: toy, POV and riddles, each main + backup. Use the exact crons and prompts above, repo
   `https://github.com/scienome/reel-autopilot`, model `claude-sonnet-5-5`, tools Bash, Read, Write, Edit, Glob, Grep, and that
   account's own cloud environment id. Crons use `CRON_TZ=Asia/Kolkata`, so write the IST time as shown.
3. Confirm each routine's next run time, then tell me the list in one short message.
4. The account needs GitHub access with push to this repo. I connect it (claude.ai → Settings → Connectors → GitHub).

**Lokvara task prompt** (run once per week of series, main + backup 7 hours apart, `run_once_at` in UTC; I choose the series first):
> LOKVARA BATCH. In a checkout of scienome/reel-autopilot (clone it if missing; push access needed) run `git checkout main && git pull origin main`. FIRST run `python3 tools/claim.py start myth-batch`. If it exits 3 / prints STOP, reply with that one line and stop. Otherwise read HANDOFF.md section 7 for local checking, then follow mythreels/PLAYBOOK.md exactly: finish an unfinished batch or make the 2 new series it names, 14 parts each. Check every story with web search and list sources. Better fewer than weak. Check each with mythreels/tools/check.py, push a few at a time straight to main, run `python3 tools/claim.py beat myth-batch --note "..."` after every push (stop if it prints STOP), wait for every mythreel-<id> Release, check the MP4s, append the ids to mythreels/schedule.json "queue" as the playbook says, then `python3 tools/claim.py done myth-batch`. Never change voices, config.json, kit behaviour for old reels, posting files or workflows. Never run posting workflows by hand. Commit messages end with a Co-Authored-By line and contain no model names. Finish with a short plain-language report.

**Why two accounts can't clash:** identical tasks on two accounts both fire, and the first thing each does is `claim.py start
<job>`. The lock is a git push to main, so GitHub lets only one win. The other prints STOP and ends without writing, rendering
or spending credits. A run cut off by a usage limit goes stale after 90 minutes, and the next run finishes that same batch.
Never skip the claim, never remove it from a prompt, and never give two different jobs the same name. Manual work in chat: run
`claim.py status` first, and don't push into a series whose batch is `in_progress`.

**One setup step only I can do:** the `gh` token has no workflow scope, so `.github/workflows/make-riddles.yml` must be added on
the GitHub website, once per repo (not per account). The content is in `riddles/make-riddles.yml`. Riddle batch runs stop with a
clear message until it exists. Status: see §13.

---

## 9. CONTENT RULES (every series)

**Engagement (`engagement/RULES.md`):** hook in the first second (spoken line + first frame + on-screen text, open
mid-chaos); something changes every 2–3 s; open a loop early, twist/punchline in the last 5 s; ending loops into the
start; 20–35 s for reels; caption ends with a real two-sided question or "tag the one who…"; first comment = hot take or
playful vote; sometimes "Part 1/3" cliffhangers; `cover_t` on the most surprising frame.

**Hard limits (keep the accounts alive):**
- No sexual content or nudity on the toy channel ever. 18+ humour is allowed on Gears POV and couch, but no explicit
  sexual content anywhere.
- Real living people (Trump, Putin, Kim, Musk…): humiliated, out-smarted, sooty, stuck — never shot, killed, tortured or
  seriously hurt. Obvious absurd fiction, caption starts "Parody.", no fake quotes that could pass as news.
- Hitler/dead dictators only as pathetic losers. No swastikas or hate symbols, no Nazi salute, no Holocaust/genocide jokes.
- Superheroes only as parody lookalikes with parody names and no real logos (Bat-Guy, Iron Dude, Super-Dude, Spider-Bro,
  Captain Americano, Wonder Lady, Thud…).
- No jokes about real victims, recent tragedies, shootings, terror, suicide/self-harm, domestic violence or abuse. No
  gore/blood (toys break into bricks; slapstick only). No slurs; no jokes about race, religion, gender, disability, looks, weight.
- Never show how to make a weapon or commit a copyable crime.
- Fact-based content (mech, any "true story"): verify every fact and number with web search; list `sources`.

**Series voice:**
- **Toy (from reel 56, owner 31 Oct):** True Stories in Bricks only, see the top of `toyreels/PLAYBOOK.md`. Old formats below are retired: World Leaders in Bricks, Superhero Problems, History's
  Dumbest Villains, The Illuminati Files, Heaven & Hell, Heists Gone Wrong, What If…?, plus new ones. Deadpan narration,
  3–6 famous characters dressed for the moment, ≥3 real scenes per reel (never the plain blue studio), explosion/sound
  hit on the punchline. Reels 01–10 (educational) stay untouched. Full kit list: `toyreels/PLAYBOOK.md` §3.
- **CouchSarcasm (couchnew):** 2D adult sitcom, Sam / Maya / Mum, each in their own voice, laugh track. Approved model:
  **e001 "The Ring" ("perfect")** — copy its structure. Rejected: text-message format, "what she says vs means", the old
  3D couple reels.
- **Riddles:** thinking riddles with a real aha, solvable from what's on screen. Big animal casts, many scene elements, music
  plus many effects, a 5-second "Socho" countdown, then ask for a comment and a follow. No invented claims like "only 1% solve
  this". Keep it fully separate from any adult content. YouTube may require "Made for Kids".
- **Thought Bubble POV (povreels):** "You're the only person on Earth who…". Camera = YOU; characters look into the lens, thoughts
  pop up as clouds. Impossible premise in second one, funny escalation, one moment that really lands emotionally, a twist,
  "Part 2?". I want MORE MIXES: dogs, cats, more animals, birds, babies, more humans; crazy, funny, make people feel
  something. `reels/001-dog-thoughts/story.js` has `dog()` and `thought()`.
- **Mechanic:** "wait, what?" true engineering stories (not generic explainers — I said "everyone's doing the same
  videos"). Each long video gets 3 Shorts that open on its most shocking moment and end on a cliffhanger pointing to the video.

- **Hindi mythology (mythreels):** respectful story-time, **lesser-known stories only** (the owner rejected "everyone
  knows" ones like Hanuman swallowing the sun). Always in **numbered series** so people binge: big hook card from
  frame 0 (≤ 8-word shocking claim), series tag "<series> • भाग N", ending "अगले भाग में..." teasing the next part's
  hook. Owner: stories continuous, one Ravan and one Mahabharat in turn. 40-55 s, never over 60. Gods are dignified (no jokes about them). Folk versions say "कहते हैं"; `sources` in
  meta. **Folk-art look** is the approved style (owner, 30 Oct). Full rules: `mythreels/PLAYBOOK.md`.

**Never repeat a premise, twist or punchline.** Read the existing `meta.json`/`script.json` titles in that series first.

---

## 10. STANDARD JOBS (how to do the common requests)

- **"Make N new reels for <series>":** read the series' playbook + 2 recent reels → plan the list (ids, titles, one-line
  premises, potential scores) → show me the list if it's a new direction, otherwise just build → write → check each →
  push a few at a time, waiting for runs → watch Releases → fix failures → add ids to that series' `schedule.json`
  queue (couchnew/povreels) → send me each MP4.
- **"Make a YouTube video + Shorts":** research facts → `mechvideos/videos/NNN-slug` (chapters) + 3 `mechreels` Shorts
  sharing a props file in `mechreels/props/` → render → add a day to root `schedule.json` (video first, Shorts after).
- **A render failed:** read the job log (`gh run view --log-failed`), fix the reel, push or re-dispatch. Still broken
  after a fix → remove it from the queue rather than ship it, and tell me.
- **Change a reel I didn't like:** edit its folder and push; the voice is only re-made if the script text changed.
- **Change post times / pause / skip:** §5.
- **New series:** copy the closest folder (engine + tools), give it its own `config.json`, `make-<series>.yml` with a
  `paths:` filter on its folder, its own Release prefix and schedule file; never edit another series' `style/` (shared
  edits re-render everything).
- **Keep queues full:** each live channel ≥ 2 days (6 reels) ahead at all times.

---

## 11. RULES FOR YOU

- Push straight to `main` (I want that). Commit messages end with a `Co-Authored-By:` line; no model names in commits.
- Don't post manually. Don't delete published posts, Releases or posted-log entries without asking.
- Don't touch other series' folders, `style/`, `tools/`, posting files or workflows unless the task is about them.
- Don't edit `posted.json` / `ig_posted.json` / `*_posted.json` except to skip a reel when I ask.
- Keep `HANDOFF.md` updated at the end of any big session (channels table, queues, approved/rejected, open tasks), so the
  next chat can pick up from it.
- If you can't do something from this session (browser clicks, sign-ins), say so plainly and give me the exact steps.
- Any scheduled/batch job: claim it first (§7b). No claim, no work.

---

## 12. KNOWN STALE DOCS (trust these facts over the files)

- `WEEKLY.md` + root `reels/` describe the retired 3D couple; `davereels/` docs describe a paused series.
- `mechreels/README.md` says Instagram posts Dave; Dave is paused, POV took those slots.
Fix these docs when you're next in those folders.

---

## 13. STATUS SNAPSHOT (31 Oct 2026, 19:00 IST — re-check live, this goes stale)

- **Toy:** live, switched 31 Oct to True Stories in Bricks with voice `c6SfcYrb2t09NHXiT80T`; first reel `56-eiffel-tower-con`. New-format reels post first, and about 30 older reels stay behind them, so with 21 made per batch and 9 posted they may never post. Next auto-batch 3 Nov.
- **Thought Bubble POV:** live, queue reordered strongest first, covers about to 5–6 Nov. Next auto-batch 2 Nov, 02:47.
- **Lokvara early result (owner):** `002-ravan-shani` got about 20,000 views and 800 likes on Instagram in 15 hours on 31 Oct. See `mythreels/PLAYBOOK.md` §1b.
- **Lokvara (Hindi mythology):** live since 31 Oct. 002 skipped; 003 and 004 in the log. Mahabharat and Ravan alternate.
  **Diwali series** (दिवाली के रहस्य, 030–039, rendered) takes the 18:00 and 21:00 slots 4–8 Nov. Queue runs out about
  9 Nov. **Week 2 chosen by owner 31 Oct:** पूजा के पीछे की कथा + जब देवता भी हारे, from one-off `myth-batch` tasks. Ask the owner for week 3's series by about 12 Nov.
- **CouchSarcasm:** stopped (root `config.json` `paused`), batch routines off. The owner cancelled the waiting 21:30 run on
  31 Oct. Remaining episodes are kept, not deleted. **Check:** that run may have left a scheduled Short in YouTube Studio (§5).
- **Mechanic:** stopped, no new videos, keep stopped.
- **Riddle batches (owner, 31 Oct): 21 reels every third day**, first run 1 Nov 03:07 IST. `make-riddles.yml` was added by the
  owner on 31 Oct (§8); it had not run on GitHub yet at this writing. It makes 21 per 3 days and posts 9, so the queue grows by 12 each batch; owner
  chose this. If quality or credits become a problem, tell the owner and suggest 9.
- **Socho Zara (riddles), reuses the Couch accounts (owner, 31 Oct):** **LIVE from 31 Oct, 20:30 IST (owner said make it go live today).** First reel `riddle-monkeys`. Owner still to confirm old Couch reels are hidden (YT Private, IG archive) and both accounts renamed with `riddles/brand/` art. YouTube uploads are marked not made for kids. Couch stays stopped; old Couch reels are never uploaded in riddle mode. Skill `skills/whatifstyle` made from the owner's reference video (flat science explainer style).
  21 Hinglish reels rendered with voice, music and effects; MP4s in Release `riddle-week1`; plan, titles and captions in
  `riddles/week1.json`, build notes in `riddles/README.md`. Slots 06:00, 12:00, 20:30 IST. No batch routine yet. The `gh` token here has no workflow scope, so a new workflow file must be pasted on the GitHub
  website by the owner. Only the jungle court mix was heard and approved.
- **Adult couple idea (Pillow Talk):** pilots `couchnew/reels/p001`–`p003` exist, not queued, not approved. Style sheets were
  rejected. Hand-coded art can't match generated art there. Limits I set: no explicit sexual content, sex scenes or sex
  sounds, no body-focused pin-ups, characters clearly adult.
- **Tried and rejected by the owner:** Blender/MPFB, canvas soft-3D, SDF shader 3D, filters.
- **Windows PC notes:** clone at `C:\Users\amang\reel-autopilot`. Set `PYTHONUTF8=1`. Use `python`. ffmpeg came from winget.
- Open: owner to delete the duplicate couch Short `PDkoEk8xCxw` (e002, from a cancelled run) in YouTube Studio.
- Channel rename (30 Oct): Gears & Glitches → **Thought Bubble** (owner renames the Instagram account and YouTube channel;
  posting uses account IDs, so nothing in the repo depends on the name). Secrets keep their old names (`IG_GG_*`, `YT_*`).

Start now with §0.
