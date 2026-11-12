// 147 cinestory3d (story3d.js): the La Guardia 'bread thief' anecdote (told as 'the story goes'). Scroll stopper: a judge pointing at the whole room.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const ct = k.LIB.place.courtroom(); k.place(ct); const S = ct.spots;
  const judge = k.add(k.LIB.human({ body: 'm', top: '#111114', bottom: '#111114', hair: '#2a2a2a', hairStyle: 'short' }), [S.judge[0], S.judge[1], S.judge[2]], 0, ct);
  const old = k.add(k.LIB.human({ body: 'm', top: '#7d7f86', bottom: '#4a3a2a', shoes: '#2a2018', hair: '#d8d8d8', hairStyle: 'short', skin: '#e8d8c8' }), [0, 0, -1.2], PI, ct);
  const cop = k.add(k.LIB.human({ body: 'm', top: '#1d3557', bottom: '#14213d', hair: '#111', hairStyle: 'buzz' }), [1.0, 0, -1.0], -PI / 2, ct);
  const G = []; for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) G.push(k.add(k.LIB.human({ body: (r + i) % 2 ? 'f' : 'm', top: ['#7a8a99', '#a0522d', '#2f4f4f', '#5b4a7a', '#8b6c42', '#3e5a7a'][(r * 4 + i) % 6], bottom: '#2a2a30', hair: ['#1a1210', '#3b2414', '#5a3a1a', '#888'][(r + i) % 4], hairStyle: (r + i) % 2 ? 'bun' : 'short' }), [-2.4 + i * 1.6, 0, 2.3 + r * 0.8], PI, ct));
  const bread = new T.Mesh(new T.CapsuleGeometry(0.09, 0.22, 6, 12), M('#c8893f', 0.7)); bread.rotation.z = PI / 2; ct.add(bread);
  const hat = new T.Group(); const hb = new T.Mesh(new T.CylinderGeometry(0.17, 0.15, 0.14, 24, 1, true), M('#222', 0.6, 0, { side: T.DoubleSide })); hat.add(hb); const brim = new T.Mesh(new T.RingGeometry(0.15, 0.27, 32), M('#222', 0.6, 0, { side: T.DoubleSide })); brim.rotation.x = -PI / 2; brim.position.y = -0.07; hat.add(brim); ct.add(hat);
  const all = (move, t) => { G.forEach((g, i) => g.pose(move, t + i * 0.3)); };
  let ov = null; const dusk = (ctx, a = 0.18) => k.tint(ctx, '#3a2a10', a);
  const money = (ctx, t, at, txt, y = 260, col = '#2ecc71') => k.card(ctx, txt, { t, at, y, bg: col });
  const shots = {
    hook: (t, kk, a) => { k.only(ct); bread.visible = hat.visible = false; judge.pose('talk', t); all('idle', t); old.pose('idle', t); cop.pose('idle', t); ov = (ctx) => { dusk(ctx); k.big(ctx, 'EVERYONE. FINED.', { y: 250, size: 70, col: '#ffd23f' }); };
      return k.cam([lerp(1.2, 0.4, kk), 2.0, 5.4], [0, 1.8, -3.3], 40); },
    night: (t, kk, a) => { k.only(ct); bread.visible = hat.visible = false; judge.pose('sittalk', t); all('idle', t); old.pose('idle', t); cop.pose('idle', t); ov = (ctx) => { dusk(ctx, 0.25); k.card(ctx, 'NEW YORK, 1930s', { t, at: a + 0.2, y: 200, bg: '#1d3557' }); };
      return k.cam([0, 2.6, 6.8], [0, 1.4, -2], 44); },
    case: (t, kk) => { k.only(ct); hat.visible = false; bread.visible = true; k.walk(old, [1.8, 0, 1.4], [0, 0, -1.2], E(seg(kk, 0, 0.7)), 'walk', t); if (kk > 0.7) { old.rotation.y = PI; old.pose('idle', t); } k.walk(cop, [2.6, 0, 1.6], [1.0, 0, -1.0], E(seg(kk, 0, 0.7)), 'walk', t); if (kk > 0.7) cop.pose('idle', t);
      bread.position.set(-1.6, 0.8, 0.6); judge.pose('sittalk', t); all('idle', t); ov = (ctx) => dusk(ctx); return k.cam([2.5, 1.6, 2.6], [0.3, 1.2, -0.6], 38); },
    why: (t, kk) => { k.only(ct); bread.visible = hat.visible = false; old.position.set(0, 0, -1.2); old.rotation.y = PI; old.pose('talk', t); judge.pose('sittalk', t); ov = (ctx) => { dusk(ctx, 0.3); k.vignette(ctx, 0.6); }; return k.close(old, { d: 1.5, side: 0.35, extra: { focus: [0.3, 0.75], blur: 9 } }); },
    law: (t, kk, a) => { k.only(ct); bread.visible = hat.visible = false; judge.pose('talk', t); old.pose('idle', t); ov = (ctx) => { dusk(ctx); money(ctx, t, a + 1.2, 'FINE: $10', 220, '#e8384f'); }; return k.cam([0.3, 1.5, -1.0], [0, 2.1, -3.6], 36, { focus: [0.3, 0.75], blur: 8 }); },
    pays: (t, kk, a) => { k.only(ct); bread.visible = hat.visible = false; judge.pose(kk < 0.6 ? 'pickup' : 'sittalk', t); old.pose('idle', t); ov = (ctx) => { dusk(ctx); money(ctx, t, a + 1.0, 'PAID BY THE JUDGE', 220); }; return k.cam([0.9, 2.1, -1.6], [0, 1.9, -3.6], 34); },
    room: (t, kk, a) => { k.only(ct); bread.visible = hat.visible = false; judge.pose('talk', t); all(kk > 0.5 ? 'hithead' : 'idle', t); old.pose('idle', t); ov = (ctx) => { dusk(ctx); money(ctx, t, a + 2.0, 'EVERYONE: 50¢', 220, '#c9a24a'); };
      return k.push(k.cam([0, 2.4, -2.4], [0, 1.3, 3], 44), k.cam([0, 2.0, -1.0], [0, 1.2, 3], 40), E(kk)); },
    hat: (t, kk, a) => { k.only(ct); bread.visible = false; hat.visible = true; const i = Math.min(G.length - 1, Math.floor(kk * G.length)), g = G[i]; hat.position.set(g.position.x + 0.35, 1.0, g.position.z - 0.25); G.forEach((p, j) => p.pose(j === i ? 'pickup' : 'idle', t)); old.pose('idle', t);
      const sum = (kk * 47.5).toFixed(2); ov = (ctx) => { dusk(ctx); k.counter(ctx, 'IN THE HAT', '$' + sum, { y: 190 }); }; return k.cam([3.4, 1.9, 4.6], [0, 1.0, 2.6], 40); },
    outro: (t, kk) => { k.only(ct); bread.visible = hat.visible = false; judge.pose('sittalk', t); all('idle', t); old.pose('idle', t); ov = (ctx) => { dusk(ctx); k.vignette(ctx, 0.5); }; return k.cam([lerp(0.4, 1.2, kk), 2.0, 5.4], [0, 1.8, -3.3], 40); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: '#3a2a20', over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('click', at('hook', 0.3), { gain: 0.5 }); kit.play('click', at('law', 1.0), { gain: 0.5 }); kit.play('ding', at('hat', 1.5), { f: 'E6', gain: 0.3 }); } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/Superhero_Male', 'humans/Superhero_Female', 'humans/ual1'] });
