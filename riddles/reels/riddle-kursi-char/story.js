(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const SEAT = [110, 270, 430, 590], START = { lion: 110, rabbit: 270, bear: 430, monkey: 590 }, FIN = { rabbit: 110, lion: 270, monkey: 430, bear: 590 }, NM = { lion: 'Sher', rabbit: 'Khargosh', bear: 'Bhaalu', monkey: 'Bandar' };
  const chair = (c, x, n) => { rr(c, x - 56, 600, 112, 210, 18, '#6d3a1b'); rr(c, x - 70, 800, 140, 30, 10, '#a86a35'); rr(c, x - 60, 828, 16, 110, 5, '#6d3a1b'); rr(c, x + 44, 828, 16, 110, 5, '#6d3a1b'); txt(c, n, x, 640, 46, P.white); };
  F.runRiddle('r', {
    ids: ['hook', 'c1', 'c2', 'c3', 'think', 'r1', 'r2', 'cta'], min: { hook: 4.5, c1: 4, c2: 4, c3: 6, r1: 2.5, r2: 13 },
    think: ['*Bandar kahan?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['4 dost, 4 kursi', 62], c1: ['Sher *kinare par nahi*', 56], c2: ['Khargosh sher ke *theek baayein*', 48], c3: ['Bandar *pehli* nahi, bhaalu bandar ke *daayein*', 42], r1: ['Bandar *3* number par', 60], r2: ['*Khargosh, sher, bandar, bhaalu*', 48] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const sit = id === 'r1' ? Math.min(1, u / 1.8) : id === 'r2' ? 1 : 0;
      [0, 1, 2, 3].forEach((i) => chair(c, SEAT[i], i + 1));
      ['lion', 'rabbit', 'bear', 'monkey'].forEach((k, i) => { const x = START[k] + (FIN[k] - START[k]) * sit, y = 1130 + (808 - 1130) * sit; critter(c, k, x, y, 0.46, t, { mood: id === 'think' ? 'think' : 'happy', seed: i, flip: false }); tag(c, x, sit > 0 ? 900 : y + 44, NM[k], P.ink, 1, { size: 22 }); });
      const cl = ['Sher kinare par nahi', 'Khargosh = sher ke theek baayein', 'Bandar pehli kursi par nahi', 'Bhaalu bandar ke daayein'], from = { c1: 1, c2: 2, c3: 3, think: 4, r1: 4, r2: 4 }[id] || 0;
      for (let i = 0; i < Math.min(from, 4); i++) { if (id === 'r1' || id === 'r2') break; tag(c, 360, 300 + i * 60 - (i > 2 ? 0 : 0), cl[i], P.violet, id === 'c1' && i === 0 || id === 'c2' && i === 1 || id === 'c3' && i >= 2 ? pop(u, 0.3 + (i === 3 ? 2 : 0)) : 1, { size: 26 }); }
    },
  });
})();
