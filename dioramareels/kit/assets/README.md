# 3D kit model library (lib3d.js)

Load what a reel needs, then build. With the DIY kit: `DIY(build, { assets: [...] })`; otherwise `window.REEL_READY = LIB.need([...]).then(build)`.
render.py serves this folder at https://kit.assets/ and waits for REEL_READY. Demo of everything: demos/kit-demo.js
(`python3 dioramareels/kit/scripts/render.py sheet dioramareels/kit/demos/kit-demo.js out/kit-demo.png 1 3 5 7 9 11 13 15 17 19 --timing dioramareels/kit/demos/kit-demo-timing.js`).

## People: `LIB.human(opts)` (needs humans/Superhero_Male or _Female + humans/ual1, or a humans/Woman_* file)
- body: `m`, `f` (realistic bodies with painted clothes), or `woman_casual`, `woman_dress`, `woman_jacket`, `woman_tanktop` (simpler, real clothes)
- top, bottom, shoes, skin (tint), hair colours; hairStyle `short` `long` `bun` `buzz` `none`; sleeves `long` `short` `none`; legs `long` `shorts`; h (height, m)
- `.pose(move, t)`: idle walk run sprint sit sittalk sitdown standup talk punch jab death hit hithead pickup push crouch crouchwalk drive dance kneel
  jump swim interact roll pistol formalwalk torch spell sword (woman_* bodies: idle walk run sit punch death jump clap)
- Recipes: prisoner `{top:'#e8792b',bottom:'#e8792b',shoes:'#f2f2f2',hairStyle:'buzz'}`, police `{top:'#1d3557',bottom:'#14213d'}`,
  judge `{top:'#111114',bottom:'#111114',hair:'#9a9a9a'}`, doctor `{top:'#f4f6f8',bottom:'#5a8fa8'}`, office `{top:'#7aa3c8',bottom:'#333'}`

## Animals: `LIB.animal(name, { h })`, `.pose(move, t)` (idle walk walkslow gallop run eat attack death jump hit idle2 headlow; `.moves` lists the clips)
alpaca bull cow deer dog donkey fox horse horse_white husky sheep stag wolf

## Props / nature / buildings: `LIB.prop('group/name', { h } | { w })`
- props: axe barrel bed_single bench bookshelf cabbage cart chair chandelier chest coin corn crate egg_q eggplant fireplace hay oil_lamp onion present
  pumpkin rug sack_trench shovel stairs strawberry table_round trophy wardrobe watering_can watermelon wheat wood_log
- nature: tree_oak tree_maple tree_birch rock_mossy rock_a..e rock_large_a/b rock_medium rock_formation
- buildings: cottage village_house house_v2 door_round well fence stone_wall bridge stone_bridge

## Places: `LIB.place.<name>(opts)` -> Group with `.spots` (where to stand people) and `.cam` (a good wide shot); some set `.sky`
room(w,d,h,wall,floor:'wood'|'tiles',window) · kitchen · office · courtroom (spots judge witness defense prosecution gallery) · cell (bunk bars)
· park(size,trees) (bench path far) · village (well square door) · street(len,night) (sidewalk road crossing)
Load the models a place uses (trees, bench, chair, cottage...) or it simply leaves them out.
