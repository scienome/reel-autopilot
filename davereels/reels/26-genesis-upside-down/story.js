  // Dave reel 26: NASA's Genesis capsule (2004). The gravity switch that should open the parachute was installed upside
  // down and the test that would have caught it was skipped. Dave is the backup parachute. R.I.P. Dave #25.
  const SHELL = [220, 222, 228], HEAT = [120, 80, 60], CELL = [70, 110, 190];
  // the capsule: a flat cone saucer (heat shield down), y = height of its rim. open 0..1 lifts the lid on the collectors
  const capsule = (S, c, o = {}) => {
    const s = o.s || 1, T = (p) => add(rotZ(rotX(mul(p, s), o.tilt || 0), o.roll || 0), c), n = 16;
    for (let i = 0; i < n; i++) { const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU, P = (r, y, a) => T([r * Math.sin(a), y, r * Math.cos(a)]);
      S.face([P(0.9, 0, a0), P(0.9, 0, a1), P(0.15, -0.35, a1), P(0.15, -0.35, a0)], HEAT, { c: T([0, -0.1, 0]) });
      if (!o.open) S.face([P(0.9, 0, a0), P(0.9, 0, a1), P(0.25, 0.4, a1), P(0.25, 0.4, a0)], o.cracked && i % 5 === 0 ? [60, 60, 66] : SHELL, { c: T([0, 0.1, 0]) }); }
    if (o.open) { S.cyl((p) => T(p), 0.85, 0.06, [200, 200, 210], 16); for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j < 6) S.box((p) => T(add(p, [i * 0.3, 0.1, j * 0.3])), 0.13, 0.02, 0.13, CELL, { bevel: 0.2, glow: true }); }
  };
  const dust = (ctx, S, at, t, t0) => { const k = (t - t0); if (k < 0 || k > 2.5) return; const p = S.proj(at), r = 40 + 220 * Math.min(1, k * 1.5); ctx.save(); ctx.globalAlpha = 0.75 * (1 - k / 2.5); ctx.fillStyle = '#e8c89a'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(p[0] + Math.cos(i * 0.9) * r * 0.6, p[1] - Math.abs(Math.sin(i * 1.3)) * r * 0.4, r * 0.35, 0, TAU); ctx.fill(); } ctx.restore(); };
  const fallY = (t, t0, h, d) => h * (1 - H.clamp((t - t0) / d) ** 2);
  makeDave({
    rip: { n: 25, cause: 'cause of death:\ninstalled upside down' },
    shots: ({ V, BEAT0 }) => ({
      // the hook: it drops out of the sky and slams into the Utah desert
      hook: { set: 'desert', cam: { orbit: [[0, 0, 0], 9, 8, 1.4, 1.2, 0.3, 0.15, [0, 1.6, 0]] },
        build: (S, t) => { const y = Math.max(0.35, fallY(t, 0, 14, 1.1)); capsule(S, [0, y, 0], { tilt: 0.2, cracked: t > 1.1, s: 1.2 }); },
        over: (ctx, W, H_, t, u, S) => dust(ctx, S, [0, 0.2, 0], t, 1.1), flash: [1.1], shake: 1.1,
        tags: [['GENESIS · 2004', 0.2, 0.15], ['~310 km/h', V('hook', 'three'), 0.22, { col: '#ff6a5a', px: 46 }]] },
      // deep space: the lid open, collector tiles glowing as solar wind streams in
      mission: { set: 'space', cam: { orbit: [[0, 0, 0], 4.2, 3.6, 2.2, 1.6, 0.4, -0.2, [0, 0, 0]] },
        build: (S, t) => { capsule(S, [0, 0, 0], { open: t < V('mission', 'home') }); if (t < V('mission', 'home')) for (let j = -2; j <= 2; j++) S.beads([[-6, 3, j * 0.4], [0, 0.2, j * 0.3]], [255, 220, 120], t * 2 + j * 0.2, { spacing: 0.25, r: 0.04 }); },
        tags: [['SOLAR WIND', V('mission', 'solar'), 0.15, { col: '#ffd24a' }], ['PARACHUTE: PLANNED', V('mission', 'parachute'), 0.22]] },
      // the lab: a giant model of the g-switch (a weight on a spring, contact below); it flips upside down
      switch: { set: 'lab', setOpt: { board: ['UP = ↑', 'check: skipped', 'what could go wrong'] }, cam: { orbit: [[0, 0, 0], 3.4, 3.0, 1.5, 1.4, -0.3, 0.15, [0, 1.25, 0]] },
        crew: (t) => [{ who: 'engineer', pos: [1.3, 0, 0.2], pose: t > V('switch', 'skipped') ? 'thumbs' : 'point', yaw: -0.7 }],
        build: (S, t) => { const f = ramp(t, V('switch', 'upside') - 0.2, 0.6) * Math.PI, T = (p) => add(rotZ(p, f), [0, 1.25, 0]);
          S.box((p) => T(p), 0.35, 0.45, 0.25, [230, 230, 236], { bevel: 0.1, alpha: 0.35 });
          S.box((p) => T(add(p, [0, -0.38, 0])), 0.25, 0.04, 0.2, [216, 70, 52], { bevel: 0.2, glow: true });
          const sp = 0.12 + 0.04 * Math.sin(t * 9); S.tube([0, 1, 2, 3, 4, 5, 6].map((i) => T([0.08 * (i % 2 ? 1 : -1), 0.4 - (i / 6) * sp * 2, 0])), 0.012, [200, 200, 210], 6);
          S.box((p) => T(add(p, [0, 0.38 - sp * 2 - 0.06, 0])), 0.12, 0.06, 0.12, [60, 60, 70], { bevel: 0.2 }); },
        over: (ctx, W, H_, t, u, S) => { const f = ramp(t, V('switch', 'upside') - 0.2, 0.6) * Math.PI, p = S.proj(add(rotZ([0, 0.62, 0.26], f), [0, 1.25, 0])); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-f); ctx.fillStyle = '#1a1820'; ctx.font = FONT(800, 34); ctx.textAlign = 'center'; ctx.fillText('↑ UP', 0, 0); ctx.restore(); },
        tags: [['G-SWITCH', V('switch', 'gravity'), 0.15], ['UPSIDE DOWN', V('switch', 'upside'), 0.22, { col: '#ff6a5a' }], ['TEST: SKIPPED', V('switch', 'skipped'), 0.29, { col: '#ffd24a' }]] },
      // falling past the camera with no parachute, then the dent in the desert; scientist dummies pick up the pieces
      crash: { set: 'desert', cam: { orbit: [[0, 0, 0], 8, 7, 1.6, 1.3, -0.3, -0.5, [0, 1.4, 0]] },
        build: (S, t) => { const t0 = BEAT0('crash'), y = Math.max(0.3, fallY(t, t0, 12, 1.0)); capsule(S, [0, y, 0], { tilt: 0.3, cracked: y <= 0.31 }); if (t > V('crash', 'Scientists')) for (let i = 0; i < 3; i++) S.box((p) => add(p, [-1.2 + i * 0.3, 0.05, 1.0]), 0.1, 0.02, 0.1, CELL, { glow: true }); },
        crew: (t) => (t > V('crash', 'Scientists') ? [{ who: 'scientist', pos: [-1.6, 0, 1.2], pose: 'carry', yaw: 0.6 }] : []),
        over: (ctx, W, H_, t, u, S) => dust(ctx, S, [0, 0.2, 0], t, BEAT0('crash') + 1.0), flash: [BEAT0('crash') + 1.0], shake: BEAT0('crash') + 1.0,
        tags: [['NO PARACHUTE', V('crash', 'No'), 0.15, { col: '#ff6a5a' }], ['SOME SAMPLES SAVED', V('crash', 'saved'), 0.22, { col: '#7ee07a' }]] },
      // Dave spread-eagled on the lid like a human parachute, falling. He is not a parachute.
      end: { set: 'desert', cam: { orbit: [[0, 0, 0], 6, 6.5, 1.0, 1.1, 0.6, 0.4, [0, 2.4, 0]] },
        build: (S, t) => { const y = Math.max(0.3, fallY(t, BEAT0('end') - 0.2, 9, V('end', 'parachute') + 0.25 - BEAT0('end'))); capsule(S, [0, y, 0], { tilt: 0.1 }); },
        dave: (t) => { const ti = V('end', 'parachute') + 0.05, y = Math.max(0.3, fallY(t, BEAT0('end') - 0.2, 9, ti + 0.2 - BEAT0('end'))) + 0.45, u = H.clamp((t - ti - 0.2) / 0.15); return { pos: [0, y, 0], pose: 'flail', t, death: u > 0 ? 'squash' : undefined, u, mouth: 1, xeyes: u > 0.5 }; },
        over: (ctx, W, H_, t, u, S) => dust(ctx, S, [0, 0.2, 0], t, V('end', 'parachute') + 0.25), shake: V('end', 'parachute') + 0.25 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.play('whoosh', 0, { dur: 1.1, gain: 0.5 }); k.play('impact', 1.1, { gain: 0.8 });
      k.play('sparkle', V('mission', 'solar'), { gain: 0.3 });
      k.play('click', V('switch', 'gravity'), { gain: 0.4 }); k.play('error', V('switch', 'upside'), { gain: 0.35 }); k.play('stamp', V('switch', 'skipped'), { gain: 0.5 });
      k.play('whoosh', BEAT0('crash'), { dur: 1.0, gain: 0.5 }); k.play('impact', BEAT0('crash') + 1.0, { gain: 0.8 }); k.play('success', V('crash', 'saved'), { gain: 0.3 });
      k.play('whoosh', BEAT0('end') - 0.2, { dur: 1.2, gain: 0.5 }); k.play('impact', V('end', 'parachute') + 0.25, { gain: 0.8 }); k.play('slap', V('end', 'parachute') + 0.27, { gain: 0.5 });
    },
  });
