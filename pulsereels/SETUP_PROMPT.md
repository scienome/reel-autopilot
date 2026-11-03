PULSE CHANNEL — POSTING SETUP (paste into Claude Code on the owner's PC, in C:\Users\amang\reel-autopilot)

You are setting up automatic posting for my new bodybuilding / fitness-science channel "Pulse" (folder pulsereels/).
Talk to me in simple, short English; I'll do every sign-in and "Allow" click myself.

0. Run `git checkout main && git pull origin main` and set PYTHONUTF8=1. Read HANDOFF.md (sections 0, 1, 5, 6, 7b, 8, 11),
   then pulsereels/README.md. Run `python tools/claim.py status`. Reels render already: pushing pulsereels/reels/<id>/
   runs make-pulse.yml and publishes Release pulse-<id> (voice cBTYF7NiJbR8Bvmdeuse; never change it).
1. Ask me for the new Instagram handle and YouTube channel name. Use exactly what I give you.
2. INSTAGRAM (new account): guide me step by step. Switch it to a Professional (Creator) account, add it to the Meta app
   "Reel Autopilot" (developers.facebook.com → Instagram API setup with Instagram login), generate a long-lived token with
   instagram_business_content_publish and instagram_business_manage_comments. I paste the token and user id into
   `gh secret set IG_PULSE_ACCESS_TOKEN` / `gh secret set IG_PULSE_USER_ID` in the terminal myself — never ask me to paste
   secrets in chat, never print them.
3. YOUTUBE (new channel): follow HANDOFF section 6 exactly. New Google Cloud project, YouTube Data API v3, OAuth consent
   screen set to "In production" (Testing tokens die in 7 days), Web client with redirect
   https://developers.google.com/oauthplayground, refresh token from OAuth Playground with scope youtube.upload, signed in as
   the NEW channel. I set YT_PULSE_CLIENT_ID, YT_PULSE_CLIENT_SECRET, YT_PULSE_REFRESH_TOKEN with `gh secret set` myself.
   Then check the three secrets exist with `gh secret list`.
4. POSTER: copy the Lokvara pattern (post-mythreels.yml + tools/myth_post.py), which posts the next rendered reel to
   Instagram AND YouTube Shorts at the same minute, posts the first comment and renews the Instagram token.
   Make tools/pulse_post.py + .github/workflows/post-pulse.yml + pulsereels/schedule.json ({"queue": [...], "post_times_ist": [...]})
   + pulsereels/posted.json. It must: post only reels whose Release pulse-<id> exists, in queue order; read title, caption,
   hashtags, first_comment from meta.json; use cover.jpg; skip a slot with nothing rendered; honour "paused" in
   schedule.json; never post the same reel twice (check posted.json and YouTube before uploading). Do not change any other
   series' posters, secrets or schedules.
5. POST TIMES: the audience is worldwide (English). Suggest 3 a day, for example 06:30 IST (US evening), 18:30 IST (India
   evening / UK afternoon) and 23:30 IST (UK evening / US lunch), and ask me to confirm before writing the crons.
   Crons are UTC (IST = UTC+5:30) and fire 2-4 h early, as HANDOFF section 1 explains.
6. TEST without going public: dry-run pulse_post.py locally (print what it would post). Then ask me before the first real
   post. After my OK, post 001-where-fat-goes, confirm it is live on both platforms, and give me both links.
7. REEL MAKING ON A SCHEDULE: create two cloud routines (main + backup 6 h later, every 3rd day, model as in HANDOFF
   section 8) with job name `pulse-batch`, using the toy prompt in HANDOFF section 8 as the template but pointing at
   pulsereels/README.md and skills/pulsestyle (visual style). Each batch: claim first, make 9 new reels from the README topic
   backlog (never repeat a topic), verify every fact from 2 sources, check each with
   `python tools/pulse_make.py <id> --sheet`, push a few at a time, wait for every Release, add ids to
   pulsereels/schedule.json "queue", then claim done. Before creating them, tell me the ElevenLabs cost (about 650 characters
   a reel, so about 18,000 a month at 3 a day) and that the account is already short of credits (HANDOFF section 4).
   Ask me to confirm.
8. Finish: update HANDOFF.md (channels table, section 5 posting table, section 6 secrets, section 8 routines) and
   pulsereels/README.md, push to main (commit messages end with a Co-Authored-By line, no model names), and give me a
   3-line status: accounts connected, post times, queue length, next batch date.
