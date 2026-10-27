  // Short: "Why Titan's carbon fibre hull failed" (9:16), for mechvideo 004
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['hull', BEAT0('strong') - 0.15], ['joint', BEAT0('joint') - 0.15], ['tease', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') { // the Titan in the deep, the fairing turning to x-ray to show the black carbon tube
      const P0 = [0, 1.5, 0];
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 11, 9.5, 0.6, 0.4, 0.5, 0.8, [0, 0.9, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -2); titanSub(S, P0, { lights: 1, glass: ramp(t, V('hook', 'carbon') - 0.2, 0.6) * 0.9 });
      S.render(ctx, W, H_, deepEnv); deepGrade(ctx, W, H_, t);
      const p = S.proj(add(P0, [0, 0.9, 0])); ringHi(ctx, p[0], p[1], 90, ramp(t, V('hook', 'risk') - 0.1, 0.3), '255,90,70');
    } else if (n === 'hull' || n === 'joint') {
      const isJ = n === 'joint';
      const [E, TG] = isJ ? dolly(t, sh.t0, sh.t1, [1.3, 1.9, 2.2], [0.45, 1.5, 0], [1.1, 1.8, 1.8], [0.5, 1.5, 0]) : orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.8, 3.3, 0.3, 0.2, 0.5, -0.2, [0, 0.45, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const de = isJ ? 1 : ramp(t, V('layers', 'separate') - 0.2, 0.6);
      const h = carbonHull(S, [0, 1.2, 0], t, { layers: true, delam: de, joint: isJ ? ramp(t, V('joint', 'titanium') - 0.2, 0.4) : 0 });
      if (!isJ) { const pu = ramp(t, V('strong', 'pull') - 0.2, 0.5) * (1 - ramp(t, V('squeeze', 'squeezed') - 0.4, 0.3)); if (pu > 0) for (const sx of [-1, 1]) S.arrow([sx * 1.0, 1.2, 0], [sx * (1.0 + 0.5 * pu), 1.2, 0], P.green, { side: [0, 1, 0], w: 0.12, th: 0.03, noShadow: true });
        const ph = t > V('layers', 'dive') ? 0.5 - 0.5 * Math.cos((t - V('layers', 'dive')) * 4) : 1; squeeze(S, [0, 1.2, 0], 0.4, ramp(t, V('squeeze', 'squeezed') - 0.2, 0.5) * ph, 10, P.orange, 0.35, { long: 2.0 }); }
      S.render(ctx, W, H_, { dof: 0.33, focus: isJ ? 2.2 : 3.4 });
      if (isJ) { const jp = S.proj(h.joint); ringHi(ctx, jp[0], jp[1], 60, ramp(t, V('joint', 'different') - 0.1, 0.3), '255,90,70'); }
    } else { // the last dive: the hull gives way
      const P0 = [0, 1.5, 0], tc = V('cta', 'way'), cr = ramp(t, tc - 0.05, 0.25);
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 11, 10, 0.6, 0.4, 1.0, 1.2, [0, 0.9, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -2); if (cr < 0.99) titanSub(S, P0, { lights: 1, crush: cr });
      S.render(ctx, W, H_, deepEnv);
      const p = S.proj(P0); shock(ctx, p[0], p[1], H.clamp((t - tc) / 0.9), 300); bubbles(ctx, p[0], p[1], ramp(t, tc, 3), 7, 100, 220);
      deepGrade(ctx, W, H_, t); flash = 0.35 * Math.exp(-Math.pow((t - tc) * 6, 2));
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    k.noise(0.05, { dur: ST2('hull'), color: 'brown', filter: 'lowpass', f: 220, gain: 0.08, a: 0.5, minor: true }); k.play('error', V('hook', 'risk'), { gain: 0.3 });
    k.noise(V('strong', 'pull'), { dur: 0.9, filter: 'bandpass', f: 900, q: 2, gain: 0.05, minor: true }); k.noise(V('squeeze', 'squeezed'), { dur: 1.2, color: 'brown', filter: 'lowpass', f: 300, gain: 0.08, a: 0.3 });
    k.play('glitch', V('layers', 'separate'), { gain: 0.25 }); k.play('error', V('joint', 'different'), { gain: 0.3 });
    k.noise(ST2('tease'), { dur: DURATION - ST2('tease'), color: 'brown', filter: 'lowpass', f: 220, gain: 0.07, a: 0.4, minor: true }); k.play('impact', V('cta', 'way'), { gain: 0.45 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
