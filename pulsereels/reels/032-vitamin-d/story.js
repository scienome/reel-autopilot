// 032 Supplements 6: vitamin D (Beaudart 2014; Holick 2007; IOM 2011)
(function () {
P.reel({ merge: [['beta alanine', 'beta-alanine']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.sun(c, 560, 470, 70, t); P.lifter(c, W / 2 - 60, H * 0.86, 1.3, { arms: 'flex', bulk: 0.3, wince: 0.4, blink: A.blink(t) }); A.hookTitle(c, ['VITAMIN D', 'And Strength?'], 'Supplement Series · Part 6'); } },
  { at: L(2) - 0.2, name: 'sun', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.sun(c, W / 2, 360, 90, t); P.flow(c, W / 2, 460, W / 2, 760, t, 1, PAL.yellow, 10); P.skinLayer(c, W / 2, 780, 600, t, 0, 0); P.label(c, 'Skin makes vitamin D', W / 2, 200, pop(t, L(2)), { color: PAL.amber }); } },
  { at: L(3) - 0.2, name: 'low', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.moon(c, 590, 200, 44); P.progress(c, W / 2, 700, 520, 0.85 - 0.6 * ramp(t, L(3), L(3) + 2.5), PAL.amber, 'vitamin D');
    ['Winter', 'Far from the equator', 'Indoors all day'].forEach((s, i) => P.label(c, s, W / 2, 330 + i * 80, pop(t, L(3) + i * 0.8), { color: PAL.blue, size: 26 })); } },
  { at: L(4) - 0.2, name: 'muscle', tr: 'zoom', focus: [W / 2, 700], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.fiber(c, 60, 560, 600, 90, 0, { color: '#ff4a5c', seed: 7, slide: t * 8 });
    for (let i = 0; i < 6; i++) P.flat(c, P.rr(90 + i * 95, 470, 30, 40, 10), PAL.amber, { off: 3 }); P.label(c, 'Muscles have vitamin D receptors', W / 2, 220, pop(t, L(4)), { color: PAL.amber, size: 28 });
    P.label(c, 'Low levels → weaker muscles', W / 2, 800, pop(t, L(4) + 2), { color: PAL.red, size: 30 }); } },
  { at: L(5) - 0.2, name: 'studies', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.evidence(c, W / 2, 420, 2, pop(t, L(5) + 0.5)); P.label(c, 'Small strength boost', W / 2, 220, pop(t, L(5)), { color: PAL.mint });
    P.label(c, 'mostly if you were LOW', W / 2, 600, pop(t, L(5) + 2.4), { color: PAL.amber, size: 30 }); P.drop(c, 220, 900, 40, PAL.red); P.label(c, 'Blood test, not guessing', W / 2, 1060, pop(t, L(6)), { color: PAL.cyan, size: 30 }); } },
  { at: L(7) - 0.2, name: 'more', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); const e = pop(t, L(8) - 0.2); for (let i = 0; i < 6; i++) P.pill(c, 140 + i * 90, 640, 0.8, 0.3 * i, PAL.amber, PAL.yellow);
    P.check(c, 'More is NOT better', W / 2, 220, false, pop(t, L(7)) * (1 - e), 30); P.label(c, "Follow your doctor's advice", W / 2, 330, pop(t, L(7) + 2) * (1 - e), { color: PAL.amber, size: 28 }); A.next(c, t, 'BETA-ALANINE'); } },
]; }, sfx: (A) => [['sparkle', 0.5, { n: 6 }], ['sparkle', A.L(2) + 0.4, { n: 6 }], ['buzz', A.L(3) + 1, { dur: 0.6, f: 130, gain: 0.3 }], ['blip', A.L(4) + 0.5, { f: 'C6' }], ['error', A.L(4) + 2, { gain: 0.3 }], ['ding', A.L(5) + 0.5, { f: 'E6' }], ['pop', A.L(6), { f: 800 }], ['error', A.L(7), { gain: 0.3 }]] });
