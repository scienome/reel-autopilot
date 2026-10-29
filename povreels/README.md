# POV reels: "YOU are the only one"

The new Gears & Glitches series (29 Oct 2026), replacing the Dave reels (paused in `davereels/schedule.json`).
Second-person stories: the viewer is the hero ("You're the only person on Earth who can hear what dogs think").
Every episode: an impossible premise in the first second, funny escalation (18+ edge allowed), one moment that
actually lands emotionally, a twist, and "Part 2?". The camera is YOU: nobody plays the hero on screen; the other
characters look into the lens and their thoughts pop up as clouds.

- Engine: the shared soft-3D Violet Room kit in the repo's `style/` (read-only from here) with makeCouch, the couple
  hidden (`he` / `she` = `{ hide: true }`) and POV cameras. `reels/001-dog-thoughts/story.js` has the expressive `dog()`
  and the `thought()` cloud.
- Voice: `config.json` (ElevenLabs `s3TPKV1kjDlVtZbl4Ksh`). Music and sound effects: `reels/<id>/audio.json`
  (see `tools/eleven_audio.py`), cached in `reels/<id>/eleven/`.
- Render: push a reel folder to main, and the "Make POV reels" workflow publishes Release `povreel-<id>`. Nothing is
  posted automatically yet.
- Check locally: `python3 tools/check.py reels/<id> sheet.png` (estimated timing, no voice needed).
