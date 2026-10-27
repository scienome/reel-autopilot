  // Dave reel 15: Thomas Midgley Jr. — leaded petrol, CFCs, and the pulley bed. Dave plays the inventor; the bed takes him. R.I.P. Dave #14.
  const BEATS = window.SCRIPT;
  const SH = [['proud', 0], ['knock', BEAT0('lead') - 0.1], ['hands', V('lead', 'prove') - 0.2], ['cfc', BEAT0('cfc') - 0.1], ['bed', BEAT0('bed') - 0.1], ['sky', BEAT0('end') - 0.1]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const COAT = [240, 240, 236], LEAD = [150, 160, 120];
  const labDave = (S, p, o = {}) => dave(S, p, { suit: true, suitCol: COAT, ...o });
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'proud') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.2, 2.7, 1.4, 1.3, 0.4, 0.15, [0, 1.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      labDave(S, [0, 0, 0], { pose: 'thumbs', blink: blinkAt(t), t });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3 });
      tagLabel(ctx, W / 2, H_ * 0.2, '2 BIG IDEAS', ramp(t, V('hook', 'two') - 0.1, 0.2), { px: 44 });
    } else if (n === 'knock') {
      // engine knock: the fuel mix ignites by itself before the spark's flame gets there (a second, colliding flame). Lead stops it.
      const lead = ramp(t, V('lead', 'lead') - 0.1, 0.3), cyc = (t * 1.2) % 1;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 2.3, 2.0, 1.2, 1.15, 0.3, 0.05, [0, 1.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.45, 0.35, 0.75);
      S.cyl((p) => add(p, [0, 0.8, 0]), 0.22, 0.65, [190, 196, 206], 16, { alpha: 0.3, caps: false });
      const py = 0.85 + 0.25 * (1 - Math.cos(cyc * TAU)) / 2; S.cyl((p) => add(p, [0, py, 0]), 0.21, 0.08, [150, 152, 162], 16);
      S.box((p) => add(p, [0, 1.47, 0]), 0.24, 0.02, 0.24, [120, 124, 132]); S.rod([0, 1.45, 0], [0, 1.6, 0], 0.02, [230, 230, 236], 6);
      const fl = H.clamp((cyc - 0.05) / 0.3); if (fl > 0 && fl < 1) { S.ico([0, 1.4, 0], 0.05 + 0.16 * fl, [255, 170, 60], { sub: 0, glow: true, noShadow: true }); if (lead < 0.5) S.ico([0.12, py + 0.12, 0.05], 0.04 + 0.12 * fl, [255, 80, 40], { sub: 0, glow: true, noShadow: true }); }
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.2 });
      const kp = S.proj([0.12, py + 0.12, 0.05]); if (lead < 0.5 && fl > 0 && fl < 1) { FX.sparks(ctx, kp[0], kp[1], fl, 4); }
      tagLabel(ctx, W / 2, H_ * 0.2, 'KNOCK!', (1 - lead) * ramp(t, V('lead', 'knocking') - 0.1, 0.2), { px: 48, col: '#ff6a5a' });
      tagLabel(ctx, W / 2, H_ * 0.2, '+ LEAD', lead * (1 - ramp(t, V('lead', 'knocking') - 0.1, 0.2)), { px: 44, col: '#c8d090' });
    } else if (n === 'hands') {
      // he washed his hands in it in front of reporters... then took a long holiday
      const hol = ramp(t, V('lead', 'holiday') - 0.2, 0.4);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.0, 2.6, 1.4, 1.3, 0.3, 0.1, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      S.box((p) => add(p, [0, 0.45, 0.45]), 0.5, 0.45, 0.3, [130, 110, 90], { bevel: 0.1 }); S.cyl((p) => add(p, [0, 0.9, 0.45]), 0.25, 0.08, [200, 204, 212], 16, { cap: LEAD });
      const sc = Math.sin(t * 8) * 0.04;
      labDave(S, [0, 0, -0.1], { pose: 'stand', hands: [[0.12 + sc, 0.95, 0.52], [-0.12 - sc, 0.95, 0.52]], blink: blinkAt(t), t, look: [0, 0], colors: hol > 0 ? { body: H.mix(DV.body, [180, 200, 120], hol) } : undefined, sweat: hol });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.7 });
      if (t < V('lead', 'holiday') - 0.2) for (let i = 0; i < 3; i++) { const fl = Math.max(0, Math.sin(t * 7 + i * 2)); if (fl > 0.95) { ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } }
      tagLabel(ctx, W / 2, H_ * 0.2, 'PROVING IT\'S SAFE', ramp(t, V('lead', 'safe') - 0.1, 0.2) * (1 - hol), { px: 38 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'LONG HOLIDAY', hol, { px: 44, col: '#ff8a6a' });
    } else if (n === 'cfc') {
      // CFCs: the perfect fridge gas... it drifts up and tears a hole in the ozone layer
      const up = ramp(t, V('cfc', 'tore') - 1.0, 1.2), hole = ramp(t, V('cfc', 'hole') - 0.2, 0.5);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 5.5, 5.0, 2.0, 2.2, 0.35, 0.15, [0, 1.9, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      S.box((p) => add(p, [-0.5, 0.9, 0]), 0.4, 0.9, 0.35, [236, 236, 240], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#aaa'; c.fillRect(w * 0.85, h * 0.2, w * 0.05, h * 0.25); c.fillRect(w * 0.85, h * 0.6, w * 0.05, h * 0.2); c.fillStyle = '#ccc'; c.fillRect(0, h * 0.5, w, 3); } });
      labDave(S, [0.6, 0, 0.3], { pose: 'point', yaw: -1.2, blink: blinkAt(t), t });
      // the ozone layer: a band of blue glowing tiles up high, with a hole
      for (let i = -6; i <= 6; i++) for (let j = -2; j <= 2; j++) { const d = Math.hypot(i, j * 1.5); if (d < 2.5 * hole) continue; S.box((p) => add(p, [i * 0.38, 3.6, -1 + j * 0.38]), 0.18, 0.03, 0.18, [120, 180, 255], { glow: true, noShadow: true, bevel: 0 }); }
      S.beads([[-0.5, 1.8, 0], [-0.3, 2.6, -0.4], [0, 3.6, -1]], [240, 240, 255], t * 1.2, { spacing: 0.12, r: 0.03, reveal: up });
      S.render(ctx, W, H_, { dof: 0.33, focus: 5 });
      tagLabel(ctx, W / 2, H_ * 0.14, 'PERFECT FRIDGE GAS', ramp(t, V('cfc', 'perfect') - 0.1, 0.2) * (1 - hole), { px: 34, col: '#7ee07a' });
      tagLabel(ctx, W / 2, H_ * 0.14, 'OZONE HOLE', hole, { px: 40, col: '#ff6a5a' });
    } else if (n === 'bed') {
      // polio; a bed with ropes and pulleys. Dave tugs a rope, the pulleys whir, he is yanked up out of frame. One slipper falls.
      const tg = V('bed', 'machine', 2) - 0.6, yank = H.clamp((t - tg) / 0.6), slip = H.clamp((t - tg - 0.6) / 0.7);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.6, 3.2, 1.5, 1.4, 0.55, 0.35, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      S.box((p) => add(p, [0, 0.3, 0]), 0.5, 0.18, 1.05, [150, 110, 80], { bevel: 0.1 }); S.box((p) => add(p, [0, 0.52, 0]), 0.48, 0.06, 1.0, [240, 240, 246], { bevel: 0.3 }); S.box((p) => add(p, [0, 0.6, -0.9]), 0.3, 0.06, 0.12, [250, 250, 252], { bevel: 0.4 });
      for (const z of [-0.9, 0.9]) S.rod([0, 0.4, z * 1.08], [0, 2.4, z * 1.08], 0.04, [120, 90, 70], 6); S.rod([0, 2.4, -0.98], [0, 2.4, 0.98], 0.04, [120, 90, 70], 6);
      const spin = t > tg ? (t - tg) * 25 : 0; for (const z of [-0.5, 0, 0.5]) S.cyl((p) => add(rotX(rotY(p, spin), Math.PI / 2), [0, 2.3, z]), 0.09, 0.04, [200, 200, 210], 10);
      const dy = 4 * H.ease.in(yank);
      dave(S, [0, -0.22 + dy, 0.1], { pose: 'stand', pitch: -Math.PI / 2 * (1 - yank * 0.8), yaw: 0, hands: [[0.2, 1.5, 0.35], [-0.05, 1.75, 0.4]], blink: blinkAt(t), look: [0, 1], t, death: yank > 0 ? 'launch' : undefined, u: yank * 0.3, to: [0, 0, 0], arc: 0 });
      S.rod([-0.05, 2.3, 0], [-0.05, 0.75 + dy, 0.2], 0.012, [230, 220, 190], 4); S.rod([0.05, 2.3, 0.5], [0.05, 0.6 + dy, 0.4], 0.012, [230, 220, 190], 4);
      if (yank > 0.5) S.box((p) => add(rotZ(p, slip * 4), [0.3, Math.max(0.05, 2.2 - 2.2 * slip * slip), 0.7]), 0.06, 0.03, 0.12, [200, 80, 90], { bevel: 0.3 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.2 });
      tagLabel(ctx, W / 2, H_ * 0.2, '1944', ramp(t, V('bed', '1944') - 0.1, 0.2), { px: 44 });
    } else {
      // one organism, the whole atmosphere: the Earth with a lead haze and an ozone hole
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 9, 8, 2, 2.5, 0.2, -0.1, [0, 0, 0]);
      const S = Scene(E, TG, W, H_);
      S.ico([0, 0, 0], 2.4, [60, 110, 200], { sub: 1, gloss: 0.3, noShadow: true }); const r = H.rng(3); for (let i = 0; i < 14; i++) { const th = r() * TAU, ph = r() * Math.PI; S.ico(mul([Math.cos(th) * Math.sin(ph), Math.cos(ph), Math.sin(th) * Math.sin(ph)], 2.41), 0.4, [90, 150, 80], { sub: 0, noShadow: true }); }
      S.ico([0, 0, 0], 2.75, [190, 190, 150], { sub: 1, alpha: 0.18, noShadow: true });
      S.render(ctx, W, H_, { bg: (c, w, h) => { c.fillStyle = '#06070f'; c.fillRect(0, 0, w, h); }, dof: 0, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, 'ONE ORGANISM', ramp(t, V('end', 'single') - 0.1, 0.2), { px: 40 });
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 14, rip, t, { cause: 'cause of death:\nhis own invention' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.play('success', V('hook', 'two'), { gain: 0.35 });
    const kt = ST('knock'), kl = V('lead', 'lead'); for (let x = kt; x < ST('hands'); x += 0.83) { k.play('thud', x + 0.05, { f: 120, gain: 0.25, minor: true }); if (x < kl) k.play('tock', x + 0.15, { f: 2400, gain: 0.5 }); }
    for (let i = 0; i < 5; i++) k.play('shutter', V('lead', 'reporters') - 0.6 + i * 0.25, { gain: 0.35, minor: true });
    k.noise(V('lead', 'washed') - 0.2, { dur: 1.2, filter: 'bandpass', f: 1500, q: 0.8, gain: 0.08, a: 0.1 }); k.play('error', V('lead', 'holiday'), { gain: 0.3 });
    k.play('ding', V('cfc', 'perfect'), { f: 'C6', gain: 0.25 }); k.play('glitch', V('cfc', 'hole') - 0.1, { gain: 0.4 });
    const tg = V('bed', 'machine', 2) - 0.6; k.play('tape', tg - 0.1, { dur: 0.3, gain: 0.4 }); k.play('roller', tg, { dur: 0.7, gain: 0.5 }); k.play('swish', tg + 0.2, { dur: 0.4, gain: 0.5 }); k.play('thud', tg + 1.3, { f: 300, gain: 0.25 });
    k.tone(ST('sky'), { f: 70, type: 'sine', dur: 3, gain: 0.08, a: 0.8, hold: 1.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
