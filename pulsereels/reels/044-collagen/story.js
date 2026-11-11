// 044 Supplements 10: collagen (Shaw 2017; Oikawa 2020; Lis & Baar 2019)
(function () {
P.reel({ merge: [['fifteen grams', '15 g']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); P.glow(c, W / 2, 760, 300, PAL.amber, 0.4); P.tub(c, W / 2, 760 + Math.sin(t * 2) * 8, 1.6, '#f4efe6', 'COLLAGEN', 'peptides', PAL.amber); P.qmarks(c, W / 2, 520, t, 1);
    A.hookTitle(c, ['Does Collagen', 'DO ANYTHING?'], 'Supplement Series · Part 10', PAL.magenta, 60); } },
  { at: L(2) - 0.2, name: 'where', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'night', t); P.knee(c, W / 2, 640, 1.4, 0.3 + 0.2 * Math.sin(t * 2), 0.5 + 0.3 * Math.sin(t * 4));
    P.label(c, 'Tendons · ligaments · skin', W / 2, 200, pop(t, L(2)), { color: PAL.amber, size: 30 }); } },
  { at: L(3) - 0.2, name: 'weak', tr: 'zoom', focus: [W / 2, 600], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); P.aminos(c, W / 2, 620, 220, t, [0], pop(t, L(3)), true);
    P.label(c, 'Low leucine', W / 2, 200, pop(t, L(3) + 1.5), { color: PAL.red }); P.label(c, '1 essential amino acid missing', W / 2, 1060, pop(t, L(3) + 4), { color: PAL.red, size: 28 }); P.stampX(c, W / 2 + 160, 520, 50, pop(t, L(3) + 4.2)); } },
  { at: L(4) - 0.2, name: 'study', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.versus(c, W / 2, 620, 660, 420, 'Whey', 'Collagen', pop(t, L(4)), pop(t, L(4) + 2) > 0 ? 1 : 0, (cc) => P.tub(cc, 0, 40, 0.7, '#1d0d4f', 'WHEY', '', PAL.cyan), (cc) => P.tub(cc, 0, 40, 0.7, '#f4efe6', 'COLL', '', PAL.amber));
    P.label(c, 'Muscle building', W / 2, 220, pop(t, L(4) + 0.5), { color: PAL.mint }); } },
  { at: L(5) - 0.2, name: 'tendon', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.bgCells(c, W, H, t, PAL.pink, 3, 0.05); P.scoop(c, 200, 520, 1.2, '#f2e2c4'); P.pill(c, 360, 520, 1.0, 0, PAL.amber, PAL.white); P.clock(c, 540, 520, 80, 1, 0, '-1 h');
    P.lifter(c, W / 2, H * 0.94, 0.9, { run: t * 6, smile: true, blink: A.blink(t) }); P.counter(c, '15 g + vitamin C', W / 2, 330, 52, pop(t, L(5) + 1.5), PAL.yellow); P.label(c, 'Collagen markers up', W / 2, 740, pop(t, L(5) + 5), { color: PAL.mint }); } },
  { at: L(6) - 0.2, name: 'verdict', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.person(c, W / 2 + 175, H * 0.86, 0.95, 'doc', { talk: A.talk(t), arms: 'down', look: -0.5 }); P.lifter(c, W / 2 - 95, H * 0.86, 1.0, { arms: 'down', blink: A.blink(t) });
    P.label(c, '8 men · blood markers', W / 2, 200, pop(t, L(6)), { color: PAL.amber, size: 28 }); P.evidence(c, W / 2, 360, 1, pop(t, L(6) + 2.6)); if (t > L(7) - 0.3) A.next(c, t, 'FAT BURNERS'); } },
]; }, sfx: (A) => [['riser', 0, { dur: 0.6, gain: 0.3 }], ['blip', A.L(2), { f: 'C6' }], ['error', A.L(3) + 1.5, { gain: 0.3 }], ['stamp', A.L(3) + 4.2, { gain: 0.5 }], ['ding', A.L(4) + 2, { f: 'E6' }], ['pop', A.L(5) + 1.5, { f: 800 }], ['sparkle', A.L(5) + 5, { n: 5 }], ['stamp', A.L(6) + 2.6, { gain: 0.4 }]] });
