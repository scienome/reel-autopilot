  // Dave reel 28: the Sinclair C5 (1985). The "electric car of the future": a 24 km/h battery tricycle that sat you below
  // a lorry driver's line of sight. Dave takes it on the motorway. R.I.P. Dave #27.
  const WHITE = [240, 240, 236], BLACK = [40, 40, 46];
  // the trike along +x: a low white tub, a little windscreen, two rear wheels and one small front wheel. glass = x-ray
  const c5 = (S, x, z, o = {}) => {
    const T = (p) => add(rotY(mul(p, o.s || 1), o.yaw || 0), [x, 0, z]), sp = o.spin || 0, gl = o.glass ? { alpha: 0.35 } : {};
    S.box((p) => T(add(p, [0, 0.28, 0])), 0.85, 0.14, 0.36, WHITE, { bevel: 0.5, ...gl });
    S.box((p) => T(add(p, [0.65, 0.4, 0])), 0.28, 0.08, 0.3, WHITE, { bevel: 0.5, ...gl });
    S.box((p) => T(add(rotZ(p, 0.5), [0.5, 0.55, 0])), 0.02, 0.12, 0.26, [180, 210, 240], { alpha: 0.5 });
    for (const sz of [-1, 1]) S.cyl((p) => T(add(rotX(rotY(p, sp), Math.PI / 2 * sz), [-0.55, 0.22, sz * 0.42])), 0.22, 0.06, BLACK, 14, { cap: [180, 184, 190] });
    S.cyl((p) => T(add(rotX(rotY(p, sp), Math.PI / 2), [0.85, 0.14, 0])), 0.14, 0.05, BLACK, 12, { cap: [180, 184, 190] });
    if (o.glass) { S.box((p) => T(add(p, [-0.3, 0.22, 0])), 0.22, 0.08, 0.18, [60, 60, 70], { bevel: 0.2 }); S.cyl((p) => T(add(rotX(p, Math.PI / 2), [-0.55, 0.22, 0.32])), 0.08, 0.12, o.hot ? [255, 120, 60] : [150, 156, 166], 10, { glow: o.hot }); }
  };
  // a big lorry along +x: cab and box trailer, wheels
  const lorry = (S, x, z) => { const T = (p) => add(p, [x, 0, z]);
    S.box((p) => T(add(p, [0, 2.0, 0])), 3.2, 1.4, 1.2, [210, 70, 50], { bevel: 0.03 }); S.box((p) => T(add(p, [3.9, 1.6, 0])), 0.7, 1.0, 1.15, [70, 90, 140], { bevel: 0.06, paint: (c, w, h) => { c.fillStyle = '#9ab8d8'; c.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.35); } });
    for (const wx of [-2.2, -1.2, 3.8]) for (const sz of [-1, 1]) S.cyl((p) => T(add(rotX(p, Math.PI / 2 * sz), [wx, 0.5, sz * 1.15])), 0.5, 0.25, BLACK, 16, { cap: [150, 150, 160] }); };
  const rain = (ctx, W, H_, t) => { ctx.save(); ctx.strokeStyle = 'rgba(200,220,255,0.55)'; ctx.lineWidth = 2; const r = H.rng(3); for (let i = 0; i < 90; i++) { const x = r() * W, y = ((r() * H_ + t * 900) % H_); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 26); ctx.stroke(); } ctx.restore(); };
  makeDave({
    rip: { n: 27, cause: 'cause of death:\nthe slow lane' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'road', cam: { orbit: [[0, 0, 0], 4.2, 3.6, 0.9, 0.8, 0.9, 0.6, [0, 0.4, 0]] },
        build: (S, t) => c5(S, -1 + ((t * 1.2) % 4), 0.3, { spin: t * 8 }),
        crew: (t) => [{ who: 'intern', pos: [-1.1 + ((t * 1.2) % 4), -0.05, 0.3], pose: 'drive', yaw: Math.PI / 2, s: 0.85 }],
        tags: [['1985 · THE FUTURE', 0.2, 0.15], ['TOP SPEED: 24 km/h', V('hook', 'top'), 0.22, { col: '#ff6a5a' }]] },
      // in the rain next to a lorry: the C5 is below the bottom of the lorry's side
      low: { set: 'road', cam: { orbit: [[0, 0, 0], 7.5, 6.8, 1.0, 1.0, 1.15, 0.95, [0, 1.3, 0]] },
        build: (S, t) => { lorry(S, -0.5, -0.4); c5(S, 0.4 + 0.2 * Math.sin(t), 1.3, { spin: t * 8 }); },
        crew: [{ who: 'intern', pos: [0.3, -0.05, 1.3], pose: 'drive', yaw: Math.PI / 2, s: 0.85, sweat: 1 }],
        over: (ctx, W, H_, t) => rain(ctx, W, H_, t),
        tags: [['OPEN TO THE RAIN', V('low', 'rain'), 0.15], ['CAN THE LORRY SEE YOU?', V('low', 'lorry'), 0.22, { col: '#ff6a5a' }]] },
      // x-ray on the stand: one battery, one motor; frost then heat
      power: { set: 'garage', cam: { orbit: [[0, 0, 0], 3.2, 2.8, 1.4, 1.3, 0.5, 0.2, [0, 0.9, 0]] },
        build: (S, t) => { stand(S, [0, 0, 0], 0.7, 0.45, 0.55); const hot = t > V('power', 'hills'); c5(S, 0, 0, { glass: true, hot, spin: t * 4 }); },
        over: (ctx, W, H_, t, u, S) => { const m = S.proj([-0.55, 0.22, 0.32]), b = S.proj([-0.3, 0.3, 0]); if (t > V('power', 'hills')) FX.heat(ctx, m[0], m[1] - 30, 90, 1, t); if (t > V('power', 'cold') && t < V('power', 'hills')) { ctx.save(); ctx.strokeStyle = '#a8e0ff'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.beginPath(); ctx.moveTo(b[0], b[1] - 60); ctx.lineTo(b[0] + 26 * Math.cos(a), b[1] - 60 + 26 * Math.sin(a)); ctx.stroke(); } ctx.restore(); } },
        tags: [['1 MOTOR · 1 BATTERY', V('power', 'One'), 0.15], ['COLD = WEAK', V('power', 'cold'), 0.22, { col: '#7ad0ff' }], ['HILLS = HOT MOTOR', V('power', 'hills'), 0.29, { col: '#ff6a5a' }], ['PEDAL', V('power', 'pedalled'), 0.36, { col: '#ffd24a', px: 48 }]] },
      // the factory line: C5s rolling off a washing-machine line, the boss dummy watching sales fall
      flop: { set: 'factory', cam: { orbit: [[0, 0, -1.4], 4.2, 3.8, 1.5, 1.4, -0.4, 0.1, [0, 0.8, 0]] },
        build: (S, t) => { for (let i = 0; i < 3; i++) c5(S, -2.4 + ((i * 1.8 + t * 0.4) % 5), -0.4, { s: 0.6 }); },
        crew: (t) => [{ who: 'boss', pos: [1.6, 0, 0.6], pose: t > V('flop', 'collapsed') ? 'stand' : 'thumbs', yaw: -0.6, sweat: t > V('flop', 'collapsed') ? 1 : 0, t }],
        tags: [['WASHING MACHINE FACTORY', V('flop', 'Hoover'), 0.15], ['SALES: COLLAPSED', V('flop', 'collapsed'), 0.22, { col: '#ff6a5a' }], ['RECEIVERSHIP · OCT 1985', V('flop', 'receivership'), 0.29]] },
      // Dave pootles onto the motorway at 24 km/h. The lorry behind him never saw a thing.
      end: { set: 'road', cam: { orbit: [[0, 0, 0], 6.5, 6.0, 1.2, 1.4, 0.75, 0.6, [0, 0.8, 0]] },
        build: (S, t) => { const t0 = BEAT0('end'), hit = V('end', 'motorway') + 0.25; c5(S, (t - t0) * 0.6, 0.3, { spin: t * 8 }); lorry(S, (hit - t0) * 0.6 - 4.6 + 9 * (t - hit), 0.3); },
        dave: (t) => { const t0 = BEAT0('end'), hit = V('end', 'motorway') + 0.25, u = H.clamp((t - hit) / 0.15); return { pos: [(t - t0) * 0.6 - 0.1, -0.05, 0.3], pose: 'drive', yaw: Math.PI / 2, s: 0.85, death: u > 0 ? 'squash' : undefined, u, xeyes: u > 0.5, mouth: 0 }; },
        tags: [['24 km/h', V('end', 'motorway') - 0.3, 0.15, { col: '#ffd24a' }]],
        flash: [V('end', 'motorway') + 0.25], shake: V('end', 'motorway') + 0.25 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.tone(0, { f: 'A3', type: 'triangle', dur: 0.8, gain: 0.06, minor: true }); k.play('error', V('hook', 'top'), { gain: 0.3 });
      k.noise(BEAT0('low'), { dur: V('power', 'One') - BEAT0('low'), color: 'white', filter: 'lowpass', f: 3000, gain: 0.06, a: 0.3, minor: true }); // rain
      k.tone(V('low', 'lorry'), { f: 'A2', type: 'sawtooth', dur: 0.7, gain: 0.1, filter: 'lowpass', f2: 500 }); // horn
      k.play('buzz', V('power', 'hills'), { gain: 0.25 }); k.play('pop', V('power', 'pedalled'), { gain: 0.35 });
      k.play('error', V('flop', 'collapsed'), { gain: 0.35 }); k.play('stamp', V('flop', 'receivership'), { gain: 0.45 });
      k.noise(BEAT0('end'), { dur: 1.6, color: 'brown', filter: 'lowpass', f: [[0, 200], [1.6, 700]], gain: 0.3, a: 1.2 }); // lorry approaching
      k.play('impact', V('end', 'motorway') + 0.25, { gain: 0.8 }); k.play('slap', V('end', 'motorway') + 0.27, { gain: 0.5 });
    },
  });
