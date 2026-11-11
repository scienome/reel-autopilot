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
4. **Skills are in the repo:** `skills/toystyle`, `skills/violetstyle`, `skills/mechanicskill`, `skills/whatifstyle`, `skills/lokvarastyle`, `skills/pulsestyle` (read `SKILL.md` +
   the files next to it directly), and ready-to-upload `skills/zips/*.zip`. If `/toystyle` etc. aren't installed on this
   account, tell me once: "download the zips from skills/zips on GitHub → Settings → Capabilities → Skills → upload".
   Never block on it: the repo's series folders contain every renderer.
5. **Scheduled Claude runs: ALL OFF since 10 Nov 2026 (owner: "stop all scheduling task in claude").** Do NOT create or
   re-enable any cloud routine unless I ask in chat. Reels are now made only when I ask. (Older rule, now replaced: create the
   toy, POV and riddle tasks from §8.) GitHub posting workflows are not Claude tasks and keep running.
6. Then give me a 3–5 line status: what's live, what's queued (days ahead per channel), anything broken.
7. **If any live channel has less than 2 days (6 reels) queued, tell me first and make reels when I say so** (ElevenLabs credits ran out on 11 Nov, see §0b) with that
   series' playbook (`toyreels/PLAYBOOK.md`, `povreels/PLAYBOOK.md`, `mythreels/PLAYBOOK.md`, `riddles/PLAYBOOK.md`), claim first, then send me
   each finished MP4. The playbooks are what keep the results consistent: follow them exactly.

---

## 0b. CURRENT STATE OF EVERY CHANNEL (11 Nov 2026, 13:45 IST). Read this first; it overrides older status notes below.

**Two things block new reels everywhere:**
1. **Solved 11 Nov 10:26 UTC: the owner put in a new ElevenLabs key** (Creator, 51 of 131,000 used; Adam, Brian, Buster and `IvUJKFyjVb5hItY9dJAT` tested OK; the other channels' voices were not tested and may need adding to this account's My Voices). Before that: **ElevenLabs credits were used up.** The POV batch on 11 Nov 03:18 UTC voiced 056-061, then got "quota 0" for 062-064.
   Every channel's voice is ElevenLabs, so no new reel can be voiced until the owner tops up or the month resets
   (Creator plan, 131,000 characters a month, new account since 1 Nov). Check with `check-elevenlabs.yml`. Re-renders of
   reels whose takes are already saved cost nothing.
2. **All Claude scheduled routines are OFF** (owner, 10 Nov). 20 routines exist on this account, none enabled. Nothing makes
   reels on a timer any more; batches happen only when the owner asks in chat.

**What still runs by itself:** the GitHub posting workflows (each channel below). They post what is queued and stop when a
queue is empty. Failures in the last 60 runs: only "Make POV reels" (credits). Elite city IG and YouTube posts succeed.

### Live channels

| Channel (IG / YT) | Folder | Format now | Voice (ElevenLabs id, `eleven_v4`) | Posts (IST) | Queued (11 Nov) | Lasts to about |
|---|---|---|---|---|---|---|
| **Lokvara** (IG + YT, `IG_MYTH_*`, `YT_MYTH_*`) | `mythreels/` | Hindi folk-art mythology. "Familiar thing, unknown why" + continuing stories; Karna 12 parts at 21:00 | Sudhir `XNJDyPyJ8r4J7de0WJwB` (all reels); Karna first-person `6EphsklDopDQ6eRkwNHT` | 06:30, 12:30, 18:30, 21:00 (Karna only), 22:30 | 16 regular (next 048-ardhanarishvara) + Karna 111, 112 | regular ~15 Nov; Karna ends 12 Nov |
| **Socho Zara** riddles (old Couch IG + YT, `IG_ACCESS_TOKEN`, `IG_USER_ID`, `YT_COUCH_*`) | `riddles/` | Hinglish animal riddles, flat 2D | `lOJWQNMBIzoU3N0EnOya` | 06:30, 12:30, 20:30 (root `config.json`) | 30 | ~21 Nov |
| **toyboxtheory** (IG + YT, `IG_TOY_*`, `YT_TOY_*`) | `toyreels/` | 3D "Let's fix that" fix-chains since 9 Nov (`dioramareels/kit/references/toy3d.js`); old brick reels fill gaps | Buster `PmelHiOxd6s1PUEdOmwF` (3D reels); older reels keep saved takes (`c6SfcYrb2t09NHXiT80T`, Adam) | 01:00, 06:00, 20:30 | 2 3D (133, 134) then 50 old (33 old + 17 true-story); 38 held as `skipped` | 3D runs out 12 Nov; old reels fill ~17 days |
| **Thought Bubble** POV (IG @gearsandglitches + YT, `IG_GG_*`, `YT_*`) | `povreels/` | "You're the only one who…" soft-3D | Adam `s3TPKV1kjDlVtZbl4Ksh` + cast in `povreels/config.json` | 01:00, 06:00, 20:30 | 23 (next 037-washing-machine) | ~18 Nov |
| **Musclyth** fitness (IG + YT, `IG_PULSE_*`, `YT_PULSE_*`) | `pulsereels/` | flat-vector body science, 4 series | `cBTYF7NiJbR8Bvmdeuse` | 01:00, 06:00, 20:30, 22:00 | 9 (next 032-vitamin-d) | ~13 Nov (shortest) |
| **Elites Endgame** (IG @elitesendgame `IG_ELITE_*`; YT @elitesendgame `YT_ELITE_*`) | `dioramareels/` | 3D tilt-shift city, "You live in this city", second person, always fiction | `R9EZoy8pXSL8Yh4yxiew` | 01:00, 06:00, 20:30 (YouTube first, IG one slot behind) | YT 3 (012, 015, 011), IG 2 (015, 011) | ~12 Nov |

**Stopped, keep stopped:** CouchSarcasm (`couchnew/`, accounts now Socho Zara), Mechanic Shorts and videos, Dave, old couch
reels, Elite noir (`mysteryreels/`, `"paused"`; 46 noir reels unposted, never post them unless asked).

### Elites Endgame, everything
- **History:** 1-6 Nov noir comic stories (The Witness, The Last Dinner, Room Four + wildcards; 19 posted, about 126 views
  each). Owner switched on 6 Nov to 3D city reels; the noir schedule is paused.
- **City reels made:** 001-016. 011 Mom's Plan Part 3, 012 door reveal for 007, 013 clone lease, 014 sunlight tax,
  015 sleepwalking city, 016 floor minus one were made 9-10 Nov by a one-off cloud job. 001 and t01 are tests, not queued.
- **Make a reel:** `dioramareels/PLAYBOOK.md` (written 10 Nov) + `README.md`. Push the folder; **`make-diorama-parallel.yml`**
  (added 10 Nov) voices and renders each changed reel on its own runner and publishes `diorama-<id>`. Then add the id to the end
  of `dioramareels/schedule.json` "queue". The old `make-diorama.yml` is sequential with a 90-minute limit: use it only for one reel.
- **Posting:** `post-elite-youtube.yml` → `tools/elite_youtube.py`, then `tools/elite_ig_city.py`. Logs
  `dioramareels/youtube_posted.json`, `instagram_posted.json`. `post-elitesendgame.yml` is the old noir poster: it runs and
  does nothing while noir is paused.
- **Rules:** invented people and companies only, never a real person, company, religion or group, no thin aliases of living
  people, no gore, labelled fiction.

### toyboxtheory 3D, everything
- Model reel `toyreels/reels/128-shopping-bags-3d`. 129-134 made 9 Nov (alarm, earphones, missed bus, umbrella, ice cream,
  keys). Rules: `toyreels/PLAYBOOK.md` CURRENT FORMAT. Render: `make-toy3d.yml` (parallel, push or by hand).
- **Colour fix, 10 Nov:** reels looked washed out because the city's sun (intensity 2) stayed on in the toy world.
  `toy3d.js` now calls `D.city.mode('interior')` each frame and adds `saturate(1.7) contrast(1.15)` after the 3D render.
  131-134 were re-rendered with it; 128-130 had already posted with the old look.

### Voices in use (all ElevenLabs, model `eleven_v4`; never change without the owner)
| Use | Voice id | Name |
|---|---|---|
| Lokvara, all reels | `XNJDyPyJ8r4J7de0WJwB` | Sudhir (Hindi) |
| Lokvara, Karna first person | `6EphsklDopDQ6eRkwNHT` | owner's pick, 1 Nov |
| Socho Zara riddles | `lOJWQNMBIzoU3N0EnOya` | Bismil |
| toyboxtheory 3D reels | `PmelHiOxd6s1PUEdOmwF` | Buster |
| toyboxtheory brick True Stories (old) | `c6SfcYrb2t09NHXiT80T` | Jarnathan |
| Thought Bubble narrator | `s3TPKV1kjDlVtZbl4Ksh` | Adam |
| Thought Bubble cast | cute `FgiNpTIapnCbaD6xiqIo`, naughty `zJrRUu1KEcKH8qdpNaPJ`, Helen `XB0fDUnXU5powFXDhCwa`, George `JBFqnCBsd6RMkjVDRZzb`, Adam Dominant `pNInz6obpgDQGcFmaJgB`, Jessica `cgSgspJ2msm6clMCkdW9`, Alice `Xb7hH8MSUJpSbSDYk0k2`, Daniel `onwK4e9ZLuTAKqWW03F9`, Chris `iP95p4xoKVk53GoZ742B` | see `povreels/config.json` |
| Musclyth | `cBTYF7NiJbR8Bvmdeuse` | in `pulsereels/config.json` |
| Elites Endgame city | `R9EZoy8pXSL8Yh4yxiew` | owner kept ElevenLabs over VoiceStudio, 8 Nov |
| Elite noir (paused) | `eCGXfCpGinKGrwYNoBuo` | owner's pick, 1 Nov |
| Stopped channels | Mechanic Brian `nPczCjzI2devNBz1zQrb`; ToyBox long videos `IvUJKFyjVb5hItY9dJAT`; Couch cast in `couchnew/config.json` | |

### Open items for the owner
- Top up ElevenLabs or wait for the reset: until then no channel gets new reels.
- Musclyth (~13 Nov), Elites Endgame (~12 Nov) and toy 3D (12 Nov) run out first. Lokvara needs the story after Karna
  (Parshuram, Bhishma, Ashwatthama, in that order) and new regular reels by ~15 Nov.
- Scheduled routines are off by the owner's choice; turn any back on only when asked.
- Owed: funnier, outcome-first toyboxtheory hooks (asked earlier, not done).

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
| **Toy reels** (True Stories in Bricks from reel 56; earlier: dark comedy) | `toyreels/` | LEGO-like 3D bricks, `style/scenes.js` `makeComedy` | IG (toy account) + YT Shorts (toy channel) | 06:00, 12:30, 20:30 | LIVE. Auto-batches every 3 days |
| **CouchSarcasm** (new) | `couchnew/` | 2D adult cartoon sitcom (Sam, Maya, Mum), `toon/adult.js` + `toon/sitcom.js`, laugh track, one voice per character | IG (couch) + YT (couch channel) | 07:30, 13:30, 21:30 | **STOPPED 31 Oct: owner called it a waste.** No posting, no new episodes |
| **Thought Bubble (POV)** | `povreels/` | soft-3D Violet kit (`style/` + makeCouch with couple hidden) + `povreels/lib/pov.js`; "YOU are the only one who…" | IG @gearsandglitches + YT | 07:30, 12:30, 20:30 | LIVE. Auto-batches every 3 days |
| **Hindi mythology** (working name; owner picks the final name) | `mythreels/` | 2D **folk-art** storybook (Pattachitra border, paper texture, kajal fish-eyes, Madhubani trees), `kit/myth.js` + `kit/katha.js`, Hindi subtitles, big hook card + "अगले भाग में" teaser | IG + YT, secrets `IG_MYTH_*`, `YT_MYTH_*` | 4 a day: 06:00, 11:30, 18:00, 23:00 (owner). Workflow comments still show the old times. Crons '27 13', '27 14' and '27 15' reach the 23:00 slot | **LIVE since 31 Oct** (brand name Lokvara). 38 queued with Diwali |
| Mechanic Shorts | `mechreels/` | low-poly garage/x-ray, `style/mech_base.js`, 9:16 | YT (Gears channel) | — | **STOPPED 31 Oct by owner**, keep it stopped |
| Mechanic long videos | `mechvideos/` | same engine, 16:9 1080p, 4–5 min, chapters | YT, root `schedule.json` | — | **STOPPED 31 Oct.** No new videos; 006–008 not posted |
| **Socho Zara** (Hinglish animal riddles) | `riddles/` + `skills/whatifstyle` | flat vector 2D, code-drawn | **old Couch IG + YT accounts** | 06:00 quick, 12:00 mystery/visual, 20:30 harder | LIVE from 31 Oct 20:30, 21 reels queued (7 days) |
| **elitesendgame** (fictional first-person mysteries: The Witness, The Last Dinner, Room Four) | `mysteryreels/` | noir comic, `mysteryreels/kit/`; voice `eCGXfCpGinKGrwYNoBuo`. Voiced with `voice-audition.yml` (`lang=lines:<file>`), joined and rendered locally | IG @elitesendgame (`IG_ELITE_*`), no YouTube yet; `post-elitesendgame.yml`, `tools/elite_post.py` (`post-elite.yml` is disabled and unused) | The Witness 06:00, The Last Dinner 20:30, Room Four 01:00, wildcards 13:00 and 18:30 | **LIVE since 1 Nov.** Queue in `mysteryreels/schedule.json`. No automatic episode making yet. Always labelled fiction; no real group or living person as the enemy |
| **Musclyth** (Pulse series: bodybuilding / fitness science, new 3 Nov) | `pulsereels/` | flat-vector body science, `pulsereels/kit/pulse.js`, skill `skills/pulsestyle`; voice `cBTYF7NiJbR8Bvmdeuse`; `make-pulse.yml` → Release `pulse-<id>` | IG + YT **Musclyth** (accounts being created 3 Nov; setup: `pulsereels/SETUP_PROMPT.md`) | — (proposed 06:30, 18:30, 23:30) | **Rendering only, no posting yet.** 001-004 made 3 Nov. See §12c |
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
- **Pulse (bodybuilding science, `pulsereels/config.json`): `cBTYF7NiJbR8Bvmdeuse`** (owner's pick, 3 Nov).
- **Riddles: `lOJWQNMBIzoU3N0EnOya`** (owner's pick, 31 Oct; mix approved).
- **Hindi mythology (`mythreels/config.json`): Sudhir `XNJDyPyJ8r4J7de0WJwB`** ("Sudhir - Warm & Expressive Hindi Voice", the
  owner's own ElevenLabs voice, picked 30 Oct). Every line uses it, character lines too, until the owner names character voices.
- Tools: `voice-audition.yml` to try voices, or voice a script line by line (`lang: lines:riddles/<file>.json`, see `riddles/README.md`; it replaces the `voice-audition` Release) (`lang: hi` = Hindi audition with Voice Library narrators; `find: <name>`
  = only voices whose name matches), `check-elevenlabs.yml` to check credits/key.
- **ElevenLabs account (1 Nov 2026):** owner moved to a new account, Creator plan, 131,000 characters a month. All 16 live and backup voices were tested on it and work with the same IDs. Names: Toy = Jarnathan, Riddles = Bismil. Check credits with `check-elevenlabs.yml`. Owner chose to keep 21-reel Toy and riddle batches although the estimated need is about 440,000 characters a month, so batches may fail when credits run out: tell the owner plainly if they do. Fewer reels or a bigger plan is the owner's call. To test voices cheaply: `voice-audition.yml` with `lang: check`.
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

Cloud routines, not on the owner's PC (owner: "dont run on this pc"). Model `claude-sonnet-5-5`. Cloud runs can push to main: proven 31 Oct.
The routine list can't be deleted through the tool; the owner deletes at claude.ai/code/routines. Off and safe to delete: Couch (2), Weekly couple, Check PR #1, and fired one-offs.
**Read the run's result, not just the lock:** `RemoteTrigger` `list_runs`, then `get_run_log`. A run can say `done` having made far fewer than asked. Cloud runs could not open web pages on 31 Oct, so their facts rest on search summaries.

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
| Lokvara week 2 (`myth-batch`, `mythreels/PLAYBOOK.md` §2) | one-off, fired 31 Oct and 1 Nov | FINISHED with only 4 of 28. One-offs "Lokvara week 2 remaining 24" run 2 Nov 00:30 IST, backup 09:30 IST, on the plan in PLAYBOOK §2b |
| elitesendgame: 35 reels, 21 story + 14 wildcards (job `elite-batch`, `mysteryreels/PLAYBOOK.md`) | 09:00, backup 13:00, on the 2nd, 7th, 12th, 17th, 22nd, 27th | ON (2 Nov). Renders with `make-elite.yml`. Makes 7 a day against 5 posted, so the queue grows by about 10 per batch, at about 95,000 ElevenLabs characters a month: owner's choice, 2 Nov |
| elitesendgame first batch top-up (job `elite-first-35`) | one-off, 2 Nov 16:00 | The first batch began as 21; this finishes it to 35 if it stopped short |
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

- **Hindi mythology (mythreels):** respectful story-time. From 1 Nov: **a familiar thing with an unknown reason** (`mythreels/PLAYBOOK.md` §2b). Earlier rule: lesser-known stories (the owner rejected "everyone
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

## 12b. ELITESENDGAME (new channel, 1-2 Nov 2026)

Owner's fictional mystery channel: narrators who were personally there, not facts-versus-myth explainers. Instagram @elitesendgame only; no YouTube yet. Full rules: `mysteryreels/PLAYBOOK.md`; look and engine: `mysteryreels/kit/SKILL.md`. Voice `eCGXfCpGinKGrwYNoBuo`, `eleven_v4`, chosen by the owner.

- **Stories and slots (IST):** The Witness 06:00 (US evening), The Last Dinner 20:30 (India evening), Room Four 01:00 (UK evening), wildcards 13:00 and 18:30. Each slot is about 30 minutes before peak by general estimate, not account data: check Insights after a week and tell the owner.
- **Pipeline:** push a reel folder to main; `make-elite.yml` runs `tools/elite_make.py`, keeps the takes in `voice_lines/` and publishes Release `elite-<id>`. `post-elitesendgame.yml` runs `tools/elite_post.py`, which posts from `mysteryreels/schedule.json` "series" and records `mysteryreels/posted.json`. Add `"paused": "reason"` to stop. `post-elite.yml` is disabled and unused. `mysteryreels/post-elite.yml.txt` is an old reference copy without the 13:00 and 18:30 crons; the live file is the workflow.
- **Secrets:** `IG_ELITE_ACCESS_TOKEN`, `IG_ELITE_USER_ID`; token renewed on Mondays. Meta app "Reel Autopilot".
- **Batches:** 35 reels (21 story + 14 wildcards) on the 2nd, 7th, 12th, 17th, 22nd and 27th at 09:00, backup 13:00, job `elite-batch`. Routines `trig_017LD4a4QFhugTwNVaW8HdYk`, `trig_01VwLmhjvgduG44iUcFu2Ujw`. The first batch (1 Nov night) made all 35, ids 005-039, 14 wildcards included, every one with a Release; the 2 Nov top-up one-offs had nothing left to do.
- **Posted:** The Witness File 1 on 1 Nov 23:40 IST by hand; from 2 Nov the scheduled slots post on time (checked 2 Nov: 06:00, 13:00, 18:30, 20:30). On 2 Nov evening 34 reels were queued, enough to about 9 Nov.
- **Toy note (2 Nov):** True Stories 58-62 had no Release after a cancelled render; re-rendered 2 Nov, checked and sent.
- **Limits:** always labelled fiction except verified "real and strange" wildcards. Invented groups only, never a real religion, community or living person as the enemy, and no coded versions. Lizard-people and "secret rulers" stories have been used to target Jewish people.
- **Open risks:** about 95,000 ElevenLabs characters a month on a 131,000 plan shared with other channels; 5 posts a day from a new account may reduce reach; 7 reels a day are made against 5 posted, so the queue grows; reels go live without review; visual quality of cloud reels is unproven.
- **Workflow files:** the `gh` token has no workflow scope. In the desktop browser pane, signed in as the owner, open `github.com/<repo>/new/main?filename=...&value=<url-encoded file>` and commit. The owner signs in and handles tokens themselves.

---

## 12c. MUSCLYTH — the Pulse series (bodybuilding / fitness science channel, new 3 Nov 2026)

Owner's English channel: flat-vector "what happens inside your body when you train" Shorts, 35-50 s, worldwide audience.
**Start here:** `pulsereels/README.md` (formats, rules, topic backlog), `skills/pulsestyle/SKILL.md` (the look and the kit),
`pulsereels/SETUP_PROMPT.md` (posting setup, still to do), `pulsereels/brand/BIO.md` (profile text and art).

- **Voice:** `cBTYF7NiJbR8Bvmdeuse`, `eleven_v4`, in `pulsereels/config.json`. Never change without asking. About 600 characters a reel.
- **Pipeline:** push `pulsereels/reels/<id>/` (script.json, story.js, meta.json) to main → `.github/workflows/make-pulse.yml`
  runs `tools/pulse_make.py <id>`: voices each line (takes cached in `voice_lines/`), joins them, renders with
  `pulsereels/kit/render_reel.py` (playwright + ffmpeg, Nunito from `pulsereels/fonts/`), publishes Release `pulse-<id>`
  (mp4, cover.jpg, caption.txt, player.html). One push with several reels renders them all in one run. Run by hand with an
  empty box = render every reel without a Release.
- **Local check:** `python3 tools/pulse_make.py <id> --sheet [times]` → `out/<id>/sheet.png`; `--no-voice` = silent MP4.
- **Made so far (3 Nov):** 001-where-fat-goes (BMJ 2014: 84% leaves as CO2), 002-muscle-memory (myonuclei stay, mouse
  studies; women regained strength in 6 weeks after 7 months off), 003-lactic-acid-myth (lactate is fuel; the burn is H+),
  004-soreness-not-growth (Schoenfeld & Contreras 2013, repeated bout effect). All have Releases. None posted.
- **Brand:** `pulsereels/brand/` profile.png, yt_banner.png (2560x1440), 4 IG highlight covers, BIO.md. No name on the
  art. **Channel name: Musclyth** (owner's pick, 3 Nov; muscle + myth). Folder and secrets keep the name Pulse (`pulsereels/`, `IG_PULSE_*`, `YT_PULSE_*`).
- **Still to do:** new IG + YT accounts → secrets `IG_PULSE_ACCESS_TOKEN`, `IG_PULSE_USER_ID`, `YT_PULSE_CLIENT_ID`,
  `YT_PULSE_CLIENT_SECRET`, `YT_PULSE_REFRESH_TOKEN` → `tools/pulse_post.py` + `post-pulse.yml` + `pulsereels/schedule.json`
  (copy the Lokvara poster pattern) → owner confirms post times → first post → `pulse-batch` routines (main + backup, every
  3rd day, 9 reels each). All of it is written step by step in `pulsereels/SETUP_PROMPT.md`; the owner wants Claude to do
  the website steps in the built-in browser and only stop for passwords, codes and "Allow" clicks.
- **Skill on claude.ai:** `/pulsestyle` (upload `skills/zips/pulsestyle.zip` on a new account). Its reference files also live
  on the owner's "Pulse Sample" artifact; the repo copy in `skills/pulsestyle/` is newer (more props) and is the one to use.
- **Rules:** real science, 2 sources per fact, `sources` in meta.json, flag limited evidence; no steroids, crash diets,
  extreme cutting or body shaming; the lifter is the channel's own character, never another channel's mascots or scenes.

---

## 12d. 4 Nov 2026 — views fixes and the Musclyth fitness pack

- **Stats job:** `ig-stats.yml` + `tools/ig_stats.py` (read-only, daily 02:41 UTC and by hand) writes `engagement/stats/<elite|toy|myth|gg>.json`
  with views, reach, average watch time, likes, shares, saves per reel. Read it before changing a format.
- **elitesendgame (noir):** about 100-150 views a reel, 5-9 s average watch, 3 followers: episodes opened mid-story. All 53 unposted
  reels (010-065) now start with a cold-open line (`"cold": true` in script.json), a big frame-0 hook card, and a hook-first caption
  with "Fiction." after it. Re-rendering with `make-elite.yml`. Rules at the top of `mysteryreels/PLAYBOOK.md`. Episodes 040-065 are new today (queued in schedule.json).
- **Toy:** true stories average about 2,300 views; date-first openers ("In 1518...") kept only 30-34% of the reel watched. The 9 unposted
  date-first reels now open with the outcome (date moved to line 2) and have hook-first captions; re-voiced and re-rendered.
  Rule added to `toyreels/PLAYBOOK.md`. Toy queue is short: 11 new-format reels left on 4 Nov; the 6 Nov batch must run.
- **Musclyth:** the owner wants one channel with four series: Why Does This Happen?, Muscle Building, Exercise, Supplements. Plan,
  rotation and topic lists in `pulsereels/README.md` (CHANNEL PLAN). Pilots 005-008 pushed. **Owner, 4 Nov: 28 reels a week, 4 a day, one from each series every day.** Week 1 = 009-036 (order table in the README); with the pilots that is 32 reels ready. Post times for 4 a day still to agree (earlier proposal was 3: 06:30, 18:30, 23:30). Kit: props packs 2-3 and the `P.reel` builder. Still no posting accounts.
- **Render check (4 Nov, 07:55 UTC):** every POV 031-046, riddle batch 2 and noir 010-065 reel has a Release; samples checked (sound about -15 to -18 dB, new hooks visible). POV 031-046 and riddles batch 2 queued; pov-batch, riddle-batch and elite-batch claims done. Unposted: POV 29, riddles 30, noir 10-11 per slot (about 10 days each). Render workflows now retry the voice push 5 times (two toy runs lost paid voices to a push race).
- **Lokvara** is the best performer (1,500-70,000 views, 15-25 s watch): no change needed.

## 12e. 5-8 Nov 2026 — new post times, Elites Endgame rebuilt as 3D city reels, YouTube, VoiceStudio

**URGENT (8 Nov):** the Elite queue is empty after 8 Nov. YouTube has posted all 8 new reels; Instagram's last one
(010-dead-tenants) goes out 8 Nov 20:30 IST. Nothing is queued after that. Make new reels (below) or Elite goes silent.

### Post times (owner, 5 Nov; all IST, each slot about 30 minutes before a peak)
| Channel | Audience | Times | Files |
|---|---|---|---|
| Lokvara | India | 06:30, 12:30, 18:30, 22:30 + Karna 21:00 | `mythreels/schedule.json`, `post-mythreels.yml` |
| Socho Zara | India | 06:30, 12:30, 20:30 | `config.json` post_times_ist, `post.yml` |
| toyboxtheory | International | 01:00, 06:00, 20:30 | `toyreels/posting.json`, `post-toyreels.yml` |
| Thought Bubble | International | 01:00, 06:00, 20:30 | `davereels/schedule.json` (Dave series still paused), `post-instagram-mech.yml` |
| Musclyth | International | 01:00, 06:00, 20:30, 22:00 | `pulsereels/schedule.json`, `post-pulse.yml` |
| Elites Endgame | International | 01:00, 06:00, 20:30 | `dioramareels/schedule.json`, `post-elite-youtube.yml` |
Cron lines run 4, 3 and 2 hours before each slot; if you change a time, change both files.

### Elites Endgame: the new format (noir is retired)
- **Why:** noir got about 126 views and 6 s watch time at every slot, so the content was the problem, not the timing.
- **Format:** "You live in this city." 3D tilt-shift toy diorama with rich colours, a game-style camera just behind the viewer's
  character, and the "end game" of the powerful shown from the ground floor. Strong reels: money/subscription traps, emotional family
  stakes (mother's care plan, AI dad, rented wedding ring), survival/panic (last elevator, door A/B), debt sold to invented
  collectors, ghosts (dead tenants pay rent).
- **Rules:** always labelled fiction; invented people, companies and gangs only, never a real person, company, religion or group, and
  no thin aliases of living people (the owner suggested names like "Lodant Trump"; declined, use invented names). No gore. Facts behind
  a reel must be real and checkable.
- **Scroll stoppers (kit `hook.js`):** giant frame-0 hook card + voice from 0 s, zoom punch and flash on every line, pinned yellow
  "stay to the end" tag, survival meter, YOUR BALANCE counter, countdowns, door A/B 5-second choice card, a question in the end card.
  Sound effects: the owner wants them soft (no bang on frame 0).
- **Owed follow-ups:** Mom's Plan Part 3 (004 ends on "PART 3"), the door reveal for 007-survive-this-city (held back from the queue
  because it says "tomorrow you find out"). Owner also asked earlier for funnier, outcome-first toyboxtheory hooks: not done yet.

### Elites Endgame: files and pipeline (all on main)
- **Kit:** `dioramareels/README.md`, `kit/references/{diorama,city,life,wedding,hook}.js`, `kit/scripts/render.py` (three.js r149).
  Sets: hero tower x=0 in a full city, elevator x=1000, living room 1100, apartment 1200, hospital 1300, wedding hall 1400,
  hallway with doors A/B 1500. Reels: `dioramareels/reels/<id>/{script.json,reel.js,meta.json}`, 001-010 exist.
- **Voice:** ElevenLabs voice `R9EZoy8pXSL8Yh4yxiew`, `eleven_v4` (`dioramareels/config.json`). Owner tested VoiceStudio on
  8 Nov and chose to **keep ElevenLabs**.
- **Making a reel (fast):** commit the reel folder on GitHub, then `gh workflow run make-diorama.yml -f reel=<ids> -f voice_only=true`
  (voices and commits `voice_lines/`, about 2 minutes). Render on the owner's PC: copy the kit and reel with its voice_lines into a
  folder laid out like the repo, change `GL = [...]` in render.py to `["--use-angle=d3d11", "--ignore-gpu-blocklist"]` so the RTX
  5070 Ti is used, run `python tools/diorama_make.py <id>` (about 20-30 s a reel). Without `voice_only`, GitHub renders on CPU,
  which takes 30-60+ minutes. Then `gh release create diorama-<id> <id>.mp4`.
- **Posting:** `post-elite-youtube.yml` → `tools/elite_youtube.py` (YouTube Short scheduled for the slot) then
  `tools/elite_ig_city.py` (Instagram at the slot, reusing `tools/elite_post.py`). Queue = `dioramareels/schedule.json` "queue";
  records `youtube_posted.json` and `instagram_posted.json`. Instagram runs one slot behind YouTube (it started 6 Nov 06:00).
  Add new ids to the end of "queue". `"paused"` stops both.
- **Noir:** `mysteryreels/schedule.json` has `"paused"`. The `elite-batch` Claude routines may still create noir reels: pause or
  repoint them; nothing posts them.

### YouTube: Elites Endgame
- Channel **Elites Endgame**, handle **@elitesendgame**, on Google account `techbcofficialaman@gmail.com` (renamed from the empty
  "Scieno" channel). Picture and banner: `dioramareels/brand/`. The owner does not want the Instagram picture changed.
- Google Cloud project **Elites Endgame Uploads** (`sixth-utility-513818-t3`), created under scienome@gmail.com, In production,
  youtube.upload scope. Secrets `YT_ELITE_CLIENT_ID`, `YT_ELITE_CLIENT_SECRET`, `YT_ELITE_REFRESH_TOKEN`.

### VoiceStudio (installed on the owner's PC, not used for posting)
- Installed 5 Nov from the verified official installer; backend `http://127.0.0.1:3900`, MCP `/mcp/` (local `.mcp.json`, git-excluded).
  Must be started from Windows (Start menu or desktop shortcut), not from inside the Claude app, or its first-run Python setup breaks.
- Default OmniVoice model is **non-commercial**; CosyVoice 3 (installed 6 Nov, needed MS C++ Build Tools) is labelled Apache-2.0 but
  unverified. Saved voice "EliteEndgame" (`fa11d590`) is a 3 s sample whose source and rights are unclear; it has no ref_text, which
  crashes the backend's GPU transcription unless you pass `ref_text`. Owner chose ElevenLabs; about 30 GB can be removed if wanted.

### Working notes
- Commit through the GitHub website (owner rule). In the editor, `(document.querySelector('.cm-content').cmView||...cmTile).view`
  lets you replace text with `view.dispatch`; pass large files as gzip+base64 and keep a bundle in `sessionStorage` across pages.
  Verify each commit against raw at the latest SHA.
- The Actions "Run workflow" button returned HTTP 500 on 5 Nov; `gh workflow run` worked.
- Cancelling a running posting job was blocked by the Claude auto-mode classifier; the owner must cancel those in Actions.

## 12f. 8 Nov 2026 — toy reels: new "random escalation" format (samples, NOT yet approved)

- The owner wants toy reels to become **random escalation** humour (deadpan "you" narrator, an everyday problem, each fix
  more absurd, a twist; reference: random tank/balcony reel). 2-3 s per beat, 6-7 locations, busy frames (tags, booms,
  props). Badge "STEP BY STEP" (or a topic badge like "STONE AGE"), `meta.json` `"format": "random-escalation"`.
- **Signature object:** the **Gold Tank** — a powerful golden battle tank, NOT a character, never named or mentioned in the
  voiceover (`goldTank(S, x, z, s, rot, t, { y, fire, turret })` in toyreels/style/props.js). It appears in EVERY reel;
  in ~1 of 3 it is also the absurd fix. Some first comments: "Did you spot the gold tank? 🟨". toyreels/PLAYBOOK.md has
  the rule ("The Gold Tank, the channel's signature").
- **Voice not decided yet.** Each sample names its voice in `reel/voice.json` (per-reel override in toyreels/tools/voice.py).
  Tested: `pVnrL6sighQX7hVz89cp` (99-barking-dog, 100-tv-remote), `WrPknjKhmIXkCONEtG3j` (101-tv-remote-voice2, same reel,
  for comparison), `5tBfq6CyEBxaLvrzxdJw` (102-stone-age, latest). toyreels/config.json still has the old voice.
- All four samples are rendered (Releases toyreel-99-barking-dog, -100-tv-remote, -101-tv-remote-voice2, -102-stone-age).
  A new ElevenLabs voice must be in the owner's "My Voices" first: 102's first render hung on the voice call until the
  owner added it (toyreels/tools/voice.py now gives up on a hung call after 3 minutes). Waiting on the owner: pick one
  of the 3 voices and say "approve".
- **Samples are held back from posting** (marked `skipped` in toyreels/posted.json): 99-barking-dog, 100-tv-remote,
  101-tv-remote-voice2 (voice test, never post), 102-stone-age. When the owner approves: set the chosen voice in
  toyreels/config.json, delete the `skipped` entries for 99/100/102 (keep 101 skipped), rewrite toyreels/PLAYBOOK.md
  section 2 for random escalation (keep the hard limits), and update the toy batch prompt (21 per run) to match.
- Other 28 Oct-8 Nov changes worth knowing: every poster calls `guard_slot()` (tools/first_comment.py) right before
  publishing, so a slot never gets 2 posts; meta.json `"potential"` (1-10) puts the strongest of the next 3 reels in
  morning/evening slots and the weakest at 12:00-17:00 IST (`best_for_slot`); CouchSarcasm uploads its YouTube Short in
  the same run with publishAt = the slot (no delay); a cancelled/failed run can lose its log commit — if a post went out
  but posted.json lacks it, add the entry by hand or it posts again.
- Scheduled runs need push access: a routine that fires into a fresh session without the repo attached cannot push.
  The toy routines fire into a worker session that has the repo attached; on a new account, create routines whose
  sessions have scienome/reel-autopilot attached with push access (or a worker session made with the repo as source).

## 13. STATUS SNAPSHOT (1 Nov 2026, about 15:30 IST — re-check live, this goes stale)

**Live channels and queues**

| Channel | Posts (IST) | Left to post | Next batch |
|---|---|---|---|
| Toy (True Stories in Bricks) | 06:00, 12:30, 20:30 | 47 reels, 14 of them new format but only 9 of those rendered | 3 Nov 01:33 |
| Thought Bubble POV | 07:30, 12:30, 20:30 | 13 reels, about 4 days | 2 Nov 02:47 |
| Lokvara | 06:00, 11:30, 18:00, 23:00 | 36 reels, about 9 days, to about 10 Nov | 2 Nov 00:30 (one-off, 24 reels) |
| Socho Zara riddles | 06:00, 12:00, 20:30 | 24 reels, about 8 days | 4 Nov 03:07 |

**Stopped:** CouchSarcasm (16 episodes unposted, kept, not deleted; its accounts are now Socho Zara), Mechanic, Dave, old couch reels.

**Problems to fix first**
1. **Lokvara week 2 is short.** The 31 Oct run made 040-043 (parts 1-2 of both new series) and marked `done`, so the backup stopped. Up to 24 more on a new plan (§2b), scheduled for 2 Nov 00:30 IST, backup 09:30. Read that run's log and confirm the count. A `done` lock blocks a new run for that IST day and the next. Plan: `mythreels/batch_log.json`.
2. **Riddle batch made 6, not 21** (`riddle-goliyan`, `riddle-namaste`, `riddle-roti`, `riddle-tota-udaan`, `riddle-nadi-paar`, `riddle-laddoo-chor`). All 6 are queued. Nobody has reviewed them; check their answers. The owner wants 21 a batch.
3. **Toy batch is unfinished.** Lock `toy-batch` is `in_progress`. Reels 57-71 are pushed and at last check 11 of the 16 reels numbered 56-71 had Releases; the render was very slow on 31 Oct. Check run state; if it hung, the owner cancels it and "Make toy reels" runs with an empty box. The 3 Nov run resumes this batch rather than starting a new one. These reels post without owner review. Their sources were not opened, only search summaries.
4. **Eiffel Tower reel (56) hadn't posted** at this writing, though it was promised next: reels 57 and 63 went first, because the poster ranks new-format reels by `potential`. Tell the owner.
5. **Owner to delete in YouTube Studio:** duplicate riddle Shorts `uPfy4TF_H9g`, `PdShMzUgspA`, and couch `PDkoEk8xCxw`. Also check for a Couch Short (e006, "He wasn't allowed to see the wedding dress") left by the run cancelled on 31 Oct, and set old Couch reels Private / archive them on Instagram. Whether the owner has done this, and renamed the accounts and uploaded `riddles/brand/`, is not known.
6. **Check the duplicate-Short fix** (`tools/post.py`, 1 Nov): it was first live for the 1 Nov 20:30 riddle. Other posters already pulled the latest log.

**Owner decisions on record**
- **Riddles:** Hinglish animal riddles on the old Couch accounts, name Socho Zara (my suggestion, used; final username unknown). 21 reels every third day. Week 1 plan in `riddles/week1.json`; MP4s in Release `riddle-week1`.
- **Toy:** switched 31 Oct to True Stories in Bricks with voice `c6SfcYrb2t09NHXiT80T`. New-format reels post first; about 30 old reels wait behind them and may never post.
- **Lokvara direction (owner, 1 Nov): continuing stories (kahaniya) are the main point of the channel; "why" reels are there too, but second.** Flagship chosen: Karna's full life (कर्ण), **12 parts** (owner confirmed 4 Nov), one a day at 21:00 IST as a fifth daily post (1-12 Nov). Then Parshuram, Bhishma, Ashwatthama (owner's order). Karna tells it in first person, voice `6EphsklDopDQ6eRkwNHT` (owner chooses story voices himself). 12 parts, `mythreels/reels/101`-`112`, `kit/karna.js`; each ends with silent text "भाग N". They post one a day at 21:00 IST from 1 Nov through `reserved` in `mythreels/schedule.json` (handled in `tools/myth_post.py`). Owner set: short, emotional, signature line "ये है मेरी कहानी".
- **Lokvara formula (owner, 1 Nov):** only the best stories, and **people must already know the thing but not why** ("आपने हज़ार बार देखा है... पर क्यों?"). He rejected unheard-of stories. Plan and 5-point test: `mythreels/PLAYBOOK.md` §2b; 24 reels is a ceiling.
- **Lokvara:** series पूजा के पीछे की कथा + देवताओं के रूप का रहस्य. जब देवता भी हारे stops at 2 parts. Ask for week 3's series by about 12 Nov. Best result so far: `002-ravan-shani`, about 20,000 views and 800 likes in 15 hours (`mythreels/PLAYBOOK.md` §1b).
- **Credits:** new ElevenLabs account, 131,000 characters a month. Owner keeps 21-reel batches despite my estimate of about 440,000 a month (§4). Expect batches to fail when it runs out; check with `check-elevenlabs.yml` and tell the owner.
- **Order:** post everything, hold nothing, strongest first, never break a series. Times follow the Indian day.
- **Rejected:** Blender/MPFB, canvas soft-3D, SDF shader 3D, filters. **Pillow Talk adult pilots** `couchnew/reels/p001`-`p003` exist, unapproved and unqueued. Limits I set there: no explicit sexual content, sex scenes or sex sounds, no body-focused pin-ups, characters clearly adult. Never mix with the riddle channel.

**Skills:** `skills/whatifstyle` (flat art, riddles), `skills/lokvarastyle` (zip tested for frames; a voiced render from the zip was not tested). Zips in `skills/zips/`.

**Riddle pipeline:** `riddles/PLAYBOOK.md`, `riddles/README.md`, `tools/riddle_make.py`, `make-riddles.yml`. Secrets and logins are never asked for in chat. The `gh` token here has no workflow scope, so workflow edits are pasted on GitHub by the owner.

**Windows PC notes:** clone at `C:\Users\amang\reel-autopilot`. Set `PYTHONUTF8=1`. Use `python`. ffmpeg came from winget. Git can be slow; verify a push on GitHub before saying it's done.

**Names:** Gears & Glitches was renamed **Thought Bubble**, and posting uses account IDs. Secrets keep old names (`IG_GG_*`, `YT_*`). Socho Zara uses `IG_ACCESS_TOKEN`, `IG_USER_ID`, `YT_COUCH_*`.

Start now with §0.

## 12g. 9 Nov 2026: toy channel moved to 3D "Let's fix that" reels (owner approved)
- **Format:** a real everyday problem, "Let's fix that", then a chain of fixes where each one solves the problem the last fix caused
  (the owner's 4 reference reels), with a twist ending. Made in 3D on the diorama engine with the new kit
  `dioramareels/kit/references/toy3d.js`. Model reel: `toyreels/reels/128-shopping-bags-3d`. Rules: `toyreels/PLAYBOOK.md` CURRENT FORMAT.
  Voice Buster `PmelHiOxd6s1PUEdOmwF` (now in `toyreels/config.json`). The brick samples 99-106 and the 3D test `dioramareels/reels/t01-*` are not posted.
- **Pipeline:** a 3D toy reel is `toyreels/reels/<id>/` with `reel.js` + line-by-line `script.json` + `meta.json` (no `story.js`, so
  `make-toyreels.yml` skips it). `make-toy3d.yml` voices it (`tools/toy3d_make.py`, takes in `voice_lines/`) and renders each reel on its
  own runner in parallel (CPU, 30-60 min each), then publishes `toyreel-<id>`. `tools/toy_post.py` posts `"format": "fix-chain-3d"` first.
  Check frames before pushing with `tools/toy3d_sheet.py <id>` (fetches three.js from GitHub, as the CDN is blocked in cloud sessions).
- **Batch:** 9 reels every 3 days. The old toy tasks "Toy reels batch" + backup (made by API, so Claude cannot edit them) still ask for
  21 True Stories; the playbook tells such a run to make 3D reels instead. The "(repo attached)" toy tasks have the new prompt.
- **Held:** old-style True Stories 108-127 are `skipped` in `toyreels/posted.json` (107 had already posted). Older pre-True-Stories reels
  keep filling toy slots until 3D reels are ready (owner's choice). Held entries need empty `"instagram": {}, "youtube": {}` or the
  poster treats them as half-posted and "finishes" them.
- **Long voice requests:** the brick pipeline sends the whole script in one ElevenLabs request; past about 500 characters it hung
  (reel 103). Split such scripts into chapters. The 3D pipeline voices line by line, so it never hits this.
