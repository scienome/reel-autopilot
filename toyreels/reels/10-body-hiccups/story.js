  // ==================== Body: the man who hiccupped for 68 years ====================
  // lungs and the diaphragm printed on a plate; tw 0..1 twitches the diaphragm, shut 0..1 closes the flap in the throat
  const chestDiagram = (tw, shut) => (c, w, h) => {
    c.fillStyle = '#fff6ea'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#f0a0a8'; for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(w / 2 + sx * w * 0.2, h * 0.5, w * 0.17, h * 0.26 + tw * h * 0.03, 0, 0, TAU); c.fill(); }
    c.strokeStyle = '#d08a6a'; c.lineWidth = w * 0.05; c.beginPath(); c.moveTo(w / 2, h * 0.05); c.lineTo(w / 2, h * 0.3); c.stroke();
    c.strokeStyle = '#c0281c'; c.lineWidth = w * 0.035; c.beginPath(); c.moveTo(w * 0.12, h * 0.82); c.quadraticCurveTo(w / 2, h * (0.62 + 0.14 * tw), w * 0.88, h * 0.82); c.stroke();
    c.fillStyle = '#c0281c'; c.font = FONT(800, h * 0.05); c.textAlign = 'center'; c.fillText('DIAPHRAGM', w / 2, h * 0.93);
    c.save(); c.translate(w / 2, h * 0.12); c.rotate(shut * 1.2); c.fillStyle = '#5a6aa0'; c.fillRect(-w * 0.01, 0, w * 0.1, h * 0.02); c.restore();
  };
  makeReel({
    badge: 'YOUR WEIRD BODY',
    badgeCol: '#2f7fd6',
    captions: { say: { 'sixty-eight years': '68 years', 'nineteen twenty-two': '1922', 'forty times': '40 times', 'four hundred and thirty million': '430 million' }, keys: { hiccupping: 'y', diaphragm: 'o', hic: 'r', osborne: 'o', hog: 'y', stopped: 'g', cure: 'g' } },
    shots: ({ V, B }) => {
      const hics = (t, a, rate = 1.2) => { const ph = ((t - a) * rate) % 1; return ph < 0.18 ? Math.sin(ph / 0.18 * Math.PI) : 0; };
      const farmer = (S, x, z, s, rot, o = {}) => S.figure(x, z, s, rot, Object.assign({ shirt: [70, 110, 180], pants: [60, 80, 140], hat: 'cap', hatCol: [200, 60, 50] }, o));
      const pig = (S, x, z, s = 1, rot = 0) => { const T = (p) => add(rotY(mul(p, s), rot), [x, 0, z]), col = [244, 168, 176]; for (const [lx, lz] of [[-0.3, -0.15], [-0.3, 0.15], [0.3, -0.15], [0.3, 0.15]]) S.box((p) => T(add(p, [lx, 0.15, lz])), 0.07, 0.15, 0.07, col, { bevel: 0.3 }); S.box((p) => T(add(p, [0, 0.45, 0])), 0.45, 0.22, 0.26, col, { bevel: 0.45 }); S.box((p) => T(add(p, [0.52, 0.5, 0])), 0.16, 0.16, 0.18, col, { bevel: 0.4, paint: (c, w, h) => { c.fillStyle = '#e07a8a'; c.beginPath(); c.ellipse(w / 2, h * 0.6, w * 0.25, h * 0.18, 0, 0, TAU); c.fill(); c.fillStyle = '#2a2a33'; c.beginPath(); c.arc(w * 0.3, h * 0.3, w * 0.05, 0, TAU); c.arc(w * 0.7, h * 0.3, w * 0.05, 0, TAU); c.fill(); } }); };
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.3, 0], [0.1, 2.2, 6.0], [0, 1.35, 0]);
          const h = hics(t, a);
          lawnShot(ctx, W, H_, t, E, TG, (S) => { farmer(S, 0, 0.4, 1, 0.1, { bob: h * 0.25, mouth: h > 0.3 ? 'o' : 'flat', eyes: h > 0.3 ? 'wide' : 'open' }); S.tag(0.9, 2.6, 0.6, 'HIC!', h, 0.15, P.red, 0.5); S.tag(0, 0.3, 1.8, '68 years', popU(t, V('hook', 'sixty-eight')), -0.05, P.red, 0.85); });
        },
        what(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.0, 6.0], [0, 1.6, 0], [0, 2.0, 5.2], [0, 1.65, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => { plate(S, 0, 1.75, -0.2, 1.1, 1.3, chestDiagram(t > V('what', 'twitching') ? hics(t, a, 1.5) : 0, 0)); });
        },
        hic(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.0, 6.0], [0, 1.6, 0], [0, 2.0, 5.0], [0, 1.65, 0]);
          const shut = ramp(t, V('hic', 'slams'), 0.12);
          studioShot(ctx, W, H_, E, TG, (S) => { plate(S, 0, 1.75, -0.2, 1.1, 1.3, chestDiagram(ramp(t, V('hic', 'air'), 0.2), shut)); S.tag(0, 0.3, 1.5, 'HIC!', popU(t, V('hic', 'hic')), -0.06, P.red, 0.55); });
          return 0.22 * Math.exp(-Math.pow((t - V('hic', 'hic')) * 6, 2));
        },
        osborne(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.3, 2.3, 7.2], [0, 1.1, 0], [0.2, 2.1, 6.4], [0, 1.15, 0]);
          const lift = ramp(t, V('osborne', 'lifting'), 0.4), fall = ramp(t, V('osborne', 'fell'), 0.3) * 0;
          lawnShot(ctx, W, H_, t, E, TG, (S) => {
            farmer(S, -0.5, 0.4, 0.95, 0.5, { arms: [0.15 + lift * 1.2, 0.15 + lift * 1.2], mouth: t > V('osborne', 'started') ? 'o' : 'smile', bob: t > V('osborne', 'started') ? hics(t, a) * 0.2 : 0 });
            pig(S, 0.7, 0.5, 1.1, -0.4 + fall);
            S.tag(0, 0.3, 1.8, '1922', popU(t, V('osborne', 'nineteen')), -0.05, P.red, 0.7);
            S.tag(-0.5, 2.8, 0.4, 'HIC!', t > V('osborne', 'started') ? hics(t, a) : 0, 0.15, P.red, 0.5);
          });
        },
        years(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.3, 0], [0.1, 2.2, 6.0], [0, 1.35, 0]);
          const y = Math.round(1922 + 68 * H.clamp((t - a) / ((b - a) * 0.8)));
          studioShot(ctx, W, H_, E, TG, (S) => {
            farmer(S, 0, 0.2, 1, 0, { bob: hics(t, a, 2.5) * 0.15, mouth: 'o', shirt: y > 1960 ? [150, 150, 160] : [70, 110, 180] });
            for (let i = 0; i < 3; i++) S.tag(-1.0 + i, 2.5 + (i % 2) * 0.3, 0.3, 'HIC', hics(t, a + i * 0.13, 2.5), 0.1 * (i - 1), P.red, 0.4);
            S.tag(0, 0.3, 1.8, String(y), 1, -0.05, P.red, 0.7);
            S.tag(1.1, 1.4, 0.8, '40 / min', popU(t, V('years', 'forty')), 0.05, P.orange, 0.8);
          });
        },
        total(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.4, 7.2], [0, 1.2, 0], [0, 2.2, 6.4], [0, 1.25, 0]);
          const u = H.clamp((t - V('total', 'four')) / 1.5), n = Math.round(430e6 * H.ease.out(u));
          studioShot(ctx, W, H_, E, TG, (S) => {
            const nb = Math.floor(u * 30); for (let i = 0; i < nb; i++) S.brick(-1.2 + (i % 6) * 0.48, Math.floor(i / 6) * 0.38, -0.4, 1, 1, [P.red, P.orange, P.yellow][i % 3], 0, 0);
            S.tag(0, 0.3, 1.8, n.toLocaleString('en-US'), popU(t, V('total', 'four')), -0.05, P.red, 1.25);
          });
        },
        stop(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.3, 0], [0.1, 2.2, 6.0], [0, 1.35, 0]);
          const st = t > V('stop', 'stopped');
          lawnShot(ctx, W, H_, t, E, TG, (S) => { farmer(S, 0, 0.3, 1, 0, { shirt: [150, 150, 160], bob: st ? 0 : hics(t, a) * 0.15, mouth: st ? 'smile' : 'o' }); if (!st) S.tag(0.9, 2.6, 0.5, 'HIC!', hics(t, a), 0.15, P.red, 0.5); brickTick(S, 0.9, 2.6, 0.5, popU(t, V('stop', 'stopped')), 1.1); });
        },
        cta(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.8], [0, 1.3, 0], [0, 2.1, 6.0], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => { S.figure(-0.6, 0.4, 0.95, 0.4, { shirt: P.orange, bob: hics(t, a) * 0.15, mouth: 'o' }); S.cyl((p) => add(p, [0.8, 0, 0.4]), 0.18, 0.5, [180, 220, 255], 14); S.tag(0, 2.7, 0.6, '?', popU(t, V('cta', 'cure')), 0.12, P.yellow, 0.32); });
        },
      };
    },
    sound: (k, fx, { V, B }) => {
      const hic = (t, g = 0.6) => { k.tone(t, { f: [[0, 520], [0.08, 300]], type: 'triangle', dur: 0.12, gain: 0.25 * g }); k.noise(t, { dur: 0.04, filter: 'bandpass', f: 1800, q: 2, gain: 0.3 * g }); };
      for (let i = 0; i < 3; i++) hic(B('hook') + 0.05 + i / 1.2); k.play('pop', V('hook', 'sixty-eight'), { f: 600, gain: 0.5 });
      hic(V('hic', 'hic'), 1.2); k.play('slap', V('hic', 'slams'), { gain: 0.5 });
      k.play('pop', V('osborne', 'nineteen'), { f: 600, gain: 0.5 }); k.play('thud', V('osborne', 'fell'), { f: 90, gain: 0.5 }); for (let i = 0; i < 3; i++) hic(V('osborne', 'started') + i / 1.2);
      for (let i = 0; i < 14; i++) hic(B('years') + 0.05 + i / 2.5, 0.5); k.play('pop', V('years', 'forty'), { f: 560, gain: 0.5 });
      for (let i = 0; i < 30; i++) fx.seat(V('total', 'four') + i * 0.05, 0.35); for (let f = 0; f < 15; f++) k.play('count', V('total', 'four') + f * 0.1, { gain: 0.4, minor: true });
      k.play('success', V('stop', 'stopped'), { f: 'C6', gain: 0.5 });
      k.play('pop', V('cta', 'cure'), { f: 700, gain: 0.5 });
    },
  });
