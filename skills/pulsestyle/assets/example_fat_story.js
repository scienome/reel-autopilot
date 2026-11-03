// 001 — Where does your fat actually go? (Meerman & Brown, BMJ 2014: 84% leaves as CO2 through the lungs, 16% as water)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const SCRIPT = P.reelScript();
  const WORDS = P.mergeWords(P.words(SCRIPT), [['ten kilos', '10 kilos'], ['eight point four', '8.4 kg'], ['one point six', '1.6 kg'], ['carbon dioxide', 'CO2']]);
  const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
  const wt = (k, n) => P.wt(WORDS, k, n);
  const last = WORDS[WORDS.length - 1];
  const DURATION = +((window.TIMING && window.TIMING.duration) || last.end + 1.4).toFixed(2);
  const L = (i) => SCRIPT[i][1][0][0];                       // start of line i
  const blink = (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0);

  // ---------- shots ----------
  // A: hook — on the scale, weight counts down, belly shrinks, "where does it go?"
  function hook(ctx, t) {
    P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, t, W / 2, H_ * 0.6, 0.03);
    const k = P.ramp(t, 0.2, wt('fat') + 0.2);
    P.scale(ctx, W / 2, H_ * 0.85, 1.3, P.countTo(t, 0.2, wt('fat') + 0.2, 90, 80) + ' kg', 395);
    P.lifter(ctx, W / 2, H_ * 0.84, 1.4, { arms: 'down', belly: 1 - k * 0.75, shock: P.ramp(t, wt('where') - 0.2, wt('where')), look: 0, blink: blink(t) });
    P.qmarks(ctx, W / 2, H_ * 0.84 - 420, t, P.pop(t, wt('where') - 0.1, 0.8));
    for (let i = 0; i < 4; i++) { const p = P.pop(t, 0.6 + i * 0.5, 1.4); P.molecule(ctx, W / 2 + (i % 2 ? 1 : -1) * (60 + i * 30), H_ * 0.6 - p * 260, 0.8, 'co2', p * 3, p > 0 && p < 1 ? 1 : 0); }
    ctx.restore();
    const bob = 1 + Math.sin(t * 4) * 0.015;
    ctx.save(); ctx.translate(W / 2, 175); ctx.scale(bob, bob); ctx.translate(-W / 2, -175);
    P.title(ctx, ['Where Does Your', 'Fat GO?'], W / 2, 140, 1, { size: 66 });
    ctx.restore();
  }
  // B: the survey — 65% of doctors said "energy"
  function survey(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, '#ffffff', 2, 0.05);
    ctx.save(); P.push(ctx, W, H_, t - L(1), W / 2, H_ * 0.5, 0.02);
    P.lifter(ctx, W / 2, H_ * 0.86, 1.05, { arms: 'down', belly: 0.5, look: -0.4, blink: blink(t, 1) });
    const kc = P.pop(t, wt('doctors') - 0.15, 0.4);
    P.counter(ctx, P.countTo(t, wt('doctors') - 0.15, wt('doctors') + 0.6, 0, 65) + '%', W / 2, 260, 150, kc, PAL.yellow);
    P.label(ctx, 'of doctors', W / 2, 375, kc, { color: PAL.blue, size: 30 });
    P.stampX(ctx, W / 2, 290, 120, P.pop(t, wt('wrong') - 0.05, 0.25));
    P.bubble(ctx, 'It turns into ENERGY!', W / 2 + 40, 560, P.pop(t, wt('energy') - 0.25, 0.35), { tail: [W / 2 + 10, 690], size: 34 });
    P.stampX(ctx, W / 2 + 40, 560, 80, P.pop(t, wt('energy') + 0.5, 0.25));
    ctx.restore();
  }
  // C: inside the belly — fat cells, one droplet, triglycerides that split apart
  const CELLS = (() => { const r = H.rng('cells'), out = []; for (let row = -1; row < 9; row++) for (let col = -1; col < 5; col++) out.push([col * 190 + (row % 2) * 95 + r() * 20, row * 165 + r() * 20, 96 + r() * 12]); return out; })();
  function fatCells(ctx, t) {
    P.bg(ctx, W, H_, 'deep', t); P.bgCells(ctx, W, H_, t, '#ffe7a6', 3, 0.05);
    const zoomK = P.ramp(t, wt('droplets') - 0.3, wt('droplets') + 0.6), cx = W / 2 + 10, cy = H_ * 0.43;
    ctx.save(); P.push(ctx, W, H_, t - L(2), cx, cy, 0.02);
    const z = 1 + zoomK * 1.5; ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
    CELLS.forEach(([x, y, r], i) => P.fatCell(ctx, x + 60, y + 40, r, t + i, { drop: 1 }));
    // triglycerides floating inside the central droplet
    const kT = P.pop(t, wt('triglycerides') - 0.3, 0.5), split = P.ramp(t, wt('break') - 0.1, wt('break') + 0.5);
    for (let i = 0; i < 3; i++) P.trig(ctx, cx - 40 + i * 30, cy - 40 + i * 40 + Math.sin(t * 2 + i) * 4, 0.6 * H.ease.back(kT), -0.3 + i * 0.3, split, t);
    ctx.restore();
    P.label(ctx, 'Fat Cells', W / 2, 170, P.pop(t, wt('cells') - 0.15) * (1 - zoomK), { color: PAL.amber });
    P.label(ctx, 'Triglycerides', W / 2, 170, P.pop(t, wt('triglycerides') - 0.2), { color: PAL.orange, sub: 'stored fat' });
    if (split > 0.2) P.zap(ctx, cx, cy, 120, t, 11, 4);
  }
  // D: the ride — fatty acids in the bloodstream, heading to a muscle
  function blood(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, PAL.pink, 4, 0.05);
    ctx.save(); P.push(ctx, W, H_, t - wt('ride'), W / 2, H_ * 0.45, 0.02);
    P.vessel(ctx, -40, H_ * 0.45, W + 80, 170, t, { speed: 180, seed: 2 });
    for (let i = 0; i < 6; i++) { const x = ((i * 150 + t * 200) % (W + 200)) - 100, y = H_ * 0.45 + Math.sin(i * 2 + t * 2) * 60; P.trig(ctx, x, y, 0.5, 0, 1, t + i); }
    const km = P.pop(t, wt('muscles') - 0.3, 0.5);
    if (km > 0) P.fiber(ctx, W - 230 + (1 - H.ease.out(km)) * 300, H_ * 0.45 + 330, 420, 70, -1.2, { color: '#ff4a5c', seed: 5, slide: t * 10 });
    ctx.restore();
    P.label(ctx, 'Blood', 160, 360, P.pop(t, wt('blood') - 0.15), { color: PAL.red, stem: [190, 450] });
    P.label(ctx, 'Muscle', W - 170, 1010 - 120, km, { color: PAL.magenta });
  }
  // E/F: the engine — mitochondria burn fat with oxygen, CO2 and water come out
  function mito(ctx, t) {
    P.bg(ctx, W, H_, 'violet', t); P.bgCells(ctx, W, H_, t, PAL.amber, 5, 0.05);
    const burn = P.ramp(t, wt('burn', 1) - 0.2, wt('burn', 1) + 0.4), cx = W / 2, cy = H_ * 0.44;
    ctx.save(); P.push(ctx, W, H_, t - L(4), cx, cy, 0.025); P.shake(ctx, t, wt('comes'), 0.5, 0.4);
    // oxygen streams in from the top-left, fatty acids from the bottom-left
    const kO = P.pop(t, wt('oxygen') - 0.4, 0.6);
    for (let i = 0; i < 7; i++) { const p = (t * 0.5 + i / 7) % 1; if (kO > 0) P.molecule(ctx, P.lerp(40, cx - 120, p), P.lerp(240, cy - 40, p) + Math.sin(i + t * 3) * 10, 0.75, 'o2', t + i, kO * (1 - p * 0.6)); }
    for (let i = 0; i < 4; i++) { const p = (t * 0.4 + i / 4) % 1; P.trig(ctx, P.lerp(30, cx - 120, p), P.lerp(cy + 300, cy + 40, p), 0.22, 0.3, 1, t + i); }
    P.mito(ctx, cx, cy, 380, 190, -0.15, t, burn);
    // products shoot out to the right after "comes out"
    const kC = P.pop(t, wt('carbon') - 0.15, 0.4), kW = P.pop(t, wt('water') - 0.15, 0.4);
    for (let i = 0; i < 6; i++) { const p = (t * 0.55 + i / 6) % 1; P.molecule(ctx, P.lerp(cx + 150, W + 40, p), P.lerp(cy - 30, cy - 260, p) + Math.sin(i * 3 + t * 2) * 14, 0.9, 'co2', t * 2 + i, kC); P.molecule(ctx, P.lerp(cx + 150, W + 40, p), P.lerp(cy + 40, cy + 260, p), 0.9, 'h2o', -t * 2 + i, kW); }
    if (burn > 0.5) P.sparkles(ctx, cx, cy, 230, t, burn, 8);
    ctx.restore();
    P.label(ctx, 'Mitochondria', W / 2, 190, P.pop(t, wt('mitochondria') - 0.2), { color: PAL.orange, sub: 'your cell engines' });
    P.label(ctx, 'Oxygen', 150, 330, kO, { color: PAL.red, size: 28 });
    P.label(ctx, 'CO2', W - 130, 300, kC, { color: '#454b75' }); P.label(ctx, 'Water', W - 140, 830, kW, { color: PAL.blue });
  }
  // G: the lungs — 8.4 of the 10 kg leave as breath
  function lungs(ctx, t) {
    P.bg(ctx, W, H_, 'deep', t); P.bgCells(ctx, W, H_, t, PAL.pink, 6, 0.05);
    const br = 0.5 + 0.5 * Math.sin(t * 2.6);
    ctx.save(); P.push(ctx, W, H_, t - L(6), W / 2, H_ * 0.5, 0.02);
    P.lungs(ctx, W / 2, H_ * 0.62, 1.45, br);
    for (let i = 0; i < 9; i++) { const p = (t * 0.45 + i / 9) % 1; P.molecule(ctx, W / 2 + Math.sin(p * 7 + i) * (30 + p * 120), H_ * 0.62 - 330 - p * 340, 0.85 + p * 0.3, 'co2', i + t, 1 - p * p); }
    ctx.restore();
    const kN = P.pop(t, wt('eight') - 0.15, 0.4);
    P.counter(ctx, P.countTo(t, wt('eight') - 0.15, wt('eight') + 0.9, 0, 8.4, 1) + ' kg', W / 2, 200, 130, kN, PAL.yellow);
    P.label(ctx, 'out of 10 kg', W / 2, 300, kN, { color: PAL.blue, size: 28 });
    P.label(ctx, 'Lungs', W / 2, 860, P.pop(t, wt('lungs') - 0.2), { color: PAL.pink });
  }
  // H: you breathe it out — big face, puffs of CO2
  function breathe(ctx, t) {
    P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, t - L(7), W / 2, 600, 0.03);
    P.lifter(ctx, W / 2, 1550, 2.6, { arms: 'down', shock: 0.8, pant: t * 6, blink: blink(t, 2) });
    for (let i = 0; i < 4; i++) { const p = ((t - L(7)) * 0.9 + i / 4) % 1; P.puff(ctx, W / 2 + 60 + p * 170, 850 - p * 330, 60, p); P.molecule(ctx, W / 2 + 80 + p * 220, 840 - p * 420, 0.9, 'co2', p * 4 + i, 1 - p); }
    ctx.restore();
    P.title(ctx, ['You BREATHE', 'It Out!'], W / 2, 170, P.pop(t, wt('breathe') - 0.2, 0.7), { size: 70, color: PAL.mint });
  }
  // I: the last 1.6 kg — water: sweat, tears, pee
  function water(ctx, t) {
    P.bg(ctx, W, H_, 'night', t); P.bgCells(ctx, W, H_, t, PAL.cyan, 7, 0.05);
    const kN = P.pop(t, wt('one', 1) - 0.15, 0.4);
    P.counter(ctx, P.countTo(t, wt('one', 1) - 0.15, wt('one', 1) + 0.7, 0, 1.6, 1) + ' kg', W / 2, 230, 130, kN, PAL.cyan);
    P.label(ctx, 'as water', W / 2, 330, kN, { color: PAL.blue, size: 28 });
    [['sweat', PAL.cyan, 'Sweat'], ['tears', '#9fd8ff', 'Tears'], ['pee', PAL.yellow, 'Pee']].forEach(([w, c, lab], i) => {
      const k = P.pop(t, wt(w) - 0.15, 0.45), x = 150 + i * 210, y = 600 + Math.sin(t * 3 + i) * 10;
      if (k <= 0) return; ctx.save(); ctx.translate(x, y); const s = H.ease.back(P.cl(k)); ctx.scale(s, s); P.drop(ctx, 0, 0, 52, c); ctx.restore();
      P.label(ctx, lab, x, 740, k, { color: i === 2 ? PAL.amber : PAL.blue, size: 28 });
    });
  }
  // J: finale — panting on the treadmill = fat leaving
  function finale(ctx, t) {
    P.gym(ctx, W, H_, t);
    ctx.save(); P.push(ctx, W, H_, t - L(9), W / 2, H_ * 0.6, 0.025);
    P.treadmill(ctx, W / 2, H_ * 0.85, 1.15, t);
    P.lifter(ctx, W / 2, H_ * 0.84, 1.15, { run: t * 9, belly: 0.25, pant: t * 8, blink: blink(t, 3) });
    P.sweat(ctx, W / 2, H_ * 0.84 - 330, t, 1, 4);
    for (let i = 0; i < 5; i++) { const p = (t * 0.8 + i / 5) % 1; P.puff(ctx, W / 2 + 30 + p * 90, H_ * 0.84 - 300 - p * 200, 50, p); P.molecule(ctx, W / 2 + 40 + p * 160 + Math.sin(i) * 30, H_ * 0.84 - 320 - p * 380, 0.8, 'co2', i + t * 3, 1 - p); }
    ctx.restore();
    P.title(ctx, ["That's Your Fat", 'Leaving!'], W / 2, 170, P.pop(t, wt('fat', 4) - 0.3, 0.7), { size: 64, color: PAL.amber });
    P.confetti(ctx, W, H_, t, wt('leaving') - 0.1, 9);
  }

  const T = (k, n, off = 0) => wt(k, n) + off;
  const SEQ = [
    { t: 0, draw: (c) => hook(c, CUR) },
    { t: L(1) - 0.15, draw: (c) => survey(c, CUR), tr: 'slide' },
    { t: T('your', 0, -0.75), draw: (c) => fatCells(c, CUR), tr: 'zoom', focus: [W / 2, H_ * 0.86 - 150 * 1.05] },
    { t: T('ride', 0, -0.35), draw: (c) => blood(c, CUR), tr: 'zoom', focus: [W / 2 + 10, H_ * 0.43] },
    { t: T('there', 0, -0.4), draw: (c) => mito(c, CUR), tr: 'zoom', focus: [W - 230, H_ * 0.45 + 330] },
    { t: L(6) - 0.2, draw: (c) => lungs(c, CUR), tr: 'slide' },
    { t: L(7) - 0.2, draw: (c) => breathe(c, CUR), tr: 'slide' },
    { t: L(8) - 0.2, draw: (c) => water(c, CUR), tr: 'slide' },
    { t: L(9) - 0.2, draw: (c) => finale(c, CUR), tr: 'slide' },
  ];
  let CUR = 0;
  function explainer(ctx, W_, H2, t) {
    CUR = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore();
    P.finish(ctx, W, H_);
    P.caption(ctx, W, H_, P.captionAt(CHUNKS, t));
  }
  const BEATS = SEQ.map((s, i) => ({ t: s.t, name: ['hook', 'survey', 'fat cells', 'blood', 'mitochondria', 'lungs', 'breathe out', 'water', 'finale'][i] }));
  window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };

  function scoreSound(k) {
    k.play('riser', 0.0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
    for (let x = 0.2; x < wt('fat'); x += 0.12) k.play('count', x, { minor: true });
    k.play('ding', wt('fat') + 0.2, { f: 'G6', gain: 0.6 }); k.play('blip', wt('where'), { f: 'E6' }); k.play('blip', wt('where') + 0.12, { f: 'A6' });
    SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
    for (let x = wt('doctors') - 0.15; x < wt('doctors') + 0.6; x += 0.08) k.play('count', x, { minor: true });
    k.play('stamp', wt('wrong'), { gain: 0.8 }); k.play('error', wt('wrong') + 0.05, { gain: 0.6 });
    k.play('pop', wt('energy') - 0.25, { f: 640 }); k.play('stamp', wt('energy') + 0.5, { gain: 0.7 });
    ['cells', 'triglycerides', 'blood', 'muscles', 'mitochondria', 'oxygen', 'carbon', 'water', 'lungs'].forEach((w, i) => k.play('pop', wt(w) - 0.15, { f: 560 + i * 50 }));
    k.play('glitch', wt('break'), { gain: 0.5 }); k.play('impact', wt('break') + 0.05, { gain: 0.4 });
    k.play('riser', wt('burn', 1) - 0.4, { dur: 0.6, gain: 0.5 }); k.play('sparkle', wt('burn', 1) + 0.2, { n: 6 });
    k.play('thud', wt('comes'), { gain: 0.5 });
    for (const [w, n] of [['eight', 0], ['one', 1]]) for (let x = wt(w, n) - 0.15; x < wt(w, n) + 0.8; x += 0.08) k.play('count', x, { minor: true });
    for (let x = L(7); x < L(8) - 0.2; x += 1.1) k.play('whoosh', x, { dur: 0.6, top: 1200, gain: 0.5, minor: true });
    k.play('pop', wt('breathe') - 0.2, { f: 820 });
    ['sweat', 'tears', 'pee'].forEach((w, i) => k.play('blip', wt(w) - 0.15, { f: ['C6', 'E6', 'G6'][i] }));
    for (let x = L(9); x < DURATION - 0.3; x += 0.33) k.play('thud', x, { gain: 0.18, f: 90, minor: true });
    k.play('success', wt('leaving')); k.play('sparkle', wt('leaving') + 0.2, { n: 10 });
  }
  window.scoreSound = scoreSound;
