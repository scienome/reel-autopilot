(() => {
  const TM = window.TIMING, L = TM.lines, Y = D.life, X = D.fx, HOLD = 5;
  const order = ['hook', 'dark', 'floor', 'steps', 'a', 'b', 'pick', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const pickT = line('pick').t1, shift = (t) => (t > pickT ? HOLD : 0);
  const DURATION = TM.duration + HOLD;
  const start = (n) => { const b = n === 'hook' ? 0 : line(n).t0 - 0.1; return n === 'end' ? b + HOLD : b; };
  const beatsAt = L.map((l) => l.t0 + (l.shot === 'end' ? HOLD : 0));
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const pct = (t) => D.lerp(68, 9, D.clamp(t / pickT, 0, 1));
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p), city = n === 'dark';
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    X.collectors.forEach((c) => { c.visible = false; }); X.ghosts.forEach((c) => { c.visible = false; }); X.doris.visible = false;
    X.lights(city ? 1 : (Math.sin(t * 31) * Math.sin(t * 13) > 0.3 ? 0.12 : 0.5));
    const me = X.you;
    Y.place(me, 0, n === 'hook' ? -2 : n === 'floor' ? 5 : -2.5, Math.PI);
    me.pose({ mood: n === 'steps' ? 'shock' : 'nervous', phoneUp: n === 'floor' ? 1 : 0, turn: n === 'steps' ? 0.2 : Math.PI, yaw: 0 });
    if (n === 'steps') Y.place(me, 0, 4, 0.25);
    let v;
    if (n === 'hook') v = { pos: [1500 + D.lerp(-0.8, 0.5, e), 2.3, D.lerp(5, 3.4, e)], look: [1500, 1.9, -9], fov: 44, focus: [0.36, 0.84], blur: 5 };
    else if (city) v = D.city.orbit(p, 130, 80);
    else if (n === 'floor') v = Y.shoulder(me, { dist: 4.6, up: 2.8, side: 1, lookY: 2, ahead: 8, fov: 44 });
    else if (n === 'steps') v = { pos: [1500.3, 2.25, D.lerp(8, 7, e)], look: [1500.1, 2.3, 4], fov: 36, focus: [0.4, 0.96], blur: 6 };
    else if (n === 'a') v = { pos: [1498.5, 2.3, D.lerp(0, -4, e)], look: [1498.5, 2, -9], fov: 44, focus: [0.3, 0.9], blur: 5 };
    else if (n === 'b') v = { pos: [1501.5, 2.3, D.lerp(0, -4, e)], look: [1501.5, 2, -9], fov: 44, focus: [0.3, 0.9], blur: 5 };
    else v = { pos: [1500, 2.4, 3.2], look: [1500, 2, -9], fov: 46, focus: [0.3, 0.9], blur: 5 };
    v = X.beats(X.shake(v, t, n === 'steps' || n === 'pick' ? 0.05 : 0.012), t, beatsAt);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['ONLY 1 DOOR', 'GETS YOU OUT', '*ALIVE'], t, b - 0.02, 190, 104);
    X.danger(ctx, n === 'steps' || n === 'pick' || n === 'end' ? 0.75 : 0.25, t);
    if (n === 'a') D.label(ctx, 'FREE', 360, 300, null, null, t, a + 0.2, 1e9, { bg: '#d6102a', fg: '#fff', size: 60 });
    if (n === 'b') D.label(ctx, '$50', 360, 300, null, null, t, a + 0.2, 1e9, { bg: '#1456d6', fg: '#fff', size: 60 });
    Y.clock(ctx, '3:07 AM', t, 0);
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, 960));
    if (t < pickT + 0.1) { Y.balance(ctx, 50, t, 9); X.survival(ctx, pct(t)); X.stay(ctx, 'ONLY 1 DOOR IS SAFE. STAY TO THE END.'); }
    X.choice(ctx, t, pickT - 0.8, pickT + HOLD, 'FREE DOOR|NOBODY CAME BACK', 'YOUR LAST $50|WHO IS BEHIND IT?');
    if (n === 'end') D.endCard(ctx, { part: 'A OR B?', sub: 'THE ANSWER IS TOMORROW', q1: 'COMMENT', q2: 'YOUR DOOR' }, t, a + 0.05);
    X.flash(ctx, t, beatsAt);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.9 });
    for (let s = 0.5; s < DURATION - 3; s += 0.75) k.play('thud', s, { f: 52, gain: 0.16, minor: true });
    L.forEach((l) => k.play('whoosh', l.t0 + shift(l.t0 + 0.01) * (l.shot === 'end' ? 1 : 0), { dur: 0.22, gain: 0.25, minor: true }));
    for (let i = 0; i < 5; i++) k.play('tick', pickT + i, { gain: 0.6 });
    k.play('impact', pickT + HOLD, { gain: 0.8 });
  }
  window.REEL = { DURATION, draw, score };
})();
