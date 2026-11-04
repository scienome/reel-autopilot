// 006 — Muscle Building, Part 1: how a muscle actually grows (Schoenfeld 2010; MacDougall 1995; Phillips 1997)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const SCRIPT = P.reelScript();
  const WORDS = P.mergeWords(P.words(SCRIPT), [['em tor', 'mTOR']]);
  const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
  const wt = (k, n) => P.wt(WORDS, k, n);
  const L = (i) => SCRIPT[i][1][0][0];
  const DURATION = +((window.TIMING && window.TIMING.duration) || WORDS[WORDS.length - 1].end + 1.4).toFixed(2);
  const blink = (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0);
  let CUR = 0;

  // A: hook — lifter pressing, "lifting doesn't build muscle" with a cross, then the series card
  function hook(ctx, t) {
    P.gym(ctx, W, H_, t);
    const rep = 0.5 - 0.5 * Math.cos(t * 3);
    ctx.save(); P.push(ctx, W, H_, t, W / 2, H_ * 0.6, 0.03);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.35, { arms: 'bar', arms2: 'press', mix: rep, bar: true, wince: 0.5, blink: blink(t) });
    ctx.restore();
    P.title(ctx, ['Lifting ≠', 'MUSCLE?'], W / 2, 160, 1, { size: 76 });
    P.stampX(ctx, W / 2, 175, 120, P.pop(t, wt("doesn't") - 0.1, 0.25));
    P.label(ctx, 'Muscle Building · Part 1', W / 2, 340, P.pop(t, L(1) - 0.2, 0.4) > 0 ? 1 : 1, { color: PAL.magenta, size: 28 });
  }
  // B: tension — a fibre stretched hard, zaps, TENSION label, signal bubble
  function tension(ctx, t) {
    P.bg(ctx, W, H_, 'plum', t); P.bgCells(ctx, W, H_, t, PAL.pink, 3, 0.05);
    const pull = 0.5 + 0.5 * Math.sin(t * 5), cy = 560;
    ctx.save(); P.push(ctx, W, H_, t - L(2), W / 2, cy, 0.02);
    P.fiber(ctx, 60 - pull * 14, cy, 600 + pull * 28, 70, 0, { color: '#ff4a5c', seed: 6, slide: t * 10 });
    P.zap(ctx, W / 2, cy, 280, t, 3, 5);
    for (const sd of [-1, 1]) P.arrowFlat(ctx, W / 2 + sd * 300, cy, W / 2 + sd * 350, cy, 1, PAL.yellow);
    ctx.restore();
    P.title(ctx, ['TENSION'], W / 2, 220, P.pop(t, wt('tension') - 0.3, 0.5), { size: 86, color: PAL.yellow });
    P.bubble(ctx, 'We need to be BIGGER!', W / 2, 820, P.pop(t, wt('signal') - 0.2, 0.4), { color: PAL.blue });
  }
  // C: the switch — inside the fibre, an mTOR lever flips on and lights the cell
  function switchOn(ctx, t) {
    P.bg(ctx, W, H_, 'deep', t); P.bgCells(ctx, W, H_, t, PAL.cyan, 4, 0.05);
    const on = P.ramp(t, wt('turns') - 0.2, wt('on') + 0.2), cx = W / 2, cy = 560;
    P.glow(ctx, cx, cy, 420, PAL.mint, 0.5 * on);
    P.flat(ctx, P.rr(cx - 150, cy - 230, 300, 460, 60), '#e8ecff', { off: 10 });
    P.fill(ctx, P.rr(cx - 40, cy - 170, 80, 340, 40), on > 0.5 ? PAL.mint : '#9aa3c8');
    const ky = P.lerp(cy + 110, cy - 110, on);
    P.flat(ctx, P.circ(cx, ky, 62), on > 0.5 ? PAL.yellow : PAL.steel, { off: 8 });
    P.counter(ctx, on > 0.5 ? 'ON' : 'OFF', cx, cy + 320, 90, P.pop(t, L(4), 0.3), on > 0.5 ? PAL.mint : PAL.red);
    P.label(ctx, 'Growth switch: mTOR', W / 2, 190, P.pop(t, wt('growth') - 0.2), { color: PAL.mint, size: 34 });
    P.sparkles(ctx, cx, cy, 260, t, on, 4);
  }
  // D: build vs break meters; then the 24-hour clock with "2x"
  function balance(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, '#ffffff', 5, 0.05);
    const kb = P.ramp(t, wt('builds') - 0.2, wt('faster') + 0.4), late = P.pop(t, L(6) - 0.2, 0.4);
    P.meter(ctx, 230, 780, 150, 440, 0.35 + 0.55 * kb, PAL.mint, 'Build');
    P.meter(ctx, 490, 780, 150, 440, 0.4, PAL.red, 'Break');
    P.title(ctx, ['BUILD > BREAK'], W / 2, 200, P.pop(t, wt('faster') - 0.1, 0.5) * (1 - late), { size: 62, color: PAL.mint });
    if (late > 0) { P.fill(ctx, P.rr(60, 90, 600, 220, 30), 'rgba(12,6,64,0.85)'); P.counter(ctx, '24 h later', W / 2, 155, 64, late, PAL.cyan); P.counter(ctx, '≈ 2×', W / 2, 250, 84, P.pop(t, wt('twice') - 0.2, 0.4), PAL.yellow); }
  }
  // E: growth happens at rest — bed, moon, food, lifter gets bigger
  function rest(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, '#ffffff', 2, 0.04);
    P.moon(ctx, 560, 230, 70);
    const ke = P.pop(t, wt('eat') - 0.2, 0.4), ks = P.pop(t, wt('sleep') - 0.2, 0.4), grow = P.ramp(t, L(7), L(8) + 1.5);
    if (ke > 0) { ctx.save(); ctx.globalAlpha = ke; P.drumstick(ctx, 150, 420, 60); P.egg(ctx, 260, 450, 38); ctx.restore(); }
    if (ks > 0) P.counter(ctx, 'Zzz', 560, 380, 70, ks, PAL.blue);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.25, { arms: 'flex', bulk: 0.2 + 0.7 * grow, smile: true, blink: blink(t, 2) });
    P.label(ctx, 'Growth happens AFTER the gym', W / 2, 140, P.pop(t, wt('growth', 1) - 0.2) * (1 - P.pop(t, L(8) - 0.2)), { color: PAL.amber, size: 28 });
    ['Train hard', 'Eat protein', 'Sleep', 'Repeat'].forEach((s, i) => P.label(ctx, s, W / 2, 140 + i * 0, P.pop(t, [wt('train'), wt('eat', 1), wt('sleep', 1), wt('repeat')][i] - 0.2) * (1 - P.pop(t, [wt('eat', 1), wt('sleep', 1), wt('repeat'), L(9) - 0.2][i] - 0.2)), { color: [PAL.red, PAL.amber, PAL.blue, PAL.mint][i], size: 40 }));
    P.title(ctx, ['Next:', 'HOW MUCH PROTEIN?'], W / 2, 170, P.pop(t, L(9) + 0.05, 0.6), { size: 58, color: PAL.mint });
  }

  const SEQ = [
    { t: 0, draw: (c) => hook(c, CUR) },
    { t: L(2) - 0.2, draw: (c) => tension(c, CUR), tr: 'zoom', focus: [W / 2, H_ * 0.5] },
    { t: L(4) - 0.3, draw: (c) => switchOn(c, CUR), tr: 'zoom', focus: [W / 2, 560] },
    { t: L(5) - 0.2, draw: (c) => balance(c, CUR), tr: 'slide' },
    { t: L(7) - 0.2, draw: (c) => rest(c, CUR), tr: 'slide' },
  ];
  function explainer(ctx, W_, H2, t) { CUR = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore(); P.finish(ctx, W, H_); P.caption(ctx, W, H_, P.captionAt(CHUNKS, t)); }
  const BEATS = [{ t: 0, name: 'hook' }, { t: SEQ[1].t, name: 'tension' }, { t: wt('signal'), name: 'signal' }, { t: SEQ[2].t, name: 'mTOR' }, { t: SEQ[3].t, name: 'build' }, { t: wt('twice'), name: '2x' }, { t: SEQ[4].t, name: 'rest' }, { t: wt('repeat'), name: 'repeat' }, { t: L(9), name: 'next' }];
  window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };

  function scoreSound(k) {
    k.play('riser', 0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
    for (let x = 0.4; x < L(1); x += 1.05) k.play('thud', x, { gain: 0.3, minor: true });
    k.play('stamp', wt("doesn't"), { gain: 0.7 }); k.play('error', wt("doesn't") + 0.1, { gain: 0.4 }); k.play('ding', L(1), { f: 'C6' });
    SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
    k.play('buzz', wt('tension'), { dur: 0.6, f: 120, gain: 0.4 }); k.play('pop', wt('signal') - 0.1, { f: 820 });
    k.play('tock', wt('turns'), { f: 520 }); k.play('powerup', wt('on'), { gain: 0.7 }); k.play('sparkle', wt('on') + 0.2, { n: 8 });
    k.play('blip', wt('builds'), { f: 'C6' }); k.play('blip', wt('faster'), { f: 'G6' }); k.play('ding', wt('twice'), { f: 'E6' });
    k.play('swish', wt('eat'), { dur: 0.3 }); k.play('sparkle', wt('sleep'), { n: 5 });
    ['train', 'repeat'].forEach((w) => k.play('pop', wt(w) - 0.1, { f: 700 })); k.play('success', L(9)); k.play('sparkle', L(9) + 0.3, { n: 10 });
  }
  window.scoreSound = scoreSound;
