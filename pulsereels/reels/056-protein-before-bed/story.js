// 056 Supplements 13: protein before bed (Res 2012; Snijders 2015; Joy 2018)
(function () {
P.reel({ merge: [['forty grams', '40 g'], ['twelve week', '12-week']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.moon(c, 560, 380, 60); P.bed(c, W / 2, 900, 1.3, t); P.milk(c, 160, 760, 1.1);
    A.hookTitle(c, ['Protein Before', 'BED?'], 'Supplement Series · Part 13', PAL.magenta, 70); } },
  { at: L(2) - 0.2, name: 'fast', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.clock(c, W / 2, 440, 130, 23 + ramp(t, L(2), L(3)) * 8, 0, ''); P.bed(c, W / 2, 900, 1.1, t);
    P.label(c, 'Hours without food', W / 2, 220, pop(t, L(2) + 0.5), { color: PAL.amber }); } },
  { at: L(3) - 0.2, name: 'casein', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.tub(c, W / 2, 640, 1.4, '#f4efe6', 'CASEIN', 'slow milk protein', PAL.blue); P.counter(c, '40 g', W / 2, 330, 110, pop(t, L(3) + 1.5), PAL.yellow); } },
  { at: L(4) - 0.2, name: 'night', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { A.dive(c, t, L(4) + 0.4, [W / 2 - 150, 860], (cc) => { P.bg(cc, W, H, 'night', t); P.bed(cc, W / 2, 900, 1.2, t); },
      (cc) => { P.bg(cc, W, H, 'plum', t); P.bgCells(cc, W, H, t, PAL.pink, 3, 0.05); P.muscleBelly(cc, W / 2, 620, 460, 160, 0.05, 0.25, t, { col: '#e8475b' }); P.flow(cc, 80, 300, W / 2, 600, t, 1, PAL.amber, 14); P.protein(cc, 160, 900, 400, t, ramp(t, L(4) + 1, L(5))); });
    P.label(c, 'Used through the night', W / 2, 200, pop(t, L(4) + 1.2), { color: PAL.mint }); } },
  { at: L(5) - 0.2, name: 'twelve', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const k = ramp(t, L(5), L(5) + 2.5); P.meter(c, 230, 1000, 150, 440, 0.45, PAL.cyan, 'Placebo'); P.meter(c, 490, 1000, 150, 440, 0.45 + 0.2 * k, PAL.mint, 'Bedtime');
    P.calendar(c, W / 2, 300, 0.8, '12 WEEKS', '', pop(t, L(5))); P.label(c, 'But: more protein in total', W / 2, 460, pop(t, L(5) + 3.5), { color: PAL.amber, size: 26 }); } },
  { at: L(6) - 0.2, name: 'same', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.versus(c, W / 2, 660, 660, 420, 'Morning', 'Night', pop(t, L(6)), 0, (cc) => P.sun(cc, 0, 40, 70, t), (cc) => P.moon(cc, 0, 40, 60));
    P.label(c, 'Same total protein', W / 2, 220, pop(t, L(6) + 0.5), { color: PAL.yellow }); P.label(c, 'Little difference', W / 2, 1000, pop(t, L(6) + 3), { color: PAL.mint }); } },
  { at: L(7) - 0.2, name: 'snack', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.milk(c, 200, 640, 1.2); P.flat(c, P.rr(W / 2 - 60, 600, 120, 110, 20), '#f4f4f4', { off: 5 }); P.flat(c, P.rr(470, 600, 120, 110, 20), '#fff7e0', { off: 5 }); const e = pop(t, L(8) - 0.2);
    P.label(c, 'Daily total FIRST', W / 2, 220, pop(t, L(7)) * (1 - e), { color: PAL.amber }); ['Milk', 'Yogurt', 'Cottage cheese'].forEach((s, i) => P.label(c, s, [200, W / 2, 530][i], 800, pop(t, L(7) + 3 + i * 0.5), { color: PAL.mint, size: 24 })); A.next(c, t, 'ASHWAGANDHA'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['tock', 0.4, { f: 400 }], ['tock', A.L(2), { f: 500 }], ['stamp', A.L(3) + 1.5, { gain: 0.5 }], ['powerup', A.L(4), { gain: 0.3 }], ['sparkle', A.L(4) + 1.2, { n: 6 }], ['ding', A.L(5) + 2.5, { f: 'E6' }], ['error', A.L(5) + 3.5, { gain: 0.3 }], ['pop', A.L(7) + 3, { f: 700 }], ['pop', A.L(7) + 3.5, { f: 800 }], ['pop', A.L(7) + 4, { f: 900 }]] });
