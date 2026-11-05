(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life;
  const order = ['hook', 'room', 'bank', 'run', 'doris', 'tower', 'back', 'end'];
  const start = (n) => (n === 'hook' ? 0 : L.find((l) => l.shot === n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const line = (n) => L.find((l) => l.shot === n);
  const sold = line('run').t1 - 0.8, gift = line('doris').t0 + 1.2;
  const moneyAt = (t) => 80 + (t >= sold ? 20 : 0) + (t >= gift ? 10 : 0);
  const backT = line('back').t0;
  const secsAt = (t) => (t >= backT ? Math.max(9, 30 - (t - backT) * 3) : 240 - (t / backT) * 210);
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const city = ['run', 'doris', 'tower'].includes(n);
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    Y.alarm.intensity = n === 'back' || n === 'end' ? 1.2 + Math.sin(t * 7) * 0.9 : 0;
    const me = city ? Y.youCity : Y.youH;
    let v;
    Y.dorisCity.visible = n === 'doris';
    if (n === 'hook') {
      Y.place(me, -1.9, 1.5, 0.28);
      me.pose({ mood: 'shock', phoneUp: 0, pitch: 0.05, turn: 0.28 });
      v = { pos: [1298.5 + e * 0.2, 2.3, D.lerp(6.6, 5.7, e)], look: [1298.2, 2.55, 1.5], fov: 36, focus: [0.48, 0.96], blur: 6 };
    } else if (n === 'room') {
      Y.place(me, -1.9, 2.1, Math.PI - 0.45);
      me.pose({ mood: 'nervous', phoneUp: 0, turn: Math.PI - 0.45 });
      v = Y.shoulder(me, { dist: D.lerp(5.6, 4.6, e), up: 3.2, side: -1.5, lookY: 1.8, ahead: 4, fov: 42, focus: [0.3, 0.86] });
    } else if (n === 'bank') {
      Y.place(me, -1.9, 2.1, 0.2);
      me.pose({ mood: 'nervous', phoneUp: 1, pitch: 0.1, turn: 0.2 });
      v = { pos: [1298.3, 2.4, 6.9], look: [1298.1, 2.55, 2.1], fov: 36, focus: [0.48, 0.96], blur: 7 };
    } else if (n === 'run') {
      Y.place(me, D.lerp(9, -1, p), 13.6, -Math.PI / 2);
      me.pose({ mood: 'nervous', phoneUp: 0, turn: -Math.PI / 2 });
      Y.walk(me, t * 1.7);
      v = Y.shoulder(me, { dist: 5.6, up: 3, side: 1.25, lookY: 3.2, ahead: 12, fov: 44 });
    } else if (n === 'doris') {
      Y.place(me, -2.4, 13.6, -Math.PI / 2);
      Y.place(Y.dorisCity, -5.6, 13.6, Math.PI / 2);
      me.pose({ mood: 'neutral', phoneUp: 0, turn: -Math.PI / 2 });
      Y.dorisCity.pose({ mood: 'calm', turn: Math.PI / 2, yaw: 0 });
      Y.dorisCity.userData.arms[1].rotation.x = -1;
      v = Y.shoulder(me, { dist: 4.6, up: 2.7, side: 1.1, lookY: 2.1, ahead: 3.2, fov: 40 });
    } else if (n === 'tower') {
      Y.place(me, -2.4, 13.6, -Math.PI / 2);
      me.pose({ mood: 'shock', pitch: -0.3, turn: -Math.PI / 2 });
      v = Y.rise(p, [1.4, 2.6, 16], [-2.4, 1.5, 13.6]);
    } else {
      Y.place(me, -1.9, 2.1, Math.PI - 0.45);
      me.pose({ mood: 'shock', phoneUp: 1, pitch: 0.2, turn: Math.PI - 0.45 });
      v = Y.shoulder(me, { dist: n === 'end' ? 5.6 : D.lerp(5.6, 4.4, e), up: 3.2, side: -1.5, lookY: 1.8, ahead: 4, fov: 42, focus: [0.3, 0.86] });
    }
    Y.stream(0, t);
    D.render3d(ctx, v);
    if (n === 'hook') D.hookCard(ctx, ['YOUR MOTHER', 'HAS 4 MINUTES', "*YOU'RE $40 SHORT"], t, b - 0.02, 240, 98);
    if (n === 'room' || n === 'back') { const mp = D.screen(Y.mom, [0, 2.3, 0]); D.label(ctx, 'MOM', mp.x + 40, mp.y - 90, mp.x, mp.y, t, a + 0.2); }
    if (n === 'bank') D.phoneCard(ctx, { title: 'CityBank Help', app: 'on hold', y: 180, rows: [{ txt: 'Please hold', sub: 'Your call matters to us', at: a + 0.3 }, { txt: 'You are caller 4,012', sub: 'Estimated wait: 3 hours', red: true, icon: '!', at: a + 1 }] }, t, a + 0.05, b);
    if (n === 'doris') { const dp = D.screen(Y.dorisCity, [0, 2.3, 0]); D.label(ctx, '6C · DORIS', dp.x, dp.y - 70, dp.x, dp.y, t, a + 0.1); }
    if (n === 'tower') { const q = D.screen(Y.dorisCity.parent, Y.towerTop()); D.label(ctx, 'OWNER OF YOUR HOSPITAL', 360, 240, q.x, q.y, t, a + 0.8 + (b - a) * 0.4); }
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, l.shot === 'tower' ? 760 : 985));
    if (n !== 'tower' && n !== 'end') {
      Y.timer(ctx, secsAt(t));
      Y.balance(ctx, moneyAt(t), t, Math.min(Math.abs(t - sold) < 0.4 ? t - sold : 9, Math.abs(t - gift) < 0.4 ? t - gift : 9));
      D.label(ctx, 'NEEDED $120', 450, 1125, null, null, t, 0, 1e9, { bg: '#fff', fg: D.INK, size: 30 });
      Y.charge(ctx, '+$20', t, sold);
      Y.charge(ctx, '+$10', t, gift);
    }
    if (n === 'end') D.endCard(ctx, { part: 'PART 2', sub: 'THE MACHINE IS WAITING', q1: 'WHO WOULD', q2: 'YOU CALL?' }, t, a + 0.05);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.8 });
    for (let s = 0.3; s < DURATION - 3; s += 1) k.play('tick', s, { gain: 0.1, minor: true });
    order.slice(1).forEach((n) => k.play('whoosh', start(n), { dur: 0.28, gain: 0.3, minor: true }));
    k.play('error', line('bank').t0 + 1.4, { gain: 0.4 });
    k.play('ding', sold, { gain: 0.35 }); k.play('ding', gift, { gain: 0.35 });
    k.play('riser', line('back').t0 - 0.6, { dur: 0.8, gain: 0.25 });
    k.play('thud', line('end').t0, { f: 58, gain: 0.8 });
  }
  window.REEL = { DURATION, draw, score };
})();
