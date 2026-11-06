(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, rule: 3.5, r1: 3, r2: 8 },
    think: ['*Kitne dost?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['*30 laddoo*, har dost ko *aadha*', 52], rule: ['Sab laddoo baant diye', 56], r1: ['*60* dost!', 72], r2: ['1 laddoo = *2 aadhe*', 58] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const split = id === 'r2' ? Math.min(1, u / 4) : 0;
      for (let i = 0; i < 30; i++) {
        const x = 120 + (i % 6) * 96, y = 520 + Math.floor(i / 6) * 96, a = id === 'hook' ? pop(u, 0.03 * i, 0.2) : 1; if (a <= 0) continue;
        if (split > 0) { laddoo(c, x - 20 * split, y, 22); laddoo(c, x + 20 * split, y, 22, '#e8902a'); } else laddoo(c, x, y, 34 * a);
      }
      stat(c, 360, 400, id === 'r1' ? '60' : id === 'r2' ? (Math.floor(Math.min(60, u * 12)) + '') : '30', id === 'r2' || id === 'r1' ? 'aadhe' : 'laddoo', 1, { size: 66, bg: id === 'r1' ? P.pink : P.ink });
      critter(c, 'lion', 360, 1170, 0.45, t, { mood: id === 'think' ? 'think' : 'happy', seed: 4 });
    },
  });
})();
