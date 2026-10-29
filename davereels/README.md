# Dave reels (Instagram-only, 9:16)

Instagram-only Reels for Gears & Glitches (@gearsandglitches), starring **Dave**, a low-poly crash-test dummy
(yellow/black target dots, orange hard hat). Each Reel teaches one real mechanism behind a famous bad decision; Dave
helps, the machine gets him, and every Reel ends on an "R.I.P. Dave #N" card. Dark, shocking, funny, educational.

Rules: correct facts; jokes land on bad decisions, physics, egos and Dave, never on real victims; living people appear
only through what they really said or did and are never shown hurt; no Nazi symbols (a plain grey tank is fine);
slapstick deaths only, no blood or gore.

## How it works
Same engine as `mechreels/` (copied here, so changes to one never re-render the other).
1. Each reel is a folder in `reels/` with:
   - `script.json` – the voiceover, by beat: `[{ "id": "hook", "text": "..." }, ...]`, word for word from the approved script.
   - `story.js` – the animation, built on `style/mech_base.js` and `props/dave.js`. Every visual event hangs on a word
     time `V(beatId, 'WORD')`. Do not end the file with a closing brace (the build adds it).
   - `meta.json` – title, caption (dark one-liner, one learn line, a comment question; no YouTube link), 6-9 hashtags
     including `#gearsandglitches`, `cover_t`, sources, and `libs` (always `davereels/props/dave.js`).
2. Pushing to `davereels/**` on `main` runs **Make Dave reels** (`.github/workflows/make-davereels.yml`). It makes the
   reels whose folders changed (all of them if `config.json` or `style/` changed).
3. GitHub voices the script with ElevenLabs (word timestamps), re-times the animation, renders the MP4 and publishes a
   Release `davereel-<id>` with the MP4, `cover.jpg`, `caption.txt` and `<id>_player.html`.
4. The voice (`voice.mp3`, `timing.json`, `voice_raw.json`) is committed back, so a re-render never pays twice.

To remake one reel by hand: Actions → Make Dave reels → Run workflow → type the folder name.

## Dave (`props/dave.js`)
`dave(S, pos, { yaw, pose, t, death, u, blink })` draws him with the mech_base low-poly materials and lighting.
- Poses: `stand`, `sit`, `drive`, `point`, `thumbs`, `salute`, `walk`, `wave`.
- Deaths (u = 0..1): `squash` (flat as a pancake), `launch` (spinning flight), `puff` (blows up like a balloon), `blown`
  (blown away like a leaf).
- `davePile(S, pos, t)`: the end state, a smoking heap with blinking eyes.
- `ripCard(ctx, W, H, n, u, t)`: the "R.I.P. Dave #N" end card.

## Voice
`config.json` → `voice.voice_id` = `s3TPKV1kjDlVtZbl4Ksh` from reel 44 on (29 Oct 2026; reels 01-43 keep their saved takes in `c6SfcYrb2t09NHXiT80T`, the deadpan voice from the owner's ElevenLabs My Voices), model
`eleven_v4`. Needs the `ELEVENLABS_API_KEY` repository secret.

## Local tools
- `python tools/check.py reels/<id>` – key frames to `out/<id>_check/sheet.png` (estimated timing until a voice exists).
- `python tools/produce.py reels/<id> --no-voice` – silent render on estimated timing.

## Instagram
`.github/workflows/post-instagram-mech.yml` (with `tools/ig_mech_post.py`) posts these reels at 08:30, 12:30 and 20:30
IST from `schedule.json`, using the MP4 from each `davereel-<id>` Release; a slot whose Release does not exist yet is
skipped. Posted reels are recorded in `/ig_posted.json`. To post one by hand: Actions → Post Gears & Glitches reels to
Instagram → Run workflow, type the id in "short", first with "dry run" ticked, then unticked.

## YouTube Shorts
(Retired 28 Oct: `tools/ig_mech_post.py` now posts each Dave reel to YouTube at the same minute as Instagram.) `tools/yt_dave_publish.py` used to upload the same rendered Reels to the
Gears & Glitches YouTube channel as Shorts, scheduled for the same slots as Instagram, earliest slot first. If YouTube's daily upload quota runs out, the
run stops cleanly and the next run (every 2 hours) carries on. Uploads are recorded in
`davereels/youtube_posted.json`.

## Automatic new Reels
A scheduled Claude session runs every 3 days and keeps at least 7 days of Reels scheduled ahead, following
[`PLAYBOOK.md`](PLAYBOOK.md). Edit the playbook to change the rules, topics or tone for future runs.

## Reels
| # | Reel | Slot (IST) |
|---|---|---|
| 01 | The plane that lost a wall at 16,000 feet | Wed 28 Oct 08:30 |
| 02 | Hitler's 188-tonne tank | posted early by hand |
| 03 | The Cybertruck's "unbreakable" window | Wed 28 Oct 20:30 |
| 04 | Bill Gates' live blue screen | Thu 29 Oct 08:30 |
| 05 | The Demon Core's screwdriver | Thu 29 Oct 12:30 |
| 06 | Apollo 10's floating turd | Thu 29 Oct 20:30 |
| 07 | Steve Jobs: "just avoid holding it that way" | Fri 30 Oct 08:30 |
| 08 | The bomb they made smaller to be safe | Fri 30 Oct 12:30 |
| 09 | The exploding whale | Fri 30 Oct 20:30 |
| 10 | The tailor who jumped off the Eiffel Tower | Sat 31 Oct 08:30 |
| 11 | Zuckerberg's billion-dollar legs | Sat 31 Oct 12:30 |
| 12 | Trump vs. the electric catapult | Sat 31 Oct 20:30 |
| 13 | What space does to your body | Sun 1 Nov 08:30 |
| 14 | The skyscraper that melts cars | Sun 1 Nov 12:30 |
| 15 | The man who poisoned the planet twice | Sun 1 Nov 20:30 |
| 16 | Lake Peigneur | Mon 2 Nov 08:30 |
| 17 | Rapid unscheduled disassembly | Mon 2 Nov 12:30 |
| 18 | The Boston molasses flood | Mon 2 Nov 20:30 |
| 19 | NASA's $125 million units mix-up | Tue 3 Nov 08:30 |
| 20 | North Korea's hotel of doom | Wed 28 Oct 12:30 (moved by the owner) |
| 21 | Galloping Gertie | Tue 3 Nov 20:30 |
| 22 | The warship that sank in 1,300 metres | Thu 29 Oct 08:30 |
| 23 | Australia fined NASA for littering | Thu 29 Oct 12:30 |
| 24 | The manhole cover that left Earth | Thu 29 Oct 20:30 |
| 25 | The biggest bell that never rang | Fri 30 Oct 08:30 |
| 26 | NASA's upside-down parachute switch | Fri 30 Oct 12:30 |
| 27 | The Great Panjandrum | Fri 30 Oct 20:30 |
| 28 | The electric car of the future (1985) | Sat 31 Oct 08:30 |
| 29 | The most expensive hyphen in history | Sat 31 Oct 12:30 |
| 30 | The bat bomb that bombed its own base | Sat 31 Oct 20:30 |
| 31 | Why Pisa's tower leans (and bends) | Sun 1 Nov 08:30 |
| 32 | $440 million in 45 minutes | Sun 1 Nov 12:30 |
| 33 | The jet that shot itself down | Sun 1 Nov 20:30 |
| 34 | The bomb steered by pigeons | Mon 2 Nov 08:30 |
| 35 | The rocket killed by one number | Mon 2 Nov 12:30 |
| 36 | The atomic bomb dropped on a garden | Mon 2 Nov 20:30 |
| 37 | The Tsar Tank: a 9-metre tricycle | Tue 3 Nov 08:30 |
| 38 | Hubble's $1.5 billion blurry mirror | Tue 3 Nov 12:30 |
| 39 | The bus that jumped Tower Bridge | Tue 3 Nov 20:30 |
| 40 | The Spruce Goose flew once | Wed 4 Nov 08:30 |
| 41 | Britain's aircraft carrier made of ice | Wed 4 Nov 12:30 |
| 42 | The destroyer that torpedoed the President | Wed 4 Nov 20:30 |
| 43 | What if you grew 1 inch every day? (special, posted by hand on 29 Oct) | Thu 29 Oct (extra post) |
| 44 | The Gimli Glider: fuel in pounds, not kilograms (test of the new voice + ElevenLabs music and sound effects; not scheduled) | not scheduled |

## ElevenLabs music and sound effects

A reel can add `audio.json` next to `script.json`: background music (Eleven Music, instrumental, as long as the voice plus a tail) and sound effects (Sound Effects API) pinned to spoken words. `tools/eleven_audio.py` makes each piece once and keeps it in `reels/<id>/eleven/`; `render_video.py` ducks the music under the voice and lays the effects just below it, on top of the built-in synth sounds. Format: see the docstring of `tools/eleven_audio.py`. A failed music or effect call is a warning; the reel still renders.

Changing the voice in `config.json` only affects new or rewritten scripts: saved takes are kept (set `REVOICE=1` to re-voice old reels on purpose).
