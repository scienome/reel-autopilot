// ======================================================================
// EXAMPLE EXPLAINER — "What leg day does to your muscles" (estimated timing; re-time from the voiceover)
// Replace SCRIPT, the scene functions and scoreSound for a new reel; keep the library above unchanged.
// ======================================================================
(function () {
  const PAL = P.PAL;
  const SCRIPT = P.timeScript([
    ['After a hard leg day, your muscles are not just tired.'],
    ['Zoom into your thigh, and you find bundles of muscle fibers,'],
    ['each one packed with tiny proteins called actin and myosin.'],
    ['Heavy lifting pulls on them so hard that some of them tear.'],
    ['That damage is part of why you feel sore two days later.'],
    ['But your body sends in a repair crew: satellite cells.'],
    ['They fuse with the damaged fiber and help add new protein,'],
    ['so the fiber grows back thicker and stronger.'],
    ['The raw materials? Sleep and protein.'],
    ['So rest days are not lazy. They are when the growing happens.'],
  ]);
  const WORDS = P.words(SCRIPT), CHUNKS = P.chunks(WORDS, 3), wt = (k, n) => P.wt(WORDS, k, n);
  const DURATION = +(WORDS[WORDS.length - 1].end + 1.2).toFixed(2);
  // beat boundaries hang on words
  const T = {
    zoom1: wt('Zoom') - 0.1, zoom2: wt('each') - 0.3, tear: wt('tear'), sore: wt('damage') - 0.5,
    repair: wt('But') - 0.2, fuse: wt('They'), grow: wt('grows'), raw: wt('raw') - 0.3, fin: wt('rest') - 0.3,
  };

  // --- scenes: each draws a full frame from absolute t ---
  function gymScene(ctx, W, H_, t) {
    P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, t, W / 2, H_ * 0.6, 0.02);
    const rep = 0.5 - 0.5 * Math.cos(t * 2.2);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.4, { squat: rep, arms: 'bar', bar: true, wince: rep * 0.6, blink: Math.sin(t * 1.7) > 0.97 ? 1 : 0 });
    if (rep > 0.7) { P.zap(ctx, W / 2 + 90, H_ * 0.86 - 150, 34, t, 2, 3); P.zap(ctx, W / 2 - 90, H_ * 0.86 - 150, 34, t, 3, 3); }
    ctx.restore();
    P.title(ctx, ['Leg Day Rips', 'Your Muscles!'], W / 2, 170, P.pop(t, 0.15, 0.9));
  }
  function fiberScene(ctx, W, H_, t) {
    const lt = t - T.zoom1; P.bg(ctx, W, H_, 'deep', t);
    ctx.save(); P.push(ctx, W, H_, lt, W / 2, H_ * 0.45, 0.015);
    const cols = ['#e8364f', '#ff4a5c', '#d8305e'];
    for (let i = 0; i < 3; i++) P.fiber(ctx, 60 + i * 34, 330 + i * 150, 540, 64, 0.2, { color: cols[i], cap: '#ff8fb0', seed: i, slide: lt * 8 });
    ctx.restore();
    P.label(ctx, 'Muscle Fibers', W / 2, 250, P.pop(t, wt('muscle') - 0.1), { color: PAL.magenta, stem: [W / 2, 420] });
  }
  function filamentScene(ctx, W, H_, t) {
    const lt = t - T.zoom2; P.bg(ctx, W, H_, 'violet', t);
    ctx.save(); P.shake(ctx, t, T.tear, 1.2, 0.5);
    const pull = P.ramp(t, wt('pulls'), wt('pulls') + 0.8), ripK = P.pop(t, T.tear - 0.05, 0.25);
    P.filaments(ctx, W / 2, H_ * 0.44, 560 + pull * 60, 560, t, { slide: 0.5 + 0.5 * Math.sin(lt * 2.4) * (1 - pull), tears: [{ x: W / 2 - 120, k: ripK }, { x: W / 2 + 150, y: H_ * 0.47, k: P.pop(t, T.tear + 0.15, 0.25) }] });
    if (ripK > 0) { P.zap(ctx, W / 2 - 120, H_ * 0.32, 60, t, 4, 4); P.zap(ctx, W / 2 + 150, H_ * 0.55, 60, t, 5, 4); }
    ctx.restore();
    P.label(ctx, 'Actin', 210, 170, P.pop(t, wt('actin') - 0.1), { color: PAL.pink });
    P.label(ctx, 'Myosin', 510, 170, P.pop(t, wt('myosin') - 0.1), { color: PAL.grape });
    if (ripK > 0) P.label(ctx, 'Micro-tears', W / 2, 830, ripK, { color: PAL.red });
  }
  function soreScene(ctx, W, H_, t) {
    const lt = t - T.sore; P.bg(ctx, W, H_, 'plum', t);
    const fl = P.ramp(t, wt('sore') - 0.2, wt('sore') + 0.4);
    P.calendar(ctx, W / 2, 250, 1.4, 'MON', 'WED', fl);
    P.fill(ctx, P.rr(W / 2 - 190, H_ * 0.66, 380, 40, 20), PAL.cyan); P.fill(ctx, P.rr(W / 2 - 190, H_ * 0.66 + 26, 380, 14, 7), P.shade(PAL.cyan, 0.3));
    const wob = Math.sin(lt * 5) * 0.08;
    ctx.save(); ctx.translate(W / 2, H_ * 0.66); ctx.rotate(wob * 0.3); P.lifter(ctx, 0, 0, 1.3, { squat: 0.18 + Math.abs(wob), arms: 'down', wince: fl, look: -0.3 }); ctx.restore();
    if (fl > 0.5) { P.zap(ctx, W / 2 - 70, H_ * 0.66 - 120, 30, t, 7, 3); P.zap(ctx, W / 2 + 70, H_ * 0.66 - 110, 30, t, 8, 3); }
  }
  // repair, growth and materials share one close-up fibre
  function repairScene(ctx, W, H_, t) {
    const lt = t - T.repair; P.bg(ctx, W, H_, 'deep', t);
    const grow = P.ramp(t, T.grow - 0.2, T.grow + 1.2), heal = P.ramp(t, T.fuse + 0.4, T.grow);
    ctx.save(); P.push(ctx, W, H_, lt, W / 2, H_ * 0.45, 0.01);
    const r = 92 * (1 + grow * 0.45);
    P.fiber(ctx, 70, H_ * 0.45, 600, r, -0.12, { color: PAL.red, seed: 9, tears: [0.35, 0.68], tearK: 1 - heal * 0.999, heal, slide: lt * 6 });
    // satellite cells swim in, then fuse (shrink into the fibre)
    const cells = [[-120, 280, 0.35], [W + 120, 980, 0.68], [W / 2, -140, 0.5]];
    cells.forEach(([sx, sy, p], i) => {
      const arrive = P.ramp(t, wt('satellite') - 0.4 + i * 0.15, wt('satellite') + 1.0 + i * 0.15), fuse = P.ramp(t, T.fuse + i * 0.15, T.fuse + 1.1 + i * 0.15);
      const tx = 70 + 600 * p * Math.cos(-0.12), ty = H_ * 0.45 + 600 * p * Math.sin(-0.12);
      const x = P.lerp(sx, tx, arrive), y = P.lerp(sy, ty - r - 30, arrive) + fuse * (r + 30);
      if (fuse < 1) P.cellStar(ctx, x, y, 54 * (1 - fuse * 0.85), t + i, { rot: i, color: PAL.sky });
      if (fuse > 0 && heal < 1) P.flow(ctx, x, y - 120, tx, ty, t, fuse, PAL.amber, 6);
    });
    if (grow > 0) P.sparkles(ctx, W / 2, H_ * 0.43, 260, t, grow, 3);
    ctx.restore();
    P.label(ctx, 'Satellite Cells', W / 2, 190, P.pop(t, wt('satellite') - 0.1), { color: PAL.blue });
    P.label(ctx, 'Hypertrophy', W / 2, 800, P.pop(t, T.grow + 0.2), { color: PAL.green, sub: 'thicker fibers' });
    // raw materials drop in
    if (t > T.raw) {
      const k1 = P.pop(t, wt('Sleep') - 0.1, 0.45), k2 = P.pop(t, wt('protein', 1) - 0.1, 0.45);
      if (k1 > 0) { P.moon(ctx, 190, 230 + (1 - H.ease.back(k1)) * -300, 62); }
      if (k2 > 0) { P.shaker(ctx, 540, 250 + (1 - H.ease.back(k2)) * -300, 1.1); }
      P.flow(ctx, 190, 300, W / 2 - 60, H_ * 0.43, t, k1, PAL.yellow, 8); P.flow(ctx, 540, 320, W / 2 + 60, H_ * 0.41, t, k2, PAL.amber, 8);
    }
  }
  function finaleScene(ctx, W, H_, t) {
    const lt = t - T.fin; P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, lt, W / 2, H_ * 0.55, 0.02);
    const fk = P.ramp(t, wt('growing') - 0.6, wt('growing') + 0.2);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.4, { arms: 'down', arms2: 'flex', mix: fk, bulk: 0.2 + fk * 0.8, smile: true, blink: Math.sin(t * 1.9) > 0.97 ? 1 : 0 });
    P.sparkles(ctx, W / 2, H_ * 0.55, 230, t, fk, 6);
    ctx.restore();
    P.confetti(ctx, W, H_, t, wt('growing') - 0.1, 3);
    P.title(ctx, ['Rest = Growth'], W / 2, 190, P.pop(t, wt('rest') - 0.1, 0.5), { size: 64, color: PAL.mint });
  }

  function explainer(ctx, W, H_, t) {
    ctx.save();
    if (t < T.zoom2 + 0.8) {
      const rep = 0.5 - 0.5 * Math.cos(T.zoom1 * 2.2), thigh = [W / 2 + 62 * 1.4, H_ * 0.86 + (-150 + rep * 58 + 40) * 1.4];
      if (t < T.zoom1 + 0.9) P.zoomThrough(ctx, W, H_, t, T.zoom1, 0.9, thigh[0], thigh[1], (c) => gymScene(c, W, H_, t), (c) => fiberScene(c, W, H_, t));
      else P.zoomThrough(ctx, W, H_, t, T.zoom2, 0.8, 300, 480, (c) => fiberScene(c, W, H_, t), (c) => filamentScene(c, W, H_, t));
    } else if (t < T.repair + 0.6) {
      if (t < T.sore + 0.6) P.slideCut(ctx, W, H_, t, T.sore, 0.6, (c) => filamentScene(c, W, H_, t), (c) => soreScene(c, W, H_, t));
      else P.zoomThrough(ctx, W, H_, t, T.repair, 0.6, W / 2, H_ * 0.55, (c) => soreScene(c, W, H_, t), (c) => repairScene(c, W, H_, t));
    } else P.slideCut(ctx, W, H_, t, T.fin, 0.6, (c) => repairScene(c, W, H_, t), (c) => finaleScene(c, W, H_, t));
    ctx.restore();
    P.finish(ctx, W, H_);
    P.caption(ctx, W, H_, P.captionAt(CHUNKS, t));
  }

  const BEATS = [
    { t: 0, name: 'Hook: leg day in the gym' }, { t: T.zoom1, name: 'Zoom into the thigh: fibres' }, { t: T.zoom2, name: 'Actin and myosin' },
    { t: T.tear, name: 'Micro-tears' }, { t: T.sore, name: 'Sore two days later' }, { t: T.repair, name: 'Satellite cells arrive' },
    { t: T.grow, name: 'Fibre grows thicker' }, { t: T.raw, name: 'Sleep and protein' }, { t: T.fin, name: 'Finale: rest = growth' },
  ];
  window.LESSON = { BEATS, DURATION, explainer, SCRIPT, WORDS, CHUNKS };

  // sound: soft science-explainer sounds — whooshes on zooms, pops on labels, zaps on pain, sparkles on growth
  function scoreSound(k) {
    k.play('riser', 0.05, { dur: 0.7, gain: 0.6 });
    k.play('pop', 0.3, { f: 700 }); k.play('pop', 0.55, { f: 820 });
    for (let x = 0.3; x < T.zoom1; x += 2.86) k.play('thud', x + 1.4, { gain: 0.35, minor: true });
    [T.zoom1, T.zoom2, T.repair].forEach((z) => k.play('whoosh', z, { dur: 0.8, top: 3200 }));
    [T.sore, T.fin].forEach((z) => k.play('swish', z, { dur: 0.3 }));
    ['muscle', 'actin', 'myosin', 'satellite'].forEach((w, i) => k.play('pop', wt(w) - 0.1, { f: 600 + i * 90 }));
    k.play('impact', T.tear, { gain: 0.7 }); k.play('glitch', T.tear + 0.02, { gain: 0.6 }); k.play('glitch', T.tear + 0.17, { gain: 0.5 });
    k.play('paper', wt('sore') - 0.2, { dur: 0.4 }); k.play('buzz', wt('sore') + 0.1, { dur: 0.25, f: 140, gain: 0.5, minor: true });
    for (let i = 0; i < 3; i++) k.play('blip', wt('satellite') + 0.2 + i * 0.15, { f: ['C6', 'E6', 'G6'][i], minor: true });
    k.play('riser', T.grow - 0.3, { dur: 1.2, gain: 0.6 }); k.play('sparkle', T.grow + 0.2, { n: 8 }); k.play('pop', T.grow + 0.2, { f: 900 });
    k.play('stamp', wt('Sleep') + 0.25, { gain: 0.5 }); k.play('stamp', wt('protein', 1) + 0.25, { gain: 0.5 });
    k.play('pop', wt('rest') - 0.1, { f: 760 }); k.play('success', wt('growing')); k.play('sparkle', wt('growing') + 0.2, { n: 10 });
  }
  window.scoreSound = scoreSound;
})();
