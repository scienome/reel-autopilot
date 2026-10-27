  // Short: "The Titan implosion took milliseconds" (9:16), for mechvideo 004. Kept on the engineering; no people shown.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['press', BEAT0('pressure') - 0.15], ['gone', BEAT0('gone') - 0.15], ['search', BEAT0('search') - 0.15], ['tease', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') {
      const P0 = [0, 1.5, 0], tc = V('hook', 'failed'), cr = ramp(t, tc - 0.05, 0.25);
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 11, 10, 0.6, 0.4, 0.8, 1.0, [0, 0.9, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -2); if (cr < 0.99) titanSub(S, P0, { lights: 1, crush: cr });
      S.render(ctx, W, H_, deepEnv);
      const p = S.proj(P0); shock(ctx, p[0], p[1], H.clamp((t - tc) / 0.9), 300); bubbles(ctx, p[0], p[1], ramp(t, tc, 3), 7, 100, 220);
      deepGrade(ctx, W, H_, t); flash = 0.4 * Math.exp(-Math.pow((t - tc) * 6, 2));
    } else if (n === 'press' || n === 'gone') {
      const isG = n === 'gone', tc = isG ? V('gone', 'way') : 1e9, cr = ramp(t, tc - 0.05, 0.2);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.8, 3.3, 0.3, 0.2, 0.4, -0.2, [0, 0.45, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      carbonHull(S, [0, 1.2, 0], t, { delam: isG ? 1 : 0, crush: cr });
      squeeze(S, [0, 1.2, 0], 0.4 * (1 - 0.7 * cr), isG ? 1 : ramp(t, V('pressure', 'pushing') - 0.2, 0.5), 10, P.orange, 0.4 + 0.3 * cr, { long: 2.0 });
      if (isG) { const wu = ramp(t, V('gone', 'water') - 0.2, 0.5); if (wu > 0) for (const sx of [-1, 1]) S.beads([[sx * 1.4, 1.2, 0], [sx * 0.3, 1.2, 0]], P.air, -t * 3, { reveal: wu, spacing: 0.07, r: 0.03 }); }
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.3 });
      if (!isG) { const gp = S.proj([0, 1.7, 0]); tally(ctx, gp[0], gp[1] - 40, '≈ 400 kg / cm²', ramp(t, V('pressure', 'four') - 0.1, 0.3), 46); }
      else { const p = S.proj([0, 1.2, 0]); shock(ctx, p[0], p[1], H.clamp((t - tc) / 0.7), 260); flash = 0.3 * Math.exp(-Math.pow((t - tc) * 6, 2)); }
    } else if (n === 'search') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [2, 0, -2], 14, 12, 3.0, 2.2, 0.6, 0.3, [0, 1.8, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, 0); wreckBow(S, [-5, 0, -7], { yaw: 0.4 }); titanDebris(S, [3, 0, 0]);
      const ru = ramp(t, V('search', 'robot') - 0.4, 2.5); rov(S, [6 - 3 * ru, 1.2, 2 - ru], t, { yaw: 0.4 });
      S.render(ctx, W, H_, deepEnv); deepGrade(ctx, W, H_, t);
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.8, 3.3, 0.3, 0.2, -0.3, 0.2, [0, 0.45, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const h = carbonHull(S, [0, 1.2, 0], t, { layers: true, delam: 0.8, joint: 0.8 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.4 });
      const jp = S.proj(h.joint); ringHi(ctx, jp[0], jp[1], 60, ramp(t, V('cta', 'fail') - 0.1, 0.3), '255,90,70');
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    k.noise(0.05, { dur: V('hook', 'failed'), color: 'brown', filter: 'lowpass', f: 220, gain: 0.08, a: 0.3, minor: true }); k.play('impact', V('hook', 'failed'), { gain: 0.5 });
    k.noise(V('pressure', 'pushing'), { dur: 1.4, color: 'brown', filter: 'lowpass', f: 300, gain: 0.08, a: 0.3 });
    k.play('impact', V('gone', 'way'), { gain: 0.45 }); k.noise(V('gone', 'water'), { dur: 1.2, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.1, a: 0.02 });
    k.noise(ST2('search'), { dur: ST2('tease') - ST2('search'), color: 'brown', filter: 'lowpass', f: 220, gain: 0.07, a: 0.5, minor: true }); k.play('riser', V('cta', 'fail') - 0.4, { gain: 0.2 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
