// 171 cinestory3d (story3d.js): Uranus's 98° tilt (NASA; Kegerreis 2018). Scroll stopper: a planet smashing into Uranus and knocking it over.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const sp = k.space();
  const ur = k.planet({ r: 2, color: '#4fb8c9', color2: '#3b9fb3', bands: 3, rings: 'thin', ringColor: '#a9c6cc' }); sp.add(ur);
  const axis = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 6, 8), new T.MeshBasicMaterial({ color: '#ffd23f', toneMapped: false })); ur.add(axis);
  const rock = new T.Mesh(new T.DodecahedronGeometry(1.0, 1), M('#7a5a4a', 0.9)); sp.add(rock);
  const sun = new T.Mesh(new T.SphereGeometry(3, 40, 30), new T.MeshBasicMaterial({ color: '#ffd27a', toneMapped: false })); sun.position.set(-40, 0, -30); sp.add(sun);
  const er = k.planet({ r: 1.2, color: '#2f6fc8' }); er.position.set(-6, 0, -5); sp.add(er); const ju = k.planet({ r: 1.1, color: '#d8b48a', color2: '#b98a5e', bands: 7 }); ju.position.set(6, 0, -5); sp.add(ju);
  let ov = null; const tilt = (a) => { ur.rotation.set(0, 0, a); };
  const base = (t) => { k.only(sp); rock.visible = false; er.visible = ju.visible = false; ur.position.set(0, 0, 0); ur.body.rotation.y = t * 0.6; };
  const shots = {
    hook: (t, kk) => { base(t); const u = seg(kk, 0, 0.5); rock.visible = u < 1; rock.position.set(lerp(-12, -2.2, u), lerp(6, 0.8, u), 0); tilt(lerp(0.05, 1.71, E(seg(kk, 0.45, 1)))); ov = (ctx) => { if (kk > 0.45 && kk < 0.6) k.tint(ctx, '#fff', 0.6 * (1 - (kk - 0.45) / 0.15)); }; return k.cam([0, 1, 13], [0, 0, 0], 44, { sky: sp.sky, focus: [0.05, 0.95], blur: 1 }); },
    tilt: (t, kk) => { base(t); er.visible = ju.visible = true; er.rotation.z = 0.41; ju.rotation.z = 0.05; tilt(1.71); ov = (ctx) => k.counter(ctx, 'TILT', '98°', { y: 190 }); return k.cam([0, 1.5, 16], [0, 0, -2], 44, { sky: sp.sky, focus: [0.05, 0.95], blur: 1 }); },
    roll: (t, kk) => { base(t); tilt(1.71); const a = kk * PI * 0.6; ur.position.set(-40 + Math.cos(a) * 30, 0, -30 + Math.sin(a) * 30); return k.cam([-40, 30, 10], [-40, 0, -30], 50, { sky: sp.sky, focus: [0.05, 0.95], blur: 1 }); },
    impact: (t, kk) => { base(t); const u = seg(kk, 0, 0.6); rock.visible = true; rock.scale.setScalar(1.4); rock.position.set(lerp(-14, -2.4, u), lerp(5, 0.6, u), 0); tilt(lerp(0.05, 1.71, E(seg(kk, 0.55, 1)))); ov = (ctx) => k.card(ctx, '~2× EARTH', { y: 200, bg: '#c8501e' }); return k.cam([3, 2, 12], [-2, 0, 0], 44, { sky: sp.sky, focus: [0.05, 0.95], blur: 1 }); },
    seasons: (t, kk) => { base(t); tilt(1.71); ov = (ctx) => { k.card(ctx, '42 YEARS DAY', { y: 190, bg: '#e0a020' }); k.card(ctx, '42 YEARS NIGHT', { y: 300, bg: '#1d3557' }); }; return k.cam([12, 0.5, 4], [0, 0, 0], 40, { sky: sp.sky, focus: [0.05, 0.95], blur: 1 }); },
    rings: (t, kk) => { base(t); tilt(1.71); return k.cam([lerp(2, 6, kk), 1, 7], [0, 0, 0], 40, { sky: sp.sky, focus: [0.05, 0.95], blur: 1 }); },
    cold: (t, kk) => { base(t); tilt(1.71); ov = (ctx) => k.big(ctx, '-224°C', { y: 240, size: 110, col: '#9fe8ff' }); return k.cam([2.5, 0.4, 7], [0, 0.6, 0], 38, { sky: sp.sky, focus: [0.05, 0.95], blur: 1 }); },
    outro: (t, kk) => { base(t); tilt(1.71 + Math.sin(t * 2) * 0.02); ov = (ctx) => k.big(ctx, 'NEVER GOT UP.', { y: 240, size: 70, col: '#ffd23f' }); return k.cam([0, 1, 13], [0, 0, 0], 44, { sky: sp.sky, focus: [0.05, 0.95], blur: 1 }); },
  };
  return { shots, sky: sp.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('pop', at('hook', 1.4), { gain: 0.5 }); kit.play('pop', at('impact', 2.6), { gain: 0.5 }); } };
}, { assets: [] });
