  // ==================== Body: what happens to your body in space? ====================
  makeReel({
    badge: 'YOUR WEIRD BODY',
    badgeCol: '#2f7fd6',
    captions: { say: { 'three percent': '3%', 'one percent': '1%', 'two hours': '2 hours' }, keys: { space: 'y', taller: 'g', puffy: 'o', skinny: 'o', bone: 'r', flashes: 'y', cosmic: 'y', rays: 'y', shrink: 'r' } },
    shots: ({ V }) => {
      const float = (t, k = 0) => 1.0 + Math.sin(t * 1.3 + k) * 0.15;
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.0, 7.0], [0, 1.5, 0], [0, 1.9, 6.2], [0, 1.55, 0]);
          spaceShot(ctx, W, H_, t, E, TG, (S) => { earth(S, [1.2, -1.2, -3], 2.2, t * 0.1, 0, 4); astronaut(S, -0.3, 0.6, 0.95, 0.3 + Math.sin(t) * 0.1, { bob: float(t), arms: [1.2 + Math.sin(t) * 0.3, 0.9] }); });
        },
        taller(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.4], [0, 1.4, 0], [0, 2.2, 5.6], [0, 1.45, 0]);
          const g = ramp(t, V('taller', 'astronauts'), 1.0) * (1 - ramp(t, V('taller', 'shrink'), 0.6)), s = 1 + 0.06 * g;
          studioShot(ctx, W, H_, E, TG, (S) => {
            plate(S, 0.9, 1.4, -0.3, 0.3, 1.4, (c, w, h) => { c.fillStyle = '#fff8e6'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a33'; for (let i = 0; i < 28; i++) c.fillRect(0, h * i / 28, w * (i % 5 ? 0.3 : 0.6), h * 0.006); }, [255, 240, 200]);
            astronaut(S, -0.2, 0, s, 0.2, { arms: [0.15, 0.15] });
            S.tag(-1.0, 2.9, 0.4, '+3%', popU(t, V('taller', 'three')), -0.06, P.green, 0.5);
          });
        },
        puffy(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 5.8], [0, 1.4, 0], [0, 2.2, 5.0], [0, 1.45, 0]);
          const S = spaceShot(ctx, W, H_, t, E, TG, (S) => { S.figure(0, 0.3, 1, 0, { shirt: [240, 240, 244], pants: [230, 230, 236], hat: null, mouth: 'o', bob: float(t) - 1 }); S.tag(-1.0, 2.6, 0.5, 'puffy face', popU(t, V('puffy', 'puffy')), -0.05, P.orange, 0.85); S.tag(1.0, 0.4, 0.5, 'skinny legs', popU(t, V('puffy', 'skinny')), 0.05, P.blue, 0.9); });
          const r = H.rng(3); ctx.fillStyle = 'rgba(90,170,255,0.8)'; for (let i = 0; i < 14; i++) { const x = r.range(220, 500), y = 1000 - ((t * 160 + r.range(0, 500)) % 500); ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); }
        },
        bones(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.3, 0], [0.1, 2.2, 6.0], [0, 1.35, 0]);
          const run = t > V('bones', "that's"), loss = H.clamp((t - V('bones', 'lose')) / 1.2);
          studioShot(ctx, W, H_, E, TG, (S) => {
            plate(S, -1.0, 1.9, -0.4, 0.45, 0.85, (c, w, h) => { c.fillStyle = '#fffdf6'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8dcc0'; c.fillRect(w * 0.3, h * 0.08, w * 0.4, h * 0.84); c.fillStyle = '#c8a878'; const r2 = H.rng(9); for (let i = 0; i < 40 - loss * 14; i++) { c.beginPath(); c.arc(w * r2.range(0.33, 0.67), h * r2.range(0.1, 0.9), w * 0.03, 0, TAU); c.fill(); } c.fillStyle = '#2a2a33'; c.font = FONT(800, h * 0.07); c.textAlign = 'center'; c.fillText('BONE', w / 2, h * 0.98); });
            S.box((p) => add(p, [0.9, 0.12, 0.3]), 0.55, 0.06, 0.9, P.dark, { bevel: 0.3 }); S.box((p) => add(p, [0.9, 0.7, -0.5]), 0.5, 0.06, 0.06, P.dark, { bevel: 0.3 });
            astronaut(S, 0.9, 0.3, 0.85, 0, { walk: run ? t * 9 : 0, arms: [0.3, 0.3] });
            S.tag(-1.0, 0.35, 1.0, '-1% / month', popU(t, V('bones', 'one')), -0.05, P.red, 1.0);
            S.tag(0.9, 2.8, 0.3, '2 h / day', popU(t, V('bones', 'two')), 0.05, P.green, 0.85);
          });
        },
        flashes(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 5.4], [0, 1.6, 0], [0, 2.1, 4.8], [0, 1.65, 0]);
          spaceShot(ctx, W, H_, t, E, TG, (S) => { S.figure(0, 0.3, 1, 0, { shirt: [240, 240, 244], pants: [230, 230, 236], hat: null, eyes: 'closed', mouth: 'flat', bob: float(t) - 1 }); S.tag(0, 0.3, 1.5, 'cosmic rays', popU(t, V('flashes', 'cosmic')), -0.05, P.yellow, 1.0); });
          if (t > V('flashes', 'flashes')) { const r = H.rng(Math.floor(t * 3)); if (r() > 0.4) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 4; ctx.shadowColor = '#bde0ff'; ctx.shadowBlur = 18; const x = r.range(80, 640), y = r.range(300, 1000); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + r.range(-200, 200), y + r.range(-200, 200)); ctx.stroke(); ctx.restore(); } }
        },
        cta(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.0, 7.0], [0, 1.5, 0], [0, 1.9, 6.2], [0, 1.55, 0]);
          spaceShot(ctx, W, H_, t, E, TG, (S) => { astronaut(S, 0, 0.4, 0.95, -0.2, { bob: float(t), arms: [2.4, 0.4] }); S.tag(0, 2.9, 0.6, '?', popU(t, V('cta', 'go')), 0.12, P.yellow, 0.32); });
        },
      };
    },
    sound: (k, fx, { V, B }) => {
      k.noise(B('hook'), { dur: 3, color: 'pink', filter: 'lowpass', f: 400, gain: 0.08, a: 1 }); k.play('riser', V('hook', 'space') - 0.3, { dur: 0.5, gain: 0.3 });
      k.tone(V('taller', 'astronauts'), { f: [[0, 300], [1, 600]], type: 'sine', dur: 1.1, gain: 0.1 }); k.play('pop', V('taller', 'three'), { f: 640, gain: 0.5 }); k.tone(V('taller', 'shrink'), { f: [[0, 600], [0.6, 300]], type: 'sine', dur: 0.7, gain: 0.1 });
      k.play('pop', V('puffy', 'puffy'), { f: 560, gain: 0.5 }); k.play('pop', V('puffy', 'skinny'), { f: 700, gain: 0.5 });
      k.play('pop', V('bones', 'one'), { f: 520, gain: 0.5 }); for (let i = 0; i < 12; i++) k.play('tock', V('bones', "that's") + i * 0.12, { f: 280, gain: 0.2, minor: true }); k.play('pop', V('bones', 'two'), { f: 640, gain: 0.5 });
      for (let i = 0; i < 6; i++) k.play('sparkle', V('flashes', 'flashes') + i * 0.35, { gain: 0.3, n: 3, minor: true });
      k.play('pop', V('cta', 'go'), { f: 700, gain: 0.5 });
    },
  });
