// 007 — Exercise Series, Part 1: the squat — muscles worked and the knees-past-toes myth (Fry 2003; Schoenfeld 2010; Clark 2012)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const SCRIPT = P.reelScript();
  const WORDS = P.words(SCRIPT);
  const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
  const wt = (k, n) => P.wt(WORDS, k, n);
  const L = (i) => SCRIPT[i][1][0][0];
  const DURATION = +((window.TIMING && window.TIMING.duration) || WORDS[WORDS.length - 1].end + 1.4).toFixed(2);
  const blink = (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0);
  const sq = (t) => 0.5 - 0.5 * Math.cos(t * 2.4);
  let CUR = 0;

  // A: hook — lifter squatting with a bar, THE SQUAT + series tag
  function hook(ctx, t) {
    P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, t, W / 2, H_ * 0.6, 0.03);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.35, { arms: 'bar', squat: sq(t), bar: true, wince: 0.3 * sq(t), blink: blink(t) });
    ctx.restore();
    P.title(ctx, ['THE SQUAT'], W / 2, 170, 1, { size: 86 });
    P.label(ctx, 'Exercise Series · Part 1', W / 2, 290, 1, { color: PAL.magenta, size: 28 });
  }
  // B: the muscles — glowing zones on a front-view lifter, labels pop on each word
  function muscles(ctx, t) {
    P.bg(ctx, W, H_, 'deep', t); P.bgCells(ctx, W, H_, t, PAL.cyan, 3, 0.05);
    const s = 1.6, x = W / 2, y = H_ * 0.9, s2 = sq(t) * 0.6;
    const pose = P.lifter(ctx, x, y, s, { arms: 'bar', squat: s2, bar: true, blink: blink(t, 1) });
    const kq = P.pop(t, wt('quads') - 0.2, 0.4), kg = P.pop(t, wt('glutes') - 0.2, 0.4), ka = P.pop(t, wt('adductors') - 0.3, 0.4);
    const hy = pose.hipY;
    for (const sd of [-1, 1]) {
      if (kq > 0) P.glow(ctx, x + sd * 62 * s * 0.85, hy + 70 * s * 0.5, 110 * kq, PAL.red, 0.75 * kq);
      if (ka > 0) P.glow(ctx, x + sd * 22 * s, hy + 50 * s * 0.5, 60 * ka, PAL.amber, 0.8 * ka);
    }
    if (kg > 0) P.glow(ctx, x, hy - 10, 170 * kg, PAL.magenta, 0.55 * kg);
    P.label(ctx, 'QUADS: straighten knees', W / 2, 170, kq * (1 - kg), { color: PAL.red, size: 32 });
    P.label(ctx, 'GLUTES: drive hips up', W / 2, 170, kg * (1 - ka), { color: PAL.magenta, size: 32 });
    P.label(ctx, 'ADDUCTORS: inner thighs', W / 2, 170, ka, { color: PAL.amber, size: 32 });
  }
  // C: the myth — wanted-poster style rule, then the study
  function myth(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, '#ffffff', 2, 0.05);
    const km = P.pop(t, wt('myth') - 0.3, 0.4), study = P.pop(t, L(6) - 0.2, 0.4);
    P.title(ctx, ['THE BIG', 'MYTH'], W / 2, 170, km * (1 - study), { size: 76, color: PAL.red });
    P.bubble(ctx, 'NEVER let knees pass toes!', W / 2, 420, P.pop(t, wt('never') - 0.2, 0.4) * (1 - study), { color: PAL.red });
    if (study > 0) {
      P.label(ctx, 'The study: knees held back', W / 2, 170, study, { color: PAL.blue, size: 30 });
      const up = P.ramp(t, wt('shot') - 0.3, wt('up', 1) + 0.6);
      P.meter(ctx, 230, 800, 150, 460, 0.08 + 0.85 * up, PAL.red, 'Hip strain');
      P.meter(ctx, 490, 800, 150, 460, 0.45 * (1 - 0.22 * up), PAL.cyan, 'Knee strain');
      P.counter(ctx, '+' + P.countTo(t, wt('shot') - 0.3, wt('up', 1) + 0.6, 0, 1070) + '%', 230, 280, 56, P.pop(t, wt('shot') - 0.3), PAL.yellow);
      P.counter(ctx, '-22%', 490, 280, 56, P.pop(t, wt('up', 1), 0.4), PAL.cyan);
    }
  }
  // D: finale — knees past toes is fine; checklist; next: deadlift
  function finale(ctx, t) {
    P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, t - L(8), W / 2, H_ * 0.6, 0.02);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.3, { arms: 'bar', squat: sq(t), bar: true, smile: true, blink: blink(t, 3) });
    ctx.restore();
    const end = P.pop(t, L(9) - 0.2, 0.4);
    P.label(ctx, 'Knees past toes: FINE ✓', W / 2, 150, P.pop(t, wt('fine') - 0.2) * (1 - end), { color: PAL.mint, size: 34 });
    P.label(ctx, 'Heels down ✓', W / 2, 240, P.pop(t, wt('heels') - 0.2) * (1 - end), { color: PAL.amber, size: 30 });
    P.label(ctx, 'Knees in line with toes ✓', W / 2, 320, P.pop(t, wt('line') - 0.2) * (1 - end), { color: PAL.blue, size: 30 });
    P.title(ctx, ['Next:', 'THE DEADLIFT'], W / 2, 190, end, { size: 70, color: PAL.mint });
  }

  const SEQ = [
    { t: 0, draw: (c) => hook(c, CUR) },
    { t: L(2) - 0.2, draw: (c) => muscles(c, CUR), tr: 'zoom', focus: [W / 2, H_ * 0.7] },
    { t: L(5) - 0.2, draw: (c) => myth(c, CUR), tr: 'slide' },
    { t: L(8) - 0.2, draw: (c) => finale(c, CUR), tr: 'slide' },
  ];
  function explainer(ctx, W_, H2, t) { CUR = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore(); P.finish(ctx, W, H_); P.caption(ctx, W, H_, P.captionAt(CHUNKS, t)); }
  const BEATS = [{ t: 0, name: 'hook' }, { t: SEQ[1].t, name: 'quads' }, { t: wt('glutes'), name: 'glutes' }, { t: wt('adductors'), name: 'adductors' }, { t: SEQ[2].t, name: 'myth' }, { t: L(6), name: 'study' }, { t: wt('shot'), name: 'hip strain' }, { t: SEQ[3].t, name: 'fine' }, { t: L(9), name: 'next' }];
  window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };

  function scoreSound(k) {
    k.play('riser', 0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
    for (let x = 0.6; x < L(2); x += 2.6) k.play('thud', x, { gain: 0.35, minor: true });
    SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
    ['quads', 'glutes', 'adductors'].forEach((w, i) => k.play('blip', wt(w) - 0.2, { f: ['C6', 'E6', 'G6'][i] }));
    k.play('error', wt('myth'), { gain: 0.5 }); k.play('stamp', wt('never'), { gain: 0.5 });
    k.play('paper', L(6), { dur: 0.3 }); for (let x = wt('shot') - 0.3; x < wt('up', 1) + 0.6; x += 0.1) k.play('count', x, { minor: true });
    k.play('buzz', wt('up', 1) + 0.2, { dur: 0.5, f: 130, gain: 0.4 });
    k.play('ding', wt('fine'), { f: 'E6' }); k.play('pop', wt('heels') - 0.1, { f: 700 }); k.play('pop', wt('line') - 0.1, { f: 820 });
    k.play('success', L(9)); k.play('sparkle', L(9) + 0.3, { n: 10 });
  }
  window.scoreSound = scoreSound;
