// 037 Why #9: one side stronger (Munn 2004; Manca 2017; Carroll 2006)
(function () {
P.reel({ merge: [['eight percent', '8%']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 3); P.lifter(c, W / 2, H * 0.86, 1.35, { arms: 'press', mix: k, wince: 0.6, blink: A.blink(t) }); P.zap(c, W / 2 - 130, H * 0.55, 60, t, 2, 3); P.qmarks(c, W / 2, 520, t, 1);
    A.hookTitle(c, ['Why Is One Side', 'STRONGER?'], 'Why Does This Happen? #9', PAL.magenta, 62); } },
  { at: L(2) - 0.2, name: 'brain', tr: 'zoom', focus: [W / 2, 560], draw: (c, t) => { P.bg(c, W, H, 'night', t); P.bgCells(c, W, H, t, '#ffffff', 2, 0.05); P.glow(c, W / 2, 470, 200, PAL.pink, 0.5); P.brain(c, W / 2, 470, 120);
    const k = ramp(t, L(3), L(3) + 2); P.neuron(c, W / 2 - 40, 560, 150, 1000, t, k, 6, PAL.yellow); P.neuron(c, W / 2 + 40, 560, 570, 1000, t, k * 0.35, 2, PAL.cyan);
    P.label(c, 'Strong side: busy signal', 170, 1060, pop(t, L(3) + 1), { color: PAL.yellow, size: 24 }); P.label(c, 'Weak side: quieter', 560, 1060, pop(t, L(3) + 1.6), { color: PAL.cyan, size: 24 }); P.label(c, "It's your BRAIN", W / 2, 220, pop(t, L(2) + 1), { color: PAL.pink }); } },
  { at: L(4) - 0.2, name: 'shake', tr: 'slide', draw: (c, t) => { A.xrayRep(c, t, 'frontpress', { shoulders: 1, triceps: 0.8, chest: 0.4 }, { map: 'front' }); const sh = Math.sin(t * 40) * 6; P.zap(c, W / 2 - 150 + sh, 500, 50, t, 4, 3, PAL.red); P.label(c, 'Weak side shakes first', W / 2, 200, pop(t, L(4)), { color: PAL.red }); } },
  { at: L(5) - 0.2, name: 'fix', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 3); P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'down', arms2: 'curl', mix: k, smile: true, blink: A.blink(t) });
    P.check(c, 'One side at a time', W / 2, 190, true, pop(t, L(5)), 28); P.check(c, 'Weak side first', W / 2, 280, true, pop(t, L(5) + 1.2), 28); P.check(c, 'Match the reps', W / 2, 370, true, pop(t, L(5) + 2.4), 28); } },
  { at: L(6) - 0.2, name: 'cross', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05);
    P.arm(c, 210, 680, 0.5, ramp(t, L(6), L(6) + 2), t); P.arm(c, 510, 680, 0.5, ramp(t, L(6) + 2.5, L(7) + 1) * 0.4, t);
    P.label(c, 'Trained arm', 210, 900, pop(t, L(6)), { color: PAL.mint, size: 26 }); P.label(c, 'Untrained arm', 510, 900, pop(t, L(6) + 1), { color: PAL.cyan, size: 26 });
    P.counter(c, '+8%', 510, 380, 110, pop(t, L(6) + 3.2), PAL.yellow); P.brain(c, W / 2, 1080, 60); P.label(c, 'Brain learns both sides', W / 2, 200, pop(t, L(7)), { color: PAL.pink, size: 30 }); } },
  { at: L(8) - 0.2, name: 'next', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'flex', bulk: 0.4, smile: true, blink: A.blink(t) }); A.next(c, t, 'SICK AFTER LEG DAY'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['powerup', A.L(3), { gain: 0.4 }], ['buzz', A.L(4), { dur: 0.5, f: 120, gain: 0.3 }], ['pop', A.L(5), { f: 700 }], ['pop', A.L(5) + 1.2, { f: 800 }], ['pop', A.L(5) + 2.4, { f: 900 }], ['ding', A.L(6) + 3.2, { f: 'E6' }], ['sparkle', A.L(7), { n: 6 }]] });
