  // ==================== Body: what happens in your body in one second? ====================
  makeReel({
    badge: 'YOUR WEIRD BODY',
    badgeCol: '#2f7fd6',
    captions: { say: { 'three point eight million': '3.8 million', 'three hundred and thirty billion': '330 billion', 'one percent': '1%' }, keys: { second: 'y', blood: 'r', gut: 'o', heart: 'r', rebuilding: 'g' } },
    shots: ({ V }) => {
      const redCell = (S, x, y, z, s, spin) => S.cyl((p) => add(rotX(rotZ(mul(p, s), spin), 1.2), [x, y, z]), 0.3, 0.12, [210, 50, 50], 14, { capPaint: (c, w, h) => { c.fillStyle = '#c84040'; c.fillRect(0, 0, w, h); c.fillStyle = '#a02a2a'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.25, 0, TAU); c.fill(); } });
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 6.4], [0, 1.5, 0], [0, 2.1, 5.6], [0, 1.55, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => { clock(S, 0, 1.8, -0.2, 1.3, ((t - a) % 1) * 12 / 12 * 0 + 0.0001 + ((t - a) / 60) * 12); S.tag(0, 0.3, 1.6, '1 second', popU(t, V('hook', 'second')), -0.05, P.red, 0.9); });
        },
        cells(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.6], [0, 1.3, 0], [0, 2.2, 5.8], [0, 1.35, 0]);
          const u = ((t - V('cells', 'replace')) % 1 + 1) % 1, n = t > V('cells', 'replace') ? Math.round(3800000 * u) : 0;
          studioShot(ctx, W, H_, E, TG, (S) => {
            const r = H.rng(Math.floor((t - a) * 3)); for (let i = 0; i < 24; i++) { const pu = H.clamp(((t * 3) % 1) * 2 - r() * 0.8); if (pu > 0) S.brick(r.range(-1.6, 1.6), 0, r.range(-1.2, 0.8), 1, 1, [P.red, P.yellow, P.blue, P.green, P.orange][i % 5], 0, (1 - pu) * 1.5); }
            S.tag(0, 0.6, 1.8, n.toLocaleString('en-US'), popU(t, V('cells', 'replace')), -0.05, P.red, 1.25);
            S.tag(0, 2.7, 0.4, 'new cells / second', popU(t, V('cells', 'every')), 0.04, P.yellow, 1.35);
          });
        },
        day(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.6], [0, 1.3, 0], [0, 2.2, 5.8], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            S.figure(0, -0.2, 1.1, 0, { shirt: P.orange });
            const sl = popU(t, V('day', 'roughly')); if (sl > 0) S.box((p) => add(p, [0.42, 0.9, -0.2]), 0.06 * sl, 0.9 * sl, 0.3 * sl, P.red, { bevel: 0.3 });
            S.tag(0, 0.3, 1.8, '330 billion / day', popU(t, V('day', 'three')), -0.05, P.red, 1.35);
            S.tag(1.1, 2.7, 0.4, '1%', popU(t, V('day', 'roughly')), 0.06, P.yellow, 0.45);
          });
        },
        who(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 6.2], [0, 1.4, 0], [0, 2.1, 5.4], [0, 1.45, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            for (let i = 0; i < 6; i++) { const u = popU(t, V('who', 'blood') + i * 0.08); if (u > 0) redCell(S, -1.0 + (i % 3) * 0.55, 1.2 + Math.floor(i / 3) * 0.75 + Math.sin(t * 2 + i) * 0.08, 0.2, u, t + i); }
            const g = popU(t, V('who', 'gut')); if (g > 0) plate(S, 1.0, 1.6, -0.2, 0.55 * g, 0.75 * g, (c, w, h) => { c.fillStyle = '#f7c9b0'; c.fillRect(0, 0, w, h); c.fillStyle = '#e08a7a'; for (let i = 0; i < 6; i++) { c.beginPath(); c.roundRect(w * (0.08 + i * 0.15), h * 0.25, w * 0.1, h * 0.6, w * 0.05); c.fill(); } c.fillStyle = '#5a2a2a'; c.font = FONT(800, h * 0.09); c.textAlign = 'center'; c.fillText('GUT LINING', w / 2, h * 0.15); });
            S.tag(-0.5, 0.3, 1.5, 'blood cells', popU(t, V('who', 'blood')), -0.05, P.red, 1.0);
            S.tag(1.0, 0.25, 1.2, 'a few days', popU(t, V('who', 'days')), 0.05, P.orange, 0.95);
          });
        },
        heart(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 6.0], [0, 1.6, 0], [0, 2.1, 5.2], [0, 1.65, 0]);
          const beat = 1 + 0.12 * Math.exp(-Math.pow(((t - a) % 1) * 9, 2));
          studioShot(ctx, W, H_, E, TG, (S) => {
            const hc = [0, 1.7, 0];
            voxBall(S, add(hc, [-0.32 * beat, 0.25 * beat, 0]), 0.5 * beat, 3, () => [222, 52, 60], 0, 0);
            voxBall(S, add(hc, [0.32 * beat, 0.25 * beat, 0]), 0.5 * beat, 3, () => [222, 52, 60], 0, 0);
            voxBall(S, add(hc, [0, -0.25 * beat, 0]), 0.5 * beat, 3, () => [200, 40, 50], 0, 0);
            S.tag(0, 0.3, 1.6, '~1 beat / second', popU(t, V('heart', 'heart')), -0.05, P.red, 1.3);
          });
        },
        rebuild(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.8], [0, 1.2, 0], [0, 2.1, 6.0], [0, 1.25, 0]);
          const u = H.clamp((t - a) / ((b - a) * 0.8));
          studioShot(ctx, W, H_, E, TG, (S) => {
            S.figure(0, 0.2, 1, 0, { shirt: P.green, bob: (1 - H.ease.out(u)) * 2.2, arms: [u * 2.4, u * 2.4] });
            for (let i = 0; i < 10; i++) { const st = a + i * 0.25, pu = H.clamp((t - st) / 0.3); if (pu > 0 && pu < 1) S.box((p) => add(p, [-0.6 + (i % 5) * 0.3, 2.6 - pu * 2.0, 0.4]), 0.08, 0.08, 0.08, [P.red, P.yellow, P.blue, P.green][i % 4], { bevel: 0.3 }); }
            S.tag(0, 2.85, 0.6, 'every day', popU(t, V('rebuild', 'every')), 0.05, P.green, 0.85);
          });
        },
        cta(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.8], [0, 1.3, 0], [0, 2.1, 6.0], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => { S.figure(0, 0.4, 1, 0, { shirt: P.blue, arms: [2.4, 0.15] }); S.tag(0, 2.8, 0.6, 'FOLLOW', popU(t, V('cta', 'follow')), 0.05, P.red, 0.8); confetti(S, t, V('cta', 'follow') + 0.2, 0, 1.4, 14, 2); });
        },
      };
    },
    sound: (k, fx, { V, B }) => {
      for (let i = 0; i < 4; i++) k.play('tock', B('hook') + 0.2 + i, { f: 900, gain: 0.4 });
      for (let f = 0; f < 30; f++) k.play('count', V('cells', 'replace') + f * 0.1, { gain: 0.45, minor: true }); k.play('pop', V('cells', 'every'), { f: 640, gain: 0.5 });
      k.play('pop', V('day', 'three'), { f: 560, gain: 0.5 }); k.play('pop', V('day', 'roughly'), { f: 700, gain: 0.5 });
      for (let i = 0; i < 6; i++) k.play('pop', V('who', 'blood') + i * 0.08, { f: 500 + i * 50, gain: 0.35, minor: true }); k.play('pop', V('who', 'gut'), { f: 600, gain: 0.5 });
      for (let i = 0; i < 6; i++) { k.play('thud', B('heart') + 0.1 + i, { f: 70, gain: 0.55 }); k.play('thud', B('heart') + 0.32 + i, { f: 60, gain: 0.4 }); }
      for (let i = 0; i < 10; i++) fx.seat(B('rebuild') + i * 0.25 + 0.3, 0.5);
      k.play('success', V('cta', 'follow'), { f: 'C6', gain: 0.5 });
    },
  });
