  // Dave reel 03: the "armour glass" stage demo. The ball comes back for Dave. R.I.P. Dave #3.
  const BEATS = window.SCRIPT;
  const SH = [['stage', 0], ['throw', BEAT0('throw') - 0.1], ['quote', BEAT0('quote') - 0.1], ['science', BEAT0('science') - 0.1], ['end', BEAT0('end') - 0.4]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const CT = { steel: [196, 200, 206], glass: [44, 50, 62], tire: [36, 36, 40], floor: [40, 40, 48] };
  // a low-poly stainless wedge truck along +x (no logos). crackF / crackB 0..1: spider cracks on the front / rear side windows
  const truck = (S, pos, o = {}) => {
    const T = (p) => add(pos, rotY(p, o.yaw || 0));
    const prof = [[-2.8, 0.45], [2.8, 0.45], [2.85, 0.95], [0.4, 1.9], [-2.8, 1.55]];
    const A = prof.map(([x, y]) => T([x, y, -1.0])), B = prof.map(([x, y]) => T([x, y, 1.0])), C = T([0, 1.0, 0]);
    S.face(A.slice().reverse(), CT.steel, { c: C, gloss: 0.5 }); S.face(B, CT.steel, { c: C, gloss: 0.5 });
    for (let i = 0; i < prof.length; i++) { const j = (i + 1) % prof.length; S.face([A[i], A[j], B[j], B[i]], shade(CT.steel, i === 2 ? 1.05 : 0.97), { c: C, gloss: 0.5 }); }
    const crack = (u, seed) => (c, w, h) => { c.fillStyle = '#2c3240'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(160,190,230,0.25)'; c.fillRect(0, 0, w, h * 0.3); if (u <= 0) return; const r = H.rng(seed), cx = w * 0.45, cy = h * 0.55; c.strokeStyle = 'rgba(240,248,255,0.95)'; c.lineWidth = 3; for (let k = 0; k < 14; k++) { const a = (k / 14) * TAU + r() * 0.3, L = (0.2 + 0.5 * r()) * w * u; c.beginPath(); c.moveTo(cx, cy); let x = cx, y = cy; for (let s2 = 1; s2 <= 4; s2++) { x = cx + Math.cos(a + (r() - 0.5) * 0.3) * L * (s2 / 4); y = cy + Math.sin(a + (r() - 0.5) * 0.3) * L * (s2 / 4); c.lineTo(x, y); } c.stroke(); } for (let ring = 1; ring <= 3; ring++) { c.beginPath(); c.arc(cx, cy, ring * 0.1 * w * u, 0, TAU); c.stroke(); } c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.arc(cx, cy, 8, 0, TAU); c.fill(); };
    // side windows on the +z side: front (driver) and rear
    S.box((p) => T(add(p, [0.55, 1.38, 1.005])), 0.62, 0.26, 0.004, CT.glass, { bevel: 0, noShadow: true, glow: true, paint: crack(o.crackF || 0, 3) });
    S.box((p) => T(add(p, [-0.75, 1.36, 1.005])), 0.55, 0.22, 0.004, CT.glass, { bevel: 0, noShadow: true, glow: true, paint: crack(o.crackB || 0, 8) });
    S.box((p) => T(add(rotZ(p, 0.42), [1.75, 1.43, 0])), 0.82, 0.004, 0.9, CT.glass, { bevel: 0, noShadow: true, glow: true });
    for (const x of [-1.9, 1.9]) for (const sz of [-1, 1]) S.cyl((p) => T(add(rotX(p, Math.PI / 2 * sz), [x, 0.45, sz * 0.92])), 0.45, 0.3, CT.tire, 16, { cap: [70, 72, 80] });
    S.box((p) => T(add(p, [2.86, 0.98, 0])), 0.01, 0.025, 0.95, [255, 250, 240], { glow: true, noShadow: true }); // the light bar
  };
  const stage = (S) => {
    S.quad([[-30, 0, -8], [30, 0, -8], [30, 0, 30], [-30, 0, 30]], CT.floor, { bg: true, grid: [1.0, 'rgba(255,255,255,0.05)'] });
    S.quad([[-30, 0, -8], [30, 0, -8], [30, 12, -8], [-30, 12, -8]], [20, 20, 26], { bg: true, flat: true, paint: (c, w, h) => { c.fillStyle = 'rgba(80,90,120,0.35)'; for (let i = 0; i < 12; i++) c.fillRect((i / 12) * w + w / 48, h * 0.1, w / 60, h * 0.9); } });
  };
  const spot = (ctx, x, y, r, a = 0.35) => { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,240,220,${a})`); g.addColorStop(1, 'rgba(255,240,220,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); };
  const stageEnv = { bg: '#141418', dof: 0.3, shadowAlpha: 0.6 };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    const t1 = V('throw', 'shattered') - 0.35, t2 = V('throw', 'shattered', 2) - 0.35;
    const cF = ramp(t, t1 + 0.3, 0.15), cB = ramp(t, t2 + 0.3, 0.15);
    if (n === 'stage' || n === 'throw') {
      // the reveal, then the throws: the ball arcs from the edge of the stage into each window
      const [E, TG] = n === 'stage' ? orbit(t, sh.t0, sh.t1, [0.4, 0, 1.6], 11, 10, 1.8, 1.5, 0.75, 0.45, [0, 0.9, 0]) : orbit(t, sh.t0, sh.t1, [0, 0, 1.5], 9, 8.5, 1.4, 1.5, 0.45, 0.25, [-0.2, 1.0, 0]);
      const S = Scene(E, TG, W, H_); stage(S);
      truck(S, [0, 0, 0], { crackF: n === 'throw' ? cF : 0, crackB: n === 'throw' ? cB : 0 });
      const wind = n === 'stage' ? ramp(t, V('hook', 'live') - 0.6, 0.6) : 0;
      dave(S, [1.0, 0, 4.4], { pose: 'carry', yaw: Math.PI + 0.3, hands: [[0.3, 1.2 + 0.4 * wind, -0.1 - 0.3 * wind], [-0.25, 1.2, 0.3]], blink: blinkAt(t), t, look: [0, 0] });
      if (n === 'stage' && wind < 1) S.ico([1.3 - 0.0, 1.2 + 0.4 * wind, 4.25 + 0.3 * wind], 0.11, [180, 184, 192], { sub: 1, gloss: 0.8 });
      if (n === 'throw') for (const [ta, tx] of [[t1, 0.55], [t2, -0.75]]) { const u = H.clamp((t - ta) / 0.3); if (u > 0 && u < 1) S.ico(hop([1.0, 1.3, 4.3], [tx, 1.38, 1.1], 0.4, u), 0.11, [180, 184, 192], { sub: 1, gloss: 0.8 }); if (u >= 1 && t - ta < 1.2) { const v = (t - ta - 0.3); S.ico([tx + 0.2 * v, Math.max(0.11, 1.38 - 4.9 * v * v), 1.2 + 0.6 * v], 0.11, [180, 184, 192], { sub: 1, gloss: 0.8 }); } }
      S.render(ctx, W, H_, { ...stageEnv, focus: 8.5 });
      spot(ctx, W * 0.5, H_ * 0.5, W * 0.7, 0.25);
      if (n === 'stage') tagLabel(ctx, W / 2, H_ * 0.2, '"ARMOUR GLASS"', ramp(t, V('hook', 'armour') - 0.1, 0.2), { px: 40 });
      flash = 0.2 * Math.exp(-Math.pow((t - t1 - 0.3) * 6, 2)) + 0.2 * Math.exp(-Math.pow((t - t2 - 0.3) * 6, 2));
    } else if (n === 'quote') {
      // the quote, as a card over the cracked truck
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 1.5], 7.5, 7, 1.3, 1.2, 0.3, 0.15, [-0.1, 1.2, 0]);
      const S = Scene(E, TG, W, H_); stage(S); truck(S, [0, 0, 0], { crackF: 1, crackB: 1 });
      S.render(ctx, W, H_, { ...stageEnv, focus: 7 });
      const u = ramp(t, sh.t0 + 0.1, 0.25); if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = 'rgba(16,16,22,0.85)'; ctx.beginPath(); ctx.roundRect(W * 0.08, H_ * 0.13, W * 0.84, H_ * 0.2, 24); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = FONT(800, 40); ctx.fillText('"Well, it didn\'t', W / 2, H_ * 0.2); ctx.fillText('go through."', W / 2, H_ * 0.245); ctx.font = FONT(600, 24); ctx.fillStyle = '#ffd24a'; ctx.fillText('Elon Musk, on stage, 2019', W / 2, H_ * 0.295); ctx.restore(); }
    } else if (n === 'science') {
      // x-ray close-up: toughened glass, an old crack at the base, and the crack racing across
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.55, 1.38, 1.0], 2.6, 2.2, 0.15, 0.05, 0.2, -0.1, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); stage(S); truck(S, [0, 0, 0], { crackF: 0 });
      const ham = V('science', 'sledgehammer'), base = ramp(t, ham - 0.1, 0.3), race = ramp(t, V('science', 'spread') - 0.1, 0.35);
      // compression in the surface (toughened glass): arrows pushing inward along the top and bottom skin
      const sq = ramp(t, V('science', 'toughened') - 0.1, 0.3) * (1 - race);
      if (sq > 0) for (const y of [1.64, 1.12]) { S.arrow([0.0, y, 1.04], [0.4, y, 1.04], [110, 200, 255], { w: 0.04 * sq, side: [0, 1, 0] }); S.arrow([1.1, y, 1.04], [0.7, y, 1.04], [110, 200, 255], { w: 0.04 * sq, side: [0, 1, 0] }); }
      S.render(ctx, W, H_, { ...stageEnv, focus: 2.4, dof: 0 });
      const p0 = S.proj([0.4, 1.13, 1.01]), p1 = S.proj([0.9, 1.62, 1.01]), p2 = S.proj([0.05, 1.6, 1.01]);
      if (base > 0) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p0[0] + 40 * base, p0[1] - 70 * base); ctx.stroke(); ctx.restore(); tagLabel(ctx, p0[0], p0[1] + 60, 'OLD CRACK', base, { px: 28, col: '#ff8a6a' }); }
      if (race > 0) { const r = H.rng(2); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 3; for (const pe of [p1, p2]) { ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); for (let s2 = 1; s2 <= 8; s2++) { const u = (s2 / 8) * race; ctx.lineTo(p0[0] + (pe[0] - p0[0]) * u + (r() - 0.5) * 18, p0[1] + (pe[1] - p0[1]) * u + (r() - 0.5) * 18); } ctx.stroke(); } ctx.restore(); }
      tagLabel(ctx, W / 2, H_ * 0.2, 'TOUGHENED GLASS', ramp(t, V('science', 'toughened') - 0.1, 0.2) * (1 - race), { px: 36, col: '#7ad0ff' });
      tagLabel(ctx, W / 2, H_ * 0.2, '100s OF m/s', race, { px: 42 });
    } else {
      // Dave throws. The ball bounces off the steel body and comes straight back. The truck: one. Dave: zero.
      const tt = V('end', 'truck') - 0.3, hit = tt + 0.35, back = hit + 0.35;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.5, 0, 2.6], 8.5, 8.0, 1.4, 1.3, 0.75, 0.6, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); stage(S); truck(S, [0, 0, 0], { crackF: 1, crackB: 1 });
      const fall = H.clamp((t - back) / 0.35), dp = [1.0, 0, 4.4];
      dave(S, dp, { pose: t < tt ? 'carry' : 'point', yaw: Math.PI + 0.3, pitch: -1.45 * H.ease.in(fall), hands: t < tt ? [[0.3, 1.6, -0.4], [-0.25, 1.2, 0.3]] : undefined, xeyes: fall > 0.5, blink: blinkAt(t), t });
      const bp = t < tt ? null : t < hit ? hop([1.0, 1.4, 4.3], [-0.5, 0.9, 1.1], 0.3, (t - tt) / 0.35) : t < back ? hop([-0.5, 0.9, 1.1], [0.95, 1.65, 4.25], 0.2, (t - hit) / 0.35) : [1.6 + (t - back) * 0.8, Math.max(0.11, 1.65 - 6 * (t - back) * (t - back)), 4.6];
      if (bp) S.ico(bp, 0.11, [180, 184, 192], { sub: 1, gloss: 0.8 }); else S.ico(add(dp, [-0.3, 1.6, 0.4]), 0.11, [180, 184, 192], { sub: 1, gloss: 0.8 });
      S.render(ctx, W, H_, { ...stageEnv, focus: 8 });
      spot(ctx, W * 0.5, H_ * 0.55, W * 0.7, 0.22);
      const hp = S.proj([-0.5, 0.9, 1.1]); FX.sparks(ctx, hp[0], hp[1], H.clamp((t - hit) / 0.5), 5);
      const hd = S.proj(add(dp, [0, 1.65, 0])); if (fall > 0) for (let i = 0; i < 3; i++) { const a = t * 5 + (i * TAU) / 3; ctx.save(); ctx.fillStyle = '#ffd24a'; ctx.font = FONT(800, 28); ctx.fillText('★', hd[0] + Math.cos(a) * 50, hd[1] - 60 + Math.sin(a) * 14); ctx.restore(); }
      tagLabel(ctx, W / 2, H_ * 0.2, 'TRUCK 1 : DAVE 0', ramp(t, V('end', 'one') - 0.1, 0.2), { px: 40 });
      flash = 0.18 * Math.exp(-Math.pow((t - back) * 6, 2));
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 3, rip, t, { cause: 'cause of death:\nhis own rebound' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('quote'), color: 'pink', filter: 'bandpass', f: 600, q: 0.4, gain: 0.05, a: 0.5, minor: true }); // the crowd
    k.play('riser', 0.1, { dur: 1.2, gain: 0.25 });
    const t1 = V('throw', 'shattered') - 0.35, t2 = V('throw', 'shattered', 2) - 0.35;
    for (const ta of [t1, t2]) { k.play('swish', ta, { gain: 0.4 }); k.play('impact', ta + 0.3, { gain: 0.5 }); k.noise(ta + 0.3, { dur: 0.5, filter: 'highpass', f: 3000, gain: 0.3, a: 0.002 }); k.noise(ta + 0.45, { dur: 1.2, color: 'pink', filter: 'bandpass', f: 900, q: 0.6, gain: 0.12, a: 0.05 }); }
    k.play('pop', ST('quote') + 0.1, { gain: 0.3 });
    k.play('error', V('science', 'sledgehammer'), { gain: 0.3 }); k.noise(V('science', 'spread') - 0.1, { dur: 0.35, filter: 'highpass', f: 4000, gain: 0.3, a: 0.002 });
    const tt = V('end', 'truck') - 0.3, hit = tt + 0.35, back = hit + 0.35;
    k.play('swish', tt, { gain: 0.4 }); k.play('tock', hit, { f: 1600, gain: 0.6 }); k.play('swish', hit + 0.02, { gain: 0.4 }); k.play('thud', back, { f: 150, gain: 0.6 }); k.play('thud', back + 0.35, { f: 70, gain: 0.5 });
    for (let i = 0; i < 3; i++) k.play('ding', back + 0.4 + i * 0.18, { f: ['E6', 'G6', 'C7'][i], gain: 0.15, minor: true });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
