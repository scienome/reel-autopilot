// 012 Why #3: knees cracking (Kawchuk 2015; Robertson 2017)
(function () {
P.reel({ scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); const k = 0.5 - 0.5 * Math.cos(t * 2.4); P.lifter(c, W / 2, H * 0.86, 1.35, { arms: 'bar', squat: k, wince: 0.2, blink: A.blink(t) });
    if (k > 0.85) for (const sd of [-1, 1]) P.zap(c, W / 2 + sd * 90, H * 0.78, 50, t, sd, 3, PAL.yellow); A.hookTitle(c, ['Why The', 'CRACK?'], 'Why Does This Happen? #3'); } },
  { at: L(1) - 0.15, name: 'bubble', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.title(c, ['Just A', 'BUBBLE'], W / 2, 220, pop(t, L(1)), { size: 80, color: PAL.cyan }); for (let i = 0; i < 6; i++) { const ph = (t * 0.4 + i / 6) % 1; P.flat(c, P.circ(150 + i * 85, 900 - ph * 300, 20 + i * 4), P.alpha(PAL.white, 0.7 * (1 - ph)), { off: 3 }); } } },
  { at: L(2) - 0.2, name: 'joint', tr: 'zoom', focus: [W / 2, 640], draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05);
    const gap = ramp(t, L(3), L(3) + 1.4), kb = ramp(t, L(3) + 0.6, L(4) + 0.6) * 1.0 + (t > L(4) + 0.6 ? Math.min(0.4, (t - L(4) - 0.6) * 0.8) : 0);
    P.jointBubble(c, W / 2, 640, 1.1, kb, gap); P.label(c, 'Joint fluid', W / 2, 170, pop(t, L(2)) * (1 - pop(t, L(3) - 0.2)), { color: PAL.aqua });
    P.label(c, 'Pressure drops → gas bubble', W / 2, 170, pop(t, L(3)) * (1 - pop(t, L(4) - 0.2)), { color: PAL.cyan, size: 30 }); P.label(c, 'MRI: bubble = the crack', W / 2, 170, pop(t, L(4)), { color: PAL.yellow, size: 30 }); } },
  { at: L(5) - 0.2, name: 'tendon', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.knee(c, W / 2 - 40, 700, 1.2, 0.4 + 0.4 * Math.sin(t * 2), 0.3 + 0.3 * Math.sin(t * 2)); P.label(c, 'Tendons can click too', W / 2, 170, pop(t, L(5)), { color: PAL.amber }); } },
  { at: L(6) - 0.2, name: 'verdict', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.2, { arms: 'flex', smile: true, blink: A.blink(t) });
    const e = pop(t, L(8) - 0.2); P.check(c, 'No pain: usually fine', W / 2, 200, true, pop(t, L(6)) * (1 - e), 32); P.check(c, 'Pain or swelling: get it checked', W / 2, 310, false, pop(t, L(7)) * (1 - e), 28); A.next(c, t, 'SIDE STITCH'); } },
]; }, sfx: (A) => [['tock', 1.3, { f: 900 }], ['pop', A.L(1) + 0.1, { f: 800 }], ['riser', A.L(3) + 0.4, { dur: 0.8, gain: 0.3 }], ['stamp', A.L(4) + 0.6, { gain: 0.6 }], ['tock', A.L(4) + 0.6, { f: 1200 }], ['tock', A.L(5) + 0.4, { f: 700 }], ['ding', A.L(6), { f: 'E6' }], ['error', A.L(7), { gain: 0.3 }]] });
