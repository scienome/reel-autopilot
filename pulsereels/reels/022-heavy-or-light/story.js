// 022 Muscle Building 4: heavy vs light (Schoenfeld 2015, 2017, 2021)
(function () {
P.reel({ merge: [['eight to twelve', '8-12'], ['twenty five to thirty five', '25-35']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.dumbbell(c, 200, 720 + Math.sin(t * 2) * 10, 1.7, -0.2, PAL.red); P.dumbbell(c, 540, 740 + Math.cos(t * 2) * 10, 0.9, 0.2, PAL.cyan);
    P.counter(c, 'VS', W / 2, 740, 70, 1, PAL.yellow); A.hookTitle(c, ['HEAVY', 'or LIGHT?'], 'Muscle Building · Part 4'); } },
  { at: L(2) - 0.2, name: 'groups', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.versus(c, W / 2, 560, 660, 420, 'Heavy', 'Light', pop(t, L(2)), 0, (cc) => P.dumbbell(cc, 0, 30, 0.9, 0, PAL.red), (cc) => P.dumbbell(cc, 0, 30, 0.5, 0, PAL.cyan));
    P.counter(c, '8-12', 185, 860, 70, pop(t, L(2) + 1.5), PAL.red); P.counter(c, '25-35', 535, 860, 70, pop(t, L(3) + 1.2), PAL.cyan); P.label(c, 'Both close to failure', W / 2, 1020, pop(t, L(4)), { color: PAL.amber }); } },
  { at: L(5) - 0.2, name: 'result', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); const g = ramp(t, L(5), L(5) + 1.2), s = ramp(t, L(6), L(6) + 1.2);
    P.meter(c, 140, 760, 110, 400, 0.7 * g, PAL.red, 'Size'); P.meter(c, 270, 760, 110, 400, 0.7 * g, PAL.cyan, 'Size'); P.counter(c, '=', 205, 300, 80, pop(t, L(5) + 1), PAL.yellow);
    P.meter(c, 450, 760, 110, 400, 0.85 * s, PAL.red, 'Strength'); P.meter(c, 580, 760, 110, 400, 0.5 * s, PAL.cyan, 'Strength'); P.label(c, 'Heavy = stronger', 515, 300, pop(t, L(6) + 0.8), { color: PAL.red, size: 26 });
    P.label(c, 'Heavy', 260, 900, pop(t, L(5)), { color: PAL.red, size: 22 }); P.label(c, 'Light', 460, 900, pop(t, L(5)), { color: PAL.cyan, size: 22 }); } },
  { at: L(7) - 0.2, name: 'rule', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.25, { arms: 'flex', bulk: 0.5, smile: true, blink: A.blink(t) }); const e = pop(t, L(9) - 0.2);
    P.check(c, 'Size: effort > weight', W / 2, 180, true, pop(t, L(7)) * (1 - e), 28); P.check(c, 'Strength: lift heavy', W / 2, 280, true, pop(t, L(7) + 2.2) * (1 - e), 28); P.check(c, 'Mix rep ranges', W / 2, 380, true, pop(t, L(8)) * (1 - e), 28); A.next(c, t, 'TO FAILURE?'); } },
]; }, sfx: (A) => [['thud', 0.5, { gain: 0.4 }], ['pop', A.L(2) + 1.5, { f: 600 }], ['pop', A.L(3) + 1.2, { f: 900 }], ['ding', A.L(5) + 1, { f: 'E6' }], ['powerup', A.L(6) + 0.8, { gain: 0.4 }], ['pop', A.L(7), { f: 760 }], ['pop', A.L(8), { f: 860 }]] });
