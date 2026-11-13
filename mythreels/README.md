# Hindi mythology channel (working name: Katha)

Respectful Hindi story-time reels from the Ramayana, Mahabharata and Puranas, in a 2D storybook style.
- Kit: `kit/myth.js` (gods, heroes, sets, divine FX) + `kit/katha.js` (the episode harness, Hindi subtitles).
- Episodes: `reels/NNN-slug/` (script.json in Hindi, story.js, meta.json, audio.json). Pushing one renders it
  ("Make myth reels" workflow → Release `mythreel-<id>`). Nothing is posted until the accounts exist.
- Voice: `config.json`: **Anuj** (Cartesia `7e8cb11d-37af-476b-ab8f-25da99b18644`, Engaging Narrator; owner's pick 13 Nov 2026, was Sudhir on ElevenLabs). Karna's own lines keep the owner's voice. Every line uses it unless a cast entry is added; ask the owner before adding or changing voices.
- Fonts: `fonts/NotoSansDevanagari.ttf` (subtitles) and `fonts/YatraOne.ttf` (titles), both OFL.

Rules: gods are always dignified (no jokes about them, no comic faces); stories follow the scriptures; add `sources`
in meta.json.
