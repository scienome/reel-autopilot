// 024 Why #7: evening exercise and sleep (Stutz 2019; Frimpong 2021)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.moon(c, 590, 420, 60); P.clock(c, 150, 430, 80, 21, 30 + t * 10); P.bed(c, W / 2, 1000, 1.1, t); A.hookTitle(c, ['Late Workout', '= NO SLEEP?'], 'Why Does This Happen? #7', PAL.magenta, 66); } },
  { at: L(1) - 0.15, name: 'mostly', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.verdict(c, W / 2, 520, false, pop(t, L(1) + 1.2), 1.6); P.label(c, 'Research: mostly NO', W / 2, 800, pop(t, L(1) + 1.6), { color: PAL.mint, size: 36 }); } },
  { at: L(2) - 0.2, name: 'review', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.moon(c, 590, 300, 50); P.bed(c, W / 2, 860, 1.2, t); P.label(c, 'Big review of evening exercise', W / 2, 200, pop(t, L(2)), { color: PAL.blue, size: 28 });
    P.check(c, 'Slept just as well', W / 2, 1060, true, pop(t, L(3)), 28); P.label(c, 'some slept a bit deeper', W / 2, 1150, pop(t, L(3) + 1.6), { color: PAL.cyan, size: 24 }); } },
  { at: L(4) - 0.2, name: 'exception', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.clock(c, 200, 430, 100, 22, 30, 'workout ends'); P.clock(c, 520, 430, 100, 23, 0, 'bed');
    P.label(c, 'Very hard + under 1 h before bed', W / 2, 220, pop(t, L(4)), { color: PAL.red, size: 28 }); P.face(c, W / 2, 1080, 0.55, { shock: 0.6, t }); P.label(c, 'Takes longer to fall asleep', W / 2, 760, pop(t, L(5)), { color: PAL.amber, size: 26 }); } },
  { at: L(6) - 0.2, name: 'cool', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); const k = ramp(t, L(6), L(7)); P.thermometer(c, 170, 640, 1.1, 0.8 - 0.5 * k); P.ecg(c, 300, 620, 360, 180, t, 140 - 70 * k, PAL.mint);
    P.label(c, 'Cool down + calm heart rate', W / 2, 220, pop(t, L(6)), { color: PAL.cyan, size: 30 }); } },
  { at: L(7) - 0.2, name: 'rule', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.bed(c, W / 2, 1000, 1.0, t); const e = pop(t, L(8) - 0.2);
    P.check(c, 'Finish hard training 1 h+ before bed', W / 2, 200, true, pop(t, L(7)) * (1 - e), 24); P.coffee(c, 200, 520, 0.7, t); P.stampX(c, 200, 500, 70, pop(t, L(7) + 2.6) * (1 - e)); P.label(c, 'Late pre-workout caffeine', 440, 520, pop(t, L(7) + 2.6) * (1 - e), { color: PAL.amber, size: 24 }); A.next(c, t, 'RACING HEART'); } },
]; }, sfx: (A) => [['tock', 0.4, { f: 600 }], ['tock', 1.4, { f: 600 }], ['stamp', A.L(1) + 1.2, { gain: 0.6 }], ['ding', A.L(3), { f: 'E6' }], ['error', A.L(4), { gain: 0.3 }], ['tock', A.L(5), { f: 500 }], ['sparkle', A.L(6) + 1, { n: 5 }], ['pop', A.L(7), { f: 760 }], ['stamp', A.L(7) + 2.6, { gain: 0.5 }]] });
