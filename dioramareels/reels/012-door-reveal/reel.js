(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life, X = D.fx;
  const order = ['hook', 'dark', 'a', 'out', 'b', 'man', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === 'hook' ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  const pct = (t) => (t < start('a') ? 9 : t < start('b') ? D.lerp(9, 100, D.clamp((t - start('a')) / 4, 0, 1)) : t < start('man') ? D.lerp(60, 4, D.clamp((t - start('b')) / 4, 0, 1)) : 4);
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p), city = n === 'out' || n === 'end';
    D.city.mode(city ? 'sunset' : 'interior');
    D.city.update(t);
    if (city) Y.windowsOn(0.2);
    X.ghosts.forEach((c) => { c.visible = false; }); X.doris.visible = false;
    X.lights(n === 'man' ? 0.35 : n === 'dark' ? 0.5 : 0.85);
    const man = X.collectors[1];
    X.collectors.forEach((c) => { c.visible = false; });
    man.visible = n === 'man';
    Y.place(man, 0.8, D.lerp(-8, -1, e), 0); man.pose({ mood: 'glare', turn: 0 }); Y.walk(man, t);
    const me = X.you;
    Y.place(me, n === 'a' ? -1.5 : n === 'b' ? 1.5 : 0, n === 'hook' || n === 'dark' ? 3 : n === 'man' ? 2 : -4.5, Math.PI);
    me.pose({ mood: n === 'a' ? 'calm' : n === 'man' ? 'shock' : 'nervous', turn: Math.PI });
    me.visible = !city;
    let v;
    if (n === 'hook') v = Y.shoulder(me, { dist: 3.8, up: 2.7, side: 1, lookY: 2.1, ahead: 8, fov: 44 });
    else if (n === 'dark') v = { pos: [1500, 2.3, D.lerp(9, 7.4, e)], look: [1500, 2, -9], fov: 44, focus: [0.36, 0.9], blur: 5 };
    else if (n === 'a') v = Y.shoulder(me, { dist: 3.6, up: 2.5, side: 0.9, lookY: 2, ahead: 4, fov: 44 });
    else if (n === 'b') v = Y.shoulder(me, { dist: 3.6, up: 2.5, side: -0.9, lookY: 2, ahead: 4, fov: 44 });
    else if (n === 'man') v = Y.shoulder(me, { dist: 3.4, up: 2.7, side: 1, lookY: 2.1, ahead: 6, fov: 44 });
    else v = D.city.orbit(n === 'end' ? 1 : p, 110, 60);
    v = X.beats(X.shake(v, t, n === 'man' ? 0.03 : 0.01), t, beatsAt);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['DOOR A OR B?', 'THE ANSWER', '*IS HERE'], t, b - 0.02, 190, 100);
    X.danger(ctx, n === 'man' || n === 'b' ? 0.7 : n === 'dark' ? 0.4 : 0, t);
    if (n === 'a') D.label(ctx, 'STAIRS TO THE STREET', 360, 240, null, null, t, a + 0.2, 1e9, { bg: '#27c93f', fg: '#fff', size: 40 });
    if (n === 'out') D.label(ctx, 'THEY MADE IT OUT', 360, 240, null, null, t, a + 0.2, 1e9, { bg: '#27c93f', fg: '#fff', size: 44 });
    if (n === 'b') D.label(ctx, 'LOCKED LIFT', 360, 240, null, null, t, a + 0.2, 1e9, { bg: '#1456d6', fg: '#fff', size: 52 });
    if (n === 'man') D.label(ctx, 'DOOR B SALESMAN', 360, 240, null, null, t, a + 0.3, 1e9, { bg: D.PINK, fg: '#fff', size: 40 });
    Y.clock(ctx, '3:07 AM', t, 0);
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, 960));
    if (n !== 'end') { X.survival(ctx, pct(t)); X.stay(ctx, 'WAIT FOR WHAT WAS BEHIND DOOR B'); }
    if (n === 'end') D.endCard(ctx, { part: 'A OR B?', sub: 'FREE WAS THE WAY OUT', q1: 'WHICH DOOR', q2: 'DID YOU PICK?' }, t, a + 0.05);
    X.flash(ctx, t, beatsAt);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.8 });
    for (let s = 0.5; s < DURATION - 3; s += 0.8) k.play('thud', s, { f: 52, gain: 0.14, minor: true });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.22, gain: 0.25, minor: true }));
    k.play('success', line('a').t0 + 2.2, { gain: 0.5 });
    k.play('error', line('b').t0 + 2, { gain: 0.45 });
    k.play('impact', line('man').t0 + 0.1, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
