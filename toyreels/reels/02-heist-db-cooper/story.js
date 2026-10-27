  // ==================== Heists 2/4: D.B. Cooper (1971) ====================
  makeReel({
    badge: 'GREATEST HEISTS · 2/4',
    captions: { say: { 'nineteen seventy-one': '1971', 'two hundred thousand dollars': '$200,000', 'twenty sixteen': '2016', 'five thousand eight hundred dollars': '$5,800', 'eight-year-old': '8-year-old' }, keys: { cooper: 'o', bomb: 'r', parachutes: 'y', jumped: 'o', never: 'r', unsolved: 'r', survive: 'g', seattle: 'y' } },
    shots: ({ V }) => {
      const cooper = (S, x, z, s, rot, o = {}) => S.figure(x, z, s, rot, Object.assign({ shirt: [40, 42, 52], pants: [36, 38, 48], hat: null, skin: P.skin }, o));
      const seats = (S, n = 3) => { for (let i = 0; i < n; i++) for (const sx of [-1.3, 1.3]) { S.box((p) => add(p, [sx, 0.35, -1.6 + i * 1.1]), 0.45, 0.12, 0.35, [60, 90, 160], { bevel: 0.3 }); S.box((p) => add(p, [sx, 0.85, -1.9 + i * 1.1]), 0.45, 0.4, 0.08, [60, 90, 160], { bevel: 0.3 }); } };
      const cabinSet = (ctx, W, H_, S) => { const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#d8d4c8'); g.addColorStop(1, '#a8a49a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); const zMax = S.E[2] - 0.6; quad3(ctx, S, [[-2.2, 0, -6], [2.2, 0, -6], [2.2, 0, zMax], [-2.2, 0, zMax]], '#5a5e70'); quad3(ctx, S, [[-0.5, 0.003, -6], [0.5, 0.003, -6], [0.5, 0.003, zMax], [-0.5, 0.003, zMax]], '#8a2a2a'); };
      const cabin = (ctx, W, H_, E, TG, build) => { const S = Scene(E, TG, W, H_); build(S); cabinSet(ctx, W, H_, S); S.render(ctx, W, H_, { sky: [240, 236, 220], ground: [90, 90, 110] }); };
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.3, 2.3, 7.2], [0, 1.2, 0], [0.2, 2.1, 6.4], [0, 1.25, 0]);
          cityShot(ctx, W, H_, t, E, TG, (S) => {
            S.box((p) => add(p, [0.8, 0.5, -0.3]), 0.8, 0.5, 0.35, [200, 60, 50], { bevel: 0.15, paint: (c, w, h) => { c.fillStyle = '#fff'; c.font = FONT(800, h * 0.22); c.textAlign = 'center'; c.fillText('TICKETS', w / 2, h * 0.4); } });
            cooper(S, -0.7, 0.5, 1, 0.5, { arms: [0.15, t > V('hook', 'name') ? 1.3 : 0.15] });
            S.tag(0, 2.7, 0.8, 'Dan Cooper', popU(t, V('hook', 'dan')), 0.05, P.yellow, 0.95);
            S.tag(0, 0.3, 2.0, '1971', popU(t, V('hook', 'nineteen')), -0.05, P.red, 0.7);
          }, 0);
        },
        note(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 5.6], [0, 1.2, -1.0], [0, 2.1, 5.0], [0, 1.25, -1.0]);
          const hand = ramp(t, V('note', 'handed'), 0.4), bomb = t > V('note', 'bomb');
          cabin(ctx, W, H_, E, TG, (S) => {
            seats(S);
            cooper(S, -0.6, -0.1, 0.95, 0.6, { arms: [0.15, 0.15 + 1.2 * hand], eyes: bomb ? 'open' : 'open' });
            S.figure(0.6, 0.2, 0.95, -0.7, { shirt: [60, 110, 200], hat: 'cap', hatCol: [60, 110, 200], mouth: bomb ? 'o' : 'smile', eyes: bomb ? 'wide' : 'open' });
            if (hand > 0) plate(S, H.lerp(-0.1, 0.25, hand), 1.45, 0.35, 0.22, 0.16, (c, w, h) => { c.fillStyle = '#fffbe8'; c.fillRect(0, 0, w, h); c.fillStyle = '#c0281c'; c.font = FONT(800, h * 0.3); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(bomb ? 'BOMB' : '...', w / 2, h / 2); });
          });
          return 0.18 * Math.exp(-Math.pow((t - V('note', 'bomb')) * 6, 2));
        },
        demand(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.5, 7.0], [0, 1.0, 0], [0, 2.3, 6.2], [0, 1.05, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            const n = Math.floor(H.clamp((t - V('demand', 'two')) / 1.2) * 12);
            for (let i = 0; i < n; i++) cash(S, -0.9 + (i % 3) * 0.48, 0.06 + Math.floor(i / 3) * 0.11, 0.3, 1.0, 0.1);
            for (let i = 0; i < 4; i++) { const u = popU(t, V('demand', 'four') + i * 0.15, 0.4); if (u > 0) bag(S, 0.6 + (i % 2) * 0.55, 0, -0.2 + Math.floor(i / 2) * 0.6, u * 0.8, [220, 70, 50]); }
            S.tag(-0.6, 1.25, 1.2, '$200,000', popU(t, V('demand', 'two')), -0.05, P.green, 0.95);
            S.tag(1.0, 1.6, 0.6, '4 parachutes', popU(t, V('demand', 'parachutes')), 0.06, P.red, 1.15);
          });
        },
        swap(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.3, 2.0, 7.6], [0, 1.0, 0], [0.2, 1.9, 6.8], [0, 1.05, 0]);
          const off = Math.max(0, t - V('swap', 'let')), go = Math.max(0, t - V('swap', 'took'));
          cityShot(ctx, W, H_, t, E, TG, (S) => {
            plane(S, 0.3 - go * 1.6, 1.0 + go * go * 0.4, -0.8, 0.95, 0.15, 0);
            for (let i = 0; i < 5; i++) { const x = -1.6 - Math.max(0, off - i * 0.25) * 1.2; if (x > -4) S.figure(x + 0.4 * i * 0, 0.9 + i * 0.25, 0.6, -1.4, { shirt: [P.red, P.blue, P.green, P.orange, P.teal][i], walk: t * 7 }); }
            if (t < V('swap', 'took')) bag(S, 1.3, 0, 0.9, 0.7, [80, 140, 80]);
            S.tag(0.2, 2.75, 0.4, 'Seattle', popU(t, V('swap', 'seattle')), 0.05, P.yellow, 0.75);
          }, 1);
        },
        jump(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 1.5, 7.0], [0, 1.6, 0], [0, 1.5, 6.4], [0, 1.6, 0]);
          const st = ramp(t, V('jump', 'opened'), 0.5), j = Math.max(0, t - V('jump', 'jumped'));
          skyShot(ctx, W, H_, t, E, TG, (S) => {
            plane(S, 0.3, 2.3, 0, 0.9, 0, st);
            if (j > 0) { cooper(S, -1.4 - j * 0.3, 0, 0.55, 0.3, { bob: 1.9 - j * 1.2, arms: [2.6, 2.6] }); if (j > 0.8) parachute(S, -1.4 - j * 0.3, 1.9 - j * 1.2 + 1.85, 0, 0.55); }
          }, 1);
        },
        gone(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.2, 7.4], [0, 1.2, 0], [0.1, 2.0, 6.6], [0, 1.25, 0]);
          forestShot(ctx, W, H_, t, E, TG, (S) => {
            [[-1.6, -0.8], [-0.5, -1.6], [0.9, -1.1], [1.8, -0.3], [-1.9, 0.9], [1.5, 1.3], [0.1, -2.6]].forEach(([x, z], i) => tree(S, x, z, 1.2 + (i % 3) * 0.2));
            S.tag(0, 2.6, 0.8, '?', popU(t, V('gone', 'never')), 0.12, P.yellow, 0.32);
          });
        },
        money(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.2, 7.2], [0, 0.8, 0], [0.1, 2.0, 6.4], [0, 0.85, 0]);
          const S = Scene(E, TG, W, H_);
          S.figure(-0.8, 1.3, 0.65, 0.5, { shirt: P.orange, hat: 'cap', arms: [0.15, t > V('money', 'found') ? 2.2 : 0.6] });
          const u = H.clamp((t - V('money', 'found')) / 0.8); for (let i = 0; i < 5; i++) if (u * 5 > i) cash(S, 0.3 + (i % 3) * 0.4, 0.06 + Math.floor(i / 3) * 0.11, 1.4, 0.9, 0.4 * i);
          S.tag(0.4, 1.55, 1.7, '$5,800', popU(t, V('money', 'five')), -0.05, P.green, 0.75);
          S.tag(1.0, 0.45, 1.6, '1980', popU(t, V('money', 'nine')), 0.06, P.red, 0.55);
          beachSet(ctx, W, H_, S, t, -0.05); S.render(ctx, W, H_, {});
        },
        unsolved(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.4, 6.6], [0, 1.3, 0], [0, 2.3, 5.8], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            plate(S, 0, 1.55, -0.2, 0.9, 1.1, (c, w, h) => { c.fillStyle = '#e6d6a8'; c.fillRect(0, 0, w, h); c.fillStyle = '#5a4a2a'; c.font = FONT(800, h * 0.08); c.textAlign = 'center'; c.fillText('FBI CASE FILE', w / 2, h * 0.14); c.fillText('NORJAK', w / 2, h * 0.25); c.fillStyle = '#9a8a6a'; for (let i = 0; i < 6; i++) c.fillRect(w * 0.15, h * (0.36 + i * 0.07), w * (0.7 - (i % 2) * 0.2), h * 0.025); if (t > V('unsolved', 'unsolved')) { c.save(); c.translate(w / 2, h * 0.72); c.rotate(-0.25); c.strokeStyle = '#d02a1c'; c.lineWidth = w * 0.025; c.strokeRect(-w * 0.38, -h * 0.07, w * 0.76, h * 0.14); c.fillStyle = '#d02a1c'; c.font = FONT(800, h * 0.09); c.fillText('UNSOLVED', 0, h * 0.035); c.restore(); } }, [230, 214, 168]);
            S.tag(0, 0.3, 1.8, '2016', popU(t, V('unsolved', 'twenty')), -0.05, P.red, 0.7);
          });
          return 0.18 * Math.exp(-Math.pow((t - V('unsolved', 'unsolved')) * 6, 2));
        },
        next(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 7.0], [0, 1.2, 0], [0, 2.0, 6.2], [0, 1.25, 0]);
          forestShot(ctx, W, H_, t, E, TG, (S) => {
            [[-1.8, -0.8], [1.8, -0.6], [-0.9, -2.2], [1.0, -2.4]].forEach(([x, z]) => tree(S, x, z, 1.4));
            S.tag(-0.6, 2.4, 0.6, '?', popU(t, V('next', 'survive')), 0.12, P.yellow, 0.3); S.tag(0.6, 2.0, 0.9, '?', popU(t, V('next', 'think')), -0.12, P.yellow, 0.3);
            S.tag(0, 0.35, 1.8, 'PART 3', popU(t, V('next', 'part')), -0.05, P.red, 0.8);
            for (let i = 0; i < 3; i++) { const u = popU(t, V('next', 'diamond') + i * 0.12); if (u > 0) gem(S, -0.5 + i * 0.5, 1.2, 1.2, 0.15 * u, t * 2 + i); }
          });
        },
      };
    },
    sound: (k, fx, { V }) => {
      k.play('pop', V('hook', 'nineteen'), { f: 600, gain: 0.5 }); k.play('pop', V('hook', 'dan'), { f: 700, gain: 0.5 });
      k.noise(V('note', 'soon'), { dur: 4, color: 'brown', filter: 'lowpass', f: 300, gain: 0.08, a: 0.5 }); k.play('paper', V('note', 'handed'), { dur: 0.3, gain: 0.5 });
      k.play('thud', V('note', 'bomb'), { f: 90, gain: 0.6 }); k.play('buzz', V('note', 'bomb'), { f: 98, dur: 0.3, gain: 0.4 });
      for (let i = 0; i < 12; i++) fx.clack(V('demand', 'two') + i * 0.1, 0.4); for (let i = 0; i < 4; i++) k.play('pop', V('demand', 'four') + i * 0.15, { f: 500 + i * 60, gain: 0.45 });
      k.noise(V('swap', 'took'), { dur: 2, color: 'pink', filter: 'bandpass', f: [[0, 300], [2, 1200]], q: 0.8, gain: 0.25, a: 0.6 });
      k.noise(V('jump', 'somewhere'), { dur: 3, color: 'pink', filter: 'lowpass', f: 700, gain: 0.15, a: 0.3 }); k.play('whoosh', V('jump', 'jumped'), { dur: 0.6, gain: 0.6 });
      k.tone(V('gone', 'never'), { f: [[0, 300], [1.2, 160]], type: 'triangle', dur: 1.3, gain: 0.12, filter: 'lowpass', f2: 900 });
      k.play('pop', V('money', 'nine'), { f: 560, gain: 0.5 }); k.play('success', V('money', 'found'), { f: 'C6', gain: 0.5 }); k.play('pop', V('money', 'five'), { f: 640, gain: 0.5 });
      k.play('stamp', V('unsolved', 'unsolved'), { gain: 0.7 }); k.play('pop', V('unsolved', 'twenty'), { f: 560, gain: 0.5 });
      k.play('sparkle', V('next', 'diamond'), { gain: 0.5 });
    },
  });
