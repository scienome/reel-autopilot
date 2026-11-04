// 026 Exercise 7: barbell row (Fenwick 2009; Lehman 2004)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.6); P.lifterSide(c, W / 2 - 60, H * 0.9, 1.5, 'row', { k, bar: true, wince: k > 0.7 }); A.hookTitle(c, ['BARBELL', 'ROW'], 'Exercise Series · Part 7'); } },
  { at: L(2) - 0.2, name: 'map', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const l = pop(t, L(2)), m = pop(t, L(3)), r = pop(t, L(4)), h = pop(t, L(5));
    A.xrayRep(c, t, 'row', h > 0 ? { lowback: 1, hamstrings: 1, lats: 0.3, traps: 0.3 } : { lats: l, traps: m, rear: r, biceps: r }, { map: 'back' });
    P.label(c, 'LATS: elbows back', W / 2, 170, l * (1 - m), { color: PAL.red }); P.label(c, 'Mid back: squeeze blades', W / 2, 170, m * (1 - r), { color: PAL.red }); P.label(c, 'Rear shoulders + biceps', W / 2, 170, r * (1 - h), { color: PAL.red }); P.label(c, 'Lower back + hamstrings HOLD', W / 2, 170, h, { color: PAL.amber, size: 28 }); } },
  { at: L(6) - 0.2, name: 'cues', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.2); P.lifterSide(c, 220, H * 0.9, 1.1, 'row', { k, bar: true, smile: true }); const e = pop(t, L(8) - 0.2);
    P.check(c, 'Back flat', 480, 300, true, pop(t, L(6)) * (1 - e), 28); P.check(c, 'Bar to belly', 480, 400, true, pop(t, L(6) + 1.3) * (1 - e), 28); P.check(c, 'Jerking it? Too heavy', 480, 500, false, pop(t, L(7)) * (1 - e), 26); A.next(c, t, 'PUSH-UP'); } },
]; }, sfx: (A) => [['thud', 1.2, { gain: 0.4 }], ['blip', A.L(2), { f: 'C6' }], ['blip', A.L(3), { f: 'D6' }], ['blip', A.L(4), { f: 'E6' }], ['blip', A.L(5), { f: 'G6' }], ['pop', A.L(6), { f: 700 }], ['pop', A.L(6) + 1.3, { f: 800 }], ['error', A.L(7), { gain: 0.3 }]] });
