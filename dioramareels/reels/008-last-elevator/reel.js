(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life, X = D.fx;
  const order = ['hook', 'tower', 'lift', 'pay', 'doris', 'close', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === 'hook' ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  const paid = line('pay').t0 + 1.2;
  const endT = line('end').t0;
  const pct = (t) => D.lerp(52, 8, D.clamp(t / endT, 0, 1));
  const lvl = (t) => D.lerp(0.45, 1, D.clamp(t / endT, 0, 1));
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p), city = n === 'tower';
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    if (city) Y.windowsOn(1);
    X.lights(Math.sin(t * 27) * Math.sin(t * 11) > 0.25 ? 0.2 : 0.55);
    X.collectors.forEach((c) => { c.visible = false; }); X.ghosts.forEach((c) => { c.visible = false; });
    const me = X.you;
    X.doris.visible = n === 'doris' || n === 'close' || n === 'end';
    Y.place(X.doris, 0.9, 8, Math.PI);
    X.doris.pose({ mood: 'shock', turn: Math.PI });
    let v;
    if (n === 'hook') {
      Y.place(me, 0, 0, 0.2);
      me.pose({ mood: 'shock', phoneUp: 0, turn: 0.2 });
      v = { pos: [1500.3, 2.3, D.lerp(5.4, 4.5, e)], look: [1500.1, 2.5, 0], fov: 36, focus: [0.46, 0.96], blur: 6 };
    } else if (city) {
      v = Y.floorView(p);
    } else if (n === 'lift' || n === 'pay') {
      Y.place(me, 1.3, -4.5, Math.PI);
      me.pose({ mood: 'nervous', phoneUp: n === 'pay' ? 1 : 0, turn: Math.PI });
      v = Y.shoulder(me, { dist: 4.2, up: 2.8, side: -0.9, lookY: 2, ahead: 4, fov: 42 });
    } else {
      Y.place(me, 1.3, -6.5, 0.1);
      me.pose({ mood: 'shock', turn: 0.1 });
      v = { pos: [1501.4, 2.5, D.lerp(-9, -8.2, e)], look: [1500.9, 2.1, 8], fov: 38, focus: [0.3, 0.92], blur: 5 };
      v.pos = [1502.2, 2.9, -8.9];
    }
    v = X.beats(X.shake(v, t, 0.03), t, beatsAt);
    D.render3d(ctx, v);
    X.danger(ctx, lvl(t), t);
    if (n === 'hook') D.hookCard(ctx, ['BUILDING ON FIRE', 'THE ELEVATOR', '*WANTS YOUR CARD'], t, b - 0.02, 190, 92);
    if (n === 'lift') D.rule(ctx, 1, 'PREMIUM MEMBERS ONLY', t, a + 0.1, b, 200);
    if (n === 'pay') D.toast(ctx, 'LiftPass', 'Paid $50. 1 seat. No refunds.', t, a + 0.4, b, 150);
    if (n === 'doris' || n === 'close') { const q = D.screen(X.doris, [0, 2.3, 0]); D.label(ctx, '6C · DORIS', q.x, q.y - 80, q.x, q.y, t, a + 0.1); }
    if (n === 'close') D.label(ctx, '7', 360, 240, null, null, t, a + 0.3, 1e9, { bg: D.PINK, fg: '#fff', size: 90 });
    if (n === 'tower') { D.label(ctx, 'FLOOR 9', 360, 220, null, null, t, a + 0.2, 1e9, { bg: D.PINK, fg: '#fff', size: 44 }); }
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, 960));
    if (n !== 'end') { Y.balance(ctx, t >= paid ? 0 : 50, t, Math.abs(t - paid) < 0.4 ? t - paid : 9); X.survival(ctx, pct(t)); X.stay(ctx, 'ONE SEAT LEFT. WATCH WHO GETS IT.'); }
    if (n === 'end') D.endCard(ctx, { part: 'ONE SEAT', sub: 'THE DOORS ARE CLOSING', q1: 'DO YOU GIVE', q2: 'HER YOUR SEAT?' }, t, a + 0.05);
    X.flash(ctx, t, beatsAt, '#ffb08a');
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.9 });
    for (let s = 0.4; s < DURATION - 2; s += 0.6) k.play('thud', s, { f: 56, gain: 0.18, minor: true });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.22, gain: 0.25, minor: true }));
    k.play('error', paid, { gain: 0.45 });
    k.play('riser', line('close').t0, { dur: 2.5, gain: 0.3 });
    k.play('impact', endT, { gain: 0.8 });
  }
  window.REEL = { DURATION, draw, score };
})();
