// 008 — Supplement Series, Part 1: what creatine does (Kreider 2017 ISSN; Antonio 2021; Wallimann 2011)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const SCRIPT = P.reelScript();
  const WORDS = P.mergeWords(P.words(SCRIPT), [['a t p', 'ATP'], ['twenty to forty percent', '20-40%'], ['three to five grams', '3-5 g']]);
  const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
  const wt = (k, n) => P.wt(WORDS, k, n);
  const L = (i) => SCRIPT[i][1][0][0];
  const DURATION = +((window.TIMING && window.TIMING.duration) || WORDS[WORDS.length - 1].end + 1.4).toFixed(2);
  const blink = (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0);
  let CUR = 0;

  // A: hook — a shaker with a white powder scoop, question marks, series tag
  function hook(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, '#ffffff', 5, 0.05);
    const bob = Math.sin(t * 3) * 10;
    ctx.save(); ctx.translate(W / 2, 700 + bob); ctx.rotate(Math.sin(t * 2) * 0.08); P.glow(ctx, 0, 0, 260, PAL.cyan, 0.4); P.shaker(ctx, 0, 0, 3.2); ctx.restore();
    for (let i = 0; i < 14; i++) { const a = i * 2.4 + t * 0.6, r = 230 + (i % 3) * 30; P.fill(ctx, P.rr(W / 2 + Math.cos(a) * r - 7, 700 + Math.sin(a) * r * 0.6 - 7, 14, 14, 4), '#ffffff'); }
    P.title(ctx, ['CREATINE'], W / 2, 170, 1, { size: 90, color: PAL.cyan });
    P.label(ctx, 'Supplement Series · Part 1', W / 2, 290, 1, { color: PAL.magenta, size: 28 });
    P.qmarks(ctx, W / 2, 470, t, P.pop(t, wt('actually') - 0.2, 0.4));
  }
  // B: ATP — the battery that drains in seconds during a hard set
  function atp(ctx, t) {
    P.bg(ctx, W, H_, 'deep', t); P.bgCells(ctx, W, H_, t, PAL.cyan, 4, 0.05);
    const drain = P.ramp(t, wt('burn') - 0.2, wt('seconds') + 0.4), refill = P.ramp(t, wt('rebuild') - 0.2, wt('fast') + 0.5);
    const lvl = Math.max(0.05, 1 - drain * 0.92 + refill * 0.9);
    P.battery(ctx, W / 2, 560, 2.2, lvl, lvl < 0.3 ? PAL.red : PAL.mint);
    P.label(ctx, 'ATP = fast energy', W / 2, 190, P.pop(t, wt('energy') - 0.2) * (1 - drain), { color: PAL.mint, size: 36 });
    P.counter(ctx, P.countTo(t, wt('burn') - 0.2, wt('seconds') + 0.4, 10, 0) + ' s', W / 2, 860, 100, P.pop(t, wt('burn') - 0.2) * (1 - refill), PAL.red);
    const kc = P.pop(t, wt('creatine', 1) - 0.2, 0.4);
    if (kc > 0) { P.molecule(ctx, 170, 820, 1.4, 'co2', t, kc); P.flow(ctx, 210, 800, W / 2 - 80, 600, t, kc, PAL.cyan, 8); P.label(ctx, 'Creatine refills it', W / 2, 190, kc, { color: PAL.cyan, size: 36 }); }
    P.sparkles(ctx, W / 2, 560, 220, t, refill, 3);
  }
  // C: stores rise 20-40%, then the extra reps
  function stores(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, '#ffffff', 5, 0.05);
    const up = P.ramp(t, wt('raise') - 0.2, wt('twenty') + 1.2), reps = P.pop(t, L(6) - 0.2, 0.4);
    if (reps < 1) { ctx.save(); ctx.globalAlpha = 1 - reps; P.meter(ctx, 230, 800, 150, 460, 0.6, PAL.steel || '#9aa3c8', 'Before'); P.meter(ctx, 490, 800, 150, 460, 0.6 * (1 + 0.3 * up), PAL.cyan, 'After'); P.counter(ctx, '+20-40%', W / 2, 220, 84, P.pop(t, wt('twenty') - 0.2, 0.4), PAL.yellow); ctx.restore(); }
    if (reps > 0) {
      const rep = 0.5 - 0.5 * Math.cos(t * 3);
      ctx.save(); ctx.globalAlpha = reps; P.lifter(ctx, W / 2, H_ * 0.86, 1.3, { arms: 'bar', arms2: 'press', mix: rep, bar: true, wince: 0.6, blink: blink(t) }); ctx.restore();
      P.counter(ctx, '+1 rep', W / 2, 200, 90, P.pop(t, wt('extra') - 0.2, 0.4) * (1 - P.pop(t, wt('two') - 0.1, 0.2)), PAL.mint);
      P.counter(ctx, '+2 reps', W / 2, 200, 90, P.pop(t, wt('two') - 0.1, 0.3) * (1 - P.pop(t, wt('months') - 0.2, 0.3)), PAL.mint);
      P.label(ctx, 'Months later: more strength', W / 2, 200, P.pop(t, wt('months') - 0.2), { color: PAL.amber, size: 32 });
    }
  }
  // D: the dose — calendar + scoop
  function dose(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, '#ffffff', 2, 0.05);
    P.shaker(ctx, 220, 640, 2.2);
    P.counter(ctx, '3-5 g', 470, 560, 110, P.pop(t, wt('three') - 0.2, 0.4), PAL.cyan);
    P.counter(ctx, 'per day', 470, 680, 60, P.pop(t, wt('day') - 0.2, 0.4), PAL.white || '#ffffff');
    P.label(ctx, 'Most-studied supplement', W / 2, 190, P.pop(t, wt('studied') - 0.2), { color: PAL.mint, size: 32 });
    P.bubble(ctx, 'Kidney problems? Ask a doctor first', W / 2, 1090, P.pop(t, wt('kidney') - 0.2, 0.4), { color: PAL.red });
  }
  // E: finale — next: protein powder
  function finale(ctx, t) {
    P.gym(ctx, W, H_, t);
    P.lifter(ctx, W / 2 - 100, H_ * 0.86, 1.2, { arms: 'flex', bulk: 0.6, smile: true, blink: blink(t, 3) });
    P.shaker(ctx, W / 2 + 190, H_ * 0.62, 2);
    P.title(ctx, ['Next:', 'PROTEIN POWDER?'], W / 2, 190, P.pop(t, L(9) - 0.1, 0.6), { size: 62, color: PAL.mint });
  }

  const SEQ = [
    { t: 0, draw: (c) => hook(c, CUR) },
    { t: L(2) - 0.2, draw: (c) => atp(c, CUR), tr: 'zoom', focus: [W / 2, 700] },
    { t: L(5) - 0.2, draw: (c) => stores(c, CUR), tr: 'slide' },
    { t: L(7) - 0.2, draw: (c) => dose(c, CUR), tr: 'slide' },
    { t: L(9) - 0.2, draw: (c) => finale(c, CUR), tr: 'slide' },
  ];
  function explainer(ctx, W_, H2, t) { CUR = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore(); P.finish(ctx, W, H_); P.caption(ctx, W, H_, P.captionAt(CHUNKS, t)); }
  const BEATS = [{ t: 0, name: 'hook' }, { t: SEQ[1].t, name: 'ATP' }, { t: wt('seconds'), name: 'drain' }, { t: wt('rebuild'), name: 'refill' }, { t: SEQ[2].t, name: 'stores' }, { t: L(6), name: 'reps' }, { t: SEQ[3].t, name: 'dose' }, { t: wt('kidney'), name: 'kidney' }, { t: SEQ[4].t, name: 'next' }];
  window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };

  function scoreSound(k) {
    k.play('riser', 0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
    for (let x = 0.3; x < L(1); x += 0.5) k.play('tock', x, { f: 400 + (x * 50 % 120), gain: 0.2, minor: true });
    SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
    k.play('blip', wt('energy'), { f: 'C6' }); for (let x = wt('burn') - 0.2; x < wt('seconds') + 0.4; x += 0.12) k.play('count', x, { minor: true });
    k.play('error', wt('seconds') + 0.2, { gain: 0.4 }); k.play('powerup', wt('rebuild'), { gain: 0.7 }); k.play('sparkle', wt('fast'), { n: 8 });
    k.play('ding', wt('twenty'), { f: 'E6' }); k.play('pop', wt('extra') - 0.1, { f: 760 }); k.play('pop', wt('two') - 0.1, { f: 880 });
    k.play('ding', wt('three'), { f: 'G6' }); k.play('stamp', wt('kidney'), { gain: 0.4 });
    k.play('success', L(9)); k.play('sparkle', L(9) + 0.3, { n: 10 });
  }
  window.scoreSound = scoreSound;
