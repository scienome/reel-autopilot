  // Dave reel 04: the Windows 98 plug-and-play demo. Dave plugs in the scanner. Twice. R.I.P. Dave #4.
  const BEATS = window.SCRIPT;
  const SH = [['stage', 0], ['plug', BEAT0('pnp') - 0.1], ['crash', BEAT0('scan') - 0.1], ['layers', BEAT0('why') - 0.1], ['quote', BEAT0('quote') - 0.1], ['again', REEL_WORDS.end - 1.1]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const BEIGE = [222, 214, 190], BLUE = [24, 40, 170];
  // the screen: a 98-era desktop (teal, a few icons, a taskbar), or the blue screen
  const screenPaint = (blue, t) => (c, w, h) => {
    if (blue) { c.fillStyle = '#1428aa'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8c8c8'; c.fillRect(w * 0.38, h * 0.18, w * 0.24, h * 0.07); c.fillStyle = '#1428aa'; c.font = `700 ${h * 0.05}px monospace`; c.textAlign = 'center'; c.fillText('ERROR', w / 2, h * 0.235); c.fillStyle = '#fff'; c.textAlign = 'left'; c.font = `600 ${h * 0.045}px monospace`; ['A fatal exception has occurred.', 'The current application will be', 'terminated.', '', 'Press any key to continue _'].forEach((l, i) => c.fillText(l, w * 0.1, h * (0.38 + i * 0.08))); return; }
    c.fillStyle = '#108080'; c.fillRect(0, 0, w, h); c.fillStyle = '#c0c0c0'; c.fillRect(0, h * 0.9, w, h * 0.1); c.fillStyle = '#e0e0e0'; c.fillRect(w * 0.01, h * 0.915, w * 0.14, h * 0.07);
    for (let i = 0; i < 4; i++) { c.fillStyle = ['#ffe080', '#ffffff', '#80c0ff', '#ffb0b0'][i]; c.fillRect(w * 0.05, h * (0.06 + i * 0.2), w * 0.07, h * 0.1); }
    if (t > 0) { c.fillStyle = '#c0c0c0'; c.fillRect(w * 0.55, h * 0.62, w * 0.42, h * 0.24); c.fillStyle = '#000080'; c.fillRect(w * 0.55, h * 0.62, w * 0.42, h * 0.06); c.fillStyle = '#000'; c.font = `600 ${h * 0.04}px sans-serif`; c.fillText('New hardware found', w * 0.58, h * 0.76); }
  };
  const desk = (S, o = {}) => {
    S.box((p) => add(p, [0, 0.74, 0]), 1.3, 0.04, 0.55, [150, 104, 70], { bevel: 0.1 });
    for (const [x, z] of [[-1.2, -0.45], [1.2, -0.45], [-1.2, 0.45], [1.2, 0.45]]) S.box((p) => add(p, [x, 0.36, z]), 0.04, 0.36, 0.04, [110, 78, 52]);
    // the CRT monitor
    S.box((p) => add(p, [0, 1.12, -0.15]), 0.36, 0.3, 0.3, BEIGE, { bevel: 0.15, paint: (c, w, h) => { c.fillStyle = '#222'; c.fillRect(w * 0.08, h * 0.08, w * 0.84, h * 0.8); } });
    S.box((p) => add(p, [0, 1.13, 0.155]), 0.3, 0.23, 0.004, [20, 120, 120], { bevel: 0, noShadow: true, glow: true, paint: screenPaint(o.blue, o.popup || 0) });
    S.box((p) => add(p, [0, 0.8, -0.15]), 0.2, 0.03, 0.18, BEIGE, { bevel: 0.2 });
    // the tower, the keyboard, the scanner and its cable
    S.box((p) => add(p, [0.85, 1.05, -0.1]), 0.16, 0.3, 0.3, BEIGE, { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#bbb2a0'; c.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.12); c.fillStyle = '#4c4'; c.fillRect(w * 0.7, h * 0.85, w * 0.1, h * 0.04); } });
    S.box((p) => add(p, [0, 0.79, 0.3]), 0.3, 0.012, 0.09, BEIGE, { bevel: 0.3, topPaint: (c, w, h) => { c.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 14; i++) for (let j = 0; j < 4; j++) c.fillRect(i * w / 14 + 2, j * h / 4 + 2, w / 14 - 4, h / 4 - 4); } });
    S.box((p) => add(p, [-0.85, 0.8, 0.05]), 0.32, 0.05, 0.24, [200, 196, 186], { bevel: 0.2, topPaint: (c, w, h) => { c.fillStyle = '#334'; c.fillRect(w * 0.08, h * 0.1, w * 0.84, h * 0.8); } });
    const plugged = o.plugged ?? 0, end = lerp3([-0.4, 0.95, 0.4], [0.72, 1.0, 0.0], plugged);
    S.tube([[-0.6, 0.8, 0.05], [-0.5, 0.78, 0.3], end], 0.012, [60, 60, 66], 6);
    S.box((p) => add(p, end), 0.03, 0.02, 0.02, [140, 140, 150]);
    return end;
  };
  const stageSet = (S) => {
    S.quad([[-30, 0, -6], [30, 0, -6], [30, 0, 30], [-30, 0, 30]], [52, 50, 64], { bg: true, grid: [1.0, 'rgba(255,255,255,0.04)'] });
    S.quad([[-30, 0, -3], [30, 0, -3], [30, 10, -3], [-30, 10, -3]], [36, 38, 58], { bg: true, flat: true, paint: (c, w, h) => { c.fillStyle = 'rgba(90,120,220,0.25)'; c.fillRect(w * 0.42, h * 0.55, w * 0.16, h * 0.25); c.fillStyle = 'rgba(255,255,255,0.6)'; c.font = `800 ${h * 0.05}px "Montserrat"`; c.textAlign = 'center'; c.fillText('WINDOWS 98', w / 2, h * 0.7); } });
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    const tPlug = V('scan', 'plugged') - 0.2, tBlue = V('scan', 'blue') - 0.15;
    if (n === 'stage' || n === 'plug' || n === 'crash' || n === 'again') {
      const again = n === 'again', tA = sh.t0;
      const plugged = again ? (t < tA + 0.5 ? 1 - ramp(t, tA, 0.3) : ramp(t, tA + 0.6, 0.3)) : ramp(t, tPlug - 0.3, 0.4);
      const blue = again ? true : t > tBlue;
      const [E, TG] = n === 'stage' ? orbit(t, sh.t0, sh.t1, [0.4, 0, 0], 5.2, 4.4, 1.6, 1.4, 0.35, 0.1, [0.3, 1.0, 0]) : n === 'plug' ? orbit(t, sh.t0, sh.t1, [0.5, 0, 0.3], 4.0, 3.6, 1.5, 1.4, 0.25, 0.05, [0.35, 1.0, 0]) : orbit(t, sh.t0, sh.t1, [0.6, 0, 0.4], 3.6, 3.3, 1.35, 1.3, 0.15, 0.0, [0.3, 1.05, 0]);
      const S = Scene(E, TG, W, H_); stageSet(S);
      const end = desk(S, { blue, popup: n === 'plug' ? ramp(t, V('pnp', 'finds') - 0.1, 0.2) : 0, plugged });
      const turned = again ? H.clamp((t - tA - 0.95) / 0.5) : 0;
      dave(S, [1.5, 0, 0.45], { pose: 'stand', suit: true, yaw: -1.0, hands: [[0.32, 0.95, 0.05], daveLocal([1.5, 0, 0.45], -1.0, end)], blink: blinkAt(t), t, colors: turned > 0 ? { body: H.mix(DV.body, BLUE, turned) } : undefined, xeyes: turned > 0.9 });
      S.render(ctx, W, H_, { bg: '#24222e', dof: 0.3, focus: 3, shadowAlpha: 0.5 });
      if (n === 'stage') tagLabel(ctx, W / 2, H_ * 0.2, 'LIVE · 1998', ramp(t, V('hook', 'live') - 0.1, 0.2), { px: 40 });
      if (n === 'plug') tagLabel(ctx, W / 2, H_ * 0.2, 'PLUG AND PLAY', ramp(t, V('pnp', 'plug') - 0.1, 0.2), { px: 40 });
      if (blue && !again) { ctx.save(); ctx.globalAlpha = 0.25 * ramp(t, tBlue, 0.1); ctx.fillStyle = '#1428aa'; ctx.globalCompositeOperation = 'screen'; ctx.fillRect(0, 0, W, H_); ctx.restore(); flash = 0.15 * Math.exp(-Math.pow((t - tBlue) * 6, 2)); }
      if (again) { const sp = S.proj([1.5, 1.4, 0.45]); FX.sparks(ctx, sp[0], sp[1], H.clamp((t - tA - 0.95) / 0.6), 9); }
    } else if (n === 'layers') {
      // apps on top, Windows in the middle, drivers deep down next to the hardware. A driver does something illegal: STOP.
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 4.2, 3.8, 1.8, 1.6, 0.6, 0.35, [0, 1.15, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.7, 0.5, 0.45);
      const stop = ramp(t, V('why', 'stops') - 0.1, 0.25), bl = ramp(t, V('why', 'blue') - 0.1, 0.3);
      const L = [['APPS', [120, 200, 120]], ['WINDOWS', [110, 160, 230]], ['DRIVERS', [246, 180, 80]], ['HARDWARE', [150, 150, 160]]];
      L.forEach(([name, col], i) => { const y = 1.75 - i * 0.32, c2 = H.mix(col, BLUE, bl); S.box((p) => add(p, [0, y, 0]), 0.62, 0.11, 0.42, c2, { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = 'rgba(20,20,30,0.85)'; c.font = `800 ${h * 0.55}px "Montserrat"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(name, w / 2, h * 0.55); } }); });
      // the driver's illegal move: a red bead escaping from DRIVERS into the rest
      const ill = ramp(t, V('why', 'illegal') - 0.2, 0.5);
      if (ill > 0 && stop < 1) S.beads([[0.4, 1.11, 0.45], [0.2, 1.4, 0.5], [-0.3, 1.75, 0.5]], [255, 80, 60], t * 1.2, { spacing: 0.12, r: 0.03, reveal: ill });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
      const dp = S.proj([0.45, 1.11, 0.4]); FX.no(ctx, dp[0], dp[1], 40, ill * (1 - stop));
      if (stop > 0) { ctx.save(); const s2 = H.ease.back(stop); ctx.translate(W / 2, H_ * 0.2); ctx.scale(s2, s2); ctx.fillStyle = '#d8382e'; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + (i * TAU) / 8; ctx.lineTo(Math.cos(a) * 80, Math.sin(a) * 80); } ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = FONT(800, 40); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('STOP', 0, 2); ctx.restore(); }
      tagLabel(ctx, W / 2, H_ * 0.33, 'YOUR DATA: SAFE', ramp(t, V('why', 'data') - 0.1, 0.2) * (1 - bl), { px: 34, col: '#7ee07a' });
    } else {
      // the quote, over the blue screen
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0.3], 2.2, 2.0, 1.2, 1.15, 0.12, 0.0, [0, 1.12, 0]);
      const S = Scene(E, TG, W, H_); stageSet(S); desk(S, { blue: true, plugged: 1 });
      S.render(ctx, W, H_, { bg: '#24222e', dof: 0.3, focus: 2.1 });
      const u = ramp(t, sh.t0 + 0.1, 0.25); if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = 'rgba(16,16,22,0.88)'; ctx.beginPath(); ctx.roundRect(W * 0.07, H_ * 0.11, W * 0.86, H_ * 0.24, 24); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = FONT(800, 34); ['"That must be why', 'we\'re not shipping', 'Windows 98 yet."'].forEach((l, i) => ctx.fillText(l, W / 2, H_ * (0.17 + i * 0.045))); ctx.font = FONT(600, 24); ctx.fillStyle = '#ffd24a'; ctx.fillText('Bill Gates, on stage, 1998', W / 2, H_ * 0.32); ctx.restore(); }
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 4, rip, t, { cause: 'cause of death:\nplug and pray' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: BEAT0('scan'), color: 'pink', filter: 'bandpass', f: 600, q: 0.4, gain: 0.05, a: 0.5, minor: true });
    k.play('boot', 0.2, { gain: 0.6 }); k.play('select', V('pnp', 'finds'), { gain: 0.5 });
    const tPlug = V('scan', 'plugged') - 0.2, tBlue = V('scan', 'blue') - 0.15;
    k.play('click', tPlug + 0.1, { gain: 0.8 }); k.play('blip', tPlug + 0.3, { f: 'C6', gain: 0.6 }); k.play('glitch', tBlue - 0.1, { gain: 0.6 }); k.play('buzz', tBlue, { f: 90, dur: 0.6, gain: 0.4 });
    k.play('error', V('why', 'illegal'), { gain: 0.35 }); k.play('stamp', V('why', 'stops'), { gain: 0.5 }); k.play('ding', V('why', 'data'), { f: 'C6', gain: 0.2 });
    k.play('pop', ST('quote') + 0.1, { gain: 0.3 });
    const tA = ST('again'); k.play('click', tA + 0.2, { gain: 0.6 }); k.play('click', tA + 0.85, { gain: 0.8 }); k.play('glitch', tA + 0.95, { gain: 0.7 }); k.play('hurt', tA + 1.0, { gain: 0.8 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
