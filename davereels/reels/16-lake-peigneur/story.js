  // Dave reel 16: Lake Peigneur (1980). Dave reads the map upside down; later, Dave goes fishing. His hard hat bobs back up. R.I.P. Dave #15.
  const BEATS = window.SCRIPT;
  const SH = [['lake', 0], ['map', V('hook', 'drill') - 0.2], ['xray', BEAT0('hit') - 0.1], ['drain', BEAT0('drain') - 0.1], ['boat', V('drain', 'Eleven') - 0.2], ['miners', BEAT0('miners') - 0.1], ['hat', BEAT0('end') - 0.1]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const WATER = [70, 130, 160], MUD = [120, 100, 76], SALT = [236, 236, 230], ROCK = [150, 130, 110];
  // the lake (a disc of water of radius R at level y), a muddy bowl when it's gone, trees around, the rig in the middle
  const lakeSet = (S, o = {}) => {
    const lvl = o.level ?? 1; // 1 = full, 0 = drained
    S.quad([[-400, 0, -400], [400, 0, -400], [400, 0, 400], [-400, 0, 400]], [100, 140, 80], { bg: true });
    S.cyl((p) => add(p, [0, -6, 0]), 60, 6, MUD, 24, { caps: true, noShadow: true });
    if (lvl > 0.02) S.cyl((p) => add(p, [0, -6 + 6.05 * lvl, 0]), 60 * (0.6 + 0.4 * lvl), 0.05, WATER, 24, { noShadow: true, gloss: 0.6, capPaint: o.swirl != null ? (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 3; for (let k = 0; k < 6; k++) { c.beginPath(); for (let a = 0; a < 12; a += 0.2) { const r = (w * 0.45 * a) / 12, an = a + o.swirl * 3 + k; const x = w / 2 + Math.cos(an) * r, y = h / 2 + Math.sin(an) * r; a ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); } } : null });
    const r = H.rng(8); for (let i = 0; i < 26; i++) { const a = (i / 26) * TAU, d = 68 + r() * 20; tree(S, Math.cos(a) * d, Math.sin(a) * d, 8 + r() * 4, i); }
    if (o.rig !== false) { const ry = -6 + 6 * lvl + (o.rigSink || 0); S.box((p) => add(p, [8, ry + 1, 4]), 6, 1, 5, [190, 70, 50], { bevel: 0.05 }); S.cyl((p) => add(p, [8, ry + 2, 4]), 1.6, 22, [200, 200, 210], 4, { r2: 0.3 }); }
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'lake' || n === 'drain') {
      const dr = n === 'drain' ? ramp(t, sh.t0, sh.t1 - sh.t0) : 0;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 150, 130, 60, 80, 0.4, 0.2, [0, -3, 0]);
      const S = Scene(E, TG, W, H_); lakeSet(S, { level: 1 - dr, swirl: n === 'drain' ? t : null, rigSink: -20 * ramp(t, V('drain', 'rig') - 0.5, 1) });
      // the canal: a channel from the edge, flowing in (backwards) and spilling as a waterfall into the bowl
      S.quad([[55, 0.02, -4], [200, 0.02, -4], [200, 0.02, 4], [55, 0.02, 4]], WATER, { bg: true });
      if (n === 'drain') { const wf = ramp(t, V('drain', 'waterfall') - 0.6, 0.6); if (wf > 0) S.beads([[120, 0.5, 0], [60, 0.5, 0], [56, -6 * (1 - 0.6 * dr) + 1, 0]], [200, 230, 255], t * 30, { spacing: 2.0, r: 0.8, reveal: wf }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      if (n === 'lake') tagLabel(ctx, W / 2, H_ * 0.2, 'LOUISIANA · 1980', ramp(t, V('hook', '1980') - 0.1, 0.2), { px: 40 });
      else { tagLabel(ctx, W / 2, H_ * 0.2, 'BATHTUB', ramp(t, V('drain', 'bathtub') - 0.1, 0.2) * (1 - ramp(t, V('drain', 'canal') - 0.2, 0.2)), { px: 44 }); tagLabel(ctx, W / 2, H_ * 0.2, 'CANAL RUNS BACKWARDS', ramp(t, V('drain', 'canal') - 0.1, 0.2), { px: 32 }); }
    } else if (n === 'map') {
      // Dave points at the drilling map. It's upside down.
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.2, 2.8, 1.5, 1.4, 0.35, 0.15, [0, 1.25, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      S.box((p) => add(p, [-0.6, 1.5, -0.6]), 0.55, 0.42, 0.02, [246, 240, 220], { bevel: 0, paint: (c, w, h) => { c.save(); c.translate(w, h); c.rotate(Math.PI); c.fillStyle = '#5a9ad0'; c.beginPath(); c.ellipse(w * 0.45, h * 0.45, w * 0.3, h * 0.22, 0, 0, TAU); c.fill(); c.fillStyle = '#c33'; c.beginPath(); c.arc(w * 0.62, h * 0.4, 8, 0, TAU); c.fill(); c.fillStyle = '#ddd'; c.fillRect(w * 0.3, h * 0.38, w * 0.2, h * 0.12); c.fillStyle = '#222'; c.font = `800 ${h * 0.09}px "Montserrat"`; c.textAlign = 'center'; c.fillText('LAKE PEIGNEUR', w / 2, h * 0.85); c.fillText('N ↑', w * 0.9, h * 0.12); c.restore(); } });
      dave(S, [0.3, 0, 0.1], { pose: 'point', yaw: -0.7, blink: blinkAt(t), t });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'UPSIDE DOWN', ramp(t, V('hook', 'miss') - 0.1, 0.2), { px: 40, col: '#ff8a6a' });
    } else if (n === 'xray') {
      // cross-section: the lake on top, the salt dome with its mine rooms and pillars below; the drill hits; water pours in
      const hit = ramp(t, V('hit', 'did') - 0.2, 0.3), pour = ramp(t, V('hit', 'Water') - 0.2, 1.0), dis = ramp(t, V('hit', 'dissolved') - 0.1, 2.5);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, -8, 0], 34, 32, 2, 3, 0.05, -0.05, [0, 0, 0]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-60, -30, -2], [60, -30, -2], [60, 0, -2], [-60, 0, -2]], ROCK, { bg: true, flat: true });
      S.quad([[-14, -28, -1.9], [14, -28, -1.9], [10, -3, -1.9], [-10, -3, -1.9]], SALT, { bg: true, flat: true });
      S.quad([[-60, 0, -2], [60, 0, -2], [60, 3, -2], [-60, 3, -2]], WATER, { bg: true, flat: true });
      // mine rooms (dark) between pillars (salt), which thin as they dissolve
      for (let lv = 0; lv < 3; lv++) { const y = -10 - lv * 6; S.box((p) => add(p, [0, y, -1.7]), 9, 1.2, 0.1, [60, 56, 54], { bevel: 0 }); for (let i = -3; i <= 3; i++) S.box((p) => add(p, [i * 2.6, y, -1.6]), 0.7 * (1 - 0.8 * dis), 1.2, 0.12, SALT, { bevel: 0 }); }
      const dx = 3; S.rod([dx, 3, -1.5], [dx, 3 - 14 * H.ease.out(H.clamp((t - sh.t0) / (V('hit', 'did') - sh.t0 + 0.3))), -1.5], 0.25, [200, 200, 210], 6);
      if (pour > 0) { S.beads([[dx, 0, -1.4], [dx, -10, -1.4], [-4, -10, -1.4]], [140, 200, 240], t * 8, { spacing: 0.6, r: 0.3, reveal: pour }); S.beads([[dx + 1, 0, -1.4], [dx + 1, -16, -1.4], [5, -22, -1.4]], [140, 200, 240], t * 8, { spacing: 0.6, r: 0.3, reveal: H.clamp(pour * 2 - 1) }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      const hp = S.proj([dx, -9, -1.5]); FX.sparks(ctx, hp[0], hp[1], H.clamp((t - V('hit', 'did') + 0.1) / 0.5), 6);
      tagLabel(ctx, W / 2, H_ * 0.12, 'SALT MINE', ramp(t, sh.t0 + 0.1, 0.2) * (1 - hit), { px: 40 });
      tagLabel(ctx, W / 2, H_ * 0.12, 'PILLARS DISSOLVE', ramp(t, V('hit', 'dissolved') - 0.1, 0.2), { px: 34, col: '#7ad0ff' });
      tagLabel(ctx, W / 2, H_ * 0.2, '→ BIGGER HOLE → MORE WATER', ramp(t, V('hit', 'bigger') - 0.1, 0.2), { px: 26 });
    } else if (n === 'boat') {
      // Dave fishing in a little boat. The boat starts circling. Faster. Gone.
      const t0 = sh.t0, sp = H.clamp((t - t0) / 2.5), ang = integ((tt) => 0.6 + 3 * H.clamp((tt - t0) / 2.5), t, 1 / 30) - integ((tt) => 0.6 + 3 * H.clamp((tt - t0) / 2.5), t0, 1 / 30), rad = 3.2 * (1 - 0.85 * sp), sink = 2 * H.ease.in(H.clamp((t - t0 - 2.2) / 0.6));
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 11, 10, 6, 5.5, 0.4, 0.3, [0, -0.5, 0]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-14, 0, -14], [14, 0, -14], [14, 0, 14], [-14, 0, 14]], WATER, { bg: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 3; for (let k = 0; k < 5; k++) { c.beginPath(); for (let a = 0; a < 14; a += 0.2) { const r = (w * 0.48 * a) / 14, an = a - ang + k * 1.2; a ? c.lineTo(w / 2 + Math.cos(an) * r, h / 2 + Math.sin(an) * r) : c.moveTo(w / 2, h / 2); } c.stroke(); } } });
      const bp = [Math.cos(ang) * rad, -sink, Math.sin(ang) * rad], by = -ang + Math.PI / 2;
      if (sink < 1.9) { S.box((p) => add(bp, rotY(add(p, [0, 0.15, 0]), by)), 0.9, 0.15, 0.4, [180, 120, 70], { bevel: 0.2 }); dave(S, add(bp, rotY([0, 0.15, -0.05], by)), { pose: 'sit', yaw: by, hands: [[0.15, 1.2, 0.35], [-0.1, 1.2, 0.4]], blink: blinkAt(t), look: [sp > 0.4 ? 1 : 0, 0], sweat: sp, t }); S.rod(add(bp, rotY([0.1, 0.9, 0.35], by)), add(bp, rotY([0.1, 2.2, 1.6], by)), 0.012, [120, 80, 50], 4); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.2, focus: 10, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, '11 BARGES + THE RIG', ramp(t, V('drain', 'Eleven') - 0.1, 0.2), { px: 34 });
    } else if (n === 'miners') {
      // all 55 miners got out alive: a little lift cage rising out of the shaft, and a big green tick
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 6, 5.4, 2.0, 1.8, 0.4, 0.2, [0, 1.6, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      for (const sx of [-1, 1]) S.rod([sx * 0.8, 0, 0], [sx * 0.8, 4, 0], 0.08, [120, 124, 132], 6); S.rod([-0.8, 4, 0], [0.8, 4, 0], 0.08, [120, 124, 132], 6);
      const cy = 0.2 + 1.6 * ramp(t, sh.t0, 1.2); S.box((p) => add(p, [0, cy + 0.6, 0]), 0.6, 0.6, 0.5, [200, 180, 60], { alpha: 0.4 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 5 });
      tagLabel(ctx, W / 2, H_ * 0.2, '55 / 55 SAFE', ramp(t, V('miners', 'fifty-five') - 0.1, 0.2), { px: 44, col: '#7ee07a' });
    } else {
      // the lake came back (salty); Dave's hard hat bobs back up
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 6, 5.2, 2.0, 1.6, 0.3, 0.1, [0, 0.2, 0]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 60], [-60, 0, 60]], WATER, { bg: true });
      const bob = H.ease.back(H.clamp((t - sh.t0 - 0.3) / 0.6)), hy = -0.4 + 0.45 * bob + 0.04 * Math.sin(t * 3);
      S.ico([0, hy, 0], [0.32, 0.22, 0.32], DV.hat, { sub: 1, gloss: 0.4, T: (q) => [q[0], Math.max(0, q[1]), q[2]] }); S.cyl((p) => add(p, [0, hy, 0]), 0.42, 0.03, shade(DV.hat, 0.95), 16);
      for (let i = 0; i < 4; i++) { const k = (t * 0.8 + i / 4) % 1; S.ico([0.5 * Math.cos(i * 1.7), 0.03, 0.5 * Math.sin(i * 1.7)], 0.03 + 0.05 * (1 - k), [230, 245, 255], { sub: 0, noShadow: true, glow: true }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.2, focus: 5.5, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, 'NOW SALTY', ramp(t, V('end', 'Salty') - 0.1, 0.2), { px: 40, col: '#7ad0ff' });
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 15, rip, t, { cause: 'cause of death:\nan upside-down map' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('xray'), color: 'pink', filter: 'lowpass', f: 600, gain: 0.06, a: 0.5, minor: true });
    k.play('error', V('hook', 'miss'), { gain: 0.3 });
    k.play('impact', V('hit', 'did') - 0.1, { gain: 0.5 }); k.noise(V('hit', 'Water') - 0.2, { dur: 5, color: 'brown', filter: 'lowpass', f: 500, gain: 0.25, a: 0.5 });
    k.noise(ST('drain'), { dur: ST('miners') - ST('drain'), color: 'pink', filter: 'bandpass', f: [[0, 300], [6, 900]], q: 0.6, gain: 0.25, a: 0.5 }); // the drain
    const t0 = ST('boat'); k.play('riser', t0, { dur: 2.2, gain: 0.3 }); k.play('blip', t0 + 2.5, { f: 'C4', type: 'sine', dur: 0.2, gain: 0.6 });
    k.play('success', V('miners', 'alive'), { gain: 0.4 });
    k.play('pop', ST('hat') + 0.6, { gain: 0.4 }); k.play('blip', ST('hat') + 0.8, { f: 'G5', type: 'sine', gain: 0.4 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
