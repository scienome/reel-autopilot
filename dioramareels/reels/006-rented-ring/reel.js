(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life;
  const order = ['hook', 'rent', 'vows', 'lock', 'guests', 'off', 'tower', 'end'];
  const start = (n) => (n === 'hook' ? 0 : L.find((l) => l.shot === n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const line = (n) => L.find((l) => l.shot === n);
  const X = 1400;
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const city = n === 'tower' || n === 'end';
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    const locked = n === 'hook' || n === 'lock' || n === 'guests' || n === 'off';
    Y.ringGlow(locked, t);
    Y.groom.pose({ mood: n === 'rent' || n === 'vows' ? 'calm' : 'shock', phoneUp: n === 'vows' && p > 0.5 ? 1 : 0 });
    Y.bride.pose({ mood: locked ? 'shock' : 'calm', yaw: n === 'off' ? 0.3 : 0 });
    Y.bride.userData.arms[0].rotation.x = n === 'off' ? -1.4 + Math.sin(t * 14) * 0.1 : -1.1;
    Y.guests.forEach((g, i) => g.pose({ mood: n === 'guests' ? 'shock' : 'neutral', yaw: n === 'guests' ? (i % 2 ? 0.5 : -0.5) : 0 }));
    let v;
    if (n === 'hook') v = { pos: [X + 1.3, 2.3, D.lerp(4.4, 3.7, e)], look: [X + 1, 1.95, -1], fov: 36, focus: [0.42, 0.92], blur: 6 };
    else if (n === 'rent') v = { pos: [X - 0.3, 2.4, D.lerp(2.5, 1.9, e)], look: [X + 0.5, 1.75, -1], fov: 42, focus: [0.3, 0.9], blur: 6 };
    else if (n === 'vows') v = { pos: [X, 2.4, D.lerp(6.8, 5.6, e)], look: [X, 2, -1], fov: 38, focus: [0.3, 0.9], blur: 6 };
    else if (n === 'lock') v = { pos: [X + 0.9, 1.75, D.lerp(2.8, 2.1, e)], look: [X + 0.75, 1.5, -0.4], fov: 34, focus: [0.3, 0.82], blur: 8 };
    else if (n === 'guests') v = { pos: [X, 2.3, D.lerp(-2.1, -1.7, e)], look: [X, 1.8, 6], fov: 70, focus: [0.3, 0.9], blur: 5 };
    else if (n === 'off') v = { pos: [X + 1.1, 2, D.lerp(3.6, 3), 2.9], look: [X + 0.9, 1.75, -0.6], fov: 34, focus: [0.3, 0.86], blur: 8 };
    else v = Y.rise(n === 'end' ? 1 : p * 0.8 + 0.2, [-20, 30, 60], [0, 30, -40]);
    if (n === 'off') v.pos = [X + 1.1, 2, D.lerp(3.6, 2.9, e)];
    Y.stream(city ? 1 : 0, t);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['YOUR RING', 'GOT', '*CANCELLED'], t, b - 0.02, 190, 112);
    if (n === 'rent') { const q = D.screen(Y.bride, [-0.4, 1.25, 0.65]); D.label(ctx, 'RING: RENTED', 360, 200, q.x, q.y, t, a + 0.4); D.label(ctx, '$90 / MONTH', 360, 262, null, null, t, a + 1.2, 1e9, { bg: D.PINK, fg: '#fff' }); }
    if (n === 'vows' && p > 0.45) D.toast(ctx, 'Ring+', 'Payment failed. Ring locked.', t, a + (b - a) * 0.45, b, 150);
    if (n === 'lock') D.label(ctx, 'RING LOCKED', 360, 300, null, null, t, a + 0.2, 1e9, { bg: D.PINK, fg: '#fff', size: 44 });
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, l.shot === 'tower' ? 760 : 985));
    if (n === 'end') D.endCard(ctx, { part: 'END GAME', sub: 'EVEN YOUR PROMISE IS RENTED', q1: 'WOULD YOU', q2: 'STILL SAY YES?' }, t, a + 0.05);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.8 });
    k.play('error', 0.3, { gain: 0.5 });
    order.slice(1).forEach((n) => k.play('whoosh', start(n), { dur: 0.28, gain: 0.28, minor: true }));
    k.play('buzz', line('vows').t1 - 1, { gain: 0.6 });
    k.play('error', line('lock').t0, { gain: 0.5 });
    k.play('thud', line('guests').t0, { f: 58, gain: 0.7 });
    k.play('riser', start('tower'), { dur: 2, gain: 0.25 });
  }
  window.REEL = { DURATION, draw, score };
})();
