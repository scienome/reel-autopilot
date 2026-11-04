// 014 Exercise 3: bench press (Stastny 2017; Saeterbakken 2017; Lehman 2005)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.4); P.lifterBench(c, W / 2 + 20, H * 0.82, 1.4, 'bench', { k }); A.hookTitle(c, ['BENCH', 'PRESS'], 'Exercise Series · Part 3'); } },
  { at: L(2) - 0.2, name: 'map', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const ch = pop(t, L(2)), sh = pop(t, L(3)), tr = pop(t, L(4) - 0.2);
    A.xrayRep(c, t, 'frontpress', { chest: ch, shoulders: sh, triceps: tr }, { map: tr > 0.5 ? 'back' : 'front' });
    P.label(c, 'Chest: push + squeeze', W / 2, 170, ch * (1 - sh), { color: PAL.red }); P.label(c, 'Front shoulders', W / 2, 170, sh * (1 - tr), { color: PAL.red }); P.label(c, 'Triceps: lockout', W / 2, 170, tr, { color: PAL.red }); } },
  { at: L(5) - 0.2, name: 'grip', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.versus(c, W / 2, 620, 660, 420, 'Wide grip', 'Close grip', pop(t, L(5)), pop(t, L(5) + 1.6) > 0 ? 2 : 0, (cc) => { P.barbell(cc, 0, 20, 0.5); }, (cc) => { P.barbell(cc, 0, 20, 0.5); });
    P.label(c, 'Close = more triceps', W / 2, 920, pop(t, L(5) + 1.6), { color: PAL.magenta }); } },
  { at: L(6) - 0.2, name: 'cues', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2); P.lifterBench(c, W / 2 + 20, H * 0.86, 1.2, 'bench', { k }); const e = pop(t, L(9) - 0.2);
    ['Shoulder blades pinched', 'Feet planted', 'Bar to lower chest', 'Spotter or safeties'].forEach((s, i) => P.check(c, s, W / 2, 180 + i * 95, true, pop(t, [L(6), L(6) + 1.6, L(7), L(8)][i]) * (1 - e), 28)); A.next(c, t, 'PULL-UP'); } },
]; }, sfx: (A) => [['thud', 1.2, { gain: 0.4 }], ['blip', A.L(2), { f: 'C6' }], ['blip', A.L(3), { f: 'E6' }], ['blip', A.L(4), { f: 'G6' }], ['ding', A.L(5) + 1.6, { f: 'E6' }], ['pop', A.L(6), { f: 700 }], ['pop', A.L(7), { f: 800 }], ['error', A.L(8), { gain: 0.3 }]] });
