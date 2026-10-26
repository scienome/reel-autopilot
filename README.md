# Reel autopilot

Posts 2 Violet Room reels a day to Instagram (1:00 PM and 8:00 PM IST), from a queue you approve once a week.

```
Sunday       Claude writes 14 reels  ->  pull request "Reels for the week of ..."
             GitHub Actions voices them (ElevenLabs) and renders the MP4s onto the pull request
You          watch them (out/*.mp4, out/*.jpg in the pull request), ask for changes or merge = approve
Every day    GitHub Actions posts the next reel at 1 PM and 8 PM IST, and records it in posted.json
Every Monday GitHub Actions renews the Instagram token
```

Nothing posts until you merge. If the queue runs empty, the posting run fails and GitHub emails you.

## One-time setup (about 30 minutes)

### 1. GitHub repository
1. Create a **public** repository named `reel-autopilot` and add these files (or connect GitHub to Claude and
   Claude pushes them). It has to be public because Instagram downloads each video from its GitHub link.
   Anyone with the link can see queued reels before they post.
2. Settings → Actions → General → Workflow permissions → **Read and write permissions** → Save.

### 2. Instagram API access (Instagram API with Instagram Login)
Your Instagram account must be a Professional (Creator or Business) account.
1. Go to developers.facebook.com → My Apps → **Create app**. Pick the use case for managing messaging and content on
   Instagram, and create the app.
2. In the app, open **Instagram → API setup with Instagram login**. Add your Instagram account and log in.
3. **Generate token** for the account. Copy the access token and the Instagram account ID shown next to it.
   The app can stay in development mode, because it only posts to your own account.

### 3. ElevenLabs
1. ElevenLabs → your profile → **API keys** → create a key with text-to-speech access.
2. Voices → open the voice you use (Jarnathan) → copy its **Voice ID**, and paste it into `config.json`
   (`voice.voice_id`). `voice.model_id` is `eleven_v4`, the model your first take used.
   A week of 14 reels uses roughly 7,000 characters.

### 4. Repository secrets
Settings → Secrets and variables → Actions → **New repository secret**:

| Secret | Value |
|---|---|
| `IG_ACCESS_TOKEN` | the Instagram token from step 2 |
| `IG_USER_ID` | the Instagram account ID from step 2 |
| `ELEVENLABS_API_KEY` | the key from step 3 |
| `GH_PAT` | a fine-grained GitHub token for this repository with **Secrets: Read and write** (lets the Monday job save the renewed Instagram token) |

### 5. Test
1. Actions → **Post reel** → Run workflow with "dry run" ticked. The log shows the next reel, its video link and
   caption.
2. Open the video link from the log in a browser; it should download the MP4.
3. Run it again with "dry run" unticked to post reel 0001 for real. After that it runs on schedule.

## Day to day
- **Approve a week:** open the pull request, watch the videos, merge. Comment with changes instead and Claude
  fixes them.
- **Skip a reel:** delete its `out/<id>.mp4` on main.
- **Change post times:** edit the two `cron` lines in `.github/workflows/post.yml` (UTC; IST is UTC+5:30).
- **Post one now:** Actions → Post reel → Run workflow, dry run unticked.

## Layout
`reels/<id>/` script.json (voiceover text), story.js (the animation), meta.json (title, caption, hashtags),
voice.mp3 + timing.json (made by the workflow) · `out/` rendered videos · `style/` the Violet Room renderer and
reel kit · `tools/` voice.py, build.py, check.py, produce.py, render_reel.py, post.py · `WEEKLY.md` how the weekly
batch is written.
