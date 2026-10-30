# POV reels: "YOU are the only one" (povreels/)

The Gears & Glitches series since 29 Oct 2026 (Dave is paused). Second-person stories: the viewer is the hero
("You're the only person on Earth who can hear what dogs think"); the camera is YOU, characters look into the lens and
their thoughts pop up as clouds, each in their own voice.

- **How to make episodes:** [`PLAYBOOK.md`](PLAYBOOK.md) (story rules, file format, kit, checks, scheduling).
- Engine: the shared soft-3D kit in the repo's `style/` (makeCouch with the couple hidden) + `lib/pov.js` (dog, cat,
  thought clouds, cards, badges). Never edit `style/` from here: it re-renders other series.
- Voices: `config.json` "cast" (narrator Adam, cute pets/babies, naughty characters, people) + `cast_fallback`.
- Render: push `reels/<id>/` → "Make POV reels" (`make-povreels.yml`) → Release `povreel-<id>`.
- Posting: `schedule.json` "queue", posted by `tools/ig_mech_post.py` at 07:30, 12:30, 20:30 IST to Instagram
  @gearsandglitches and the Gears YouTube channel. Add `"paused": "reason"` to stop.
