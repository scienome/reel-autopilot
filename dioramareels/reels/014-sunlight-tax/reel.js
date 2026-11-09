(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life;
  const order = ['hook', 'wake', 'meter', 'walk', 'mirror', 'tower', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === 'hook' ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const city = n !== 'hook' && n !== 'wake';
    D.city.mode(!city ? 'interior' : n === 'mirror' ? 'day' : n === 'tower' || n === 'end' ? 'sunset' : 'night');
    D.city.update(t);
    const me = city ? Y.youCity : Y.you;
    let v;
    if (n === 'hook') {
      Y.place(me, 0.8, 0.6, 0.15);
      me.pose({ mood: 'shock', phoneUp: 0, turn: 0.15 });
      v = { pos: [1200.6, 2.3, D.lerp(5.8, 5, e)], look: [1200.8, 2.3, 0.4], fov: 36, focus: [0.46, 0.96], blur: 6 };
    } else if (n === 'wake') {
      Y.place(me, 1.5, 0.5, Math.PI - 0.2);
      me.pose({ mood: 'nervous', phoneUp: 1, pitch: 0.25, turn: Math.PI - 0.2 });
      v = Y.shoulder(me, { dist: D.lerp(5, 4.3, e), up: 2.8, side: 1.05, lookY: 1.5 });
    } else if (n === 'tower' || n === 'end') {
      Y.place(me, -11, 13.6, -Math.PI / 2);
      me.pose({ mood: 'shock', turn: -Math.PI / 2 });
      v = Y.rise(n === 'end' ? 1 : p, [-7, 2.6, 14.5]);
    } else {
      const q = n === 'meter' ? p * 0.3 : n === 'walk' ? 0.3 + p * 0.5 : 0.8 + p * 0.2;
      Y.place(me, D.lerp(9, -11, q), 13.6, -Math.PI / 2);
      me.pose({ mood: n === 'mirror' ? 'calm' : 'nervous', turn: -Math.PI / 2 });
      if (n !== 'mirror') Y.walk(me, t);
      v = Y.shoulder(me, { dist: 5.6, up: 3, side: 1.25, lookY: 3.2, ahead: 12, fov: 44 });
    }
    Y.stream(n === 'tower' || n === 'end' ? 1 : 0, t);
    v = D.fx.beats(v, t, beatsAt);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['SOMEONE BOUGHT', 'THE SUN', '*YOU PAY FOR DAYLIGHT'], t, b - 0.02, 180, 96);
    if (n === 'wake') D.toast(ctx, 'SunPass', 'Daylight unpaid. Window blacked out.', t, a + 0.2, b, 150);
    if (n === 'meter') D.label(ctx, 'SUNLIGHT $9 / HOUR', 360, 240, null, null, t, a + 0.2, 1e9, { bg: '#ffb01f', fg: '#2a1a00', size: 44 });
    if (n === 'walk') { D.label(ctx, 'YOUR STREET: SHADE', 200, 300, null, null, t, a + 0.2, 1e9, { size: 32 }); D.label(ctx, 'RICH BLOCK: NOON', 480, 420, null, null, t, a + 1.2, 1e9, { bg: '#ffb01f', fg: '#2a1a00', size: 32 }); }
    if (n === 'mirror') D.label(ctx, 'FREE LIGHT', 360, 240, null, null, t, a + 0.4, 1e9, { bg: '#27c93f', fg: '#fff', size: 52 });
    if (n === 'tower') { const q = D.screen(D.city.group, Y.towerTop()); D.label(ctx, 'NOTICE: SUN THEFT', 360, 250, q.x, q.y, t, a + (b - a) * 0.4, 1e9, { bg: D.PINK, fg: '#fff', size: 40 }); }
    const clocks = { hook: '7:00 AM', wake: '7:00 AM', meter: '7:30 AM', walk: '8:10 AM' };
    if (clocks[n]) Y.clock(ctx, clocks[n], t, 0);
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, l.shot === 'tower' ? 760 : 985));
    if (n !== 'end') { Y.balance(ctx, 36, t, 9); D.fx.stay(ctx, 'WAIT FOR WHAT THE KID DOES'); }
    if (n === 'end') D.endCard(ctx, { part: 'END GAME', sub: 'EVEN THE SUN HAS AN OWNER', q1: 'WOULD YOU', q2: 'SHARE THE LIGHT?' }, t, a + 0.05);
    D.fx.flash(ctx, t, beatsAt, '#ffe9a8');
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.7 });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.24, gain: 0.25, minor: true }));
    k.play('error', line('wake').t0 + 0.8, { gain: 0.4 });
    k.play('success', line('mirror').t0 + 1.5, { gain: 0.5 });
    k.play('impact', line('tower').t0 + 0.2, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
