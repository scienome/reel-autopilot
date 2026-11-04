// 017 Exercise 4: the pull-up (Youdas 2010; Dickie 2017)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.4); P.lifterSide(c, W / 2, H * 0.92, 1.5, 'hang', { k, wince: k > 0.7 }); A.hookTitle(c, ['THE', 'PULL-UP'], 'Exercise Series · Part 4'); } },
  { at: L(2) - 0.2, name: 'map', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const l = pop(t, L(2)), m = pop(t, L(3)), f = pop(t, L(4));
    if (f < 1) { c.save(); c.globalAlpha = 1 - f; P.musclemap(c, W / 2, 760, 1.5, 'back', { lats: l, traps: m, rear: m * 0.6 }); c.restore(); }
    if (f > 0) { c.save(); c.globalAlpha = f; P.musclemap(c, W / 2, 760, 1.5, 'front', { biceps: 1, forearms: 1 }); c.restore(); }
    P.label(c, 'LATS: the wings', W / 2, 170, l * (1 - m), { color: PAL.red }); P.label(c, 'Mid back + biceps', W / 2, 170, m * (1 - f), { color: PAL.red }); P.label(c, 'Forearms + grip', W / 2, 170, f, { color: PAL.red }); } },
  { at: L(5) - 0.2, name: 'chin', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.versus(c, W / 2, 620, 660, 420, 'Pull-up', 'Chin-up', pop(t, L(5)), pop(t, L(5) + 1.4) > 0 ? 2 : 0, (cc) => P.lifterSide(cc, 0, 150, 0.45, 'hang', { k: 1 }), (cc) => P.lifterSide(cc, 0, 150, 0.45, 'hang', { k: 1, smile: true }));
    P.label(c, 'Palms facing you = more biceps', W / 2, 920, pop(t, L(5) + 1.4), { color: PAL.magenta, size: 28 }); } },
  { at: L(6) - 0.2, name: 'first', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const lower = 1 - ((t - L(6)) % 3) / 3; P.lifterSide(c, 240, H * 0.94, 1.1, 'hang', { k: lower, wince: true }); const e = pop(t, L(8) - 0.2);
    P.check(c, 'Jump up, lower SLOWLY', 460, 300, true, pop(t, L(6)) * (1 - e), 26); P.check(c, 'Or use a band', 460, 400, true, pop(t, L(7)) * (1 - e), 26); P.arcArrow(c, 240, 500, 90, -2.2, -0.9, pop(t, L(6) + 1)); A.next(c, t, 'OVERHEAD PRESS'); } },
]; }, sfx: (A) => [['powerup', 0.8, { gain: 0.4 }], ['blip', A.L(2), { f: 'C6' }], ['blip', A.L(3), { f: 'E6' }], ['blip', A.L(4), { f: 'G6' }], ['ding', A.L(5) + 1.4, { f: 'E6' }], ['pop', A.L(6), { f: 700 }], ['pop', A.L(7), { f: 820 }]] });
