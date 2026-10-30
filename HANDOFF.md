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
4. **Skills are in the repo:** `skills/toystyle`, `skills/violetstyle`, `skills/mechanicskill` (read `SKILL.md` +
   the files next to it directly), and ready-to-upload `skills/zips/*.zip`. If `/toystyle` etc. aren't installed on this
   account, tell me once: "download the 3 zips from skills/zips on GitHub → Settings → Capabilities → Skills → upload".
   Never block on it: the repo's series folders contain every renderer.
5. **Scheduled Claude runs** (see §8) live on the Claude account that created them. List this account's scheduled
   tasks; **if the toy, couch and POV batch tasks are missing, create them now from the templates in §8** (I want reel
   making to run on whichever account I'm using). Running the same tasks on several accounts is SAFE because of the
   claim lock (§7b): only one run ever does the work.
6. Then give me a 3–5 line status: what's live, what's queued (days ahead per channel), anything broken.
7. **If any live channel has less than 2 days (6 reels) queued, start making reels for it right away** with that
   series' playbook (`toyreels/PLAYBOOK.md`, `couchnew/PLAYBOOK.md`, `povreels/PLAYBOOK.md`), claim first, then send me
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
| **Toy reels** (Brick Toy dark comedy) | `toyreels/` | LEGO-like 3D bricks, `style/scenes.js` `makeComedy` | IG (toy account) + YT Shorts (toy channel) | 06:00, 12:30, 20:30 | LIVE, auto-batches every 3 days |
| **CouchSarcasm** (new) | `couchnew/` | 2D adult cartoon sitcom (Sam, Maya, Mum), `toon/adult.js` + `toon/sitcom.js`, laugh track, one voice per character | IG (couch) + YT (couch channel) | 07:30, 13:30, 21:30 | Resumed 30 Oct with e001 |
| **Thought Bubble (POV)** | `povreels/` | soft-3D Violet kit (`style/` + makeCouch with couple hidden) + `povreels/lib/pov.js`; "YOU are the only one who…" | IG @gearsandglitches + YT | 07:30, 12:30, 20:30 | Resumed 30 Oct with 001 |
| Mechanic Shorts | `mechreels/` | low-poly garage/x-ray, `style/mech_base.js`, 9:16 | YT (Gears channel); alternates with POV/Dave in the Gears slots | — | Shorts 01–25 made |
| Mechanic long videos | `mechvideos/` | same engine, 16:9 1080p, 4–5 min, chapters | YT, root `schedule.json` (video 07:30, its 3 Shorts 12:30/17:30/21:30) | — | 001–008 made |
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

IDs continue the numbering of their folder: toy `NN-slug`, mech `NN-slug`, pov `NNN-slug`, couchnew `eNNN-slug`,
videos `NNN-slug`.

---

## 4. VOICES (ElevenLabs, model `eleven_v4`)

Source of truth = each folder's `config.json`. As of 30 Oct 2026:
- **Narrator for every channel: Adam `s3TPKV1kjDlVtZbl4Ksh`** (toy from reel 34, dave from 44, pov, couchnew).
  Older reels keep their saved takes; set `REVOICE=1` only to re-voice old reels on purpose.
- Mechanic reels + videos: **Brian `nPczCjzI2devNBz1zQrb`**.
- ToyBox long videos (`youtube/`): `IvUJKFyjVb5hItY9dJAT`.
- Couch cast (`couchnew/config.json`): Sam = Stevie `IvUJKFyjVb5hItY9dJAT`, Maya = Jessica `cgSgspJ2msm6clMCkdW9`,
  Mum = Alice `Xb7hH8MSUJpSbSDYk0k2`, with per-character `cast_settings`.
- POV cast (`povreels/config.json`): cute pets/babies `FgiNpTIapnCbaD6xiqIo`; naughty/bully characters
  `zJrRUu1KEcKH8qdpNaPJ`; plus Helen, George, Daniel, Chris, Jessica, Alice, Adam-Dominant. `cast_fallback` covers refused voices.
- Tools: `voice-audition.yml` to try voices, `check-elevenlabs.yml` to check credits/key.
- **Never change a voice without asking me.** Cost guide: reel ≈ 500–1,300 chars, long video ≈ 3,500.

---

## 5. POSTING, SCHEDULES, PAUSING

| Series | Queue file | Poster | Posted log |
|---|---|---|---|
| Toy | folder order + `toyreels/posting.json` times | `post-toyreels.yml` → `tools/toy_post.py` | `toyreels/posted.json` |
| CouchSarcasm | `couchnew/schedule.json` (root `config.json` has `"queue": "couchnew"`) | `post.yml` → `tools/post.py` + `tools/couch_youtube.py` | `posted.json`, `couch_youtube_posted.json` |
| Gears POV (+ mech Shorts, alternating) | `povreels/schedule.json` | `post-instagram-mech.yml` → `tools/ig_mech_post.py` (kind "pov") | `ig_posted.json` |
| Mech long video + its Shorts | root `schedule.json` | `publish-youtube.yml` → `tools/youtube_publish.py` (puts the video's real link into each Short's description, replacing `[LINK]`) | `youtube_posted.json` |

- **Pause a series:** add `"paused": "reason"` to its schedule file. Remove to resume.
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
Gears/Mech YT `YT_CLIENT_ID/SECRET/REFRESH_TOKEN`.
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
Jobs: `toy-batch`, `couch-batch`, `pov-batch`, `mech-batch` (one name per scheduled job; add new ones freely).
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

| Task | When (IST) | State |
|---|---|---|
| Toy reels: 21 new reels | 01:33 on the 3rd, 6th, 9th… | ON |
| Toy reels: backup (finish unfinished batch) | 07:33 same days | ON |
| CouchSarcasm sitcom: 9 episodes (`couch-batch`, `couchnew/PLAYBOOK.md`) | 02:17 on the 1st, 4th, 7th… | ON (30 Oct) |
| CouchSarcasm sitcom: backup | 08:17 same days | ON (30 Oct) |
| Gears POV: 9 episodes (`pov-batch`, `povreels/PLAYBOOK.md`) | 02:47 on the 2nd, 5th, 8th… | ON (30 Oct) |
| Gears POV: backup | 08:47 same days | ON (30 Oct) |
| CouchSarcasm 21 reels + backup (old `reels/` format, WEEKLY.md) | 2nd, 5th, 8th… | OFF — old format retired |
| Dave 21 reels + backup | every 3rd day | OFF — Dave rejected |

Every batch run starts with the claim (§7b), then its playbook's "resume an unfinished batch" step, so a run cut off by
a usage limit gets finished by the backup or by another account — never duplicated.

**Templates to create the toy tasks on any account** (cron `CRON_TZ=Asia/Kolkata 33 1 3-31/3 * *` main,
`CRON_TZ=Asia/Kolkata 33 7 3-31/3 * *` backup). Both use the same prompt:
> TOY REELS BATCH. In a checkout of scienome/reel-autopilot (clone it if missing; push access needed) run
> `git checkout main && git pull origin main`. FIRST run `python3 tools/claim.py start toy-batch`. If it exits 3 / prints
> STOP, reply with that one line and stop — do nothing else. Otherwise follow toyreels/PLAYBOOK.md exactly (sections 0a,
> 0b, then 1-5) and engagement/RULES.md: finish an unfinished batch or make 21 new toy reels, check each with
> toyreels/tools/check.py, push a few at a time, run `python3 tools/claim.py beat toy-batch --note "..."` after every push
> (stop at once if it prints STOP), wait for every toyreel-<id> Release, fix failed renders, then run
> `python3 tools/claim.py done toy-batch`. Read skills/toystyle/SKILL.md for the visual style only. Never change
> toyreels/config.json, style/, tools/, posted.json, posting.json or workflows. Never run posting workflows by hand.
> Finish with a short plain-language report.

**Couch and POV task templates** (create both main + backup for each; same prompt for main and backup):
- Couch: cron `CRON_TZ=Asia/Kolkata 17 2 1-31/3 * *` (main), `CRON_TZ=Asia/Kolkata 17 8 1-31/3 * *` (backup). Prompt:
> COUCH SITCOM BATCH. In a checkout of scienome/reel-autopilot (clone it if missing; push access needed) run
> `git checkout main && git pull origin main`. FIRST run `python3 tools/claim.py start couch-batch`. If it exits 3 / prints
> STOP, reply with that one line and stop. Otherwise follow couchnew/PLAYBOOK.md exactly (0, 0b, then 1-4) and
> engagement/RULES.md: finish an unfinished batch or make 9 new episodes continuing the Sam / Maya / Mum story, check each
> with couchnew/tools/check.py, push a few at a time, run `python3 tools/claim.py beat couch-batch --note "..."` after every
> push (stop if it prints STOP), wait for every couchnew-<id> Release, check the MP4s, append the ids to
> couchnew/schedule.json "queue", then `python3 tools/claim.py done couch-batch`. Never change voices, config.json,
> style/, posting files or workflows. Never run posting workflows by hand. Finish with a short plain-language report.
- POV: cron `CRON_TZ=Asia/Kolkata 47 2 2-31/3 * *` (main), `CRON_TZ=Asia/Kolkata 47 8 2-31/3 * *` (backup). Prompt: the
  same text with "GEARS POV BATCH", `pov-batch`, povreels/PLAYBOOK.md, "9 new 'YOU are the only one' episodes with more
  mixes (animals, birds, babies, people, objects)", povreels/tools/check.py, povreel-<id>, povreels/schedule.json.

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
- **Toy:** FUNNY, dark, shocking brick stories. Formats to rotate: World Leaders in Bricks, Superhero Problems, History's
  Dumbest Villains, The Illuminati Files, Heaven & Hell, Heists Gone Wrong, What If…?, plus new ones. Deadpan narration,
  3–6 famous characters dressed for the moment, ≥3 real scenes per reel (never the plain blue studio), explosion/sound
  hit on the punchline. Reels 01–10 (educational) stay untouched. Full kit list: `toyreels/PLAYBOOK.md` §3.
- **CouchSarcasm (couchnew):** 2D adult sitcom, Sam / Maya / Mum, each in their own voice, laugh track. Approved model:
  **e001 "The Ring" ("perfect")** — copy its structure. Rejected: text-message format, "what she says vs means", the old
  3D couple reels.
- **Thought Bubble POV (povreels):** "You're the only person on Earth who…". Camera = YOU; characters look into the lens, thoughts
  pop up as clouds. Impossible premise in second one, funny escalation, one moment that really lands emotionally, a twist,
  "Part 2?". I want MORE MIXES: dogs, cats, more animals, birds, babies, more humans; crazy, funny, make people feel
  something. `reels/001-dog-thoughts/story.js` has `dog()` and `thought()`.
- **Mechanic:** "wait, what?" true engineering stories (not generic explainers — I said "everyone's doing the same
  videos"). Each long video gets 3 Shorts that open on its most shocking moment and end on a cliffhanger pointing to the video.

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

## 13. STATUS SNAPSHOT (30 Oct 2026, 13:00 IST — re-check live, this goes stale)

- Toy: reels 35–55 made and rendered 29–30 Oct (batch `done`); ~37 queued (about 12 days). Next auto-batch 3 Nov.
- Couch: queue e001–e021 (e001, e002 posted 30 Oct). Everything rendered; covers every slot to 5 Nov night.
- POV: queue 001–021 (001, 007 posted 30 Oct). Everything rendered; covers every slot to 5 Nov night.
- The owner may be without a Claude subscription for a few days: posting keeps running on GitHub by itself; only the
  batch tasks pause. When you pick up, check queue days first (§0 step 7).
- Open: owner to delete the duplicate couch Short `PDkoEk8xCxw` (e002, from a cancelled run) in YouTube Studio.
- Channel rename (30 Oct): Gears & Glitches → **Thought Bubble** (owner renames the Instagram account and YouTube channel;
  posting uses account IDs, so nothing in the repo depends on the name). Secrets keep their old names (`IG_GG_*`, `YT_*`).

Start now with §0.
