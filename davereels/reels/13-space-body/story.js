  // Dave reel 13: no suit in space. Dave takes the SHORTCUT airlock, puffs up and bounces off a satellite. R.I.P. Dave #12.
  // The 1966 test subject (who survived) is not shown; only the chamber and its pressure gauge.
  const BEATS = window.SCRIPT;
  const SH = [['airlock', 0], ['jar', BEAT0('boil') - 0.1], ['chamber', BEAT0('test') - 0.1], ['float', BEAT0('end') - 0.2]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const HULL = [214, 216, 222];
  const spaceBg = (ctx, W, H_) => { ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H_); const r = H.rng(77); for (let i = 0; i < 260; i++) { ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * r()})`; const s = r() < 0.1 ? 2 : 1; ctx.fillRect(r() * W, r() * H_, s, s); } };
  const earth = (S, c, R) => { S.ico(c, R, [60, 110, 200], { sub: 1, noShadow: true, gloss: 0.3 }); const r = H.rng(3); for (let i = 0; i < 14; i++) { const th = r() * TAU, ph = r() * Math.PI * 0.5; S.ico(add(c, mul([Math.cos(th) * Math.sin(ph), Math.cos(ph), Math.sin(th) * Math.sin(ph)], R * 1.005)), R * 0.15, i % 3 ? [90, 150, 80] : [240, 240, 244], { sub: 0, noShadow: true }); } };
  const satellite = (S, c, a = 0) => { S.box((p) => add(c, rotY(p, a)), 0.5, 0.5, 0.6, [220, 180, 70], { bevel: 0.1, gloss: 0.6 }); for (const sx of [-1, 1]) S.box((p) => add(c, rotY(add(p, [sx * 1.6, 0, 0]), a)), 1.0, 0.02, 0.5, [40, 60, 130], { bevel: 0, gloss: 0.8, paint: (cc, w, h) => { cc.strokeStyle = 'rgba(160,190,255,0.6)'; cc.lineWidth = 2; for (let i = 1; i < 6; i++) { cc.beginPath(); cc.moveTo((i * w) / 6, 0); cc.lineTo((i * w) / 6, h); cc.stroke(); } } }); S.rod(c, add(c, rotY([0, 0, 0.9], a)), 0.03, [200, 200, 210], 6); };
  // the station's airlock: a wall with a round hatch labelled SHORTCUT (open = 0..1)
  const airlock = (S, open) => {
    S.quad([[-6, 0, -1.2], [6, 0, -1.2], [6, 0, 6], [-6, 0, 6]], [180, 184, 192], { bg: true, grid: [0.5, 'rgba(0,0,0,0.12)'] });
    S.quad([[-6, 0, -1.2], [6, 0, -1.2], [6, 4, -1.2], [-6, 4, -1.2]], HULL, { bg: true, flat: true });
    S.box((p) => add(p, [0, 2.45, -1.17]), 0.62, 0.16, 0.02, [214, 50, 50], { bevel: 0.1, noShadow: true, paint: (c, w, h) => { c.fillStyle = '#d63232'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `800 ${h * 0.6}px "Montserrat"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SHORTCUT', w / 2, h * 0.55); } });
    if (open > 0) S.cyl((p) => add(rotX(p, Math.PI / 2), [0, 1.3, -1.19]), 0.75, 0.01, [5, 6, 15], 20, { glow: true, noShadow: true });
    S.cyl((p) => add(rotY(rotX(p, Math.PI / 2), -1.9 * open), [0, 1.3, -1.1 + 0.0]), 0.78, 0.12, [160, 164, 172], 20, { gloss: 0.5, cap: [150, 154, 162] });
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'airlock') {
      // Dave opens the hatch labelled SHORTCUT
      const open = ramp(t, V('hook', 'explode') - 0.3, 0.8);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0.5], 4.0, 3.4, 1.5, 1.4, 0.45, 0.2, [0, 1.25, -0.5]);
      const S = Scene(E, TG, W, H_); airlock(S, open);
      dave(S, [0.55, 0, -0.35], { pose: 'stand', yaw: -2.6, hands: [daveLocal([0.55, 0, -0.35], -2.6, [0.55, 1.3, -1.0]), null], blink: blinkAt(t), look: [0, 0] });
      S.render(ctx, W, H_, { bg: '#c8ccd4', dof: 0.3, focus: 3.5, shadowAlpha: 0.35 });
      tagLabel(ctx, W / 2, H_ * 0.2, "DON'T EXPLODE", ramp(t, V('hook', 'explode') - 0.1, 0.2) * (1 - ramp(t, V('hook', 'bad') - 0.2, 0.2)), { px: 40, col: '#7ee07a' });
      tagLabel(ctx, W / 2, H_ * 0.2, 'BAD NEWS', ramp(t, V('hook', 'bad') - 0.1, 0.2), { px: 44, col: '#ff6a5a' });
    } else if (n === 'jar') {
      // a glass of water at body temperature in a bell jar: pump the air out and it boils
      const vac = ramp(t, V('boil', 'pressure') - 0.4, 1.2), boil = ramp(t, V('boil', 'boil') - 0.2, 0.4);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 2.6, 2.3, 1.2, 1.15, 0.3, 0.05, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.45, 0.35, 0.75);
      S.box((p) => add(p, [0, 0.8, 0]), 0.42, 0.04, 0.42, [80, 84, 92], { bevel: 0.2 });
      S.cyl((p) => add(p, [0, 0.84, 0]), 0.1, 0.24, [200, 220, 240], 14, { alpha: 0.35 }); S.cyl((p) => add(p, [0, 0.845, 0]), 0.092, 0.17, [100, 170, 230], 14, { alpha: 0.6 });
      S.ico([0, 0.84, 0], [0.36, 0.5, 0.36], [210, 230, 245], { sub: 1, alpha: 0.18, T: (q) => [q[0], Math.max(0, q[1]), q[2]] });
      if (boil > 0) { const r = H.rng(5); for (let i = 0; i < 18; i++) { const k = (t * 1.5 + r()) % 1; S.dots.push({ p: [r.range(-0.07, 0.07), 0.86 + k * 0.17, r.range(-0.07, 0.07)], col: [235, 245, 255], r: 0.008 * boil }); } }
      S.beads([[0, 1.1, 0], [0.5, 1.1, 0], [0.9, 0.9, 0]], P.air, -t * 1.5, { spacing: 0.06, r: 0.012, reveal: 1 - vac });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.4 });
      tagLabel(ctx, W / 2, H_ * 0.2, '37°C · 0 PRESSURE', ramp(t, V('boil', 'pressure') - 0.1, 0.2) * (1 - ramp(t, V('boil', 'skin') - 0.2, 0.2)), { px: 34 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'SKIN HOLDS', ramp(t, V('boil', 'holds') - 0.1, 0.2) * (1 - ramp(t, V('boil', 'ten') - 0.2, 0.2)), { px: 40, col: '#7ee07a' });
      tagLabel(ctx, W / 2, H_ * 0.2, '10–15 s', ramp(t, V('boil', 'ten') - 0.1, 0.2), { px: 48, col: '#ff8a6a' });
    } else if (n === 'chamber') {
      // 1966: a vacuum chamber, its gauge drops to zero, then re-pressurises in seconds
      const leak = ramp(t, V('test', 'leaked') - 0.2, 0.6), rep = ramp(t, V('test', 're-pressurised') - 0.1, 0.5), pr = 1 - leak + leak * rep;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 6, 5.2, 2.2, 1.9, 0.5, 0.25, [0, 1.6, 0]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      S.cyl((p) => add(p, [-0.4, 0, -0.5]), 1.4, 3.0, [176, 180, 190], 18, { gloss: 0.4, cap: [150, 154, 164] });
      S.cyl((p) => add(rotX(p, Math.PI / 2), [-0.4, 1.6, 0.92]), 0.25, 0.04, [40, 50, 70], 14, { cap: [120, 160, 200] });
      gauge(S, [1.4, 1.6, 0.2], 1.3, 0.85 * pr, -0.5);
      S.render(ctx, W, H_, { dof: 0.33, focus: 5.5 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'NASA · 1966', ramp(t, sh.t0 + 0.1, 0.2) * (1 - leak), { px: 40 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'SALIVA BUBBLING', ramp(t, V('test', 'saliva') - 0.1, 0.2) * (1 - rep), { px: 34, col: '#7ad0ff' });
      tagLabel(ctx, W / 2, H_ * 0.2, 'HE SURVIVED', ramp(t, V('test', 'survived') - 0.1, 0.2), { px: 40, col: '#7ee07a' });
      if (leak > 0 && rep < 1) { ctx.save(); ctx.globalAlpha = 0.25 * leak * (1 - rep) * (0.5 + 0.5 * Math.sin(t * 10)); ctx.fillStyle = '#ff3a2a'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    } else {
      // Dave floats out, puffs up like a balloon, and bounces gently off a satellite
      const t0 = sh.t0, u = H.clamp((t - t0) / 3.0), puff = ramp(t, t0 + 0.2, 1.6), hit = t0 + 2.0;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 7, 6.4, 1.0, 1.4, 0.3, 0.1, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); earth(S, [8, -60, -60], 45); satellite(S, [1.4, 1.2, -0.8], 0.4 + t * 0.05);
      const bp = t < hit ? lerp3([-2.5, -0.6, 0.8], [0.45, 0.9, -0.3], H.clamp((t - t0) / 2.0)) : add([0.45, 0.9, -0.3], mul([-0.9, 0.2, 0.5], t - hit));
      dave(S, bp, { pose: 'flail', t: t * 0.2, death: 'puff', u: puff, roll: 0.3 * Math.sin(t * 0.7) + (t > hit ? (t - hit) * 0.8 : 0), blink: blinkAt(t), look: [1, 0] });
      S.render(ctx, W, H_, { bg: spaceBg, dof: 0, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, 'NOT EXPLODED', ramp(t, V('end', 'exploded') - 0.1, 0.2), { px: 40, col: '#7ee07a' });
      const hp = S.proj([0.6, 1.1, -0.4]); FX.sparks(ctx, hp[0], hp[1], H.clamp((t - hit) / 0.5), 3);
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 12, rip, t, { cause: 'cause of death:\ntook the shortcut' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.tone(0.05, { f: 60, type: 'sine', dur: ST('jar'), gain: 0.06, a: 0.5, hold: ST('jar') - 0.6, minor: true }); // station hum
    k.play('click', V('hook', 'explode') - 0.3, { gain: 0.7 }); k.noise(V('hook', 'explode') - 0.2, { dur: 1.2, filter: 'highpass', f: 1200, gain: 0.3, a: 0.02 });
    k.noise(V('boil', 'pressure') - 0.4, { dur: 1.2, filter: 'bandpass', f: 600, q: 1, gain: 0.15, a: 0.1 });
    for (let i = 0; i < 12; i++) k.play('blip', V('boil', 'boil') + i * 0.12, { f: 400 + (i % 5) * 80, type: 'sine', dur: 0.04, gain: 0.4, minor: true });
    k.play('ding', V('boil', 'ten'), { f: 'E5', gain: 0.25 });
    const leak = V('test', 'leaked'); for (let i = 0; i < 6; i++) k.play('buzz', leak + i * 0.5, { f: 220, dur: 0.25, gain: 0.15, minor: true });
    k.noise(V('test', 're-pressurised') - 0.1, { dur: 0.8, color: 'pink', filter: 'lowpass', f: 2000, gain: 0.3, a: 0.05 }); k.play('success', V('test', 'survived'), { gain: 0.35 });
    const t0 = ST('float'); k.tone(t0 + 0.2, { f: [[0, 200], [1.6, 500]], type: 'triangle', dur: 1.6, gain: 0.06, a: 0.1, hold: 1.4 }); k.play('tock', t0 + 2.0, { f: 300, gain: 0.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
