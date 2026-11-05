(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Z = D.sets;
  const order = ['hook', 'wide', 'think', 'turn', 'rule1', 'rule2', 'twist', 'reveal', 'end'];
  const start = (n) => (n === 'hook' ? 0 : L.find((l) => l.shot === n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const line = (n) => L.find((l) => l.shot === n);
  const youO = { shirt: '#128a52', pants: '#26365f', hair: 'beanie', hairColor: '#e9a9bb', mood: 'shock', shoes: '#f1f1f1' };
  const dorO = { shirt: '#7d4fc0', pants: '#6b5b8c', hair: 'bun', hairColor: '#c9c9cf', glasses: true, mood: 'calm', skin: '#f0c7a6', shoes: '#7a3b4a' };
  const you = D.figure(youO), dor = D.figure(dorO), youM = D.figure(youO), dorM = D.figure(dorO);
  you.position.set(-0.78, 0.06, 0.1); dor.position.set(0.78, 0.06, 0.1);
  Z.EL.add(you, dor);
  [[youM, -0.5], [dorM, 0.5]].forEach(([f, x]) => { f.scale.setScalar(0.85); f.position.set(x, 0.1, -0.5); Z.car.add(f); });

  const views = {
    hook: (p) => ({ pos: [99.22, 2.3, D.lerp(5.6, 4.9, p)], look: [99.22, 2.45, 0], focus: [0.5, 0.95], blur: 7 }),
    wide: (p) => ({ pos: [D.lerp(2.5, 0.1, p), D.lerp(9.5, 7.4, p), D.lerp(34, 10, p)], look: [0, D.lerp(8, 7.2, p), 0], focus: [0.42, 0.68], blur: 8 }),
    think: (p) => ({ pos: [99.3, 2.3, D.lerp(7, 6.2, p)], look: [99.5, 2.5, 0], focus: [0.45, 0.95], blur: 7 }),
    turn: (p) => ({ pos: [100.78, 2.05, D.lerp(5, 3.6, p)], look: [100.78, 2.0, 0], focus: [0.3, 0.8], blur: 9 }),
    rule1: (p) => ({ pos: [99.2, 2.35, D.lerp(7.5, 6.9, p)], look: [99.2, 2.35, 0], focus: [0.5, 0.95], blur: 8 }),
    rule2: (p) => ({ pos: [100 + D.lerp(0.25, -0.25, p), 2.3, D.lerp(9.2, 8.4, p)], look: [100, 2.25, 0], focus: [0.45, 0.92], blur: 6 }),
    twist: (p) => ({ pos: [100, 2.3, D.lerp(9.6, 8.8, p)], look: [100, 2.1, 0], focus: [0.42, 0.9], blur: 6 }),
    reveal: (p) => ({ pos: [100.78, 2.05, D.lerp(3.6, 2.9, p)], look: [100.78, 2.0, 0], focus: [0.3, 0.8], blur: 9 }),
    end: () => ({ pos: [100, 2.3, 9.4], look: [100, 2.1, 0], focus: [0.42, 0.9], blur: 6 }),
  };

  function setPose(n, t, p) {
    const dark = n === 'twist' || n === 'reveal' || n === 'end';
    const flick = n === 'twist' && p < 0.3 ? (Math.sin(t * 47) * Math.sin(t * 19) > 0.1 ? 0.25 : 1) : 1;
    Z.elLight.intensity = 2.4 * (dark ? 0.7 : 1) * flick;
    Z.ceil.material.emissiveIntensity = 1.1 * (dark ? 0.7 : 1) * flick;
    const breathe = Math.sin(t * 2.2) * 0.012;
    const turned = n === 'turn' ? -1.0 * D.ease(p * 1.2) : ['rule1', 'rule2', 'twist', 'reveal', 'end'].includes(n) ? -0.75 : 0;
    dor.pose({ yaw: n === 'reveal' ? -0.15 : turned, mood: n === 'turn' || dark || n === 'rule2' || n === 'rule1' ? 'glare' : 'calm', bob: breathe });
    you.pose({ yaw: n === 'think' ? 0.5 : n === 'rule1' ? 0 : n === 'rule2' ? 0.3 : 0.1, mood: n === 'think' ? 'sideR' : n === 'rule1' ? 'nervous' : n === 'rule2' ? 'sideR' : 'shock', pitch: n === 'rule1' ? -0.1 : 0, bob: -breathe });
    you.position.x = -0.78 + (n === 'hook' || n === 'rule2' ? Math.sin(t * 60) * 0.008 : 0);
  }

  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1);
    setPose(n, t, p);
    D.render3d(ctx, views[n](D.ease(p)));
    const yh = D.screen(you, [0, 2.3, 0]), dh = D.screen(dor, [0, 2.3, 0]);
    if (n === 'hook') D.hookCard(ctx, ['EVERYONE', 'CAN HEAR', '*YOUR THOUGHTS'], t, b - 0.02);
    if (n === 'think') D.thought(ctx, 'is that a wig?', 400, 500, yh.x + 30, yh.y, t, line('think').t0 + (line('think').t1 - line('think').t0) * 0.5);
    if (n === 'turn') D.label(ctx, '6C · DORIS', 520, 320, dh.x, dh.y + 40, t, a + 0.1);
    if (n === 'turn') D.thought(ctx, 'is that a wig?', 240, 190, null, null, t, a, b, { size: 28, bg: 'rgba(255,255,255,.9)' });
    if (n === 'rule1') {
      D.rule(ctx, 1, 'THINK OF SOMETHING BORING', t, a + 0.05, b, 190);
      const l = line('rule1'), d = l.t1 - l.t0;
      D.thought(ctx, 'taxes... taxes...', 380, 560, yh.x + 20, yh.y, t, l.t0 + d * 0.62);
    }
    if (n === 'rule2') {
      D.rule(ctx, 2, "DON'T THINK ABOUT THE WIG", t, a + 0.05, b, 190);
      const l = line('rule2'), d = l.t1 - l.t0;
      [[150, 590], [320, 520], [480, 590], [230, 690], [90, 720]].forEach(([x, y], i) => D.thought(ctx, 'WIG', x, y, null, null, t, l.t0 + d * (0.72 + i * 0.07), 1e9, { size: 34, bg: i % 2 ? D.PINK : '#fff', fg: i % 2 ? '#fff' : D.INK }));
    }
    if (n === 'twist') D.thought(ctx, '...?', 545, 500, dh.x, dh.y, t, line('twist').t0 + 0.6, 1e9, { bg: D.PINK, fg: '#fff', size: 44 });
    if (n === 'reveal') D.thought(ctx, 'I KNOW ABOUT THE WIFI', 360, 330, 370, 520, t, a + 0.08, 1e9, { bg: D.PINK, fg: '#fff', size: 46 });
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, ['think', 'rule1', 'turn'].includes(l.shot) ? 985 : l.shot === 'rule2' ? 1000 : 845));
    if (n === 'end') D.endCard(ctx, { part: 'PART 2', sub: 'DORIS KNOWS EVERYTHING', q1: 'WHAT THOUGHT WOULD', q2: 'RUIN YOUR LIFE?' }, t, a + 0.05);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.8 });
    order.slice(1).forEach((n) => k.play('whoosh', start(n), { dur: 0.28, gain: 0.3, minor: true }));
    L.forEach((l) => k.play('pop', l.t0, { f: 420, gain: 0.15, minor: true }));
    [line('rule1'), line('rule2')].forEach((l) => k.play('stamp', l.t0, { gain: 0.55 }));
    const r = line('rule2'), d = r.t1 - r.t0;
    [0, 1, 2, 3, 4].forEach((i) => k.play('pop', r.t0 + d * (0.72 + i * 0.07), { f: 300 + i * 90, gain: 0.3, minor: true }));
    k.play('riser', line('reveal').t0 - 0.8, { dur: 0.8, gain: 0.25 });
    k.play('impact', line('reveal').t0 + 0.05, { gain: 0.8 });
  }
  window.REEL = { DURATION, draw, score };
})();
