// 019 Supplements 3: caffeine (Guest 2021 ISSN; Fredholm 1999; Drake 2013)
(function () {
P.reel({ merge: [['three to six milligrams per kilo', '3-6 mg/kg']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 90, H * 0.86, 1.3, { arms: 'bar', arms2: 'press', mix: 0.5 - 0.5 * Math.cos(t * 3), bar: true, blink: A.blink(t) }); P.coffee(c, 560, 780, 1.1, t);
    A.hookTitle(c, ['Does CAFFEINE', 'Make You Stronger?'], 'Supplement Series · Part 3', PAL.magenta, 58); } },
  { at: L(2) - 0.2, name: 'adenosine', tr: 'zoom', focus: [W / 2, 500], draw: (c, t) => { P.bg(c, W, H, 'night', t); P.bgCells(c, W, H, t, PAL.grape, 3, 0.05); c.save(); c.translate(W / 2, 330); c.scale(1.4, 1.4); P.brain(c, 0, 0, 80); c.restore();
    P.receptor(c, W / 2, 900, 1.1, 'adenosine', ramp(t, L(2) + 0.8, L(2) + 2.2)); P.label(c, 'Adenosine = tired signal', W / 2, 560, pop(t, L(2) + 0.6), { color: PAL.grape, size: 30 }); } },
  { at: L(3) - 0.2, name: 'block', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.bgCells(c, W, H, t, PAL.amber, 3, 0.05); P.receptor(c, W / 2, 820, 1.2, 'caffeine', ramp(t, L(3) + 0.8, L(3) + 2));
    const ad = pop(t, L(3) + 2.2); if (ad > 0) { P.flat(c, P.circ(560, 420, 46), PAL.grape, { off: 5 }); P.stampX(c, 560, 420, 60, ad); }
    P.label(c, 'Caffeine blocks the spot', W / 2, 220, pop(t, L(3) + 0.6), { color: PAL.amber }); P.label(c, 'Less tired, sets feel easier', W / 2, 220, pop(t, L(4)), { color: PAL.mint, size: 30 }); } },
  { at: L(5) - 0.2, name: 'boost', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); [['Strength', 0.6], ['Power', 0.65], ['Endurance', 0.7]].forEach(([n, v], i) => P.progress(c, W / 2, 400 + i * 120, 520, v * ramp(t, L(5) + i * 0.4, L(5) + 1.5 + i * 0.4), [PAL.red, PAL.amber, PAL.cyan][i], n));
    P.label(c, 'Small, real boosts', W / 2, 220, pop(t, L(5)), { color: PAL.mint }); P.evidence(c, W / 2, 900, 3, pop(t, L(5) + 1.5)); } },
  { at: L(6) - 0.2, name: 'dose', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.coffee(c, 200, 600, 1.3, t); P.counter(c, '3-6 mg/kg', 470, 520, 70, pop(t, L(6) + 0.6), PAL.cyan); P.clock(c, 470, 760, 90, 9, 0, '~1 h before'); } },
  { at: L(7) - 0.2, name: 'caution', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); const e = pop(t, L(9) - 0.2);
    P.face(c, 200, 620, 0.8, { shock: 1, sweat: true, t }); P.ecg(c, 380, 620, 290, 140, t, 140, PAL.red); P.label(c, 'Start low: jitters, racing heart', W / 2, 220, pop(t, L(7)) * (1 - e), { color: PAL.red, size: 28 });
    P.moon(c, 590, 1080, 60); P.check(c, 'Not late in the day', 290, 1080, false, pop(t, L(8)) * (1 - e), 26); A.next(c, t, 'BCAAs'); } },
]; }, sfx: (A) => [['pop', A.L(2) + 0.6, { f: 640 }], ['tock', A.L(2) + 2.2, { f: 400 }], ['tock', A.L(3) + 2, { f: 700 }], ['stamp', A.L(3) + 2.2, { gain: 0.6 }], ['powerup', A.L(4), { gain: 0.5 }], ['ding', A.L(5) + 1.5, { f: 'E6' }], ['pop', A.L(6) + 0.6, { f: 820 }], ['buzz', A.L(7) + 0.5, { dur: 0.5, f: 160, gain: 0.3 }], ['error', A.L(8), { gain: 0.3 }]] });
