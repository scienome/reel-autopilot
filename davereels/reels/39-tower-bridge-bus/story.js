  // Dave reel 39: the number 78 bus that jumped Tower Bridge (30 December 1952). No warning bell, no gates: the bascule
  // rose under the bus and the driver floored it across the gap. Dave tries it on a bicycle. R.I.P. Dave #38.
  const STONE = [196, 186, 168], ROAD = [70, 72, 80], RED = [206, 40, 40], WATER = [60, 100, 130], BLUE = [80, 140, 190];
  // the bridge along x: towers at ±5.5, bascules hinged at ±5 meeting at x = 0. a, b = raise angles of the -x / +x leaf
  const leafY = (x, a, b) => (x < 0 ? (x + 5) * Math.tan(a) : (5 - x) * Math.tan(b));
  const bridge = (S, a = 0, b = 0) => {
    S.quad([[-80, -4, -60], [80, -4, -60], [80, -4, 40], [-80, -4, 40]], WATER, { bg: true });
    for (const sx of [-1, 1]) { S.box((p) => add(p, [sx * 5.9, 1.0, 0]), 0.9, 5.0, 1.6, STONE, { bevel: 0.05, paint: (c, w, h) => { c.fillStyle = 'rgba(60,50,40,0.5)'; c.fillRect(w * 0.35, h * 0.55, w * 0.3, h * 0.25); } });
      S.cyl((p) => add(p, [sx * 5.9, 6.0, 0]), 0.7, 1.4, STONE, 4, { top: 0.05 }); S.box((p) => add(p, [sx * 14, -0.1, 0]), 7.6, 0.1, 1.3, ROAD, { bevel: 0.05 });
      S.box((p) => add(p, [0, 6.2, sx * 1.0]), 5.0, 0.15, 0.15, BLUE, { bevel: 0.2 }); }
    S.box((p) => add(rotZ(add(p, [2.5, 0, 0]), a), [-5, -0.1, 0]), 2.5, 0.1, 1.3, ROAD, { bevel: 0.05, sidePaint: null });
    S.box((p) => add(rotZ(add(p, [-2.5, 0, 0]), -b), [5, -0.1, 0]), 2.5, 0.1, 1.3, ROAD, { bevel: 0.05 });
  };
  // the double-decker along +x: body, two rows of windows, wheels; pitch tilts it nose-up
  const bus = (S, c, pitch = 0, s = 0.55) => { const T = (p) => add(rotZ(mul(p, s), pitch), c); const win = (cc, w, h) => { cc.fillStyle = '#cfe4f2'; for (const y of [0.15, 0.58]) for (let i = 0; i < 6; i++) cc.fillRect(w * (0.06 + i * 0.155), h * y, w * 0.12, h * 0.22); };
    S.box((p) => T(add(p, [0, 1.25, 0])), 1.9, 0.95, 0.6, RED, { bevel: 0.08, paint: win }); for (const wx of [-1.2, 1.2]) for (const sz of [-1, 1]) S.cyl((p) => T(add(rotX(p, Math.PI / 2 * sz), [wx, 0.3, sz * 0.6])), 0.3, 0.12, [30, 30, 36], 12, { cap: [140, 140, 150] }); };
  const OUT = { bg: sunsetSky, dof: 0, shadows: false };
  // the jump path: along the -x leaf, off its tip at the gap, into a short arc, landing on the +x leaf
  const busAt = (t, t0, a, b) => { const x = -7 + (t - t0) * 2.6; if (x < 0) return [[x, x > -5 ? leafY(x, a, b) : 0, 0], x > -5 ? a : 0]; const tip = leafY(-0.001, a, b), k = x / 5.5 * 1.1, y = tip + 1.2 * k - 3.0 * k * k; const land = leafY(x, a, b); return y > land ? [[x, y, 0], a - 0.6 * k] : [[x, land, 0], -b]; };
  makeDave({
    rip: { n: 38, cause: 'cause of death:\nno bus' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'none', render: OUT, cam: { orbit: [[0, 1, 0], 11, 10, 2.2, 2.0, 0.45, 0.3, [0, 1.2, 0]] },
        build: (S, t) => { const a = 0.18, b = 0.1; bridge(S, a, b); const k = ((t * 0.6) % 1), x = -1 + 2 * k, y = leafY(-0.001, a, b) + 1.0 * Math.sin(Math.PI * k); bus(S, [x, y, 0], 0.15 - 0.3 * k, 0.85); },
        tags: [['LONDON · 1952', 0.2, 0.15], ['TOWER BRIDGE · OPENING', V('hook', 'opening'), 0.22, { col: '#ffd24a' }]] },
      // the watchman's hut: the bell does not ring, the gate stays up; the bus drives on as its leaf starts to rise
      setup: { set: 'none', render: OUT, cam: { orbit: [[-10, 0, 0], 10, 9, 2.4, 2.6, 0.5, 0.25, [0, 1.0, 0]] },
        build: (S, t) => { const a = 0.12 * ramp(t, V('setup', 'rise') - 0.4, 1.5); bridge(S, a, 0.08 * ramp(t, V('setup', 'rise'), 1.5)); const x = -16 + (t - BEAT0('setup')) * 1.1; bus(S, [x, x > -5 ? leafY(x, a, 0) : 0, 0], x > -5 ? a : 0); S.box((p) => add(p, [-8, 0.6, 1.7]), 0.4, 0.6, 0.4, [120, 90, 70], { bevel: 0.1 }); S.cyl((p) => add(p, [-8, 1.3, 1.7]), 0.12, 0.2, [220, 180, 70], 10); },
        crew: (t) => [{ who: 'intern', pos: [-8.6, 0, 2.4], pose: 'sit', yaw: 0.8, blink: 1 }],
        tags: [['NO WARNING BELL', V('setup', 'bell'), 0.15, { col: '#ff6a5a' }], ['NO GATES', V('setup', 'gates'), 0.22, { col: '#ff6a5a' }], ['THE ROAD RISES', V('setup', 'rise'), 0.29, { col: '#ffd24a' }]] },
      jump: { set: 'none', render: OUT, cam: { orbit: [[0, 1, 0], 12, 11, 2.0, 2.4, 0.3, 0.15, [0, 1.2, 0]] },
        build: (S, t) => { const t0 = BEAT0('jump') + 0.4, a = 0.16, b = 0.07; bridge(S, a, b); const [p, pitch] = busAt(t, t0, a, b); bus(S, p, pitch, 0.8); },
        tags: [['FLOORED IT', V('jump', 'floored'), 0.15, { col: '#ffd24a' }], ['OVER THE GAP', V('jump', 'gap'), 0.22]] },
      // on the far side: the bus parked, a couple of passenger dummies wobbling off
      after: { set: 'road', cam: { orbit: [[0, 0, 0], 7, 6.4, 1.6, 1.4, 0.6, 0.3, [0, 1.0, 0]] },
        build: (S) => bus(S, [0, 0, -0.2], 0, 0.6),
        crew: (t) => [{ who: 'chef', pos: [1.8, 0, 1.4], pose: 'stand', yaw: -0.5, roll: 0.15 * Math.sin(t * 3), mouth: 0.6 }, { who: 'intern', pos: [2.6, 0, 0.9], pose: 'stand', yaw: -0.9, roll: 0.15 * Math.sin(t * 3 + 1) }, { who: 'pilot', pos: [-1.6, 0, 1.4], pose: 'thumbs', yaw: 0.4 }],
        tags: [['MINOR INJURIES', V('after', 'minor'), 0.15], ['REWARD: £10', V('after', 'ten'), 0.22, { col: '#ffd24a', px: 46 }]] },
      // Dave on a bicycle, pedalling hard up the rising leaf. A bicycle is not a bus.
      end: { set: 'none', render: OUT, cam: { orbit: [[-1.5, 0.5, 0], 8, 9, 1.6, 2.2, 0.4, 0.25, [0, 0.8, 0]] },
        build: (S, t) => { bridge(S, 0.2, 0.12); const lift = V('end', 'bicycle') - 0.2, u = H.clamp((t - lift) / 1.3), x = -4 + Math.min(t - BEAT0('end'), lift - BEAT0('end')) * 1.5, y = leafY(Math.min(x, -0.01), 0.2, 0.12), o = add([x, y, 0], [1 * u, -6 * u + 4 * 0.8 * u * (1 - u), 1.5 * u]), T = (p) => add(rotZ(p, 0.2 - u * 3), o);
          for (const wx of [-0.45, 0.45]) S.cyl((p) => T(add(rotX(p, Math.PI / 2), [wx, 0.32, -0.02])), 0.32, 0.04, [30, 30, 36], 14, { cap: [180, 180, 190] }); S.tube([T([-0.45, 0.32, 0]), T([0, 0.75, 0]), T([0.45, 0.32, 0])], 0.03, [60, 140, 220], 6); S.rod(T([0, 0.75, 0]), T([0.35, 0.95, 0]), 0.03, [60, 140, 220], 6); },
        dave: (t) => { const lift = V('end', 'bicycle') - 0.2, u = H.clamp((t - lift) / 1.3), x = -4 + Math.min(t - BEAT0('end'), lift - BEAT0('end')) * 1.5; return { pos: [x, leafY(Math.min(x, -0.01), 0.2, 0.12) + 0.4, 0], pose: 'drive', t, yaw: Math.PI / 2, pitch: -0.2, death: u > 0 ? 'launch' : undefined, u, to: [1, -6, 1.5], arc: 1.2, mouth: u > 0 ? 1 : 0 }; },
        over: (ctx, W, H_, t, u, S) => { const lift = V('end', 'bicycle') - 0.2; if (t > lift + 1.1) { const p = S.proj([0.5, -4, 1]); ctx.save(); ctx.fillStyle = 'rgba(220,240,255,0.85)'; for (let i = 0; i < 9; i++) { const k = (t - lift - 1.1) * 3; ctx.beginPath(); ctx.arc(p[0] + (i - 4) * 18 * k, p[1] - 60 * k + 40 * k * k * (1 + Math.abs(i - 4) * 0.1), 8, 0, TAU); ctx.fill(); } ctx.restore(); } },
        tags: [['ON A BICYCLE', V('end', 'bicycle'), 0.15, { col: '#ffd24a' }]] },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0, { dur: 1.5, color: 'brown', filter: 'lowpass', f: 300, gain: 0.25, a: 0.1 }); k.play('impact', 1.5, { gain: 0.5 });
      k.play('error', V('setup', 'bell'), { gain: 0.3 }); k.play('error', V('setup', 'gates'), { gain: 0.3 }); k.tone(V('setup', 'rise'), { f: [[0, 50], [1.5, 70]], type: 'sawtooth', dur: 1.5, gain: 0.06, filter: 'lowpass', f2: 300 });
      k.noise(V('jump', 'floored'), { dur: 1.2, color: 'brown', filter: 'lowpass', f: [[0, 200], [1.2, 600]], gain: 0.3, a: 0.2 }); k.play('impact', V('jump', 'dropped') + 0.2, { gain: 0.7 });
      k.play('coin', V('after', 'ten'), { gain: 0.35 });
      k.play('ding', BEAT0('end') + 0.2, { f: 2500, gain: 0.2 }); k.play('whoosh', V('end', 'bicycle') - 0.2, { dur: 1.1, gain: 0.5 }); k.noise(V('end', 'bicycle') + 0.9, { dur: 0.8, color: 'white', filter: 'lowpass', f: 2000, gain: 0.35, a: 0.01 }); // splash
    },
  });
