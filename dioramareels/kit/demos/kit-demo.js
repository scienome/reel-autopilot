// Kit demo (not a reel for posting): every place, people in clothes doing moves, animals. Check with
// python3 dioramareels/kit/scripts/render.py sheet dioramareels/kit/demos/kit-demo.js out/kit-demo.png 1 3 5 7 9 11 13 15 17 --timing dioramareels/kit/demos/kit-demo-timing.js
DIY(({ T, root, PI }) => {
  const places = {}; const show = (n) => Object.entries(places).forEach(([k, g]) => { g.visible = k === n; });
  const park = places.park = LIB.place.park(); root.add(park);
  const man = LIB.human({ body: 'm', top: '#c0392b', bottom: '#2c3e50', hair: '#3b2414', hairStyle: 'short' }); park.add(man);
  const dog = LIB.animal('dog'); park.add(dog);
  const woman = LIB.human({ body: 'f', top: '#f2f2f2', bottom: '#1f3b73', hair: '#1a1210', hairStyle: 'long', sleeves: 'short' }); park.add(woman); woman.position.set(2.0, 0, 0); woman.rotation.y = -PI / 2;
  const court = places.court = LIB.place.courtroom(); root.add(court);
  const judge = LIB.human({ body: 'm', top: '#111114', bottom: '#111114', hair: '#9a9a9a', hairStyle: 'short' }); court.add(judge); judge.position.set(...court.spots.judge); judge.scale.multiplyScalar(1);
  const acc = LIB.human({ body: 'm', top: '#e8792b', bottom: '#e8792b', shoes: '#f2f2f2', hair: '#111', hairStyle: 'buzz' }); court.add(acc); acc.position.set(...court.spots.defense); acc.rotation.y = PI;
  const cop = LIB.human({ body: 'f', top: '#1d3557', bottom: '#14213d', hair: '#2b1b12', hairStyle: 'bun' }); court.add(cop); cop.position.set(-3.4, 0, 0.8);
  const cell = places.cell = LIB.place.cell(); root.add(cell); const pris = LIB.human({ body: 'm', top: '#e8792b', bottom: '#e8792b', shoes: '#f2f2f2', hair: '#2a1a10' }); cell.add(pris); pris.position.set(-1.0, 0.1, -0.9);
  const street = places.street = LIB.place.street({ night: true }); root.add(street); const runner = LIB.human({ body: 'woman_jacket' }); street.add(runner); runner.position.set(5.2, 0.18, 4); runner.rotation.y = PI;
  const vil = places.village = LIB.place.village(); root.add(vil); const horse = LIB.animal('horse'); vil.add(horse); horse.position.set(-2, 0, 1); horse.rotation.y = 0.6; const cow = LIB.animal('cow'); vil.add(cow); cow.position.set(4.5, 0, 2.5); cow.rotation.y = -1.2;
  const deer = LIB.animal('deer'); vil.add(deer); deer.position.set(-5, 0, -2); deer.rotation.y = 1.0;
  const office = places.office = LIB.place.office(); root.add(office); const worker = LIB.human({ body: 'f', top: '#7aa3c8', bottom: '#333', hair: '#5a3a1a', hairStyle: 'bun' }); office.add(worker); worker.position.set(-1.4, 0, 0.15); worker.rotation.y = PI;
  const kit = places.kitchen = LIB.place.kitchen(); root.add(kit); const cook = LIB.human({ body: 'woman_casual' }); kit.add(cook); cook.position.set(0, 0, -1.4); cook.rotation.y = PI;
  const zoo = places.zoo = LIB.place.park({ trees: 4 }); root.add(zoo); const AN = ['fox', 'wolf', 'stag', 'alpaca', 'donkey', 'bull', 'husky', 'sheep'].map((n, i) => { const a = LIB.animal(n); a.position.set(-5.25 + i * 1.5, 0, (i % 2) * 1.5); a.rotation.y = 0.5; zoo.add(a); return a; });
  const cam = (pl, o = {}) => Object.assign({ pos: pl.cam.pos, look: pl.cam.look, fov: pl.cam.fov, focus: [0.1, 0.95], blur: 2 }, o);
  const shots = {
    park: (t) => { show('park'); man.position.set(0, 0, 4 - ((t * 1.2) % 10)); man.rotation.y = PI; man.pose('walk', t); dog.position.set(0.7, 0, 3.4 - ((t * 1.2) % 10)); dog.rotation.y = PI; dog.pose('walk', t); woman.pose('sit', t); return cam(park, { sky: park.sky }); },
    court: (t) => { show('court'); judge.pose('sittalk', t); acc.pose('idle', t); cop.pose('idle', t); return cam(court); },
    cell: (t) => { show('cell'); pris.pose('sit', t); return cam(cell); },
    street: (t) => { show('street'); runner.pose('run', t); runner.position.z = 4 - (t * 3) % 20; return cam(street, { sky: street.sky }); },
    village: (t) => { show('village'); horse.pose('eat', t); cow.pose('idle', t); deer.pose('walk', t); return cam(vil, { sky: vil.sky }); },
    office: (t) => { show('office'); worker.pose('sit', t); return cam(office); },
    kitchen: (t) => { show('kitchen'); cook.pose('idle', t); return cam(kit); },
    zoo: (t) => { show('zoo'); AN.forEach((a, i) => a.pose(i % 2 ? 'eat' : 'idle', t)); return { pos: [0, 2.2, 9], look: [0, 0.7, 0], fov: 40, focus: [0.1, 0.95], blur: 2, sky: '#9fd3f2' }; },
    close: (t) => { show('park'); man.position.set(-0.35, 0, 0); man.rotation.y = 0.35; man.pose('talk', t); woman.position.set(0.45, 0, 0); woman.rotation.y = -0.6; woman.pose('idle', t); dog.position.set(0, 0, 1); dog.pose('idle', t); return { pos: [0.05, 1.85, 2.4], look: [0.05, 1.7, 0], fov: 34, focus: [0.2, 0.9], blur: 3, sky: park.sky }; },
    punch: (t) => { show('street'); runner.pose('punch', t); runner.position.z = 4; return { pos: [7.5, 1.6, 7.5], look: [5.2, 1.1, 4], fov: 34, focus: [0.2, 0.9], blur: 3, sky: street.sky }; },
  };
  return { props: Object.values(places), shots, table: false, sky: '#9fd3f2', wall: '#888' };
}, { assets: ['humans/Superhero_Male', 'humans/Superhero_Female', 'humans/ual1', 'humans/Woman_Jacket', 'humans/Woman_Casual', 'animals/dog', 'animals/horse', 'animals/cow', 'animals/deer', 'animals/fox', 'animals/wolf', 'animals/stag', 'animals/alpaca', 'animals/donkey', 'animals/bull', 'animals/husky', 'animals/sheep',
  'nature/tree_oak', 'nature/tree_maple', 'nature/tree_birch', 'nature/rock_mossy', 'props/bench', 'props/chair', 'buildings/cottage', 'buildings/village_house', 'buildings/house_v2', 'buildings/well', 'buildings/fence'] });
