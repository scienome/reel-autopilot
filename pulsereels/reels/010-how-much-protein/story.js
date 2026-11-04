// 010 Muscle Building 2: how much protein (Morton 2018; Schoenfeld & Aragon 2018)
(function () {
P.reel({ merge: [['forty nine', '49'], ['one point six grams', '1.6 g'], ['eighty kilo', '80 kg'], ['one hundred thirty grams', '130 g'], ['thirty to forty grams', '30-40 g']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 60, H * 0.86, 1.3, { arms: 'flex', bulk: 0.4, blink: A.blink(t) }); P.chicken(c, 560, 760 + Math.sin(t * 3) * 8, 0.9, 0.2); P.egg(c, 590, 600, 44);
    A.hookTitle(c, ['How Much', 'PROTEIN?'], 'Muscle Building · Part 2'); } },
  { at: L(2) - 0.2, name: 'review', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05);
    P.counter(c, '49 studies', W / 2, 200, 80, pop(t, L(2) + 0.3), PAL.yellow);
    P.lineChart(c, 70, 820, 580, 420, [0.1, 0.4, 0.65, 0.82, 0.86, 0.87, 0.87], ramp(t, L(3) - 0.2, L(4) + 0.6), PAL.mint, 'muscle gain');
    const k = pop(t, L(3) + 1.2); if (k > 0) { P.fill(c, P.rr(392, 420, 6, 380, 3), P.alpha(PAL.amber, k)); P.label(c, '1.6 g / kg', 395, 380, k, { color: PAL.amber, size: 30 }); }
    P.label(c, 'then it flattens', 560, 340, pop(t, L(4)), { color: PAL.cyan, size: 24 }); } },
  { at: L(5) - 0.2, name: 'math', tr: 'slide', draw: (c, t) => { P.xrayBg(c, W, H, t); const g = A.ramp(t, L(5) + 1.4, L(6)); P.lifter(c, 200, 960, 1.0, { arms: 'flex', bulk: 0.2 + 0.3 * g, xray: true, work: { biceps: g, chest: g, quads: g, shoulders: g }, t }); for (let i = 0; i < 3; i++) P.protein(c, 470 - ((t * 60 + i * 80) % 240), 760 + i * 50, 160, t + i, 1, 6); P.counter(c, '80 kg', 200, 380, 80, pop(t, L(5)), PAL.cyan);
    P.arrowFlat(c, 320, 600, 430, 600, pop(t, L(5) + 0.8), PAL.yellow); P.counter(c, '≈130 g', 540, 600, 84, pop(t, L(5) + 1.4), PAL.mint); P.label(c, 'a day', 540, 700, pop(t, L(5) + 1.6), { color: PAL.mint }); } },
  { at: L(6) - 0.2, name: 'meals', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); for (let i = 0; i < 4; i++) { const k = pop(t, L(6) + i * 0.3); if (k <= 0) continue; const x = 180 + (i % 2) * 360, y = 420 + Math.floor(i / 2) * 330;
      P.platePie(c, x, y, 110, [[0.5, PAL.green, ''], [0.3, '#f1c07a', ''], [0.2, PAL.bone, '']], k); P.label(c, '30-40 g', x, y + 160, k, { color: PAL.amber, size: 26 }); } } },
  { at: L(7) - 0.2, name: 'foods', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); const it = [[(x, y) => P.chicken(c, x, y, 0.8)], [(x, y) => P.egg(c, x, y, 50)], [(x, y) => P.steak(c, x, y, 0.7)], [(x, y) => P.milk(c, x, y, 0.8)], [(x, y) => P.broccoli(c, x, y, 0.9)], [(x, y) => P.rice(c, x, y, 0.8)]];
    it.forEach(([f], i) => { if (pop(t, L(7) + i * 0.25) > 0) f(180 + (i % 3) * 180, 400 + Math.floor(i / 3) * 260); });
    P.bubble(c, 'Kidney disease? Ask a doctor first', W / 2, 1060, pop(t, L(8) - 0.1), { color: PAL.red }); A.next(c, t, 'SETS PER WEEK'); } },
]; }, sfx: (A) => [['ding', A.L(2) + 0.3, { f: 'C6' }], ['riser', A.L(3), { dur: 0.8, gain: 0.4 }], ['pop', A.L(3) + 1.2, { f: 820 }], ['pop', A.L(5) + 1.4, { f: 900 }], ['blip', A.L(6), { f: 'C6' }], ['blip', A.L(6) + 0.3, { f: 'E6' }], ['blip', A.L(6) + 0.6, { f: 'G6' }], ['error', A.L(8), { gain: 0.3 }]] });
