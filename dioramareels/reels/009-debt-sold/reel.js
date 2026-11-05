(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life, X = D.fx;
  const order = ['hook', 'apt', 'letter', 'hall', 'offer', 'tower', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === 'hook' ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  const hallS = line('hall').t0;
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const city = n === 'tower' || n === 'end', room = n === 'apt' || n === 'letter';
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    X.lights(n === 'hook' || n === 'hall' ? 0.42 : 0.6);
    X.ghosts.forEach((c) => { c.visible = false; }); X.doris.visible = false;
    X.collectors.forEach((c, i) => { c.visible = n === 'hook' || n === 'hall' || n === 'offer'; const z = n === 'hook' ? 3 - Math.abs(i - 1) : n === 'offer' ? 3.4 - Math.abs(i - 1) * 0.6 : D.lerp(-7, 3, p) - Math.abs(i - 1); Y.place(c, -1.4 + i * 1.4, z, 0); c.pose({ mood: 'glare', turn: 0, phoneUp: 0 }); if (n === 'hall') Y.walk(c, t + i * 0.3); });
    let v;
    const me = room ? Y.you : X.you;
    if (n === 'hook') {
      Y.place(me, 0, 8, Math.PI);
      me.pose({ mood: 'shock', turn: Math.PI });
      v = { pos: [1500, 2.2, D.lerp(9.6, 8.2, e)], look: [1500, 2.15, 0], fov: 38, focus: [0.36, 0.86], blur: 5 };
      v = Y.shoulder(me, { dist: 3.6, up: 2.6, side: 0.9, lookY: 2.1, ahead: 6, fov: 42 });
    } else if (room) {
      Y.place(me, 0.4, 0.3, n === 'apt' ? 0.15 : Math.PI - 0.1);
      me.pose({ mood: n === 'apt' ? 'neutral' : 'nervous', phoneUp: 1, pitch: 0.15, turn: n === 'apt' ? 0.15 : Math.PI - 0.1 });
      v = n === 'apt' ? { pos: [1200.5, 2.3, D.lerp(5.6, 4.9, e)], look: [1200.4, 2.35, 0.3], fov: 36, focus: [0.46, 0.96], blur: 6 } : Y.shoulder(me, { dist: 4.8, up: 3, side: 1.1, lookY: 2, ahead: 4 });
    } else if (n === 'hall' || n === 'offer') {
      Y.place(me, 0, 8, Math.PI);
      me.pose({ mood: 'shock', turn: Math.PI });
      v = Y.shoulder(me, { dist: n === 'offer' ? 3.4 : 4.4, up: 2.7, side: 1, lookY: 2.1, ahead: 8, fov: 44 });
    } else {
      v = Y.rise(n === 'end' ? 1 : p * 0.85 + 0.15, [0, 26, 52], [0, 26, -40]);
    }
    Y.stream(city ? 1 : 0, t);
    v = X.beats(X.shake(v, t, n === 'hall' ? 0.03 : 0.012), t, beatsAt);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['YOUR BANK SOLD', 'YOUR DEBT', '*TO THEM'], t, b - 0.02, 180, 96);
    X.danger(ctx, n === 'hall' || n === 'offer' ? 0.65 : n === 'hook' ? 0.5 : 0, t);
    if (n === 'apt') D.phoneCard(ctx, { title: 'Your loan', app: 'overdue', y: 180, rows: [{ txt: '$300', sub: 'Late fee added', at: a + 0.3 }] }, t, a + 0.1, b);
    if (n === 'letter') D.toast(ctx, 'Debt transfer', 'New owner: Lot Nine Recovery', t, a + 1, b, 150);
    if (n === 'hall' && t > hallS + 0.5) D.label(ctx, 'LOT NINE RECOVERY', 360, 260, null, null, t, hallS + 0.5, 1e9, { bg: D.PINK, fg: '#fff', size: 34 });
    if (n === 'offer') D.phoneCard(ctx, { title: 'Protection Plan', app: 'Lot Nine', y: 170, rows: [{ txt: '$90 a month', sub: 'Forever', red: true, icon: '!', at: a + 0.5 }, { txt: 'Or we come back', sub: 'Tomorrow night', at: a + 1.4 }] }, t, a + 0.1, b);
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, l.shot === 'tower' ? 760 : 960));
    if (!city) { Y.balance(ctx, 18, t, 9); X.stay(ctx, 'WAIT FOR WHO REALLY OWNS THEM'); }
    if (n === 'end') D.endCard(ctx, { part: 'END GAME', sub: 'THE BANK NEVER LEFT', q1: 'WOULD YOU', q2: 'OPEN THE DOOR?' }, t, a + 0.05);
    X.flash(ctx, t, beatsAt);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.9 });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.22, gain: 0.25, minor: true }));
    for (let s = hallS; s < line('offer').t0; s += 0.5) k.play('thud', s, { f: 60, gain: 0.3, minor: true });
    k.play('error', line('offer').t0 + 0.5, { gain: 0.45 });
    k.play('impact', line('tower').t0 + 0.1, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
