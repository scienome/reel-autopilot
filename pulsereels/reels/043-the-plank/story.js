// 043 Exercise 10: the plank (McGill 2016; Calatayud 2017)
(function () {
P.reel({ merge: [['ten seconds', '10 s']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.lifterSide(c, W / 2 - 60, H * 0.84, 1.3, 'plank', { k: 0, wince: true }); P.stopwatch(c, W / 2, 540, 90, (t * 0.3) % 1, '5:00', PAL.red);
    A.hookTitle(c, ['Long Planks', 'USELESS?'], 'Exercise Series · Part 10', PAL.magenta, 68); } },
  { at: L(2) - 0.2, name: 'job', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { A.xrayRep(c, t, 'plank', { abs: 1, obliques: pop(t, L(2) + 1.5), shoulders: 0.4, glutes: 0.5 }, { x: W / 2 - 40, y: H * 0.62, s: 1.3, k: 0, map: 'front' });
    P.label(c, 'Abs + deep core', W / 2, 200, pop(t, L(2)), { color: PAL.red }); P.label(c, 'Job: stop the sag', W / 2, 290, pop(t, L(2) + 2.5), { color: PAL.mint, size: 28 }); } },
  { at: L(3) - 0.2, name: 'fall', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); const sag = ramp(t, L(3) + 1, L(3) + 4); c.save(); c.translate(W / 2 - 60, H * 0.84); c.rotate(sag * 0.06); c.translate(-(W / 2 - 60), -H * 0.84);
    P.lifterSide(c, W / 2 - 60, H * 0.84 + sag * 20, 1.3, 'plank', { k: sag * 0.2, wince: true }); c.restore(); P.stopwatch(c, W / 2, 420, 80, ramp(t, L(3), L(3) + 4), '1:00+', PAL.amber);
    P.label(c, 'Hips drop', 220, 980, pop(t, L(3) + 2), { color: PAL.red, size: 26 }); P.label(c, 'Core switches off', 500, 1060, pop(t, L(3) + 3.4), { color: PAL.red, size: 26 }); } },
  { at: L(4) - 0.2, name: 'short', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.person(c, 170, H * 0.86, 0.9, 'doc', { talk: A.talk(t), arms: 'down', look: 0.5 });
    for (let i = 0; i < 5; i++) P.ring(c, 300 + (i % 3) * 140, 480 + Math.floor(i / 3) * 170, 55, i < Math.floor(ramp(t, L(4) + 2, L(5)) * 5.99) ? 1 : 0, '10 s', PAL.mint);
    P.label(c, '10-second holds, repeated', W / 2, 200, pop(t, L(4) + 2), { color: PAL.mint, size: 30 }); } },
  { at: L(5) - 0.2, name: 'cues', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.gym(c, W, H, t); P.lifterSide(c, W / 2 - 60, H * 0.84, 1.3, 'plank', { k: 0, smile: true }); P.glow(c, W / 2 - 60, H * 0.76, 90, PAL.amber, 0.4 + 0.2 * Math.sin(t * 6));
    ['Squeeze glutes', 'Brace your belly', 'Push the floor away'].forEach((s, i) => P.check(c, s, W / 2, 200 + i * 90, true, pop(t, L(5) + i * 1.3), 28)); } },
  { at: L(6) - 0.2, name: 'harder', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifterSide(c, W / 2 - 60, H * 0.84, 1.3, 'plank', { k: 0, wince: true }); P.arcArrow(c, W / 2 + 120, H * 0.78, 70, Math.PI, Math.PI * 1.6, pop(t, L(6) + 1.5), PAL.yellow);
    P.label(c, 'Harder, not longer', W / 2, 200, pop(t, L(6)), { color: PAL.amber }); P.label(c, 'Lift a leg', W / 2, 290, pop(t, L(6) + 1.8), { color: PAL.mint, size: 26 }); P.label(c, 'Elbows forward', W / 2, 360, pop(t, L(6) + 3), { color: PAL.mint, size: 26 }); if (t > L(7) - 0.3) A.next(c, t, 'BICEPS CURL'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['tock', 0.3, { f: 500 }], ['blip', A.L(2), { f: 'C6' }], ['buzz', A.L(3) + 2, { dur: 0.5, f: 110, gain: 0.3 }], ['ding', A.L(4) + 2, { f: 'E6' }], ['pop', A.L(5), { f: 700 }], ['pop', A.L(5) + 1.3, { f: 800 }], ['pop', A.L(5) + 2.6, { f: 900 }], ['powerup', A.L(6), { gain: 0.3 }]] });
