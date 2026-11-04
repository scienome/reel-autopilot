// 035 Muscle Building 8: progressive overload (Plotkin 2022; ACSM 2009)
(function () {
P.reel({ merge: [['eight to twelve', '8-12']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const dr = (cc, xr) => P.lifter(cc, W / 2, H * 0.86, 1.3, { arms: 'bar', arms2: 'press', mix: 0.5 - 0.5 * Math.cos(t * 3), bar: true, plate: PAL.red, blink: A.blink(t), xray: xr, work: { shoulders: 1, triceps: 0.7 }, t }); P.xrayLens(c, W / 2, 780, 160, t, (cc) => dr(cc, false), (cc) => dr(cc, true), pop(t, 1.0, 0.4));
    A.hookTitle(c, ['The ONE', 'RULE'], 'Muscle Building · Part 8'); P.arcArrow(c, 600, 520, 60, 2.6, 0.3, ramp(t, 0.5, 2)); } },
  { at: L(2) - 0.2, name: 'adapt', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.lineChart(c, 70, 820, 580, 460, [0.2, 0.45, 0.6, 0.66, 0.68, 0.68, 0.68], ramp(t, L(2), L(3) + 1.5), PAL.amber, 'same weight, same reps');
    P.label(c, 'Your body adapts', W / 2, 220, pop(t, L(2)), { color: PAL.cyan }); P.label(c, 'Growth signal fades', 470, 300, pop(t, L(3) + 1.5), { color: PAL.red, size: 26 }); } },
  { at: L(4) - 0.2, name: 'more', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.lineChart(c, 70, 820, 580, 460, [0.15, 0.25, 0.35, 0.45, 0.55, 0.66, 0.78], ramp(t, L(4), L(5) + 1), PAL.mint, 'a little more each week');
    P.check(c, '+ a little weight', W / 2, 960, true, pop(t, L(5)), 28); P.check(c, '+ a rep or two', W / 2, 1060, true, pop(t, L(5) + 1.2), 28); } },
  { at: L(6) - 0.2, name: 'study', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.versus(c, W / 2, 560, 660, 400, '+ Reps', '+ Weight', pop(t, L(6)), 0, (cc) => P.reps(cc, 0, 40, 10, 10, PAL.amber, 12), (cc) => P.dumbbell(cc, 0, 40, 0.7, 0, PAL.red));
    P.counter(c, '= growth', W / 2, 860, 76, pop(t, L(6) + 2.2), PAL.mint); } },
  { at: L(7) - 0.2, name: 'method', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); const ph = ramp(t, L(7) + 1.5, L(7) + 4.5), reps = Math.round(8 + 4 * ph), up = t > L(7) + 5;
    P.counter(c, '8-12 reps', W / 2, 220, 80, pop(t, L(7) + 0.4), PAL.yellow); P.counter(c, up ? '8 reps' : reps + ' reps', W / 2, 520, 110, pop(t, L(7) + 1.4), up ? PAL.cyan : PAL.mint); P.dumbbell(c, W / 2, 760, up ? 1.3 : 1.0, 0, up ? PAL.red : PAL.indigo);
    P.label(c, up ? 'Hit 12? Add weight, back to 8' : 'Climb to 12', W / 2, 900, pop(t, L(7) + 1.4), { color: up ? PAL.red : PAL.mint, size: 28 }); } },
  { at: L(8) - 0.2, name: 'log', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, 220, H * 0.86, 1.1, { arms: 'flex', bulk: 0.5, smile: true, blink: A.blink(t) }); const e = pop(t, L(9) - 0.2);
    c.save(); c.globalAlpha = 1 - e; P.flat(c, P.rr(400, 360, 260, 340, 20), PAL.white, { off: 6 }); ['Squat 80 x 10', 'Bench 60 x 9', 'Row 50 x 12'].forEach((s, i) => { c.font = `800 26px ${P.FONT}`; c.fillStyle = PAL.ink; c.textAlign = 'left'; c.fillText(s, 420, 420 + i * 60); }); c.restore();
    P.label(c, 'Write it down. Beat it.', W / 2, 200, pop(t, L(8)) * (1 - e), { color: PAL.amber }); A.next(c, t, 'BUILD + LOSE FAT?'); } },
]; }, sfx: (A) => [['powerup', 0.6, { gain: 0.4 }], ['riser', A.L(2), { dur: 1.2, gain: 0.3 }], ['error', A.L(3) + 1.5, { gain: 0.3 }], ['riser', A.L(4), { dur: 1.2, gain: 0.3 }], ['pop', A.L(5), { f: 760 }], ['pop', A.L(5) + 1.2, { f: 860 }], ['ding', A.L(6) + 2.2, { f: 'E6' }], ['blip', A.L(7) + 1.5, { f: 'C6' }], ['powerup', A.L(7) + 5, { gain: 0.5 }], ['paper', A.L(8), { dur: 0.3 }]] });
