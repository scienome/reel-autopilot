(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life;
  const order = ['hook', 'doris', 'floors', 'floors2', 'paid', 'eyes', 'tower', 'end'];
  const start = (n) => (n === 'hook' ? 0 : L.find((l) => l.shot === n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const line = (n) => L.find((l) => l.shot === n);
  const paidAt = line('paid').t0 + 1.1;
  const f1 = line('floors'), f2 = line('floors2');
  const gifts = [[f1.t0 + 0.4, 20, '+10c  6C'], [f1.t1 - 1.2, 30, '+10c  3A'], [f2.t0 + 0.2, 40, '+10c  8B'], [f2.t0 + 0.8, 30, '+10c  5A'], [f2.t0 + 1.3, 20, '+10c  1D']];
  const moneyAt = (t) => gifts.reduce((v, g) => (t >= g[0] ? v + g[1] : v), 100);
  const daysAt = (t) => Math.max(0, Math.ceil(30 - (t / paidAt) * 30));
  const spots = [[5, 17.5], [-4.8, 8.5], [4.8, 23], [-4.8, 14.8], [4.8, 3.2]];
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const city = ['floors', 'floors2', 'tower', 'end'].includes(n);
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    Y.alarm.intensity = !city && t < paidAt ? 1.2 + Math.sin(t * 7) * 0.9 : 0;
    Y.mom.setMood(n === 'eyes' ? 'neutral' : 'calm');
    Y.dorisH.visible = n === 'doris';
    Y.windowsOn(n === 'floors' ? p * 0.45 : n === 'floors2' ? 0.45 + p * 0.55 : city ? 1 : 0.3);
    const me = Y.youH;
    let v;
    if (n === 'hook') {
      Y.place(me, -1.9, 2.1, 0.2);
      me.pose({ mood: 'shock', phoneUp: 0, turn: 0.2 });
      v = { pos: [1298.3, 2.4, D.lerp(7.4, 6.6, e)], look: [1298.1, 2.55, 2.1], fov: 36, focus: [0.48, 0.96], blur: 6 };
    } else if (n === 'doris') {
      Y.place(me, -0.5, 4, Math.PI / 2 + 0.2);
      Y.place(Y.dorisH, 2.7, 3.4, -Math.PI / 2 - 0.2);
      me.pose({ mood: 'neutral', turn: Math.PI / 2 + 0.2 });
      Y.dorisH.pose({ mood: 'calm', turn: -Math.PI / 2 - 0.2 });
      v = Y.shoulder(me, { dist: 4.2, up: 2.8, side: 1.1, lookY: 2.1, ahead: 3, fov: 42 });
    } else if (n === 'floors' || n === 'floors2') {
      v = Y.floorView(n === 'floors' ? p * 0.5 : 0.5 + p * 0.5);
    } else if (n === 'paid') {
      Y.place(me, -1.9, 2.1, Math.PI - 0.45);
      me.pose({ mood: 'shock', phoneUp: 1, pitch: 0.2, turn: Math.PI - 0.45 });
      v = Y.shoulder(me, { dist: 4.8, up: 3.2, side: -1.5, lookY: 1.8, ahead: 4, fov: 42, focus: [0.3, 0.86] });
    } else if (n === 'eyes') {
      Y.place(me, -1.9, 2.1, Math.PI - 0.45);
      me.pose({ mood: 'calm', turn: Math.PI - 0.45 });
      v = { pos: [1300.5, 3, D.lerp(3.2, 2.4, e)], look: [1300, 1.9, -1.6], fov: 34, focus: [0.3, 0.8], blur: 8 };
    } else {
      v = Y.rise(n === 'end' ? 1 : p, [0, 8, 40], [0, 10, 0]);
    }
    Y.stream(0, t);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['PRICE DOUBLED', '30 DAYS', '*$240 NEEDED'], t, b - 0.02, 240, 104);
    if (n === 'doris') { const dp = D.screen(Y.dorisH, [0, 2.3, 0]); D.label(ctx, '6C · DORIS', dp.x, dp.y - 80, dp.x, dp.y, t, a + 0.1); }
    if (n === 'floors' || n === 'floors2') gifts.forEach((g, i) => { if (t > g[0]) { const q = D.screen(D.kit.hero.building, [spots[i][0], spots[i][1], 1.6]); D.label(ctx, g[2], q.x, q.y, null, null, t, g[0], g[0] + 2.6, { bg: '#27c93f', fg: '#fff', size: 34 }); } });
    if (n === 'paid' && t > paidAt) D.toast(ctx, 'Block Plan', 'Paid by 1,200 neighbors.', t, paidAt, b + 1, 170);
    if (n === 'eyes') D.toast(ctx, 'Block Plan', 'Paid by 1,200 neighbors.', t, -1, b, 170);
    if (n === 'tower') { const q = D.screen(D.city.group, Y.towerTop()); D.label(ctx, 'FINE: $1,000,000', 360, 250, q.x, q.y, t, a + (b - a) * 0.72, 1e9, { bg: D.PINK, fg: '#fff', size: 40 }); }
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, ['tower', 'floors', 'floors2'].includes(l.shot) ? 1040 : 985));
    if (['hook', 'doris', 'paid', 'floors', 'floors2'].includes(n)) {
      if (n !== 'floors' && n !== 'floors2') { Y.balance(ctx, moneyAt(t), t, 9); D.label(ctx, daysAt(t) + ' DAYS · NEED $240', 470, 1125, null, null, t, 0, 1e9, { bg: D.PINK, fg: '#fff', size: 26 }); }
    }
    if (n === 'end') D.endCard(ctx, { part: 'PART 4?', sub: 'THE TOWER SENT A FINE', q1: 'WOULD YOU SIGN', q2: 'THE NOTEBOOK?' }, t, a + 0.05);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('thud', 0.02, { f: 70, gain: 0.8 }); k.play('thud', 0.3, { f: 70, gain: 0.7 }); k.play('thud', 0.6, { f: 70, gain: 0.7 });
    order.slice(1).forEach((n) => k.play('whoosh', start(n), { dur: 0.28, gain: 0.3, minor: true }));
    gifts.forEach((g) => k.play('ding', g[0], { gain: 0.35 }));
    k.play('success', paidAt, { gain: 0.6 });
    k.play('impact', line('tower').t1 - 1.4, { gain: 0.8 });
  }
  window.REEL = { DURATION, draw, score };
})();
