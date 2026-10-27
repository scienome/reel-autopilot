  // Short: "208 seconds to land on a river" (9:16), for mechvideo 005
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['tail', BEAT0('apu') - 0.15], ['map', BEAT0('options') - 0.15], ['bridge', BEAT0('river') - 0.15], ['touch', BEAT0('touch') - 0.15], ['wings', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const tT = V('touch', 'touches');
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'tail') {
      const isT = n === 'tail';
      const [E, TG] = isT ? dolly(t, sh.t0, sh.t1, [-4.4, SKY_Y + 0.9, 3.2], [-2.1, SKY_Y + 0.6, 0], [-4.0, SKY_Y + 0.7, 2.6], [-2.3, SKY_Y + 0.55, 0]) : orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.4, 7.4, 1.4, 1.0, -1.3, -1.0, [0.3, 1.2, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const j = jet767(S, [0, SKY_Y, 0], { fan: 1 + t * 0.6, burn: 0, pitch: -0.05 });
      const on = isT ? ramp(t, V('apu', 'starts') - 0.1, 0.6) : 0; if (on > 0) S.ico(add(j.tail, [0.05, -0.05, 0]), 0.05 * on, [255, 150, 60], { sub: 0, glow: true, noShadow: true });
      S.render(ctx, W, H_, { ...skyEnv, focus: isT ? 3.2 : 8 });
      if (!isT) { for (const z of [-0.82, 0.82]) { const ep = S.proj([0.4, SKY_Y - 0.33, z]); FX.no(ctx, ep[0], ep[1], 36, ramp(t, V('hook', 'gone') - 0.1, 0.25)); } tally(ctx, W / 2, H_ * 0.2, '208 s', ramp(t, V('hook', 'two') - 0.1, 0.3), 70, '#ff8a6a'); }
      else { const tp = S.proj(j.tail); ringHi(ctx, tp[0], tp[1], 60, ramp(t, V('apu', 'starts') - 0.1, 0.3)); }
    } else if (n === 'map') {
      const [E, TG] = dolly(t, sh.t0, sh.t1, [2, 42, 12], [2, 0, -1], [2, 38, 10], [2, 0, -1]);
      const S = mapScene(E, TG, W, H_);
      const lga = [10, 0, -14], teb = [12, 0, 11], pl = [8, 1.0, -5];
      pin(S, lga, [236, 92, 70], 2.6, 0.6); pin(S, teb, [236, 92, 70], 2.6, 0.6); jet767(S, pl, { s: 0.6, burn: 0, yaw: Math.PI * 0.8 });
      const lu = ramp(t, V('options', 'laguardia') - 0.2, 0.8), tu = ramp(t, V('options', 'teterboro') - 0.2, 0.8);
      if (lu > 0) S.beads([pl, lerp3(pl, lga, 0.6)], [236, 92, 70], 0, { reveal: lu, spacing: 0.6, r: 0.18 });
      if (tu > 0) S.beads([pl, lerp3(pl, teb, 0.55)], [236, 92, 70], 0, { reveal: tu, spacing: 0.6, r: 0.18 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      for (const p of [lga, teb]) { const q = S.proj(add(p, [0, 3.5, 0])); FX.no(ctx, q[0], q[1], 40, ramp(t, V('options', 'reach') - 0.1, 0.25)); }
    } else if (n === 'bridge') {
      const u = H.clamp((t - sh.t0) / (sh.t1 - sh.t0)), x = 26 - 24 * u, y = 1.9 - 1.3 * u;
      const S = Scene([x + 4.2, y + 1.6, 3.4], [x - 1.5, y + 0.5, 0], W, H_); nyc(S);
      jet767(S, [x, y, 0], { s: 0.3, burn: 0, pitch: -0.04, yaw: Math.PI });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 5, dofGap: 8 });
    } else if (n === 'touch') {
      const tS = BEATEND_('touch'), u = H.clamp((t - tT) / Math.max(0.5, tS - tT)), x = t < tT ? 3.0 * (tT - t) : -4.5 * (1 - Math.pow(1 - u, 2)), y = t < tT ? Math.min(1.2, 0.25 * (tT - t)) : 0;
      const S = Scene([x + 1.9, 0.9, 3.2], [x - 0.6, 0.45, 0], W, H_); nyc(S, { bridge: false });
      jet767(S, [x, y + 0.036, 0], { s: 0.3, burn: 0, yaw: Math.PI, pitch: t < tT ? 0.16 : 0.16 * (1 - u) });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 3.6 });
      const sp = S.proj([x + 0.6, 0, 0]); if (t > tT) spray(ctx, sp[0], sp[1], H.clamp((t - tT) / 1.4), 8, 150);
      flash = 0.18 * Math.exp(-Math.pow((t - tT) * 5, 2)); FX.confetti(ctx, W, H_, ramp(t, V('touch', 'survives'), 2.4), t);
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.3, 0], 5.6, 4.8, 0.8, 0.6, -0.4, 0.1, [0, 0.55, 0]);
      const S = Scene(E, TG, W, H_); nyc(S, { bridge: false });
      jet767(S, [0, 0.016, 0], { s: 0.3, burn: 0, pitch: 0.04, yaw: Math.PI }); wingPeople(S, [0, 0.1, 0], 22, 3, 0.3); ferry(S, [1.2, 0, 1.4], 0.4);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 5 });
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  const BEATEND_ = (b) => WORDS.filter((x) => x.beat === b).reduce((m, x) => Math.max(m, x.e || x.t), 0);
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST2('touch') - 0.05, color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: 0.06, a: 0.5, minor: true });
    for (let i = 0; i < 8; i++) k.play('count', V('hook', 'two') + i * 0.25, { gain: 0.25, f: 2200 - i * 60, minor: true });
    k.noise(V('apu', 'starts'), { dur: 2.0, filter: 'bandpass', f: [[0, 600], [2, 2400]], q: 3, gain: 0.05, a: 0.4 }); k.play('blip', V('apu', 'computers'), { gain: 0.3 });
    k.play('pop', V('options', 'laguardia'), { gain: 0.3 }); k.play('pop', V('options', 'teterboro'), { gain: 0.3 }); k.play('error', V('options', 'reach'), { gain: 0.3 });
    k.play('ding', V('river', 'hudson'), { f: 'E6', gain: 0.35 });
    k.play('impact', tT, { gain: 0.5 }); k.noise(tT, { dur: 2, color: 'pink', filter: 'bandpass', f: 700, q: 0.5, gain: 0.13, a: 0.02 }); k.play('success', V('touch', 'survives'), { f: 'C6', gain: 0.45 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
