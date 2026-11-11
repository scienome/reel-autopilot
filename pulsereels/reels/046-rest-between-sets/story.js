// 046 Muscle Building 11: rest between sets (Schoenfeld 2016; Singer 2024; Grgic 2017)
(function () {
P.reel({ merge: [['one minute', '1 min'], ['three minutes', '3 min'], ['three minute', '3 min'], ['two to three minutes', '2-3 min'], ['eight weeks', '8 weeks']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 80, H * 0.86, 1.2, { arms: 'down', pant: t * 6, sweat: true, blink: A.blink(t) }); P.ring(c, W / 2 + 170, 620, 90, (t * 0.25) % 1, 'REST', PAL.cyan);
    A.hookTitle(c, ['How Long To', 'REST?'], 'Muscle Building · Part 11', PAL.magenta, 70); } },
  { at: L(2) - 0.2, name: 'feel', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'down', pant: t * 6, wince: 0.5, blink: A.blink(t) }); P.sweat(c, W / 2, 560, t, 1, 1);
    P.label(c, 'Sweaty ≠ growth', W / 2, 220, pop(t, L(2) + 3), { color: PAL.red }); } },
  { at: L(3) - 0.2, name: 'study', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.ring(c, 220, 520, 110, ramp(t, L(3), L(3) + 2) * 0.33, '1 MIN', PAL.red); P.ring(c, 500, 520, 110, ramp(t, L(3), L(3) + 2), '3 MIN', PAL.mint);
    P.calendar(c, W / 2, 870, 0.9, '8 WEEKS', 'trained men', pop(t, L(3) + 2)); } },
  { at: L(4) - 0.2, name: 'result', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.bg(c, W, H, 'violet', t); const k = ramp(t, L(4), L(4) + 3); P.meter(c, 230, 1000, 150, 460, 0.45, PAL.red, '1 min'); P.meter(c, 490, 1000, 150, 460, 0.45 + 0.3 * k, PAL.mint, '3 min');
    P.label(c, 'More reps · strength · muscle', W / 2, 220, pop(t, L(4) + 1), { color: PAL.mint, size: 28 }); P.sparkles(c, 490, 600, 120, t, k, 3); } },
  { at: L(5) - 0.2, name: 'short', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 3); P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'bar', arms2: 'press', mix: k * 0.5, bar: true, wince: 0.9, blink: A.blink(t) });
    P.reps(c, W / 2, 260, Math.min(5, Math.floor(ramp(t, L(5), L(5) + 3) * 6)), 10); P.label(c, 'Fewer good reps', W / 2, 380, pop(t, L(5) + 2), { color: PAL.red }); } },
  { at: L(6) - 0.2, name: 'rule', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 80, H * 0.86, 1.15, { arms: 'down', smile: true, blink: A.blink(t) }); P.person(c, W / 2 + 190, H * 0.86, 0.9, 'coach', { talk: A.talk(t), arms: 'down', look: -0.5 });
    P.ring(c, W / 2, 330, 110, ramp(t, L(6) + 2, L(6) + 5), '2-3 MIN', PAL.mint); P.label(c, 'Big lifts', W / 2, 500, pop(t, L(6) + 3), { color: PAL.mint, size: 28 }); if (t > L(7) - 0.3) A.next(c, t, 'DELOAD WEEKS'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['tock', 0.3, { f: 500 }], ['error', A.L(2) + 3, { gain: 0.3 }], ['tock', A.L(3), { f: 600 }], ['powerup', A.L(4), { gain: 0.4 }], ['sparkle', A.L(4) + 2, { n: 6 }], ['buzz', A.L(5) + 2, { dur: 0.4, f: 120, gain: 0.3 }], ['ding', A.L(6) + 2, { f: 'E6' }]] });
