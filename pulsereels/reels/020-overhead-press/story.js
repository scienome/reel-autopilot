// 020 Exercise 5: overhead press (Saeterbakken & Fimland 2013; Kohler 2010)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.4); P.lifterSide(c, W / 2 - 20, H * 0.9, 1.5, 'press', { k, bar: true, wince: k > 0.7 }); A.hookTitle(c, ['OVERHEAD', 'PRESS'], 'Exercise Series · Part 5'); } },
  { at: L(2) - 0.2, name: 'map', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const s = pop(t, L(2)), tr = pop(t, L(3)), u = pop(t, L(4)), core = pop(t, L(5));
    const back = tr > 0 && core < 1 && u < 1; c.save(); c.globalAlpha = back ? 1 : 1; if (back) P.musclemap(c, W / 2, 760, 1.5, 'back', { triceps: 1, rear: 0.4 });
    else P.musclemap(c, W / 2, 760, 1.5, 'front', { shoulders: s, chest: u * 0.6, abs: core, obliques: core }); c.restore();
    P.label(c, 'Shoulders: front + side', W / 2, 170, s * (1 - tr), { color: PAL.red }); P.label(c, 'Triceps: lockout', W / 2, 170, tr * (1 - u), { color: PAL.red }); P.label(c, 'Upper chest + back steady it', W / 2, 170, u * (1 - core), { color: PAL.red, size: 28 }); P.label(c, 'Standing: core works hard', W / 2, 170, core, { color: PAL.red, size: 30 }); } },
  { at: L(6) - 0.2, name: 'study', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.versus(c, W / 2, 600, 660, 400, 'Standing', 'Seated', pop(t, L(6)), 0, (cc) => P.lifterSide(cc, 0, 140, 0.42, 'press', { k: 1, bar: true }), (cc) => P.lifterSide(cc, 0, 140, 0.42, 'press', { k: 1, bar: true }));
    P.label(c, 'More shoulder work', 190, 880, pop(t, L(6) + 1.6), { color: PAL.blue, size: 24 }); P.label(c, 'More weight lifted', 530, 880, pop(t, L(6) + 3), { color: PAL.magenta, size: 24 }); } },
  { at: L(7) - 0.2, name: 'cues', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2); P.lifterSide(c, 220, H * 0.9, 1.1, 'press', { k, bar: true, smile: true }); const e = pop(t, L(8) - 0.2);
    ['Squeeze glutes', 'Brace stomach', 'Bar straight up past face'].forEach((s, i) => P.check(c, s, 470, 300 + i * 100, true, pop(t, L(7) + i * 1.1) * (1 - e), 26)); A.next(c, t, 'HIP THRUST'); } },
]; }, sfx: (A) => [['thud', 1.2, { gain: 0.4 }], ['blip', A.L(2), { f: 'C6' }], ['blip', A.L(3), { f: 'D6' }], ['blip', A.L(4), { f: 'E6' }], ['blip', A.L(5), { f: 'G6' }], ['ding', A.L(6) + 1.6, { f: 'E6' }], ['ding', A.L(6) + 3, { f: 'G6' }], ['pop', A.L(7), { f: 700 }], ['pop', A.L(7) + 1.1, { f: 780 }], ['pop', A.L(7) + 2.2, { f: 860 }]] });
