// re-render: character flicker fix (13 Nov 2026)
// 169 cinestory3d (story3d.js): Border Collie 'eye' and whistle commands (ISDS; Strömbom 2014). Scroll stopper: a crouched dog staring down a whole flock.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fm = k.farm();
  const dog = k.add(k.LIB.animal('dog', { h: 0.55 }), [0, 0, 0], 0, fm); dog.traverse((n) => { if (n.isMesh && n.material && n.material.color) { n.material = n.material.clone(); n.material.color.lerp(new T.Color('#151515'), 0.55); } });
  const farmer = k.add(k.LIB.human({ body: 'm', top: '#4a6a3a', bottom: '#3a3a3a', hair: '#888' }), [-6, 0, 9], 0.6, fm);
  const N = 16, flock = []; for (let i = 0; i < N; i++) flock.push(k.add(k.LIB.animal('sheep', { h: 0.95 }), [0, 0, 0], 0, fm));
  const gate = new T.Group(); fm.add(gate); gate.position.set(9, 0, -2); [-1.2, 1.2].forEach((z) => { const p = new T.Mesh(new T.BoxGeometry(0.2, 1.4, 0.2), M('#5a3a22')); p.position.set(0, 0.7, z); gate.add(p); });
  const home = (i, spread, cx, cz) => [cx + Math.cos(i * 2.399) * spread * Math.sqrt(i / N), 0, cz + Math.sin(i * 2.399) * spread * Math.sqrt(i / N)];
  const herd = (t, cx, cz, spread, face, move = 'eat') => flock.forEach((s, i) => { const p = home(i, spread, cx, cz); s.position.set(p[0], 0, p[2]); s.rotation.y = face + Math.sin(i) * 0.3; s.pose(move, t + i); });
  let ov = null; const whistle = (ctx, txt) => { ctx.save(); ctx.font = '900 34px Nunito, Arial'; ctx.fillStyle = '#ffd23f'; ctx.textAlign = 'center'; ctx.fillText('♪ ' + txt + ' ♪', 360, 300); ctx.restore(); };
  const base = () => { k.only(fm); dog.visible = farmer.visible = true; farmer.pose('idle', 0); };
  const shots = {
    hook: (t, kk) => { base(); herd(t, 2, 1, 4, -PI / 2, 'idle'); dog.position.set(-1.6, 0, 1); dog.rotation.y = PI / 2; dog.pose('headlow', t); return k.cam([-3.4, 0.8, -0.2], [0.6, 0.4, 1.4], 40, { sky: fm.sky }); },
    field: (t, kk) => { base(); herd(t, 0, 2, 9, 0); dog.position.set(-6.6, 0, 9.4); dog.rotation.y = 0.6; dog.pose('idle', t); return k.cam([-3, 9, 20], [0, 0, 2], 46, { sky: fm.sky }); },
    whistle: (t, kk) => { base(); herd(t, 0, 2, 9, 0); const a = lerp(PI * 0.7, -PI * 0.2, E(kk)); dog.position.set(Math.cos(a) * 11, 0, 2 + Math.sin(a) * 11); dog.rotation.y = -a; dog.pose('gallop', t); ov = (ctx) => whistle(ctx, 'COME-BYE'); return k.cam([-3, 9, 20], [0, 0, 2], 46, { sky: fm.sky }); },
    eye: (t, kk) => { base(); herd(t, 1, 1, 5, -PI / 2, 'idle'); dog.position.set(-3, 0, 1); dog.rotation.y = PI / 2; dog.pose('headlow', t); ov = (ctx) => k.card(ctx, 'THE EYE 👀', { y: 200, bg: '#1d3557' }); return k.close(dog, { d: 1.4, side: 0.2, h: 0.5, look: 0.5 }); },
    move: (t, kk) => { base(); herd(t, lerp(1, 5, kk), 1, lerp(5, 3.5, kk), PI / 2 - 0.3, 'walk'); dog.position.set(lerp(-3, 1, kk), 0, 1); dog.rotation.y = PI / 2; dog.pose('walkslow', t); return k.cam([1, 7, 13], [2, 0, 1], 46, { sky: fm.sky }); },
    commands: (t, kk) => { base(); herd(t, 4, 0, 3.5, PI / 2, 'idle'); const cmd = ['GO LEFT', 'GO RIGHT', 'STOP', 'WALK ON'][Math.min(3, Math.floor(kk * 4))]; dog.position.set(0.5 + Math.sin(kk * 12) * 1.5, 0, 0 + Math.cos(kk * 12) * 0.6); dog.rotation.y = PI / 2; dog.pose(cmd === 'STOP' ? 'idle' : 'gallop', t); farmer.pose('talk', t);
      ov = (ctx) => whistle(ctx, cmd); return k.cam([-5, 2.4, 10], [2, 0.6, 1], 42, { sky: fm.sky }); },
    gate: (t, kk) => { base(); flock.forEach((s, i) => { const u = Math.min(1, Math.max(0, kk * 1.6 - i * 0.04)); s.position.set(lerp(home(i, 3.5, 5, 0)[0], 11 + i * 0.3, u), 0, lerp(home(i, 3.5, 5, 0)[2], -2 + Math.sin(i) * 0.5, u)); s.rotation.y = PI / 2; s.pose('walk', t + i); }); dog.position.set(lerp(2, 6, kk), 0, 0.4); dog.rotation.y = PI / 2; dog.pose('walkslow', t);
      return k.cam([6, 6, 10], [9, 0, -1], 44, { sky: fm.sky }); },
    outro: (t, kk) => { base(); herd(t, 2, 1, 4, -PI / 2, 'idle'); dog.position.set(-1.6, 0, 1); dog.rotation.y = PI / 2; dog.pose('headlow', t); ov = (ctx) => k.big(ctx, 'JUST THE STARE.', { y: 240, size: 64, col: '#ffd23f' }); return k.cam([-3.4, 0.8, -0.2], [0.6, 0.4, 1.4], 40, { sky: fm.sky }); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: fm.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'animals/dog', 'animals/sheep', 'humans/Superhero_Male', 'humans/ual1', 'props/hay', 'buildings/cottage', 'buildings/village_house', 'buildings/house_v2', 'buildings/well', 'buildings/fence', 'nature/tree_oak', 'nature/tree_maple'] });
