// 002 — Muscle memory: extra nuclei stay after you stop training (Bruusgaard et al. PNAS 2010, mice; Staron 1991 women)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const SCRIPT = P.reelScript();
  const WORDS = P.mergeWords(P.words(SCRIPT), [['seven months', '7 months'], ['six weeks.', '6 weeks.'], ['six weeks', '6 weeks']]);
  const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
  const wt = (k, n) => P.wt(WORDS, k, n);
  const L = (i) => SCRIPT[i][1][0][0];
  const DURATION = +((window.TIMING && window.TIMING.duration) || WORDS[WORDS.length - 1].end + 1.4).toFixed(2);
  const blink = (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0);
  let CUR = 0;

  // A: hook — big lifter shrinks as the months flip by
  function hook(ctx, t) {
    P.gym(ctx, W, H_, t);
    const sh = P.ramp(t, wt('shrink') - 0.3, wt('shrink') + 0.5);
    ctx.save(); P.push(ctx, W, H_, t, W / 2, H_ * 0.6, 0.03);
    P.lifter(ctx, W / 2, H_ * 0.85, 1.4, { arms: 'flex', arms2: 'down', mix: sh, bulk: 1 - sh, smile: sh < 0.5, wince: sh * 0.4, shock: P.ramp(t, wt('game') - 0.2, wt('game')), blink: blink(t) });
    ctx.restore();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'], mk = P.ramp(t, wt('months') - 0.6, wt('shrink') + 0.4) * (months.length - 1), mi = Math.floor(mk);
    P.calendar(ctx, W - 130, 410, 0.9, months[mi], months[Math.min(mi + 1, 5)], mk - mi);
    P.title(ctx, ['Months Off', 'The Gym?'], W / 2, 150, 1, { size: 70 });
    P.counter(ctx, 'GAME OVER?', W / 2, 520, 78, P.pop(t, wt('game') - 0.15, 0.4), PAL.red);
  }
  // B: muscle memory — a brain inside a muscle
  function memory(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, '#ffffff', 2, 0.05);
    ctx.save(); P.push(ctx, W, H_, t - L(1), W / 2, H_ * 0.45, 0.03);
    P.fiber(ctx, 60, H_ * 0.5, 600, 120, -0.15, { color: '#ff4a5c', seed: 3, slide: t * 8 });
    const kb = P.pop(t, wt('memory') - 0.3, 0.5);
    if (kb > 0) { ctx.save(); ctx.translate(W / 2, H_ * 0.45); const s = H.ease.back(kb); ctx.scale(s, s); P.glow(ctx, 0, 0, 200, PAL.yellow, 0.4); P.brain(ctx, 0, 0, 95); ctx.restore(); P.sparkles(ctx, W / 2, H_ * 0.45, 170, t, kb, 2); }
    ctx.restore();
    P.title(ctx, ['Muscle', 'MEMORY'], W / 2, 170, P.pop(t, wt('memory') - 0.2, 0.6), { size: 74, color: PAL.mint });
  }
  // C-E: one fibre — nuclei arrive, stem cells fuse, it shrinks, the nuclei stay, it regrows
  function fiber(ctx, t) {
    P.bg(ctx, W, H_, 'deep', t); P.bgCells(ctx, W, H_, t, PAL.pink, 3, 0.05);
    const grow = P.ramp(t, wt('fuse') - 0.2, wt('nuclei', 1) + 0.6), shrink = P.ramp(t, wt('shrinks') - 0.4, wt('shrinks') + 0.6), back = P.ramp(t, wt('back') - 0.3, wt('there') + 0.3);
    const r = 70 + grow * 30 - shrink * 45 + back * 52;
    const x = 60, y = H_ * 0.47, len = 600, ang = -0.1;
    ctx.save(); P.push(ctx, W, H_, t - L(2), W / 2, y, 0.012);
    P.fiber(ctx, x, y, len, r, ang, { color: shrink > 0.5 && back < 0.5 ? '#d8305e' : '#ff4a5c', seed: 7, slide: t * 8 });
    const n = 4 + Math.round(4 * P.ramp(t, wt('hand') - 0.2, wt('nuclei', 1) + 0.3));
    P.nuclei(ctx, x, y, len, Math.max(r, 70), ang, n, P.pop(t, wt('nuclei') - 0.3, 1.0), t, 1);
    // stem cells swim in and fuse
    [[-120, 260], [W + 120, 1000], [W / 2, -140], [-100, 900]].forEach(([sx, sy], i) => {
      const a = P.ramp(t, wt('stem') - 0.3 + i * 0.12, wt('fuse') + 0.2 + i * 0.12), f = P.ramp(t, wt('hand') - 0.2 + i * 0.12, wt('hand') + 0.6 + i * 0.12);
      if (a <= 0 || f >= 1) return; const tx = x + len * (0.25 + i * 0.17), ty = y + len * (0.25 + i * 0.17) * Math.sin(ang);
      P.cellStar(ctx, P.lerp(sx, tx, a), P.lerp(sy, ty - r - 40, a) + f * (r + 40), 50 * (1 - f * 0.85), t + i, { rot: i, color: PAL.sky });
    });
    if (back > 0) P.sparkles(ctx, W / 2, y, 280, t, back, 5);
    if (shrink > 0.3 && back < 0.2) P.zap(ctx, W / 2, y, r + 40, t, 6, 3);
    ctx.restore();
    const kN = P.pop(t, wt('nuclei') - 0.2) * (1 - P.pop(t, wt('stem') - 0.3)), kS = P.pop(t, wt('stem') - 0.2) * (1 - P.pop(t, wt('quit') - 0.3));
    P.label(ctx, 'Nuclei', W / 2, 190, kN, { color: PAL.grape, sub: 'control centers' });
    P.label(ctx, 'Stem Cells', W / 2, 190, kS, { color: PAL.blue });
    P.label(ctx, 'Nuclei STAY', W / 2, 190, P.pop(t, wt('stayed') - 0.2) * (1 - P.pop(t, wt('back') - 0.3)), { color: PAL.grape, sub: 'in mouse studies' });
    P.label(ctx, 'Builders ready', W / 2, 190, P.pop(t, wt('builders') - 0.2), { color: PAL.green });
    // months flip while the nuclei wait
    const km = P.pop(t, wt('months', 1) - 0.3, 0.4) * (1 - P.pop(t, wt('back') - 0.2, 0.3));
    if (km > 0) { ctx.save(); ctx.translate(W / 2, 780); ctx.scale(km, km); P.calendar(ctx, 0, 0, 0.9, 'JUN', 'DEC', P.ramp(t, wt('months', 1), wt('months', 1) + 0.6)); ctx.restore(); }
  }
  // F: the study — strength bar falls over 7 months, refills in 6 weeks
  function study(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, '#ffffff', 4, 0.05);
    const lost = P.ramp(t, wt('lost') - 0.2, wt('lost') + 0.9), got = P.ramp(t, wt('got') - 0.1, wt('six') + 0.8);
    const k = 0.92 - lost * 0.55 + got * 0.55;
    P.meter(ctx, W / 2, 840, 170, 480, k, got > 0.5 ? PAL.mint : PAL.orange, 'Strength');
    P.counter(ctx, '7 months off', W / 2, 200, 72, P.pop(t, wt('seven') - 0.15, 0.4) * (1 - P.pop(t, wt('got') - 0.2, 0.2)), PAL.orange);
    P.counter(ctx, '6 weeks back', W / 2, 200, 72, P.pop(t, wt('six') - 0.15, 0.4), PAL.mint);
    if (got > 0.6) P.sparkles(ctx, W / 2, 500, 200, t, got, 7);
    P.lifter(ctx, 140, 1010, 0.55, { arms: got > 0.5 ? 'flex' : 'down', bulk: got, wince: lost * (1 - got), smile: got > 0.5, blink: blink(t, 2) });
  }
  // G: finale — back in the gym, growing again
  function finale(ctx, t) {
    P.gym(ctx, W, H_, t);
    const fk = P.ramp(t, wt('back', 1) - 0.2, wt('back', 1) + 1.2), rep = 0.5 - 0.5 * Math.cos(t * 2.4);
    ctx.save(); P.push(ctx, W, H_, t - L(9), W / 2, H_ * 0.6, 0.02);
    P.lifter(ctx, W / 2, H_ * 0.85, 1.4, { squat: (1 - fk) * rep, arms: 'bar', bar: fk < 0.5, arms2: 'flex', mix: fk, bulk: 0.2 + fk * 0.8, smile: true, blink: blink(t, 3) });
    P.sparkles(ctx, W / 2, H_ * 0.55, 240, t, fk, 9);
    ctx.restore();
    P.title(ctx, ['Come Back', 'Stronger!'], W / 2, 170, P.pop(t, wt('come', 1) - 0.2, 0.7), { size: 74, color: PAL.mint });
    P.confetti(ctx, W, H_, t, wt('back', 1), 4);
  }

  const SEQ = [
    { t: 0, draw: (c) => hook(c, CUR) },
    { t: L(1) - 0.15, draw: (c) => memory(c, CUR), tr: 'slide' },
    { t: L(2) - 0.3, draw: (c) => fiber(c, CUR), tr: 'zoom', focus: [W / 2, H_ * 0.45] },
    { t: L(7) - 0.2, draw: (c) => study(c, CUR), tr: 'slide' },
    { t: L(9) - 0.2, draw: (c) => finale(c, CUR), tr: 'slide' },
  ];
  function explainer(ctx, W_, H2, t) { CUR = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore(); P.finish(ctx, W, H_); P.caption(ctx, W, H_, P.captionAt(CHUNKS, t)); }
  const BEATS = [{ t: 0, name: 'hook' }, { t: SEQ[1].t, name: 'memory' }, { t: SEQ[2].t, name: 'nuclei' }, { t: wt('stem'), name: 'stem cells' }, { t: wt('quit'), name: 'quit' }, { t: wt('months', 1), name: 'wait' }, { t: wt('back'), name: 'regrow' }, { t: SEQ[3].t, name: 'study' }, { t: wt('got'), name: '6 weeks' }, { t: SEQ[4].t, name: 'finale' }];
  window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };

  function scoreSound(k) {
    k.play('riser', 0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
    for (let x = wt('months') - 0.6; x < wt('shrink') + 0.4; x += 0.35) k.play('paper', x, { dur: 0.15, gain: 0.5, minor: true });
    k.play('hurt', wt('shrink'), { gain: 0.5 }); k.play('error', wt('game') - 0.1, { gain: 0.6 });
    SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
    k.play('sparkle', wt('memory'), { n: 6 }); k.play('pop', wt('memory') - 0.2, { f: 820 });
    k.play('pop', wt('nuclei') - 0.2, { f: 600 }); for (let i = 0; i < 4; i++) k.play('blip', wt('nuclei') + i * 0.2, { f: ['C6', 'D6', 'E6', 'G6'][i], minor: true });
    k.play('pop', wt('stem') - 0.2, { f: 660 }); for (let i = 0; i < 4; i++) k.play('tock', wt('hand') + i * 0.15, { f: 500 + i * 80, minor: true });
    k.play('buzz', wt('shrinks'), { dur: 0.4, f: 120, gain: 0.5 }); k.play('ding', wt('stayed'), { f: 'E6' });
    k.play('paper', wt('months', 1), { dur: 0.4 }); k.play('riser', wt('back') - 0.4, { dur: 0.8, gain: 0.5 }); k.play('sparkle', wt('builders'), { n: 8 });
    k.play('pop', wt('seven') - 0.15, { f: 700 }); k.play('thud', wt('lost'), { gain: 0.6 });
    k.play('powerup', wt('got'), { gain: 0.8 }); k.play('pop', wt('six') - 0.15, { f: 880 }); k.play('success', wt('six') + 0.5);
    k.play('success', wt('back', 1)); k.play('sparkle', wt('back', 1) + 0.2, { n: 10 });
  }
  window.scoreSound = scoreSound;
