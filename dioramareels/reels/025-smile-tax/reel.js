// 025-smile-tax: The cameras charge you for frowning (Elites Endgame city reel, fiction)
(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, Y = D.life, X = D.fx, Z = D.sets;
  const S = {"balance": [50, 5], "stay": "WAIT FOR WHO NEVER SMILES", "riser": "face", "twist": "owner", "end": {"part": "SMILE TAX", "sub": "THE OWNER NEVER PAYS", "q1": "WOULD YOU", "q2": "FAKE IT?"}, "shots": [{"id": "hook", "p": "streetcam", "mode": "day", "q0": 0, "q1": 0.3, "hook": ["THE CAMERAS", "RATE YOUR SMILE", "*FROWNING COSTS"], "bal": 50}, {"id": "score", "p": "street", "mode": "day", "q0": 0.1, "q1": 0.3, "mood": "nervous", "labels": [["SMILE: 4/10", 360, 240, 0.3, "#ec2c5a", "#fff", 52]], "bal": 48, "charge": "-$2"}, {"id": "face", "p": "street", "mode": "day", "q0": 0.3, "q1": 0.55, "mood": "calm", "labels": [["FROWN AT 3:12 PM: -$5", 360, 240, 0.6, "#ec2c5a"]], "bal": 33, "charge": "-$15"}, {"id": "doris", "p": "street", "mode": "sunset", "q0": 0.55, "q1": 0.7, "doris": true, "dorisMood": "calm", "thoughts": [["genius", 520, 330, 0.8]], "bal": 20}, {"id": "owner", "p": "rise", "mode": "sunset", "stream": true, "labels": [["OWNER: 0/10, EXEMPT", 360, 250, 0.5, "#ec2c5a"]], "bal": 5}, {"id": "end", "p": "end", "mode": "night"}]};
  const order = S.shots.map((s) => s.id);
  const line = (n) => L.find((l) => l.shot === n);
  const start = (n) => (n === order[0] ? 0 : line(n).t0 - 0.1);
  const span = (n) => { const i = order.indexOf(n); return [start(n), i + 1 < order.length ? start(order[i + 1]) : DURATION]; };
  const beatsAt = L.map((l) => l.t0);
  const shotOf = (n) => S.shots.find((s) => s.id === n);
  const inLift = D.figure({ shirt: '#128a52', pants: '#26365f', hair: 'beanie', hairColor: '#e0218a', mood: 'shock', shoes: '#f1f1f1' });
  inLift.position.set(0, 0.06, 0.1); Z.EL.add(inLift);
  const CLOSE = { aptFront: 1, aptClose: 1, lift: 1, hall: 1 };
  const P = {
    aptFront: (s, p, e) => { const me = Y.you; Y.place(me, 0.6, 0.4, 0.15); me.pose({ mood: s.mood || 'shock', phoneUp: s.phone ? 1 : 0, pitch: 0.12, turn: 0.15 }); return { pos: [1200.4 + e * 0.3, 2.3, D.lerp(5.8, 4.9, e)], look: [1200.6, 2.3, 0.4], fov: 36, focus: [0.46, 0.96], blur: 6 }; },
    aptBack: (s, p, e) => { const me = Y.you; Y.place(me, 1.5, 0.5, Math.PI - 0.2); me.pose({ mood: s.mood || 'nervous', phoneUp: s.phone === 0 ? 0 : 1, pitch: 0.25, turn: Math.PI - 0.2 }); return Y.shoulder(me, { dist: D.lerp(5, 4.3, e), up: 2.8, side: 1.05, lookY: 1.5 }); },
    aptClose: (s, p, e) => { const me = Y.you; Y.place(me, 0.4, 0.3, 0.1); me.pose({ mood: s.mood || 'shock', phoneUp: s.phone ? 1 : 0, pitch: 0.1, turn: 0.1 }); return { pos: [1200.4, 2.3, D.lerp(4.8, 4.1, e)], look: [1200.4, 2.35, 0.3], fov: 34, focus: [0.42, 0.9], blur: 7 }; },
    street: (s, p, e, t) => {
      const me = Y.youCity, q0 = s.q0 ?? 0, q1 = s.q1 ?? 0.5, x = D.lerp(9, -11, D.lerp(q0, q1, p));
      Y.place(me, x, 13.6, -Math.PI / 2); me.pose({ mood: s.mood || 'nervous', phoneUp: s.phone ? 1 : 0, turn: -Math.PI / 2 });
      if (!s.still) Y.walk(me, t);
      if (s.doris) { Y.place(Y.dorisCity, x - 3.2, 13.9, -Math.PI / 2); Y.dorisCity.pose({ mood: s.dorisMood || 'calm', turn: -Math.PI / 2 }); Y.walk(Y.dorisCity, t * 0.9); }
      return Y.shoulder(me, { dist: 5.6, up: 3, side: 1.25, lookY: 3.2, ahead: 12, fov: 44 });
    },
    streetcam: (s, p) => { Y.place(Y.youCity, 4, 13.6, -Math.PI / 2); Y.youCity.pose({ mood: s.mood || 'shock', turn: -Math.PI / 2 }); return D.city.street(D.lerp(s.q0 ?? 0, s.q1 ?? 0.5, p)); },
    orbit: (s, p) => D.city.orbit(D.lerp(s.q0 ?? 0, s.q1 ?? 1, p), 130, 80),
    dive: (s, p) => D.city.dive(D.lerp(s.q0 ?? 0, s.q1 ?? 1, p)),
    ferris: (s, p) => D.city.ferris(D.lerp(s.q0 ?? 0, s.q1 ?? 1, p)),
    lift: (s, p, e) => { inLift.pose({ mood: s.mood || 'shock', yaw: 0.1 }); return { pos: [1000 + D.lerp(0.2, -0.2, e), 2.3, D.lerp(6.2, 5.2, e)], look: [1000, 2.1, 0], fov: 36, focus: [0.46, 0.92], blur: 7 }; },
    hall: (s, p, e) => {
      const me = X.you; me.visible = true; Y.place(me, 0, D.lerp(s.z0 ?? 11, s.z1 ?? 8, e), Math.PI); me.pose({ mood: s.mood || 'shock', phoneUp: s.phone ? 1 : 0, turn: Math.PI });
      X.lights(s.dim ?? 0.6);
      if (s.collectors) X.collectors.forEach((c, i) => { c.visible = true; Y.place(c, -1.5 + i * 1.5, -5 - i * 0.5, 0); c.pose({ mood: 'glare', turn: 0 }); });
      if (s.ghosts) X.ghosts.forEach((g, i) => { g.visible = true; Y.place(g, -1.6 + i * 1.6, -2 - i, 0); g.pose({ mood: 'calm', turn: 0 }); });
      if (s.doris) { X.doris.visible = true; Y.place(X.doris, 1.2, 2, -Math.PI / 2); X.doris.pose({ mood: s.dorisMood || 'shock', turn: -Math.PI / 2 }); }
      return Y.shoulder(me, { dist: s.dist ?? 4.4, up: 2.7, side: 1, lookY: 2.1, ahead: 8, fov: 44 });
    },
    floors: (s, p) => Y.floorView(D.lerp(s.q0 ?? 0, s.q1 ?? 1, p)),
    rise: (s, p) => Y.rise(p * 0.8 + 0.2, [0, 26, 52], [0, 26, -40]),
    end: () => Y.rise(1, [0, 26, 52], [0, 26, -40]),
  };
  const val = (v, p) => (Array.isArray(v) ? D.lerp(v[0], v[1], p) : v);
  let money = S.balance ? S.balance[0] : 0, lastHit = -9;
  function draw(ctx, t) {
    let n = order[0];
    order.forEach((s) => { if (t >= start(s)) n = s; });
    const s = shotOf(n), [a, b] = span(n), p = D.clamp((t - a) / (b - a), 0, 1), e = D.ease(p);
    const inside = s.p === 'aptFront' || s.p === 'aptBack' || s.p === 'aptClose' || s.p === 'lift' || s.p === 'hall';
    D.city.mode(s.mode || (inside ? 'interior' : 'night'));
    D.city.update(t);
    if (s.windows != null) Y.windowsOn(s.windows);
    X.ghosts.forEach((c) => { c.visible = false; }); X.collectors.forEach((c) => { c.visible = false; }); X.doris.visible = false; X.you.visible = false;
    Y.dorisCity.visible = !!(s.p === 'street' && s.doris);
    inLift.visible = s.p === 'lift';
    let v = P[s.p](s, p, e, t);
    Y.stream(s.stream ? 1 : 0, t);
    v = X.beats(X.shake(v, t, s.shake ?? 0.008), t, beatsAt);
    D.render3d(ctx, v);
    if (s.hook) D.hookCard(ctx, s.hook, t, b - 0.02, 180, s.hookSize || 96);
    if (s.danger) X.danger(ctx, s.danger, t);
    if (s.clock) Y.clock(ctx, s.clock, t, a);
    (s.labels || []).forEach((l) => D.label(ctx, l[0], l[1], l[2], null, null, t, a + (l[3] || 0.2), 1e9, { bg: l[4] || D.PINK, fg: l[5] || '#fff', size: l[6] || 42 }));
    (s.thoughts || []).forEach((l) => D.thought(ctx, l[0], l[1], l[2], null, null, t, a + (l[3] || 0.3), 1e9, { bg: l[4] || '#ffd23f', fg: l[5] || D.INK, size: l[6] || 38 }));
    if (s.toast) D.toast(ctx, s.toast[0], s.toast[1], t, a + (s.toast[2] || 0.3), b, 150);
    if (s.phone_card) D.phoneCard(ctx, { title: s.phone_card.title, app: s.phone_card.app, y: 170, rows: s.phone_card.rows.map((r) => ({ ...r, at: a + (r.at || 0.3) })) }, t, a + 0.1, b);
    if (s.rule) D.rule(ctx, s.rule[0], s.rule[1], t, a + 0.05, b, 200);
    if (s.choice) X.choice(ctx, t, a + 0.2, b, s.choice[0], s.choice[1]);
    const capY = s.capY || (CLOSE[s.p] ? 960 : 845);
    L.forEach((l) => { if (l.shot === n) D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, capY); });
    if (S.balance && n !== 'end') {
      const want = s.bal != null ? s.bal : null;
      if (want != null && Math.abs(want - money) > 0.5 && t > a + 0.4) { if (t - lastHit > 1) { lastHit = t; } money = want; }
      Y.balance(ctx, money, t, t - lastHit);
      if (s.charge) Y.charge(ctx, s.charge, t, a + 0.4);
    }
    if (S.survival && n !== 'end') X.survival(ctx, D.lerp(S.survival[0], S.survival[1], D.clamp(t / DURATION, 0, 1)));
    if (S.stay && n !== 'end') X.stay(ctx, S.stay);
    if (n === 'end') D.endCard(ctx, S.end, t, a + 0.05);
    X.flash(ctx, t, beatsAt);
    D.fiction(ctx);
  }
  function score(k) {
    k.play('impact', 0.02, { gain: 0.7 });
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.22, gain: 0.25, minor: true }));
    if (S.riser && line(S.riser)) k.play('riser', line(S.riser).t0, { dur: 2.5, gain: 0.3 });
    if (S.twist && line(S.twist)) { k.play('thud', line(S.twist).t0 + 0.1, { f: 55, gain: 0.7 }); k.play('impact', line(S.twist).t0 + 0.6, { gain: 0.7 }); }
    S.shots.forEach((s) => { if (s.charge && line(s.id)) k.play('impact', line(s.id).t0 + 0.4, { gain: 0.35 }); });
  }
  window.REEL = { DURATION, draw, score };
})();
