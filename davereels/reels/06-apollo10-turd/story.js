  // Dave reel 06: Apollo 10's floating turd. Dave denies everything; the blob drifts in. R.I.P. Dave #6.
  const BEATS = window.SCRIPT;
  const SH = [['capsule', 0], ['bag', BEAT0('bags') - 0.1], ['zero', BEAT0('zero') - 0.1], ['deny', BEAT0('nobody') - 0.1], ['toilet', BEAT0('end') + 0.6]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const BROWN = [118, 78, 46], CAP = [214, 210, 200], PANEL = [70, 74, 86];
  // the cabin of a command module: a cone of panels around the camera, an instrument panel, three couches
  const capsule = (S) => {
    S.quad([[-6, -0.2, -6], [6, -0.2, -6], [6, -0.2, 6], [-6, -0.2, 6]], [150, 148, 140], { bg: true });
    S.quad([[-6, -0.2, -2.2], [6, -0.2, -2.2], [6, 4, -2.2], [-6, 4, -2.2]], CAP, { bg: true, flat: true });
    S.box((p) => add(p, [0, 1.95, -2.05]), 1.6, 0.6, 0.1, PANEL, { bevel: 0.05, paint: (c, w, h) => { const r = H.rng(3); for (let i = 0; i < 70; i++) { c.fillStyle = ['#ddd', '#f4c040', '#e05040', '#60c070', '#222'][i % 5]; c.beginPath(); c.arc(r() * w, r() * h, 3 + r() * 6, 0, TAU); c.fill(); } } });
    for (const sx of [-1, 1]) S.quad([[sx * 2.2, -0.2, 2], [sx * 1.6, -0.2, -2.2], [sx * 1.0, 4, -2.2], [sx * 1.4, 4, 2]], shade(CAP, 0.9), { bg: true, flat: true });
    for (const x of [-0.75, 0, 0.75]) { S.box((p) => add(p, [x, 0.25, 0.1]), 0.32, 0.06, 0.8, [196, 200, 210], { bevel: 0.2 }); S.box((p) => add(p, [x, 0.6, -0.68]), 0.32, 0.35, 0.06, [196, 200, 210], { bevel: 0.2 }); }
    S.box((p) => add(p, [0.95, 3.1, -1.6]), 0.14, 0.16, 0.02, [170, 210, 240], { glow: true, noShadow: true }); // a little window
  };
  const blob = (S, p, s = 1, rot = 0) => S.ico(p, [0.09 * s, 0.065 * s, 0.07 * s], BROWN, { sub: 1, jit: 0.3, seed: 4, gloss: 0.4, noShadow: true, T: (q) => rotY(rotZ(q, rot), rot * 0.7) });
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    const drift = (tt) => [-1.1 + 0.18 * tt, 1.6 + 0.12 * Math.sin(tt * 0.9), 0.5 + 0.05 * Math.cos(tt * 1.3)];
    if (n === 'capsule') {
      // the blob drifts across the capsule; the transcript
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.6, 3.0, 1.7, 1.6, 0.2, -0.15, [0, 1.3, 0]);
      const S = Scene(E, TG, W, H_); capsule(S);
      dave(S, [0.55, 0.85, 0.6], { pose: 'flail', t: t * 0.15, yaw: -0.3, roll: 0.15 * Math.sin(t * 0.7), blink: blinkAt(t), look: [-1, 0] });
      blob(S, drift(t), 1, t * 0.6);
      S.render(ctx, W, H_, { bg: '#d6d2c8', dof: 0.3, focus: 3, shadows: false });
      const u = ramp(t, V('hook', 'Give') - 0.2, 0.25); if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = 'rgba(250,248,240,0.95)'; ctx.fillRect(W * 0.08, H_ * 0.08, W * 0.84, H_ * 0.2); ctx.fillStyle = '#222'; ctx.font = '600 22px monospace'; ctx.textAlign = 'left'; ['NASA · APOLLO 10 · MAY 1969', '', 'CDR: Give me a napkin quick.', '     There\'s a turd floating', '     through the air.'].forEach((l, i) => ctx.fillText(l, W * 0.12, H_ * 0.12 + i * 30)); ctx.restore(); }
    } else if (n === 'bag') {
      // the Apollo toilet: a plastic bag with a sticky ring, and a germicide pouch
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 2.4, 2.1, 1.3, 1.25, 0.4, 0.15, [0, 1.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.55, 0.4, 0.75);
      const g = ramp(t, V('bags', 'germicide') - 0.2, 0.5);
      S.ico([0, 1.15, 0], [0.22, 0.3, 0.18], [210, 230, 240], { sub: 1, alpha: 0.35, jit: 0.12, seed: 2 });
      S.cyl((p) => add(p, [0, 1.42, 0]), 0.16, 0.03, [240, 210, 80], 16, { caps: false });
      S.box((p) => add(p, [0.35 - 0.33 * g, 1.1 + 0.2 * Math.sin(g * Math.PI), 0.1]), 0.06, 0.04, 0.01, [120, 200, 120], { bevel: 0.2 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.2 });
      const rp = S.proj([0, 1.42, 0.16]); tagLabel(ctx, rp[0], rp[1] - 50, 'TAPE', ramp(t, V('bags', 'taped') - 0.1, 0.2), { px: 30 });
      const gp = S.proj([0.35, 1.1, 0.1]); tagLabel(ctx, gp[0] + 40, gp[1] + 60, 'GERMICIDE', ramp(t, V('bags', 'germicide') - 0.1, 0.2), { px: 30, col: '#7ee07a' });
      tagLabel(ctx, W / 2, H_ * 0.2, 'NO GAS LATER', ramp(t, V('bags', 'gas') - 0.1, 0.2), { px: 36 });
    } else if (n === 'zero') {
      // in zero gravity nothing falls: dust, a water ball, the blob, all hanging in the air
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.0, 2.6, 1.6, 1.5, -0.25, 0.1, [0, 1.4, 0]);
      const S = Scene(E, TG, W, H_); capsule(S);
      const r = H.rng(5), dust = ramp(t, V('zero', 'dust') - 0.1, 0.3), water = ramp(t, V('zero', 'water') - 0.1, 0.3), made = ramp(t, V('zero', 'made') - 0.2, 0.3);
      for (let i = 0; i < 40; i++) { const p = [r.range(-1.2, 1.2) + 0.05 * Math.sin(t + i), r.range(0.6, 2.6) + 0.05 * Math.cos(t * 0.8 + i), r.range(-0.5, 1)]; if (r() < dust) S.dots.push({ p, col: [230, 220, 200], r: 0.006 }); }
      if (water > 0) S.ico([-0.5, 1.6 + 0.04 * Math.sin(t * 2), 0.6], [0.11 * (1 + 0.08 * Math.sin(t * 5)), 0.11 * (1 - 0.08 * Math.sin(t * 5)), 0.11], [120, 180, 240], { sub: 1, alpha: 0.6, gloss: 0.8 });
      if (made > 0) blob(S, [0.5, 1.5 + 0.05 * Math.sin(t), 0.6], made, t * 0.5);
      const stop = ramp(t, V('zero', 'stops') - 0.2, 0.3);
      dave(S, [0.0, 0.3, 0.2], { pose: 'flail', t: t * 0.15, yaw: 0.2, pitch: 0.2 * Math.sin(t * 0.5), blink: blinkAt(t), look: [1, 0] });
      S.render(ctx, W, H_, { bg: '#d6d2c8', dof: 0.3, focus: 2.6, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, '0 g', ramp(t, V('zero', 'zero') - 0.1, 0.2) * (1 - stop), { px: 48 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'FLOATS UNTIL IT HITS SOMETHING', stop, { px: 26 });
    } else if (n === 'deny') {
      // "Nobody ever admitted it was theirs." Dave opens his mouth to say "it wasn't me"... and the blob drifts right in.
      const tm = REEL_WORDS.words.filter((w) => w.beat === 'nobody').slice(-1)[0].e, tin = tm + 0.5;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.9, 0.4], 1.9, 1.5, 1.55, 1.5, 0.15, 0.05, [0, 1.35, 0]);
      const S = Scene(E, TG, W, H_); capsule(S);
      const hd = [0, 0.9 + 1.56, 0.47], mouth = ramp(t, tm - 0.1, 0.25) * (t < tin ? 1 : 1 - ramp(t, tin, 0.1));
      dave(S, [0, 0.9, 0.4], { pose: 'stand', hands: [[0.35, 1.25, 0.25], [-0.35, 1.25, 0.25]], mouth, blink: blinkAt(t), look: t > tm - 0.5 ? [1, 0] : [0, 0], colors: t > tin + 0.4 ? { body: H.mix(DV.body, [150, 190, 90], ramp(t, tin + 0.4, 0.6)) } : undefined });
      const bu = H.clamp((t - (tin - 1.4)) / 1.4); if (bu < 1) blob(S, lerp3([0.9, 1.5 + 0.9, 0.6], hd, H.ease.in(bu)), 0.7, t);
      S.render(ctx, W, H_, { bg: '#d6d2c8', dof: 0.3, focus: 1.5, shadows: false });
      const hp = S.proj(add(hd, [0.15, 0.2, 0])); if (t > tm - 0.1 && t < tin) { ctx.save(); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(hp[0], hp[1] - 80, 230, 64, 20); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#222'; ctx.font = FONT(800, 28); ctx.fillText('IT WASN\'T M—', hp[0] + 16, hp[1] - 38); ctx.restore(); }
      flash = 0.12 * Math.exp(-Math.pow((t - tin) * 6, 2));
    } else {
      // modern space toilets: a fan pulls air (and everything in it) into the funnel
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-0.2, 0, 0.2], 2.9, 2.6, 1.4, 1.3, 0.2, 0.05, [0, 0.95, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      S.box((p) => add(p, [0, 0.4, 0]), 0.3, 0.4, 0.3, [220, 222, 228], { bevel: 0.2 });
      S.cyl((p) => add(p, [0.42, 0.95, 0.15]), 0.06, 0.25, [200, 204, 212], 12, { r2: 0.14 });
      S.tube([[0.25, 0.6, 0.15], [0.42, 0.75, 0.15], [0.42, 0.95, 0.15]], 0.035, [80, 84, 96], 8);
      S.cyl((p) => add(p, [0, 0.8, 0]), 0.2, 0.03, [70, 72, 80], 16, { capPaint: (c, w, h) => { const a = t * 18; c.fillStyle = '#ccd'; for (let k = 0; k < 6; k++) { c.save(); c.translate(w / 2, h / 2); c.rotate(a + (k * TAU) / 6); c.fillRect(0, -h * 0.05, w * 0.42, h * 0.1); c.restore(); } } });
      S.beads([[0.42, 1.6, 0.15], [0.42, 1.15, 0.15], [0.42, 0.95, 0.15], [0.25, 0.6, 0.15]], P.air, t * 1.2, { spacing: 0.07, r: 0.018 });
      S.beads([[-0.4, 1.4, 0.4], [-0.1, 1.1, 0.2], [0, 0.82, 0]], P.air, t * 1.2, { spacing: 0.07, r: 0.018 });
      // Dave, slightly green, gives it a weak thumbs up
      dave(S, [-0.55, 0, 0.65], { pose: 'thumbs', yaw: 0.6, colors: { body: H.mix(DV.body, [150, 190, 90], 1) }, blink: blinkAt(t), t });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.4 });
      const fp = S.proj([0, 0.83, 0.2]); FX.spin(ctx, fp[0], fp[1], 50, 1, t * 6);
      tagLabel(ctx, W / 2, H_ * 0.2, 'FAN = SUCTION', ramp(t, V('end', 'fans') - 0.1, 0.2), { px: 38 });
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 6, rip, t, { cause: 'cause of death:\ndenial' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('bag'), color: 'pink', filter: 'bandpass', f: 1200, q: 2, gain: 0.04, a: 0.3, minor: true }); // radio hiss
    k.play('blip', V('hook', 'Give') - 0.3, { f: 'A5', gain: 0.4 }); k.play('blip', V('hook', 'Give') - 0.15, { f: 'A5', gain: 0.4 });
    k.play('tape', V('bags', 'taped'), { gain: 0.5 }); k.play('paper', V('bags', 'germicide'), { gain: 0.5 }); k.play('pop', V('bags', 'gas'), { gain: 0.3 });
    k.play('sparkle', V('zero', 'nothing'), { gain: 0.4 }); k.play('blip', V('zero', 'water'), { f: 'E5', type: 'sine', gain: 0.5 }); k.play('slap', V('zero', 'made'), { gain: 0.15 });
    const tm = REEL_WORDS.words.filter((w) => w.beat === 'nobody').slice(-1)[0].e, tin = tm + 0.5;
    k.play('text', tm, { n: 6, gain: 0.5 }); k.play('slap', tin, { gain: 0.6 }); k.play('hurt', tin + 0.1, { gain: 0.6 });
    k.noise(ST('toilet'), { dur: DURATION - ST('toilet'), color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.12, a: 0.2 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
