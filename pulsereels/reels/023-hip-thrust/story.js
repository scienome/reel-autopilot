// 023 Exercise 6: hip thrust (Contreras 2015; Plotkin 2023)
(function () {
P.reel({ merge: [['twenty twenty three', '2023']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.4); P.lifterBench(c, W / 2 + 110, H * 0.84, 1.2, 'hipthrust', { k, glow: k }); A.hookTitle(c, ['HIP', 'THRUST'], 'Exercise Series · Part 6'); } },
  { at: L(2) - 0.2, name: 'map', tr: 'zoom', focus: [W / 2, 760], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const h = pop(t, L(3));
    if (h < 1) { c.save(); c.globalAlpha = 1 - h; P.musclemap(c, W / 2, 760, 1.5, 'back', { glutes: pop(t, L(2)), hamstrings: h }); c.restore(); } if (h > 0) { c.save(); c.globalAlpha = h; P.musclemap(c, W / 2, 760, 1.5, 'back', { glutes: 1, hamstrings: 0.5 }); c.restore(); }
    P.label(c, 'GLUTES: almost all the work', W / 2, 170, pop(t, L(2)) * (1 - h), { color: PAL.red, size: 30 }); P.label(c, 'Hamstrings + quads help', W / 2, 170, h, { color: PAL.red }); } },
  { at: L(4) - 0.2, name: 'emg', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); const g = ramp(t, L(4), L(4) + 1.5), s = pop(t, L(5) - 0.2);
    if (s < 1) { c.save(); c.globalAlpha = 1 - s; P.meter(c, 230, 820, 150, 460, 0.85 * g, PAL.magenta, 'Hip thrust'); P.meter(c, 490, 820, 150, 460, 0.55 * g, PAL.blue, 'Squat'); P.label(c, 'Glute activity', W / 2, 220, pop(t, L(4)), { color: PAL.amber }); c.restore(); }
    if (s > 0) { P.counter(c, '2023', W / 2, 220, 90, s, PAL.yellow); P.versus(c, W / 2, 620, 660, 380, 'Squat', 'Hip thrust', s, 0, (cc) => P.lifterSide(cc, 0, 130, 0.42, 'squat', { k: 1, bar: true }), (cc) => P.lifterBench(cc, 30, 120, 0.4, 'hipthrust', { k: 1 }));
      P.counter(c, '= glute size', W / 2, 920, 64, pop(t, L(5) + 2.2), PAL.mint); } } },
  { at: L(6) - 0.2, name: 'pick', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2); P.lifterBench(c, W / 2 + 110, H * 0.86, 1.0, 'hipthrust', { k, glow: k }); const e = pop(t, L(8) - 0.2);
    P.check(c, 'Pick the one you enjoy (or both)', W / 2, 180, true, pop(t, L(6)) * (1 - e), 26); ['Chin tucked', 'Ribs down', 'Squeeze at the top'].forEach((s, i) => P.check(c, s, W / 2, 280 + i * 95, true, pop(t, L(7) + i * 0.8) * (1 - e), 26)); A.next(c, t, 'BARBELL ROW'); } },
]; }, sfx: (A) => [['thud', 1.2, { gain: 0.4 }], ['blip', A.L(2), { f: 'C6' }], ['blip', A.L(3), { f: 'E6' }], ['riser', A.L(4), { dur: 1.2, gain: 0.3 }], ['paper', A.L(5) - 0.1, { dur: 0.3 }], ['ding', A.L(5) + 2.2, { f: 'E6' }], ['pop', A.L(6), { f: 700 }], ['pop', A.L(7), { f: 780 }], ['pop', A.L(7) + 0.8, { f: 840 }], ['pop', A.L(7) + 1.6, { f: 900 }]] });
