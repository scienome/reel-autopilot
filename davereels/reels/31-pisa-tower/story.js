  // Dave reel 31: the Leaning Tower of Pisa. Soft clay under the south side, upper floors built taller on the low side
  // (the banana), and the 1990s fix of digging soil out from under the high side. Dave digs. R.I.P. Dave #30.
  const MARBLE = [242, 236, 222], LAWN = [110, 168, 90], CLAY = [150, 110, 80], SOFT = [110, 80, 64];
  // the tower leaning toward +x by `lean` (rad) about the foot of its low side. bend = each tier leans back a little
  // (the banana); tiers = how many of the 8 are built; o.y = settle (m)
  const tower = (S, o = {}) => {
    const lean = o.lean || 0, n = o.tiers ?? 8, bend = o.bend || 0, sc = o.s || 1, piv = [(o.pivX ?? 0.9) * sc, o.y || 0, 0];
    const arc = (c, w, h) => { c.fillStyle = 'rgba(120,110,96,0.45)'; for (let i = 0; i < 10; i++) { c.beginPath(); c.arc((i + 0.5) * w / 10, h * 0.45, w / 26, Math.PI, 0); c.lineTo((i + 0.5) * w / 10 + w / 26, h * 0.95); c.lineTo((i + 0.5) * w / 10 - w / 26, h * 0.95); c.fill(); } };
    let base = [0, o.y || 0, 0], ang = lean;
    for (let i = 0; i < n; i++) { const h = (i === 0 ? 1.1 : 0.62) * sc, r = (i === 7 ? 0.55 : 0.8) * sc, a = ang, b0 = base;
      S.cyl((p) => add(rotZ(sub(add(p, b0), piv), -a), piv), r, h, MARBLE, 20, { paint: arc, cap: shade(MARBLE, 0.95) });
      base = add(b0, [0, h, 0]); ang = ang > 0 ? Math.max(0, ang - bend) : ang; }
  };
  const lawn = (S) => S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 30], [-60, 0, 30]], LAWN, { bg: true, flat: false });
  // a cut-away of the ground: firm clay on the north (-x) side, soft clay under the south (+x) side, squashed by `sq`
  const ground = (S, sq) => { S.box((p) => add(p, [-1.6, -1.2, 0]), 1.6, 1.2, 1.2, CLAY, { bevel: 0.02 }); S.box((p) => add(p, [1.6, -1.2 - sq / 2, 0]), 1.6, 1.2 - sq / 2, 1.2, SOFT, { bevel: 0.02, paint: (c, w, h) => { c.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = 0; i < 6; i++) c.fillRect(0, (i * h) / 6, w, 4); } }); };
  const OUT = { bg: sunsetSky, dof: 0, shadows: true };
  makeDave({
    rip: { n: 30, cause: 'cause of death:\nlevelling' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: lawn, render: OUT, cam: { orbit: [[0, 0, 0], 11, 10, 2.4, 2.0, 0.5, 0.25, [0, 3.2, 0]] },
        build: (S) => tower(S, { lean: 0.09, bend: 0.004 }),
        crew: [{ who: 'intern', pos: [2.6, 0, 2.0], pose: 'point', yaw: -0.8 }, { who: 'chef', pos: [3.4, 0, 1.4], pose: 'stand', yaw: -1.1, mouth: 0.8 }],
        tags: [['PISA, ITALY', 0.2, 0.15], ['BUILT ON MUD', V('hook', 'mud'), 0.22, { col: '#ffd24a', px: 46 }]] },
      // the cut-away: two tiers on the ground, the soft side squashing, the stump tipping
      lean: { set: 'none', render: OUT, cam: { orbit: [[0, -0.6, 0], 7.5, 6.8, 0.8, 0.6, 0.05, -0.05, [0, 0.4, 0]] },
        build: (S, t) => { const k = ramp(t, V('lean', 'squashing') - 0.3, 1.4); ground(S, 0.35 * k); tower(S, { tiers: 2, lean: 0.12 * k, y: -0.02 * k }); },
        tags: [['1173', V('lean', 'eleven'), 0.15], ['SOFT CLAY', V('lean', 'soft'), 0.22, { col: '#ff6a5a' }], ['IT SINKS', V('lean', 'lean'), 0.29]] },
      // the banana: tiers going up one by one, each set back toward vertical
      banana: { set: lawn, render: OUT, cam: { orbit: [[0, 0, 0], 10, 9, 1.8, 2.2, -0.15, 0.1, [0, 3.0, 0]] },
        build: (S, t) => { const n = 2 + Math.floor(6 * H.clamp((t - BEAT0('banana')) / 3.5)); tower(S, { tiers: n, lean: 0.16, bend: 0.03 }); },
        over: (ctx, W, H_, t, u, S) => { if (t < V('banana', 'banana')) return; const pts = [0, 1.5, 3, 4.5, 6].map((y, i) => S.proj([0.25 + y * 0.14 - i * i * 0.025, y, 0.9])); ctx.save(); ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); },
        tags: [['TALLER ON THE LOW SIDE', V('banana', 'taller'), 0.15], ['= A BANANA', V('banana', 'banana'), 0.22, { col: '#ffd24a' }]] },
      // 1990s: engineer dummies with a drill pull soil from under the north side; the tower eases back
      save: { set: lawn, render: OUT, cam: { orbit: [[0, 0, 0], 11, 10, 2.0, 1.8, 0.7, 0.45, [0, 3.0, 0]] },
        build: (S, t) => { const k = ramp(t, V('save', 'dug') - 0.2, 2.2); tower(S, { lean: 0.096 - 0.026 * k, bend: 0.004 }); S.rod([-2.6, 0.5, 1.4], [-1.0, 0.1, 0.6], 0.06, [90, 90, 96], 8); if (t > V('save', 'dug')) S.beads([[-1.0, 0.05, 0.6], [-2.0, 0.3, 1.1], [-2.8, 0.05, 1.6]], [150, 110, 80], t * 1.5, { spacing: 0.15, r: 0.06 }); },
        crew: [{ who: 'engineer', pos: [-3.0, 0, 1.8], pose: 'hold', yaw: 0.9 }, { who: 'scientist', pos: [-3.6, 0, 0.6], pose: 'point', yaw: 1.2 }],
        tags: [['1990: 5.5°', V('save', 'nineteen'), 0.15, { col: '#ff6a5a' }], ['→ ABOUT 4°', V('save', 'four'), 0.22, { col: '#7ee07a' }]] },
      // Dave in a hole under the high side with a shovel. He digs one scoop too many and the tower settles onto him.
      // Dave digs under the high side. One scoop too many: the tower swings past upright and comes down on him.
      end: { set: lawn, render: OUT, cam: { orbit: [[-2.4, 0, 0], 8.5, 9.5, 1.6, 2.2, 0.15, 0.3, [0, 1.6, 0]] },
        build: (S, t) => { const hit = V('end', 'dig') - 0.05, k = H.ease.in(H.clamp((t - hit + 0.55) / 0.55)); tower(S, k > 0 ? { lean: -1.57 * k, pivX: -0.9 } : { lean: 0.07, bend: 0.004 }); S.quad([[-3.6, 0.01, -0.4], [-2.8, 0.01, -0.4], [-2.8, 0.01, 0.6], [-3.6, 0.01, 0.6]], [60, 44, 34], { bg: true });
          S.rod([-3.0, 0.1, 0.5], [-2.7, 1.2, 0.7], 0.03, [130, 90, 50], 6); },
        dave: (t) => { const hit = V('end', 'dig') - 0.05, u = H.clamp((t - hit) / 0.12); return { pos: [-3.2, 0, 0.2], pose: 'carry', t, yaw: 0.4, look: [1, 1], death: u > 0 ? 'squash' : undefined, u, xeyes: u > 0.5, sweat: 1, mouth: t > hit - 0.4 ? 1 : 0 }; },
        flash: [V('end', 'dig') - 0.05], shake: V('end', 'dig') - 0.05 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.tone(0.1, { f: 'E3', type: 'triangle', dur: 0.6, gain: 0.06, minor: true }); k.play('stamp', V('hook', 'mud'), { gain: 0.45 });
      k.noise(V('lean', 'squashing') - 0.3, { dur: 1.6, color: 'brown', filter: 'lowpass', f: 250, gain: 0.3, a: 0.4 }); // the squelch
      for (let i = 0; i < 6; i++) k.play('thud', BEAT0('banana') + 0.2 + i * 0.58, { f: 120 + i * 10, gain: 0.25, minor: true });
      k.play('pop', V('banana', 'banana'), { gain: 0.4 });
      k.noise(V('save', 'dug'), { dur: 2.2, color: 'pink', filter: 'bandpass', f: 600, q: 1, gain: 0.12, a: 0.2 }); k.play('success', V('save', 'four'), { gain: 0.3 });
      for (let i = 0; i < 3; i++) k.play('thud', BEAT0('end') + i * 0.35, { f: 160, gain: 0.25 }); k.play('whoosh', V('end', 'dig') - 0.6, { dur: 0.6, gain: 0.5 }); k.play('impact', V('end', 'dig') - 0.05, { gain: 0.9 });
    },
  });
