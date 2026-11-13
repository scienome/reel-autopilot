// tb3d-001 Thought Bubble in the 3D toy style (Kenney toy cast + scenery): what your mum REALLY hears when you say "I'm fine".
// Living room (you walk in, drop the bag, mum looks over), kitchen (mum cooks everything, pots steaming), your bedroom (door shut, one knock),
// midnight: a plate outside your door with a note. Mum's thoughts pop up as clouds over her head, in her own voice.
STORY((k) => {
  const { T, M, PI } = k;
  const KID = { body: 'm', top: '#3a7ad8', bottom: '#2a2f3a', look: 'b' }, MUM = { body: 'f', top: '#d8504a', look: 'e' };
  // living room + front door
  const liv = k.LIB.place.room({ w: 6, d: 5, wall: '#f0d9b5', kind: 'living', seed: 1 }); k.place(liv);
  const door = new T.Mesh(new T.BoxGeometry(0.08, 2.1, 1.0), M('#8a5a36', 0.6)); door.position.set(2.95, 1.05, 1.2); const knob = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), M('#e8c040', 0.3, 0.8)); knob.position.set(2.9, 1.0, 0.85); liv.add(knob); liv.add(door);
  const sofa = k.LIB.gltf['khome/loungeSofa'] ? k.LIB.prop('khome/loungeSofa', { h: 0.95 }) : null; if (sofa) { sofa.position.set(-1.2, 0, -1.6); liv.add(sofa); }
  const kid = k.add(k.LIB.human(KID), [0.6, 0, 1.2], -PI / 2, liv); const mumL = k.add(k.LIB.human(MUM), [-0.7, 0, 0.6], 0.9, liv);
  const bag = new T.Mesh(new T.BoxGeometry(0.4, 0.45, 0.2), M('#2a6a3a', 0.7)); bag.castShadow = true; liv.add(bag);
  // kitchen
  const kit = k.LIB.place.kitchen({ w: 6, d: 5, wall: '#f4e6c8' }); k.place(kit);
  const mumK = k.add(k.LIB.human(MUM), [-0.35, 0, -1.2], PI, kit);
  const pots = []; [-0.6, -0.1, 0.4].forEach((x, i) => { const p = new T.Mesh(new T.CylinderGeometry(0.16, 0.14, 0.18, 20), M(['#c0c6ce', '#d8504a', '#3a7ad8'][i], 0.3, 0.6)); p.position.set(x, 1.25, -2.05); kit.add(p); pots.push(p); });
  const steam = []; for (let i = 0; i < 18; i++) { const s = new T.Mesh(new T.SphereGeometry(0.06, 10, 8), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5 })); kit.add(s); steam.push(s); }
  const dishes = []; for (let i = 0; i < 9; i++) { const d = new T.Group(); const pl = new T.Mesh(new T.CylinderGeometry(0.17, 0.13, 0.04, 20), M('#ffffff', 0.4)); d.add(pl); const f = new T.Mesh(new T.SphereGeometry(0.11, 12, 8), M(['#e8a33a', '#c8502a', '#7ab04a', '#f4d06a'][i % 4], 0.6)); f.scale.y = 0.5; f.position.y = 0.05; d.add(f); d.position.set(1.2 + (i % 3) * 0.38, 0.95 + Math.floor(i / 3) * 0.0, -1.6 + Math.floor(i / 3) * 0.38); kit.add(d); dishes.push(d); }
  const tbl = new T.Mesh(new T.BoxGeometry(1.4, 0.06, 1.2), M('#9a6a3e', 0.5)); tbl.position.set(1.6, 0.9, -1.2); kit.add(tbl); [[-0.6, -0.5], [0.6, -0.5], [-0.6, 0.5], [0.6, 0.5]].forEach(([x, z]) => { const l = new T.Mesh(new T.BoxGeometry(0.06, 0.9, 0.06), M('#7a4e2e')); l.position.set(1.6 + x, 0.45, -1.2 + z); kit.add(l); });
  // bedroom
  const bed = k.LIB.place.room({ w: 5, d: 4.4, wall: '#b8c8e8', kind: 'bedroom', seed: 2 }); k.place(bed);
  const bdoor = new T.Mesh(new T.BoxGeometry(0.08, 2.1, 1.0), M('#8a5a36', 0.6)); bdoor.position.set(-2.45, 1.05, 0.9); bed.add(bdoor);
  const kidB = k.add(k.LIB.human(KID), [0.6, 0.62, -0.6], 0.3, bed); const mumD = k.add(k.LIB.human(MUM), [2.3, 0, 1.2], PI / 2, liv); mumD.visible = false;
  const night = new T.PointLight('#6a8ad8', 0, 8); night.position.set(0, 2.4, 0.5); bed.add(night);
  const plate = new T.Group(); { const pl = new T.Mesh(new T.CylinderGeometry(0.22, 0.17, 0.05, 24), M('#ffffff', 0.4)); plate.add(pl); for (let i = 0; i < 4; i++) { const f = new T.Mesh(new T.SphereGeometry(0.08, 10, 8), M(['#e8a33a', '#c8502a', '#7ab04a', '#f4d06a'][i], 0.6)); f.scale.y = 0.6; f.position.set(Math.cos(i * 1.6) * 0.09, 0.05, Math.sin(i * 1.6) * 0.09); plate.add(f); } const note = new T.Mesh(new T.BoxGeometry(0.16, 0.005, 0.12), M('#ffe86a', 0.7)); note.position.set(0.16, 0.03, 0.12); note.rotation.y = 0.4; plate.add(note); }
  plate.position.set(-2.0, 0.03, 0.9); bed.add(plate); const warm = []; for (let i = 0; i < 8; i++) { const s = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.45 })); bed.add(s); warm.push(s); }
  let ov = null; const MB = { bg: '#fff3f2', fg: '#3a1a1a', size: 38 };
  const W0 = (t, kk, a, f) => (kk > f ? t - (kk - f) * (t - a) / Math.max(kk, 1e-3) : 1e9); // when the cloud pops (fraction f of the shot)
  const steamTick = (t, arr, base, n) => arr.forEach((s, i) => { const u = (t * 0.5 + i / arr.length) % 1; const b = base[i % base.length]; s.position.set(b[0] + Math.sin(i + t * 2) * 0.05, b[1] + u * (n || 0.9), b[2]); s.material.opacity = 0.5 * (1 - u); s.scale.setScalar(0.6 + u * 1.4); });
  const shots = {
    hook: (t, kk, a) => { k.only(liv); kid.visible = true; mumL.visible = true; mumD.visible = false; k.walk(kid, [2.4, 0, 1.2], [0.6, 0, 1.2], Math.min(1, kk * 1.8), kk < 0.55 ? 'walk' : 'idle', t); mumL.pose('idle', t); bag.position.set(kid.position.x - 0.1, 0.55, kid.position.z + 0.25); bag.rotation.set(0, 0, 0);
      ov = (ctx) => { k.hookText(ctx, "WHAT MUM HEARS WHEN\nYOU SAY \"I'M *FINE*\"", { size: 56 }); }; return k.cam([0, 1.8, 5.2], [0, 0.8, 0.6], 44); },
    bag: (t, kk, a, b) => { k.only(liv); kid.visible = true; mumL.visible = true; mumD.visible = false; kid.position.set(0.6, 0, 1.2); kid.rotation.y = -PI / 2; kid.pose(kk < 0.3 ? 'pickup' : 'idle', t); mumL.pose(kk > 0.4 ? 'yes' : 'idle', t); mumL.rotation.y = Math.atan2(2.0, 0.6);
      const f = Math.min(1, kk * 4); bag.position.set(0.5, 0.55 - f * 0.33, 1.5); bag.rotation.z = f * 0.5;
      ov = (ctx) => { k.think(ctx, mumL, 'BAG DROP. LEVEL 7. 🚨', t, W0(t, kk, a, 0.42), 1e9, Object.assign({ h: 1.55 }, MB)); if (kk > 0.05 && kk < 0.3) k.boom(ctx, (kk - 0.05) * 4, 470, 900, 'THUD'); };
      return kk < 0.4 ? k.cam([1.3, 1.1, 3.6], [0.5, 0.5, 1.3], 40) : k.cam([0.3, 1.6, 4.4], [-0.2, 0.9, 0.8], 42); },
    hungry: (t, kk, a, b) => { k.only(liv); kid.visible = true; mumL.visible = true; mumD.visible = false; kid.pose('no', t); mumL.pose(kk > 0.45 ? 'hit' : 'idle', t); bag.position.set(0.5, 0.22, 1.5);
      ov = (ctx) => { if (kk < 0.45) k.card(ctx, '"NOT HUNGRY."', { y: 300, bg: '#3a7ad8', size: 44 }); k.think(ctx, mumL, 'NOT HUNGRY?! CODE RED 🔴', t, W0(t, kk, a, 0.45), 1e9, Object.assign({ h: 1.55 }, MB)); };
      return kk < 0.45 ? k.cam([-0.6, 1.4, 4.0], [0.3, 0.9, 1.0], 40) : k.cam([0.9, 1.5, 4.0], [-0.4, 0.9, 0.6], 40); },
    cook: (t, kk) => { k.only(kit); mumK.pose('interact', t); steamTick(t, steam, pots.map((p) => [p.position.x, 1.36, p.position.z]), 1.1); dishes.forEach((d, i) => { d.visible = kk > i / 10; d.position.y = 0.95 + (kk > i / 10 && kk < i / 10 + 0.06 ? 0.2 : 0); });
      ov = (ctx) => { k.counter(ctx, 'DISHES', `${Math.min(9, Math.floor(kk * 10))}`, { y: 170 }); }; return k.cam([2.6 - kk * 0.6, 2.2, 2.6], [0.6, 1.0, -1.4], 44); },
    room: (t, kk, a, b) => { if (kk < 0.4) { k.only(bed); kidB.pose('sit', t); night.intensity = 0; ov = (ctx) => k.card(ctx, 'DOOR: SHUT 🚪', { y: 300, bg: '#2a2f3a', size: 42 }); return k.cam([1.0, 1.7, 2.8], [0.2, 0.8, -0.6], 44); }
      k.only(liv); kid.visible = false; mumL.visible = false; mumD.visible = true; mumD.rotation.y = 0.9 - PI / 2; mumD.pose('idle', t); ov = (ctx) => { k.think(ctx, mumD, "DON'T KNOCK. DON'T KNOCK.", t, W0(t, kk, a, 0.42), 1e9, Object.assign({ h: 1.5 }, MB)); }; return k.cam([0.8, 1.5, 3.8], [2.2, 0.9, 1.2], 42); },
    knock: (t, kk, a, b) => { k.only(liv); kid.visible = false; mumL.visible = false; mumD.visible = true; mumD.rotation.y = kk < 0.35 ? PI / 2 : 0.9 - PI / 2; mumD.pose(kk < 0.35 ? 'interact' : 'idle', t);
      ov = (ctx) => { if (kk > 0.08 && kk < 0.3) k.boom(ctx, (kk - 0.08) * 4.5, 470, 760, 'KNOCK'); if (kk > 0.3 && kk < 0.55) k.card(ctx, '"NEED ANYTHING?"  "NO."', { y: 300, bg: '#d8504a', size: 38 }); k.think(ctx, mumD, 'NO MEANS YES. 💛', t, W0(t, kk, a, 0.58), 1e9, Object.assign({ h: 1.5 }, MB)); };
      return k.cam([0.8, 1.5, 3.8], [2.3, 0.9, 1.2], 42); },
    plate: (t, kk) => { k.only(bed); night.intensity = 1.6; kidB.position.set(-1.4 + Math.max(0, 0.4 - kk) * 4, 0, 0.9); kidB.rotation.y = -PI / 2; kidB.pose(kk < 0.4 ? 'walk' : 'crouch', t); steamTick(t, warm, [[-2.0, 0.1, 0.9]], 0.5);
      ov = (ctx) => { k.vignette(ctx, 0.5); k.counter(ctx, 'TIME', '00:00', { y: 170 }); if (kk > 0.5) k.card(ctx, 'STILL WARM 🍲', { y: 300, bg: '#e8a33a', size: 42 }); }; return k.cam([-1.5, 1.5, 3.4], [-1.8, 0.4, 0.9], 42); },
    note: (t, kk) => { k.only(bed); night.intensity = 1.6; kidB.position.set(-1.4, 0, 0.9); kidB.rotation.y = -PI / 2; kidB.pose('crouch', t); steamTick(t, warm, [[-2.0, 0.1, 0.9]], 0.5);
      ov = (ctx) => { k.vignette(ctx, 0.6); const u = Math.min(1, kk * 3); ctx.save(); ctx.translate(360, 640); ctx.rotate(-0.05); ctx.scale(u, u); ctx.fillStyle = '#ffe86a'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.fillRect(-230, -200, 460, 400); ctx.shadowBlur = 0;
        ctx.fillStyle = '#3a2a1a'; ctx.font = 'italic 700 64px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText("I'm fine too.", 0, -30); ctx.fillText('Eat. ❤️', 0, 70); ctx.font = '700 30px Georgia, serif'; ctx.fillText('— Mum', 120, 160); ctx.restore(); }; return k.cam([-0.6, 1.3, 2.2], [-1.9, 0.3, 0.9], 40); },
    outro: (t, kk) => { k.only(liv); kid.visible = true; mumL.visible = true; mumD.visible = false; kid.position.set(0.6, 0, 1.2); kid.rotation.y = -PI / 2; kid.pose('idle', t); mumL.pose('idle', t); bag.position.set(0.5, 0.22, 1.5);
      ov = (ctx) => { k.card(ctx, 'TAG THE ONE WHO ALWAYS KNOWS 👇', { y: 1185, bg: '#d8504a', size: 30 }); }; return k.cam([0, 1.8, 5.2], [0, 0.8, 0.6], 44); },
  };
  return { shots, lens: 28, minDist: 2.2, sky: '#f0d9b5', capStyle: 'film', over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/ual1'] });
