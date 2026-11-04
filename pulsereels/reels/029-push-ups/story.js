// 029 Exercise 8: push-ups vs bench (Calatayud 2015; Kikuchi & Nakazato 2017)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 3); P.lifterSide(c, W / 2 - 60, H * 0.84, 1.3, 'pushup', { k, wince: k > 0.7 }); A.hookTitle(c, ['PUSH-UPS', 'vs BENCH?'], 'Exercise Series · Part 8'); } },
  { at: L(2) - 0.2, name: 'map', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const core = pop(t, L(3));
    P.musclemap(c, W / 2, 760, 1.5, 'front', { chest: pop(t, L(2)), shoulders: pop(t, L(2) + 1), abs: core, obliques: core });
    P.label(c, 'Chest, shoulders, triceps', W / 2, 170, pop(t, L(2)) * (1 - core), { color: PAL.red }); P.label(c, '+ CORE holds you straight', W / 2, 170, core, { color: PAL.amber }); } },
  { at: L(4) - 0.2, name: 'study', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.versus(c, W / 2, 560, 660, 400, 'Push-up', 'Bench', pop(t, L(4)), 0, (cc) => P.lifterSide(cc, 20, 120, 0.4, 'pushup', { k: 0.5 }), (cc) => P.lifterBench(cc, 20, 120, 0.4, 'bench', { k: 0.5 }));
    P.counter(c, '= strength', W / 2, 860, 70, pop(t, L(4) + 2.6), PAL.mint); P.counter(c, '= growth', W / 2, 1070, 70, pop(t, L(5)), PAL.mint); } },
  { at: L(6) - 0.2, name: 'harder', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 1.4); P.lifterSide(c, W / 2 - 40, H * 0.88, 1.1, 'pushup', { k, wince: true }); const e = pop(t, L(8) - 0.2);
    P.label(c, 'Make them HARD enough', W / 2, 180, pop(t, L(6)) * (1 - e), { color: PAL.red, size: 32 }); ['Slow them down', 'Raise your feet', 'Add a backpack'].forEach((s, i) => P.check(c, s, W / 2, 290 + i * 95, true, pop(t, L(7) + 0.4 + i * 0.9) * (1 - e), 28)); A.next(c, t, 'ROMANIAN DEADLIFT'); } },
]; }, sfx: (A) => [['thud', 1, { gain: 0.4 }], ['blip', A.L(2), { f: 'C6' }], ['blip', A.L(3), { f: 'G6' }], ['paper', A.L(4), { dur: 0.3 }], ['ding', A.L(4) + 2.6, { f: 'E6' }], ['ding', A.L(5), { f: 'G6' }], ['error', A.L(6), { gain: 0.3 }], ['pop', A.L(7) + 0.4, { f: 700 }], ['pop', A.L(7) + 1.3, { f: 780 }], ['pop', A.L(7) + 2.2, { f: 860 }]] });
