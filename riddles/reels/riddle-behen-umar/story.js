(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const card = (c, x, y, who, v, k, col) => { if (k <= 0) return; tag(c, x, y - 70, who, col, k, { size: 30 }); stat(c, x, y, v, '', k, { size: 64, bg: col === P.pink ? '#0f6b58' : P.ink }); };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, rule: 4, r1: 3.5, r2: 9 },
    think: ['*Behen ki umar?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['Bhalu *6*, behen *aadhi* umar ki', 52], rule: ['Ab bhalu *70* ka hai', 56], r1: ['Behen *67* ki', 62], r2: ['Fark hamesha *3* saal', 56] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const later = id === 'rule' || id === 'think' || id === 'r1' || id === 'r2';
      critter(c, 'bear', 210, 1000, 0.7, t, { mood: id === 'think' ? 'think' : 'happy', seed: 1 });
      critter(c, 'bear', 510, 1000, 0.42, t, { mood: id === 'think' ? 'think' : 'happy', seed: 2, flip: true });
      if (!later) { card(c, 210, 520, 'Bhalu', '6', pop(u, 0.2), P.ink); card(c, 510, 520, 'Behen', '3', pop(u, 1.4), P.pink); }
      else { card(c, 210, 520, 'Bhalu', '70', pop(u, 0.2), P.ink); card(c, 510, 520, 'Behen', id === 'r1' || id === 'r2' ? '67' : '?', id === 'r1' || id === 'r2' ? pop(u, 0.2) : pop(u, 0.5), P.pink); }
      if (id === 'r2') { tag(c, 360, 760, 'Fark = 70 - 67 = 3 ✓', P.violet, pop(u, 4), { size: 30 }); tag(c, 360, 690, 'Pehle: 6 - 3 = 3', P.violet, pop(u, 1.6), { size: 30 }); }
    },
  });
})();
