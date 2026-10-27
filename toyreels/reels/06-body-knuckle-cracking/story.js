  // ==================== Body: does cracking your knuckles cause arthritis? ====================
  // a cutaway of a finger joint printed on a plate: two bone ends in a capsule of fluid; gap 0..1 pulls them apart,
  // bubble 0..1 grows a gas bubble
  const jointDiagram = (gap, bubble, label) => (c, w, h) => {
    c.fillStyle = '#fff6ea'; c.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, g = gap * h * 0.08;
    c.fillStyle = 'rgba(120,190,255,0.55)'; c.beginPath(); c.ellipse(cx, cy, w * 0.3, h * 0.2 + g, 0, 0, TAU); c.fill();
    c.strokeStyle = '#3a7ac0'; c.lineWidth = w * 0.012; c.stroke();
    c.fillStyle = '#f2ead8'; c.strokeStyle = '#b8a888'; c.lineWidth = w * 0.01;
    c.beginPath(); c.roundRect(cx - w * 0.14, h * 0.02, w * 0.28, cy - h * 0.06 - g - h * 0.02, w * 0.1); c.fill(); c.stroke();
    c.beginPath(); c.roundRect(cx - w * 0.14, cy + h * 0.06 + g, w * 0.28, h * 0.98 - cy - h * 0.06 - g, w * 0.1); c.fill(); c.stroke();
    const r = H.rng(4); c.fillStyle = 'rgba(40,90,170,0.5)'; for (let i = 0; i < 14; i++) { c.beginPath(); c.arc(cx + r.range(-w * 0.24, w * 0.24), cy + r.range(-h * 0.03, h * 0.03), w * 0.01, 0, TAU); c.fill(); }
    if (bubble > 0) { c.fillStyle = 'rgba(255,255,255,0.95)'; c.strokeStyle = '#3a7ac0'; c.beginPath(); c.arc(cx, cy, w * 0.09 * bubble, 0, TAU); c.fill(); c.stroke(); }
    if (label) { c.fillStyle = '#2a3a5a'; c.font = FONT(800, h * 0.05); c.textAlign = 'left'; c.fillText(label, w * 0.05, h * 0.52); }
  };
  makeReel({
    badge: 'YOUR WEIRD BODY',
    badgeCol: '#2f7fd6',
    captions: { say: { 'twenty minutes': '20 minutes', 'fifty years': '50 years' }, keys: { arthritis: 'r', gas: 'y', pop: 'o', bubble: 'y', unger: 'o', neither: 'g', nobel: 'y', left: 'y', right: 'y' } },
    shots: ({ V }) => {
      const hand = (S, x, y, z, s, curl = 0, col = P.skin) => { S.box((p) => add(mul(p, s), [x, y, z]), 0.45, 0.42, 0.14, col, { bevel: 0.3 }); for (let i = 0; i < 4; i++) { const fx = x + (-0.33 + i * 0.22) * s; S.box((p) => add(mul(rotX(add(p, [0, 0.2, 0]), -curl), s), [fx, y + 0.42 * s, z]), 0.09, 0.2, 0.1, col, { bevel: 0.4 }); S.box((p) => add(mul(rotX(add(p, [0, 0.2, 0]), -curl * 1.6), s), [fx, y + (0.42 + 0.4 * Math.cos(curl)) * s, z + 0.4 * Math.sin(curl) * s]), 0.085, 0.17, 0.095, col, { bevel: 0.4 }); } S.box((p) => add(rotZ(mul(p, s), 0.6), [x + 0.52 * s, y + 0.1 * s, z]), 0.09, 0.22, 0.1, col, { bevel: 0.4 }); };
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.2, 6.6], [0, 1.3, 0], [0.1, 2.1, 5.8], [0, 1.35, 0]);
          const c = Math.abs(Math.sin((t - a) * 4)) * 0.5;
          studioShot(ctx, W, H_, E, TG, (S) => { hand(S, 0.4, 0.9, 0, 1.3, c); S.figure(-1.3, 0.6, 0.85, 0.5, { shirt: P.teal, mouth: 'o', eyes: 'wide' }); S.tag(0, 0.3, 1.8, 'arthritis?', popU(t, V('hook', 'arthritis')), -0.05, P.red, 1.0); });
        },
        inside(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.0, 6.0], [0, 1.6, 0], [0, 2.0, 5.3], [0, 1.65, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => { plate(S, 0, 1.75, -0.2, 1.1, 1.3, jointDiagram(0, 0, t > V('inside', 'fluid') ? 'fluid' : '')); S.tag(0, 0.3, 1.5, 'dissolved gas', popU(t, V('inside', 'gas')), -0.05, P.blue, 1.1); });
        },
        pop(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.0, 6.0], [0, 1.6, 0], [0, 2.0, 5.1], [0, 1.65, 0]);
          const gap = ramp(t, V('pop', 'pull'), 0.5), bub = popU(t, V('pop', 'bubble'), 0.25);
          studioShot(ctx, W, H_, E, TG, (S) => { plate(S, 0, 1.75, -0.2, 1.1, 1.3, jointDiagram(gap, bub, '')); S.tag(0, 0.3, 1.5, 'POP!', popU(t, V('pop', "that's")), -0.05, P.orange, 0.6); });
          return 0.2 * Math.exp(-Math.pow((t - V('pop', 'bubble')) * 6, 2));
        },
        wait(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.4], [0, 1.4, 0], [0, 2.2, 5.6], [0, 1.45, 0]);
          const m = Math.min(20, Math.floor(H.clamp((t - V('wait', 'wait')) / 1.4) * 20));
          studioShot(ctx, W, H_, E, TG, (S) => { clock(S, 0, 1.9, -0.3, 1.2, (m / 60) * 12 / 12 + 0.0001); hand(S, -1.2, 0.3, 0.6, 0.8, 0.2); S.tag(0, 0.3, 1.6, m + ' min', popU(t, V('wait', 'wait')), -0.05, m >= 20 ? P.green : P.red, 0.75); S.brick(1.3, 0, 0.8, 1, 1, P.yellow); });
        },
        unger(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.3, 0], [0.1, 2.2, 6.0], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            S.figure(0, 0.2, 1, 0, { shirt: P.white, pants: [60, 70, 100], hat: null, arms: [2.4, 2.4], look: 0 });
            const cr = Math.floor((t - a) * 3) % 2; S.tag(-1.2, 2.9, 0.5, 'crack', t > V('unger', 'cracked') ? (cr ? 1 : 0.85) : 0, -0.1, P.orange, 0.6);
            S.tag(1.2, 2.9, 0.5, 'never', popU(t, V('unger', 'never')), 0.1, P.blue, 0.6);
            S.tag(0, 0.3, 1.6, '50+ years', popU(t, V('unger', 'fifty')), -0.05, P.red, 0.9);
            S.tag(-1.2, 1.2, 0.8, 'LEFT', popU(t, V('unger', 'left')), -0.05, P.yellow, 0.5); S.tag(1.2, 1.2, 0.8, 'RIGHT', popU(t, V('unger', 'right')), 0.05, P.yellow, 0.55);
          });
        },
        result(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.8], [0, 1.4, 0], [0, 2.2, 6.0], [0, 1.45, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            hand(S, -0.85, 0.6, 0, 0.9, 0); hand(S, 0.85, 0.6, 0, 0.9, 0);
            brickTick(S, -0.85, 2.3, 0.3, popU(t, V('result', 'neither')), 1); brickTick(S, 0.85, 2.3, 0.3, popU(t, V('result', 'neither') + 0.15), 1);
            const tr = popU(t, V('result', 'nobel')); if (tr > 0) { S.cyl((p) => add(mul(p, tr), [0, 0.0, 1.3]), 0.25, 0.1, P.yellow, 14); S.cyl((p) => add(mul(p, tr), [0, 0.1 * tr, 1.3]), 0.06, 0.3, P.yellow, 10); S.cyl((p) => add(mul(p, tr), [0, 0.4 * tr, 1.3]), 0.3, 0.35, P.yellow, 16); }
            S.tag(0, 3.0, 0.4, 'Ig Nobel Prize', popU(t, V('result', 'nobel')), 0.04, P.orange, 1.15);
          });
          return 0.16 * Math.exp(-Math.pow((t - V('result', 'neither')) * 6, 2));
        },
        cta(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 7.0], [0, 1.3, 0], [0.1, 2.1, 6.2], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => { S.figure(-0.6, 0.4, 0.95, 0.4, { shirt: P.orange, arms: [1.0, 1.0] }); S.figure(0.8, 0.4, 0.95, -0.4, { shirt: P.blue, hat: null, mouth: 'frown' }); S.tag(0, 2.7, 0.6, '?', popU(t, V('cta', 'cracker')), 0.12, P.yellow, 0.32); });
        },
      };
    },
    sound: (k, fx, { V, B }) => {
      for (let i = 0; i < 4; i++) k.noise(B('hook') + 0.3 + i * 0.4, { dur: 0.02, filter: 'highpass', f: 3000, gain: 0.5 });
      k.play('pop', V('hook', 'arthritis'), { f: 500, gain: 0.5 }); k.play('pop', V('inside', 'gas'), { f: 640, gain: 0.5 });
      k.play('riser', V('pop', 'pull'), { dur: 0.6, gain: 0.3 }); k.noise(V('pop', 'bubble'), { dur: 0.03, filter: 'highpass', f: 2500, gain: 0.9 }); k.play('pop', V('pop', 'bubble'), { f: 300, gain: 0.8 }); k.play('impact', V('pop', "that's"), { gain: 0.5 });
      for (let i = 0; i < 20; i++) k.play('tick', V('wait', 'wait') + i * 0.07, { f: 2400, gain: 0.3, minor: true }); k.play('ding', V('wait', 'twenty') + 0.4, { f: 'E6', gain: 0.4 });
      for (let i = 0; i < 6; i++) k.noise(V('unger', 'cracked') + i * 0.33, { dur: 0.02, filter: 'highpass', f: 3000, gain: 0.4, minor: true }); k.play('pop', V('unger', 'fifty'), { f: 560, gain: 0.5 });
      k.play('success', V('result', 'neither'), { f: 'C6', gain: 0.5 }); ['C5', 'E5', 'G5', 'C6'].forEach((f, i) => k.play('ding', V('result', 'nobel') + i * 0.08, { f, gain: 0.35 }));
      k.play('pop', V('cta', 'cracker'), { f: 700, gain: 0.5 });
    },
  });
