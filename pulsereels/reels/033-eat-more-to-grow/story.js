// 033 Muscle Building 7: calorie surplus (Iraki 2019; Garthe 2013; Barakat 2020)
(function () {
P.reel({ merge: [['a quarter to half a percent', '0.25-0.5%'], ['eighty kilo', '80 kg'], ['two to four hundred grams', '200-400 g']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 80, H * 0.86, 1.3, { arms: 'flex', bulk: 0.3 + 0.2 * Math.sin(t), blink: A.blink(t) }); P.platePie(c, 560, 720, 110, [[0.4, PAL.green, ''], [0.35, '#f1c07a', ''], [0.25, PAL.bone, '']], 1);
    A.hookTitle(c, ['Eat MORE', 'To Grow?'], 'Muscle Building · Part 7'); } },
  { at: L(2) - 0.2, name: 'energy', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.battery(c, W / 2, 540, 2.0, 0.4 + 0.3 * Math.sin(t * 2), PAL.amber); P.label(c, 'New muscle costs energy', W / 2, 220, pop(t, L(2)), { color: PAL.amber });
    const k = pop(t, L(3)); if (k > 0) { P.progress(c, W / 2, 820, 520, 0.6, PAL.blue, 'burn'); P.progress(c, W / 2, 900, 520, 0.6 + 0.12 * ramp(t, L(3), L(3) + 1.5), PAL.mint, 'eat'); P.label(c, 'A little more = SURPLUS', W / 2, 1040, pop(t, L(3) + 2.2), { color: PAL.mint }); } } },
  { at: L(4) - 0.2, name: 'bigger', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); const b = ramp(t, L(4), L(4) + 2);
    P.lifter(c, 200, 1000, 1.0, { arms: 'flex', bulk: 0.5, smile: true, blink: 0 }); P.lifter(c, 520, 1000, 1.0, { arms: 'down', bulk: 0.5, belly: 0.2 + 0.7 * b, blink: 0 });
    P.label(c, 'Small surplus', 200, 560, pop(t, L(4)), { color: PAL.mint, size: 26 }); P.label(c, 'Big surplus = mostly fat', 500, 560, pop(t, L(4) + 1), { color: PAL.red, size: 26 }); P.label(c, 'Athletes study: more fat, not clearly more muscle', W / 2, 220, pop(t, L(5)), { color: PAL.amber, size: 24 }); } },
  { at: L(6) - 0.2, name: 'target', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.counter(c, '0.25-0.5%', W / 2, 300, 96, pop(t, L(6) + 0.8), PAL.yellow); P.label(c, 'of body weight per week', W / 2, 410, pop(t, L(6) + 1.2), { color: PAL.amber });
    P.counter(c, '80 kg → 200-400 g', W / 2, 700, 60, pop(t, L(7) + 0.4), PAL.cyan); P.lineChart(c, 140, 1180, 440, 260, [0.2, 0.3, 0.38, 0.47, 0.55, 0.64], ramp(t, L(7), L(8)), PAL.mint, 'slow, steady'); } },
  { at: L(8) - 0.2, name: 'beginners', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.2, { arms: 'flex', bulk: 0.3, belly: 0.3, smile: true, blink: A.blink(t) }); const e = pop(t, L(9) - 0.2);
    P.check(c, 'Beginners or extra fat: no surplus needed', W / 2, 220, true, pop(t, L(8)) * (1 - e), 24); A.next(c, t, 'THE ONE RULE'); } },
]; }, sfx: (A) => [['pop', 0.4, { f: 760 }], ['powerup', A.L(2), { gain: 0.4 }], ['ding', A.L(3) + 2.2, { f: 'E6' }], ['error', A.L(4) + 1, { gain: 0.3 }], ['paper', A.L(5), { dur: 0.3 }], ['pop', A.L(6) + 0.8, { f: 820 }], ['pop', A.L(7) + 0.4, { f: 900 }], ['ding', A.L(8), { f: 'G6' }]] });
