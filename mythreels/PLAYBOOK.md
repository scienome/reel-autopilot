# Hindi mythology channel: the batch playbook

Any Claude session follows this to make new episodes with the same look, voice and quality. Folder: `mythreels/`.
Render: push `reels/<id>/` → "Make myth reels" workflow → Release `mythreel-<id>`. Posting is NOT set up yet (the owner
is creating the Instagram + YouTube accounts); when it is, 3 reels a day.

## 1. What the owner wants (30 Oct 2026)
- **Lesser-known stories only.** "Everyone knows" stories are rejected (e.g. Hanuman swallowing the sun, `001`, is
  kept out of the queue). Think "रावण ने शनि देव को बंदी क्यों बनाया?" level: true to the tradition, but most people have
  never heard it.
- **Series, so people binge.** Every episode belongs to a numbered series and ends with "अगले भाग में..." teasing
  the next part's hook. Same series = same morning/afternoon/evening slot on consecutive days.
- **Scroll-stopping hook.** First line ≤ 8 words, a shocking claim or question; the frame-0 image is the most dramatic
  picture of the episode; the big hook card (`hook:`) is on screen from frame 0, readable with the sound off.
- **Folk-art look (approved 30 Oct):** the kit draws it automatically (Pattachitra border, handmade-paper texture,
  kajal fish-eyes, textile hems, Madhubani trees, flower-motif skies, fish-scale water, sun faces). Keep faces and cards
  inside the 30 px border. Don't switch back to the plain look.
- Respectful: gods are dignified (no jokes about them, no comic faces). Say "कहते हैं" for folk versions and list
  the source in `meta.json` `sources`.

## 2. The series (owner, 30 Oct 2026: "1 week, 4 reels a day, 2 series in total")
Both 14-part series are written (`schedule.json` "queue" alternates them: R, Y, R, Y each day). Never repeat a story:
read every `reels/*/script.json` first.
| Series (`series`) | Parts (folder) |
|---|---|
| रावण के रहस्य | 1 Shani as a step (002), 2 Kumbhakarna's Nidrasan (003), 3 nine heads (005), 4 the name "Ravana" (006), 5 Nandi's curse (007), 6 Vedavati (008), 7 Rambha's curse (009), 8 Vali (010), 9 Sahasrabahu (011), 10 Pushpak / Kuber (012), 11 Jaya-Vijaya (013), 12 Indrajit (014), 13 Shurpanakha's husband (015), 14 last lessons (016) — series ends |
| महाभारत के छुपे योद्धा | 1 Barbarik (004), 2 Ghatotkach (017), 3 Iravan (018), 4 Ekalavya (019), 5 Yuyutsu (020), 6 Vikarna (021), 7 Babruvahana (022), 8 Shikhandi (023), 9 Bhagadatta (024), 10 Jarasandha (025), 11 Shalya (026), 12 Vidura = Yama (027), 13 Ashwatthama (028), 14 Abhimanyu (029) — series ends |
Next week: ask the owner which two series to run next (ideas: श्राप जिन्होंने इतिहास बदला; ऐसा क्यों?; देवियों के रहस्य;
हनुमान जी के अनसुने किस्से). A new series' part 1 needs no teaser from the old one; the last part of a series ends
"... यहीं समाप्त। पूरी सीरीज़ प्रोफ़ाइल पर देखें।".
Writing helper: episodes 005-029 were generated with a small Python helper (beats + shots), see any of them for the
compact style (`one`, `two`, `CAM`, `cardOn` from the harness).

## 3. Files per episode (`reels/NNN-slug/`)
- `script.json`: Hindi, `[{ "id", "who": "narrator" | <CAST key>, "phrases": [...] }]`. Simple spoken Hindi (not
  shuddh textbook Hindi). Beats: `h1` hook (≤ 8 words), story beats, maybe 1-2 character lines, `end` (twist / payoff),
  `nx` = "अगले भाग में... <next hook>". **Total 95-115 words** (≈ 45-55 s with Sudhir; `tools/check.py` estimates
  ~10 % short). Over 60 s is not allowed.
- `story.js`: `KATHA((h) => ({ <beat>: shot }), { series, part, hook: 'line 1\nline 2', next: 'teaser\nline 2', nextAt: 'nx', gold: [words] })`
  (harness `kit/katha.js`, kit `kit/myth.js`: read both headers; copy 002-004). Shots: `set`, `setOpt`, `cam`, `draw`, `over`, `shake`.
  `V(beat, 'हिंदी-शब्द')` is the time of a word (punctuation ignored, must exist in that beat), `at(beat, i)` the i-th word.
  Characters: `char(ctx, who, x, y, scale, t, { arms, hold, holdL, halo, glow, pose, lean, flip, face })`. Feet y ≈ 1150-1180;
  a close-up face: cam `[[x, 700, 2.0], [x, 690, 2.3]]`. Keep faces out of the subtitle band (screen y > 980) and out
  of the hook card (screen y 190-450 during the first beat).
- New characters / props / sets go in `kit/myth.js` (CAST, ITEMS, sets) + a Hindi label in `kit/katha.js` SPK.
  No emoji inside canvas text (the render has no emoji font).
- `meta.json`: `title` ("<hook> <emoji> | <series> भाग N", ≤ 90 chars), `caption` (2 lines + a question, Hindi),
  10 hashtags (deity / epic names, `hindumythology`, `sanatandharma`, `animation`, `hindi`, `reels`), `first_comment`,
  `cover_t` (a frame inside the hook), `series`, `part`, `potential` (1-10), `libs: ["kit/myth.js", "kit/katha.js"]`, `sources`.
- `audio.json`: music prompt in the Indian mythological cinematic style (tabla, bansuri, shehnai, war drums, temple
  bells; "no vocals"; gain -7, tail 3) + 6-9 sfx on Hindi words (always one on `nx` "अगले": suspense hit).
- Voice: `config.json` = **Sudhir** (owner's own ElevenLabs voice) for every line. Never change or add voices without
  asking the owner.

## 4. Check, push, wait
- `python3 tools/check.py reels/<id> sheet.png` (Playwright on the pre-installed Chromium, as in couchnew/PLAYBOOK.md):
  no PAGE ERRORS, duration estimate 42-52 s, LOOK at every shot (faces framed, nobody cut off, cards not over faces).
- Push 2-3 episodes per commit; don't push while a "Make myth reels" run is queued (a second queued run replaces it).
- Download each `mythreel-<id>` MP4: duration < 60 s, mean volume ≈ -15 dB, a few frames; the job log shows every line
  voiced and the sfx placed. Then add the id to `schedule.json` "queue" (series order).
