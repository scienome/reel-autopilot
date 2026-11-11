// 038 Muscle Building 9: recomposition (Longland 2016; Barakat 2020; Helms 2014)
(function () {
P.reel({ merge: [['four weeks', '4 weeks']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const b = 0.5 + 0.5 * Math.sin(t * 2); P.lifter(c, W / 2, H * 0.86, 1.35, { arms: 'flex', bulk: 0.2 + 0.4 * b, belly: 0.6 * (1 - b), smile: true, blink: A.blink(t) }); P.qmarks(c, W / 2, 520, t, 1);
    A.hookTitle(c, ['Lose Fat AND', 'BUILD MUSCLE?'], 'Muscle Building · Part 9', PAL.magenta, 60); } },
  { at: L(2) - 0.2, name: 'recomp', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.verdict(c, W / 2, 330, true, pop(t, L(2)), 1.1);
    P.title(c, ['RECOMPOSITION'], W / 2, 560, pop(t, L(2) + 0.6), { size: 64, color: PAL.mint }); const k = ramp(t, L(2) + 0.5, L(3) + 1); P.lifter(c, W / 2, H * 0.92, 1.0, { arms: 'flex', bulk: 0.1 + 0.5 * k, belly: 0.6 * (1 - k), smile: true, blink: A.blink(t) }); } },
  { at: L(3) - 0.2, name: 'study', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.calendar(c, W / 2, 330, 1.0, '4 WEEKS', 'eat less, train hard', pop(t, L(3)));
    const k = ramp(t, L(4), L(4) + 2.5); P.meter(c, 230, 1000, 150, 420, 0.5 + 0.12 * k, PAL.mint, 'Muscle'); P.meter(c, 490, 1000, 150, 420, 0.75 - 0.35 * k, PAL.amber, 'Fat');
    P.counter(c, '+1.2 kg', 230, 520, 54, pop(t, L(4) + 1.5), PAL.mint); P.counter(c, '-4.8 kg', 490, 520, 54, pop(t, L(4) + 2.6), PAL.amber); } },
  { at: L(5) - 0.2, name: 'who', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.person(c, W / 2 + 175, H * 0.86, 0.95, 'coach', { talk: A.talk(t), arms: 'down', look: -0.5 }); P.lifter(c, W / 2 - 95, H * 0.86, 1.0, { arms: 'down', smile: true, blink: A.blink(t) });
    P.check(c, 'Beginners', W / 2, 190, true, pop(t, L(5) + 0.6), 28); P.check(c, 'Back after a break', W / 2, 280, true, pop(t, L(5) + 1.6), 28); P.check(c, 'More fat to lose', W / 2, 370, true, pop(t, L(5) + 2.8), 28); } },
  { at: L(6) - 0.2, name: 'recipe', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { A.dive(c, t, L(6) + 0.2, [W / 2, 700], (cc) => { P.gym(cc, W, H, t); P.lifter(cc, W / 2, H * 0.86, 1.3, { arms: 'bar', squat: 0.5 - 0.5 * Math.cos(t * 3), bar: true, blink: A.blink(t) }); },
      (cc) => { P.bg(cc, W, H, 'plum', t); P.bgCells(cc, W, H, t, PAL.pink, 3, 0.05); P.muscleBelly(cc, W / 2, 640, 460, 160, 0.05, 0.5 - 0.5 * Math.cos(t * 3), t, { col: '#e8475b' }); });
    P.label(c, 'Lift heavy', W / 2, 190, pop(t, L(6)), { color: PAL.red }); P.label(c, 'Lots of protein', W / 2, 270, pop(t, L(6) + 1.2), { color: PAL.amber }); P.label(c, 'Small deficit', W / 2, 350, pop(t, L(6) + 2.6), { color: PAL.mint }); } },
  { at: L(7) - 0.2, name: 'lean', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'flex', bulk: 0.9, smile: false, blink: A.blink(t) }); P.label(c, 'Lean + experienced = slower', W / 2, 200, pop(t, L(7)), { color: PAL.amber, size: 28 });
    P.label(c, 'Bulk and cut', W / 2, 290, pop(t, L(7) + 2.4), { color: PAL.blue, size: 28 }); if (t > L(8) - 0.3) A.next(c, t, 'BEGINNER GAINS'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['ding', A.L(2), { f: 'E6' }], ['paper', A.L(3), { dur: 0.3 }], ['pop', A.L(4) + 1.5, { f: 800 }], ['pop', A.L(4) + 2.6, { f: 900 }], ['pop', A.L(5) + 0.6, { f: 700 }], ['pop', A.L(5) + 1.6, { f: 800 }], ['pop', A.L(5) + 2.8, { f: 900 }], ['powerup', A.L(6), { gain: 0.4 }]] });
