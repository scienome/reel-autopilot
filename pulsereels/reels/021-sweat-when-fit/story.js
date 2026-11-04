// 021 Why #6: fit people sweat more (Buono & Sjoholm 1988; Nadel 1974; Sawka 2007)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const dr = (cc, xr) => P.lifter(cc, W / 2, H * 0.86, 1.35, { run: t * 9, pant: t * 6, bulk: 0.4, blink: A.blink(t), xray: xr, work: { heart: 1, quads: 0.8, calves: 0.6 }, t }); P.xrayLens(c, W / 2, 820, 150, t, (cc) => dr(cc, false), (cc) => dr(cc, true), pop(t, 1.0, 0.4)); P.sweat(c, W / 2 - 160, 700, t, 1, 1); P.sweat(c, W / 2 + 160, 720, t, 1, 2);
    A.hookTitle(c, ['Fit People', 'SWEAT MORE?'], 'Why Does This Happen? #6'); } },
  { at: L(2) - 0.2, name: 'heat', tr: 'zoom', focus: [W / 2, 600], draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.bgCells(c, W, H, t, PAL.pink, 3, 0.05); const h = ramp(t, L(2), L(3));
    P.fiber(c, 60, 560, 420, 70, 0, { color: '#ff4a5c', seed: 3, slide: t * 12 }); P.glow(c, 270, 560, 300 * h, PAL.orange, 0.6 * h); P.thermometer(c, 600, 620, 1.0, 0.3 + 0.6 * h); P.label(c, 'Muscles make HEAT', W / 2, 200, pop(t, L(2)), { color: PAL.orange }); } },
  { at: L(3) - 0.2, name: 'evap', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.skinLayer(c, W / 2, 420, 600, t, 0.7, 0.3); for (let i = 0; i < 6; i++) { const ph = (t * 0.6 + i / 6) % 1; c.save(); c.globalAlpha = 1 - ph; P.puff(c, 120 + i * 95, 400 - ph * 160, 20, 1); c.restore(); }
    P.label(c, 'Evaporating sweat = cooling', W / 2, 220, pop(t, L(3)), { color: PAL.cyan, size: 30 }); } },
  { at: L(4) - 0.2, name: 'trained', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); const g = ramp(t, L(5), L(5) + 2);
    P.meter(c, 230, 820, 150, 440, 0.35, PAL.grey, 'Untrained'); P.meter(c, 490, 820, 150, 440, 0.35 + 0.5 * g, PAL.cyan, 'Trained');
    P.label(c, 'Training = better cooling', W / 2, 200, pop(t, L(4)) * (1 - pop(t, L(5) - 0.2)), { color: PAL.mint }); P.label(c, 'Sweats sooner + more', W / 2, 200, pop(t, L(5)), { color: PAL.cyan }); P.stopwatch(c, 490, 300, 50, g, ''); } },
  { at: L(6) - 0.2, name: 'longer', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 80, H * 0.86, 1.2, { run: t * 9, smile: true, blink: A.blink(t) }); P.thermometer(c, 590, 700, 0.9, 0.45 - 0.2 * ramp(t, L(6), L(7)));
    const e = pop(t, L(8) - 0.2); P.label(c, 'Cooler = go longer', W / 2, 180, pop(t, L(6)) * (1 - pop(t, L(7) - 0.2)), { color: PAL.mint }); P.bottle(c, 600, 400, 0.8, PAL.blue, 0.7 * (1 - e));
    P.check(c, 'Drink water', W / 2 - 60, 180, true, pop(t, L(7)) * (1 - e), 28); P.check(c, 'Long + hot? Replace salt', W / 2 - 60, 280, true, pop(t, L(7) + 1.4) * (1 - e), 26); A.next(c, t, 'LATE WORKOUT SLEEP'); } },
]; }, sfx: (A) => [['riser', A.L(2), { dur: 1, gain: 0.3 }], ['sparkle', A.L(3) + 0.5, { n: 6 }], ['ding', A.L(4), { f: 'E6' }], ['powerup', A.L(5), { gain: 0.4 }], ['pop', A.L(7), { f: 760 }], ['pop', A.L(7) + 1.4, { f: 860 }]] });
