  // Dave reel 34: Project Pigeon (B. F. Skinner, 1940s). Pigeons in the nose of a guided bomb pecked at the target's
  // image on a screen to steer it; three birds so two could outvote one. Dave is the backup pigeon. R.I.P. Dave #33.
  const GREY = [150, 156, 170], OLIVE = [110, 118, 90];
  // a pigeon (model scale s), facing +z; peck 0..1 dips the head
  const pigeon = (S, c, s, peck = 0, col = GREY, yaw = 0) => { const T = (p) => add(rotY(mul(p, s), yaw), c);
    S.ico(T([0, 0.2, 0]), [0.14 * s, 0.13 * s, 0.2 * s], col, { sub: 1 }); S.ico(T([0, 0.38 - 0.1 * peck, 0.14 + 0.08 * peck]), 0.075 * s, shade(col, 0.9), { sub: 1 });
    S.cyl((p) => T(add(rotX(p, Math.PI / 2 + 0.5 * peck), [0, 0.37 - 0.1 * peck, 0.21 + 0.1 * peck])), 0.015, 0.06, [230, 170, 90], 6, { top: 0.002 });
    S.box((p) => T(add(p, [0, 0.34 - 0.1 * peck, 0.12 + 0.08 * peck])), 0.08, 0.02, 0.02, [120, 200, 160], { bevel: 0.3 });
    for (const sx of [-1, 1]) S.rod(T([sx * 0.05, 0.08, 0]), T([sx * 0.06, 0, 0.02]), 0.012 * s, [230, 120, 110], 5); };
  // the guided bomb along +z (nose at +z), glass nose window; o.glass makes the shell see-through
  const bomb = (S, c, o = {}) => { const T = (p) => add(rotY(rotX(mul(p, o.s || 1), o.pitch || 0), o.yaw || 0), c);
    S.cyl((p) => T(rotX(p, Math.PI / 2)), 0.35, 2.4, OLIVE, 16, o.glass ? { alpha: 0.3 } : {}); S.cyl((p) => T(add(rotX(p, Math.PI / 2), [0, 0, 2.4])), 0.35, 0.6, [170, 210, 230], 16, { top: 0.05, alpha: 0.55 });
    for (let i = 0; i < 4; i++) S.box((p) => T(add(rotZ(p, i * Math.PI / 2), [0, 0.45, 0.25])), 0.02, 0.2, 0.25, OLIVE, { bevel: 0.1 }); };
  const screen = (S, c, s, off) => S.box((p) => add(mul(p, s), c), 0.3, 0.22, 0.01, [20, 30, 40], { bevel: 0.05, paint: (cc, w, h) => { cc.fillStyle = '#1a3a5a'; cc.fillRect(0, 0, w, h); cc.strokeStyle = '#7ad0ff'; cc.lineWidth = 3; cc.strokeRect(w * 0.42, h * 0.38, w * 0.16, h * 0.24); cc.fillStyle = '#e8e8ee'; cc.fillRect(w * (0.42 + off), h * 0.48, w * 0.16, h * 0.06); cc.fillRect(w * (0.47 + off), h * 0.42, w * 0.04, h * 0.06); } });
  makeDave({
    rip: { n: 33, cause: 'cause of death:\noutvoted' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'sky', cam: { orbit: [[0, 0, 1.6], 2.6, 2.2, 0.5, 0.4, 1.1, 0.8, [0, 0, 0]] },
        build: (S, t) => { bomb(S, [0, 0, -0.6], { pitch: 0.1 }); pigeon(S, [0, -0.3, 2.0], 0.75, (Math.sin(t * 9) + 1) / 2); },
        tags: [['WW2 · USA', 0.2, 0.15], ['PILOT: A PIGEON', V('hook', 'pigeons'), 0.22, { col: '#ffd24a', px: 46 }]] },
      // the lab model: the screen shows a ship; it drifts off centre and the pecks steer it back
      how: { set: 'lab', setOpt: { board: ['peck = steer', 'birds > radar?', 'trust me'] }, cam: { orbit: [[0, 0, 0], 2.2, 1.9, 2.3, 2.2, 0.55, 0.35, [0, 1.0, -0.35]] },
        crew: [{ who: 'scientist', pos: [-1.2, 0, 0.3], pose: 'point', yaw: 0.6 }],
        build: (S, t) => { const off = 0.22 * Math.sin((t - BEAT0('how')) * 0.9) * Math.exp(-Math.max(0, t - V('how', 'pecks')) * 1.2); S.box((p) => add(p, [0, 0.45, 0]), 0.5, 0.45, 0.4, [230, 230, 236], { bevel: 0.05 }); screen(S, [0, 1.25, -0.45], 1.6, off); pigeon(S, [-0.02, 0.9, 0.1], 1.6, t > V('how', 'peck') ? (Math.sin(t * 10) + 1) / 2 : 0, GREY, Math.PI); },
        tags: [['B. F. SKINNER', V('how', 'Skinner'), 0.15], ['PECK = STEER', V('how', 'pecks'), 0.22, { col: '#ffd24a' }]] },
      // three pigeons, three screens: two peck left, one pecks right, the majority wins
      three: { set: 'lab', cam: { orbit: [[0, 0, 0], 3.0, 2.7, 1.3, 1.25, 0.15, -0.1, [0, 1.0, 0]] },
        build: (S, t) => { S.box((p) => add(p, [0, 0.4, 0]), 1.2, 0.4, 0.35, [230, 230, 236], { bevel: 0.05 }); [-0.75, 0, 0.75].forEach((x, i) => pigeon(S, [x, 0.8, 0], 1.3, (Math.sin(t * 9 + i) + 1) / 2, i === 2 && t > V('three', 'wrong') ? [210, 120, 120] : GREY)); },
        over: (ctx, W, H_, t, u, S) => { if (t < V('three', 'outvoted')) return; [-0.75, 0].forEach((x) => { const p = S.proj([x, 1.55, 0]); ctx.save(); ctx.fillStyle = '#7ee07a'; ctx.font = FONT(800, 48); ctx.textAlign = 'center'; ctx.fillText('✓', p[0], p[1]); ctx.restore(); }); const q = S.proj([0.75, 1.55, 0]); FX.no(ctx, q[0], q[1], 30, ramp(t, V('three', 'outvoted'), 0.3)); },
        tags: [['3 PIGEONS', V('three', 'three'), 0.15], ['2 OUTVOTE 1', V('three', 'outvoted'), 0.22, { col: '#7ee07a' }]] },
      end2: { set: 'office', setOpt: { chart: 'PIGEONS' }, cam: { orbit: [[0, 0, -1.4], 3.8, 3.4, 1.5, 1.4, -0.3, 0.1, [0, 1.0, 0]] },
        build: (S, t) => pigeon(S, [0.6, 0.76, -1.3], 1.0, 0),
        crew: (t) => [{ who: 'general', pos: [-0.2, 0, -2.1], pose: t > V('end2', 'cancelled') ? 'point' : 'stand', yaw: 0.2, mouth: t > V('end2', 'seriously') ? 1 : 0 }],
        tags: [['IT WORKED', V('end2', 'worked'), 0.15, { col: '#7ee07a' }], ['CANCELLED', V('end2', 'cancelled'), 0.22, { col: '#ff6a5a' }]] },
      // Dave squeezed into the glass nose, pecking. Target: a ship. He steers perfectly.
      end: { set: 'ocean', cam: { orbit: [[0, 0, 0], 7, 6, 1.6, 1.2, 0.9, 0.6, [0, 0.8, 0]] },
        build: (S, t) => { const hit = V('end', 'pigeon') + 0.15, k = H.clamp((t - BEAT0('end') + 0.2) / (hit - BEAT0('end') + 0.2)); if (t < hit) bomb(S, [0, 6 * (1 - k) + 0.6, 6 * (1 - k)], { pitch: 0.75, s: 0.8 }); else S.ico([0, 0.4, -0.5], 2.2 * (1 - H.clamp(t - hit)), [255, 200, 110], { sub: 1, glow: true, noShadow: true }); },
        dave: (t) => { const hit = V('end', 'pigeon') + 0.15, k = H.clamp((t - BEAT0('end') + 0.2) / (hit - BEAT0('end') + 0.2)), u = H.clamp((t - hit) / 1.0); return { pos: u > 0 ? [0, 0.3, -0.5] : [0, 6 * (1 - k) + 0.6 - 1.6 * 0.68 * 0.8, 6 * (1 - k) + 1.6 * 0.73 * 0.8 - 0.3], half: u <= 0, s: 0.4, pose: 'stand', mouth: 1, pitch: u > 0 ? 0 : 0.75, death: u > 0 ? 'launch' : undefined, u, to: [2, 4, 3], arc: 2 }; },
        flash: [V('end', 'pigeon') + 0.15], shake: V('end', 'pigeon') + 0.15 },
    }),
    sound: (k, { V, BEAT0 }) => {
      for (let i = 0; i < 6; i++) k.play('tick', 0.3 + i * 0.35, { f: 1800, gain: 0.2, minor: true }); k.play('pop', V('hook', 'pigeons'), { gain: 0.4 });
      for (let i = 0; i < 8; i++) k.play('tick', V('how', 'peck') + i * 0.3, { f: 1800, gain: 0.2, minor: true });
      k.play('ding', V('three', 'outvoted'), { gain: 0.3 }); k.play('error', V('three', 'outvoted') + 0.2, { gain: 0.25 });
      k.play('success', V('end2', 'worked'), { gain: 0.3 }); k.play('stamp', V('end2', 'cancelled'), { gain: 0.5 });
      k.play('whoosh', BEAT0('end') - 0.2, { dur: 1.2, gain: 0.5 }); k.play('impact', V('end', 'pigeon') + 0.15, { gain: 0.9 });
    },
  });
