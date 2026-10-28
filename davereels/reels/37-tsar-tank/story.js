  // Dave reel 37: the Tsar Tank (Lebedenko, 1915). Two 9 m front wheels and a small rear wheel that carried too much of
  // the weight: it sank on the first trial and never came out. Dave pushes from behind. R.I.P. Dave #36.
  const IRON = [96, 100, 92], HULL = [110, 118, 96];
  // the tank along +x (front at +x): two 9 m spoked wheels at the front, a hull, a tail boom and a small rear wheel.
  // spin = front wheel angle; sink = how deep the rear wheel is stuck; o.x shifts it along the road
  const tsar = (S, o = {}) => {
    const x0 = o.x || 0, sink = o.sink || 0, sp = o.spin || 0, R = 4.5, ang = Math.atan2(sink, 8.5), T = (p) => add(rotZ(sub(p, [x0 + 2, R, 0]), -ang), [x0 + 2, R, 0]);
    for (const z of [-1.6, 1.6]) { S.tube(Array.from({ length: 21 }, (_, i) => T([x0 + 2 + R * Math.cos((i / 20) * TAU), R + R * Math.sin((i / 20) * TAU), z])), 0.12, IRON, 6);
      for (let i = 0; i < 8; i++) { const q = (i / 8) * TAU + sp; S.rod(T([x0 + 2, R, z]), T([x0 + 2 + R * Math.cos(q), R + R * Math.sin(q), z]), 0.07, IRON, 6); } }
    S.box((p) => T(add(p, [x0 + 2, R, 0])), 0.9, 0.5, 1.5, HULL, { bevel: 0.1 }); S.box((p) => T(add(p, [x0 + 2, R + 0.8, 0])), 0.4, 0.3, 0.4, HULL, { bevel: 0.2 });
    S.box((p) => T(add(rotZ(p, -0.48), [x0 - 2.0, R - 2.1, 0])), 4.6, 0.22, 0.3, HULL, { bevel: 0.1 });
    S.cyl((p) => T(add(rotX(p, Math.PI / 2), [x0 - 6.4, 0.75, -0.35])), 0.75, 0.7, IRON, 12, { cap: shade(IRON, 1.1) });
  };
  const trench = (S, x) => S.quad([[x - 1.2, 0.01, -8], [x + 1.2, 0.01, -8], [x + 1.2, 0.01, 8], [x - 1.2, 0.01, 8]], [70, 54, 40], { bg: true });
  const FOREST = { bg: sunsetSky, dof: 0, shadows: true };
  makeDave({
    rip: { n: 36, cause: 'cause of death:\nreverse gear' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'road', render: FOREST, cam: { orbit: [[0, 0, 0], 17, 15, 2.5, 2.2, 0.8, 0.6, [0, 4, 0]] },
        build: (S, t) => tsar(S, { x: -2 + t * 0.4, spin: -t * 0.25 }),
        crew: (t) => [{ who: 'general', pos: [4 + t * 0.4, 0, 3], pose: 'salute', yaw: 0.6 }],
        tags: [['RUSSIA · 1915', 0.2, 0.15], ['9 m WHEELS', V('hook', 'nine'), 0.22, { col: '#ffd24a', px: 46 }]] },
      // over a trench; then the weight arrow on the little rear wheel
      idea: { set: (S) => { testRoad(S); trench(S, 6); }, render: FOREST, cam: { orbit: [[2, 0, 0], 18, 17, 2.4, 2.4, -0.7, -0.9, [0, 3.5, 0]] },
        build: (S, t) => tsar(S, { x: (t - BEAT0('idea')) * 1.0, spin: -(t - BEAT0('idea')) * 0.22 }),
        over: (ctx, W, H_, t, u, S) => { if (t < V('idea', 'weight') - 0.3) return; const x = (t - BEAT0('idea')) * 1.0 - 6.4, a = S.proj([x, 4.2, 0]), b = S.proj([x, 1.8, 0]); ctx.save(); ctx.strokeStyle = '#ff6a5a'; ctx.fillStyle = '#ff6a5a'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.beginPath(); ctx.moveTo(b[0] - 24, b[1] - 10); ctx.lineTo(b[0] + 24, b[1] - 10); ctx.lineTo(b[0], b[1] + 24); ctx.fill(); ctx.restore(); },
        tags: [['ROLLS OVER TRENCHES', V('idea', 'trenches'), 0.15], ['TOO MUCH WEIGHT HERE', V('idea', 'weight'), 0.22, { col: '#ff6a5a' }]] },
      // the trial: the rear wheel sinks, the front wheels spin, nothing moves; engineer dummies scratch their heads
      fail: { set: 'road', render: FOREST, cam: { orbit: [[-2, 0, 0], 15, 14, 2.0, 1.8, 0.45, 0.25, [0, 3, 0]] },
        build: (S, t) => tsar(S, { x: 0, sink: 0.7 * ramp(t, V('fail', 'sank') - 0.2, 0.8), spin: -t * (t > V('fail', 'front') ? 1.2 : 0.2) }),
        crew: (t) => [{ who: 'engineer', pos: [-4, 0, 3], pose: t > V('fail', "couldn't") ? 'flail' : 'point', yaw: 0.3, t }, { who: 'general', pos: [-2.5, 0, 3.6], pose: 'stand', yaw: 0.1, sweat: 1, t }],
        tags: [['REAR WHEEL SINKS', V('fail', 'sank'), 0.15, { col: '#ff6a5a' }], ['STUCK', V('fail', "couldn't"), 0.22, { col: '#ffd24a', px: 48 }]] },
      // years pass: the sky darkens and lightens, trees grow up around it
      after: { set: 'road', render: FOREST, cam: { orbit: [[-1, 0, 0], 16, 17, 2.5, 3.0, -0.5, -0.3, [0, 3.5, 0]] },
        build: (S, t) => { tsar(S, { x: 0, sink: 0.7 }); const g = H.clamp((t - BEAT0('after')) / 4); for (let i = 0; i < 8; i++) tree(S, -8 + i * 2.4, 2.5 + (i % 2) * 1.2, 0.3 + 1.4 * g, i + 30); },
        tags: [['CANCELLED', V('after', 'cancelled'), 0.15, { col: '#ff6a5a' }], ['SCRAPPED: 1923', V('after', 'scrapped'), 0.22]] },
      // Dave walks round the back and shoves the rear wheel. It pops out. The whole thing rolls back over him.
      end: { set: 'road', render: FOREST, cam: { orbit: [[-7, 0, 0], 7, 8, 1.4, 2.2, -1.2, -0.85, [0, 1.8, 0]] },
        build: (S, t) => { const go = V('end', 'push') - 0.1, k = H.clamp((t - go) / 0.6); tsar(S, { x: -1.6 * H.ease.in(k), sink: 0.7 * (1 - k), spin: 0.4 * k }); },
        dave: (t) => { const go = V('end', 'push') - 0.1, u = H.clamp((t - go - 0.35) / 0.15); return { pos: [-7.6, 0, -0.35], pose: 'carry', yaw: Math.PI / 2, t, lean: 0.3, death: u > 0 ? 'squash' : undefined, u, xeyes: u > 0.5, sweat: 1 }; },
        flash: [V('end', 'push') + 0.25], shake: V('end', 'push') + 0.25 },
    }),
    sound: (k, { V, BEAT0 }) => {
      for (let i = 0; i < 6; i++) k.tone(0.2 + i * 0.8, { f: [[0, 60], [0.4, 50], [0.8, 60]], type: 'sawtooth', dur: 0.8, gain: 0.05, filter: 'lowpass', f2: 300, minor: true }); // creak
      k.play('stamp', V('hook', 'nine'), { gain: 0.45 }); k.play('error', V('idea', 'weight'), { gain: 0.3 });
      k.noise(V('fail', 'sank') - 0.2, { dur: 1.0, color: 'brown', filter: 'lowpass', f: 250, gain: 0.3, a: 0.3 }); k.noise(V('fail', 'front'), { dur: 1.6, color: 'pink', filter: 'bandpass', f: 400, q: 0.6, gain: 0.12, a: 0.2 });
      k.play('stamp', V('after', 'cancelled'), { gain: 0.45 }); for (let i = 0; i < 4; i++) k.play('tick', BEAT0('after') + i, { f: 900, gain: 0.15, minor: true });
      k.play('thud', V('end', 'push') - 0.1, { f: 90, gain: 0.4 }); k.play('impact', V('end', 'push') + 0.25, { gain: 0.85 });
    },
  });
