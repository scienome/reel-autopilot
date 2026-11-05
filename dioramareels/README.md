# Diorama reels kit

3D tilt-shift miniature reels. `tools/diorama_make.py <id>` voices `reels/<id>/script.json`, renders `reels/<id>/reel.js` and the
"Make diorama reels" workflow publishes Release `diorama-<id>`. It never posts. Voice and model: `config.json`.

## Files
- `kit/references/diorama.js`: engine (`window.D`): toy figures, hero tower, elevator, living room, tilt-shift, all overlays.
- `kit/references/city.js`: complete city (`D.city`).
- `kit/references/life.js`: you-live-here kit (`D.life`): your apartment, over-the-shoulder camera, balance counter, clock tag, gold tower, money stream, rise shot.
- `kit/scripts/render.py`: sheet and video render. Sound effects come from `mysteryreels/kit/references/sound.js`.

## Sets
- **Hero tower**, origin: 9-floor cutaway, 18 rooms (sofas, beds, TVs, dining, bookshelves, kitchens, baths), elevator shaft, roof garden,
  pool, string lights, water tower, striped canopy. `D.sets.car` is the elevator car; floor height 3.
- **City**, around the tower: 100+ towers (plain, stepped, round, glass, domes, antennas), streets, crosswalks, 110 moving cars and taxis,
  200 walkers, street lamps, trees, plaza, parks, Ferris wheel, stadium, river, boats, bridge, mountains, clouds, hot air balloons, neon signs.
- **Elevator interior**, x = 1000. **Living room**, x = 1100, with router, sofa, lamp, plant.

## City calls
- `D.city.mode('sunset' | 'night' | 'day' | 'interior')` every frame: sky, sun, haze, lit windows. Use 'interior' for elevator and living room shots.
- `D.city.update(t)` every frame: traffic, people, clouds, balloons, boats, wheel.
- Camera views for `D.render3d`: `D.city.dive(p)`, `D.city.orbit(p)`, `D.city.street(p)`, `D.city.ferris(p)` with p 0 to 1.

## Overlays
`D.hookCard` giant frame-0 hook, `D.title`, `D.caption` (`*RED` word, `|` new line), `D.label`, `D.thought`, `D.rule`, `D.phoneCard`, `D.toast`, `D.endCard`, `D.fiction`.

## Rules
- Frame 0 must be readable at once. Hypothetical second-person story, a new twist, end on a comment question.
- Keep faces out of caption height: captions at y 845 on wide shots, y 985 on close-ups.
- Original stories and names only. Always labelled fiction.
- Everything random uses the seeded `Math.random`, so render workers agree. Never reseed it inside a reel.
