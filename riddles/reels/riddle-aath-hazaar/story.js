(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const blk = (c, x, y, col, a = 1) => { c.globalAlpha = a; rr(c, x - 34, y - 52, 68, 104, 14, col); txt(c, '8', x, y + 2, 78, P.white); c.globalAlpha = 1; };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, rule: 7, r1: 6, r2: 10 },
    think: ['*Kaise 1000?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['Aath *8*, jodke *1000*', 58], rule: ['8 8 = *88* bhi chalega', 56], r1: ['*888 + 88 + 8 + 8 + 8*', 46], r2: ['976 + 24 = *1000*', 62] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const grp = id === 'r1' || id === 'r2';
      const xs = grp ? [60, 130, 200, 300, 370, 470, 540, 610] : [56, 140, 224, 308, 392, 476, 560, 644];
      for (let i = 0; i < 8; i++) { const col = grp ? (i < 3 ? P.pink : i < 5 ? P.violet : '#0f6b58') : '#0f6b58'; blk(c, xs[i], 640, col, id === 'hook' ? pop(u, 0.2 + i * 0.3) : 1); }
      if (grp) { tag(c, 130, 750, '888', P.pink, pop(u, 0.4), { size: 38 }); tag(c, 335, 750, '88', P.violet, pop(u, 1.2), { size: 38 }); tag(c, 540, 750, '8 + 8 + 8', P.teal, pop(u, 2), { size: 34 }); }
      if (id === 'r2') { stat(c, 360, 880, '888 + 88 = 976', '', pop(u, 0.5), { size: 48, bg: P.ink }); stat(c, 360, 980, '3 x 8 = 24', '', pop(u, 4), { size: 48, bg: P.ink }); stat(c, 360, 1090, '1000', '', pop(u, 7.5), { size: 70, bg: P.pink }); }
      critter(c, 'monkey', 360, 450, 0.3, t, { mood: id === 'think' ? 'think' : 'happy', seed: 6, noShadow: true });
    },
  });
})();
