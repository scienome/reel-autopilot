(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life, X = D.fx;
  const order = ['hook', 'wake', 'street', 'rule', 'doris', 'tower', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === 'hook' ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  const pct = (t) => D.lerp(80, 30, D.clamp(t / line('tower').t0, 0, 1));
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const city = n !== 'wake';
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t * 1.0);
    if (city) Y.windowsOn(0.35);
    const me = city ? Y.youCity : Y.you;
    Y.dorisCity.visible = n === 'doris';
    let v;
    if (n === 'hook') {
      Y.place(me, 4, 13.6, -Math.PI / 2);
      me.pose({ mood: 'shock', turn: -Math.PI / 2 });
      v = D.city.street(p * 0.4);
    } else if (n === 'wake') {
      Y.place(me, 1.5, 0.5, Math.PI - 0.2);
      me.pose({ mood: 'shock', phoneUp: 0, turn: Math.PI - 0.2 });
      v = Y.shoulder(me, { dist: D.lerp(5, 4.3, e), up: 2.8, side: 1.05, lookY: 1.5 });
    } else if (n === 'street') {
      Y.place(me, 4, 13.6, -Math.PI / 2);
      me.pose({ mood: 'shock', turn: -Math.PI / 2 });
      v = D.city.street(0.4 + p * 0.5);
    } else if (n === 'rule' || n === 'doris') {
      Y.place(me, D.lerp(8, 2, n === 'rule' ? p * 0.5 : 0.5 + p * 0.5), 13.6, -Math.PI / 2);
      me.pose({ mood: 'nervous', turn: -Math.PI / 2 });
      Y.walk(me, t);
      if (n === 'doris') { Y.place(Y.dorisCity, D.lerp(8, 2, 0.5 + p * 0.5) - 3.4, 13.9, -Math.PI / 2); Y.dorisCity.pose({ mood: 'calm', turn: -Math.PI / 2 }); Y.walk(Y.dorisCity, t * 0.9); }
      v = Y.shoulder(me, { dist: 4.8, up: 2.8, side: 1.2, lookY: 3.1, ahead: 12, fov: 44 });
    } else {
      Y.place(me, 2, 13.6, -Math.PI / 2);
      me.pose({ mood: 'shock', turn: -Math.PI / 2 });
      v = n === 'end' ? Y.rise(1, [0, 26, 52]) : Y.rise(p * 0.85 + 0.15, [-7, 2.6, 14.5]);
    }
    Y.stream(n === 'tower' || n === 'end' ? 1 : 0, t);
    v = X.beats(X.shake(v, t, 0.008), t, beatsAt);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['3:07 AM', 'THE WHOLE CITY', '*WALKS IN ITS SLEEP'], t, b - 0.02, 180, 100);
    X.danger(ctx, n === 'rule' || n === 'doris' ? 0.4 : 0.15, t);
    if (n === 'doris') { const dp = D.screen(Y.dorisCity, [0, 2.3, 0]); D.label(ctx, '6C · DORIS', dp.x, dp.y - 80, dp.x, dp.y, t, a + 0.1); D.label(ctx, 'ASLEEP', 360, 240, null, null, t, a + 0.8, 1e9, { bg: D.PINK, fg: '#fff', size: 40 }); }
    if (n === 'street') D.label(ctx, 'EYES SHUT', 360, 240, null, null, t, a + 0.3, 1e9, { bg: D.PINK, fg: '#fff', size: 46 });
    if (n === 'tower') { const q = D.screen(D.city.group, Y.towerTop()); D.label(ctx, 'NIGHT SHIFT: UNPAID', 360, 250, q.x, q.y, t, a + (b - a) * 0.5, 1e9, { bg: D.PINK, fg: '#fff', size: 38 }); }
    Y.clock(ctx, '3:07 AM', t, 0);
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, l.shot === 'tower' ? 760 : 985));
    if (n !== 'end') { X.survival(ctx, pct(t)); X.stay(ctx, 'WAIT FOR WHERE THEY ARE GOING'); }
    if (n === 'end') D.endCard(ctx, { part: 'END GAME', sub: 'EVERYONE ELSE IS ASLEEP', q1: 'WOULD YOU', q2: 'WAKE THEM UP?' }, t, a + 0.05);
    X.flash(ctx, t, beatsAt, '#bfefff');
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.7 });
    for (let i = 0; i * 5 < DURATION; i++) k.tone(i * 5, { f: 46 + (i % 2) * 5, type: 'triangle', dur: 5.1, gain: 0.1, a: 1, filter: 'lowpass', f2: 260 });
    for (let s = line('street').t0; s < line('tower').t0; s += 0.7) k.play('thud', s, { f: 50, gain: 0.2, minor: true });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.22, gain: 0.2, minor: true }));
    k.play('impact', line('tower').t0 + 0.3, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
