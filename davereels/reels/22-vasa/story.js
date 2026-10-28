  // Dave reel 22: the Vasa (Stockholm, 1628). Too many guns up high, too little ballast down low: the stability test
  // failed after three runs and she sailed anyway. Dave runs lap four and gets catapulted off the deck. R.I.P. Dave #21.
  const WOOD = [150, 96, 58], DARK = [96, 60, 38], GOLD = [230, 182, 70], SAIL = [244, 236, 214], WATER = [52, 110, 170];
  const sea = (S) => S.quad([[-400, 0, -400], [400, 0, -400], [400, 0, 60], [-400, 0, 60]], WATER, { bg: true, flat: false });
  // the ship along x, waterline at y = 0. o.roll (rad, around x), o.sink (metres down), o.x (sailing), o.ports (gunports open)
  const ship = (S, o = {}) => {
    const roll = o.roll || 0, T = (p) => add(rotX(p, roll), [o.x || 0, -(o.sink || 0), 0]);
    const ports = (c, w, h) => { c.fillStyle = '#1c140e'; for (const row of [0.3, 0.68]) for (let i = 0; i < 16; i++) c.fillRect(w * (0.08 + i * 0.053), h * row, w * 0.025, h * 0.14); c.fillStyle = '#e8b84a'; c.fillRect(0, h * 0.05, w, h * 0.04); };
    S.box((p) => T(add(p, [0, -0.35, 0])), 3.6, 0.55, 0.85, DARK, { bevel: 0.2 });
    S.box((p) => T(add(p, [0, 0.55, 0])), 3.9, 0.45, 0.95, WOOD, { bevel: 0.1, paint: ports });
    S.box((p) => T(add(p, [-3.4, 1.45, 0])), 0.8, 0.5, 0.9, WOOD, { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#e8b84a'; c.fillRect(w * 0.1, h * 0.2, w * 0.8, h * 0.12); } });
    S.box((p) => T(add(p, [-3.4, 2.0, 0])), 0.85, 0.06, 0.95, GOLD, { bevel: 0.2 });
    S.box((p) => T(add(p, [4.1, 0.75, 0])), 0.5, 0.12, 0.3, WOOD, { bevel: 0.2 });
    for (const [x, h] of [[-1.8, 5.2], [0.6, 6.2], [2.8, 4.6]]) {
      S.cyl((p) => T(add(p, [x, 1.0, 0])), 0.07, h, DARK, 8);
      for (const [y, w] of [[h * 0.45, 0.95], [h * 0.8, 0.7]]) S.quad([T([x, 1.0 + y - 0.6, -w]), T([x, 1.0 + y - 0.6, w]), T([x, 1.0 + y + 0.6, w * 0.85]), T([x, 1.0 + y + 0.6, -w * 0.85])], SAIL);
    }
    return T;
  };
  const OUTSIDE = { bg: sunsetSky, dof: 0, shadows: false };
  const gust = (ctx, W, H_, t, a) => { if (a <= 0) return; ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.75 * a})`; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (let i = 0; i < 5; i++) { const y = H_ * (0.3 + i * 0.05), x = ((t * 500 + i * 170) % (W + 300)) - 150; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 60, y - 20, x + 140, y); ctx.stroke(); } ctx.restore(); };
  makeDave({
    rip: { n: 21, cause: 'cause of death:\nlap four' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: sea, render: OUTSIDE, cam: { orbit: [[0, 0, 0], 17, 14, 4.5, 3.5, 0.9, 0.5, [0, 2.0, 0]] },
        build: (S, t) => ship(S, { x: -2 + t * 0.35, roll: 0.03 * Math.sin(t * 1.4) }),
        tags: [['VASA · 1628', V('hook', 'sixteen'), 0.16], ['SAILED: 1,300 m', V('hook', 'sailed'), 0.24, { col: '#ffd24a' }]] },
      // the cross-section on the red stand: guns stacked high, the centre of gravity climbing above the waterline
      build: { set: 'garage', cam: { orbit: [[0, 0, 0], 5.2, 4.6, 1.7, 1.6, 0.2, -0.05, [0, 1.6, 0]] },
        build: (S, t) => {
          stand(S, [0, 0, 0], 0.6, 0.45, 0.6);
          const k = H.clamp((t - V('build', 'second')) / 1.2);
          S.box((p) => add(p, [0, 0.85, 0]), 0.55, 0.22, 0.4, DARK, { bevel: 0.2 });
          S.box((p) => add(p, [0, 1.25, 0]), 0.6, 0.18, 0.42, WOOD, { bevel: 0.1 });
          if (k > 0) S.box((p) => add(p, [0, 1.25 + 0.36 * H.ease.back(k), 0]), 0.6, 0.18, 0.42, WOOD, { bevel: 0.1 });
          for (const [y, on] of [[1.25, 1], [1.61, k]]) if (on > 0.5) for (const sx of [-1, 1]) for (const z of [-0.2, 0.2]) S.rod([sx * 0.45, y, z], [sx * 0.75, y + 0.02, z], 0.04, [40, 40, 46], 8);
          S.box((p) => add(p, [0, 0.7, 0]), 0.2, 0.04, 0.2, [120, 120, 128], { bevel: 0.2 }); // the thin layer of ballast stones
        },
        over: (ctx, W, H_, t, u, S) => { const y = 0.95 + 0.6 * H.clamp((t - V('build', 'second')) / 1.6), p = S.proj([0, y, 0.45]); ctx.save(); ctx.fillStyle = '#ffd24a'; ctx.strokeStyle = '#1a1820'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 30, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#1a1820'; ctx.font = FONT(800, 30); ctx.textAlign = 'center'; ctx.fillText('CG', p[0], p[1] + 10); ctx.restore(); },
        tags: [['64 CANNONS', V('build', 'Sixty-four'), 0.16], ['BALLAST: NOT ENOUGH', V('build', 'ballast'), 0.24, { col: '#ff6a5a' }]] },
      // the dockside stability test: thirty sailors (crew dummies) run side to side, the ship rolls more each run
      test: { set: sea, render: OUTSIDE, cam: { orbit: [[0, 0, 0], 9.5, 8.5, 3.2, 2.6, 0.15, -0.1, [0, 1.4, 0]] },
        build: (S, t) => { const roll = 0.09 * Math.sin((t - BEAT0('test')) * 2.2) * Math.min(1, 0.4 + (t - BEAT0('test')) * 0.12); ship(S, { roll }); },
        crew: (t) => { const ph = (t - BEAT0('test')) * 2.2, z = 0.6 * Math.sin(ph), roll = 0.09 * Math.sin(ph); return [-2.4, -1.2, 0, 1.2, 2.2].map((x, i) => ({ who: i % 2 ? 'intern' : 'engineer', pos: add(rotX([x, 1.0, z], roll), [0, 0, 0]), pose: 'walk', s: 0.55, yaw: Math.cos(ph) > 0 ? 0 : Math.PI, roll: -roll })); },
        tags: [['30 MEN · 3 RUNS', V('test', 'thirty'), 0.16], ['TEST STOPPED', V('test', 'stopped'), 0.24, { col: '#ff6a5a' }], ['SAILED ANYWAY', V('test', 'sailed'), 0.32, { col: '#ffd24a' }]] },
      // the sinking: no people on screen, just the ship heeling over and water flooding the low gunports
      sink: { set: sea, render: OUTSIDE, cam: { orbit: [[0, 0, 0], 15, 13, 3.5, 3.0, -0.4, -0.65, [0, 1.6, 0]] },
        build: (S, t) => { const k = H.clamp((t - V('sink', 'tipped')) / 4.5); ship(S, { roll: -0.15 - 0.9 * H.ease.inOut(k), sink: 3.2 * Math.max(0, k - 0.35) }); },
        over: (ctx, W, H_, t) => gust(ctx, W, H_, t, ramp(t, V('sink', 'light') - 0.2, 0.3) * (1 - ramp(t, V('sink', 'Water'), 0.4))),
        tags: [['GUNPORTS OPEN', V('sink', 'gunports'), 0.16], ['ABOUT 30 DIED', V('sink', 'About'), 0.24, { bg: 'rgba(20,20,28,0.85)' }]] },
      // Dave insists on lap four: the deck rolls, he keeps running, the rail flicks him into the sky
      end: { set: sea, render: OUTSIDE, cam: { orbit: [[-0.6, 0, 0], 6.5, 7.5, 2.4, 3.2, -0.15, 0.1, [0, 2.0, 0]] },
        build: (S, t) => { const t0 = BEAT0('end'); const k = H.clamp((t - V('end', 'Dave') + 0.3) / 0.6); ship(S, { roll: -0.3 * k * Math.sin(Math.max(0, t - V('end', 'Dave') + 0.3) * 4) }); },
        dave: (t) => { const t0 = V('end', 'asked'), u = H.clamp((t - t0) / 1.1); return { pos: [-0.6, 1.0, -0.5 + 0.9 * H.clamp((t - BEAT0('end')) / 1.5)], pose: 'walk', t, s: 0.7, yaw: 0, death: u > 0 ? 'launch' : undefined, u, to: [-5, 1.5, -3], arc: 2.2, mouth: u > 0 ? 1 : 0.3 }; },
        tags: [['LAP 4', V('end', 'fourth') - 0.1, 0.16, { col: '#ffd24a', px: 48 }]] },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0, { dur: BEAT0('build'), color: 'pink', filter: 'lowpass', f: 500, gain: 0.08, a: 0.4, minor: true }); // the sea
      k.play('stamp', V('build', 'Sixty-four'), { gain: 0.4 });
      for (let i = 0; i < 6; i++) k.play('thud', BEAT0('test') + 0.2 + i * 0.7, { f: 90, gain: 0.25, minor: true }); // running feet
      k.play('error', V('test', 'stopped'), { gain: 0.3 }); k.play('ding', V('test', 'sailed'), { gain: 0.3 });
      k.noise(V('sink', 'light'), { dur: 1.2, color: 'pink', filter: 'bandpass', f: 900, q: 0.6, gain: 0.2, a: 0.2 }); // the gust
      k.noise(V('sink', 'Water'), { dur: 3, color: 'brown', filter: 'lowpass', f: 600, gain: 0.25, a: 0.2 });
      k.play('jump', V('end', 'asked'), { gain: 0.5 }); k.play('swish', V('end', 'asked') + 0.2, { dur: 0.8, gain: 0.5 });
    },
  });
