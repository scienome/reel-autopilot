  // Dave reel 07: the antenna you could hold wrong. The phone gets Dave in the end. R.I.P. Dave #7.
  const BEATS = window.SCRIPT;
  const SH = [['love', 0], ['xray', BEAT0('gaps') - 0.1], ['email', BEAT0('email') - 0.1], ['bumper', BEAT0('bumper') - 0.1], ['end', BEAT0('end') - 0.2]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  // a giant phone (no logos): glass front with a screen, a steel band split into sections by gaps. Upright, facing +z.
  // o.bars 0..4 signal bars, o.xray (glow the antenna sections), o.joined (the sections glow as one), o.bumper 0..1, o.T (custom transform)
  const SECS = [[90, 220, 255], [255, 190, 80], [140, 240, 140]];
  const phone = (S, pos, o = {}) => {
    const s = o.s ?? 1, T = o.T || ((p) => add(pos, rotY(rotZ(mul(p, s), o.roll || 0), o.yaw || 0)));
    const w = 0.29, h = 0.58, d = 0.045;
    S.box((p) => T(p), w - 0.012, h - 0.012, d, [30, 30, 36], { bevel: 0.15, gloss: 0.6, paint: (c, W2, H2) => { c.fillStyle = '#111'; c.fillRect(0, 0, W2, H2); c.fillStyle = '#2a4a8a'; c.fillRect(W2 * 0.06, H2 * 0.08, W2 * 0.88, H2 * 0.84); const g = c.createLinearGradient(0, 0, 0, H2); g.addColorStop(0, '#5aa0ff'); g.addColorStop(1, '#a050d0'); c.fillStyle = g; c.fillRect(W2 * 0.06, H2 * 0.08, W2 * 0.88, H2 * 0.84); const b = o.bars ?? 4; for (let i = 0; i < 4; i++) { c.fillStyle = i < b ? '#fff' : 'rgba(255,255,255,0.25)'; c.fillRect(W2 * (0.1 + i * 0.05), H2 * (0.13 - i * 0.012), W2 * 0.035, H2 * (0.02 + i * 0.012)); } } });
    // the band: 4 straight pieces, with gaps at the bottom-left corner, top, and bottom-right
    const xr = o.xray || 0, j = o.joined || 0, bandCol = (k) => (xr > 0 ? H.mix([210, 214, 222], j > 0.5 ? [255, 120, 90] : SECS[k], xr) : [210, 214, 222]), gl = xr > 0.3;
    const seg = (a, b, k) => S.rod(T(a), T(b), 0.016 * s, bandCol(k), 6, { glow: gl, gloss: 0.6 });
    seg([-w, -h + 0.06, 0], [-w, h - 0.02, 0], 0); seg([-w + 0.02, h, 0], [w - 0.02, h, 0], 0);
    seg([w, h - 0.02, 0], [w, -h + 0.06, 0], 1); seg([w - 0.06, -h, 0], [-w + 0.06, -h, 0], 2);
    if (o.bumper > 0) { const b = o.bumper, bc = [40, 40, 46]; for (const [a, c2] of [[[-w - 0.02, -h - 0.02, 0], [-w - 0.02, h + 0.02, 0]], [[-w - 0.02, h + 0.02, 0], [w + 0.02, h + 0.02, 0]], [[w + 0.02, h + 0.02, 0], [w + 0.02, -h - 0.02, 0]], [[w + 0.02, -h - 0.02, 0], [-w - 0.02, -h - 0.02, 0]]]) S.rod(T(a), T(lerp3(a, c2, b)), 0.03 * s, bc, 8); }
    return T;
  };
  const studio = (S) => {
    S.quad([[-30, 0, -6], [30, 0, -6], [30, 0, 30], [-30, 0, 30]], [236, 234, 238], { bg: true, flat: true });
    S.quad([[-30, 0, -4], [30, 0, -4], [30, 12, -4], [-30, 12, -4]], [226, 226, 232], { bg: true, flat: true });
  };
  const studioEnv = { bg: '#e6e6ec', dof: 0.3, shadowAlpha: 0.3 };
  const hearts = (ctx, x, y, u, t) => { if (u <= 0) return; ctx.save(); ctx.fillStyle = '#ff5a7a'; ctx.font = FONT(800, 34); for (let i = 0; i < 4; i++) { const k = (t * 0.6 + i / 4) % 1; ctx.globalAlpha = u * (1 - k); ctx.fillText('♥', x + Math.sin(i * 2 + t) * 40, y - k * 120); } ctx.restore(); };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'love' || n === 'bumper') {
      // Dave holds a giant phone, loving it (later: in its rubber bumper)
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0.2], 3.4, 2.9, 1.4, 1.3, 0.4, 0.15, [0, 1.15, 0]);
      const S = Scene(E, TG, W, H_); studio(S);
      const pp = [0.34, 1.3, 0.5];
      phone(S, pp, { s: 0.6, bumper: n === 'bumper' ? ramp(t, V('bumper', 'bumper') - 0.3, 0.6) : 0, yaw: -0.25 });
      dave(S, [0, 0, 0], { pose: 'carry', hands: [[0.52, 1.18, 0.46], [0.16, 1.18, 0.54]], blink: blinkAt(t), t, look: [0, -1] });
      S.render(ctx, W, H_, { ...studioEnv, focus: 3 });
      const hp = S.proj([0, 1.7, 0.2]); if (n === 'love') hearts(ctx, hp[0], hp[1], ramp(t, V('hook', 'beautiful') - 0.2, 0.3), t);
      if (n === 'love') { const ap = S.proj([0.52, 1.3, 0.5]); tagLabel(ctx, ap[0] + 60, ap[1] - 40, 'ANTENNA', ramp(t, V('hook', 'antenna') - 0.1, 0.2), { px: 32 }); }
      else tagLabel(ctx, W / 2, H_ * 0.2, 'FREE BUMPER', ramp(t, V('bumper', 'free') - 0.1, 0.2), { px: 40, col: '#7ee07a' });
    } else if (n === 'xray') {
      // x-ray of the band: sections in colours, gaps between. A hand over the bottom-left gap joins them; the bars drop.
      const join = ramp(t, V('gaps', 'joined') - 0.15, 0.3), drop = ramp(t, V('gaps', 'dropped') - 0.4, 0.5), hand = ramp(t, V('gaps', 'Hold') - 0.2, 0.5);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 1.9, 1.7, 0.15, 0.1, 0.12, -0.05, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); studio(S);
      phone(S, [0, 1.25, 0], { xray: 1, joined: join, bars: Math.round(4 - 3 * drop) });
      if (hand > 0) { const hp = add([-0.29, 1.25 - 0.58, 0.02], [-0.45 * (1 - hand), -0.1 * (1 - hand), 0.05]); S.ico(hp, [0.1, 0.14, 0.07], DV.body, { sub: 1 }); S.rod(hp, add(hp, [-0.25, -0.35, 0]), 0.05, DV.body, 8); }
      S.render(ctx, W, H_, { ...studioEnv, focus: 1.8, shadows: false });
      const g = S.proj([-0.29, 1.25 - 0.58, 0]); ctx.save(); ctx.strokeStyle = 'rgba(255,90,70,0.95)'; ctx.lineWidth = 4; const gu = ramp(t, V('gaps', 'gap') - 0.1, 0.2) * (1 - join); if (gu > 0) { ctx.beginPath(); ctx.arc(g[0], g[1], 30 * gu, 0, TAU); ctx.stroke(); } ctx.restore();
      tagLabel(ctx, W / 2, H_ * 0.2, 'GAPS', ramp(t, V('gaps', 'gaps') - 0.1, 0.2) * (1 - join), { px: 40 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'SECTIONS JOINED', join * (1 - drop), { px: 36, col: '#ff8a6a' });
      tagLabel(ctx, W / 2, H_ * 0.2, 'SIGNAL ↓', drop, { px: 44, col: '#ff6a5a' });
    } else if (n === 'email') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0.2], 3.0, 2.8, 1.4, 1.35, -0.2, -0.05, [0, 1.15, 0]);
      const S = Scene(E, TG, W, H_); studio(S); phone(S, [0.34, 1.3, 0.5], { s: 0.6, bars: 1, yaw: -0.25 });
      dave(S, [0, 0, 0], { pose: 'carry', hands: [[0.52, 1.18, 0.46], [0.16, 1.18, 0.54]], blink: blinkAt(t), t, look: [0, -1] });
      S.render(ctx, W, H_, { ...studioEnv, focus: 3 });
      const u = ramp(t, sh.t0 + 0.2, 0.3); if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = 'rgba(255,255,255,0.97)'; ctx.strokeStyle = '#ccd'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(W * 0.07, H_ * 0.08, W * 0.86, H_ * 0.22, 20); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#888'; ctx.font = FONT(600, 22); ctx.textAlign = 'left'; ctx.fillText('From: Steve Jobs   ·   June 2010', W * 0.11, H_ * 0.12); ctx.fillText('Re: iPhone 4 reception', W * 0.11, H_ * 0.15); const r2 = ramp(t, V('email', 'Just') - 0.2, 0.3); ctx.globalAlpha = u * r2; ctx.fillStyle = '#111'; ctx.font = FONT(800, 32); ctx.fillText('Just avoid holding it', W * 0.11, H_ * 0.215); ctx.fillText('in that way.', W * 0.11, H_ * 0.26); ctx.restore(); }
    } else {
      // Dave holds it the "wrong" way. Bars drop. He shakes it. It slips, flies, and hits him in the head.
      const t0 = sh.t0, shake = t > t0 + 0.9 && t < t0 + 1.7 ? 1 : 0, ts = t0 + 1.7, fly = H.clamp((t - ts) / 0.45), hit = ts + 0.45, fall = H.clamp((t - hit) / 0.4);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0.2], 3.2, 3.0, 1.4, 1.35, 0.3, 0.2, [0, 1.15, 0]);
      const S = Scene(E, TG, W, H_); studio(S);
      const head = [0, 1.66, 0.05], shk = shake ? 0.05 * Math.sin(t * 40) : 0;
      const pp = fly <= 0 ? [0.34 + shk, 1.25, 0.5] : hop([0, 1.2, 0.5], add(head, [0, 0.25, 0.2]), 1.2, fly);
      const roll = fly > 0 ? fly * 9 : 0.3 + shk;
      if (fall < 1 || true) { const pf = fall > 0 ? add(head, [0.5 * fall, 0.3 - 1.7 * fall * fall, 0.4]) : pp; phone(S, pf, { s: 0.6, bars: Math.round(4 - 4 * ramp(t, t0 + 0.4, 0.4)), roll: fall > 0 ? 1.5 : roll }); }
      dave(S, [0, 0, 0], { pose: fly > 0 ? 'stand' : 'carry', hands: fly > 0 ? undefined : [[0.52 + shk, 1.1, 0.46], [0.2 + shk, 0.95, 0.5]], pitch: -1.45 * H.ease.in(fall), blink: blinkAt(t), t, look: fly > 0 ? [0, 1] : [0, -1], xeyes: fall > 0.6 });
      S.render(ctx, W, H_, { ...studioEnv, focus: 3 });
      const hd = S.proj(head); if (fall > 0.5) for (let i = 0; i < 3; i++) { const a = t * 5 + (i * TAU) / 3; ctx.save(); ctx.fillStyle = '#ffb020'; ctx.font = FONT(800, 28); ctx.fillText('★', hd[0] + Math.cos(a) * 50, hd[1] + 160 + Math.sin(a) * 14); ctx.restore(); }
      flash = 0.15 * Math.exp(-Math.pow((t - hit) * 6, 2));
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 7, rip, t, { cause: 'cause of death:\nheld it wrong' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.play('sparkle', V('hook', 'beautiful'), { gain: 0.5 }); k.play('pop', V('hook', 'antenna'), { gain: 0.3 });
    k.play('pop', V('gaps', 'gaps'), { gain: 0.3 }); k.play('buzz', V('gaps', 'joined') - 0.1, { f: 140, dur: 0.4, gain: 0.3 });
    for (let i = 0; i < 3; i++) k.play('blip', V('gaps', 'dropped') - 0.4 + i * 0.15, { f: ['E6', 'C6', 'A5'][i], gain: 0.5 });
    k.play('ding', ST('email') + 0.2, { f: 'G5', gain: 0.25 }); k.play('typing', V('email', 'Just') - 0.2, { n: 10, gain: 0.4 });
    k.play('roller', V('bumper', 'bumper') - 0.3, { dur: 0.5, gain: 0.4 }); k.play('success', V('bumper', 'free'), { gain: 0.4 });
    const t0 = ST('end'), ts = t0 + 1.7, hit = ts + 0.45;
    for (let i = 0; i < 3; i++) k.play('blip', t0 + 0.4 + i * 0.12, { f: ['E6', 'C6', 'A5'][i], gain: 0.5 });
    k.noise(t0 + 0.9, { dur: 0.8, filter: 'bandpass', f: 900, q: 1, gain: 0.15, a: 0.02 }); k.play('swish', ts, { gain: 0.5 }); k.play('tock', hit, { f: 900, gain: 0.7 }); k.play('thud', hit + 0.4, { f: 80, gain: 0.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
