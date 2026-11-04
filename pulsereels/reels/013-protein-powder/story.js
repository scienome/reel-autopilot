// 013 Supplements 2: protein powder (Jager 2017 ISSN; Tang 2009; Morton 2018)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.glow(c, W / 2, 720, 300, PAL.amber, 0.3); P.tub(c, W / 2 - 80, 720 + Math.sin(t * 2) * 8, 1.6, PAL.ink, 'WHEY', 'protein'); P.scoop(c, 560, 920, 1.2, PAL.cream, -0.3);
    A.hookTitle(c, ['PROTEIN', 'POWDER?'], 'Supplement Series · Part 2'); } },
  { at: L(2) - 0.2, name: 'cheese', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.milk(c, 150, 600, 1.1); P.arrowFlat(c, 240, 600, 330, 600, pop(t, L(2) + 0.8), PAL.yellow);
    P.flat(c, P.poly([[360, 640], [480, 520], [480, 640]]), PAL.yellow, { off: 6 }); P.arrowFlat(c, 500, 600, 560, 600, pop(t, L(3)), PAL.yellow); if (pop(t, L(3)) > 0) P.tub(c, 620, 600, 0.6, PAL.ink, 'WHEY');
    P.label(c, 'Whey = leftover from cheese', W / 2, 200, pop(t, L(2)) * (1 - pop(t, L(3) + 1)), { color: PAL.amber, size: 30 }); P.label(c, 'Food, not magic', W / 2, 200, pop(t, L(3) + 1), { color: PAL.mint }); } },
  { at: L(4) - 0.2, name: 'leucine', tr: 'zoom', focus: [W / 2, 600], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.aminos(c, W / 2, 620, 220, t, [0], 1, true);
    P.label(c, 'Fast + leucine-rich', W / 2, 200, pop(t, L(4)), { color: PAL.amber }); P.bulb(c, W / 2, 620, 50, pop(t, L(4) + 1.5)); if (pop(t, L(4) + 1.5) > 0) P.muscleBelly(c, W / 2 + 70, 1090, 300, 100, 0, 0.5 + 0.5 * Math.sin(t * 5), t, { label: 'Building ON' }); } },
  { at: L(5) - 0.2, name: 'versus', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.versus(c, W / 2, 560, 660, 380, 'Shake', 'Chicken', pop(t, L(5)), 0, (cc) => P.scoop(cc, 0, 40, 0.9), (cc) => P.chicken(cc, 0, 50, 0.8));
    P.counter(c, '=', W / 2, 820, 120, pop(t, L(5) + 1.2), PAL.yellow); P.label(c, 'TOTAL per day matters', W / 2, 1000, pop(t, L(6)), { color: PAL.mint, size: 32 }); } },
  { at: L(7) - 0.2, name: 'choice', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 100, H * 0.86, 1.2, { arms: 'flex', bulk: 0.5, smile: true, blink: A.blink(t) }); P.shaker(c, W / 2 + 190, H * 0.62, 2);
    const e = pop(t, L(9) - 0.2); P.check(c, 'Enough from food? Skip it', W / 2, 200, true, pop(t, L(7)) * (1 - e), 28); P.check(c, 'Short? A shake tops up', W / 2, 300, true, pop(t, L(7) + 2) * (1 - e), 28);
    P.label(c, 'Lactose? Isolate or plant protein', W / 2, 400, pop(t, L(8)) * (1 - e), { color: PAL.amber, size: 26 }); A.next(c, t, 'CAFFEINE'); } },
]; }, sfx: (A) => [['pop', A.L(2) + 0.8, { f: 700 }], ['pop', A.L(3), { f: 800 }], ['ding', A.L(3) + 1, { f: 'E6' }], ['powerup', A.L(4) + 1.5, { gain: 0.5 }], ['stamp', A.L(5) + 1.2, { gain: 0.5 }], ['ding', A.L(6), { f: 'G6' }], ['pop', A.L(7), { f: 760 }], ['pop', A.L(7) + 2, { f: 860 }]] });
