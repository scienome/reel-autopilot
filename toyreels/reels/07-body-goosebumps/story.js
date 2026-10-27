  // ==================== Body: why do you get goosebumps? ====================
  makeReel({
    badge: 'YOUR WEIRD BODY',
    badgeCol: '#2f7fd6',
    captions: { keys: { goosebumps: 'y', muscle: 'o', cold: 'y', scared: 'r', song: 'g', fur: 'o', bigger: 'r', leftover: 'y', ancestors: 'y' } },
    shots: ({ V }) => {
      // a slab of skin seen up close: hairs with their tiny muscles; up 0..1 stands them up and raises bumps
      const skin = (S, up, z = 0) => {
        S.box((p) => add(p, [0, 0.4, z]), 1.9, 0.4, 0.8, [244, 196, 150], { bevel: 0.1 });
        for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) {
          const x = -1.4 + i * 0.7, zz = z - 0.3 + j * 0.6, bump = 0.06 * up;
          if (bump > 0.005) S.cyl((p) => add(p, [x, 0.8, zz]), 0.13, bump, [244, 190, 145], 12);
          S.box((p) => add(rotZ(add(p, [0, 0.3, 0]), H.lerp(1.25, 0.1, up)), [x, 0.82 + bump, zz]), 0.02, 0.3, 0.02, [70, 50, 40], { bevel: 0.3 });
        }
      };
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.3, 0], [0.1, 2.2, 6.0], [0, 1.35, 0]);
          const sh = Math.sin(t * 40) * 0.03;
          lawnShot(ctx, W, H_, t, E, TG, (S) => { S.figure(sh, 0.4, 1, 0.1, { shirt: P.blue, mouth: 'o', eyes: 'wide', arms: [0.5, 0.5] }); S.tag(0, 2.7, 0.6, '?', popU(t, V('hook', 'goosebumps')), 0.12, P.yellow, 0.3); });
        },
        muscle(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 3.3, 4.4], [0, 0.6, 0], [0, 3.1, 3.9], [0, 0.65, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => { skin(S, 0); S.tag(0, 1.6, 0.6, 'tiny muscle', popU(t, V('muscle', 'muscle')), 0.05, P.orange, 1.0); });
          const S2 = Scene(...shotCam(t, a, b, [0, 3.3, 4.4], [0, 0.6, 0], [0, 3.1, 3.9], [0, 0.65, 0]), W, H_); const p0 = S2.proj([-0.7, 0.82, 0.3]); const u = popU(t, V('muscle', 'muscle'));
          if (u > 0) { ctx.save(); ctx.strokeStyle = '#e2402c'; ctx.lineWidth = 8 * u; ctx.beginPath(); ctx.arc(p0[0], p0[1], 60 * u, 0, TAU); ctx.stroke(); ctx.restore(); }
        },
        trigger(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 3.3, 4.4], [0, 0.6, 0], [0, 3.1, 3.9], [0, 0.65, 0]);
          const up = ramp(t, V('trigger', 'stand'), 0.6);
          studioShot(ctx, W, H_, E, TG, (S) => {
            skin(S, up);
            [['cold', 'cold', -1.0, P.blue], ['scared', 'scared', 0, P.red], ['song', 'music', 1.0, P.green]].forEach(([w, lab, x, col]) => S.tag(x * 0.85, 0.1, 1.3, lab, popU(t, V('trigger', w)), x * 0.05, col, 0.42));
          });
          return 0.12 * Math.exp(-Math.pow((t - V('trigger', 'stand')) * 6, 2));
        },
        fur(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.0, 5.4], [0, 0.8, 0], [0.1, 1.9, 4.8], [0, 0.85, 0]);
          const fl = ramp(t, V('fur', 'puffs'), 0.4);
          lawnShot(ctx, W, H_, t, E, TG, (S) => { cat(S, 0, 0.4, 1.3, 0.3, fl); S.tag(0, 2.5, 0.4, fl > 0.5 ? 'puffed up!' : 'warm coat', popU(t, V('fur', 'fluffy')), 0.05, fl > 0.5 ? P.red : P.orange, 0.95); });
        },
        us(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 7.0], [0, 1.2, 0], [0.1, 2.1, 6.2], [0, 1.25, 0]);
          lawnShot(ctx, W, H_, t, E, TG, (S) => {
            S.figure(-0.8, 0.5, 1, 0.4, { shirt: [120, 80, 50], pants: [110, 74, 46], skin: [190, 140, 100], hat: 'beanie', hatCol: [110, 74, 46] });
            const r = H.rng(2); for (let i = 0; i < 20; i++) S.box((p) => add(rotZ(p, r.range(-0.6, 0.6)), [-0.8 + r.range(-0.45, 0.45), r.range(0.3, 1.6), 0.5 + r.range(0.1, 0.25)]), 0.03, 0.08, 0.03, [100, 66, 40], { bevel: 0.3 });
            S.figure(0.8, 0.5, 1, -0.4, { shirt: P.orange, hat: null });
            S.tag(-0.8, 2.75, 0.4, 'ancestors', popU(t, V('us', 'ancestors')), -0.05, P.yellow, 0.95);
            S.tag(0.8, 2.75, 0.4, 'us', popU(t, V('us', 'we')), 0.05, P.blue, 0.35);
          });
        },
        cta(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.3, 0], [0.1, 2.1, 6.0], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            S.figure(0, 0.4, 1, 0, { shirt: P.green, eyes: 'closed', arms: [0.15 + Math.abs(Math.sin(t * 4)) * 0.4, 0.15 + Math.abs(Math.sin(t * 4 + 1)) * 0.4], bob: Math.abs(Math.sin(t * 4)) * 0.08 });
            for (let i = 0; i < 3; i++) { const u = ((t - a) * 0.6 + i / 3) % 1; S.tag(-1.0 + i * 1.0, 1.6 + u * 1.4, 0.3, '♪', H.clamp(Math.min(u * 4, (1 - u) * 4)), 0.1 * (i - 1), [P.red, P.yellow, P.blue][i], 0.22); }
          });
        },
      };
    },
    sound: (k, fx, { V }) => {
      k.noise(V('hook', 'why'), { dur: 1.5, color: 'pink', filter: 'highpass', f: 1500, gain: 0.08, a: 0.3 }); k.play('pop', V('hook', 'goosebumps'), { f: 640, gain: 0.5 });
      k.play('ding', V('muscle', 'muscle'), { f: 'G5', gain: 0.4 });
      k.play('pop', V('trigger', 'cold'), { f: 500, gain: 0.5 }); k.play('pop', V('trigger', 'scared'), { f: 600, gain: 0.5 }); k.play('pop', V('trigger', 'song'), { f: 700, gain: 0.5 });
      for (let i = 0; i < 10; i++) k.play('blip', V('trigger', 'stand') + i * 0.05, { f: ['C6', 'D6', 'E6', 'G6', 'A6'][i % 5], type: 'sine', gain: 0.3, minor: true });
      k.play('jump', V('fur', 'puffs'), { gain: 0.6 }); k.noise(V('fur', 'puffs'), { dur: 0.4, filter: 'highpass', f: 2000, gain: 0.25 });
      k.play('pop', V('us', 'ancestors'), { f: 560, gain: 0.5 });
      ['C5', 'E5', 'G5', 'C6', 'E6'].forEach((f, i) => k.play('ding', V('cta', 'song') + i * 0.25, { f, gain: 0.3 }));
    },
  });
