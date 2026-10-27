# ToyBox video factory (YouTube, in the reel-autopilot repo)

Makes 4-5 minute, 16:9, 1080p YouTube explainers in the Brick Toy style (plastic brick figures, voxel planets,
toy dioramas, popping captions, red number tags), voiced with ElevenLabs.

```
Claude writes a video  ->  videos/<id>/ (script.json, story.js, meta.json)  ->  push to main
GitHub Actions         ->  ElevenLabs voice (chapter by chapter, word-timed) -> 1080p render -> thumbnail
You                    ->  Releases page: download the MP4 + thumbnail, paste youtube.txt into YouTube Studio
```

## One-time setup
1. Everything lives in the `youtube/` folder; the workflow is `.github/workflows/make-video.yml`.
2. Uses the repo's existing `ELEVENLABS_API_KEY` secret.
3. The voice is set in `config.json` (Jarnathan, `eleven_v4`). Change `voice_id` to use another voice.

## Making a video
- **New video:** Claude adds `videos/<number>-<slug>/` and pushes. The **Make video** workflow starts by itself.
- **Re-make one:** Actions → Make video → Run workflow → type the folder name (e.g. `001-moon-disappeared`).
  The voice is reused if the script didn't change, so a re-render costs no ElevenLabs credits.
- **Result:** Releases → the video's release has `<id>.mp4`, `thumbnail.jpg` and `youtube.txt`
  (title, description with chapter timestamps, sources and tags).
- A 4.5-minute video takes about 20-30 minutes on GitHub and uses roughly 3,500 ElevenLabs characters.

## Files
- `videos/<id>/script.json`: the narration, as chapters → beats → phrases (numbers spelled out for the voice)
- `videos/<id>/story.js`: the animation, one shot per beat, all times taken from the spoken words
- `videos/<id>/meta.json`: YouTube title, description, tags and sources
- `style/`: the Brick Toy renderer (16:9), the kit (timing, voxel planets, space/beach/night/reef sets), sounds, player
- `tools/check.py`: key-frame contact sheets (no voice needed) · `tools/voice.py`: ElevenLabs voice + word timing ·
  `tools/render_video.py`: streaming 1080p renderer · `tools/produce.py`: all of it in one go
