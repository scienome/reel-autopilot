  // Dave reel 36: the Mars Bluff bomb (South Carolina, 11 March 1958). A crewman checking a stuck locking pin grabbed the
  // emergency release; the Mark 6 (no nuclear core) fell through the bomb bay doors onto a family's garden. R.I.P. Dave #35.
  const SILVER = [196, 200, 210], BOMB = [110, 120, 100];
  const bomber = (S, c, s = 1) => { const T = (p) => add(mul(p, s), c);
    S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [-3, 0, 0])), 0.45, 6.4, SILVER, 14); S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [3.4, 0, 0])), 0.45, 0.8, SILVER, 14, { top: 0.05 });
    for (const sz of [-1, 1]) { S.quad([T([0.8, 0.1, sz * 0.4]), T([-1.2, 0.1, sz * 5.2]), T([-1.9, 0.1, sz * 5.2]), T([-0.6, 0.1, sz * 0.4])], SILVER); for (const z of [1.6, 3.2]) S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [-0.6 - z * 0.25, -0.3, sz * z])), 0.16, 0.9, [150, 156, 166], 10); }
    S.quad([T([-2.4, 0.3, 0]), T([-3.2, 1.6, 0]), T([-3.6, 1.6, 0]), T([-3.3, 0.3, 0])], SILVER); };
  const mk6 = (S, c, s = 1, rot = 0) => { const T = (p) => add(rotX(mul(p, s), rot), c); S.ico(T([0, 0, 0]), [0.9 * s, 0.75 * s, 0.75 * s], BOMB, { sub: 1, gloss: 0.3 }); for (let i = 0; i < 4; i++) S.box((p) => T(add(rotX(p, i * Math.PI / 2), [-1.0, 0.4, 0])), 0.25, 0.3, 0.02, shade(BOMB, 0.85), { bevel: 0.1 }); };
  // inside the bomb bay: dark ribs, the bomb on its rack, the two doors (open 0..1) under it
  const bay = (S, o = {}) => { for (let i = 0; i < 6; i++) S.box((p) => add(p, [-2.5 + i, 2.0, 0]), 0.05, 0.08, 1.3, [70, 74, 82], { bevel: 0.1 });
    S.quad([[-3, 2.2, -1.4], [3, 2.2, -1.4], [3, -0.2, -1.4], [-3, -0.2, -1.4]], [44, 48, 56], { bg: true });
    for (const sz of [-1, 1]) S.box((p) => add(rotX(sub(p, [0, 0, sz * 0.65]), -sz * (o.open || 0) * 1.4), [0, -0.2, sz * 1.3]), 2.2, 0.03, 0.65, [150, 156, 166], { bevel: 0.1 }); };
  const DARK = { bg: '#1a1c24', dof: 0.2, focus: 3.5 };
  makeDave({
    rip: { n: 35, cause: 'cause of death:\nthe wrong lever' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'road', cam: { orbit: [[0, 0, 0], 12, 11, 2, 1.8, 0.5, 0.3, [0, 3.5, 0]] },
        build: (S, t) => { bomber(S, [-6 + t * 3, 9, -4], 0.8); const d = 1.2; if (t > d) mk6(S, [-6 + d * 3 + (t - d) * 2, 9 - 2.4 * (t - d) ** 2, -4], 0.5, 0.3 * (t - d)); S.box((p) => add(p, [3, 0.8, -4]), 1.2, 0.8, 1.0, [236, 226, 206], { bevel: 0.05 }); S.box((p) => add(rotX(p, 0.6), [3, 1.9, -4.4]), 1.3, 0.04, 0.7, [150, 70, 60], { bevel: 0.1 }); },
        tags: [['SOUTH CAROLINA · 1958', 0.2, 0.15], ['AN ATOMIC BOMB', V('hook', 'atomic'), 0.22, { col: '#ff6a5a', px: 44 }]] },
      pin: { set: (S, t) => bay(S, { open: t > V('pin', 'fell') ? H.clamp((t - V('pin', 'fell')) * 4) : 0 }), render: DARK, cam: { orbit: [[0, 0.6, 0], 4.2, 3.8, 0.6, 0.4, 0.5, 0.3, [0, 0.3, 0]] },
        build: (S, t) => { const f = V('pin', 'fell'), y = t > f ? 0.8 - 4.9 * (t - f) ** 2 : 0.8; mk6(S, [0, y, 0], 0.8); S.rod([1.6, 2.0, -1.0], [1.6, 1.4, -1.0], 0.03, [200, 60, 50], 6); S.box((p) => add(rotX(p, t > V('pin', 'grabbed') ? 0.8 : 0), [1.6, 1.35, -1.0]), 0.08, 0.08, 0.08, [220, 70, 50], { glow: true }); },
        crew: (t) => [{ who: 'pilot', pos: [1.5, -0.17, 0.5], pose: t > V('pin', 'grabbed') ? 'point' : 'hold', yaw: -2.4, s: 0.9, mouth: t > V('pin', 'fell') ? 1 : 0 }],
        tags: [['STUCK LOCKING PIN', V('pin', 'stuck'), 0.15], ['EMERGENCY RELEASE', V('pin', 'emergency'), 0.22, { col: '#ff6a5a' }], ['THROUGH THE DOORS', V('pin', 'through'), 0.29, { col: '#ffd24a' }]] },
      // the crater in the empty garden, smoke rising; no people on screen
      boom: { set: 'road', cam: { orbit: [[0, 0, -4], 13, 12, 7.5, 6.5, -0.3, -0.1, [0, 0.5, 0]] },
        build: (S, t) => { const b = BEAT0('boom') + 0.2; S.quad(Array.from({ length: 16 }, (_, i) => [3 * Math.cos(i * TAU / 16), 0.02, -4 + 2.2 * Math.sin(i * TAU / 16)]), [70, 56, 44], { bg: true }); S.box((p) => add(p, [5.4, 0.8, -6]), 1.2, 0.8, 1.0, [206, 196, 176], { bevel: 0.05 }); S.box((p) => add(rotZ(rotX(p, 0.6), -0.3), [5.2, 1.7, -6.4]), 1.3, 0.04, 0.7, [150, 70, 60], { bevel: 0.1 }); void b; },
        over: (ctx, W, H_, t, u, S) => { const p = S.proj([0, 0.3, -4]); ctx.save(); for (let i = 0; i < 8; i++) { const k = ((t * 0.4 + i / 8) % 1); ctx.globalAlpha = 0.5 * (1 - k); ctx.fillStyle = '#8a8076'; ctx.beginPath(); ctx.arc(p[0] + Math.sin(i * 2) * 40 * k, p[1] - k * 300, 30 + k * 70, 0, TAU); ctx.fill(); } ctx.restore(); },
        flash: [BEAT0('boom') + 0.1], shake: BEAT0('boom') + 0.1,
        tags: [['NO NUCLEAR CORE', V('boom', 'core'), 0.15, { col: '#7ee07a' }], ['CRATER: 20+ m WIDE', V('boom', 'crater'), 0.22, { col: '#ffd24a' }], ['NOBODY KILLED', V('boom', 'Nobody'), 0.29]] },
      // Dave stands on the bomb bay doors, waving. Someone grabs the wrong lever again.
      end: { set: (S, t) => bay(S, { open: t > V('end', 'bomb') ? H.clamp((t - V('end', 'bomb')) * 5) : 0 }), render: DARK, cam: { orbit: [[0, 0.4, 0], 4.0, 4.4, 0.7, 0.9, -0.4, -0.25, [0, 0.4, 0]] },
        build: (S, t) => { const f = V('end', 'bomb'), y = t > f ? 0.8 - 4.9 * (t - f) ** 2 : 0.8; mk6(S, [0, y, 0], 0.8); },
        dave: (t) => { const f = V('end', 'bomb'), dy = t > f ? 4.9 * (t - f) ** 2 : 0; return { pos: [0.7, -0.17 - dy, 0.4], pose: t > f ? 'flail' : 'wave', t, yaw: -0.5, mouth: t > f ? 1 : 0 }; },
        flash: [V('end', 'bomb') + 0.2] },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0, { dur: 2.2, color: 'pink', filter: 'bandpass', f: 500, q: 0.5, gain: 0.15, a: 0.2 }); k.play('whoosh', 1.2, { dur: 1.2, gain: 0.4 }); k.play('stamp', V('hook', 'atomic'), { gain: 0.45 });
      k.play('click', V('pin', 'stuck'), { gain: 0.35 }); k.play('press', V('pin', 'grabbed'), { gain: 0.45 }); k.play('impact', V('pin', 'through'), { gain: 0.6 });
      k.play('impact', BEAT0('boom') + 0.1, { gain: 0.95 }); k.noise(BEAT0('boom') + 0.1, { dur: 2.5, color: 'brown', filter: 'lowpass', f: 300, gain: 0.4, a: 0.01 });
      k.play('press', V('end', 'bomb') - 0.1, { gain: 0.45 }); k.play('whoosh', V('end', 'bomb'), { dur: 0.9, gain: 0.55 });
    },
  });
