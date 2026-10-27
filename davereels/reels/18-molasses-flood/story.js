  // Dave reel 18: the Boston molasses flood (1919). Dave paints the leaking tank brown. Rivets pop. His roller sinks. R.I.P. Dave #17.
  // The 21 deaths are stated plainly over an empty street: no people are shown in the wave.
  const BEATS = window.SCRIPT;
  const SH = [['tank', 0], ['drips', V('hook', 'leaked') - 0.2], ['paint', BEAT0('paint') - 0.1], ['burst', BEAT0('burst') - 0.1], ['wave', BEAT0('wave') - 0.1], ['court', V('wave', 'company') - 0.2], ['sink', BEAT0('end') - 0.2]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const STEELG = [150, 156, 164], BROWN = [96, 58, 30], MOL = [74, 40, 18], BRICK = [170, 96, 76];
  // the tank: 15 m tall, 27 m wide; paint = 0..1 how much is painted brown (bottom up); split = 0..1 it bursts open
  const tank = (S, o = {}) => {
    const pn = o.paint || 0, sp = o.split || 0;
    if (sp <= 0) { S.cyl((p) => add(p, [0, 0, 0]), 13.5, 15, STEELG, 20, { gloss: 0.3, paint: null, cap: [130, 134, 140] }); if (pn > 0) S.cyl((p) => add(p, [0, 0, 0]), 13.55, 15 * pn, BROWN, 20, { caps: false }); }
    else for (let i = 0; i < 20; i++) { const a0 = (i / 20) * TAU, a1 = ((i + 1) / 20) * TAU, open = sp * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7))), T = (q) => add(rotY([q[0], q[1], q[2]], 0), [0, 0, 0]); const P2 = (a, y, out) => [Math.cos(a) * (13.5 + out), y, Math.sin(a) * (13.5 + out)]; const out = 6 * open, tl = 0.5 * open; S.face([P2(a0, 0, 0), P2(a1, 0, 0), P2(a1, 15 * (1 - tl), out), P2(a0, 15 * (1 - tl), out)], BROWN, { two: true, c: [0, 7, 0] }); void T; }
    // the rivet seams
    if (sp <= 0) for (let k = 1; k < 6; k++) S.cyl((p) => add(p, [0, k * 2.5, 0]), 13.6, 0.12, shade(pn * 15 > k * 2.5 ? BROWN : STEELG, 0.85), 20, { caps: false, noShadow: true });
  };
  const streetSet = (S) => {
    S.quad([[-300, 0, -300], [300, 0, -300], [300, 0, 300], [-300, 0, 300]], [120, 116, 110], { bg: true });
    for (const [x, z, w, h] of [[-40, -30, 12, 14], [-40, 0, 12, 10], [-40, 30, 12, 16], [40, -20, 12, 12], [40, 15, 12, 18], [40, 45, 12, 11]]) S.box((p) => add(p, [x, h, z]), w, h, 12, BRICK, { bevel: 0.02, paint: (c, W2, H2) => { c.fillStyle = 'rgba(40,40,60,0.7)'; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) c.fillRect(W2 * (0.1 + i * 0.22), H2 * (0.1 + j * 0.22), W2 * 0.1, H2 * 0.12); } });
    S.rod([-30, 12, -60], [-30, 12, 80], 0.6, [60, 60, 66], 6); for (let z = -60; z <= 80; z += 20) S.rod([-30, 0, z], [-30, 12, z], 0.5, [60, 60, 66], 6); // the elevated railway
  };
  const ladderDave = (S, pn, o = {}) => {
    const ang = 2.3, base = [Math.cos(ang) * 14.6, 0, Math.sin(ang) * 14.6], top = add(base, [Math.cos(ang) * -0.8, 7.5, Math.sin(ang) * -0.8]);
    S.rod(add(base, [0.4, 0, 0.4]), add(top, [0.4, 0, 0.4]), 0.06, [150, 110, 70], 6); S.rod(add(base, [-0.4, 0, -0.4]), add(top, [-0.4, 0, -0.4]), 0.06, [150, 110, 70], 6);
    for (let k = 1; k < 10; k++) { const u = k / 10; S.rod(add(lerp3(base, top, u), [0.4, 0, 0.4]), add(lerp3(base, top, u), [-0.4, 0, -0.4]), 0.04, [150, 110, 70], 4); }
    const dp = add(lerp3(base, top, 0.62), [0, 0, 0]), yaw = Math.PI / 2 - ang - Math.PI, sw = Math.sin((o.t || 0) * 6) * 0.15;
    dave(S, dp, { pose: 'stand', yaw: yaw + Math.PI, hands: [daveLocal(dp, yaw + Math.PI, add(dp, [Math.cos(ang) * -0.75, 1.3 + sw, Math.sin(ang) * -0.75])), null], blink: blinkAt(o.t || 0), t: o.t, look: [0, 0] });
    const rp = add(dp, [Math.cos(ang) * -0.9, 1.3 + sw, Math.sin(ang) * -0.9]); S.cyl((p) => add(rotX(p, Math.PI / 2), rp), 0.12, 0.5, BROWN, 10); return dp;
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'tank' || n === 'drips' || n === 'paint' || n === 'burst') {
      const pn = n === 'paint' ? ramp(t, sh.t0, sh.t1 - sh.t0) * 0.6 : n === 'burst' ? 0.6 : 0, pops = n === 'burst' ? H.clamp((t - sh.t0) / 1.8) : 0;
      const [E, TG] = n === 'tank' ? orbit(t, sh.t0, sh.t1, [0, 0, 0], 60, 52, 15, 12, 0.5, 0.25, [0, 8, 0]) : n === 'drips' ? orbit(t, sh.t0, sh.t1, [-9.1, 0, 10.2], 7, 6, 1.6, 1.4, -0.95, -0.75, [0, 1.5, 0]) : orbit(t, sh.t0, sh.t1, [-9.7, 0, 10.9], 16, 14, 4, 3.5, -0.45, -0.75, [0, 4.5, 0]);
      const S = Scene(E, TG, W, H_); streetSet(S); tank(S, { paint: pn });
      if (n === 'drips') { for (let i = 0; i < 5; i++) { const k = (t * 0.8 + i / 5) % 1, a = 2.3 + (i - 2) * 0.03; S.ico([Math.cos(a) * 13.6, 3 - 2.8 * k, Math.sin(a) * 13.6], 0.08, MOL, { sub: 0 }); S.cyl((p) => add(p, [Math.cos(a) * 14.2, 0, Math.sin(a) * 14.2]), 0.2, 0.3, [180, 180, 190], 10, { caps: false }); } }
      if (n === 'paint' || n === 'burst') ladderDave(S, pn, { t });
      if (n === 'burst') { const r = H.rng(2); for (let i = 0; i < 16; i++) { const k = H.clamp(pops * 1.4 - r() * 0.4); if (k <= 0) continue; const a = 2.3 + (r() - 0.5) * 0.8, y = 2 + r() * 11; S.ico([Math.cos(a) * (13.6 + 8 * k), y + 3 * k - 6 * k * k, Math.sin(a) * (13.6 + 8 * k)], 0.12, [80, 80, 86], { sub: 0 }); } }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: n === 'drips' ? 0.3 : 0, focus: 9, shadows: n !== 'tank' });
      if (n === 'tank') tagLabel(ctx, W / 2, H_ * 0.2, '8.7 MILLION LITRES', ramp(t, V('hook', 'million') - 0.2, 0.2), { px: 36 });
      if (n === 'drips') tagLabel(ctx, W / 2, H_ * 0.2, 'FREE SAMPLES', ramp(t, V('hook', 'collected') - 0.1, 0.2), { px: 38 });
      if (n === 'paint') tagLabel(ctx, W / 2, H_ * 0.2, 'THE FIX: BROWN PAINT', ramp(t, V('paint', 'brown') - 0.1, 0.2), { px: 32, col: '#c08a5a' });
      if (n === 'burst') { tagLabel(ctx, W / 2, H_ * 0.2, 'OVERSTRESSED STEEL', ramp(t, V('burst', 'overstressed') - 0.1, 0.2), { px: 32, col: '#ff8a6a' }); flash = 0.15 * Math.exp(-Math.pow((t - V('burst', 'split')) * 5, 2)); }
    } else if (n === 'wave') {
      // the wave rolls down an empty street: up to 8 m high, over 50 km/h, thickening as it cools
      const u = H.clamp((t - sh.t0) / (sh.t1 - sh.t0)), front = -40 + 160 * u;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 60], 70, 60, 14, 11, 0.6, 0.4, [0, 4, -20]);
      const S = Scene(E, TG, W, H_); streetSet(S); tank(S, { split: 1 });
      for (let z = -20; z < front; z += 6) { const hgt = 8 * Math.exp(-Math.pow((front - z - 6) / 22, 2)) + 0.6; S.box((p) => add(p, [0, hgt / 2, z]), 26, hgt / 2, 3.2, MOL, { bevel: 0.2, gloss: 0.7 }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, '8 m · 50+ km/h', ramp(t, V('wave', 'eight') - 0.1, 0.2) * (1 - ramp(t, V('wave', 'thicker') - 0.4, 0.2)), { px: 40 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'COLD = THICKER', ramp(t, V('wave', 'thicker') - 0.3, 0.2) * (1 - ramp(t, V('wave', 'Twenty-one') - 0.2, 0.2)), { px: 38, col: '#c08a5a' });
      tagLabel(ctx, W / 2, H_ * 0.2, '21 KILLED', ramp(t, V('wave', 'Twenty-one') - 0.1, 0.2), { px: 40, col: '#ffffff' });
    } else if (n === 'court') {
      // the company blamed anarchists; the court blamed the tank
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 50, 45, 14, 12, -0.6, -0.4, [0, 6, 0]);
      const S = Scene(E, TG, W, H_); streetSet(S); tank(S, { split: 1 });
      S.quad([[-60, 0.03, -60], [60, 0.03, -60], [60, 0.03, 60], [-60, 0.03, 60]], MOL, { bg: true });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, 'COMPANY: "ANARCHISTS"', ramp(t, V('wave', 'anarchists') - 0.2, 0.2) * (1 - ramp(t, V('wave', 'court') - 0.2, 0.2)), { px: 30 });
      const cu = ramp(t, V('wave', 'tank') - 0.2, 0.2); if (cu > 0) { ctx.save(); ctx.translate(W / 2, H_ * 0.2); ctx.rotate(-0.06); ctx.scale(H.ease.back(cu), H.ease.back(cu)); ctx.strokeStyle = '#ff5a4a'; ctx.lineWidth = 6; ctx.strokeRect(-250, -42, 500, 84); ctx.fillStyle = '#ff5a4a'; ctx.font = FONT(800, 34); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('COURT: THE TANK', 0, 2); ctx.restore(); }
    } else {
      // Dave's roller slowly sinks into the brown
      const t0 = sh.t0, sink = H.ease.in(H.clamp((t - t0 - 0.4) / 2.2));
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 2.6, 2.2, 1.1, 0.8, 0.3, 0.15, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-40, 0, -40], [40, 0, -40], [40, 0, 40], [-40, 0, 40]], MOL, { bg: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(160,100,60,0.4)'; c.lineWidth = 3; for (let i = 0; i < 20; i++) { c.beginPath(); c.arc(w / 2, h / 2, i * 20 + ((t * 4) % 20), 0, TAU); c.stroke(); } } });
      const rp = [0, 0.5 - 0.9 * sink, 0]; S.rod(rp, add(rp, [0.4, 0.9, 0.2]), 0.03, [150, 110, 70], 6); S.cyl((p) => add(rotX(p, Math.PI / 2), add(rp, [0, 0, -0.25])), 0.13, 0.5, BROWN, 12);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.3, focus: 2.4, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, 'NOT A REPAIR', ramp(t, V('end', 'structural') - 0.1, 0.2), { px: 40, col: '#ff8a6a' });
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 17, rip, t, { cause: 'cause of death:\npaint' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('burst'), color: 'pink', filter: 'lowpass', f: 700, gain: 0.06, a: 0.5, minor: true });
    for (let i = 0; i < 6; i++) k.play('blip', ST('drips') + 0.3 + i * 0.25, { f: 300 + (i % 3) * 60, type: 'sine', dur: 0.05, gain: 0.4, minor: true });
    k.play('roller', ST('paint') + 0.1, { dur: ST('burst') - ST('paint'), gain: 0.4 });
    const tb = ST('burst'); for (let i = 0; i < 8; i++) k.play('tock', tb + 0.2 + i * 0.2, { f: 1800 + (i % 3) * 300, gain: 0.5 }); k.play('impact', V('burst', 'split'), { gain: 0.7 });
    k.noise(ST('wave'), { dur: ST('court') - ST('wave'), color: 'brown', filter: 'lowpass', f: [[0, 600], [4, 200]], gain: 0.45, a: 0.2 });
    k.play('stamp', V('wave', 'tank') - 0.2, { gain: 0.5 });
    k.tone(ST('sink') + 0.4, { f: [[0, 220], [2.2, 90]], type: 'triangle', dur: 2.2, gain: 0.06, a: 0.2, hold: 1.8 }); k.noise(ST('sink') + 0.4, { dur: 2.2, color: 'brown', filter: 'lowpass', f: 300, gain: 0.15, a: 0.3 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
