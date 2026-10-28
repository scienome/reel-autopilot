  // Dave reel 27: the Great Panjandrum (Britain, 1943-44). A rocket-driven wheel of explosives that steered itself toward
  // whichever rocket was still firing. Dave volunteers to steer. R.I.P. Dave #26.
  const STEEL = [110, 116, 126], RIM = [80, 84, 92], DRUM = [120, 130, 96], SAND = [226, 200, 150];
  const beach = (S) => { S.quad([[-80, 0, -80], [80, 0, -80], [80, 0, 40], [-80, 0, 40]], SAND, { bg: true, flat: false }); S.quad([[-80, 0.01, -80], [80, 0.01, -80], [80, 0.01, -9], [-80, 0.01, -9]], [70, 130, 180], { bg: true });
    for (let i = 0; i < 30; i++) S.ico([-15 + i, 0.1, 4.6 + Math.sin(i) * 0.3], 0.22, [150, 146, 140], { sub: 0, jit: 0.3, seed: i, noShadow: true }); }; // the pebble ridge
  // the wheel: two 3 m rims on a drum of explosive, rockets on the rims. Rolls along its own heading yaw; a = roll angle.
  // dead = set of rockets that have come off (they are not drawn); fire = flames on
  const panj = (S, c, o = {}) => {
    const a = o.a || 0, yaw = o.yaw || 0, s = o.s || 1, T = (p) => add(rotY(mul(rotZ(p, -a), s), yaw), add(c, [0, 1.5 * s, 0]));
    S.cyl((p) => T(rotX(p, Math.PI / 2)), 0.45, 1.6, DRUM, 14, { cap: shade(DRUM, 0.9) });
    for (const z of [-0.85, 0.85]) { S.tube(Array.from({ length: 17 }, (_, i) => T([1.5 * Math.cos((i / 16) * TAU), 1.5 * Math.sin((i / 16) * TAU), z])), 0.07, RIM, 6); for (let i = 0; i < 6; i++) { const q = (i / 6) * TAU; S.rod(T([0, 0, z]), T([1.5 * Math.cos(q), 1.5 * Math.sin(q), z]), 0.04, STEEL, 6); }
      for (let i = 0; i < 6; i++) { if (o.dead && o.dead.has(`${z}${i}`)) continue; const q = (i / 6) * TAU + 0.26, P0 = [1.5 * Math.cos(q), 1.5 * Math.sin(q), z * 1.08], dir = [-Math.sin(q), Math.cos(q), 0];
        S.rod(T(P0), T(add(P0, mul(dir, 0.35))), 0.06, [200, 60, 50], 8); if (o.fire) S.ico(T(add(P0, mul(dir, -0.15))), 0.12 + 0.04 * Math.sin((o.t || 0) * 40 + i), [255, 200, 90], { sub: 0, glow: true, noShadow: true }); } }
  };
  const smoke = (ctx, S, pts, t) => { ctx.save(); for (const [p, k] of pts) { const q = S.proj(p); ctx.globalAlpha = 0.35 * (1 - k); ctx.fillStyle = '#d8d4d0'; ctx.beginPath(); ctx.arc(q[0], q[1], 20 + 60 * k, 0, TAU); ctx.fill(); } ctx.restore(); };
  // a swerving path: heading turns toward the side whose rockets still fire
  const path = (t, t0, turn) => { let x = 0, z = 0, h = 0; const n = Math.max(0, Math.floor((t - t0) * 30)); for (let i = 0; i < n; i++) { h += turn((t0 + i / 30)) / 30; x += Math.cos(h) * 6 / 30; z -= Math.sin(h) * 6 / 30; } return { x, z, h, a: (t - t0) * 4 }; };
  makeDave({
    rip: { n: 26, cause: 'cause of death:\nsteering' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: beach, render: { bg: sunsetSky, dof: 0, shadows: true }, cam: { orbit: [[0, 0, 0], 14, 12, 2.5, 2.2, 0.6, 0.3, [0, 1.6, 0]] },
        build: (S, t) => { const x = -1 + 3 * Math.sin(t * 0.7), z = -1 + 1.8 * Math.sin(t * 1.6), dx = 2.1 * Math.cos(t * 0.7), dz = 2.88 * Math.cos(t * 1.6); panj(S, [x, 0, z], { a: t * 4, yaw: Math.atan2(-dz, dx), fire: true, t }); },
        tags: [['WW2 · BRITAIN', 0.2, 0.15], ['A ROCKET WHEEL', V('hook', 'rockets'), 0.22, { col: '#ffd24a' }], ['OF EXPLOSIVES', V('hook', 'explosives'), 0.29, { col: '#ff6a5a' }]] },
      // the garage: the wheel on show, a general dummy proud of it
      idea: { set: 'garage-empty', cam: { orbit: [[0, 0, 0], 6, 5.4, 1.6, 1.5, 0.5, 0.2, [0, 1.5, 0]] },
        crew: (t) => [{ who: 'general', pos: [2.1, 0, 1.0], pose: t > V('idea', 'Rockets') ? 'point' : 'salute', yaw: -0.8 }],
        build: (S, t) => panj(S, [0, 0, 0], { a: t * 0.3 }),
        tags: [['THE GREAT PANJANDRUM', V('idea', 'Great'), 0.15], ['3 m WHEELS', V('idea', 'metres'), 0.22], ['~1.8 t EXPLOSIVE', V('idea', 'explosive'), 0.29, { col: '#ff6a5a' }]] },
      // the lab, seen from above: force arrows from each side; one side's rocket goes out and the push turns the wheel
      physics: { set: 'lab', cam: [[0.01, 6.5, 2.4], [0, 0.6, 0], [0.01, 6.0, 2.0], [0, 0.6, 0]],
        build: (S, t) => { const off = t > V('physics', 'fails'); const yaw = off ? -0.9 * ramp(t, V('physics', 'lopsided'), 1.0) : 0; panj(S, [0, 0, 0], { a: t * 2, yaw, s: 0.45, fire: true, t, dead: off ? new Set(['0.850', '0.851', '0.852', '0.853', '0.854', '0.855']) : null }); },
        over: (ctx, W, H_, t, u, S) => { const off = t > V('physics', 'fails'), yaw = off ? -0.9 * ramp(t, V('physics', 'lopsided'), 1.0) : 0; for (const [z, on] of [[-0.6, true], [0.6, !off]]) { if (!on) continue; const a = S.proj(rotY([-0.6, 0.8, z], yaw)), b = S.proj(rotY([0.9, 0.8, z], yaw)); ctx.save(); ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); }
          if (off) { const c = S.proj([0, 0.8, 0]); FX.spin(ctx, c[0], c[1], 120, ramp(t, V('physics', 'turns') - 0.2, 0.5), 0.5); } },
        tags: [['ONE SIDE FAILS', V('physics', 'fails'), 0.15, { col: '#ff6a5a' }], ['LOPSIDED PUSH = TURN', V('physics', 'lopsided'), 0.22, { col: '#ffd24a' }]] },
      // the final trial: rockets peel off, it swerves at the cameraman, officers dive behind the pebbles
      trial: { set: beach, render: { bg: sunsetSky, dof: 0, shadows: true }, cam: { orbit: [[0, 0, 3], 10, 9, 2.0, 1.8, 0.2, 0.05, [0, 1.3, 0]] },
        build: (S, t) => { const t0 = BEAT0('trial'), k = H.clamp((t - t0) / (V('trial', 'dived') + 0.6 - t0)), bx = -6 + 7 * k, bz = -3 + 6 * k * k, p = { x: bx + 7, z: bz + 2, h: Math.atan2(-12 * k, 7), a: (t - t0) * 4 }; const dead = new Set(); const nOff = Math.floor(H.clamp((t - V('trial', 'flying')) / 2) * 5); for (let i = 0; i < nOff; i++) dead.add(`0.85${i}`); panj(S, [-7 + p.x, 0, -2 + p.z], { a: p.a, yaw: p.h, fire: true, t, dead });
          for (let i = 0; i < nOff; i++) { const k = (t - V('trial', 'flying') - i * 0.4); if (k > 0 && k < 1.5) S.rod([-7 + p.x + k * 4, 2 + k * 3 - k * k * 2, -2 + p.z + i], [-7 + p.x + k * 4 + 0.3, 2 + k * 3 - k * k * 2 + 0.1, -2 + p.z + i], 0.06, [200, 60, 50], 6); } },
        crew: (t) => { const dv = t > V('trial', 'dived'); return [{ who: 'intern', pos: [1.5, 0, 3.4], pose: t > V('trial', 'cameraman') ? 'flail' : 'hold', yaw: -2.2, t, mouth: 1 }, { who: 'general', pos: [-1.0, dv ? 0.2 : 0, dv ? 5.0 : 3.8], pose: 'stand', yaw: Math.PI, pitch: dv ? 1.4 : 0 }, { who: 'pilot', pos: [0.2, dv ? 0.2 : 0, dv ? 5.0 : 3.9], pose: 'stand', yaw: Math.PI, pitch: dv ? 1.4 : 0 }]; },
        tags: [['FINAL TRIAL · 1944', V('trial', 'final'), 0.15], ['ROCKETS FLYING OFF', V('trial', 'flying'), 0.22, { col: '#ff6a5a' }], ['NEVER USED', V('trial', 'never'), 0.29]] },
      // Dave sits in the hub "to steer". The wheel spins him like a hamster, then the drum goes up
      end: { set: beach, render: { bg: sunsetSky, dof: 0, shadows: true }, cam: { orbit: [[0, 0, 0], 7.5, 8.5, 2.2, 2.8, 0.5, 0.3, [0, 1.8, 0]] },
        build: (S, t) => { const bang = V('end', 'steer') - 0.05; if (t < bang) panj(S, [-1.5 + (t - BEAT0('end')) * 1.2, 0, 0], { a: (t - BEAT0('end')) * 5, fire: true, t }); else S.ico([0, 0.5, 0], 1.6 * (1 - H.clamp(t - bang)), [255, 210, 120], { sub: 1, glow: true, noShadow: true }); },
        dave: (t) => { const bang = V('end', 'steer') - 0.05, u = H.clamp((t - bang) / 1.0), x = -1.5 + (Math.min(t, bang) - BEAT0('end')) * 1.2; return { pos: [x, 1.55, 0], pose: u > 0 ? 'sit' : 'flail', t, yaw: 0.4, death: u > 0 ? 'blown' : undefined, u, to: [8, 3, -6], arc: 3, mouth: 1, xeyes: u > 0.3 }; },
        flash: [V('end', 'steer') - 0.05], shake: V('end', 'steer') - 0.05 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0, { dur: BEAT0('idea'), color: 'pink', filter: 'bandpass', f: 1200, q: 0.5, gain: 0.18, a: 0.1 }); // rocket roar
      k.play('stamp', V('idea', 'explosive'), { gain: 0.4 }); k.play('error', V('physics', 'fails'), { gain: 0.35 });
      k.noise(BEAT0('trial'), { dur: V('trial', 'never') - BEAT0('trial'), color: 'pink', filter: 'bandpass', f: 1200, q: 0.5, gain: 0.18, a: 0.1 });
      for (let i = 0; i < 5; i++) k.play('pop', V('trial', 'flying') + i * 0.4, { f: 300 + i * 40, gain: 0.35 });
      k.play('thud', V('trial', 'dived') + 0.2, { gain: 0.4 });
      k.noise(BEAT0('end'), { dur: V('end', 'steer') - 0.05 - BEAT0('end'), color: 'pink', filter: 'bandpass', f: 1200, q: 0.5, gain: 0.2, a: 0.1 });
      k.play('impact', V('end', 'steer') - 0.05, { gain: 0.9 }); k.noise(V('end', 'steer') - 0.05, { dur: 1.5, color: 'brown', filter: 'lowpass', f: 300, gain: 0.4, a: 0.01 });
    },
  });
