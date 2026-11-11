(function () {
  const F = window.FLAT, { P, SET, tag, critter, rr, glow, bubble } = F, { pop, honey } = F.kit;
  // the bear says he never left home today, but his arm has blue stripes like the freshly painted bench (on screen from the start).
  const BLUE = '#2f6bd8';
  const bench = (c, x, y) => { for (let i = 0; i < 3; i++) rr(c, x - 150, y - 60 + i * 24, 300, 14, 6, BLUE); rr(c, x - 140, y + 12, 16, 60, 4, '#5a3a20'); rr(c, x + 124, y + 12, 16, 60, 4, '#5a3a20');
    rr(c, x - 70, y - 130, 140, 50, 10, '#fff6ea'); tag(c, x, y - 105, 'TAAZA PAINT', '#d12f52', 1, { size: 22 }); };
  const A = [{ k: 'monkey', n: 'Bandar', x: 140 }, { k: 'goat', n: 'Bakri', x: 360 }, { k: 'bear', n: 'Bhalu', x: 580 }];
  F.runRiddle('r', {
    ids: ['hook', 's1', 's2', 'think', 'r1', 'r2', 'cta'], min: { hook: 7, s1: 8, s2: 5.5, r1: 3.5, r2: 10 },
    think: ['*Chor kaun?*', 'Naam comment karo'], cta: ['Dhaariyan dekhi thi?', 'Comment karo'],
    caps: { hook: ['Shahad chori! Bench par *aaj hi paint*', 46], s1: ['Bandar: *nadi mein*. Bakri: *baithi nahi*', 42], s2: ['Bhalu: *ghar se nikla hi nahi*', 46], r1: ['*Bhalu!* Baanh dekho', 56], r2: ['Ghar par tha? *Taaza paint kaise?*', 46] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      rr(c, 40, 560, 220, 200, 16, '#c98a3a'); tag(c, 150, 585, 'SHAHAD', '#7a4a2a', 1, { size: 24 }); honey(c, 110, 700, 0.8); honey(c, 190, 700, 0.8);
      bench(c, 470, 720);
      A.forEach((a, i) => { const hot = (id === 'r1' || id === 'r2') && i === 2; if (hot) glow(c, a.x, 900, 220, P.pink, 0.45);
        critter(c, a.k, a.x, 1060, 0.52, t, { mood: hot ? 'scared' : id === 'think' ? 'think' : 'ok', seed: i });
        if (i === 2) for (let j = 0; j < 3; j++) rr(c, a.x + 14, 990 + j * 16, 44, 9, 4, BLUE);
        tag(c, a.x, 1085, a.n, hot ? '#d12f52' : P.navy, 1, { size: 26 }); });
      if (id === 's1') { bubble(c, 160, 820, 'Nadi mein|naha raha tha', 140, 900, pop(u, 0.3), { size: 26 }); bubble(c, 420, 840, 'Paint dekha,|baithi nahi', 360, 900, pop(u, 3.2), { size: 26 }); }
      if (id === 's2') bubble(c, 540, 840, 'Subah se ghar par|soya tha', 580, 900, pop(u, 0.3), { size: 26 });
      if (id === 'r1' || id === 'r2') { glow(c, 610, 990, 120, P.yellow, 0.6); tag(c, 600, 900, 'NEELA PAINT!', '#d12f52', pop(u, 0.5), { size: 30 }); }
    },
  });
})();
