# New CouchSarcasm formats (pilots, 29 Oct 2026)

CouchSarcasm is paused (root `config.json` "paused") while the owner picks a new format. Two pure-2D pilots, both
on the shared player (`style/`), the one voice for every channel (ElevenLabs `s3TPKV1kjDlVtZbl4Ksh`) and ElevenLabs
music + sound effects (`audio.json`):

- `reels/t001-dentist`: text-message story. The frame is her phone: lock-screen notification, the chat (bubbles pop
  in as the voice reads them, typing dots, her draft typed and deleted), an incoming call, the twist as call subtitles.
- `reels/m001-she-means`: "What she says vs what she means". Her line on a white card, the translation typed in word
  by word on a black card, a DANGER LEVEL meter; then his turn, and the meter becomes a ring.

A story here sets `window.LESSON` / `window.scoreSound` itself (no makeCouch, no 3D couple). Push a reel folder to
main and "Make couch pilots" publishes Release `couchnew-<id>`. Nothing is posted.
