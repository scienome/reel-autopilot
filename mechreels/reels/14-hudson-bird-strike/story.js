  // Short: "What a goose does to a jet engine" (9:16), for mechvideo 005
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['fan', BEAT0('fan') - 0.15], ['goose', BEAT0('goose') - 0.15], ['damage', BEAT0('damage') - 0.15], ['sky', BEAT0('both') - 0.15], ['river', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'fan' || n === 'goose' || n === 'damage') {
      const tg = n === 'hook' ? V('hook', 'swallows') - 0.6 : n === 'goose' ? V('goose', 'heavier') - 0.6 : -9;
      const dead = n === 'damage' ? ramp(t, V('damage', 'running') - 0.6, 1.0) : 0;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 4.0, 3.5, 0.3, 0.2, n === 'damage' ? 1.0 : -1.1, n === 'damage' ? 0.7 : -0.7, [0.05, 0.5, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const fan = integ((u) => 2 + 14 * (n === 'damage' ? 1 - ramp(u, V('damage', 'running') - 0.6, 1.0) : 1), t, 1 / 20);
      turbofan(S, [0, 1.2, 0], t, { fan, burn: 1 - dead, flow: 1 - dead });
      if (n === 'fan') { const au = ramp(t, V('fan', 'pulling') - 0.3, 0.6); for (const dz of [-0.2, 0, 0.2]) S.beads([[1.6, 1.2 + dz, 0], [0.45, 1.2 + dz * 0.8, 0]], P.air, -t * 2, { reveal: au, spacing: 0.08, r: 0.025 }); }
      const gu = H.clamp((t - tg) / 0.6); if (t > tg - 0.1 && gu < 1) goose(S, [1.8 - 1.4 * gu, 1.25, 0], 0.4 * Math.sin(t * 8), 0.8, Math.PI);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.5 });
      const fp = S.proj([0.4, 1.2, 0]); FX.sparks(ctx, fp[0], fp[1], H.clamp((t - tg - 0.6) / 0.6), 5); FX.sparks(ctx, fp[0] + 20, fp[1] - 10, H.clamp((t - tg - 0.75) / 0.6), 8);
      if (n === 'hook' || n === 'goose') flash = 0.15 * Math.exp(-Math.pow((t - tg - 0.6) * 5, 2));
      if (n === 'fan') FX.spin(ctx, fp[0], fp[1], 100, ramp(t, V('fan', 'spins') - 0.1, 0.6), -t * 6);
      if (n === 'goose') tally(ctx, W / 2, H_ * 0.2, '3–5 kg', ramp(t, V('goose', 'several') - 0.1, 0.3), 54, '#ff8a6a');
      if (n === 'damage') puffs(ctx, fp[0] - 100, fp[1], H.clamp((t - V('damage', 'smashes')) / 2), 3, '90,90,96');
    } else if (n === 'sky') {
      const th = V('both', 'both');
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.4, 7.6, 1.2, 0.9, 0.8, 1.1, [0.4, 1.2, 0]);
      const S = skyScene(E, TG, W, H_, t); const on = 1 - ramp(t, th, 1.0);
      jet767(S, [0, SKY_Y, 0], { fan: integ((u) => 1 + 16 * (1 - ramp(u, th, 1.0)), t, 1 / 20), burn: on, pitch: 0.08 });
      if (t < th + 0.1) flock(S, [Math.max(0.6, 14 - 9 * (t - (th - 1.5))), SKY_Y - 0.2, 0], t, 9, 0.9, Math.PI);
      S.render(ctx, W, H_, skyEnv);
      for (const z of [-0.82, 0.82]) { const ep = S.proj([0.4, SKY_Y - 0.33, z]); puffs(ctx, ep[0], ep[1], H.clamp((t - th) / 2.0), 4, '90,90,96', 40); FX.no(ctx, ep[0], ep[1], 36, ramp(t, V('both', 'airbus') - 0.1, 0.25)); }
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.3, 0], 5.6, 4.8, 0.8, 0.6, 0.6, 1.0, [0, 0.55, 0]);
      const S = Scene(E, TG, W, H_); nyc(S);
      jet767(S, [0, 0.12 * 0.3 - 0.02, 0], { s: 0.3, burn: 0, pitch: 0.04 }); wingPeople(S, [0, 0.1, 0], 20, 3, 0.3);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 5 });
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST2('sky'), color: 'brown', filter: 'lowpass', f: 600, gain: 0.08, a: 0.4, minor: true });
    k.play('impact', V('hook', 'swallows'), { gain: 0.45 }); k.play('impact', V('goose', 'heavier'), { gain: 0.4 }); k.play('error', V('goose', 'heavier') + 0.3, { gain: 0.25 });
    k.noise(V('damage', 'running') - 0.6, { dur: 1.4, filter: 'lowpass', f: [[0, 900], [1.4, 120]], gain: 0.12, a: 0.05 });
    for (let i = 0; i < 5; i++) k.play('thud', V('both', 'both') + i * 0.07, { f: 110 + i * 20, gain: 0.25 });
    k.noise(ST2('river'), { dur: DURATION - ST2('river'), color: 'pink', filter: 'lowpass', f: 500, gain: 0.05, a: 0.5, minor: true }); k.play('riser', V('cta', 'river') - 0.4, { gain: 0.25 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
