---
name: lokvarastyle
description: Make a vertical 9:16 Hindi mythology reel in the Lokvara folk-art style (Pattachitra border, paper texture, kajal fish-eyes, Madhubani trees, big Hindi hook card, numbered series with an "अगले भाग में" teaser), timed to a voiceover, as an MP4. Use this whenever the user types /lokvarastyle, mentions Lokvara, or asks for a Hindi mythology, Ramayan, Mahabharat, Shiv, Hanuman or Puran reel, a lesser-known Hindu story, or a devotional short in this folk-art look, even if they only give a topic.
---

# Lokvara reel (/lokvarastyle)

Turn a lesser-known Hindu story into a 720x1280 Hindi reel of 40-55 seconds. The style is already built, so write on the kit rather than redrawing it. That keeps every reel looking like one channel.

## What's in this skill

| Path | What it is | When to read it |
|---|---|---|
| `engine/mythreels/PLAYBOOK.md` | Full rules: stories, files per episode, checks, what has worked | Read first, every time |
| `engine/mythreels/reels/002-ravan-shani/` | The channel's best reel so far (about 20,000 views in 15 hours) | Copy its shape |
| `engine/mythreels/kit/myth.js`, `katha.js` | Characters, props, sets, and the `KATHA` story engine | Read the headers before writing a story |
| `engine/mythreels/tools/` | `check.py` (frames), `produce.py` (voice, music, render) | To check and render |
| `engine/style/`, `engine/fonts/` | Shared player, sound kit and fonts | Used by the tools, leave unchanged |

Run the tools from `engine/mythreels/`. Copy the whole `engine` folder somewhere writable first, if this folder is read-only.

## Workflow

1. **Pick a story people haven't heard.** Check it with web search and list `sources`. Say "कहते हैं" for folk versions. Never state as fact what a source doesn't support.
2. **Write the folder** `reels/NNN-slug/`: `script.json`, `story.js`, `meta.json`, `audio.json` (formats in PLAYBOOK §3).
3. **Check frames, no credits needed:** `python3 tools/check.py reels/<id> sheet.png`. Look at every shot. Fix page errors, cut-off faces and cards over faces.
4. **Render:** `python3 tools/produce.py reels/<id> --workers 4`. Needs `ELEVENLABS_API_KEY`, playwright with chromium, and ffmpeg. Install the fonts from `engine/fonts` first. Without a key, give the user the script and the checked frames, and say the video wasn't voiced.
5. **Check the MP4:** under 60 s, a few frames, sensible audio levels. Then send it.

## The rules that matter most

- **Lesser-known stories only.** No "everyone knows" stories.
- **Always a numbered series,** with a hook card from frame 0 (8 words or fewer, a shocking claim or question) and an "अगले भाग में..." teaser.
- **Link the story to something people do today** where it's true, like why Hanuman ji is worshipped on Saturday. That was probably why the best reel spread, though it's one reel, so a clue and not proof.
- **Gods stay dignified.** No jokes about them, nothing that insults a tradition.
- **Don't change the voice without asking.** It's named in `config.json`, and it only works on an ElevenLabs account that has that voice.

Don't paste API keys into chat, and don't post anything without the user's say-so.
