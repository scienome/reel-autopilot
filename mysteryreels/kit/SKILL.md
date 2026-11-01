---
name: noirstyle
description: Make a vertical 9:16 noir comic reel, as an MP4 timed to a voiceover. Black ink and cream paper with one red accent, woodcut hatching, rain, silhouettes, hand-lettered thought bubbles, huge rough numbers, marker captions and camera slides across comic panels. Use for /noirstyle, for any noir, black-and-white comic, Sin City-style or graphic-novel reel, and for the mystery, secrets and conspiracy-history channel, even if the user only gives a topic such as Illuminati, lizard people or unsolved mysteries.
---

# Noir comic reel

Turn a topic or script into a 720x1280 reel using the engine in this skill. The look comes from the engine, so don't redraw it from scratch.

| File | What it is |
| --- | --- |
| `references/noir.js` | The engine: backgrounds, silhouettes, bubbles, captions, big numbers, stamps, transitions and finish. Read it before writing a reel. |
| `references/example-illuminati.js` | A complete factual reel. Copy its structure. |
| `references/example-bahu-ep1.js` | An older drama reel with fixed times, showing saree silhouettes and props. |
| `references/sound.js` | The sound effects kit. Skim its sound names when scoring. |
| `scripts/voice.py` | Makes the voiceover and the timing the reel follows. |
| `scripts/render.py` | Draws contact sheets and renders the MP4. |

On Windows, run scripts with `python`, because `python3` may not work.

## Workflow

1. **Research.** For anything presented as fact, check it against good sources first, and keep the source list.
2. **Script.** Write 30 to 45 seconds as `script.json`, in the format below. The mystery channel is in English. Otherwise use the language the user asks for. `cap` is the on-screen caption, and `say` is the words as spoken, with numbers spelled out.
   ```json
   { "lines": [ { "shot": "hook", "cap": "THE ILLUMINATI *WERE REAL.", "say": "The Illuminati were real." } ] }
   ```
3. **Get the voice and timing.** Use `scripts/voice.py`, which writes `timing.js`. Every time in the reel comes from that file, so a new take re-times the whole reel. Options, best first:
   - **ElevenLabs take with timings:** `--alignment alignment.json`, with `voice.mp3` from the same take and all the `say` lines joined by spaces.
   - **ElevenLabs, line by line:** `--engine elevenlabs --voice-id ID`, with the user's key in `ELEVENLABS_API_KEY` or `--env-file`.
   - **Preview only:** `--engine windows` or `--engine estimate`. Say clearly that it's temporary.

   Never look for leaked keys or cracked versions of paid tools. If the user's key is in a GitHub secret it can't be read back, only used inside their own Actions. Their repo may also auto-post to live accounts, so get a clear go-ahead before pushing anything there, and never let it reach a posting job.
4. **Plan the shots and write the story file.** Use 7 to 10 shots. It sets `window.REEL = { DURATION, draw(ctx, t), score(k) }`, takes all times from `window.TIMING`, and is saved in the user's project. `example-illuminati.js` shows the pattern.
5. **Check frames, and fix what you see.**
   ```bash
   python -I scripts/render.py sheet reel.js sheet.png --timing timing.js 2.8 7.2 11.6
   ```
   Look for captions clipped or covering the key image, unreadable numbers, bubbles over faces or titles, and a mid-transition frame that works.
6. **Render.**
   ```bash
   python -I scripts/render.py video reel.js out.mp4 --timing timing.js --voice voice.mp3
   ```
   Then check a few frames from the finished MP4. Leave out `--voice` for a version with effects only, and say it has no narration.

Rendering needs Python playwright, ffmpeg, Edge or Chromium, and internet for the Google Fonts on first load.

## The style

**Colour.** Only ink, paper and one red. Red marks the single thing the viewer should follow in that shot: a pallu, an umbrella, a number, a stamp. If everything is red, nothing is.

**Light.** Hard shapes of light against black: a cone from a street lamp (`beam`), a tunnel (`corridor`), blind stripes (`stripes`), bright windows (`windowPane`). Figures are pure black against the light. Use `rim: true` on dark backgrounds. Faces stay hidden, and that is the point: nobody has to look real.

**Texture.** Woodcut streaks, hatch lines on the ground (`floor`), rain (`rain`) on most outdoor shots, and always `finish` to add the print grain.

**Type.** Each job has one face:
- Marker caps for captions, with one red keyword (`caption`). Mark the keyword as `*WORD`, and use `|` for a second line. Keep chunks to two short lines.
- Rough condensed numbers for big facts (`stat`).
- Handwriting for thoughts (`bubble`). Thoughts are the voices in the crowd: doubt, gossip, fear. Pop them in one by one.
- Typewriter for dates, places and sources (`note`), and small boxes for time and place (`tag`).
- Red rubber stamps for verdicts (`stamp`).

**Motion.** Use `N.sequence`: each new shot slides in across a black gutter, like moving along a comic page. Inside a shot, keep movement small: slow drift, walking, rain, bubbles popping. Near the end use `N.pageOut`, which pulls back to show the whole page of panels, then lands the final question over it.

**Layout on a phone.** Captions sit at `y` about 985. Keep key images between `y` 100 and 930, and keep the bottom 20% clear of anything important, as reel apps cover it. Big numbers should be at least 90px, bubble text at least 30px.

**Sound.** A soft rain and low drone under everything, a `click` on each caption, a `whoosh` on each slide, `thud` or `impact` on big reveals, and `pop` on bubbles. Keep it serious. Effects duck automatically under a voiceover.

## Where this style came from

It was studied from a reference reel. Take only the visual language. Don't reuse that reel's script, drawings or layouts, or the avatars and "Recreate template" button, which belong to the site it was recorded from.

## Mystery and conspiracy channel rules

The hook is "nobody believes this". The trust comes from showing what's real, what's claimed and what's unknown. Viewers feel smarter, and the account stays safer.

**Every reel answers three questions:** What do people say? What is actually known? What is still unknown? Write claims as claims ("log kehte hain", "theory yeh hai"), and only state something as fact when sources back it. Put the strongest true detail first. Reality is often stranger than the rumour.

**Best topics, in order:**
1. Conspiracies that turned out to be true, with documents to prove it.
2. Real mysteries that are still unsolved.
3. Famous theories told as stories: where they came from, who spread them, and why people believe them.

**Stay away from these, even if they would get views:**
- Hate dressed up as a secret. Many "secret rulers" theories, including Illuminati and lizard-people stories, have been used to target Jewish people. Tell the history of a theory if useful, but never repeat those claims as true, and never point at a religion, caste, community or ethnic group as the hidden enemy.
- Named living people or real companies accused of crimes or of being secretly evil or non-human, which risks harm and defamation. If a real person spread a theory, state only what's documented about that.
- Medical, vaccine, election or disaster claims that could change what someone does or harm them.
- Religious and communal flashpoints in India, or anything that could stir up anger against a group.
- Calls to act against anyone, or invented evidence, documents or quotes.

If asked for one of these, say why it's risky and offer the safer angle on the same topic.
