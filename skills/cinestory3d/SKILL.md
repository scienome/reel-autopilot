---
name: cinestory3d
description: Cinematic 3D story shorts in three.js (vertical 9:16, 30-60 s): one narrator tells a true story or a life lesson, the picture cuts every 1-1.5 s between realistic-looking 3D scenes, close-ups and cutaway views, with one short white caption at a time. Use for "make a cinematic 3D short", "realistic 3D story reel", or the owner's "3D story style" requests.
---

# CineStory 3D: cinematic story shorts

Built from the owner's three reference shorts (11 Nov 2026): a courtroom/prison true story, an animal-trap life lesson,
and a DIY how-to (matchbox pinhole camera).
Learn the grammar below; never copy another creator's characters, logo, watermark, names or exact stories.

## 1. Story shapes (pick one)
- **True story** (reference 1): an ordinary person, a small mistake, an escalating consequence, a twist, a gut-punch end.
  Hook = the outcome in one line ("A mum wanted to scare her son straight. It went horribly wrong.").
- **Life lesson / metaphor** (reference 2): a strange real trick or animal fact (how a trap works), then the same mechanism
  in a human life, then the moral in the last 2 lines, then cut back to the opening image.
- **What happens if / how it works**: the same grammar for body, science or engineering topics.
- **How to make it** (reference 3, a matchbox pinhole camera): first-person hands (the viewer's own hands in frame),
  macro close-ups on a table, one step per shot ("Slide out the tray", "Poke a tiny pinhole"), a see-inside shot of how it
  works (light through the pinhole onto the film), the result (the printed photo), then back to the first step.
Narration: 90-140 words, calm documentary voice, short sentences, present tense for action. Every claim checkable;
list sources in meta.json. No gore beyond what a family film would show.

## 2. Picture grammar (what makes the look)
- **Cut every 1-1.5 s.** One idea per shot; a 45 s short has 30-40 shots. Hard cuts on the stressed word; no wipes.
- **Shot menu**, rotate them, never the same type twice in a row:
  1. Establishing wide: high angle on the location (house and car, prison yard, desert tree).
  2. Over-the-shoulder / two-shot: one character in focus, the other soft in the foreground.
  3. Medium close-up on a face reacting (the emotional beat).
  4. Extreme close-up on hands or an object (a fist, handcuffs, a document, a salt pile).
  5. **Cutaway / cross-section**: the camera sees inside something (a tree split open showing the hand inside the hole,
     the inside of a van, an organ). This is the signature shot; use it at least twice.
  6. **Thought bubble**: a white fluffy cloud border over the scene with a second tiny scene playing inside it
     (what someone imagines or remembers).
  7. Action with motion blur and a fast camera move (a fight, a fall, a run), 0.5-1 s long.
  8. Low angle on an authority (judge, guard, doctor) or a high angle on a victim.
  9. **First-person hands**: two realistic hands enter from the bottom of the frame and do the step, macro lens,
     the work surface (wood table) close and soft, a coloured wall far behind.
- **Camera**: always moving a little: slow push-in, slow lateral drift, slight handheld wobble on drama.
  Lens: 35-50 mm feel for people (fov 30-40), shallow depth of field (background blurred).
- **Light and grade**: realistic daylight or practical lights, warm skin, soft shadows, ambient occlusion, gentle bloom on
  lights, slight vignette, filmic contrast. Night scenes: city bokeh in the background.
- **Characters**: realistic proportions (not chibi, not toy). Everyday clothes, uniforms for roles (orange jumpsuit,
  police blue, doctor white). Faces readable in close-ups: this is where the story lands.
- **Ending**: the last shot echoes the first (the same tree, the same fist), so the loop invites a rewatch.

## 3. Text
- One caption at a time, **1-3 words**, the words being spoken. White bold sans (Nunito/Poppins Black), soft dark shadow,
  centred at about 82% of the frame height. No coloured keywords, no karaoke highlight, no boxes.
- No title card. The hook is spoken over the first image, with its caption.
- Never put text over a face; move the caption up to 70% if the face is low.

## 4. Sound
- Narrator only (no character voices), a low tense music bed, real foley on actions (cuffs click, van door, punch thud,
  footsteps), a riser into the twist, silence right before the last line.

## 5. Build (three.js)
- Engine: the diorama 3D engine (`dioramareels/kit/references/`, three.js r149, `D.render3d` with focus/blur for depth of
  field). One `reel.js` per short with a `shots` list timed to the voice, rendered on GitHub like the toy/elite reels.
- Each shot = { set, camera from/to, focus, characters and poses, overlay (thought bubble), caption from the script }.
- Realistic people need ready-made rigged human models (glTF) with clothes and facial poses. Procedural people
  look like toys and break the style. See section 6.

## 6. What three.js can and can't do here
- Can: realistic lighting with an HDR environment, PBR materials, shadows, depth of field, motion blur, grading,
  cutaways and thought bubbles, fast cutting, rigged characters from glTF models, crowds by instancing.
- Can't (on the CPU render runners): film-quality skin, hair and cloth like an offline Blender/Unreal render.
  Expect "good game cinematic", not photoreal.

## 7. Checklist before pushing
- 30-40 shots, none longer than 2 s except the last; at least 2 cutaways and 1 thought bubble.
- Every caption 1-3 words and on its word; nothing covers a face.
- The first 1 s shows the most surprising image; the last shot loops to the first.
- Sources in meta.json; no real people's names unless the story is public record, no other creator's branding.
