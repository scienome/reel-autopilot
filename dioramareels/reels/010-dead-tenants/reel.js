(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life, X = D.fx;
  const order = ['hook', 'tower', 'cheap', 'ledger', 'door', 'phone', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === 'hook' ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p), city = n === 'tower';
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    if (city) Y.windowsOn(0.02);
    X.lights(Math.sin(t * 17) * Math.sin(t * 7) > 0.35 ? 0.1 : 0.3);
    X.collectors.forEach((c) => { c.visible = false; }); X.doris.visible = false;
    const show = n === 'hook' || n === 'door' || n === 'phone' || n === 'end';
    X.ghosts.forEach((g, i) => { g.visible = show; const z = n === 'hook' ? 1 - i * 0.4 : n === 'door' ? D.lerp(12, 8.2, p) : 7.4; Y.place(g, -1.6 + i * 1.7, z, n === 'hook' ? 0 : Math.PI); g.pose({ mood: 'neutral', turn: n === 'hook' ? 0 : Math.PI }); X.setGhost(g, 0.4 + Math.sin(t * 3 + i) * 0.12); });
    const me = X.you;
    let v;
    if (n === 'hook') {
      Y.place(me, 0, 6, Math.PI);
      me.pose({ mood: 'shock', turn: Math.PI });
      v = Y.shoulder(me, { dist: 3.8, up: 2.7, side: 1, lookY: 2.1, ahead: 6, fov: 44 });
    } else if (city) {
      v = Y.floorView(p);
    } else if (n === 'cheap') {
      Y.place(me, 0, D.lerp(9, 5, p), Math.PI);
      me.pose({ mood: 'neutral', turn: Math.PI });
      Y.walk(me, t);
      v = Y.shoulder(me, { dist: 4.6, up: 2.8, side: 1, lookY: 2.1, ahead: 8, fov: 44 });
    } else if (n === 'ledger') {
      Y.place(me, 0, 5, Math.PI);
      me.pose({ mood: 'nervous', phoneUp: 1, pitch: 0.25, turn: Math.PI });
      v = Y.shoulder(me, { dist: 4.2, up: 2.8, side: 1, lookY: 2, ahead: 8, fov: 42 });
    } else {
      Y.place(me, 0, 5, Math.PI);
      me.pose({ mood: 'shock', phoneUp: n === 'phone' ? 1 : 0, turn: Math.PI, yaw: 0 });
      v = { pos: [1500.2, 2.3, D.lerp(1.6, 2.2, e)], look: [1500, 2, 12], fov: 44, focus: [0.34, 0.92], blur: 6 };
    }
    v = X.beats(X.shake(v, t, n === 'door' ? 0.02 : 0.008), t, beatsAt);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['FLOOR 9 IS DEAD', 'THEY STILL', '*PAY RENT'], t, b - 0.02, 180, 96);
    X.danger(ctx, n === 'door' || n === 'phone' ? 0.5 : 0.15, t);
    if (n === 'tower') { const q = D.screen(D.kit.hero.building, [0, 25.5, 1.6]); D.label(ctx, 'FLOOR 9', 360, 180, q.x, q.y, t, a + 0.3, 1e9, { bg: D.PINK, fg: '#fff', size: 44 }); }
    if (n === 'ledger') D.phoneCard(ctx, { title: 'Rent book', app: 'Floor 9', y: 170, rows: [{ txt: '9A  died 1994', sub: 'PAID', at: a + 0.6 }, { txt: '9B  died 2003', sub: 'PAID', at: a + 1.2 }, { txt: '9C  died 2011', sub: 'PAID', at: a + 1.8 }, { txt: '9D  YOU', sub: 'Move-in date: today', red: true, icon: '!', at: a + 2.6 }] }, t, a + 0.1, b);
    if (n === 'phone') D.toast(ctx, 'Tower Lease', 'Renewed. Term: forever.', t, a + 0.3, b, 150);
    Y.clock(ctx, '3:07 AM', t, 0);
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, 960));
    if (n !== 'end') X.stay(ctx, 'WAIT FOR THE LAST NAME IN THE BOOK');
    if (n === 'end') D.endCard(ctx, { part: 'FLOOR 9', sub: 'YOUR NAME IS IN THE BOOK', q1: 'WOULD', q2: 'YOU STAY?' }, t, a + 0.05);
    X.flash(ctx, t, beatsAt, '#bfefff');
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.8 });
    for (let i = 0; i * 5 < DURATION; i++) k.tone(i * 5, { f: 46 + (i % 2) * 5, type: 'triangle', dur: 5.1, gain: 0.1, a: 1, filter: 'lowpass', f2: 260 });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.24, gain: 0.22, minor: true }));
    k.play('thud', line('door').t0 + 0.1, { f: 54, gain: 0.8 });
    k.play('buzz', line('phone').t0 + 0.3, { gain: 0.5 });
    k.play('impact', line('end').t0, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
