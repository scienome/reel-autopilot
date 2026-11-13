// tb3d-001 Thought Bubble, 3D toy style (Kenney toy cast + scenery), third person: Riya says "I'm fine", Mum hears something else,
// and the house ghost (haunting since 1824) has seen it all. Mum's thoughts = white clouds, the ghost = blue speech bubbles, Riya = pink.
// Voices: Cartesia, one per character (voice.json cast). Bubbles are timed to each spoken line (TIMING.lines).
STORY((k) => {
  const { T, M, PI } = k; const LN = k.TM.lines; const at = (i) => (LN[i] ? LN[i].t0 : 1e9), to = (i) => (LN[i] ? LN[i].t1 + 0.6 : 1e9);
  const RIYA = { body: 'f', look: 'a' }, MUM = { body: 'f', look: 'e' };
  const MB = { bg: '#ffffff', fg: '#3a1a1a', size: 36 }, GB = { bg: '#cfe6ff', fg: '#16304a', size: 34 }, RB = { bg: '#ffd6e6', fg: '#4a1a2a', size: 36 };
  // living room
  const liv = k.LIB.place.room({ w: 6, d: 5, wall: '#f0d9b5', kind: 'living', seed: 1 }); k.place(liv);
  const door = new T.Mesh(new T.BoxGeometry(0.08, 2.1, 1.0), M('#8a5a36', 0.6)); door.position.set(2.95, 1.05, 1.2); liv.add(door); const knob = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), M('#e8c040', 0.3, 0.8)); knob.position.set(2.9, 1.0, 0.85); liv.add(knob);
  const riya = k.add(k.LIB.human(RIYA), [0.6, 0, 1.2], -PI / 2, liv); const mumL = k.add(k.LIB.human(MUM), [-0.7, 0, 0.6], 0.9, liv); const mumD = k.add(k.LIB.human(MUM), [2.3, 0, 1.2], PI / 2, liv);
  const ghL = k.add(k.ghost({ h: 0.9 }), [-1.9, 0.6, -1.0], 0.5, liv);
  const bag = new T.Mesh(new T.BoxGeometry(0.4, 0.45, 0.2), M('#2a6a3a', 0.7)); bag.castShadow = true; liv.add(bag);
  // kitchen
  const kit = k.LIB.place.kitchen({ w: 6, d: 5, wall: '#f4e6c8' }); k.place(kit);
  const mumK = k.add(k.LIB.human(MUM), [-0.35, 0, -1.2], PI, kit); const ghK = k.add(k.ghost({ h: 0.9 }), [1.9, 1.2, -0.4], -0.6, kit);
  const pots = []; [-0.6, -0.1, 0.4].forEach((x, i) => { const p = new T.Mesh(new T.CylinderGeometry(0.16, 0.14, 0.18, 20), M(['#c0c6ce', '#d8504a', '#3a7ad8'][i], 0.3, 0.6)); p.position.set(x, 1.25, -2.05); kit.add(p); pots.push(p); });
  const steam = []; for (let i = 0; i < 18; i++) { const s = new T.Mesh(new T.SphereGeometry(0.06, 10, 8), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5 })); kit.add(s); steam.push(s); }
  const dishes = []; for (let i = 0; i < 9; i++) { const d = new T.Group(); const pl = new T.Mesh(new T.CylinderGeometry(0.17, 0.13, 0.04, 20), M('#ffffff', 0.4)); d.add(pl); const f = new T.Mesh(new T.SphereGeometry(0.11, 12, 8), M(['#e8a33a', '#c8502a', '#7ab04a', '#f4d06a'][i % 4], 0.6)); f.scale.y = 0.5; f.position.y = 0.05; d.add(f); d.position.set(1.2 + (i % 3) * 0.38, 0.95, -1.6 + Math.floor(i / 3) * 0.38); kit.add(d); dishes.push(d); }
  const tbl = new T.Mesh(new T.BoxGeometry(1.4, 0.06, 1.2), M('#9a6a3e', 0.5)); tbl.position.set(1.6, 0.9, -1.2); kit.add(tbl); [[-0.6, -0.5], [0.6, -0.5], [-0.6, 0.5], [0.6, 0.5]].forEach(([x, z]) => { const l = new T.Mesh(new T.BoxGeometry(0.06, 0.9, 0.06), M('#7a4e2e')); l.position.set(1.6 + x, 0.45, -1.2 + z); kit.add(l); });
  // bedroom
  const bed = k.LIB.place.room({ w: 5, d: 4.4, wall: '#b8c8e8', kind: 'bedroom', seed: 2 }); k.place(bed);
  const bdoor = new T.Mesh(new T.BoxGeometry(0.08, 2.1, 1.0), M('#8a5a36', 0.6)); bdoor.position.set(-2.45, 1.05, 0.9); bed.add(bdoor);
  const riyaB = k.add(k.LIB.human(RIYA), [0.6, 0.62, -0.6], 0.3, bed); const ghB = k.add(k.ghost({ h: 0.9 }), [-0.6, 0.9, 1.8], 0.4, bed);
  const night = new T.PointLight('#6a8ad8', 0, 8); night.position.set(0, 2.4, 0.5); bed.add(night);
  const plate = new T.Group(); { const pl = new T.Mesh(new T.CylinderGeometry(0.22, 0.17, 0.05, 24), M('#ffffff', 0.4)); plate.add(pl); for (let i = 0; i < 4; i++) { const f = new T.Mesh(new T.SphereGeometry(0.08, 10, 8), M(['#e8a33a', '#c8502a', '#7ab04a', '#f4d06a'][i], 0.6)); f.scale.y = 0.6; f.position.set(Math.cos(i * 1.6) * 0.09, 0.05, Math.sin(i * 1.6) * 0.09); plate.add(f); } const note = new T.Mesh(new T.BoxGeometry(0.16, 0.005, 0.12), M('#ffe86a', 0.7)); note.position.set(0.16, 0.03, 0.12); note.rotation.y = 0.4; plate.add(note); }
  plate.position.set(-2.0, 0.03, 0.9); bed.add(plate); const warm = []; for (let i = 0; i < 8; i++) { const s = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.45 })); bed.add(s); warm.push(s); }
  let ov = null;
  const steamTick = (t, arr, base, n) => arr.forEach((s, i) => { const u = (t * 0.5 + i / arr.length) % 1; const b = base[i % base.length]; s.position.set(b[0] + Math.sin(i + t * 2) * 0.05, b[1] + u * (n || 0.9), b[2]); s.material.opacity = 0.5 * (1 - u); s.scale.setScalar(0.6 + u * 1.4); });
  const talk = (t, i) => t >= at(i) && t <= LN[i].t1;
  const livSet = (t) => { k.only(liv); riya.visible = true; mumL.visible = true; mumD.visible = false; riya.position.set(0.6, 0, 1.2); riya.rotation.y = -PI / 2; bag.position.set(0.5, 0.22, 1.5); bag.rotation.set(0, 0, 0.5); ghL.tick(t, talk(t, 3) || talk(t, 16)); };
  // line index: 0 hook, 1-3 bag, 4-5 hungry, 6-7 cook, 8-9 room, 10-12 knock, 13 plate, 14-15 note, 16 outro
  const shots = {
    hook: (t, kk) => { livSet(t); k.walk(riya, [2.4, 0, 1.2], [0.6, 0, 1.2], Math.min(1, kk * 1.8), kk < 0.55 ? 'walk' : 'idle', t); mumL.pose('idle', t); bag.position.set(riya.position.x - 0.1, 0.55, riya.position.z + 0.25); bag.rotation.set(0, 0, 0);
      ov = (ctx) => { k.hookText(ctx, "WHAT MUM HEARS WHEN\nRIYA SAYS \"I'M *FINE*\"", { size: 56 }); if (kk > 0.7) k.think(ctx, ghL, '👻 seen it all', t, at(0) + 4.5, 1e9, Object.assign({ h: 1.1, up: 120, y: 470 }, GB)); }; return k.cam([0, 1.8, 5.2], [-0.3, 0.8, 0.4], 46); },
    bag: (t, kk) => { livSet(t); riya.pose(kk < 0.25 ? 'pickup' : 'idle', t); mumL.pose(t > at(2) ? 'yes' : 'idle', t); mumL.rotation.y = Math.atan2(1.3, 0.6);
      const f = Math.min(1, kk * 5); bag.position.set(0.5, 0.55 - f * 0.33, 1.5); bag.rotation.set(0, 0, f * 0.5);
      ov = (ctx) => { if (kk > 0.04 && kk < 0.22) k.boom(ctx, (kk - 0.04) * 5, 470, 900, 'THUD'); k.think(ctx, mumL, 'BAG DROP. LEVEL 7. 🚨', t, at(2), to(2), Object.assign({ h: 1.5 }, MB)); k.think(ctx, ghL, 'LEVEL 8. SINCE 1824. 👻', t, at(3), to(3), Object.assign({ h: 1.0, up: 120 }, GB)); };
      return t < at(3) ? k.cam([0.9, 1.5, 4.2], [-0.1, 0.9, 0.8], 42) : k.cam([0.2, 1.6, 2.6], [-1.6, 1.0, -0.6], 44); },
    hungry: (t, kk) => { livSet(t); riya.pose(talk(t, 4) ? 'no' : 'idle', t); mumL.pose(t > at(5) ? 'hit' : 'idle', t);
      ov = (ctx) => { k.think(ctx, riya, '"I\'m not hungry."', t, at(4), to(4), Object.assign({ h: 1.5 }, RB)); k.think(ctx, mumL, 'NOT HUNGRY?! CODE RED 🔴', t, at(5), to(5), Object.assign({ h: 1.5 }, MB)); };
      return t < at(5) ? k.cam([-0.6, 1.4, 4.0], [0.3, 0.9, 1.0], 40) : k.cam([0.9, 1.5, 4.0], [-0.4, 0.9, 0.6], 40); },
    cook: (t, kk) => { k.only(kit); mumK.pose('interact', t); ghK.tick(t, talk(t, 7)); ghK.position.x = 1.9 + Math.sin(t) * 0.1; steamTick(t, steam, pots.map((p) => [p.position.x, 1.36, p.position.z]), 1.1); dishes.forEach((d, i) => { d.visible = kk > i / 10; });
      ov = (ctx) => { k.counter(ctx, 'DISHES', `${Math.min(9, Math.floor(kk * 10))}`, { y: 170 }); k.think(ctx, ghK, "I CAN'T EVEN EAT. 😤", t, at(7), to(7), Object.assign({ h: 1.0, up: 110, y: 330 }, GB)); }; return k.cam([2.4 - kk * 0.4, 2.2, 2.8], [0.6, 1.0, -1.2], 46); },
    room: (t, kk) => { if (t < at(9)) { k.only(bed); riyaB.pose('sit', t); ghB.tick(t); night.intensity = 0; ov = (ctx) => k.card(ctx, 'DOOR: SHUT 🚪', { y: 300, bg: '#2a2f3a', size: 42 }); return k.cam([1.0, 1.7, 2.8], [0.2, 0.8, -0.6], 44); }
      k.only(liv); riya.visible = false; mumL.visible = false; mumD.visible = true; mumD.rotation.y = 0.9 - PI / 2; mumD.pose('idle', t); ghL.tick(t); ov = (ctx) => { k.think(ctx, mumD, "DON'T KNOCK. DON'T KNOCK.", t, at(9), to(9), Object.assign({ h: 1.5 }, MB)); }; return k.cam([0.8, 1.5, 3.8], [2.2, 0.9, 1.2], 42); },
    knock: (t, kk) => { if (t < at(11) || t > to(11) - 0.4 && t < at(12)) { k.only(liv); riya.visible = false; mumL.visible = false; mumD.visible = true; mumD.rotation.y = t < at(10) ? PI / 2 : 0.9 - PI / 2; mumD.pose(t < at(10) ? 'interact' : 'idle', t); ghL.tick(t);
        ov = (ctx) => { if (t < at(10)) k.boom(ctx, (t - (at(10) - 0.9)) / 0.9, 470, 760, 'KNOCK'); k.think(ctx, mumD, '"Need anything?"', t, at(10), to(10), Object.assign({ h: 1.5 }, MB)); }; return k.cam([0.8, 1.5, 3.8], [2.3, 0.9, 1.2], 42); }
      if (t < at(12)) { k.only(bed); riyaB.pose('no', t); ghB.tick(t); night.intensity = 0; ov = (ctx) => k.think(ctx, riyaB, '"No."', t, at(11), to(11), Object.assign({ h: 1.4 }, RB)); return k.cam([1.0, 1.6, 2.6], [0.3, 0.9, -0.5], 42); }
      k.only(bed); riyaB.pose('sit', t); ghB.tick(t, talk(t, 12)); night.intensity = 0; ov = (ctx) => k.think(ctx, ghB, 'NO MEANS YES. EVEN I KNOW. 👻', t, at(12), to(12), Object.assign({ h: 1.0, up: 120 }, GB)); return k.cam([0.6, 1.5, 3.8], [-0.4, 1.0, 1.2], 44); },
    plate: (t, kk) => { k.only(bed); night.intensity = 1.6; riyaB.position.set(-1.4 + Math.max(0, 0.4 - kk) * 4, 0, 0.9); riyaB.rotation.y = -PI / 2; riyaB.pose(kk < 0.4 ? 'walk' : 'crouch', t); ghB.tick(t); ghB.position.set(-0.4, 0.9, 1.9); steamTick(t, warm, [[-2.0, 0.1, 0.9]], 0.5);
      ov = (ctx) => { k.vignette(ctx, 0.5); k.counter(ctx, 'TIME', '00:00', { y: 170 }); if (kk > 0.5) k.card(ctx, 'STILL WARM 🍲', { y: 300, bg: '#e8a33a', size: 42 }); }; return k.cam([-1.5, 1.5, 3.4], [-1.8, 0.4, 0.9], 42); },
    note: (t, kk) => { k.only(bed); night.intensity = 1.6; riyaB.position.set(-1.4, 0, 0.9); riyaB.rotation.y = -PI / 2; riyaB.pose('crouch', t); ghB.tick(t, talk(t, 15)); steamTick(t, warm, [[-2.0, 0.1, 0.9]], 0.5);
      if (t < at(15)) { ov = (ctx) => { k.vignette(ctx, 0.6); const u = Math.min(1, (t - at(14) + 0.3) * 3); ctx.save(); ctx.translate(360, 640); ctx.rotate(-0.05); ctx.scale(Math.max(0, u), Math.max(0, u)); ctx.fillStyle = '#ffe86a'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.fillRect(-230, -200, 460, 400); ctx.shadowBlur = 0;
        ctx.fillStyle = '#3a2a1a'; ctx.font = 'italic 700 64px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText("I'm fine too.", 0, -30); ctx.fillText('Eat. ❤️', 0, 70); ctx.font = '700 30px Georgia, serif'; ctx.fillText('— Mum', 120, 160); ctx.restore(); }; return k.cam([-0.6, 1.3, 2.2], [-1.9, 0.3, 0.9], 40); }
      ghB.position.set(-1.0, 0.8, 1.6); ov = (ctx) => { k.vignette(ctx, 0.5); k.think(ctx, ghB, 'BEST FAMILY I\'VE HAUNTED. 🤫', t, at(15), to(15), Object.assign({ h: 1.0, up: 120 }, GB)); }; return k.cam([0.4, 1.4, 3.6], [-1.3, 0.7, 1.2], 44); },
    outro: (t, kk) => { livSet(t); riya.pose('idle', t); mumL.pose('idle', t); ov = (ctx) => { k.card(ctx, 'TAG THE ONE WHO ALWAYS KNOWS 👇', { y: 1185, bg: '#d8504a', size: 30 }); }; return k.cam([0, 1.8, 5.2], [-0.3, 0.8, 0.4], 46); },
  };
  return { shots, lens: 28, minDist: 2.2, sky: '#f0d9b5', capStyle: 'film', over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/ual1'] });
