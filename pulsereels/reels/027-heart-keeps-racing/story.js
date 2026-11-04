// 027 Why #8: heart keeps racing after exercise (Borsheim & Bahr 2003; Cole 1999; Imai 1994)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const dr = (cc, xr) => P.lifter(cc, 230, H * 0.86, 1.25, { arms: 'down', pant: t * 6, wince: 0.3, blink: A.blink(t), xray: xr, work: { heart: 1 }, t }); P.xrayLens(c, 230, 830, 130, t, (cc) => dr(cc, false), (cc) => dr(cc, true), pop(t, 0.8, 0.4)); P.heart(c, 540, 640, 90, t * 2.2); P.ecg(c, 380, 880, 320, 140, t, 160, PAL.red);
    A.hookTitle(c, ['Why Does Your', 'HEART RACE?'], 'Why Does This Happen? #8', PAL.magenta, 64); } },
  { at: L(1) - 0.15, name: 'notover', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.title(c, ['Workout', "Isn't Over"], W / 2, 400, pop(t, L(1)), { size: 74, color: PAL.cyan }); P.heart(c, W / 2, 800, 110, t * 2); } },
  { at: L(2) - 0.2, name: 'refill', tr: 'zoom', focus: [W / 2, 600], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const d = ramp(t, L(2), L(3)), r = ramp(t, L(3) + 0.5, L(4));
    P.battery(c, W / 2, 520, 2, Math.max(0.05, 1 - 0.9 * d + 0.85 * r), d > 0.6 && r < 0.4 ? PAL.red : PAL.mint); P.flow(c, 120, 900, W / 2 - 60, 600, t, r, PAL.cyan, 8); P.heart(c, 150, 960, 60, t * 2.2);
    P.label(c, 'Fast energy + oxygen used up', W / 2, 200, pop(t, L(2)) * (1 - pop(t, L(3) - 0.2)), { color: PAL.red, size: 28 }); P.label(c, 'Extra oxygen to refill', W / 2, 200, pop(t, L(3)), { color: PAL.cyan }); } },
  { at: L(4) - 0.2, name: 'heat', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.thermometer(c, 200, 640, 1.1, 0.8 - 0.4 * ramp(t, L(4), L(5))); P.vessel(c, 300, 600, 380, 60, t, { speed: 240, seed: 3 }); for (let i = 0; i < 5; i++) P.molecule(c, 340 + i * 70, 760 + Math.sin(t * 3 + i) * 20, 0.8, 'co2', t + i, 1);
    P.label(c, 'Moving heat + clearing waste', W / 2, 220, pop(t, L(4)), { color: PAL.amber, size: 30 }); } },
  { at: L(5) - 0.2, name: 'drop', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.lineChart(c, 70, 760, 580, 460, [0.95, 0.62, 0.48, 0.4, 0.35, 0.32, 0.3], ramp(t, L(5), L(6)), PAL.red, 'heart rate after you stop');
    const f = ramp(t, L(6), L(6) + 1.5); if (f > 0) P.lineChart(c, 70, 760, 580, 460, [0.95, 0.45, 0.3, 0.24, 0.22, 0.21, 0.2], f, PAL.mint, ''); P.label(c, 'Fitter = faster drop', W / 2, 1060, pop(t, L(6) + 0.5), { color: PAL.mint }); } },
  { at: L(7) - 0.2, name: 'doctors', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.ring(c, W / 2, 560, 170, 1 - ramp(t, L(7), L(8)), '1 min'); P.heart(c, W / 2, 900, 70, t * 1.6);
    P.label(c, 'Doctors check the first minute', W / 2, 220, pop(t, L(7)) * (1 - pop(t, L(8) - 0.2)), { color: PAL.cyan, size: 28 }); A.next(c, t, 'ONE SIDE STRONGER'); } },
]; }, sfx: (A) => [['thud', 0.3, { gain: 0.4 }], ['thud', 0.75, { gain: 0.4 }], ['thud', 1.2, { gain: 0.4 }], ['pop', A.L(1), { f: 700 }], ['error', A.L(2) + 1, { gain: 0.3 }], ['powerup', A.L(3) + 0.5, { gain: 0.5 }], ['sparkle', A.L(4) + 0.5, { n: 5 }], ['ding', A.L(6) + 0.5, { f: 'E6' }], ['tock', A.L(7), { f: 600 }]] });
