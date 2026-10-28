  // Dave reel 33: the Grumman F11F Tiger that shot itself down (21 September 1956). Shells fired in a dive slowed and
  // dropped, the diving jet caught up with them ~11 s later. Dave flies the same test. R.I.P. Dave #32.
  const JET = [150, 170, 200], DARKJ = [60, 70, 90];
  // the jet along +x, nose at +x: fuselage, canopy, swept wings, tail. pitch (rad, nose down = negative)
  const jet = (S, c, o = {}) => { const T = (p) => add(rotZ(mul(p, o.s || 1), o.pitch || 0), c);
    S.box((p) => T(p), 1.4, 0.16, 0.16, JET, { bevel: 0.5 }); S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [1.4, 0, 0])), 0.16, 0.4, JET, 10, { top: 0.02 });
    S.box((p) => T(add(p, [0.7, 0.17, 0])), 0.28, 0.08, 0.1, o.cracked ? [200, 210, 220] : [120, 170, 220], { bevel: 0.5, alpha: 0.7 });
    for (const sz of [-1, 1]) S.quad([T([0.5, 0, sz * 0.15]), T([-0.4, 0, sz * 1.3]), T([-0.75, 0, sz * 1.3]), T([-0.4, 0, sz * 0.15])], DARKJ);
    S.quad([T([-0.9, 0.1, 0]), T([-1.45, 0.75, 0]), T([-1.7, 0.75, 0]), T([-1.4, 0.1, 0])], DARKJ);
    if (o.smoke) S.ico(T([-1.5, 0, 0]), 0.25, [80, 80, 86], { sub: 0, noShadow: true });
  };
  const OUTS = { bg: sunsetSky, dof: 0, shadows: false };
  // a burst: a stream of shell beads leaving the nose, slowing down and dropping
  const shells = (S, from, dir, t0, t, n = 8) => { for (let i = 0; i < n; i++) { const k = t - t0 - i * 0.06; if (k <= 0) continue; const d = 14 * (1 - Math.exp(-k * 0.6)); S.ico(add(from, [dir[0] * d, dir[1] * d - 0.6 * k * k, 0]), 0.11, [255, 220, 120], { sub: 0, glow: true, noShadow: true }); } };
  const clouds = (S, t) => { const r = H.rng(12); for (let i = 0; i < 10; i++) S.ico([((r.range(-30, 30) - t * 6) % 60 + 60) % 60 - 30, r.range(-8, 6), -14 - r.range(0, 10)], [2.4, 1.0, 1.4], [250, 244, 248], { sub: 1, noShadow: true, alpha: 0.85 }); };
  makeDave({
    rip: { n: 32, cause: 'cause of death:\nfriendly fire' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'sky', render: OUTS, cam: { orbit: [[0, 0, 0], 6, 5.2, 0.8, 0.4, 0.6, 0.3, [0, 0, 0]] },
        build: (S, t) => { clouds(S, t); jet(S, [0, 0, 0], { pitch: -0.15, cracked: t > 1.2, smoke: t > 1.2 }); shells(S, [1.6, 0.4, 0], [-0.6, 0.02], 0, t, 10); },
        flash: [1.2], shake: 1.2, tags: [['1956', 0.2, 0.15], ['HIT BY ITS OWN SHELLS', V('hook', 'own'), 0.22, { col: '#ff6a5a' }]] },
      fire: { set: 'sky', render: OUTS, cam: { orbit: [[0, 0, 0], 5.5, 4.8, 1.2, 0.6, -0.5, -0.2, [0.4, 0, 0]] },
        build: (S, t) => { clouds(S, t); jet(S, [0, 0, 0], { pitch: -0.25 }); shells(S, [1.8, -0.4, 0], [0.96, -0.25], V('fire', 'firing'), t, 12); },
        tags: [['F11F TIGER', V('fire', 'Grumman'), 0.15], ['DIVING, ~MACH 1', V('fire', 'diving'), 0.22, { col: '#ffd24a' }]] },
      // the side-view diagram: the shells' curve (fast, slowing, dropping) and the jet's dive meeting at one point
      physics: { set: 'sky', render: OUTS, cam: [[0, 0, 10], [0, 0, 0], [0, 0, 9.6], [0, 0, 0]],
        build: (S, t) => { const k = H.clamp((t - BEAT0('physics')) / 6); jet(S, [-3 + 5 * k, 2 - 3.6 * k, 0], { pitch: -0.62, s: 0.5 }); },
        over: (ctx, W, H_, t, u, S) => { const k = H.clamp((t - BEAT0('physics')) / 6), P = (x, y) => S.proj([x, y, 0]);
          ctx.save(); ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.strokeStyle = '#ffd24a'; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const s = i / 30, q = P(-2.4 + 3.2 * Math.sqrt(s), 1.6 - 3.0 * s * s - 0.6 * s); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
          ctx.strokeStyle = '#7ad0ff'; ctx.beginPath(); let a = P(-3, 2), b = P(2, -1.6); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
          if (k > 0.75) { const m = P(0.8, -1.0); ctx.strokeStyle = '#ff4a3a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(m[0], m[1], 34, 0, TAU); ctx.stroke(); } ctx.restore(); },
        tags: [['DRAG SLOWS THE SHELLS', V('physics', 'drag'), 0.15, { col: '#ffd24a' }], ['GRAVITY DROPS THEM', V('physics', 'gravity'), 0.22, { col: '#ffd24a' }], ['THE JET DIVES INTO THEM', V('physics', 'diving'), 0.29, { col: '#7ad0ff' }]] },
      hit: { set: 'sky', render: OUTS, cam: { orbit: [[0, 0, 0], 4.2, 3.6, 0.6, 0.4, 0.9, 0.6, [0.5, 0, 0]] },
        build: (S, t) => { clouds(S, t); const c = t > V('hit', 'windscreen'), e = t > V('hit', 'engine'); jet(S, [0, 0, 0], { pitch: -0.2, cracked: c, smoke: e }); const r = H.rng(3); for (let i = 0; i < 10; i++) { const x = 3 - ((t * 4 + i * 0.7) % 7); S.ico([x, r.range(-0.4, 0.6), r.range(-0.4, 0.4)], 0.06, [255, 220, 120], { sub: 0, glow: true, noShadow: true }); } },
        over: (ctx, W, H_, t, u, S) => { const c = S.proj([0.75, 0.2, 0]), e = S.proj([-1.3, 0, 0]); FX.sparks(ctx, c[0], c[1], (t - V('hit', 'windscreen')) / 0.6, 2); FX.sparks(ctx, e[0], e[1], (t - V('hit', 'engine')) / 0.6, 5); },
        flash: [V('hit', 'windscreen'), V('hit', 'engine')],
        tags: [['~11 SECONDS LATER', V('hit', 'eleven'), 0.15], ['WINDSCREEN', V('hit', 'windscreen'), 0.22, { col: '#ff6a5a' }], ['ENGINE', V('hit', 'engine'), 0.29, { col: '#ff6a5a' }]] },
      // the crash site in the trees: smoking wreck, nobody on screen
      survive: { set: 'road', cam: { orbit: [[0, 0, -0.2], 5.5, 5, 1.4, 1.2, 0.5, 0.25, [0, 0.5, 0]] },
        build: (S, t) => jet(S, [0, 0.2, -0.2], { pitch: 0.05, cracked: true, smoke: true }),
        over: (ctx, W, H_, t, u, S) => { const p = S.proj([-1.5, 0.3, -0.2]); ctx.save(); for (let i = 0; i < 6; i++) { const k = ((t * 0.5 + i / 6) % 1); ctx.globalAlpha = 0.5 * (1 - k); ctx.fillStyle = '#6a6a70'; ctx.beginPath(); ctx.arc(p[0] + k * 40, p[1] - k * 260, 20 + k * 50, 0, TAU); ctx.fill(); } ctx.restore(); },
        tags: [['CRASH-LANDED', V('survive', 'crash-landed'), 0.15], ['HE SURVIVED', V('survive', 'survived'), 0.22, { col: '#7ee07a' }]] },
      // Dave in the cockpit, thumbs up, fires a long burst, dives after it... and catches up
      end: { set: 'sky', render: OUTS, cam: { orbit: [[0, 0, 0], 4.4, 4.8, 0.9, 1.3, 0.9, 0.7, [0.3, 0.3, 0]] },
        build: (S, t) => { clouds(S, t); const hit = V('end', 'next') + 0.1; if (t < hit) { jet(S, [0, 0, 0], { pitch: -0.2 }); shells(S, [1.8, -0.3, 0], [0.5, -0.1], BEAT0('end'), t, 12); } else S.ico([0, 0, 0], 1.5 * (1 - H.clamp(t - hit)), [255, 200, 110], { sub: 1, glow: true, noShadow: true }); },
        dave: (t) => { const hit = V('end', 'next') + 0.1, u = H.clamp((t - hit) / 1.0); return { pos: [0.6, 0.05, 0], half: u <= 0, pose: 'thumbs', s: 0.45, yaw: Math.PI / 2, death: u > 0 ? 'launch' : undefined, u, to: [-2, 3, 1.5], arc: 1.5, mouth: u > 0 ? 1 : 0 }; },
        flash: [V('end', 'next') + 0.1], shake: V('end', 'next') + 0.1 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0, { dur: BEAT0('physics'), color: 'pink', filter: 'bandpass', f: 900, q: 0.4, gain: 0.14, a: 0.1 }); // jet roar
      for (let i = 0; i < 10; i++) k.play('tick', 0.05 + i * 0.06, { f: 300, gain: 0.3 }); k.play('impact', 1.2, { gain: 0.7 });
      for (let i = 0; i < 12; i++) k.play('tick', V('fire', 'firing') + i * 0.06, { f: 300, gain: 0.3 });
      k.play('ding', V('physics', 'path'), { gain: 0.3 });
      k.play('glitch', V('hit', 'windscreen'), { gain: 0.5 }); k.play('impact', V('hit', 'engine'), { gain: 0.6 });
      k.noise(BEAT0('end'), { dur: 2, color: 'pink', filter: 'bandpass', f: 900, q: 0.4, gain: 0.14, a: 0.1 }); for (let i = 0; i < 12; i++) k.play('tick', BEAT0('end') + i * 0.06, { f: 300, gain: 0.3 });
      k.play('impact', V('end', 'next') + 0.1, { gain: 0.9 });
    },
  });
