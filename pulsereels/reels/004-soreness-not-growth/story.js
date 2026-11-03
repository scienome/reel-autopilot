// 004 — Soreness is not a growth signal (Schoenfeld & Contreras 2013; repeated bout effect, Nosaka 2008)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const SCRIPT = P.reelScript();
  const WORDS = P.mergeWords(P.words(SCRIPT), [['one to three days', '1-3 days']]);
  const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
  const wt = (k, n) => P.wt(WORDS, k, n);
  const L = (i) => SCRIPT[i][1][0][0];
  const DURATION = +((window.TIMING && window.TIMING.duration) || WORDS[WORDS.length - 1].end + 1.4).toFixed(2);
  const blink = (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0);
  let CUR = 0;

  // A: hook — feels fine the day after, panics
  function hook(ctx, t) {
    P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, t, W / 2, H_ * 0.6, 0.03);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.4, { arms: 'down', look: Math.sin(t * 2) * 0.6, shock: P.ramp(t, wt('work') - 0.5, wt('work')), blink: blink(t) });
    P.qmarks(ctx, W / 2, H_ * 0.86 - 460, t, P.pop(t, wt('does') - 0.2, 0.8));
    ctx.restore();
    P.title(ctx, ['Not Sore =', 'No Gains?'], W / 2, 150, 1, { size: 72 });
    P.bubble(ctx, 'Did it even work?!', W / 2 + 60, 470, P.pop(t, wt('workout') - 0.2, 0.35), { tail: [W / 2 + 20, 560] });
  }
  // B: NOPE — soreness is a bad ruler
  function nope(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, '#ffffff', 2, 0.05);
    P.counter(ctx, 'NOPE.', W / 2, 220, 140, P.pop(t, wt('nope') - 0.15, 0.4), PAL.yellow);
    const kr = P.pop(t, wt('soreness') - 0.2, 0.45);
    if (kr > 0) { ctx.save(); ctx.translate(W / 2, 560); ctx.rotate(-0.12 + Math.sin(t * 2) * 0.03); const s = H.ease.back(kr); ctx.scale(s, s);
      P.flat(ctx, P.rr(-260, -50, 520, 100, 16), PAL.amber, { off: 6 }); for (let i = 0; i < 13; i++) P.fill(ctx, P.rr(-240 + i * 40, -50, 6, i % 2 ? 30 : 50, 3), P.shade(PAL.amber, 0.4));
      ctx.fillStyle = PAL.ink; ctx.font = `900 34px ${P.FONT}`; ctx.textAlign = 'center'; ctx.fillText('SORENESS', 0, 30); ctx.restore(); }
    P.stampX(ctx, W / 2, 560, 130, P.pop(t, wt('terrible') - 0.1, 0.25));
    P.label(ctx, '≠ growth', W / 2, 780, P.pop(t, wt('growth') - 0.2), { color: PAL.red });
  }
  // C: what the ache is — tiny damage and swelling, 1-3 days later
  function ache(ctx, t) {
    P.bg(ctx, W, H_, 'plum', t); P.bgCells(ctx, W, H_, t, PAL.pink, 3, 0.05);
    const cy = H_ * 0.45, dk = P.pop(t, wt('damage') - 0.3, 0.4), sw = P.ramp(t, wt('swelling') - 0.3, wt('swelling') + 0.4);
    ctx.save(); P.push(ctx, W, H_, t - L(2), W / 2, cy, 0.02);
    P.glow(ctx, W / 2, cy, 380 * sw, PAL.red, 0.5 * sw);
    P.fiber(ctx, 50, cy, 620, 110 * (1 + sw * 0.12), -0.1, { color: '#ff4a5c', seed: 8, tears: [0.3, 0.55, 0.78], tearK: dk, slide: t * 6 });
    if (dk > 0) P.zap(ctx, W / 2, cy, 170, t, 3, 5);
    ctx.restore();
    const kc = P.pop(t, wt('one') - 0.3, 0.4);
    if (kc > 0) { ctx.save(); ctx.translate(W / 2, 230); ctx.scale(kc, kc); P.calendar(ctx, 0, 0, 1, 'DAY 1', 'DAY 3', P.ramp(t, wt('later') - 0.3, wt('later') + 0.1)); ctx.restore(); }
    P.label(ctx, 'Micro-damage', 200, 830, dk, { color: PAL.red, size: 28 });
    P.label(ctx, 'Swelling', 520, 830, P.pop(t, wt('swelling') - 0.2), { color: PAL.magenta, size: 28 });
  }
  // D/E: repeated bout effect — soreness bars fall, muscle bars rise, session after session
  function chart(ctx, t) {
    P.bg(ctx, W, H_, 'deep', t); P.bgCells(ctx, W, H_, t, '#ffffff', 4, 0.05);
    const t0 = wt('again'), sore = [0.95, 0.45, 0.25, 0.15], grow = [0.25, 0.4, 0.55, 0.72];
    for (let i = 0; i < 4; i++) {
      const k = P.ramp(t, t0 + i * 0.55, t0 + i * 0.55 + 0.4), x = 150 + i * 145;
      P.meter(ctx, x - 30, 860, 50, 470, sore[i] * k, PAL.red, null);
      P.meter(ctx, x + 30, 860, 50, 470, grow[i] * P.ramp(t, wt('still') - 0.6 + i * 0.12, wt('grows') + 0.3 + i * 0.12) * 0 + grow[i] * k * (0.5 + 0.5 * P.ramp(t, wt('still') - 0.4, wt('grows') + 0.4)), PAL.mint, null);
      ctx.fillStyle = '#ffffff'; ctx.font = `800 24px ${P.FONT}`; ctx.textAlign = 'center'; ctx.globalAlpha = k; ctx.fillText('Week ' + (i + 1), x, 900); ctx.globalAlpha = 1;
    }
    P.label(ctx, 'Soreness', 210, 300, P.pop(t, t0), { color: PAL.red, size: 28 });
    P.label(ctx, 'Muscle', 510, 300, P.pop(t, t0 + 0.2), { color: PAL.green, size: 28 });
    P.title(ctx, ['Repeated', 'Bout Effect'], W / 2, 160, P.pop(t, wt('repeated') - 0.2, 0.6), { size: 60, color: PAL.cyan });
    P.arrowFlat(ctx, 150, 640, 610, 330, P.ramp(t, wt('still') - 0.2, wt('grows') + 0.5), PAL.mint, 20);
  }
  // F: what actually builds muscle — tension, close to failure, a little more each time
  function tension(ctx, t) {
    P.gym(ctx, W, H_, t);
    const rep = 0.5 - 0.5 * Math.cos(t * 1.8), more = P.ramp(t, wt('more') - 0.2, wt('more') + 0.4);
    ctx.save(); P.push(ctx, W, H_, t - L(6), W / 2, H_ * 0.6, 0.02);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.35, { squat: rep, arms: 'bar', bar: true, plate: more > 0.5 ? PAL.magenta : PAL.orange, wince: 0.3 + rep * 0.5, blink: blink(t, 4) });
    if (rep > 0.75) P.zap(ctx, W / 2, H_ * 0.86 - 300, 120, t, 7, 4);
    ctx.restore();
    P.label(ctx, 'Tension', W / 2, 180, P.pop(t, wt('tension') - 0.2), { color: PAL.blue });
    P.label(ctx, 'Close to failure', W / 2, 270, P.pop(t, wt('failure') - 0.2), { color: PAL.red });
    P.counter(ctx, P.countTo(t, wt('more') - 0.2, wt('more') + 0.6, 60, 62.5, 1) + ' kg', W / 2, 400, 80, P.pop(t, wt('adding') - 0.2, 0.4), PAL.mint);
  }
  // G: finale — chase progress
  function finale(ctx, t) {
    P.gym(ctx, W, H_, t);
    const fk = P.ramp(t, wt('progress') - 0.5, wt('progress') + 0.4);
    ctx.save(); P.push(ctx, W, H_, t - L(7), W / 2, H_ * 0.6, 0.02);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.4, { arms: 'down', arms2: 'flex', mix: fk, bulk: 0.3 + fk * 0.7, smile: true, blink: blink(t, 3) });
    P.sparkles(ctx, W / 2, H_ * 0.55, 240, t, fk, 9);
    ctx.restore();
    P.stampX(ctx, W / 2, 330, 80, P.pop(t, wt('soreness', 2) - 0.1, 0.25) * (1 - fk));
    P.label(ctx, 'Chasing soreness', W / 2, 330, P.pop(t, wt('stop') - 0.2) * (1 - fk), { color: PAL.red });
    P.title(ctx, ['Chase', 'PROGRESS!'], W / 2, 170, fk, { size: 78, color: PAL.mint });
    P.confetti(ctx, W, H_, t, wt('progress'), 5);
  }

  const SEQ = [
    { t: 0, draw: (c) => hook(c, CUR) },
    { t: L(1) - 0.15, draw: (c) => nope(c, CUR), tr: 'slide' },
    { t: L(2) - 0.3, draw: (c) => ache(c, CUR), tr: 'zoom', focus: [W / 2, 560] },
    { t: L(3) - 0.2, draw: (c) => chart(c, CUR), tr: 'slide' },
    { t: L(6) - 0.2, draw: (c) => tension(c, CUR), tr: 'slide' },
    { t: L(7) - 0.2, draw: (c) => finale(c, CUR), tr: 'slide' },
  ];
  function explainer(ctx, W_, H2, t) { CUR = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore(); P.finish(ctx, W, H_); P.caption(ctx, W, H_, P.captionAt(CHUNKS, t)); }
  const BEATS = [{ t: 0, name: 'hook' }, { t: SEQ[1].t, name: 'nope' }, { t: SEQ[2].t, name: 'ache' }, { t: SEQ[3].t, name: 'again' }, { t: wt('repeated'), name: 'repeated bout' }, { t: wt('still'), name: 'still grows' }, { t: SEQ[4].t, name: 'tension' }, { t: SEQ[5].t, name: 'finale' }];
  window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };

  function scoreSound(k) {
    k.play('riser', 0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
    k.play('blip', wt('does') - 0.2, { f: 'E6' }); k.play('blip', wt('does'), { f: 'A6' }); k.play('pop', wt('workout') - 0.2, { f: 700 });
    SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
    k.play('stamp', wt('nope') - 0.1, { gain: 0.7 }); k.play('pop', wt('soreness') - 0.2, { f: 620 }); k.play('stamp', wt('terrible') - 0.1, { gain: 0.8 }); k.play('error', wt('terrible'), { gain: 0.5 });
    k.play('paper', wt('one') - 0.1, { dur: 0.4 }); k.play('glitch', wt('damage') - 0.2, { gain: 0.5 }); k.play('impact', wt('damage'), { gain: 0.4 }); k.play('buzz', wt('swelling'), { dur: 0.4, f: 130, gain: 0.4, minor: true });
    for (let i = 0; i < 4; i++) k.play('tock', wt('again') + i * 0.55, { f: 520 + i * 90 });
    k.play('pop', wt('repeated') - 0.2, { f: 800 }); k.play('riser', wt('still') - 0.3, { dur: 0.7, gain: 0.5 }); k.play('ding', wt('grows'), { f: 'G6' });
    for (let x = L(6); x < L(7) - 0.3; x += 3.49) k.play('thud', x + 1.7, { gain: 0.4 });
    ['tension', 'failure'].forEach((w, i) => k.play('pop', wt(w) - 0.2, { f: 600 + i * 120 }));
    for (let x = wt('more') - 0.2; x < wt('more') + 0.6; x += 0.08) k.play('count', x, { minor: true });
    k.play('stamp', wt('soreness', 2) - 0.1, { gain: 0.6 }); k.play('success', wt('progress')); k.play('sparkle', wt('progress') + 0.2, { n: 10 });
  }
  window.scoreSound = scoreSound;
