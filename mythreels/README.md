# Hindi mythology channel (working name: Katha)

Respectful Hindi story-time reels from the Ramayana, Mahabharata and Puranas, in a 2D storybook style.
- Kit: `kit/myth.js` (gods, heroes, sets, divine FX) + `kit/katha.js` (the episode harness, Hindi subtitles).
- Episodes: `reels/NNN-slug/` (script.json in Hindi, story.js, meta.json, audio.json). Pushing one renders it
  ("Make myth reels" workflow → Release `mythreel-<id>`). Nothing is posted until the accounts exist.
- Voice: `config.json` (Hindi narrator, chosen by the owner from the Hindi voice audition).
- Fonts: `fonts/NotoSansDevanagari.ttf` (subtitles) and `fonts/YatraOne.ttf` (titles), both OFL.

Rules: gods are always dignified (no jokes about them, no comic faces); stories follow the scriptures; add `sources`
in meta.json.
