// 045 Why #11: twitches (Blexrud 1993; Fermont 2010; NHS)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.moon(c, 560, 230, 60); P.bed(c, W / 2, 860, 1.3, t); const tw = Math.sin(t * 30) > 0.6 ? 1 : 0; P.zap(c, W / 2 + 120, 820, 40 + tw * 20, t, 5, 3, PAL.yellow);
    A.hookTitle(c, ['Why Do Muscles', 'TWITCH?'], 'Why Does This Happen? #11', PAL.magenta, 68); } },
  { at: L(2) - 0.2, name: 'name', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.bgCells(c, W, H, t, PAL.pink, 3, 0.05); const tw = Math.sin(t * 25) > 0.5 ? 1 : 0;
    P.muscleBelly(c, W / 2, 640, 460, 160, 0.05, 0.2 + tw * 0.15, t, { col: '#e8475b' }); P.zap(c, W / 2 + 60, 640, 50, t, 2, 3, PAL.yellow); P.title(c, ['FASCICULATION'], W / 2, 260, pop(t, L(2) + 1), { size: 54, color: PAL.yellow }); } },
  { at: L(3) - 0.2, name: 'nerve', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.neuron(c, 120, 300, 520, 780, t, pop(t, L(3)), 1, PAL.yellow);
    const tw = (t % 1.2) < 0.15 ? 1 : 0; for (let j = 0; j < 3; j++) P.fiber(c, 320, 760 + j * 60, 300, 24, 0, { color: tw && j === 1 ? '#ff4a5c' : '#a8344a', seed: j }); P.label(c, 'One nerve fires by itself', W / 2, 200, pop(t, L(3) + 0.5), { color: PAL.yellow, size: 28 }); } },
  { at: L(4) - 0.2, name: 'common', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); for (let i = 0; i < 9; i++) P.lifter(c, 130 + (i % 3) * 230, 470 + Math.floor(i / 3) * 280, 0.38, { arms: 'down', smile: true, blink: A.blink(t, i) });
    P.label(c, 'Very common in healthy people', W / 2, 200, pop(t, L(4)), { color: PAL.mint, size: 28 }); } },
  { at: L(5) - 0.2, name: 'triggers', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.dumbbell(c, 180, 480, 1.0, 0.3); P.coffee(c, 520, 480, 1.0, t); P.face(c, 180, 860, 0.6, { wince: 0.6, sweat: true, t }); P.face(c, 520, 860, 0.6, { sleepy: true, t });
    ['Hard training', 'Caffeine', 'Stress', 'Bad sleep'].forEach((s, i) => P.label(c, s, [180, 520, 180, 520][i], [640, 640, 1060, 1060][i], pop(t, L(5) + i * 0.9), { color: [PAL.red, PAL.amber, PAL.pink, PAL.blue][i], size: 26 })); } },
  { at: L(6) - 0.2, name: 'harmless', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.calendar(c, W / 2, 380, 1.0, 'YEARS', 'followed up', pop(t, L(6))); P.verdict(c, W / 2, 700, true, pop(t, L(6) + 2.6), 1.1); P.label(c, 'Stayed harmless', W / 2, 880, pop(t, L(6) + 3), { color: PAL.mint }); } },
  { at: L(7) - 0.2, name: 'care', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.person(c, W / 2 + 175, H * 0.86, 0.95, 'doc', { talk: A.talk(t), arms: 'down', look: -0.5 }); P.lifter(c, W / 2 - 95, H * 0.86, 1.0, { arms: 'down', blink: A.blink(t) });
    P.bubble(c, 'Weakness or shrinking muscle? See a doctor', W / 2, 220, pop(t, L(7)) * (1 - pop(t, L(8) - 0.2)), { color: PAL.red }); A.next(c, t, 'MUSCLE CRAMPS'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['glitch', 0.6, { gain: 0.3 }], ['blip', A.L(2) + 1, { f: 'C6' }], ['glitch', A.L(3), { gain: 0.3 }], ['pop', A.L(5), { f: 700 }], ['pop', A.L(5) + 0.9, { f: 760 }], ['pop', A.L(5) + 1.8, { f: 820 }], ['pop', A.L(5) + 2.7, { f: 880 }], ['ding', A.L(6) + 2.6, { f: 'E6' }], ['error', A.L(7), { gain: 0.3 }]] });
