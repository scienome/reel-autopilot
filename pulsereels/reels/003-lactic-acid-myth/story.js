// 003 — The lactic acid myth: lactate is fuel; the burn is hydrogen ions (Brooks 2018; Cheung 2003)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const SCRIPT = P.reelScript();
  const WORDS = P.mergeWords(P.words(SCRIPT), [['an hour', '1 hour']]);
  const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
  const wt = (k, n) => P.wt(WORDS, k, n);
  const L = (i) => SCRIPT[i][1][0][0];
  const DURATION = +((window.TIMING && window.TIMING.duration) || WORDS[WORDS.length - 1].end + 1.4).toFixed(2);
  const blink = (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0);
  let CUR = 0;

  // A: hook — last rep of curls, arm burning, everyone blames lactic acid
  function hook(ctx, t) {
    P.gym(ctx, W, H_, t);
    const rep = 0.5 - 0.5 * Math.cos(t * 3.2), burn = P.ramp(t, 0.1, wt('burn') + 0.2);
    ctx.save(); P.push(ctx, W, H_, t, W / 2, H_ * 0.6, 0.03); P.shake(ctx, t, wt('blames'), 0.4, 0.4);
    const pose = P.lifter(ctx, W / 2, H_ * 0.86, 1.4, { arms: 'down', arms2: 'curl', mix: rep, wince: 0.4 + burn * 0.6, blink: blink(t) });
    for (const h of pose.hands) { P.glow(ctx, h[0], h[1] + 40, 110 * burn, PAL.red, 0.6); P.zap(ctx, h[0], h[1] + 30, 50, t, h[0], 3); }
    ctx.restore();
    P.title(ctx, ['That BURN', 'On Your Last Rep'], W / 2, 150, 1, { size: 64 });
    P.wanted(ctx, W / 2, 560, 0.75, P.pop(t, wt('lactic') - 0.2, 0.45), (c) => P.lactate(c, 0, 10, 2.4, 0.2, 1));
  }
  // B: myth stamp
  function myth(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, '#ffffff', 2, 0.05);
    P.wanted(ctx, W / 2, 520, 1.15, 1, (c) => P.lactate(c, 0, 10, 2.4, 0.2 + Math.sin(t * 2) * 0.1, 1));
    P.counter(ctx, 'MYTH!', W / 2, 160, 120, P.pop(t, wt('myths') - 0.2, 0.4), PAL.yellow);
    P.stampX(ctx, W / 2, 520, 150, P.pop(t, wt('myths') - 0.1, 0.25));
  }
  // C/D: inside the muscle — sugar burns fast, hydrogen ions pile up (the burn), lactate is just there
  function muscle(ctx, t) {
    P.bg(ctx, W, H_, 'plum', t); P.bgCells(ctx, W, H_, t, PAL.pink, 3, 0.05);
    const hk = P.ramp(t, wt('acid', 1) - 0.4, wt('muscle') + 0.4), cx = W / 2, cy = H_ * 0.44;
    ctx.save(); P.push(ctx, W, H_, t - L(2), cx, cy, 0.02);
    P.fiber(ctx, 40, cy + 40, 640, 150, -0.1, { color: '#ff4a5c', seed: 4, slide: t * 14 });
    P.glow(ctx, cx, cy, 380 * hk, PAL.red, 0.55 * hk);
    // sugar flies in and burns
    const ks = P.pop(t, wt('sugar') - 0.3, 0.4);
    for (let i = 0; i < 6; i++) { const p = (t * 0.9 + i / 6) % 1; if (ks <= 0) break; const x = P.lerp(-40, cx, p), y = cy - 260 + i * 30 + Math.sin(p * 6) * 20; ctx.save(); ctx.translate(x, y); ctx.rotate(p * 4); P.flat(ctx, P.rr(-16, -16, 32, 32, 6), '#ffffff', { off: 4 }); ctx.restore(); if (p > 0.85) P.sparkles(ctx, x, y, 40, t, 1 - (p - 0.85) * 6, i); }
    // hydrogen ions pile up
    const n = Math.round(30 * hk), r = H.rng('ions');
    for (let i = 0; i < 30; i++) { const ax = cx + (r() - 0.5) * 560, ay = cy + (r() - 0.5) * 300, ph = r() * 6; if (i < n) P.ion(ctx, ax + Math.sin(t * 3 + ph) * 8, ay + Math.cos(t * 2.4 + ph) * 8, 18, 1); }
    // lactate sits innocently in the middle
    const kl = P.pop(t, wt('lactate') - 0.2, 0.4);
    if (kl > 0) { P.glow(ctx, cx, cy + 20, 140, PAL.cyan, 0.5 * kl); P.lactate(ctx, cx, cy + 20, 2.2 * H.ease.back(kl), Math.sin(t * 2) * 0.2, 1); }
    if (hk > 0.3) P.zap(ctx, cx, cy, 300, t, 9, 5);
    ctx.restore();
    P.label(ctx, 'Sugar → energy', W / 2, 180, ks * (1 - P.pop(t, wt('acid', 1) - 0.3)), { color: PAL.amber });
    P.label(ctx, 'Hydrogen ions = the burn', W / 2, 180, P.pop(t, wt('hydrogen') - 0.2) * (1 - P.pop(t, wt('lactate') - 0.3)), { color: PAL.red, size: 30 });
    P.label(ctx, 'Lactate = FUEL', W / 2, 180, P.pop(t, wt('fuel') - 0.2), { color: PAL.blue });
  }
  // E: the shuttle — lactate rides the blood to the heart, brain and liver
  function shuttle(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, PAL.cyan, 4, 0.05);
    const vy = 430;
    P.vessel(ctx, -40, vy, W + 80, 120, t, { speed: 200, seed: 4 });
    for (let i = 0; i < 7; i++) { const x = ((i * 120 + t * 220) % (W + 160)) - 80; P.lactate(ctx, x, vy + Math.sin(i * 2 + t * 3) * 40, 1.1, t + i, 1); }
    [['heart', 140, PAL.red, 'Heart'], ['brain', 360, PAL.pink, 'Brain'], ['liver', 580, PAL.red, 'Liver']].forEach(([w, x, c, lab], i) => {
      const k = P.pop(t, wt(w) - 0.25, 0.45); if (k <= 0) return;
      ctx.save(); ctx.translate(x, 720); const s = H.ease.back(k); ctx.scale(s, s);
      P.glow(ctx, 0, 0, 120, PAL.yellow, 0.35 * k);
      if (w === 'heart') P.heart(ctx, 0, 0, 70, t); else if (w === 'brain') P.brain(ctx, 0, 0, 75); else P.liver(ctx, 0, 0, 70);
      ctx.restore();
      P.flow(ctx, x, vy + 70, x, 690, t, k, PAL.cyan, 5);
      P.label(ctx, lab, x, 830 - 10, k, { color: i === 1 ? PAL.magenta : PAL.red, size: 26 });
    });
    P.label(ctx, 'Lactate shuttle', W / 2, 200, P.pop(t, wt('leaves') - 0.2), { color: PAL.blue, sub: 'used for energy' });
  }
  // F/G: two clocks — lactate gone in an hour, soreness two days later
  function clocks(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, '#ffffff', 5, 0.05);
    const gone = P.ramp(t, wt('gone') - 0.2, wt('an') + 0.7), kl = 1 - gone;
    P.meter(ctx, 230, 760, 150, 430, 0.95 * kl + 0.03, PAL.cyan, 'Lactate');
    const sore = P.ramp(t, wt('sore') - 0.2, wt('later') + 0.4);
    P.meter(ctx, 490, 760, 150, 430, sore * 0.9, PAL.red, 'Soreness');
    P.counter(ctx, '1 hour', 230, 250, 54, P.pop(t, wt('an') - 0.2, 0.4), PAL.cyan);
    P.counter(ctx, '48 hours', 500, 250, 54, P.pop(t, wt('two') - 0.2, 0.4), PAL.red);
    P.stampX(ctx, 360, 470, 80, P.pop(t, wt("can't") + 0.1, 0.25));
  }
  // H: finale — lactate is your backup battery
  function finale(ctx, t) {
    P.gym(ctx, W, H_, t);
    const bk = P.ramp(t, wt('backup') - 0.3, wt('battery') + 0.5);
    ctx.save(); P.push(ctx, W, H_, t - L(8), W / 2, H_ * 0.6, 0.02);
    P.lifter(ctx, W / 2 - 110, H_ * 0.86, 1.2, { arms: 'flex', bulk: 0.6, smile: true, blink: blink(t, 3) });
    P.battery(ctx, W / 2 + 190, H_ * 0.5, 1.1, bk);
    P.lactate(ctx, W / 2 + 190, H_ * 0.5 - 120 - Math.sin(t * 3) * 10, 1.6, Math.sin(t * 2) * 0.2, 1);
    P.sparkles(ctx, W / 2 + 190, H_ * 0.5, 170, t, bk, 6);
    ctx.restore();
    P.title(ctx, ["It's Your", 'BACKUP BATTERY'], W / 2, 170, P.pop(t, wt('villain') - 0.2, 0.7), { size: 62, color: PAL.mint });
    P.wanted(ctx, 160, 520, 0.5, P.pop(t, wt('villain') - 0.3, 0.4), (c) => P.lactate(c, 0, 10, 2.4, 0.2, 1), P.pop(t, wt('villain') + 0.3, 0.3));
  }

  const SEQ = [
    { t: 0, draw: (c) => hook(c, CUR) },
    { t: L(1) - 0.15, draw: (c) => myth(c, CUR), tr: 'slide' },
    { t: L(2) - 0.3, draw: (c) => muscle(c, CUR), tr: 'zoom', focus: [W / 2, 560] },
    { t: L(5) - 0.3, draw: (c) => shuttle(c, CUR), tr: 'zoom', focus: [W / 2, H_ * 0.44] },
    { t: L(6) - 0.2, draw: (c) => clocks(c, CUR), tr: 'slide' },
    { t: L(8) - 0.2, draw: (c) => finale(c, CUR), tr: 'slide' },
  ];
  function explainer(ctx, W_, H2, t) { CUR = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore(); P.finish(ctx, W, H_); P.caption(ctx, W, H_, P.captionAt(CHUNKS, t)); }
  const BEATS = [{ t: 0, name: 'hook' }, { t: SEQ[1].t, name: 'myth' }, { t: SEQ[2].t, name: 'sugar' }, { t: wt('hydrogen'), name: 'ions' }, { t: wt('fuel'), name: 'fuel' }, { t: SEQ[3].t, name: 'shuttle' }, { t: SEQ[4].t, name: 'clocks' }, { t: wt('sore'), name: 'sore' }, { t: SEQ[5].t, name: 'finale' }];
  window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };

  function scoreSound(k) {
    k.play('riser', 0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
    for (let x = 0.3; x < L(1); x += 0.98) k.play('thud', x + 0.5, { gain: 0.3, minor: true });
    k.play('buzz', wt('burn'), { dur: 0.5, f: 150, gain: 0.5 }); k.play('stamp', wt('lactic') - 0.2, { gain: 0.6 });
    SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
    k.play('stamp', wt('myths') - 0.1, { gain: 0.8 }); k.play('error', wt('myths'), { gain: 0.5 });
    k.play('pop', wt('sugar') - 0.2, { f: 640 }); k.play('glitch', wt('hydrogen'), { gain: 0.5 }); k.play('buzz', wt('hydrogen') + 0.1, { dur: 0.6, f: 110, gain: 0.4, minor: true });
    k.play('ding', wt('lactate'), { f: 'E6' }); k.play('pop', wt('fuel') - 0.2, { f: 860 });
    ['heart', 'brain', 'liver'].forEach((w, i) => k.play('blip', wt(w) - 0.2, { f: ['C6', 'E6', 'G6'][i] }));
    for (let x = wt('gone') - 0.2; x < wt('an') + 0.7; x += 0.1) k.play('count', x, { minor: true });
    k.play('thud', wt('sore'), { gain: 0.5 }); k.play('stamp', wt("can't") + 0.1, { gain: 0.7 });
    k.play('powerup', wt('backup')); k.play('success', wt('battery') + 0.2); k.play('sparkle', wt('battery') + 0.3, { n: 10 });
  }
  window.scoreSound = scoreSound;
