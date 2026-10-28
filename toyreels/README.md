# Toy reels (Brick Toy style, Steve's voice)

Vertical 9:16 explainer reels in the Brick Toy style, voiced by ElevenLabs (Steve, `IvUJKFyjVb5hItY9dJAT`) and rendered on GitHub.

## How it works
1. Each reel is a folder in `reels/` with `script.json` (the words, by beat), `story.js` (the animation) and `meta.json` (title, caption, hashtags, cover time).
2. Pushing a change to `toyreels/reels/**` on `main` runs **Make toy reels** (`.github/workflows/make-toyreels.yml`).
3. GitHub voices the script, times every word from the voice, renders the MP4 and publishes it under **Releases** as `toyreel-<id>` with `cover.jpg` and `caption.txt`.
4. The voice is committed back to the repo, so a re-render never pays ElevenLabs twice.

To remake one reel by hand: Actions → Make toy reels → Run workflow → type the folder name.

## Fully automatic
```
Every 3 days     Claude writes 21 new toy reels (3rd, 6th, 9th... of the month) (toyreels/PLAYBOOK.md) and pushes them to main
                 GitHub voices them with Steve and renders them into toyreel-<id> Releases
Every day        "Post toy reels" posts the next reel to Instagram AND YouTube at the same moment,
                 at 06:00, 12:30 and 20:30 IST (30 min before the US and India peaks), in folder order, and records it in toyreels/posted.json
Every Monday     the Instagram token is renewed
```
GitHub starts scheduled runs up to ~2 hours late, so each slot has runs 4, 3 and 2 hours early; the first to start does the work. It uploads the YouTube Short scheduled for the slot (YouTube makes it public
at that minute), uploads the Instagram Reel so it is processed, then publishes it on the same minute. If one platform
fails (for example, YouTube's daily quota runs out), the next run finishes that reel on the missing platform first.
Nothing posts until all five secrets below exist, so the two accounts stay in step.

### One-time setup: connect the new accounts
**Instagram (new toy reels account)**
1. Make the account Professional (Creator or Business).
2. developers.facebook.com → your app (the same one is fine) → Instagram → **API setup with Instagram login** → add
   the new account → **Generate token**. Copy the token and the account ID.

**YouTube (new toy reels channel)**
1. console.cloud.google.com → **new project** (it gets its own upload quota of about 6 Shorts a day) → enable
   **YouTube Data API v3**.
2. OAuth consent screen → External → add the scope `youtube.upload` → **Publish app** (In production; "Testing"
   tokens die after 7 days).
3. Credentials → OAuth client ID → **Web application**, with the redirect URI `https://developers.google.com/oauthplayground`.
4. developers.google.com/oauthplayground → gear icon → "Use your own OAuth credentials" → paste the client ID and secret
   → scope `https://www.googleapis.com/auth/youtube.upload` → Authorize, **signing in with the Google account that owns
   the toy reels channel** (pick that channel if asked) → "Exchange authorization code for tokens" → copy the refresh token.

**Secrets** (repo Settings → Secrets and variables → Actions → New repository secret):

| Secret | Value |
|---|---|
| `IG_TOY_ACCESS_TOKEN` | the Instagram token |
| `IG_TOY_USER_ID` | the Instagram account ID |
| `YT_TOY_CLIENT_ID` | the OAuth client ID |
| `YT_TOY_CLIENT_SECRET` | the OAuth client secret |
| `YT_TOY_REFRESH_TOKEN` | the refresh token |

`GH_PAT` (already there) lets the Monday job save the renewed Instagram token.

**Test:** Actions → **Post toy reels (Instagram + YouTube)** → Run workflow with "dry run" ticked. The log shows the
next reel, its slot, the Instagram username and "YouTube sign-in OK". After that it posts on schedule.

### Day to day
- **Post one now:** run the workflow with dry run unticked and "post now" ticked (or type a reel id).
- **Skip a reel:** add `"<id>": {"skipped": true, "instagram": {}, "youtube": {}}` to `toyreels/posted.json`.
- **Change times:** edit `toyreels/posting.json` and the cron lines in `.github/workflows/post-toyreels.yml`
  (runs 4, 3 and 2 hours before each slot, in UTC; IST is UTC+5:30).

## The first 10
| # | Reel | Series |
|---|---|---|
| 01 | The Mona Lisa heist (1911) | Greatest Heists 1/4 |
| 02 | D.B. Cooper (1971) | Greatest Heists 2/4 |
| 03 | The Antwerp diamond heist (2003) | Greatest Heists 3/4 |
| 04 | The Gardner Museum heist (1990) | Greatest Heists 4/4 |
| 05 | How long can you go without sleep? | Your Weird Body |
| 06 | Does cracking your knuckles cause arthritis? | Your Weird Body |
| 07 | Why do you get goosebumps? | Your Weird Body |
| 08 | What happens to your body in space? | Your Weird Body |
| 09 | What happens in your body in one second? | Your Weird Body |
| 10 | The man who hiccupped for 68 years | Your Weird Body |

## Local tools
- `python tools/check.py reels/<id> --times 3 10` – draws key frames to `out/<id>_check/`.
- `python tools/produce.py reels/<id> --no-voice` – silent render on estimated timing.
