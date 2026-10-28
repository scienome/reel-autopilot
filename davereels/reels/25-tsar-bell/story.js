  // Dave reel 25: the Tsar Bell (Moscow). 202 tonnes, cracked by cold water in the 1737 fire before it ever rang.
  // Dave gets one note out of it: the bell lands on him. R.I.P. Dave #24.
  const BRONZE = [176, 140, 80], STONE = [170, 164, 156];
  // a lathe: profile [[r, y], ...] spun around the y axis into faces (s = scale, gap = a missing wedge in radians)
  const lathe = (S, c, prof, col, o = {}) => {
    const n = o.n || 18, s = o.s || 1, gap = o.gap || 0, T = (r, y, a) => add(c, rotY([r * s * Math.sin(a), y * s, r * s * Math.cos(a)], o.yaw || 0));
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU; if (gap && a0 < gap) continue;
      for (let j = 0; j < prof.length - 1; j++) { const [r0, y0] = prof[j], [r1, y1] = prof[j + 1]; S.face([T(r0, y0, a0), T(r0, y0, a1), T(r1, y1, a1), T(r1, y1, a0)], o.col2 && j < 2 ? o.col2 : col, { c: add(c, [0, (y0 + y1) * 0.5 * s, 0]), two: true, glow: o.glow, gloss: 0.4 }); }
    }
  };
  const BELL = [[1.0, 0], [0.98, 0.18], [0.8, 0.5], [0.68, 1.0], [0.64, 1.5], [0.5, 1.8], [0.2, 1.9], [0.0, 1.92]];
  const bell = (S, c, o = {}) => { lathe(S, c, BELL, o.hot ? [255, 120 + 80 * (1 - o.hot), 60] : BRONZE, { s: o.s || 1, gap: o.broken ? 0.7 : 0, glow: o.hot > 0.4, col2: o.cool ? [110, 150, 210] : null, yaw: o.yaw || 0.4 }); S.box((p) => add(p, add(c, [0, 2.0 * (o.s || 1), 0])), 0.12 * (o.s || 1), 0.1 * (o.s || 1), 0.12 * (o.s || 1), shade(BRONZE, 0.9), { bevel: 0.3 }); };
  const slab = (S, c, k = 1) => S.box((p) => add(rotZ(rotX(p, -0.25 * k), -0.4 * k), c), 0.32, 0.28, 0.08, BRONZE, { bevel: 0.2 });
  const plaza = (S) => { S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 30], [-60, 0, 30]], [150, 146, 140], { bg: true, grid: [1.2, 'rgba(0,0,0,0.12)'] }); S.box((p) => add(p, [0, -3, -14]), 14, 9, 0.6, [196, 70, 60], { bevel: 0.02, paint: (c, w, h) => { c.fillStyle = '#e8d8c0'; for (let i = 0; i < 20; i++) c.fillRect((i * w) / 20, 0, w / 40, h * 0.06); } }); };
  makeDave({
    rip: { n: 24, cause: 'cause of death:\none note' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: (S) => plaza(S), render: { bg: sunsetSky, dof: 0, shadows: true }, cam: { orbit: [[0, 0, 0], 7, 6, 1.4, 1.2, 0.5, 0.2, [0, 1.3, 0]] },
        build: (S) => { S.box((p) => add(p, [0, 0.25, 0]), 1.3, 0.25, 1.3, STONE, { bevel: 0.05 }); bell(S, [0, 0.5, 0], { broken: true, s: 1.1 }); slab(S, [1.2, 0.78, 1.5]); },
        tags: [['TSAR BELL · MOSCOW', 0.2, 0.15], ['202 TONNES', V('hook', 'Two'), 0.22, { col: '#ffd24a' }], ['RUNG: 0 TIMES', V('hook', 'never'), 0.29, { col: '#ff6a5a' }]] },
      // the 1737 fire: the bell still in its pit, glowing; guard dummies throw buckets of water at it
      fire: { set: 'city', cam: { orbit: [[-0.6, 0, 0], 7, 6.2, 2.2, 1.8, -0.3, -0.05, [0, 1.2, 0]] },
        build: (S, t) => { const w = ramp(t, V('fire', 'cold') - 0.2, 0.3); S.quad([[-1.6, 0.02, -1.6], [1.6, 0.02, -1.6], [1.6, 0.02, 1.6], [-1.6, 0.02, 1.6]], [40, 30, 30], { bg: true }); bell(S, [0, 0, 0], { hot: 0.9, cool: w > 0.5 });
          if (w > 0) for (let i = 0; i < 3; i++) { const ph = ((t * 1.3 + i * 0.33) % 1); S.beads([[-2.4 + i * 0.2, 1.2, 1.4 - i], [-1.2, 1.9, 0.8 - i * 0.5], [-0.6, 1.2, 0.4 - i * 0.3]], [120, 200, 255], ph * 2, { spacing: 0.12, r: 0.05 }); } },
        crew: (t) => [{ who: 'intern', pos: [-1.9, 0, 1.6], pose: 'carry', yaw: 2.2, sweat: 1, t }, { who: 'engineer', pos: [-2.1, 0, 0.6], pose: 'carry', yaw: 1.8, sweat: 1, t }],
        over: (ctx, W, H_, t, u, S) => { const p = S.proj([0, 2.2, 0]); FX.heat(ctx, p[0], p[1] - 30, 260, 1, t); },
        tags: [['1737 · KREMLIN FIRE', V('fire', 'seventeen'), 0.15], ['COLD WATER', V('fire', 'cold'), 0.22, { col: '#7ad0ff' }]] },
      // thermal shock in the lab: a cut-away wedge of the wall, cold blue skin shrinking over a hot red core, then the crack
      shock: { set: 'lab', cam: { orbit: [[0, 0, 0], 3.6, 3.2, 1.6, 1.5, 0.2, -0.1, [0, 1.2, 0]] },
        build: (S, t) => { const cr = t > V('shock', 'cracked'); S.box((p) => add(p, [0, 1.2, 0]), 0.9, 0.5, 0.25, [255, 110, 60], { bevel: 0.05, glow: true }); const sh = 1 - 0.06 * ramp(t, V('shock', 'shrank') - 0.2, 0.5);
          for (const sz of [-1, 1]) S.box((p) => add(p, [0, 1.2, sz * 0.3]), 0.92 * sh, 0.52, 0.05, [110, 160, 220], { bevel: 0.1 });
          if (cr) { const k = H.clamp((t - V('shock', 'eleven')) / 0.6); S.box((p) => add(rotZ(p, -k * 0.8), [0.7 + 0.4 * k, 1.5 - 1.2 * k * k, 0.32]), 0.25, 0.22, 0.06, [110, 160, 220], { bevel: 0.1 }); } },
        over: (ctx, W, H_, t, u, S) => { if (t < V('shock', 'cracked')) return; const a = S.proj([0.4, 1.7, 0.35]), b = S.proj([0.55, 0.7, 0.35]); ctx.save(); ctx.strokeStyle = '#1a1820'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(a[0], a[1]); for (let i = 1; i <= 6; i++) ctx.lineTo(a[0] + (b[0] - a[0]) * i / 6 + (i % 2 ? 14 : -14), a[1] + (b[1] - a[1]) * i / 6); ctx.stroke(); ctx.restore(); },
        flash: [V('shock', 'cracked')], shake: V('shock', 'cracked'),
        tags: [['OUTSIDE SHRINKS', V('shock', 'outside'), 0.15, { col: '#7ad0ff' }], ['INSIDE STAYS BIG', V('shock', 'inside'), 0.22, { col: '#ff6a5a' }], ['11.5 t SLAB', V('shock', 'eleven'), 0.29, { col: '#ffd24a' }]] },
      now: { set: (S) => plaza(S), render: { bg: sunsetSky, dof: 0, shadows: true }, cam: { orbit: [[0, 0, 0], 6.5, 7.2, 1.2, 1.6, -0.6, -0.3, [0, 1.4, 0]] },
        build: (S) => { S.box((p) => add(p, [0, 0.25, 0]), 1.3, 0.25, 1.3, STONE, { bevel: 0.05 }); bell(S, [0, 0.5, 0], { broken: true, s: 1.1 }); slab(S, [1.2, 0.78, 1.5]); },
        crew: [{ who: 'intern', pos: [-1.9, 0, 1.8], pose: 'point', yaw: -0.6 }, { who: 'chef', pos: [2.2, 0, 1.3], pose: 'stand', yaw: -1.0, mouth: 0.6 }],
        tags: [['NEVER HEARD', V('now', 'nobody'), 0.15, { col: '#ff6a5a' }]] },
      // Dave climbs the pedestal with a sledgehammer. BONK. A dull thunk... then the whole bell slides off onto him
      end: { set: (S) => plaza(S), render: { bg: sunsetSky, dof: 0.25, focus: 5, shadows: true }, cam: { orbit: [[0.3, 0, 1.2], 5.2, 4.8, 1.2, 1.3, 0.75, 0.6, [0, 1.3, 0]] },
        build: (S, t) => { const hit = V('end', 'note'), k = H.clamp((t - hit - 0.4) / 0.5); S.box((p) => add(p, [0, 0.25, 0]), 1.3, 0.25, 1.3, STONE, { bevel: 0.05 }); bell(S, [0.2 * k, 0.5 - 0.5 * H.ease.in(k), 1.5 * H.ease.in(k)], { s: 1.1 });
          if (k <= 0) { const sw = H.clamp((t - hit + 0.5) / 0.5), a = 1.4 - 1.3 * H.ease.in(sw), h0 = [0.3, 1.15, 1.75], h1 = add(h0, [0, 0.7 * Math.sin(a), -0.7 * Math.cos(a)]); S.rod(h0, h1, 0.03, [120, 80, 50], 6); S.box((p) => add(p, h1), 0.14, 0.09, 0.09, [60, 60, 66], { bevel: 0.2 }); } },
        dave: (t) => { const hit = V('end', 'note'), u = H.clamp((t - hit - 0.8) / 0.2); return { pos: [0.3, 0, 1.95], pose: 'carry', yaw: Math.PI, t, death: u > 0 ? 'squash' : undefined, u, mouth: t > hit ? 0.8 : 0, xeyes: u > 0.5 }; },
        shake: V('end', 'note') + 0.9, flash: [V('end', 'note')] },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.tone(0.2, { f: 'C2', type: 'sine', dur: 1.5, gain: 0.05, a: 0.4, minor: true }); k.play('error', V('hook', 'never'), { gain: 0.3 });
      k.noise(BEAT0('fire'), { dur: V('fire', 'cold') - BEAT0('fire'), color: 'brown', filter: 'lowpass', f: 700, gain: 0.2, a: 0.3 }); // fire
      k.noise(V('fire', 'cold'), { dur: 1.4, color: 'white', filter: 'highpass', f: 2500, gain: 0.18, a: 0.05 }); // hiss
      k.play('glitch', V('shock', 'cracked'), { gain: 0.4 }); k.play('impact', V('shock', 'eleven') + 0.5, { gain: 0.5 });
      k.play('thud', V('end', 'note'), { f: 60, gain: 0.6 }); k.play('impact', V('end', 'note') + 0.9, { gain: 0.8 });
    },
  });
