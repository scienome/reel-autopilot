(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life;
  const order = ['hook', 'wake', 'fridge', 'car', 'walk', 'zero', 'rise', 'tower', 'end'];
  const start = (n) => (n === 'hook' ? 0 : L.find((l) => l.shot === n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const line = (n) => L.find((l) => l.shot === n);
  const walkL = line('walk'), wd = walkL.t1 - walkL.t0;
  const charges = [
    { at: line('wake').t0 + 0.2, amt: 20 }, { at: line('fridge').t0 + 1.4, amt: 12 }, { at: line('car').t0 + 1.6, amt: 49 },
    { at: walkL.t0 + wd * 0.2, amt: 15 }, { at: walkL.t0 + wd * 0.36, amt: 19 }, { at: walkL.t0 + wd * 0.5, amt: 29 }, { at: walkL.t0 + wd * 0.7, amt: 24 },
    { at: line('zero').t0 + 0.5, amt: 46 } ];
  const balanceAt = (t) => charges.reduce((v, c) => (t >= c.at ? v - c.amt : v), 214);
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const city = ['car', 'walk', 'zero', 'rise', 'tower', 'end'].includes(n);
    D.city.mode(city ? 'sunset' : 'interior');
    D.city.update(t);
    const me = city ? Y.youCity : Y.you;
    let v;
    if (n === 'hook') {
      Y.place(me, 1.7, 0.4, 0.15);
      me.pose({ mood: 'shock', phoneUp: 1, pitch: 0.12, turn: 0.15 });
      v = { pos: [1200 + D.lerp(1.4, 1.6, e), 2.25, D.lerp(5.6, 4.9, e)], look: [1201.7, 2.35, 0.4], fov: 36, focus: [0.48, 0.96], blur: 6 };
    } else if (n === 'wake') {
      Y.place(me, 1.5, 0.5, Math.PI - 0.2);
      me.pose({ mood: 'nervous', phoneUp: 1, pitch: 0.25, turn: Math.PI - 0.2 });
      v = Y.shoulder(me, { dist: D.lerp(5, 4.3, e), up: 2.8, side: 1.05, lookY: 1.5 });
    } else if (n === 'fridge') {
      Y.place(me, -2.0, D.lerp(0.9, 0.2, e), Math.PI);
      me.pose({ mood: 'nervous', phoneUp: 0, turn: Math.PI });
      v = Y.shoulder(me, { dist: 4.8, up: 2.9, side: 1.1, lookY: 1.8 });
    } else if (n === 'car') {
      Y.place(me, 0.9, D.lerp(14, 12.6, e), Math.PI + 0.25);
      me.pose({ mood: 'nervous', phoneUp: 0, turn: Math.PI + 0.25 });
      Y.walk(me, p < 0.5 ? t : 0);
      v = Y.shoulder(me, { dist: 5.4, up: 3, side: 1.3, lookY: 2.3, ahead: 8, fov: 44 });
    } else if (n === 'walk' || n === 'zero') {
      const q = (t - start('walk')) / (span('zero')[1] - start('walk'));
      Y.place(me, D.lerp(9, -11, q), 13.6, -Math.PI / 2);
      me.pose({ mood: n === 'zero' ? 'shock' : 'nervous', phoneUp: n === 'zero' ? 1 : 0, turn: -Math.PI / 2 });
      if (n === 'walk') Y.walk(me, t);
      v = Y.shoulder(me, { dist: 5.6, up: 3, side: 1.25, lookY: 3.2, ahead: 12, fov: 44 });
    } else {
      Y.place(me, -11, 13.6, -Math.PI / 2);
      me.pose({ mood: 'shock', phoneUp: 0, pitch: -0.3, turn: -Math.PI / 2 });
      const rs = span('rise')[0], re = span('tower')[1];
      v = Y.rise(Math.min(1, (t - rs) / (re - rs)), [-7, 2.6, 14.5]);
    }
    Y.stream(n === 'tower' || n === 'end' ? Math.min(1, (t - start('tower')) / 1.2) : n === 'rise' ? p * 0.2 : 0, t);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['YOUR ALARM', 'ASKED FOR', '*YOUR MONEY'], t, b - 0.02, 190);
    if (n === 'wake') D.toast(ctx, 'Alarm+', 'Paid $20. Thanks for waking up!', t, a + 0.1, b, 150);
    const clocks = { hook: '7:02 AM', wake: '7:02 AM', fridge: '7:30 AM', car: '8:15 AM', walk: '9:40 AM', zero: '12:00 PM' };
    if (clocks[n]) Y.clock(ctx, clocks[n], t, 0);
    if (n === 'walk') {
      [['MUSIC', 0.2, 150, 330], ['STORAGE', 0.36, 420, 420], ['SHOES', 0.5, 170, 520], ['YOUR OWN PHOTOS', 0.7, 400, 300]].forEach(([s, f, x, y]) => D.label(ctx, s, x, y, null, null, t, walkL.t0 + wd * f, 1e9, { bg: D.PINK, fg: '#fff', size: 30 }));
    }
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, l.shot === 'tower' || l.shot === 'rise' ? 760 : 985));
    if (!['rise', 'tower', 'end'].includes(n)) {
      const last = charges.filter((c) => t >= c.at).pop();
      Y.balance(ctx, balanceAt(t), t, last ? t - last.at : 9);
      charges.forEach((c) => Y.charge(ctx, '-$' + c.amt, t, c.at));
    }
    if (n === 'end') D.endCard(ctx, { part: 'END GAME', sub: 'AND YOU LIVE HERE', q1: 'WHAT WOULD YOU', q2: 'REFUSE TO RENT?' }, t, a + 0.05);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.8 });
    k.play('error', 0.3, { gain: 0.5 });
    order.slice(1).forEach((n) => k.play('whoosh', start(n), { dur: 0.28, gain: 0.3, minor: true }));
    charges.forEach((c) => k.play('error', c.at, { gain: 0.38 }));
    k.play('thud', line('zero').t0 + 0.5, { f: 58, gain: 0.8 });
    k.play('riser', start('rise'), { dur: 2.4, gain: 0.3 });
    k.play('impact', line('tower').t0 + 0.1, { gain: 0.8 });
  }
  window.REEL = { DURATION, draw, score };
})();
