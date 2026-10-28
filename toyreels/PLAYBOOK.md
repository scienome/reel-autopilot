# Toy reels: the scheduled-run playbook

A scheduled Claude session runs this **every 3 days** (the 3rd, 6th, 9th... of each month; the other days belong to
the Dave and CouchSarcasm batches). Each run writes **21 new toy reels** (a week at 3 a day; posting uses 9 every 3 days, so the queue grows, as intended), pushes
them to `main`, and GitHub voices them with the ElevenLabs voice set in `toyreels/config.json`
(`V33LkP9pVLdcjeB2y5Na`, a deep deadpan narrator; never change it) and renders them into `toyreel-<id>` Releases. The posting workflow
(`.github/workflows/post-toyreels.yml`) then posts them in folder order, 3 a day (06:00, 12:30, 20:30 IST), to
Instagram and YouTube at the same moment. Nothing else needs doing by hand.

## 0. Setup (fresh cloud session)
- Repo: `scienome/reel-autopilot`, push straight to `main` (the owner wants that). Clone it if it is not there.
- Local check tool: `pip install playwright==1.48.0 pillow numpy`, then point it at the pre-installed Chromium:
  `mkdir -p $SP/pwb/chromium-1140 && ln -s /opt/pw-browsers/chromium-*/chrome-linux64 $SP/pwb/chromium-1140/chrome-linux && touch $SP/pwb/chromium-1140/INSTALLATION_COMPLETE`
  (`$SP` = your scratchpad) and run checks as `PLAYWRIGHT_BROWSERS_PATH=$SP/pwb python3 tools/check.py reels/<id>`
  from `toyreels/`. Copy `toyreels/fonts/*.ttf` into `~/.local/share/fonts` and run `fc-cache -f` first.
- If the `/toystyle` skill is available, load it for the Brick Toy visual style and animation patterns. Its
  content advice (educational explainers) does NOT apply: the content rules are in section 2 below.

## 0b. Resume an unfinished batch first (usage limits)
A backup run fires 6 hours after each main run. Every run starts by reading `toyreels/batch_log.json`:
`[{ "batch": "2026-10-29", "ids": ["11-...", ...], "status": "in_progress" | "done", "updated": "<UTC time>" }]`.
- Keep `"updated"` current on every push. If the newest entry is `in_progress` and `"updated"` is less than 90 minutes
  old (or a "Make toy reels" run is queued or in progress), another run is still working: stop with a one-line report.
- If the newest entry is `in_progress`: do NOT start a new batch. Finish it: write the reels in `ids` that are missing,
  push them, wait for the renders, then set `"status": "done"`.
- If the newest entry is `done` and its `batch` date is today or yesterday (IST): nothing to do; stop with a one-line report.
- Otherwise start a new batch: before writing any reel, append an entry with the planned ids and
  `"status": "in_progress"`, commit and push it with `[skip ci]`. Set `"done"` at the end.

## 1. Plan the week
- Read every `toyreels/reels/*/meta.json` and `script.json`, `toyreels/README.md` (the reel list) and
  `toyreels/posted.json`. Never repeat a premise, twist or punchline.
- The 10 original reels (01-10, the educational heists and body facts) stay exactly as they are. Do not edit or
  re-render them. Everything new follows the style below.
- Next number = highest folder number + 1. Folder ids: `NN-short-slug` (e.g. `11-kim-missile-boomerang`).
- Posting order is folder order, so number the reels in the order they should post. Mix the formats across the
  week (see section 2). Posting cycles 06:00 (US prime time), 12:30, 20:30 IST in folder order: put the strongest reels at positions 1, 3, 4, 6... (the 06:00 and 20:30 slots).

## 2. What the reels are now: dark-comedy brick stories that people cannot scroll past
The owner wants **funny, hilarious, dark-humoured, shocking** reels that make people react, tag friends and write
crazy comments. Knowledge is optional; **shock and laughs are the goal**. Aim for "best reels on the internet" level.

**Every reel is a story:** hook (0-2 s), setup, escalation (it keeps getting worse and more absurd), a twist nobody
sees coming, and a punchline. End on a line that begs for comments ("Who's next? Comment a name.", "Be honest:
would you have pressed it?").

**The hook must be impossible to skip.** The first line and the first frame carry the reel. Open in the middle of
chaos, with a shocking claim or a forbidden question. For example: "Kim pressed the button. The missile came back.",
"Batman's been broke since 2019. Here's why.", "The Illuminati just fired their worst employee.", "Never rob a bank
on a Tuesday." Something big happens on screen in the first second: an explosion, a fall, a reveal, a scream.

**Formats to rotate** (badge text in caps, one colour per format):
- **WORLD LEADERS IN BRICKS:** Trump, Putin, Kim Jong Un, and any other famous leader or billionaire, as caricatures,
  in absurd made-up situations (a summit that turns into a cooking show, a missile that boomerangs, a group chat leak).
- **SUPERHERO PROBLEMS:** parody lookalikes of Marvel and DC heroes with their real-life problems (Bat-Guy's
  electricity bill, Iron Dude's suit stuck in airport security, Super-Dude getting a parking ticket).
- **HISTORY'S DUMBEST VILLAINS:** Hitler and other dictators as clueless, pathetic losers whose plans fail stupidly.
- **THE ILLUMINATI FILES:** secret societies, the all-seeing pyramid, lizard bosses, aliens and "higher powers"
  running the world badly: office drama in the secret lair, the moon-landing film crew, the pyramid HR department.
- **HEISTS GONE WRONG:** robbers in balaclavas and prisoners in stripes; plans that go spectacularly wrong.
- **WHAT IF...?:** "What if a nuke button was in a kids' toy shop?", "What if gravity switched off for 5 seconds?"
- Invent new formats when you have a better idea, and keep the ones that work.

**Tone: as dark as the hard limits below allow.** Savage, absurd, fast, with a cruel twist. Pitch-black irony:
the villain wins, the hero dies stupidly, the plan works perfectly and that is the problem, Death is overworked,
the devil is out-evilled by a politician, heaven's waiting room has a 3,000-year queue, the dictator's bunker has
terrible Wi-Fi, the robbers rob the wrong bank (the Illuminati's). Fictional and historical characters can die,
explode and go to hell in slapstick ways (they come back as bricks). Deadpan narration works best: understate
the chaos. Slapstick and cartoon violence are fine: toy guns and blasters, missiles, explosions that blow figures
into bricks, x-eyes, soot faces, people launched into the sky. **Every scene must make people go "NO WAY" or laugh
out loud. If a line is merely nice, cut it.**

**Dark premises that work** (make your own, never reuse one): Death gets fired and replaced by an AI; Hitler is
stuck in hell's customer-service queue behind Stalin; Kim's missile test lands in Putin's pool; Bat-Guy's parents'
murder turns out to be the Illuminati's paperwork error; the devil sues a billionaire for stealing his business
model; a zombie apocalypse fails because nobody leaves the house anyway; the last man on Earth gets a spam call;
the Mona Lisa's smile is because she knows where the bodies are buried.

**Hard limits.** These keep the accounts alive. Instagram and YouTube delete reels and close channels for these, and
YouTube is strictest with toy-style animation:
- **No sexual content, nudity or sexual jokes.** "Adult" here means dark, crime, bad decisions and death jokes, with
  swears bleeped. Never sexual.
- **Real people** (Trump, Putin, Kim and anyone else living) are made fun of: humiliated, out-smarted, covered in soot,
  stuck, embarrassed. They are **never shot, killed, tortured or shown being seriously hurt**. The story must be
  obviously absurd fiction, and the caption starts with "Parody." Never put fake quotes into their mouths that
  could pass as real news.
- **Hitler and other dead dictators** are only ever the pathetic butt of the joke: never cool, admired or right.
  Plain uniform. **No swastikas or other hate symbols, no Nazi salute, no Holocaust or genocide jokes.**
- **Superheroes are parody lookalikes with parody names** (Bat-Guy, Iron Dude, Super-Dude, Spider-Bro, Captain
  Americano, Wonder Lady, Thud). Never the real names, logos or their S/bat/spider symbols on screen (use
  your own letters and shapes). Copyright claims take reels down.
- No jokes about real victims, real recent tragedies, real mass shootings or terror attacks, suicide or self-harm.
  No gore or blood: the toys break into bricks. No slurs. No jokes at a group's race, religion, gender or disability.
- Never show how to make a weapon, or how to do a real crime in a way someone could copy.

**Script (`script.json`):** 20-40 seconds, about 55-110 words. First phrase = the hook. Numbers spelled out (the narrator
reads them; show digits via `captions.say`). No [brackets].

**Engagement:** follow `engagement/RULES.md` too. Add each reel's first comment to `engagement/toy.json`
(`"<id>": "hot take or playful vote"`); that file never triggers a re-render.

**Caption (`meta.json`):** a savage one-liner that adds to the joke, plus a comment bait question. "Parody." first when
real people appear. 6-10 hashtags (always include `toybricks`, plus trend tags like `darkhumor`, `funny`, `parody`).
`title` is a clickbait-style YouTube title under 70 characters. `cover_t` is the most shocking frame. Add `sources`
only if the reel uses real facts.

## 3. Build each reel
- `script.json` (beats with ids and phrases), `story.js`, `meta.json`. **Write `story.js` with `makeComedy`**
  (documented at the bottom of `style/scenes.js`): one short spec per beat (scene, camera, cast with poses that change
  on words via `V(beat, 'word')`, props, tags, explosions, sounds). Reels 11-31 are complete examples: copy them.
  Plain `makeReel` still works for anything makeComedy can't do.
- **Never use the plain blue studio (`studioShot`) or empty sets.** Every shot has a real location from
  `style/scenes.js` (signature `xxxShot(ctx, W, H_, t, E, TG, (S) => {...}, opt)`):
  `officeShot` (president's office, `{ desk: false }`), `bunkerShot` (war room, glowing world map, `{ alarm: 0..1 }`),
  `prisonShot` (cell, `{ bars: true }`), `lairShot` (Illuminati lair, eye-pyramid, `{ eye: 0..1, table: false }`),
  `desertShot` (pyramids at sunset), `stageShot` (TV / summit stage, `{ banner: 'TEXT', audience: false }`),
  `heavenShot` (clouds and golden gates), `hellShot` (lava, throne), `graveyardShot` (night, fog, moon), `moonShot`,
  `baseShot` (military base at dusk), `bankShot` (`{ sign: 'BANK' }`), `palaceShot` (throne room), `courtShot`,
  `streetShot` (shop fronts, `{ night: 0..1, signs: [...] }`), plus the older `cityShot`, `skyShot`, `spaceShot`,
  `museumShot`, `forestShot`, `lawnShot`. Use at least 3 different scenes per reel; change scene on the twist.
  Stand the cast at z = -1.5..1.5, x = -2..2; captions cover the top quarter, so keep faces below it.
- **Famous characters are ready made:** `actor(S, x, z, s, rot, 'name', { ...pose and face overrides })`. The cast:
  world leaders `trump`, `putin`, `kim`, `biden`, `obama`, `xi`, billionaires `musk`, `zuckerberg`, `bezos`,
  `gates`; history `hitler`, `stalin`, `napoleon`, `caesar`, `cleopatra`, `einstein`, `elvis`, `henry8`,
  `lincoln`; myth and the higher powers `death`, `devil`, `angel`, `zeus`, `illuminati`, `reptilian`, `alien`,
  `dracula`, `mummy`, `zombie`, `santa`; types `robber`, `prisoner`, `cop`, `soldier`, `general`, `ninja`,
  `pirate`, `cowboy`, `viking`, `caveman`, `chef`, `doctor`, `scientist`, `judge`, `clownGuy`; parody heroes
  `batGuy`, `ironDude`, `superDude`, `spiderBro`, `bigGreen`, `capAmericano`, `wonderLady`, `thud`. Overrides like
  `{ eyes: 'x', mouth: 'open', arms: [2.6, 2.6], hold: 'remote', sweat: true }` change the pose for the moment.
  Extra items for `hold`: `scythe`, `pitchfork`, `trident`, `bolt`, `torch`, `club`, `wand`, `gavel`. Extra looks:
  `robe`, `wings`, hats `hood`, `horns`, `halo`, `laurel`, `bicorne`, `tricorn`, `cowboy`, `viking`, `chef`,
  `santa`, `witch`, `tiara`, `beret`, `wig`, `fullmask`, hair `wild`, `bob`, `pompadour`, `bun`, `mohawk`, and
  `facePaint` (see `faceFx`: skull, fangs, glasses, clown, alien, zombie, mummy). Add new cast members inside your
  own story.js by passing the options straight to `actor` or `S.figure`. Use 3-6 famous characters per reel.
- **Dress every character for what they are doing.** The costume kit in `style/bricktoy_base.js` (options on
  `S.figure(x, z, s, rot, {...})`):
  - prisoner `stripes: [[240,240,236],[30,30,36]], number: '24601'` · robber `balaclava: [30,30,36]` or `mask: true`
    with `hat: 'beanie'` · hand props `hold: 'gun' | 'bag' | 'briefcase' | 'phone' | 'remote' | 'sword' | 'shield' |
    'flag' | 'hammer'` (`holdArm: -1` = left hand, `holdCol`)
  - leaders: `suit: true, tie: [200,30,40]` · `hair: 'combover'` (blond swoop) · `hair: 'flattop'` (black, Kim) ·
    `hair: 'thin'` (Putin) · `hair: 'side'` + `mustache: 'toothbrush'` + `hat: 'peaked'` + olive uniform +
    `medals: 5` (dictator) · `hat: 'crown'`, `'tophat'`, `'army'`, `'police'`, `'hard'`, `'cap'`, `'beanie'`
  - heroes: `cape: [r,g,b]` (`capeFlap`), `emblem: { txt, col, bg, shape: 'diamond' | 'circle' }`, `hat: 'cowl'`
    (bat ears; `ears: false` without), `hat: 'helmet'` (red/gold iron face plate), `sleeve` colour, `shirt`/`pants`
  - faces: `eyes` open | wide | closed | x | sleepy | angry · `mouth` smile | o | flat | frown | open | grin | evil ·
    `brows` angry | worried | raised · `shades: true` · `sweat: true` · `mustache` toothbrush | big | beard
    (`hairCol` sets hair, mustache and beard colour)
- **Dark-comedy props** in `style/props.js`: `missile(S, x, y, z, s, tilt, flame)`, `pyramid(S, x, z, s, eye)`
  (all-seeing eye opens 0..1), `boom(S, x, y, z, s, u)` (explosion, u 0..2), `jailBars(S, x, z, w, n, h)`,
  `podium(S, x, z, 'TEXT')`, `bigButton(S, x, y, z, s, press)`, plus the older `cash`, `bag`, `gem`, `vaultDoor`,
  `plane`, `parachute`, `astronaut`, `painting`, and the sets `studioShot`, `cityShot`, `skyShot`, `spaceShot`,
  `museumShot`, `forestShot`, `lawnShot`. Build new props inside your own `story.js` with `S.box` / `S.cyl` when you need them.
- Make it move: fast camera pushes, things flying, x-eyes, explosions on the punchline word, and a sound hit on every
  beat (`sound:` in `makeReel`, see the existing reels).
- Do not edit `toyreels/style/`, `toyreels/config.json` (the voice and size), `toyreels/tools/`, or anything outside
  `toyreels/reels/`, `toyreels/README.md` and `toyreels/batch_log.json`. Never touch `toyreels/posted.json`,
  `toyreels/posting.json` or the workflows.

## 4. Check, push, wait
- Run `tools/check.py` on every reel and LOOK at the contact sheets: no page errors, characters and props in frame,
  costumes right for each character, labels readable, no overlapping text, the first frame already grabs attention. Fix and re-check. Never push an unchecked reel.
- Push a few reels at a time (a series together) to `main` with their README rows, waiting before each push until no
  "Make toy reels" run is queued or in progress. Each push renders only the changed reels.
  GitHub keeps only one queued run: a push made while another run is queued cancels the queued one, and those reels
  never render. If that happens (or a run fails), run "Make toy reels" by hand with the reel box empty: it renders
  every reel that has no Release yet.
- Wait for every new `toyreel-<id>` Release to exist (`gh api repos/scienome/reel-autopilot/releases`). If a render
  fails, read its log, fix the reel and push again, or re-run "Make toy reels" for it.
- Set the batch to `"done"`. Do not run the posting workflow by hand.

## 5. Report
A short plain-language report: the 21 new reels (id and title), how many are rendered, how many are now waiting to
post, anything that failed and why.
