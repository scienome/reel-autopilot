  // Dave reel 14: the Walkie-Scorchie. Dave fries an egg in the hot spot... and slowly melts with it. R.I.P. Dave #13.
  const BEATS = window.SCRIPT;
  const SH = [['street', 0], ['mirror', BEAT0('mirror') - 0.1], ['jag', BEAT0('jag') - 0.1], ['egg', BEAT0('end') - 0.4]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const GLASS = [150, 190, 220], SUN = [255, 214, 120];
  // the tower: its south face curves inward (concave), built from tilted vertical glass strips around a focal line.
  // Taller floors stick out further, so the face is concave in plan and leans out towards the top. Faces +z.
  const tower = (S, o = {}) => {
    const Hh = 160, R = 70, cz = -40, n = 9;
    for (let i = 0; i < n; i++) { const a0 = -0.45 + (0.9 * i) / n, a1 = -0.45 + (0.9 * (i + 1)) / n, P = (a, y) => [Math.sin(a) * R, y, cz + R - Math.cos(a) * R + y * 0.12]; S.face([P(a0, 0), P(a1, 0), P(a1, Hh), P(a0, Hh)], GLASS, { two: true, gloss: 0.9, c: [0, Hh / 2, cz + 60], paint: null }); }
    S.box((p) => add(p, [0, Hh / 2, cz - 20]), 32, Hh / 2, 20, [120, 130, 150], { bevel: 0.02 });
    S.box((p) => add(p, [0, Hh + 3, cz + 4]), 32, 3, 30, [70, 110, 80], { bevel: 0.05 }); // the sky garden on top
    if (o.shade) for (let y = 30; y < 110; y += 8) S.box((p) => add(p, [0, y, cz + 13 + y * 0.12]), 30 * o.shade, 0.4, 3, [220, 222, 226], { bevel: 0.1 });
  };
  const street = (S) => {
    S.quad([[-200, 0, -200], [200, 0, -200], [200, 0, 200], [-200, 0, 200]], [120, 118, 116], { bg: true });
    S.quad([[-200, 0.01, 20], [200, 0.01, 20], [200, 0.01, 34], [-200, 0.01, 34]], [64, 62, 70], { bg: true, paint: (c, w, h) => { c.fillStyle = '#eee'; for (let x = 0; x < w; x += 30) c.fillRect(x, h * 0.48, 15, 3); } });
    for (const [x, z, w, hh] of [[-70, -30, 18, 40], [70, -30, 16, 55], [-90, 60, 20, 30], [90, 70, 20, 35]]) S.box((p) => add(p, [x, hh, z]), w, hh, 14, [200, 190, 176], { bevel: 0.02 });
  };
  const jaguar = (S, p, warp = 0) => { car(S, p[0], p[2], 0, { col: [40, 60, 52] }); S.box((q) => add(p, add(rotZ(q, -0.9 * warp), [0.75, 0.62 - 0.12 * warp, 0.55])), 0.03, 0.05, 0.07, [30, 30, 36], { bevel: 0.2 }); S.box((q) => add(p, add(q, [-1.0, 0.42 - 0.1 * warp, 0])), 0.06, 0.06 * (1 - 0.4 * warp), 0.42, [20, 20, 24], { bevel: 0.2 }); };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0, heat = 0;
    const F = [0, 0.1, 28]; // the hot spot on the street
    if (n === 'street' || n === 'mirror') {
      const [E, TG] = n === 'street' ? orbit(t, sh.t0, sh.t1, [0, 0, 30], 150, 130, 25, 35, 0.35, 0.15, [0, 70, -40]) : orbit(t, sh.t0, sh.t1, [0, 0, 0], 220, 200, 60, 80, 1.45, 1.3, [0, 50, 0]);
      const S = Scene(E, TG, W, H_); street(S); tower(S);
      if (n === 'mirror') { const ru = ramp(t, V('mirror', 'sunlight') - 0.3, 0.6); if (ru > 0) for (let i = 0; i < 7; i++) { const y = 30 + i * 12, z0 = -40 + 9 + y * 0.12, src = [-40 + i * 3, 220, -120 + i * 25]; S.beads([src, [0, y, z0], F], SUN, t * 30, { spacing: 4, r: 0.8, reveal: ru }); } }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      if (n === 'street') tagLabel(ctx, W / 2, H_ * 0.2, 'LONDON · 2013', ramp(t, V('hook', '2013') - 0.1, 0.2), { px: 40 });
      else { tagLabel(ctx, W / 2, H_ * 0.2, 'CONCAVE MIRROR', ramp(t, V('mirror', 'concave') - 0.1, 0.2) * (1 - ramp(t, V('mirror', 'focused') - 0.2, 0.2)), { px: 38 }); tagLabel(ctx, W / 2, H_ * 0.2, 'FOCUSED', ramp(t, V('mirror', 'focused') - 0.1, 0.2), { px: 44, col: '#ffd24a' }); const fp = S.proj(F); heat = ramp(t, V('mirror', 'focused'), 0.4); if (heat > 0) { ctx.save(); const g = ctx.createRadialGradient(fp[0], fp[1], 0, fp[0], fp[1], 60); g.addColorStop(0, `rgba(255,230,140,${heat})`); g.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = g; ctx.fillRect(fp[0] - 60, fp[1] - 60, 120, 120); ctx.restore(); } }
    } else if (n === 'jag') {
      // the parked Jaguar warps; an egg fries on the pavement; then the permanent sunshade
      const warp = ramp(t, V('jag', 'warp') - 0.2, 1.2), eggU = ramp(t, V('jag', 'egg') - 0.3, 0.5), shadeU = ramp(t, V('jag', 'sunshade') - 0.3, 0.6);
      const [E, TG] = shadeU > 0 ? orbit(t, V('jag', 'sunshade') - 0.3, sh.t1, [0, 0, 0], 210, 200, 60, 70, 1.2, 1.1, [0, 60, 0]) : orbit(t, sh.t0, V('jag', 'sunshade') - 0.3, [0, 0, 28], 5.0, 4.2, 1.6, 1.3, 0.6, 0.3, [0, 0.6, 0]);
      const S = Scene(E, TG, W, H_); street(S); tower(S, { shade: shadeU });
      jaguar(S, [0.6, 0, 27.6], warp);
      S.cyl((p) => add(p, [-0.5, 0.02, 29.4]), 0.22, 0.02, [40, 40, 46], 14); S.ico([-0.5, 0.05, 29.4], [0.11 * eggU, 0.02, 0.09 * eggU], [250, 250, 246], { sub: 1 }); if (eggU > 0) S.ico([-0.5, 0.07, 29.4], [0.04, 0.025, 0.04], [255, 190, 40], { sub: 1 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: shadeU > 0 ? 0 : 0.3, focus: 4.5, shadows: shadeU <= 0 });
      if (shadeU <= 0) { heat = 0.4; tagLabel(ctx, W / 2, H_ * 0.2, 'WARPED', warp * (1 - eggU), { px: 44, col: '#ff8a6a' }); tagLabel(ctx, W / 2, H_ * 0.2, '"WALKIE-SCORCHIE"', ramp(t, V('jag', 'Walkie-Scorchie') - 0.2, 0.2), { px: 36 }); const mp = S.proj([1.35, 0.6, 28.15]); FX.heat(ctx, mp[0], mp[1] - 10, 60, warp, t); }
      else tagLabel(ctx, W / 2, H_ * 0.2, 'SUNSHADE', shadeU, { px: 44, col: '#7ee07a' });
    } else {
      // Dave stands in the hot spot, cracks an egg into a pan, looks pleased... and slowly melts with it
      const t0 = sh.t0, crack = ramp(t, t0 + 0.3, 0.3), melt = H.clamp((t - t0 - 1.4) / 1.8);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 28], 3.6, 3.2, 1.3, 1.1, 0.4, 0.2, [0, 0.9, 0]);
      const S = Scene(E, TG, W, H_); street(S); tower(S);
      const dp = [0, 0, 28];
      if (melt < 0.98) dave(S, dp, { pose: 'hold', hands: [null, [-0.25, 0.95, 0.42]], death: melt > 0 ? 'squash' : undefined, u: 0.92 * melt, sweat: 1, t, blink: blinkAt(t), look: [0, -1] });
      if (melt > 0.3) S.ico(add(dp, [0, 0.01, 0]), [0.55 * melt + 0.2, 0.02, 0.5 * melt + 0.2], DV.body, { sub: 1, noShadow: true });
      const pan = melt > 0 ? add(dp, [-0.3, 0.95 * (1 - melt) + 0.03, 0.42]) : add(dp, [-0.3, 0.95, 0.42]);
      S.cyl((p) => add(p, pan), 0.16, 0.03, [40, 40, 46], 14); S.rod(add(pan, [0, 0.02, 0]), add(pan, [0.35, 0.03, 0]), 0.015, [30, 30, 34], 6);
      if (crack > 0) { S.ico(add(pan, [0, 0.04, 0]), [0.09 * crack, 0.012, 0.08 * crack], [250, 250, 246], { sub: 1 }); S.ico(add(pan, [0, 0.05, 0]), [0.035, 0.02, 0.035], [255, 190, 40], { sub: 1 }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.3, focus: 3.2 });
      heat = 0.5; const hp = S.proj(add(dp, [0, 1.0, 0])); FX.heat(ctx, hp[0], hp[1] - 80, 120, 1, t);
    }
    if (heat > 0) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = `rgba(255,150,60,${0.35 * heat})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 13, rip, t, { cause: 'cause of death:\nsunny side up' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('jag'), color: 'pink', filter: 'lowpass', f: 800, gain: 0.08, a: 0.5, minor: true }); // city
    k.play('pop', V('hook', '2013'), { gain: 0.3 });
    k.play('sparkle', V('mirror', 'sunlight') - 0.2, { gain: 0.4 }); k.play('riser', V('mirror', 'focused') - 0.5, { dur: 0.5, gain: 0.3 });
    k.noise(V('jag', 'warp') - 0.2, { dur: 1.4, filter: 'bandpass', f: 3000, q: 2, gain: 0.08, a: 0.2 }); // sizzle
    k.noise(V('jag', 'egg') - 0.2, { dur: 1.5, filter: 'highpass', f: 2500, gain: 0.12, a: 0.05 }); k.play('success', V('jag', 'sunshade'), { gain: 0.3 });
    const t0 = ST('egg'); k.play('tock', t0 + 0.3, { f: 1200, gain: 0.5 }); k.noise(t0 + 0.4, { dur: 3, filter: 'highpass', f: 2500, gain: 0.15, a: 0.1 }); k.tone(t0 + 1.4, { f: [[0, 300], [1.8, 90]], type: 'triangle', dur: 1.8, gain: 0.07, a: 0.2, hold: 1.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
