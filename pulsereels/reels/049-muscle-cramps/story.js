// 049 Why #12: muscle cramps (Schwellnus 2009; Miller 2010 MSSE; Miller 2010 JAT)
(function () {
P.reel({ merge: [['eighty five seconds', '85 s']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.35, { arms: 'down', wince: 1, shock: 0.5, blink: A.blink(t) }); P.zap(c, W / 2 + 40, H * 0.8, 70, t, 3, 5, PAL.red);
    A.hookTitle(c, ['Why Do Muscles', 'CRAMP?'], 'Why Does This Happen? #12', PAL.magenta, 68); } },
  { at: L(2) - 0.2, name: 'salt', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.bottle(c, 220, 620, 1.2, PAL.cyan, 0.6); P.banana(c, 500, 620, 1.3, 0.3);
    P.label(c, 'Salt? Water? Bananas?', W / 2, 220, pop(t, L(2)), { color: PAL.amber }); P.evidence(c, W / 2, 900, 1, pop(t, L(2) + 2.6)); } },
  { at: L(3) - 0.2, name: 'signals', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const k = ramp(t, L(3) + 1, L(3) + 5);
    P.neuron(c, 120, 300, 560, 640, t, 0.4 + 0.6 * k, 4 + Math.floor(k * 6), PAL.red); P.neuron(c, 600, 300, 160, 640, t, 1 - 0.85 * k, 3, PAL.mint);
    P.label(c, 'ON signal: louder', 200, 220, pop(t, L(3) + 1.5), { color: PAL.red, size: 26 }); P.label(c, 'OFF signal: weaker', 520, 220, pop(t, L(3) + 3.5), { color: PAL.mint, size: 26 });
    P.muscleBelly(c, W / 2, 900, 360, 120, 0, 0.3 + 0.7 * k, t, { col: '#e8475b' }); } },
  { at: L(4) - 0.2, name: 'stuck', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'plum', t); const j = Math.sin(t * 35) * 4; P.muscleBelly(c, W / 2 + j, 640, 360, 200, 0, 1, t, { col: '#e8475b', label: 'Calf' }); P.zap(c, W / 2, 640, 180, t, 6, 6, PAL.yellow);
    P.title(c, ['STUCK ON'], W / 2, 260, pop(t, L(4)), { size: 80, color: PAL.red }); } },
  { at: L(5) - 0.2, name: 'pickle', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.flat(c, P.rr(W / 2 - 70, 400, 140, 240, 40), '#7cbf4a', { off: 6 }); P.flat(c, P.rr(W / 2 - 60, 380, 120, 40, 10), '#3f7f2a', { off: 4 });
    P.stopwatch(c, 200, 840, 80, ramp(t, L(5) + 2, L(5) + 5) * 0.63, '85 s', PAL.mint); P.stopwatch(c, 520, 840, 80, ramp(t, L(5) + 2, L(5) + 5), '134 s', PAL.cyan);
    P.label(c, 'Pickle juice', 200, 980, pop(t, L(5) + 2), { color: PAL.mint, size: 26 }); P.label(c, 'Water', 520, 980, pop(t, L(5) + 2.4), { color: PAL.cyan, size: 26 }); } },
  { at: L(6) - 0.2, name: 'reflex', tr: 'zoom', focus: [W / 2, 520], draw: (c, t) => { P.bg(c, W, H, 'night', t); P.glow(c, W / 2, 420, 160, PAL.pink, 0.5); P.brain(c, W / 2, 420, 100); P.stomach(c, W / 2 + 160, 860, 0.9, 0.5);
    P.flow(c, W / 2, 520, W / 2, 1000, t, pop(t, L(6) + 2), PAL.yellow, 10); P.label(c, 'Too fast to be the salt', W / 2, 200, pop(t, L(6)), { color: PAL.amber, size: 28 }); P.label(c, 'A taste reflex?', W / 2, 640, pop(t, L(6) + 2.6), { color: PAL.yellow }); } },
  { at: L(7) - 0.2, name: 'fix', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifterSide(c, W / 2 - 40, H * 0.88, 1.4, 'stand', { smile: true }); P.arcArrow(c, W / 2 - 40, H * 0.84, 80, Math.PI * 1.1, Math.PI * 1.7, pop(t, L(7) + 0.5), PAL.yellow);
    P.label(c, 'Gently stretch it', W / 2, 220, pop(t, L(7)), { color: PAL.mint }); P.label(c, 'OFF signal back on', W / 2, 310, pop(t, L(7) + 2.5), { color: PAL.mint, size: 28 }); if (t > L(8) - 0.3) A.next(c, t, 'SORE 2 DAYS LATER'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['buzz', 0.4, { dur: 0.6, f: 110, gain: 0.3 }], ['stamp', A.L(2) + 2.6, { gain: 0.4 }], ['powerup', A.L(3) + 1.5, { gain: 0.3 }], ['glitch', A.L(4), { gain: 0.5 }], ['tock', A.L(5) + 2, { f: 500 }], ['ding', A.L(5) + 4.2, { f: 'E6' }], ['sparkle', A.L(6) + 2.6, { n: 5 }], ['success', A.L(7) + 2.5]] });
