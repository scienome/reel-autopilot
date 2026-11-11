// 054 Muscle Building 13: training frequency (Schoenfeld 2016; Schoenfeld 2019; Grgic 2018)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 3); P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'bar', arms2: 'press', mix: k, bar: true, blink: A.blink(t) }); P.week(c, W / 2, 560, 620, [3, 0, 3, 0, 3, 0, 0], 1, PAL.amber);
    A.hookTitle(c, ['How Often Per', 'MUSCLE?'], 'Muscle Building · Part 13', PAL.magenta, 64); } },
  { at: L(2) - 0.2, name: 'bro', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); ['CHEST', 'BACK', 'ARMS', 'LEGS', 'SHOULDERS'].forEach((s, i) => P.label(c, s, W / 2, 330 + i * 100, pop(t, L(2) + i * 0.4), { color: [PAL.red, PAL.blue, PAL.amber, PAL.mint, PAL.pink][i], size: 30 }));
    P.label(c, 'Bro split: once a week', W / 2, 200, pop(t, L(2)), { color: PAL.yellow }); P.musclemap(c, W / 2, 1060, 0.5, 'front', { chest: 1 }); } },
  { at: L(3) - 0.2, name: 'twice', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); const k = ramp(t, L(3) + 1, L(3) + 3);
    P.meter(c, 230, 1000, 150, 440, 0.45, PAL.amber, '1×/week'); P.meter(c, 490, 1000, 150, 440, 0.45 + 0.2 * k, PAL.mint, '2×/week'); P.label(c, 'Early review', W / 2, 220, pop(t, L(3)), { color: PAL.blue }); } },
  { at: L(4) - 0.2, name: 'equal', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.week(c, W / 2, 440, 620, [10, 0, 0, 0, 0, 0, 0], pop(t, L(4) + 1), PAL.amber); P.week(c, W / 2, 640, 620, [5, 0, 0, 5, 0, 0, 0], pop(t, L(4) + 1.6), PAL.mint);
    P.label(c, 'Same weekly sets', W / 2, 220, pop(t, L(4) + 1), { color: PAL.yellow }); P.label(c, 'Barely matters', W / 2, 860, pop(t, L(4) + 4), { color: PAL.mint }); } },
  { at: L(5) - 0.2, name: 'sets', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.counter(c, P.countTo(t, L(5), L(5) + 2, 0, 12) + ' sets / week', W / 2, 520, 70, pop(t, L(5)), PAL.yellow);
    P.label(c, 'Weekly sets matter most', W / 2, 220, pop(t, L(5)), { color: PAL.mint }); P.label(c, 'Frequency = how you spread them', W / 2, 760, pop(t, L(5) + 2.5), { color: PAL.cyan, size: 26 }); } },
  { at: L(6) - 0.2, name: 'fresh', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { A.xrayRep(c, t, 'bench', { chest: 1, triceps: 0.7, shoulders: 0.6 }, { map: 'front' }); P.label(c, 'Every set fresh + strong', W / 2, 200, pop(t, L(6) + 1), { color: PAL.mint, size: 28 }); } },
  { at: L(7) - 0.2, name: 'stick', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2 - 80, H * 0.86, 1.15, { arms: 'flex', bulk: 0.4, smile: true, blink: A.blink(t) }); P.person(c, W / 2 + 190, H * 0.86, 0.9, 'coach', { talk: A.talk(t), arms: 'down', look: -0.5 });
    P.label(c, 'The split you stick to', W / 2, 220, pop(t, L(7)), { color: PAL.amber }); if (t > L(8) - 0.3) A.next(c, t, 'CARDIO VS GAINS'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['pop', A.L(2), { f: 700 }], ['pop', A.L(2) + 0.8, { f: 800 }], ['pop', A.L(2) + 1.6, { f: 900 }], ['ding', A.L(3) + 3, { f: 'E6' }], ['paper', A.L(4) + 1, { dur: 0.3 }], ['sparkle', A.L(4) + 4, { n: 5 }], ['count', A.L(5), { minor: true }], ['powerup', A.L(6), { gain: 0.3 }]] });
