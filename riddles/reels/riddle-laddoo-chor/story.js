// Only the thief lies. Cases: Bhalu (forces a 2nd thief), Lomdi (Bhalu would be lying), Bandar (Khargosh true => Bhalu liar), Khargosh (all consistent).
(function () {
  const F = window.FLAT, { P, SET, tag, critter, bubble, rr, line, curve, circ, glow } = F, { pop, txt } = F.kit;
  // slot order: Bandar, Bhalu, Khargosh, Lomdi in a 2x2 grid
  const S = [
    { k: 'monkey', n: 'Bandar', x: 170, y: 690, say: 'Khargosh|jhooth bol raha hai' },
    { k: 'bear', n: 'Bhalu', x: 550, y: 690, say: 'Lomdi|chor nahi hai' },
    { k: 'rabbit', n: 'Khargosh', x: 170, y: 1060, say: 'Bhalu|jhooth bol raha hai' },
    { k: 'fox', n: 'Lomdi', x: 550, y: 1060, say: 'Chor Bandar|ya Khargosh hai' },
  ];
  const CASE = { r1: 1, r2: 3, r3: 0, r4: 2 };
  const cross = (c, x, y, k) => { if (k <= 0) return; const s = 44 * k; line(c, [[x - s, y - s], [x + s, y + s]], 18, '#d12f52'); line(c, [[x + s, y - s], [x - s, y + s]], 18, '#d12f52'); };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'r3', 'r4', 'cta'],
    min: { hook: 6, rule: 5, r1: 6, r2: 6, r3: 8, r4: 8 },
    think: ['*Chor kaun?*', 'Comment karo'],
    cta: ['Kitni jaldi pakda?', 'Comment karo'],
    caps: { hook: ['Raat ko *laddoo gayab!* 4 par shak.', 52], rule: ['Sirf *chor* jhooth bolta hai!', 56], r1: ['*Bhalu* chor? *Galat!*', 56], r2: ['*Lomdi* chor? *Galat!*', 56], r3: ['*Bandar* chor? *Galat!*', 56], r4: ['Chor *Khargosh!* Sab match!', 54] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      const cs = CASE[id], f = cs == null ? 0 : u / d(id), bad = cs != null && id !== 'r4';
      S.forEach((a, i) => {
        const mood = id === 'rule' ? 'sly' : cs === i ? (id === 'r4' && f > 0.55 ? 'scared' : 'sly') : id === 'r4' && f > 0.55 ? 'happy' : 'think';
        if (cs === i) glow(c, a.x, a.y - 120, 240, id === 'r4' ? P.yellow : P.pink, 0.45);
        critter(c, a.k, a.x, a.y, 0.6, t, { mood, seed: i, look: [0, -1], flip: a.x > 360 });
        const dim = cs != null && cs !== i ? 0.55 : 1; c.globalAlpha = dim; bubble(c, a.x, a.y - (a.y > 900 ? 250 : 300), a.say, a.x, a.y - 160, pop(u, id === 'hook' ? 1 + i * 1.2 : 0), { size: 28 }); c.globalAlpha = 1;
        tag(c, a.x, a.y + 28, a.n, cs === i ? '#d12f52' : P.navy, 1, { size: 26 });
        if (bad && cs === i) cross(c, a.x, a.y - 120, pop(u, 3.2, 0.3));
        if (id === 'r4' && cs === i) tag(c, a.x, a.y - 60, 'CHOR', '#d12f52', pop(u, 5.2), { size: 40 });
      });
    },
  });
})();
