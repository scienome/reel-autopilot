  // ==================== Heists 1/4: the Mona Lisa (1911) ====================
  const LOUVRE = '#cdbf9e';
  makeReel({
    badge: 'GREATEST HEISTS · 1/4',
    captions: { say: { 'nineteen eleven': '1911' }, keys: { mona: 'y', lisa: 'y', louvre: 'y', peruggia: 'o', vincenzo: 'o', monday: 'o', closed: 'r', nobody: 'r', florence: 'y', arrested: 'r', superstar: 'g', vanished: 'o', twist: 'o' } },
    shots: ({ V }) => {
      const thief = (S, x, z, s, rot, o = {}) => S.figure(x, z, s, rot, Object.assign({ shirt: [240, 240, 236], pants: [70, 70, 84], hat: 'beanie', hatCol: [60, 60, 70] }, o));
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.3, 2.3, 7.6], [0, 1.15, 0], [0.2, 2.1, 6.8], [0, 1.2, 0]);
          const wx = -0.6 + Math.max(0, t - V('hook', 'walked')) * 0.9;
          museumShot(ctx, W, H_, E, TG, (S) => {
            painting(S, -0.9, 1.7, -2.3, 0.45, 0.6, null);
            if (t < V('hook', 'walked')) painting(S, 0.5, 1.5, -1.2, 0.45, 0.6, 'mona'); else painting(S, wx + 0.45, 1.25, 0.65, 0.42, 0.56, 'mona', FRAME_GOLD, -0.3);
            thief(S, t < V('hook', 'walked') ? -0.6 : wx, 0.4, 0.95, 0.6, { walk: t > V('hook', 'walked') ? t * 7 : 0, arms: [0.15, t > V('hook', 'walked') ? 0.9 : 0.15] });
            S.tag(0, 0.4, 2.2, '1911', popU(t, V('hook', 'nineteen')), -0.05, P.red, 0.7);
          }, LOUVRE);
        },
        who(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.1, 2.3, 5.8], [0, 1.45, 0], [0.05, 2.2, 5.0], [0, 1.5, 0]);
          museumShot(ctx, W, H_, E, TG, (S) => {
            thief(S, 0, 0.3, 1, 0.1, { look: 0.03 });
            S.tag(0, 0.45, 0.9, 'Vincenzo Peruggia', popU(t, V('who', 'vincenzo')), -0.04, P.red, 1.3);
            S.tag(1.1, 2.6, 0.6, 'ex-Louvre', popU(t, V('who', 'louvre')), 0.08, P.yellow, 0.85);
          }, LOUVRE);
        },
        monday(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.4, 7.4], [0, 1.2, 0], [0.1, 2.2, 6.6], [0, 1.25, 0]);
          const wx = -2.2 + Math.max(0, t - V('monday', 'he')) * 0.85;
          museumShot(ctx, W, H_, E, TG, (S) => {
            plate(S, 0.9, 1.9, -2.1, 0.75, 0.42, (c, w, h) => { c.fillStyle = '#e2402c'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = FONT(800, h * 0.32); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CLOSED', w / 2, h * 0.38); c.font = FONT(600, h * 0.17); c.fillText('MONDAY', w / 2, h * 0.72); }, P.red);
            painting(S, -0.9, 1.7, -2.3, 0.45, 0.6, 'mona');
            thief(S, wx, 0.5, 0.95, 1.2, { walk: t > V('monday', 'he') ? t * 7 : 0 });
            S.figure(1.4, -0.2, 0.9, -0.4, { shirt: [240, 240, 236], pants: [70, 70, 84], hat: null });
          }, LOUVRE, 0.35);
        },
        grab(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [-0.2, 2.2, 6.8], [0, 1.25, 0], [-0.1, 2.1, 6.1], [0, 1.3, 0]);
          const lift = ramp(t, V('grab', 'lifted'), 0.6), drop = ramp(t, V('grab', 'ditched'), 0.5), go = Math.max(0, t - V('grab', 'and'));
          museumShot(ctx, W, H_, E, TG, (S) => {
            const px = H.lerp(-0.3, 0.2, lift) + go * 1.1, py = H.lerp(1.7, 1.25, lift), pz = H.lerp(-2.25, 0.9, lift);
            if (drop < 1) painting(S, px, py, pz, 0.45, 0.6, 'mona');
            if (drop > 0) { painting(S, -1.5, H.lerp(1.25, 0.62, drop), H.lerp(0.9, 0.2, drop), 0.45, 0.6, null, FRAME_GOLD, 0.4 * drop); plate(S, 0.22 + go * 1.1, 1.18, 0.95, 0.36, 0.5, art('mona'), [90, 80, 60]); }
            thief(S, 0.2 + go * 1.1, 0.5, 0.95, go ? 1.3 : 0, { arms: [0.15 + lift, 0.15 + lift], walk: go ? t * 7 : 0 });
            S.tag(-1.5, 1.6, 0.5, 'frame', popU(t, V('grab', 'frame')), 0.08, P.yellow, 0.55);
          }, LOUVRE);
        },
        nobody(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 7.0], [0, 1.3, 0], [0.1, 2.2, 6.2], [0, 1.35, 0]);
          museumShot(ctx, W, H_, E, TG, (S) => {
            for (const dx of [-0.32, 0.32]) S.box((p) => add(p, [0.4 + dx, 2.0, -2.3]), 0.04, 0.04, 0.06, [80, 80, 80], { bevel: 0.3 });
            S.figure(-0.9 + (t - a) * 0.4, 0.4, 0.9, 1.2, { shirt: P.blue, walk: t * 6 });
            S.figure(1.2, 0.8, 0.9, -0.6, { shirt: P.green, hat: null, mouth: 'smile' });
            S.tag(0.4, 1.9, -1.9, '?', popU(t, V('nobody', 'noticed')), 0.12, P.yellow, 0.3);
            S.tag(0, 0.45, 2.2, '+1 day', popU(t, V('nobody', 'next')), -0.05, P.red, 0.8);
          }, LOUVRE);
        },
        trunk(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.8, 6.4], [0, 0.8, 0], [0.1, 2.6, 5.7], [0, 0.85, 0]);
          const open = 0.5 + 0.5 * Math.sin((t - a) * 1.5), yrs = H.clamp((t - V('trunk', 'two')) / 1.6);
          studioShot(ctx, W, H_, E, TG, (S) => {
            S.box((p) => add(p, [0, 0.45, 0]), 0.95, 0.4, 0.55, [140, 90, 52], { bevel: 0.15, paint: (c, w, h) => { c.fillStyle = '#d8a040'; c.fillRect(w * 0.45, h * 0.1, w * 0.1, h * 0.25); c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 6; c.strokeRect(10, 10, w - 20, h - 20); } });
            S.box((p) => add(rotX(add(p, [0, 0.04, 0.55]), -0.6 * open), [0, 0.86, -0.55]), 0.97, 0.04, 0.56, [120, 76, 44], { bevel: 0.3 });
            if (open > 0.3) plate(S, 0, 1.0, -0.1, 0.3, 0.4, art('mona'), [90, 80, 60], 0);
            S.tag(0, 0.25, 1.9, ['1911', '1912', '1913'][Math.min(2, Math.floor(yrs * 3))], popU(t, V('trunk', 'two')), -0.05, P.red, 0.7);
          });
        },
        caught(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.3, 2.3, 7.4], [0, 1.15, 0], [0.2, 2.1, 6.6], [0, 1.2, 0]);
          const cop = t > V('caught', 'police'), cx = cop ? H.lerp(2.6, 1.6, ramp(t, V('caught', 'police'), 0.5)) : 9;
          museumShot(ctx, W, H_, E, TG, (S) => {
            S.box((p) => add(p, [0, 0.5, -0.4]), 0.7, 0.05, 0.4, [150, 100, 64], { bevel: 0.3 }); S.box((p) => add(p, [0, 0.25, -0.4]), 0.08, 0.25, 0.08, [120, 80, 50], { bevel: 0.3 });
            plate(S, 0, 0.95, -0.45, 0.3, 0.4, art('mona'), [90, 80, 60]);
            thief(S, -1.2, 0.4, 0.95, 0.5, { arms: cop ? [2.6, 2.6] : [0.15, 0.6], mouth: cop ? 'o' : 'smile', eyes: cop ? 'wide' : 'open' });
            S.figure(1.0, 0.0, 0.95, -0.5, { shirt: [60, 120, 90], hat: null, arms: [0.15, t > V('caught', 'called') ? 2.2 : 0.15] });
            if (cop) S.figure(cx, 0.9, 1, -0.9, { shirt: [40, 60, 120], pants: [30, 40, 80], hat: 'police' });
            S.tag(0, 2.5, 0.6, 'Florence, 1913', popU(t, V('caught', 'florence')), 0.05, P.yellow, 1.2);
          }, '#5a6e8a');
          return 0.2 * Math.exp(-Math.pow((t - V('caught', 'arrested')) * 6, 2));
        },
        twist(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.0, 6.6], [0, 1.6, 0], [0, 2.0, 5.6], [0, 1.65, 0]);
          museumShot(ctx, W, H_, E, TG, (S) => {
            painting(S, 0, 2.0, -1.0, 0.65, 0.85, 'mona');
            for (let i = 0; i < 5; i++) S.figure(-1.6 + i * 0.8, 1.4 + (i % 2) * 0.4, 0.75, Math.PI, { shirt: [P.red, P.blue, P.green, P.orange, P.teal][i], arms: t > V('twist', 'superstar') ? [2.4, 2.4] : [0.15, 1.2], bob: t > V('twist', 'superstar') ? Math.abs(Math.sin(t * 6 + i)) * 0.1 : 0 });
            S.tag(0, 3.25, -0.6, 'SUPERSTAR', popU(t, V('twist', 'superstar')), 0.04, P.green, 1.1);
            confetti(S, t, V('twist', 'superstar'), 0, 1.8, 18, 3);
          }, LOUVRE);
          return 0.18 * Math.exp(-Math.pow((t - V('twist', 'superstar')) * 6, 2));
        },
        next(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 1.6, 7.4], [0, 1.4, 0], [0, 1.6, 6.6], [0, 1.4, 0]);
          skyShot(ctx, W, H_, t, E, TG, (S) => {
            plane(S, H.lerp(-0.6, 0.6, (t - a) / (b - a)), 1.5, 0, 0.9, -0.25 + Math.sin(t) * 0.05);
            S.tag(0, 0.25, 1.8, 'PART 2', popU(t, V('next', 'part')), -0.05, P.red, 0.8);
            S.tag(0.9, 2.6, 0.6, '?', popU(t, V('next', 'vanished')), 0.12, P.yellow, 0.3);
          });
        },
      };
    },
    sound: (k, fx, { V }) => {
      k.play('pop', V('hook', 'nineteen'), { f: 600, gain: 0.5 });
      for (let i = 0; i < 6; i++) k.play('tock', V('hook', 'walked') + i * 0.14, { f: 320, gain: 0.25, minor: true });
      k.play('pop', V('who', 'vincenzo'), { f: 560, gain: 0.5 }); k.play('ding', V('who', 'louvre'), { f: 'E6', gain: 0.35 });
      k.play('thud', V('monday', 'closed'), { f: 120, gain: 0.4 }); for (let i = 0; i < 8; i++) k.play('tock', V('monday', 'he') + i * 0.14, { f: 320, gain: 0.25, minor: true });
      k.play('swish', V('grab', 'lifted'), { dur: 0.3, gain: 0.5 }); fx.clack(V('grab', 'ditched') + 0.45, 1); k.play('thud', V('grab', 'ditched') + 0.45, { f: 150, gain: 0.4 });
      k.play('pop', V('nobody', 'noticed'), { f: 700, gain: 0.5 }); k.play('pop', V('nobody', 'next'), { f: 520, gain: 0.5 });
      k.play('roller', V('trunk', 'for'), { dur: 0.5, gain: 0.3 }); for (let i = 0; i < 3; i++) k.play('count', V('trunk', 'two') + i * 0.53, { gain: 0.6 });
      k.play('ding', V('caught', 'called'), { f: 'A5', gain: 0.35 }); k.play('slap', V('caught', 'arrested'), { gain: 0.6 }); k.play('thud', V('caught', 'arrested'), { f: 110, gain: 0.6 });
      k.play('impact', V('twist', 'superstar'), { gain: 0.6 }); k.play('success', V('twist', 'superstar') + 0.05, { f: 'C6', gain: 0.6 }); k.play('sparkle', V('twist', 'superstar') + 0.1, { gain: 0.5 });
      k.noise(V('next', 'part'), { dur: 2.5, color: 'pink', filter: 'lowpass', f: 600, gain: 0.08, a: 0.5 }); k.play('pop', V('next', 'part'), { f: 520, gain: 0.5 });
    },
  });
