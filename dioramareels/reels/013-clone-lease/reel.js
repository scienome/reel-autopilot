(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life, X = D.fx;
  const order = ['hook', 'key', 'lease', 'knock', 'door', 'rent', 'landlord', 'end'];
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === 'hook' ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  const clone = D.figure({ shirt: '#128a52', pants: '#26365f', hair: 'beanie', hairColor: '#e0218a', mood: 'calm', shoes: '#f1f1f1' });
  X.hall.add(clone);
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p), city = n === 'end', room = n === 'lease';
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    X.lights(n === 'hook' || n === 'knock' ? 0.5 : 0.8);
    X.collectors.forEach((c) => { c.visible = false; }); X.ghosts.forEach((c) => { c.visible = false; }); X.doris.visible = false;
    const showClone = n === 'hook' || n === 'door' || n === 'rent' || n === 'landlord';
    clone.visible = showClone;
    Y.place(clone, 0.9, n === 'door' ? D.lerp(1.5, 4, e) : 4, 0);
    clone.pose({ mood: 'calm', turn: 0 });
    const me = room ? Y.you : X.you;
    me.visible = !city;
    let v;
    if (n === 'hook') {
      Y.place(me, -1.5, 8.6, Math.PI);
      me.pose({ mood: 'shock', turn: Math.PI });
      v = { pos: [1500.2, 2.4, 10.8], look: [1500.2, 2.0, 3], fov: 44, focus: [0.5, 0.7], blur: 5 };
    } else if (room) {
      Y.place(me, 0.4, 0.3, Math.PI - 0.1);
      me.pose({ mood: 'nervous', phoneUp: 1, pitch: 0.15, turn: Math.PI - 0.1 });
      v = Y.shoulder(me, { dist: 4.8, up: 3, side: 1.1, lookY: 2, ahead: 4 });
    } else if (city) {
      v = Y.rise(1, [0, 26, 52], [0, 26, -40]);
    } else {
      const two = n === 'door' || n === 'rent' || n === 'landlord';
      Y.place(me, two ? -1.5 : -1.1, two ? 8.6 : n === 'key' ? D.lerp(9, 7, e) : 8, Math.PI);
      me.pose({ mood: n === 'key' ? 'nervous' : 'shock', turn: Math.PI });
      if (n === 'key') Y.walk(me, t);
      v = two ? { pos: [1500.2, 2.4, D.lerp(10.8, 10, e)], look: [1500.2, 2.0, 3], fov: 44, focus: [0.5, 0.7], blur: 5 } : Y.shoulder(me, { dist: 4.2, up: 2.7, side: 1, lookY: 2.1, ahead: 8, fov: 44 });
    }
    Y.stream(city ? 1 : 0, t);
    v = X.beats(X.shake(v, t, n === 'knock' ? 0.03 : 0.01), t, beatsAt);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['SOMEONE SIGNED', 'YOUR LEASE', '*WITH YOUR FACE'], t, b - 0.02, 180, 90);
    X.danger(ctx, n === 'door' || n === 'landlord' ? 0.4 : 0, t);
    if (n === 'key') { const q = D.screen(X.hall, [2.9, 3.4, 3]); D.label(ctx, '9D · YOUR NAME', 360, 240, null, null, t, a + 0.3, 1e9, { bg: '#1456d6', fg: '#fff', size: 38 }); }
    if (n === 'lease') D.phoneCard(ctx, { title: 'Landlord', app: 'Lease 9D', y: 170, rows: [{ txt: 'Welcome home', sub: 'Tenant: you', at: a + 0.4 }, { txt: 'Signed today', sub: 'Face ID: verified', red: true, icon: '!', at: a + 1.4 }] }, t, a + 0.1, b);
    if (n === 'door') D.label(ctx, 'TENANT 9D', 360, 240, null, null, t, a + 0.3, 1e9, { bg: D.PINK, fg: '#fff', size: 46 });
    if (n === 'rent') D.toast(ctx, 'Rent', 'Paid. On time. Again.', t, a + 0.3, b, 150);
    if (n === 'landlord') D.toast(ctx, 'Landlord', 'One tenant per name.', t, a + 0.5, b, 150);
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, 960));
    if (!city) { Y.balance(ctx, 40, t, 9); X.stay(ctx, 'WAIT FOR WHAT THE LANDLORD DECIDES'); }
    if (n === 'end') D.endCard(ctx, { part: 'END GAME', sub: 'ONE NAME. ONE TENANT.', q1: 'WOULD YOU FIGHT', q2: 'FOR YOUR NAME?' }, t, a + 0.05);
    X.flash(ctx, t, beatsAt);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.8 });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.22, gain: 0.25, minor: true }));
    k.play('thud', line('knock').t0 + 0.3, { f: 60, gain: 0.7 });
    k.play('thud', line('knock').t0 + 0.8, { f: 60, gain: 0.6 });
    k.play('buzz', line('lease').t0 + 0.8, { gain: 0.45 });
    k.play('ding', line('rent').t0 + 0.4, { gain: 0.4 });
    k.play('impact', line('landlord').t0 + 0.2, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
