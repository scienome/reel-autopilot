// 009 Why #2: the pump (Schoenfeld & Contreras 2014; Sjogaard 1985)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.bgCells(c, W, H, t, PAL.pink, 3, 0.05); const pm = ramp(t, 0, L(1)) * 0.8 + 0.2 * Math.abs(Math.sin(t * 3));
    P.arm(c, W / 2 + 30, 720, 1.3, pm, t); A.hookTitle(c, ['The', 'PUMP?'], 'Why Does This Happen? #2'); } },
  { at: L(2) - 0.2, name: 'veins', tr: 'zoom', focus: [W / 2, 720], draw: (c, t) => { P.bg(c, W, H, 'night', t); P.bgCells(c, W, H, t, PAL.cyan, 4, 0.05);
    const sq = 0.5 + 0.5 * Math.sin(t * 4); P.vessel(c, -40, 420, W + 80, 110, t, { speed: 260, seed: 2 }); P.vessel(c, -40, 760, W + 80, 60 + 30 * sq, t, { speed: 60, seed: 5 });
    P.label(c, 'IN: fast', W / 2, 300, pop(t, L(3) - 0.2), { color: PAL.red }); P.label(c, 'OUT: squeezed, slow', W / 2, 880, pop(t, L(3) + 0.6), { color: PAL.blue });
    P.arrowFlat(c, 120, 420, 600, 420, pop(t, L(3), 0.6), PAL.yellow); P.arrowFlat(c, 600, 760, 420, 760, pop(t, L(3) + 0.8, 0.6), PAL.cyan, 14); } },
  { at: L(4) - 0.2, name: 'cells', tr: 'zoom', focus: [W / 2, 600], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const sw = ramp(t, L(5), L(6) - 0.3);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const x = 170 + i * 190, y = 470 + j * 230, r = 70 + 26 * sw; P.flat(c, P.circ(x, y, r), '#ff5a6c', { off: 8 }); P.fill(c, P.circ(x - 12, y - 10, 14), PAL.pink); }
    for (let i = 0; i < 9; i++) { const ph = (t * 0.8 + i / 9) % 1; if (sw > 0) P.drop(c, 60 + i * 70, 240 + ph * 120, 12, PAL.cyan); }
    P.label(c, 'Waste products', W / 2, 200, pop(t, L(4)) * (1 - pop(t, L(5) - 0.2)), { color: PAL.amber }); P.label(c, 'Water rushes in = SWELL', W / 2, 200, pop(t, L(5) - 0.1), { color: PAL.cyan }); } },
  { at: L(6) - 0.2, name: 'fade', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); const f = 1 - ramp(t, L(6), L(7) - 0.3); P.arm(c, W / 2 + 30, 760, 1.2, f, t); P.stopwatch(c, 560, 260, 80, ramp(t, L(6), L(7)), 'rest'); } },
  { at: L(7) - 0.2, name: 'debate', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.25, { arms: 'flex', bulk: 0.5, smile: true, blink: A.blink(t) });
    P.label(c, 'Pump = growth? DEBATED', W / 2, 180, pop(t, L(7)) * (1 - pop(t, L(8) - 0.2)), { color: PAL.amber, size: 32 }); P.qmarks(c, W / 2, 400, t, pop(t, L(7)) * (1 - pop(t, L(8) - 0.2)));
    P.label(c, 'Sign of HARD WORK', W / 2, 180, pop(t, L(8)) * (1 - pop(t, L(9) - 0.2)), { color: PAL.mint, size: 34 }); A.next(c, t, 'KNEE CRACKS'); } },
]; }, sfx: (A) => [['buzz', A.L(3), { dur: 0.4, f: 140, gain: 0.3 }], ['pop', A.L(5), { f: 700 }], ['sparkle', A.L(5) + 0.4, { n: 6 }], ['swish', A.L(6) + 0.6, { dur: 0.4 }], ['error', A.L(7) + 0.3, { gain: 0.3 }], ['ding', A.L(8), { f: 'E6' }]] });
