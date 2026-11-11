// 053 Why #13: DOMS timing (Cheung 2003; Hody 2019; McHugh 2003)
(function () {
P.reel({ merge: [['d o m s', 'DOMS'], ['one to three days', '1-3 days']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.35, { arms: 'down', wince: 0.9, blink: A.blink(t) }); P.zap(c, W / 2, H * 0.75, 90, t, 3, 4, PAL.red); P.calendar(c, 560, 520, 0.7, 'DAY 2', '', 1);
    A.hookTitle(c, ['Sore 2 Days', 'LATER?'], 'Why Does This Happen? #13', PAL.magenta, 70); } },
  { at: L(2) - 0.2, name: 'name', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.title(c, ['DOMS'], W / 2, 520, pop(t, L(2) + 0.5), { size: 140, color: PAL.yellow });
    P.label(c, 'Delayed Onset Muscle Soreness', W / 2, 720, pop(t, L(2) + 1.5), { color: PAL.cyan, size: 26 }); } },
  { at: L(3) - 0.2, name: 'damage', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.bgCells(c, W, H, t, PAL.pink, 3, 0.05); P.fiber(c, 110, 640, 500, 70, 0, { color: '#ff4a5c', seed: 5, tears: [0.25, 0.5, 0.75], tearK: ramp(t, L(3), L(3) + 2) });
    P.label(c, 'Tiny damage', W / 2, 220, pop(t, L(3) + 1), { color: PAL.red }); } },
  { at: L(4) - 0.2, name: 'repair', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.fiber(c, 110, 560, 500, 70, 0, { color: '#ff4a5c', seed: 5, tears: [0.25, 0.5, 0.75], tearK: 1, heal: ramp(t, L(4), L(5)) });
    for (let i = 0; i < 4; i++) P.cellStar(c, 180 + i * 120, 680 + Math.sin(t * 2 + i) * 20, 26, t, { kind: 'immune' }); P.neuron(c, 120, 900, 600, 900, t, pop(t, L(4) + 2.5), 6, PAL.yellow);
    P.label(c, 'Repair + swelling', W / 2, 220, pop(t, L(4)), { color: PAL.mint }); P.label(c, 'Nerves extra sensitive', W / 2, 1040, pop(t, L(4) + 3), { color: PAL.yellow, size: 28 }); } },
  { at: L(5) - 0.2, name: 'peak', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.lineChart(c, 100, 960, 520, 480, [0.05, 0.3, 0.75, 0.9, 0.7, 0.35, 0.12], ramp(t, L(5), L(5) + 3), PAL.red, 'SORENESS');
    P.label(c, 'Peaks 1-3 days later', W / 2, 220, pop(t, L(5) + 2), { color: PAL.red }); } },
  { at: L(6) - 0.2, name: 'stairs', tr: 'slide', draw: (c, t) => { A.xrayRep(c, t, 'squatfront', { quads: 1, glutes: 0.6 }, { speed: 1.4, map: 'front' }); P.label(c, 'Lowering = most soreness', W / 2, 200, pop(t, L(6)), { color: PAL.amber, size: 28 }); P.label(c, 'Hello, stairs', W / 2, 290, pop(t, L(6) + 3), { color: PAL.red, size: 28 }); } },
  { at: L(7) - 0.2, name: 'adapt', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.4); P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'bar', squat: k, bar: true, smile: true, blink: A.blink(t) });
    P.label(c, 'Same workout again?', W / 2, 200, pop(t, L(7)), { color: PAL.blue }); P.label(c, 'Much less sore', W / 2, 290, pop(t, L(7) + 1.8), { color: PAL.mint }); if (t > L(8) - 0.3) A.next(c, t, 'DIZZY AFTER SQUATS'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['buzz', 0.5, { dur: 0.5, f: 110, gain: 0.3 }], ['stamp', A.L(2) + 0.5, { gain: 0.5 }], ['glitch', A.L(3) + 1, { gain: 0.4 }], ['powerup', A.L(4), { gain: 0.3 }], ['ding', A.L(5) + 2, { f: 'E6' }], ['error', A.L(6) + 3, { gain: 0.3 }], ['success', A.L(7) + 1.8]] });
