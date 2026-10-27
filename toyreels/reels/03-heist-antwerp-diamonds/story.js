  // ==================== Heists 3/4: the Antwerp diamond heist (2003) ====================
  makeReel({
    badge: 'GREATEST HEISTS · 3/4',
    captions: { say: { 'two thousand three': '2003', 'one hundred million dollars': '$100 million', 'ten years': '10 years' }, keys: { antwerp: 'y', diamond: 'y', diamonds: 'y', vault: 'o', anyway: 'r', notarbartolo: 'o', trash: 'r', sandwich: 'o', dna: 'g', never: 'r', unsolved: 'r', finale: 'y' } },
    shots: ({ V }) => {
      const crook = (S, x, z, s, rot, o = {}) => S.figure(x, z, s, rot, Object.assign({ shirt: [36, 36, 44], pants: [30, 30, 38], hat: 'beanie', hatCol: [24, 24, 30], mask: true }, o));
      const vaultRoom = (S, open, spin = 0) => { vaultWall(S, -0.9); vaultDoor(S, 0, 1.55, -0.6, 1.05, open, spin); };
      const gems = (S, n, t, x0 = 0, y0 = 1.0, z0 = 0.6, seed = 2) => { const r = H.rng(seed); for (let i = 0; i < n; i++) gem(S, x0 + r.range(-0.6, 0.6), y0 + r.range(0, 0.5), z0 + r.range(-0.2, 0.3), 0.07, t * 1.5 + i, [[170, 230, 255], [255, 255, 255], [200, 240, 255]][i % 3]); };
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 7.0], [0, 1.4, 0], [0, 2.1, 6.2], [0, 1.45, 0]);
          cityShot(ctx, W, H_, t, E, TG, (S) => {
            S.box((p) => add(p, [0, 1.3, -0.8]), 1.3, 1.3, 0.7, [190, 186, 176], { bevel: 0.08, paint: (c, w, h) => { c.fillStyle = '#2a3a5a'; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) c.fillRect(w * (0.12 + i * 0.2), h * (0.12 + j * 0.2), w * 0.12, h * 0.12); c.fillStyle = '#c8a040'; c.font = FONT(800, h * 0.09); c.textAlign = 'center'; c.fillText('DIAMOND CENTER', w / 2, h * 0.88); } });
            for (let i = 0; i < 5; i++) { const u = popU(t, V('hook', 'one') + i * 0.12); if (u > 0) gem(S, -0.8 + i * 0.4, 2.9, 0.6, 0.12 * u, t * 2 + i); }
            S.tag(0, 0.3, 1.8, 'Antwerp', popU(t, V('hook', 'antwerp')), -0.05, P.red, 0.85);
          }, 0);
        },
        security(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.8], [0, 1.4, 0], [0, 2.2, 6.0], [0, 1.45, 0]);
          const items = [['heat', 'heat sensors'], ['radar', 'radar'], ['magnetic', 'magnetic field'], ['seismic', 'seismic sensor'], ['combination', 'combination lock']];
          studioShot(ctx, W, H_, E, TG, (S) => {
            vaultRoom(S, 0, t * 0.5);
            items.forEach(([w, label], i) => { const u = popU(t, V('security', w)); S.tag(i % 2 ? 0.5 : -0.5, 0.25 + i * 0.46, 1.6, label, u, i % 2 ? 0.04 : -0.04, i === 4 ? P.orange : P.red, 0.8); });
            S.tag(1.2, 2.6, -0.3, '-2 floors', popU(t, V('security', 'two')), 0.04, P.blue, 0.55);
          });
          ctx.save(); ctx.strokeStyle = 'rgba(255,40,40,0.55)'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { const y = 640 + i * 90 + Math.sin(t * 2 + i) * 10; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(720, y + 40 * (i % 2 ? 1 : -1)); ctx.stroke(); } ctx.restore();
        },
        crew(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 7.0], [0, 1.2, 0], [0.1, 2.1, 6.2], [0, 1.25, 0]);
          const office = t > V('crew', 'rented');
          studioShot(ctx, W, H_, E, TG, (S) => {
            if (!office) { crook(S, -1.1, 0.4, 0.9, 0.5); crook(S, 0, 0.0, 0.95, 0.1, { arms: [0.15, 1.4] }); crook(S, 1.1, 0.4, 0.9, -0.5); S.tag(0, 2.7, 0.6, 'Notarbartolo', popU(t, V('crew', 'notarbartolo')), 0.05, P.yellow, 1.15); S.tag(0, 0.3, 1.8, '2003', popU(t, V('crew', 'two')), -0.05, P.red, 0.7); }
            else { S.box((p) => add(p, [0.3, 0.5, -0.2]), 0.9, 0.06, 0.45, [150, 100, 64], { bevel: 0.3 }); S.box((p) => add(p, [0.3, 0.25, -0.2]), 0.8, 0.25, 0.4, [130, 86, 54], { bevel: 0.2 }); gem(S, 0.5, 0.68, -0.1, 0.08, t); S.figure(-0.6, 0.3, 0.95, 0.5, { shirt: [60, 70, 120], hat: null, look: 0.04 }); plate(S, 0.3, 1.9, -0.9, 0.9, 0.3, (c, w, h) => { c.fillStyle = '#20304a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.font = FONT(800, h * 0.36); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('DIAMOND TRADER', w / 2, h / 2); }, [32, 48, 74]); }
          });
        },
        weekend(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.8], [0, 1.4, 0], [0, 2.2, 6.0], [0, 1.45, 0]);
          const op = ramp(t, a + 0.3, 1.0);
          studioShot(ctx, W, H_, E, TG, (S) => {
            vaultRoom(S, op, op * 3);
            if (op > 0.5) { gems(S, 18, t, 0.2, 0.7, 0.1, 4); bag(S, -1.2, 0, 0.8, 0.8, [36, 36, 44]); }
            crook(S, 1.3, 0.8, 0.9, -0.5, { arms: [0.15, 1.6] });
            S.tag(0, 0.3, 1.9, '$100,000,000+', popU(t, V('weekend', 'more')), -0.05, P.green, 1.25);
          });
        },
        trash(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.2, 7.2], [0, 1.0, 0], [0.1, 2.0, 6.4], [0, 1.05, 0]);
          lawnShot(ctx, W, H_, t, E, TG, (S) => {
            [[-1.8, -1.2], [1.9, -1.4], [-0.6, -2.6], [1.0, -2.8]].forEach(([x, z]) => tree(S, x, z, 1.3, [70, 140, 80]));
            for (let i = 0; i < 3; i++) S.box((p) => add(rotY(p, i), [0.3 + i * 0.45, 0.25, 0.8 + (i % 2) * 0.3]), 0.25, 0.25, 0.22, [30, 32, 38], { bevel: 0.55 });
            S.figure(-1.0, 1.0, 0.9, 0.6, { shirt: [140, 110, 60], hat: 'cap', hatCol: [90, 120, 60], mouth: 'o', eyes: 'wide' });
            S.tag(0.8, 2.3, 0.8, '!', popU(t, V('trash', 'found')), 0.12, P.red, 0.3);
          });
        },
        sandwich(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 5.6], [0, 1.1, 0], [0, 2.0, 4.8], [0, 1.15, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            S.box((p) => add(rotY(p, 0.3), [0, 0.95, 0]), 0.75, 0.1, 0.42, [222, 170, 112], { bevel: 0.5 });
            for (let i = 0; i < 4; i++) S.cyl((p) => add(p, [-0.45 + i * 0.3, 1.05, 0.05 * (i % 2)]), 0.2, 0.04, [200, 70, 70], 14, { capPaint: (c, w, h) => { c.fillStyle = '#c84848'; c.fillRect(0, 0, w, h); c.fillStyle = '#f0d0c0'; for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(w * (0.2 + (k % 3) * 0.3), h * (0.3 + Math.floor(k / 3) * 0.4), w * 0.05, 0, TAU); c.fill(); } } });
            S.box((p) => add(rotY(p, 0.3), [-0.12, 1.18, 0]), 0.55, 0.1, 0.42, [232, 184, 126], { bevel: 0.5 });
            S.tag(0, 2.35, 0.6, 'DNA', popU(t, V('sandwich', 'dna')), 0.05, P.green, 0.55);
            S.tag(0, 0.3, 1.5, 'salami sandwich', popU(t, V('sandwich', 'salami')), -0.05, P.red, 1.3);
          });
          return 0.18 * Math.exp(-Math.pow((t - V('sandwich', 'straight')) * 6, 2));
        },
        sentence(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.8], [0, 1.3, 0], [0, 2.2, 6.0], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            crook(S, 0, 0.0, 0.95, 0, { mask: false, mouth: 'frown', hat: null });
            for (let i = 0; i < 6; i++) S.box((p) => add(p, [-0.9 + i * 0.36, 1.25, 0.65]), 0.04, 1.25, 0.04, [90, 90, 100], { bevel: 0.3 });
            S.tag(0, 0.3, 1.8, '10 years', popU(t, V('sentence', 'ten')), -0.05, P.red, 0.85);
            const gq = popU(t, V('sentence', 'never')); if (gq > 0) { gem(S, -1.1, 2.6, 0.5, 0.15 * gq, t * 2); S.tag(1.0, 2.6, 0.5, '?', gq, 0.12, P.yellow, 0.3); }
          });
        },
        next(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 6.6], [0, 1.5, 0], [0, 2.1, 5.8], [0, 1.55, 0]);
          museumShot(ctx, W, H_, E, TG, (S) => {
            painting(S, 0, 1.8, -1.2, 0.6, 0.75, null);
            S.tag(0, 0.3, 1.8, 'PART 4', popU(t, V('next', 'part')), -0.05, P.red, 0.8);
            S.tag(0.9, 2.9, -0.6, '?', popU(t, V('next', 'unsolved')), 0.12, P.yellow, 0.3);
          }, '#6a2424', 0.4);
        },
      };
    },
    sound: (k, fx, { V }) => {
      for (let i = 0; i < 5; i++) k.play('blip', V('hook', 'one') + i * 0.12, { f: ['C6', 'E6', 'G6', 'A6', 'C7'][i], type: 'sine', gain: 0.4, minor: true }); k.play('pop', V('hook', 'antwerp'), { f: 600, gain: 0.5 });
      ['heat', 'radar', 'magnetic', 'seismic', 'combination'].forEach((w, i) => k.play('pop', V('security', w), { f: 480 + i * 60, gain: 0.5 })); k.noise(V('security', 'two'), { dur: 4, filter: 'bandpass', f: 1400, q: 6, gain: 0.04 });
      k.play('pop', V('crew', 'notarbartolo'), { f: 560, gain: 0.5 }); k.play('ding', V('crew', 'rented'), { f: 'E6', gain: 0.35 });
      k.play('roller', V('weekend', 'over'), { dur: 1.0, gain: 0.5 }); k.play('thud', V('weekend', 'over') + 1.0, { f: 90, gain: 0.5 }); k.play('sparkle', V('weekend', 'emptied'), { gain: 0.5, n: 10 }); k.play('coin', V('weekend', 'more'), { gain: 0.6 });
      k.play('pop', V('trash', 'found'), { f: 700, gain: 0.5 });
      k.play('impact', V('sandwich', 'dna'), { gain: 0.6 }); k.play('success', V('sandwich', 'straight'), { f: 'C6', gain: 0.5 });
      k.play('slap', V('sentence', 'ten'), { gain: 0.5 }); k.play('thud', V('sentence', 'ten'), { f: 120, gain: 0.5 }); k.play('sparkle', V('sentence', 'never'), { gain: 0.4 });
      k.play('pop', V('next', 'part'), { f: 520, gain: 0.5 });
    },
  });
