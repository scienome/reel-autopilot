  // Dave reel 20: the Ryugyong Hotel. Dave at reception rings the bell; the lift opens onto open sky; he steps in. R.I.P. Dave #19.
  const BEATS = window.SCRIPT;
  const SH = [['pyramid', 0], ['build', BEAT0('size') - 0.1], ['shell', BEAT0('shell') - 0.1], ['glass', V('shell', '2008') - 0.2], ['lobby', BEAT0('end') - 0.8]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const CONC = [168, 164, 156], GLASSB = [120, 160, 200];
  // the hotel: three wings meeting at a central core, each a tall triangular slab, tapering to a point at 330 m.
  // skin: 0 = bare concrete, 1 = glass. lights: 0..1 LED dots on the outside. built: 0..1 grows from the ground.
  const hotel = (S, o = {}) => {
    const Hh = 330 * (o.built ?? 1), sk = o.skin || 0, col = H.mix(CONC, GLASSB, sk);
    for (let k = 0; k < 3; k++) { const a = (k * TAU) / 3, d = [Math.cos(a), 0, Math.sin(a)], s = [-d[2], 0, d[0]]; const P2 = (r, y, w) => add(add(mul(d, r), mul(s, w)), [0, y, 0]); const top = Math.min(Hh, 300);
      S.face([P2(0, 0, -14), P2(90, 0, -14), P2(4, top, -6), P2(0, top, -6)], col, { c: [0, 100, 0], gloss: sk * 0.8 }); S.face([P2(0, 0, 14), P2(90, 0, 14), P2(4, top, 6), P2(0, top, 6)], col, { c: [0, 100, 0], gloss: sk * 0.8 }); S.face([P2(90, 0, -14), P2(90, 0, 14), P2(4, top, 6), P2(4, top, -6)], shade(col, 1.05), { c: [0, 100, 0], gloss: sk * 0.8 }); }
    if (Hh > 300) S.cyl((p) => add(p, [0, 300, 0]), 14, Hh - 300, shade(col, 0.95), 10, { r2: 1 });
    if (o.crane) { S.rod([20, 0, 20], [20, Hh + 30, 20], 1.2, [230, 180, 40], 6); S.rod([-30, Hh + 28, 20], [70, Hh + 28, 20], 0.8, [230, 180, 40], 6); }
    if (o.lights > 0) { const r = H.rng(6); for (let i = 0; i < 140; i++) { const k = i % 3, a = (k * TAU) / 3, d = [Math.cos(a), 0, Math.sin(a)], s = [-d[2], 0, d[0]], y = r() * 280, rr = 90 * (1 - y / 300) * r(), side = r() < 0.5 ? -1 : 1; const p = add(add(mul(d, rr), mul(s, side * (14 - 8 * y / 300) * 1.02)), [0, y, 0]); S.dots.push({ p, col: [[255, 80, 80], [80, 200, 255], [255, 220, 80]][i % 3], r: 1.2 * o.lights }); } }
  };
  const city = (S) => { S.quad([[-3000, 0, -3000], [3000, 0, -3000], [3000, 0, 3000], [-3000, 0, 3000]], [150, 150, 140], { bg: true }); const r = H.rng(3); for (let i = 0; i < 40; i++) { const a = r() * TAU, d = 200 + r() * 600; S.box((p) => add(p, [Math.cos(a) * d, 15, Math.sin(a) * d]), 15, 15 + r() * 15, 12, [196, 190, 180], { bevel: 0.05 }); } };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n !== 'lobby') {
      const built = n === 'build' ? ramp(t, sh.t0, 1.8) : 1, skin = n === 'glass' ? ramp(t, V('shell', '2008') - 0.1, 0.8) : 0, lights = n === 'glass' ? ramp(t, V('shell', 'lights') - 0.2, 0.4) : 0, night = n === 'glass' ? 0.6 * ramp(t, V('shell', 'lights') - 0.4, 0.5) : 0;
      const [E, TG] = n === 'pyramid' ? orbit(t, sh.t0, sh.t1, [0, 0, 0], 700, 600, 80, 120, 0.4, 0.2, [0, 150, 0]) : n === 'build' ? orbit(t, sh.t0, sh.t1, [0, 0, 0], 650, 620, 60, 70, -0.3, -0.45, [0, 160, 0]) : orbit(t, sh.t0, sh.t1, [0, 0, 0], 620, 560, 90, 100, 1.2, 0.95, [0, 150, 0]);
      const S = Scene(E, TG, W, H_); city(S); hotel(S, { built, skin, lights, crane: n === 'build' || n === 'shell' });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      if (night > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(40,40,90,${night})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); const S2 = Scene(E, TG, W, H_); hotel(S2, { skin: 1, lights }); S2.faces.length = 0; S2.render(ctx, W, H_, { bg: () => {}, dof: 0, shadows: false }); }
      if (n === 'pyramid') tagLabel(ctx, W / 2, H_ * 0.12, 'PYONGYANG · 1987', ramp(t, V('hook', '1987') - 0.1, 0.2), { px: 36 });
      if (n === 'build') { tagLabel(ctx, W / 2, H_ * 0.12, '105 FLOORS · 330 m', ramp(t, V('size', 'floors') - 0.2, 0.2), { px: 34 }); tagLabel(ctx, W / 2, H_ * 0.19, '$0', ramp(t, V('size', 'money') - 0.1, 0.2), { px: 44, col: '#ff6a5a' }); }
      if (n === 'shell') { const pu = ramp(t, V('shell', 'photos') - 0.2, 0.2); if (pu > 0) { ctx.save(); ctx.globalAlpha = pu; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.strokeRect(W * 0.1, H_ * 0.25, W * 0.8, H_ * 0.5); ctx.restore(); FX.no(ctx, W / 2, H_ * 0.5, 120, pu); } tagLabel(ctx, W / 2, H_ * 0.12, 'EMPTY FOR YEARS', ramp(t, V('shell', 'empty') - 0.1, 0.2), { px: 36 }); }
      if (n === 'glass') { tagLabel(ctx, W / 2, H_ * 0.12, '2008: GLASS SKIN', skin * (1 - ramp(t, V('shell', 'Inside') - 0.2, 0.2)), { px: 34, col: '#7ad0ff' }); tagLabel(ctx, W / 2, H_ * 0.12, 'INSIDE: NOTHING', ramp(t, V('shell', 'Inside') - 0.1, 0.2) * (1 - ramp(t, V('shell', 'guest') - 0.4, 0.2)), { px: 36 }); tagLabel(ctx, W / 2, H_ * 0.12, 'GUESTS: 0', ramp(t, V('shell', 'guest') - 0.3, 0.2), { px: 44, col: '#ffd24a' }); }
    } else {
      // reception: Dave rings the bell; the lift doors open onto open sky; he steps in
      const t0 = sh.t0, ring = t0 + 0.5, open = ramp(t, ring + 0.4, 0.5), step = H.clamp((t - ring - 1.1) / 0.6), fall = H.clamp((t - ring - 1.7) / 0.6);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.3, 0, 0], 4.4, 4.0, 1.6, 1.5, -0.4, -0.25, [0, 1.3, -0.6]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-6, 0, -1.8], [6, 0, -1.8], [6, 0, 6], [-6, 0, 6]], [196, 186, 170], { bg: true, grid: [0.6, 'rgba(0,0,0,0.1)'] });
      S.quad([[-6, 0, -1.8], [-0.7, 0, -1.8], [-0.7, 4, -1.8], [-6, 4, -1.8]], CONC, { bg: true, flat: true }); S.quad([[0.7, 0, -1.8], [6, 0, -1.8], [6, 4, -1.8], [0.7, 4, -1.8]], CONC, { bg: true, flat: true }); S.quad([[-0.7, 2.3, -1.8], [0.7, 2.3, -1.8], [0.7, 4, -1.8], [-0.7, 4, -1.8]], CONC, { bg: true, flat: true });
      S.quad([[-0.7, 0, -1.85], [0.7, 0, -1.85], [0.7, 2.3, -1.85], [-0.7, 2.3, -1.85]], [190, 210, 240], { bg: true, flat: true, paint: (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#b8a0e0'); g.addColorStop(1, '#f6c8b0'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,0.8)'; c.fillRect(w * 0.1, h * 0.3, w * 0.3, h * 0.05); } });
      for (const sx of [-1, 1]) S.box((p) => add(p, [sx * (0.35 + 0.7 * open), 1.15, -1.75]), 0.35, 1.15, 0.03, [200, 204, 212], { bevel: 0.05, gloss: 0.7 });
      S.box((p) => add(p, [-0.15, 2.5, -1.75]), 0.3, 0.1, 0.02, [30, 30, 36], { glow: true, paint: (c, w, h) => { c.fillStyle = '#111'; c.fillRect(0, 0, w, h); c.fillStyle = '#f44'; c.font = `800 ${h * 0.7}px monospace`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('105 ▲', w / 2, h / 2); } });
      S.box((p) => add(p, [1.6, 0.55, 0.5]), 0.9, 0.55, 0.4, [150, 60, 50], { bevel: 0.1 }); S.cyl((p) => add(p, [1.4, 1.1, 0.5]), 0.08, 0.06, [230, 200, 90], 12, { r2: 0.02, gloss: 0.8 });
      const dp = step > 0 ? lerp3([1.0, 0, 0.4], [0, 0, -2.2], step) : [1.0, 0, 0.4]; const dy = fall > 0 ? -6 * fall * fall : 0;
      if (fall < 0.9) dave(S, add(dp, [0, dy, 0]), { pose: step > 0 ? 'walk' : 'stand', t, yaw: step > 0 ? Math.PI - 0.4 : 1.2, hands: t < ring + 0.3 && step <= 0 ? [null, daveLocal([1.0, 0, 0.4], 1.2, [1.4, 1.2, 0.5])] : undefined, blink: blinkAt(t), look: [0, 0] });
      S.render(ctx, W, H_, { bg: '#e0d0c0', dof: 0.3, focus: 4, shadowAlpha: 0.35 });
      const bp = S.proj([1.4, 1.2, 0.5]); FX.sparks(ctx, bp[0], bp[1], H.clamp((t - ring) / 0.4), 2);
      tagLabel(ctx, W / 2, H_ * 0.2, 'NO LIFT', ramp(t, V('end', 'lift') - 0.1, 0.2), { px: 44, col: '#ff6a5a' });
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 19, rip, t, { cause: 'cause of death:\nthe first guest' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('lobby'), color: 'pink', filter: 'lowpass', f: 600, gain: 0.05, a: 0.5, minor: true }); k.play('pop', V('hook', '1987'), { gain: 0.3 });
    for (let i = 0; i < 5; i++) k.play('thud', ST('build') + 0.2 + i * 0.35, { f: 120, gain: 0.25, minor: true }); k.play('error', V('size', 'money'), { gain: 0.35 });
    k.play('shutter', V('shell', 'photos') - 0.2, { gain: 0.5 }); k.play('sparkle', V('shell', '2008'), { gain: 0.4 }); k.play('neon', V('shell', 'lights') - 0.2, { gain: 0.4 }); k.play('ding', V('shell', 'guest') - 0.3, { f: 'C5', gain: 0.25 });
    const ring = ST('lobby') + 0.5; k.play('bell', ring, { f: 'E6', gain: 0.6 }); k.play('ding', ring + 0.5, { f: 'G5', gain: 0.4 }); k.noise(ring + 0.4, { dur: 0.5, filter: 'bandpass', f: 1200, q: 1, gain: 0.15, a: 0.05 });
    k.noise(ring + 0.9, { dur: 2, color: 'pink', filter: 'bandpass', f: 500, q: 0.5, gain: 0.15, a: 0.3 }); k.play('swish', ring + 1.7, { dur: 0.6, gain: 0.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
