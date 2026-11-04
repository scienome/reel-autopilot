// 005 — Why does this happen? #1: why the last rep shakes (Henneman 1957 size principle; Enoka & Duchateau 2008; Lippold 1981)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const SCRIPT = P.reelScript();
  const WORDS = P.words(SCRIPT);
  const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
  const wt = (k, n) => P.wt(WORDS, k, n);
  const L = (i) => SCRIPT[i][1][0][0];
  const DURATION = +((window.TIMING && window.TIMING.duration) || WORDS[WORDS.length - 1].end + 1.4).toFixed(2);
  const blink = (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0);
  let CUR = 0;
  const tremble = (t, a) => [Math.sin(t * 61) * a + Math.sin(t * 37) * a * 0.6, Math.cos(t * 53) * a * 0.7];

  // A: hook — last rep of a curl, the arm trembling, big WHY
  function hook(ctx, t) {
    P.gym(ctx, W, H_, t);
    const rep = 0.55 - 0.45 * Math.cos(Math.min(t, 1.2) * 2.6), [dx, dy] = tremble(t, 5 + 3 * Math.sin(t * 2));
    ctx.save(); P.push(ctx, W, H_, t, W / 2, H_ * 0.6, 0.03); ctx.translate(dx, dy);
    const pose = P.lifter(ctx, W / 2, H_ * 0.86, 1.4, { arms: 'down', arms2: 'curl', mix: rep, wince: 0.8, blink: blink(t) });
    for (const h of pose.hands) { P.zap(ctx, h[0], h[1], 46, t, h[0], 3); P.sweat && P.sweat(ctx, h[0], h[1] - 120, t); }
    ctx.restore();
    P.title(ctx, ['Why The', 'SHAKE?'], W / 2, 160, 1, { size: 76 });
    P.label(ctx, 'Why Does This Happen? #1', W / 2, 330, 1, { color: PAL.magenta, size: 26 });
    P.qmarks(ctx, W / 2, 470, t, P.pop(t, wt('last') - 0.2, 0.4));
  }
  // B: it's your brain
  function brain(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, '#ffffff', 2, 0.05);
    P.stampX(ctx, W / 2, 330, 110, P.pop(t, wt('breaking') - 0.1, 0.25));
    P.label(ctx, 'Muscle breaking?', W / 2, 330, P.pop(t, wt('muscle', 0) - 0.2) * (1 - P.pop(t, wt('brain') - 0.2, 0.3)), { color: PAL.red });
    const kb = P.pop(t, wt('brain') - 0.25, 0.45);
    if (kb > 0) { ctx.save(); ctx.translate(W / 2, 640); const s = H.ease.back(kb) * 2.2; ctx.scale(s, s); P.glow(ctx, 0, 0, 120, PAL.pink, 0.5); P.brain(ctx, 0, 0, 80); ctx.restore(); P.zap(ctx, W / 2, 640, 260, t, 7, 6); }
    P.title(ctx, ["It's Your", 'BRAIN'], W / 2, 980, kb, { size: 70, color: PAL.pink });
  }
  // C: motor units — wires from the spine to groups of fibres; small, then big, then uneven; live force trace
  const UNITS = [{ y: 300, n: 1, r: 30, c: PAL.cyan, big: 0 }, { y: 390, n: 1, r: 30, c: PAL.cyan, big: 0 }, { y: 520, n: 2, r: 56, c: PAL.amber, big: 1 }, { y: 690, n: 2, r: 56, c: PAL.amber, big: 1 }];
  function units(ctx, t) {
    P.bg(ctx, W, H_, 'deep', t); P.bgCells(ctx, W, H_, t, PAL.cyan, 3, 0.05);
    const kIn = P.pop(t, L(2) - 0.1, 0.5), fresh = P.pop(t, wt('fresh') - 0.2, 0.4), bigOn = P.pop(t, wt('bigger') - 0.2, 0.4), uneven = P.pop(t, wt('unevenly') - 0.4, 0.4);
    // nerve trunk
    P.flat(ctx, P.rr(70, 260, 34, 520, 16), PAL.yellow, { off: 4 });
    UNITS.forEach((u, i) => {
      if (kIn <= 0) return;
      const on = u.big ? bigOn : fresh, flick = u.big ? 1 : (uneven > 0 ? (Math.sin(t * (13 + i * 7)) > 0.2 ? 1 : 0.25) : 1), lit = on * flick;
      ctx.save(); ctx.globalAlpha = kIn;
      P.flow(ctx, 104, u.y, 250, u.y, t, lit, u.c, 6);
      for (let j = 0; j < u.n; j++) {
        const fy = u.y - (u.n - 1) * u.r * 0.6 + j * u.r * 1.2;
        P.fiber(ctx, 260, fy, 400, u.r * 0.42, 0, { color: lit > 0.5 ? '#ff5a6c' : '#a8344a', seed: i * 4 + j });
        if (lit > 0.5) P.glow(ctx, 460, fy, 90, u.c, 0.25 * lit);
      }
      ctx.restore();
    });
    P.label(ctx, 'Motor units', W / 2, 180, P.pop(t, wt('motor') - 0.2) * (1 - fresh), { color: PAL.blue });
    P.label(ctx, 'Small units: smooth', W / 2, 180, fresh * (1 - bigOn), { color: PAL.cyan });
    P.label(ctx, 'Tired? Bigger units join', W / 2, 180, bigOn * (1 - uneven), { color: PAL.amber, size: 30 });
    P.label(ctx, 'Uneven firing', W / 2, 180, uneven, { color: PAL.red });
    // force trace
    const gy = 1110, gx0 = 80, gx1 = 640; P.fill(ctx, P.rr(gx0 - 20, gy - 140, gx1 - gx0 + 40, 260, 20), 'rgba(255,255,255,0.1)');
    ctx.save(); ctx.strokeStyle = PAL.mint; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath();
    const span = 3;
    for (let x = gx0; x <= gx1; x += 4) {
      const tt = t - span + (x - gx0) / (gx1 - gx0) * span;
      const wob = (tt > wt('bigger') ? 18 : 3) + (tt > wt('unevenly') - 0.4 ? 26 : 0);
      const y = gy - 40 + Math.sin(tt * 37) * wob * 0.6 + Math.sin(tt * 23 + 1) * wob * 0.5;
      if (x === gx0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.globalAlpha = kIn; ctx.stroke(); ctx.restore();
    P.label(ctx, 'Force', gx0 + 60, gy + 92, kIn, { color: PAL.mint, size: 24 });
  }
  // D: the wobble = the shake (big counter of the trace + trembling lifter)
  function wobble(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, '#ffffff', 5, 0.05);
    const k = P.pop(t, wt('wobbles') - 0.2, 0.5), [dx, dy] = tremble(t, 8);
    ctx.save(); ctx.translate(dx * k, dy * k); P.lifter(ctx, W / 2, H_ * 0.82, 1.3, { arms: 'curl', wince: 0.9, blink: blink(t, 2) }); ctx.restore();
    P.title(ctx, ['WOBBLE', '= SHAKE'], W / 2, 190, P.pop(t, wt('wobble') - 0.2, 0.6), { size: 80, color: PAL.yellow });
  }
  // E: finale — nervous system at work; pain = stop; next: the pump
  function finale(ctx, t) {
    P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, t - L(8), W / 2, H_ * 0.6, 0.02);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.25, { arms: 'flex', bulk: 0.5, smile: P.pop(t, wt('pain') - 0.3) < 0.5, wince: 0, blink: blink(t, 3) });
    ctx.restore();
    P.label(ctx, 'Nervous system working hard', W / 2, 170, P.pop(t, wt('nervous') - 0.2) * (1 - P.pop(t, wt('pain') - 0.3)), { color: PAL.mint, size: 28 });
    const kp = P.pop(t, wt('pain') - 0.2, 0.4);
    P.bubble(ctx, 'Pain? STOP the set', W / 2, 300, kp * (1 - P.pop(t, L(9) - 0.2)), { color: PAL.red });
    P.title(ctx, ['Next:', 'THE PUMP'], W / 2, 220, P.pop(t, wt('pump') - 0.5, 0.6), { size: 72, color: PAL.mint });
  }

  const SEQ = [
    { t: 0, draw: (c) => hook(c, CUR) },
    { t: L(1) - 0.15, draw: (c) => brain(c, CUR), tr: 'slide' },
    { t: L(2) - 0.3, draw: (c) => units(c, CUR), tr: 'zoom', focus: [W / 2, 640] },
    { t: L(7) - 0.2, draw: (c) => wobble(c, CUR), tr: 'slide' },
    { t: L(8) - 0.2, draw: (c) => finale(c, CUR), tr: 'slide' },
  ];
  function explainer(ctx, W_, H2, t) { CUR = t; P._now = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore(); P.finish(ctx, W, H_); P.dust(ctx, t, W, H_); P.kcap(ctx, t, W, H_, WORDS, CHUNKS); }
  const BEATS = [{ t: 0, name: 'hook' }, { t: SEQ[1].t, name: 'brain' }, { t: SEQ[2].t, name: 'units' }, { t: wt('fresh'), name: 'small' }, { t: wt('bigger'), name: 'big' }, { t: wt('unevenly'), name: 'uneven' }, { t: SEQ[3].t, name: 'wobble' }, { t: SEQ[4].t, name: 'finale' }, { t: wt('pump'), name: 'next' }];
  window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };

  function scoreSound(k) {
    k.play('riser', 0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
    for (let x = 0.2; x < L(1); x += 0.12) k.play('tock', x, { f: 300 + (x * 97 % 80), gain: 0.15, minor: true });
    SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
    k.play('stamp', wt('breaking'), { gain: 0.6 }); k.play('sparkle', wt('brain'), { n: 6 }); k.play('glitch', wt('brain') + 0.2, { gain: 0.3 });
    k.play('blip', wt('motor'), { f: 'C6' }); k.play('ding', wt('fresh'), { f: 'E6' }); k.play('powerup', wt('bigger') - 0.1, { gain: 0.5 });
    k.play('buzz', wt('rougher'), { dur: 0.5, f: 120, gain: 0.4 }); k.play('glitch', wt('unevenly'), { gain: 0.5 });
    k.play('thud', wt('wobbles'), { gain: 0.5 }); k.play('pop', wt('shake') - 0.1, { f: 880 });
    k.play('ding', wt('nervous'), { f: 'G6' }); k.play('error', wt('pain'), { gain: 0.5 }); k.play('stamp', wt('stop'), { gain: 0.6 });
    k.play('success', wt('pump') - 0.2); k.play('sparkle', wt('pump'), { n: 8 });
  }
  window.scoreSound = scoreSound;
