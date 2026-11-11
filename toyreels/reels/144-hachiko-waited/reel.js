// 144 cinestory3d (story3d.js): Hachikō (true story). Scroll stopper: a dog alone on a station platform as a crowd walks past.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const st = k.station({ name: 'SHIBUYA' }), P = st.spots.platform, Y = 0.9;
  const dog = k.add(k.LIB.animal('dog', { h: 0.62 }), [P[0], Y, 1], PI / 2, st);
  const pup = k.add(k.LIB.animal('dog', { h: 0.32 }), [0, 0, 0], 0, st);
  const prof = k.add(k.LIB.human({ body: 'm', top: '#2b2d33', bottom: '#2b2d33', shoes: '#111', hair: '#3a3a3a', hairStyle: 'short' }), [0, 0, 0], 0, st);
  const CR = ['#7a8a99', '#a0522d', '#2f4f4f', '#5b4a7a', '#8b6c42', '#3e5a7a'].map((c, i) => k.add(k.LIB.human({ body: i % 2 ? 'f' : 'm', top: c, bottom: '#2a2a30', hair: ['#1a1210', '#3b2414', '#111'][i % 3], hairStyle: i % 2 ? (i % 4 === 1 ? 'bun' : 'long') : 'short' }), [0, 0, 0], 0, st));
  const statue = new T.Group(); st.add(statue); const ped = new T.Mesh(new T.BoxGeometry(1.0, 1.2, 1.4), M('#8f8a80', 0.8)); ped.position.y = 0.6; statue.add(ped);
  const sdog = k.LIB.animal('dog', { h: 0.62 }); sdog.position.y = 1.2; statue.add(sdog); sdog.traverse((n) => { if (n.isMesh) n.material = M('#6f5a3a', 0.35, 0.85); }); statue.position.set(-2.5, 0, 6); statue.rotation.y = PI / 3;
  const crowd = (t, n = 6, sp = 1.4) => CR.forEach((h, i) => { h.visible = i < n; const z = ((t * sp + i * 3.1) % 18) - 9; k.walk(h, [P[0] + (i % 3) * 0.7 - 1.4, Y, -9], [P[0] + (i % 3) * 0.7 - 1.4, Y, 9], (z + 9) / 18, 'walk', t + i); if (i % 2) { h.rotation.y += PI; h.position.z = -z; } });
  const reset = () => { pup.visible = prof.visible = statue.visible = false; CR.forEach((h) => { h.visible = false; }); dog.visible = true; };
  let ov = null; const snow = (ctx, t, a = 1) => { ctx.save(); ctx.fillStyle = `rgba(255,255,255,${0.85 * a})`; for (let i = 0; i < 140; i++) { const x = (i * 97 + Math.sin(t + i) * 30) % 720, y = (i * 53 + t * 120 * (1 + (i % 3) * 0.3)) % 1280; ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, 7); ctx.fill(); } ctx.restore(); };
  const rain = (ctx, t) => { ctx.save(); ctx.strokeStyle = 'rgba(200,220,255,0.55)'; ctx.lineWidth = 2; for (let i = 0; i < 160; i++) { const x = (i * 83) % 760 - 20, y = (i * 61 + t * 1400) % 1300 - 20; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 30); ctx.stroke(); } ctx.restore(); };
  const sit = (t) => { dog.position.set(P[0], Y, 1); dog.rotation.y = PI / 2; dog.pose('idle', t); };
  const shots = {
    hook: (t) => { reset(); k.only(st); sit(t); crowd(t); ov = (ctx) => snow(ctx, t, 0.7); return k.cam([P[0] + 3.2, 1.9, 3.4], [P[0], 1.2, 1], 38); },
    meet: (t, kk) => { reset(); k.only(st); dog.visible = false; prof.visible = pup.visible = true; k.walk(prof, [2, 0, 6], [2, 0, -4], kk * 0.5, 'walk', t); k.walk(pup, [2.8, 0, 6.3], [2.8, 0, -3.7], kk * 0.5, 'walk', t); ov = (ctx) => k.card(ctx, 'TOKYO, 1924', { t, at: 0.0, y: 200, bg: '#1d3557' });
      return k.cam([6, 1.6, 4], [2.3, 0.8, 2], 36, { sky: '#b9d9ef' }); },
    daily: (t, kk) => { reset(); k.only(st); prof.visible = true; k.walk(dog, [P[0], Y, 6], [P[0], Y, 0.6], E(seg(kk, 0, 0.6)), 'walk', t); if (kk > 0.6) dog.pose('idle', t); k.walk(prof, [P[0] + 0.3, Y, -5], [P[0] + 0.3, Y, -0.4], E(seg(kk, 0.2, 0.9)), 'walk', t); if (kk > 0.9) prof.pose('idle', t);
      ov = (ctx) => k.tint(ctx, '#ff9a3c', 0.12); return k.cam([P[0] + 4, 2.0, 4], [P[0], 1.4, 0], 38, { sky: '#f2b47a' }); },
    gone: (t, kk) => { reset(); k.only(st); sit(t); ov = (ctx) => { k.tint(ctx, '#0b1630', 0.25); k.card(ctx, '1925', { t: kk * 10, at: 0.5, y: 200, bg: '#333' }); }; return k.close(dog, { d: 3.2, side: -1.2, h: 2.2, look: 0.4, fov: 40 }); },
    wait: (t, kk) => { reset(); k.only(st); sit(t); const d = Math.min(3, 1 + Math.floor(kk * 3)); ov = (ctx) => { k.tint(ctx, '#0b1630', 0.2); k.counter(ctx, 'EVENING', 'DAY ' + d, { y: 180 }); }; return k.close(dog, { d: 1.6, side: 0.4 + d * 0.5, h: 1.0, look: 0.6 }); },
    years: (t, kk) => { reset(); k.only(st); sit(t); crowd(t, 4, 2.4); const y = 1 + Math.floor(kk * 9.9), sea = Math.floor(kk * 12) % 3; ov = (ctx) => { if (sea === 0) rain(ctx, t); if (sea === 2) snow(ctx, t); k.counter(ctx, 'STILL WAITING', y + (y === 1 ? ' YEAR' : ' YEARS'), { y: 180 }); };
      return k.cam([P[0] + 3, 2.4, 5], [P[0], 1.2, 1], 38); },
    famous: (t, kk) => { reset(); k.only(st); sit(t); CR.slice(0, 3).forEach((h, i) => { h.visible = true; h.position.set(P[0] + 0.9 * Math.cos(i * 1.2), Y, 1 + 0.9 * Math.sin(i * 1.2) + 0.4); h.rotation.y = Math.atan2(P[0] - h.position.x, 1 - h.position.z); h.pose(i ? 'idle' : 'pickup', t); });
      statue.visible = kk > 0.55; ov = (ctx) => { if (kk > 0.55) k.card(ctx, 'STATUE, 1934', { t: kk * 10, at: 5.6, y: 200, bg: '#c9a24a' }); }; return kk > 0.55 ? k.close(sdog, { d: 3, h: 1.4, look: 0.3, side: 0.6 }) : k.close(dog, { d: 2.8, side: 0.5, h: 1.5, look: 0.5 }); },
    end: (t, kk) => { reset(); k.only(st); dog.position.set(P[0], Y, 1); dog.rotation.y = PI / 2; dog.pose('headlow', t * 0.5); ov = (ctx) => { k.tint(ctx, '#0b1630', 0.45); snow(ctx, t, 0.5); k.vignette(ctx, 0.7); }; return k.cam([P[0] + 2.2, 1.5, 2.4], [P[0], 1.0, 1], 36, { focus: [0.3, 0.75], blur: 8 }); },
    outro: (t, kk) => { reset(); k.only(st); dog.visible = false; statue.visible = true; crowd(t); return k.cam([lerp(1.5, 0.5, kk), 1.7, 10.5], [-2.5, 1.4, 6], 40, { sky: '#b9d9ef' }); },
  };
  return { shots, sky: '#9ab0c8', over: (ctx) => { if (ov) ov(ctx); }, score: (kit, at) => { kit.play('ding', at('famous', 2.5), { f: 'C6', gain: 0.25 }); } };
}, { assets: ['animals/dog', 'humans/Superhero_Male', 'humans/Superhero_Female', 'humans/ual1'] });
