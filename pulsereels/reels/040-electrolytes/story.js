// 040 Supplements 9: electrolytes (ACSM 2007; Baker 2017; Hew-Butler 2015)
(function () {
P.reel({ merge: [['ninety minutes', '90 min']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.glow(c, W / 2, 760, 300, PAL.cyan, 0.4); P.bottle(c, W / 2, 760 + Math.sin(t * 2) * 8, 1.6, PAL.cyan, 0.75); P.qmarks(c, W / 2, 520, t, 1);
    A.hookTitle(c, ['Do You Need', 'ELECTROLYTES?'], 'Supplement Series · Part 9', PAL.magenta, 60); } },
  { at: L(2) - 0.2, name: 'sweat', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.skinLayer(c, W / 2, 700, 560, t, 1); for (let i = 0; i < 6; i++) P.drop(c, 160 + i * 80, 380 + ((t * 120 + i * 60) % 200), 14, PAL.cyan);
    P.label(c, 'Water + salt', W / 2, 200, pop(t, L(2)), { color: PAL.cyan }); P.label(c, 'Mostly SODIUM', W / 2, 1060, pop(t, L(2) + 1.6), { color: PAL.amber }); } },
  { at: L(3) - 0.2, name: 'differ', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.bgCells(c, W, H, t, '#ffffff', 2, 0.05); const k = ramp(t, L(3) + 1, L(3) + 3);
    P.lifter(c, 200, H * 0.8, 0.9, { arms: 'down', smile: true, blink: A.blink(t) }); P.lifter(c, 520, H * 0.8, 0.9, { arms: 'down', wince: 0.4, blink: A.blink(t, 2) }); P.sweat(c, 520, 560, t, 1, 2);
    P.meter(c, 200, 600, 110, 240, 0.35 * k + 0.05, PAL.cyan, 'Salt lost'); P.meter(c, 520, 600, 110, 240, 0.7 * k + 0.05, PAL.amber, 'Salt lost'); P.counter(c, '≈2×', 520, 300, 80, pop(t, L(3) + 3), PAL.yellow); } },
  { at: L(4) - 0.2, name: 'normal', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 80, H * 0.86, 1.2, { arms: 'down', smile: true, blink: A.blink(t) }); P.bottle(c, W / 2 + 170, H * 0.62, 1.0, PAL.blue, 0.6);
    P.stopwatch(c, W / 2, 300, 90, ramp(t, L(4), L(4) + 2), '1 HOUR'); P.check(c, 'Water + your next meal', W / 2, 470, true, pop(t, L(4) + 1.4), 26); } },
  { at: L(5) - 0.2, name: 'when', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.sun(c, 560, 260, 70, t); P.thermometer(c, 140, 520, 1.2, ramp(t, L(5) + 1, L(5) + 3) * 0.9);
    ['Over 90 min', 'Heat', 'Heavy, salty sweater'].forEach((s, i) => P.check(c, s, W / 2 + 40, 520 + i * 100, true, pop(t, L(5) + 0.5 + i * 1.3), 28)); } },
  { at: L(6) - 0.2, name: 'danger', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'night', t); P.vessel(c, 0, 640, W, 120, t); P.gauge(c, W / 2, 560, 140, 1 - ramp(t, L(6) + 1, L(6) + 4) * 0.8, 'BLOOD SODIUM', '', PAL.red);
    P.label(c, 'Too much plain water', W / 2, 200, pop(t, L(6)), { color: PAL.red }); P.label(c, 'Sodium too low = dangerous', W / 2, 860, pop(t, L(6) + 3.4), { color: PAL.amber, size: 28 }); } },
  { at: L(7) - 0.2, name: 'care', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.person(c, W / 2 + 175, H * 0.86, 0.95, 'doc', { talk: A.talk(t), arms: 'down', look: -0.5 }); P.lifter(c, W / 2 - 95, H * 0.86, 1.0, { arms: 'down', blink: A.blink(t) });
    P.bubble(c, 'Kidneys or blood pressure? Ask a doctor', W / 2, 220, pop(t, L(7)) * (1 - pop(t, L(8) - 0.2)), { color: PAL.red }); A.next(c, t, 'COLLAGEN'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['blip', A.L(2), { f: 'C6' }], ['ding', A.L(3) + 3, { f: 'E6' }], ['tock', A.L(4), { f: 500 }], ['pop', A.L(5) + 0.5, { f: 700 }], ['pop', A.L(5) + 1.8, { f: 800 }], ['pop', A.L(5) + 3.1, { f: 900 }], ['error', A.L(6) + 3.4, { gain: 0.4 }]] });
