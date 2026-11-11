// 041 Why #10: sick after leg day (de Oliveira 2014; Halliwill 2013; MacDougall 1985)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.4); P.lifter(c, W / 2, H * 0.86, 1.35, { arms: 'bar', squat: k, bar: true, wince: 0.8, blink: A.blink(t) });
    A.hookTitle(c, ['Sick After', 'LEG DAY?'], 'Why Does This Happen? #10', PAL.magenta, 70); } },
  { at: L(2) - 0.2, name: 'blood', tr: 'zoom', focus: [W / 2, 800], draw: (c, t) => { A.xrayRep(c, t, 'squatfront', { quads: 1, glutes: 1, hamstrings: 0.7, calves: 0.5 }, { map: 'front' });
    P.flow(c, W / 2, 380, W / 2, 900, t, pop(t, L(2) + 1), PAL.red, 16); P.label(c, 'Biggest muscles = most blood', W / 2, 200, pop(t, L(2)), { color: PAL.red, size: 28 }); } },
  { at: L(3) - 0.2, name: 'gut', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.bgCells(c, W, H, t, PAL.pink, 3, 0.05); const sq = Math.sin(t * 6) * 0.05;
    P.stomach(c, W / 2, 620, 1.6 + sq, 0.6); P.flow(c, W / 2, 400, W / 2, 1000, t, 1 - ramp(t, L(3), L(3) + 1.5) * 0.8, PAL.red, 8); P.label(c, 'Gut gets less blood', W / 2, 220, pop(t, L(3)), { color: PAL.amber }); P.zap(c, W / 2, 620, 160, t, 3, 4, PAL.lime || '#9be15d'); } },
  { at: L(4) - 0.2, name: 'stop', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const sway = Math.sin(t * 2.2) * 0.08; c.save(); c.translate(W / 2, H * 0.86); c.rotate(sway * ramp(t, L(4) + 2, L(4) + 3)); c.translate(-W / 2, -H * 0.86);
    P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'down', wince: 0.5, shock: ramp(t, L(4) + 2, L(4) + 3), blink: A.blink(t) }); c.restore(); P.gauge(c, W / 2, 330, 110, 0.7 - ramp(t, L(4) + 1.5, L(4) + 3.5) * 0.45, 'BLOOD PRESSURE', '', PAL.red);
    P.label(c, 'Blood pools in your legs', W / 2, 520, pop(t, L(4) + 1.5), { color: PAL.cyan, size: 28 }); } },
  { at: L(5) - 0.2, name: 'worse', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.face(c, 220, 560, 0.85, { puff: 1, red: 0.8, t }); P.stomach(c, 510, 580, 1.0, 1);
    P.label(c, 'Holding your breath', 220, 820, pop(t, L(5)), { color: PAL.red, size: 26 }); P.label(c, 'Full stomach', 510, 820, pop(t, L(5) + 2.4), { color: PAL.amber, size: 26 }); } },
  { at: L(6) - 0.2, name: 'fix', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 60 + Math.sin(t) * 60, H * 0.86, 1.2, { run: t * 4, smile: true, blink: A.blink(t) });
    ['Walk between sets', 'Keep breathing', 'Eat 1-2 h before', 'Cool down slowly'].forEach((s, i) => P.check(c, s, W / 2, 170 + i * 85, true, pop(t, L(6) + i * 1.0), 26)); } },
  { at: L(7) - 0.2, name: 'care', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.person(c, W / 2 + 175, H * 0.86, 0.95, 'doc', { talk: A.talk(t), arms: 'down', look: -0.5 }); P.lifter(c, W / 2 - 95, H * 0.86, 1.0, { arms: 'down', blink: A.blink(t) });
    P.bubble(c, 'Fainting or chest pain? Get checked', W / 2, 220, pop(t, L(7)) * (1 - pop(t, L(8) - 0.2)), { color: PAL.red }); A.next(c, t, 'NIGHT TWITCHES'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['powerup', A.L(2) + 1, { gain: 0.3 }], ['buzz', A.L(3), { dur: 0.5, f: 110, gain: 0.3 }], ['glitch', A.L(4) + 2, { gain: 0.4 }], ['pop', A.L(6), { f: 700 }], ['pop', A.L(6) + 1, { f: 760 }], ['pop', A.L(6) + 2, { f: 820 }], ['pop', A.L(6) + 3, { f: 880 }], ['error', A.L(7), { gain: 0.3 }]] });
