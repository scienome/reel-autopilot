(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life;
  const order = ['hook', 'sunday', 'voice', 'price', 'cut', 'silence', 'tower', 'end'];
  const start = (n) => (n === 'hook' ? 0 : L.find((l) => l.shot === n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const line = (n) => L.find((l) => l.shot === n);
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const city = n === 'tower' || n === 'end';
    D.city.mode(city ? 'night' : 'interior');
    D.city.update(t);
    Y.windowsOn(0.8);
    const me = Y.you;
    let v;
    Y.place(me, 0.4, 0.3, Math.PI - 0.1);
    if (n === 'hook') {
      Y.place(me, 0.4, 0.3, 0.15);
      me.pose({ mood: 'shock', phoneUp: 1, pitch: 0.12, turn: 0.15 });
      v = { pos: [1200.1 + e * 0.3, 2.25, D.lerp(5.6, 4.8, e)], look: [1200.4, 2.35, 0.3], fov: 36, focus: [0.48, 0.96], blur: 6 };
    } else if (n === 'sunday' || n === 'voice') {
      me.pose({ mood: n === 'voice' ? 'calm' : 'neutral', phoneUp: 1, pitch: 0.2, turn: Math.PI - 0.1 });
      v = Y.shoulder(me, { dist: D.lerp(5.4, 4.8, e), up: 3, side: 1.1, lookY: 2, ahead: 4 });
    } else if (n === 'price') {
      me.pose({ mood: 'nervous', phoneUp: 1, pitch: 0.3, turn: Math.PI - 0.1 });
      v = Y.shoulder(me, { dist: 4.6, up: 2.9, side: 1.1, lookY: 2, ahead: 4 });
    } else if (n === 'cut' || n === 'silence') {
      Y.place(me, 0.4, 0.3, 0.1);
      me.pose({ mood: n === 'cut' ? 'calm' : 'shock', phoneUp: 1, pitch: 0.1, turn: 0.1 });
      v = { pos: [1200.4, 2.3, D.lerp(4.8, 4.1, e)], look: [1200.4, 2.35, 0.3], fov: 34, focus: [0.42, 0.9], blur: 7 };
    } else {
      v = Y.rise(n === 'end' ? 1 : p * 0.8 + 0.2, [20, 30, 60], [0, 30, -40]);
    }
    Y.stream(city ? 1 : 0, t);
    D.render3d(ctx, v);
    if (n === 'hook') { D.hookCard(ctx, ['YOUR DEAD DAD', 'ASKED FOR', '*A PAYMENT'], t, b - 0.02, 190, 100); }
    if (n === 'sunday') D.phoneCard(ctx, { title: 'Dad', app: 'Forever Voice', y: 170, rows: [{ txt: 'Connected', sub: 'Every Sunday, 7 PM', at: a + 0.3 }, { txt: '$9 a month', sub: 'Keep Dad talking', at: a + 1 }] }, t, a + 0.1, b);
    if (n === 'voice') {
      const yh = D.screen(me, [0, 2.3, 0]);
      D.thought(ctx, 'Happy birthday, kiddo', 360, 420, yh.x, yh.y, t, a + 1.5, 1e9, { bg: '#ffd23f', size: 40 });
    }
    if (n === 'price') { D.toast(ctx, 'Forever Voice', 'Dad is now $18 a month', t, a + 0.1, b, 170); Y.balance(ctx, 11, t, 9); D.label(ctx, 'NEEDED $18', 440, 1125, null, null, t, 0, 1e9, { size: 30 }); }
    if (n === 'cut') { const yh = D.screen(me, [0, 2.3, 0]); D.thought(ctx, "I'm so proud of", 360, 320, yh.x, yh.y, t, line('cut').t0 + (line('cut').t1 - line('cut').t0) * 0.55, 1e9, { bg: '#ffd23f', size: 46 }); }
    if (n === 'silence') {
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, D.W, D.H);
      D.phoneCard(ctx, { title: 'Dad', app: 'Ended', y: 200, rows: [{ txt: 'Your trial has ended', sub: 'Upgrade to hear the rest', red: true, icon: '!', at: a + 0.1 }] }, t, a + 0.05, b + 1);
    }
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, l.shot === 'tower' ? 760 : 985));
    if (n === 'end') D.endCard(ctx, { part: 'END GAME', sub: 'THEY OWN HIS VOICE NOW', q1: 'WOULD YOU', q2: 'KEEP PAYING?' }, t, a + 0.05);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.8 });
    k.play('error', 0.3, { gain: 0.4 });
    order.slice(1).forEach((n) => { if (n !== 'silence') k.play('whoosh', start(n), { dur: 0.28, gain: 0.25, minor: true }); });
    k.play('error', line('price').t0 + 0.2, { gain: 0.4 });
    k.play('thud', line('silence').t0 - 0.1, { f: 52, gain: 0.8 });
    k.play('riser', start('tower'), { dur: 2, gain: 0.22 });
  }
  window.REEL = { DURATION, draw, score };
})();
