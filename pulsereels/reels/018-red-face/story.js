// 018 Why #5: red face when lifting (MacDougall 1985; Charkoudian 2003)
(function () {
P.reel({ merge: [['over three hundred', 'over 300']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); const r = 0.4 + 0.6 * ramp(t, 0, 1.6); P.face(c, W / 2, 780, 1.6, { red: r, puff: r, t, wince: 0.4 }); P.sweat(c, W / 2 + 200, 600, t);
    A.hookTitle(c, ['Why The', 'RED FACE?'], 'Why Does This Happen? #5'); } },
  { at: L(1) - 0.15, name: 'two', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.counter(c, '2 things', W / 2, 600, 120, pop(t, L(1)), PAL.yellow); } },
  { at: L(2) - 0.2, name: 'brace', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.bgCells(c, W, H, t, PAL.pink, 3, 0.05); const up = ramp(t, L(3), L(4));
    P.face(c, 220, 520, 0.9, { puff: 1, red: 0.3 + up * 0.7, t }); P.gauge(c, 520, 520, 140, 0.25 + 0.7 * up, 'Blood pressure', up > 0.5 ? '↑↑' : '');
    P.label(c, 'Hold breath + brace', W / 2, 180, pop(t, L(2)), { color: PAL.amber }); P.counter(c, 'over 300', W / 2, 900, 100, pop(t, L(4) + 0.5), PAL.red); P.label(c, 'average, heavy leg press', W / 2, 1010, pop(t, L(4) + 0.9), { color: PAL.red, size: 26 }); } },
  { at: L(5) - 0.2, name: 'head', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.face(c, W / 2, 640, 1.4, { red: 1, puff: 0.6, t }); P.flow(c, W / 2, 1200, W / 2, 900, t, 1, PAL.red, 10); P.label(c, 'Blood backs up in your head', W / 2, 200, pop(t, L(5)), { color: PAL.red, size: 30 }); } },
  { at: L(6) - 0.2, name: 'heat', tr: 'zoom', focus: [W / 2, 500], draw: (c, t) => { P.bg(c, W, H, 'plum', t); const f = ramp(t, L(6) + 0.6, L(7)); P.skinLayer(c, W / 2, 380, 600, t, 0.2, f); P.thermometer(c, 600, 980, 0.9, 0.5 + 0.4 * f);
    P.label(c, 'Skin vessels open to dump heat', W / 2, 220, pop(t, L(6)), { color: PAL.amber, size: 28 }); } },
  { at: L(7) - 0.2, name: 'safe', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.person(c, W / 2 + 175, H * 0.86, 0.95, 'doc', { talk: A.talk(t), arms: 'down', look: -0.5 }); P.lifter(c, W / 2 - 95, H * 0.86, 1.10, { arms: 'flex', smile: true, blink: A.blink(t) }); const e = pop(t, L(8) - 0.2);
    P.check(c, 'Harmless for most, fades in minutes', W / 2, 200, true, pop(t, L(7)) * (1 - e), 26); P.bubble(c, 'Heart or BP problems? Ask a doctor', W / 2, 330, pop(t, L(7) + 2.2) * (1 - e), { color: PAL.red }); A.next(c, t, 'FIT = MORE SWEAT'); } },
]; }, sfx: (A) => [['buzz', 0.8, { dur: 0.7, f: 110, gain: 0.3 }], ['pop', A.L(1), { f: 760 }], ['riser', A.L(3), { dur: 1.2, gain: 0.4 }], ['stamp', A.L(4) + 0.5, { gain: 0.6 }], ['whoosh', A.L(5), { dur: 0.5 }], ['sparkle', A.L(6) + 0.8, { n: 5 }], ['ding', A.L(7), { f: 'E6' }], ['error', A.L(7) + 2.2, { gain: 0.3 }]] });
