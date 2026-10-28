  // Dave reel 30: the bat bomb (Project X-Ray, 1943). Bats carrying tiny timed incendiaries escaped during a test, roosted
  // under a fuel tank and set Carlsbad's auxiliary airfield on fire, a general's car included. Dave parked next to it. R.I.P. Dave #29.
  const BAT = [70, 56, 52];
  // a bat (big model in the lab): body, ears, two flapping wings and the little incendiary capsule
  const bat = (S, c, s, t, bomb = true) => { const T = (p) => add(mul(p, s), c), fl = Math.sin(t * 9) * 0.5;
    S.ico(T([0, 0, 0]), [0.12 * s, 0.1 * s, 0.2 * s], BAT, { sub: 1 }); S.ico(T([0, 0.06, 0.18]), 0.07 * s, BAT, { sub: 1 });
    for (const sx of [-1, 1]) { S.quad([T([sx * 0.08, 0.02, 0.1]), T([sx * 0.55, 0.05 + fl * 0.3, 0.15]), T([sx * 0.5, fl * 0.3 - 0.05, -0.15]), T([sx * 0.08, 0, -0.1])], shade(BAT, 0.85)); S.box((p) => T(add(p, [sx * 0.04, 0.14, 0.2])), 0.02, 0.04, 0.01, BAT, { bevel: 0.3 }); }
    if (bomb) S.cyl((p) => T(add(rotX(p, Math.PI / 2), [0, -0.12, -0.08])), 0.035, 0.16, [200, 70, 50], 8); };
  // flat 2D bat silhouettes swarming
  const swarm = (ctx, W, H_, t, n, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#231a1e'; const r = H.rng(9); for (let i = 0; i < n; i++) { const x = (r() * W + t * r.range(40, 120)) % W, y = H_ * r.range(0.1, 0.5) + Math.sin(t * 3 + i) * 20, f = Math.sin(t * 14 + i) * 8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y - 6 - f); ctx.lineTo(x - 8, y + 2); ctx.lineTo(x, y + 5); ctx.lineTo(x + 8, y + 2); ctx.lineTo(x + 18, y - 6 - f); ctx.closePath(); ctx.fill(); } ctx.restore(); };
  const flames = (ctx, S, pts, t, size = 1) => { ctx.save(); for (const [i, p] of pts.entries()) { const q = S.proj(p), h = (50 + 20 * Math.sin(t * 13 + i * 2)) * size, w = 26 * size; const g = ctx.createLinearGradient(0, q[1], 0, q[1] - h); g.addColorStop(0, 'rgba(255,240,170,0.95)'); g.addColorStop(0.5, 'rgba(255,140,50,0.9)'); g.addColorStop(1, 'rgba(220,60,30,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(q[0] - w, q[1]); ctx.quadraticCurveTo(q[0] - w * 0.6, q[1] - h * 0.6, q[0] + Math.sin(t * 9 + i) * 8, q[1] - h); ctx.quadraticCurveTo(q[0] + w * 0.6, q[1] - h * 0.6, q[0] + w, q[1]); ctx.fill(); } ctx.restore(); };
  const airfield = (S) => { S.box((p) => add(p, [-2.5, 1.2, -3]), 2.2, 1.2, 1.4, [150, 156, 140], { bevel: 0.05, paint: (c, w, h) => { c.fillStyle = '#3a3a40'; c.fillRect(w * 0.2, h * 0.3, w * 0.6, h * 0.7); } }); S.cyl((p) => add(rotZ(p, Math.PI / 2), [2.6, 0.9, -2.6]), 0.7, 2.2, [200, 200, 196], 16, { cap: [180, 180, 176] }); for (const x of [1.8, 3.4]) S.rod([x, 0, -2.6], [x, 0.3, -2.6], 0.06, [80, 80, 86]); };
  makeDave({
    rip: { n: 29, cause: 'cause of death:\nparking' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'desert', render: { bg: (ctx, W, H_) => { const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#1e1830'); g.addColorStop(0.6, '#7a3a40'); g.addColorStop(1, '#e07040'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); }, dof: 0, shadows: false }, cam: { orbit: [[0, 0, -2], 12, 11, 2.0, 1.8, 0.3, 0.1, [0, 1.4, 0]] },
        build: (S) => airfield(S),
        over: (ctx, W, H_, t, u, S) => { swarm(ctx, W, H_, t, 26); flames(ctx, S, [[-3.5, 2.4, -3], [-2, 2.4, -3], [2.2, 1.6, -2.6], [3.0, 1.6, -2.6]], t, 1.4); },
        tags: [['WW2 · USA', 0.2, 0.15], ['BAT BOMBS', V('hook', 'bats'), 0.22, { col: '#ffd24a', px: 46 }], ['SELF-INFLICTED', V('hook', 'military', 2), 0.29, { col: '#ff6a5a' }]] },
      // the lab: one bat as a big model with its tiny capsule; then the bomb casing full of them
      idea: { set: 'lab', setOpt: { board: ['bats + fire', 'what could go', 'wrong'] }, cam: { orbit: [[0, 0, 0], 3.0, 2.6, 1.5, 1.4, -0.3, 0.2, [0, 1.25, 0]] },
        build: (S, t) => { if (t < V('idea', 'thousands')) bat(S, [0, 1.3, 0], 1.6, t); else { S.cyl((p) => add(rotZ(p, Math.PI / 2), [0.9, 1.25, 0]), 0.35, 1.8, [120, 126, 110], 16, { alpha: 0.4 }); for (let i = 0; i < 10; i++) bat(S, [-0.6 + (i % 5) * 0.3, 1.15 + Math.floor(i / 5) * 0.2, 0], 0.4, t + i, false); } },
        tags: [['ROOSTS UNDER ROOFS', V('idea', 'roost'), 0.15], ['THOUSANDS PER BOMB', V('idea', 'thousands'), 0.22], ['TIMED INCENDIARY', V('idea', 'timed'), 0.29, { col: '#ff6a5a' }]] },
      // the test: loose bats crawl under the fuel tank, the fire spreads, the general's car goes up
      fire: { set: 'desert', cam: { orbit: [[0, 0, -1], 9.5, 8.5, 1.8, 1.6, 0.25, 0.0, [0, 1.0, 0]] },
        build: (S, t) => { airfield(S); car(S, 0.4, -0.6, 0.3, { col: [60, 70, 60] }); },
        crew: (t) => [{ who: 'general', pos: [-0.5, 0, 1.0], pose: t > V('fire', "general's") ? 'flail' : 'point', yaw: 0.6, t, sweat: t > V('fire', 'fire') ? 1 : 0, mouth: t > V('fire', "general's") ? 1 : 0 }],
        over: (ctx, W, H_, t, u, S) => { swarm(ctx, W, H_, t, 12, 1 - ramp(t, V('fire', 'roosted'), 0.5)); const f = []; if (t > V('fire', 'fire')) f.push([2.2, 1.6, -2.6], [3.0, 1.6, -2.6], [-3, 2.4, -3]); if (t > V('fire', "general's")) f.push([0.2, 0.8, -0.6], [0.8, 0.8, -0.5]); flames(ctx, S, f, t, 1.2); },
        tags: [['NEW MEXICO · 1943', V('fire', 'New'), 0.15], ['UNDER THE FUEL TANK', V('fire', 'fuel'), 0.22, { col: '#ff6a5a' }], ["+ A GENERAL'S CAR", V('fire', "general's"), 0.29, { col: '#ffd24a' }]] },
      after: { set: 'office', setOpt: { chart: 'BATS' }, cam: { orbit: [[0, 0, -1.4], 3.8, 3.4, 1.5, 1.4, -0.3, 0.1, [0, 1.0, 0]] },
        crew: (t) => [{ who: 'general', pos: [0.2, 0, -2.1], pose: t > V('after', 'cancelled') ? 'stand' : 'salute', yaw: 0, sweat: 1 }],
        tags: [['~$2 MILLION', V('after', 'two'), 0.15, { col: '#ffd24a', px: 46 }], ['CANCELLED', V('after', 'cancelled'), 0.22, { col: '#ff6a5a' }]] },
      // Dave parks his little car right next to the general's, proud. The general's car is already burning.
      end: { set: 'desert', cam: { orbit: [[0.6, 0, 0], 5.5, 5.0, 1.4, 1.5, 0.4, 0.2, [0, 0.9, 0]] },
        build: (S, t) => { car(S, -0.9, -0.6, 0.1, { col: [60, 70, 60] }); car(S, 1.9, -0.4, 0.1, { col: [240, 196, 62] }); const b = V('end', 'general') + 0.3; if (t > b) davePile(S, [0.6, 0, 0.6], t); },
        dave: (t) => (t > V('end', 'general') + 0.3 ? null : { pos: [0.6, 0, 0.6], pose: 'thumbs', t, yaw: 0.2 }),
        over: (ctx, W, H_, t, u, S) => { const b = V('end', 'general') + 0.3, f = [[-1.2, 0.8, -0.6], [-0.5, 0.8, -0.5]]; if (t > b - 0.4) f.push([0.3, 0.9, -0.3], [1.5, 0.8, -0.3]); if (t > b - 0.1) f.push([0.6, 0.2, 0.6]); flames(ctx, S, f, t, 1.3); swarm(ctx, W, H_, t, 6); },
        flash: [V('end', 'general') + 0.3], shake: V('end', 'general') + 0.3 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0, { dur: BEAT0('idea'), color: 'brown', filter: 'lowpass', f: 700, gain: 0.22, a: 0.2 }); for (let i = 0; i < 8; i++) k.play('tick', 0.2 + i * 0.4, { f: 4000, gain: 0.12, minor: true }); // fire + squeaks
      k.play('stamp', V('hook', 'bats'), { gain: 0.4 }); k.play('error', V('hook', 'military', 2), { gain: 0.3 });
      k.play('tick', V('idea', 'timed'), { gain: 0.35 });
      k.noise(V('fire', 'fire'), { dur: BEAT0('after') - V('fire', 'fire'), color: 'brown', filter: 'lowpass', f: 800, gain: 0.25, a: 0.3 }); k.play('impact', V('fire', "general's"), { gain: 0.5 });
      k.play('stamp', V('after', 'cancelled'), { gain: 0.5 });
      k.play('ding', V('end', 'parked'), { gain: 0.25 }); k.play('impact', V('end', 'general') + 0.3, { gain: 0.8 }); k.noise(V('end', 'general') + 0.3, { dur: 1.5, color: 'brown', filter: 'lowpass', f: 600, gain: 0.3, a: 0.05 });
    },
  });
