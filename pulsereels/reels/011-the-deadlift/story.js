// 011 Exercise 2: the deadlift (Aasa 2015; Martin-Fuentes 2020; Escamilla 2002)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.4); P.lifterSide(c, W / 2 - 20, H * 0.88, 1.6, 'hinge', { k, bar: true, wince: k > 0.6 });
    A.hookTitle(c, ['THE', 'DEADLIFT'], 'Exercise Series · Part 2'); } },
  { at: L(2) - 0.2, name: 'map', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05);
    const g = pop(t, L(2)), b = pop(t, L(3)), u = pop(t, L(4)); A.xrayRep(c, t, 'hinge', { glutes: g, hamstrings: g, lowback: b, traps: u, lats: u * 0.7, forearms: u }, { map: 'back' });
    P.label(c, 'Glutes + hamstrings', W / 2, 170, g * (1 - b), { color: PAL.red }); P.label(c, 'Spinal erectors: flat back', W / 2, 170, b * (1 - u), { color: PAL.red, size: 30 }); P.label(c, 'Upper back + grip', W / 2, 170, u, { color: PAL.red }); } },
  { at: L(5) - 0.2, name: 'myth', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.bgCells(c, W, H, t, '#ffffff', 2, 0.05); const s = pop(t, L(6) - 0.2);
    P.bubble(c, 'Bad for your back?', W / 2, 260, pop(t, L(5)), { color: PAL.red }); P.spine(c, W / 2, 380, 1.0, 0.3, Math.floor(t * 2) % 9);
    if (s > 0) { P.fill(c, P.rr(0, 0, W, H, 0), P.alpha(PAL.ink, 0.6 * s)); P.versus(c, W / 2, 760, 660, 360, 'Deadlifts', 'Gentle', s, 0, (cc) => P.lifterSide(cc, 0, 130, 0.5, 'hinge', { k: 1, bar: true }), (cc) => P.lifterSide(cc, 0, 130, 0.5, 'stand', { smile: true }));
      P.label(c, 'Back pain improved: about the same', W / 2, 1010, pop(t, L(6) + 1.5), { color: PAL.mint, size: 28 }); } } },
  { at: L(7) - 0.2, name: 'form', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2); P.lifterSide(c, 250, H * 0.88, 1.2, 'hinge', { k, bar: true, smile: true });
    const e = pop(t, L(9) - 0.2); ['Bar close to legs', 'Back flat', 'Push the floor away', 'Start light'].forEach((s, i) => P.check(c, s, 470, 300 + i * 100, true, pop(t, L(7) + i * 0.9 + (i === 3 ? 0.6 : 0)) * (1 - e), 28)); A.next(c, t, 'BENCH PRESS'); } },
]; }, sfx: (A) => [['thud', 0.6, { gain: 0.4 }], ['blip', A.L(2), { f: 'C6' }], ['blip', A.L(3), { f: 'E6' }], ['blip', A.L(4), { f: 'G6' }], ['error', A.L(5) + 0.3, { gain: 0.4 }], ['paper', A.L(6), { dur: 0.3 }], ['ding', A.L(6) + 1.5, { f: 'E6' }], ['pop', A.L(7), { f: 700 }], ['pop', A.L(7) + 0.9, { f: 780 }], ['pop', A.L(7) + 1.8, { f: 860 }]] });
