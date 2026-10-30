# CouchSarcasm sitcom (couchnew/)

The CouchSarcasm channel since 30 Oct 2026: a 2D adult-cartoon sitcom with **Sam, Maya and Mum**, one ElevenLabs
voice per character, music, sound effects and a short laugh track. Approved model: `reels/e001-the-ring`.

- **How to make episodes:** [`PLAYBOOK.md`](PLAYBOOK.md) (story rules, file format, kit, checks, scheduling).
- Engine: `toon/adult.js` (characters, sets, props, poses) + `toon/sitcom.js` (the episode harness). `toon/toon.js`
  is an old draft.
- Voices: `config.json` "cast" (narrator Adam, Sam Stevie, Maya Jessica, Mum Alice) with per-character settings.
- Render: push `reels/<id>/` to main → "Make couch pilots" (`make-couchnew.yml`) → Release `couchnew-<id>`.
- Posting: `schedule.json` "queue" (root `config.json` has `"queue": "couchnew"`), posted by `tools/post.py` at 07:30,
  13:30, 21:30 IST to Instagram and the couch YouTube channel. Add `"paused": "reason"` to stop.
- `reels/t001-dentist` and `reels/m001-she-means` are rejected pilots: never queue them.
