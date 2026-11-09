(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life, X = D.fx, Z = D.sets;
  const order = ['hook', 'lift', 'press', 'doors', 'sign', 'owner', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === 'hook' ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  const inLift = D.figure({ shirt: '#128a52', pants: '#26365f', hair: 'beanie', hairColor: '#e0218a', mood: 'shock', shoes: '#f1f1f1' });
  inLift.position.set(0, 0.06, 0.1); Z.EL.add(inLift);
  const pct = (t) => D.lerp(70, 25, D.clamp(t / line('owner').t0, 0, 1));
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p), lift = n === 'hook' || n === 'lift' || n === 'press';
    D.city.mode('interior');
    D.city.update(t);
    X.lights(n === 'owner' ? 0.3 : 0.55);
    X.ghosts.forEach((c) => { c.visible = false; }); X.doris.visible = false;
    const flick = n === 'press' ? (Math.sin(t * 41) * Math.sin(t * 17) > 0.2 ? 0.3 : 1) : 1;
    Z.elLight.intensity = 1.1 * flick; Z.ceil.material.emissiveIntensity = 0.9 * flick;
    inLift.visible = lift; inLift.pose({ mood: n === 'press' ? 'nervous' : 'shock', yaw: 0.1 });
    const me = X.you; me.visible = !lift;
    X.collectors.forEach((c, i) => { c.visible = n === 'doors' || n === 'sign' || n === 'owner'; Y.place(c, -1.5 + i * 1.5, n === 'owner' ? -6.5 : D.lerp(-2, -6 - i, 0.6), 0); c.pose({ mood: 'neutral', turn: 0 }); });
    let v;
    if (lift) v = { pos: [1000 + D.lerp(0.2, -0.2, e), 2.3, D.lerp(6.2, 5.2, e)], look: [1000, 2.1, 0], fov: 36, focus: [0.46, 0.92], blur: 7 };
    else if (n === 'end') v = Y.rise(1, [0, 26, 52], [0, 26, -40]);
    else {
      Y.place(me, 0, n === 'doors' ? 11 : 8, Math.PI);
      me.pose({ mood: 'shock', turn: Math.PI });
      v = Y.shoulder(me, { dist: n === 'sign' ? 3.4 : 4.4, up: 2.7, side: 1, lookY: 2.1, ahead: 8, fov: 44 });
    }
    if (n === 'end') D.city.mode('night');
    v = X.beats(X.shake(v, t, n === 'press' ? 0.04 : 0.01), t, beatsAt);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['A NEW BUTTON', 'IN YOUR ELEVATOR', '*FLOOR MINUS ONE'], t, b - 0.02, 180, 90);
    X.danger(ctx, n === 'press' || n === 'owner' ? 0.45 : 0.15, t);
    if (lift) D.label(ctx, n === 'lift' ? '1' : '-1', 560, 400, null, null, t, n === 'lift' ? a + 0.3 : a + 0.1, 1e9, { bg: n === 'lift' ? '#444a60' : D.PINK, fg: '#fff', size: 70 });
    if (n === 'doors') D.label(ctx, 'GREY CLERKS', 360, 240, null, null, t, a + 0.3, 1e9, { bg: '#444a60', fg: '#fff', size: 44 });
    if (n === 'sign') D.label(ctx, 'COLLECTIONS: TOWER', 360, 240, null, null, t, a + 0.3, 1e9, { bg: D.PINK, fg: '#fff', size: 42 });
    if (n === 'owner') D.toast(ctx, 'Basement Office', 'Tower rent: DUE.', t, a + 0.6, b, 150);
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, 960));
    if (n !== 'end') { Y.balance(ctx, 20, t, 9); X.survival(ctx, pct(t)); X.stay(ctx, 'WAIT FOR WHO RUNS THE BASEMENT'); }
    if (n === 'end') D.endCard(ctx, { part: 'FLOOR -1', sub: 'EVEN THE TOWER PAYS RENT', q1: 'WHO OWNS', q2: 'THE TOWER?' }, t, a + 0.05);
    X.flash(ctx, t, beatsAt);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.7 });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.22, gain: 0.25, minor: true }));
    k.play('riser', line('press').t0, { dur: 2.5, gain: 0.3 });
    k.play('thud', line('doors').t0 + 0.1, { f: 55, gain: 0.7 });
    k.play('impact', line('owner').t0 + 0.6, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
