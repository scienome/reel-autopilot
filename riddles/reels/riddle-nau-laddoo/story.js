(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // 'All except 9 were eaten' -> 9 left.
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, r1: 3.5, r2: 6 },
    think: ['*Kitne bache?*', 'Number comment karo'], cta: ['Phanse ya nahi?', 'Comment karo'],
    caps: { hook: ['12 laddoo. *9 ko chhodkar* sab kha gaya', 46], r1: ['3 nahi! *9 bache!*', 60], r2: ['*9 ko chhodkar* = 9 bache', 50] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      const left = id === 'hook' ? 12 - Math.min(3, Math.floor(u / 1.2)) : id === 'think' ? 12 : 9;
      for (let i = 0; i < 12; i++) { const x = 150 + (i % 4) * 140, y = 560 + Math.floor(i / 4) * 120; if (i < left) laddoo(c, x, y, 46); else { c.globalAlpha = 0.2; laddoo(c, x, y, 46); c.globalAlpha = 1; } }
      critter(c, 'monkey', 360, 1150, 0.75, t, { mood: id === 'think' ? 'think' : 'happy', seed: 2 });
      if (id === 'r1' || id === 'r2') stat(c, 360, 420, '9', 'laddoo', 1, { size: 90, bg: '#0f6b58' });
    },
  });
})();
