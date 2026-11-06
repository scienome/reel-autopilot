(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const coin = (c, x, y, kind, r = 24) => { if (kind === 'H') { circ(c, x, y, r, '#c99a2a'); circ(c, x, y, r * 0.82, P.amber); txt(c, 'S', x, y + 1, r * 0.9, P.ink); } else if (kind === 'T') { circ(c, x, y, r, '#8d94b8'); circ(c, x, y, r * 0.82, '#c9cfe6'); txt(c, 'U', x, y + 1, r * 0.9, P.ink); } else { circ(c, x, y, r, '#4a4d68'); circ(c, x, y, r * 0.8, '#5d6188'); } };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 5.5, rule: 9, r1: 5, r2: 14 },
    think: ['*Kaise baantoge?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['20 sikke, *10 seedhe*, andhera', 52], rule: ['Dono dher mein *seedhe barabar*', 48], r1: ['*10-10* ke dher, ek *palat* do', 50], r2: ['3 seedhe → palat → *7*', 54] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const split = id === 'r1' || id === 'r2';
      const pos = (i) => split ? [(i < 10 ? 185 : 535) + ((i % 10) % 5 - 2) * 56, 640 + Math.floor((i % 10) / 5) * 62 ] : [360 + (i % 5 - 2) * 90, 520 + Math.floor(i / 5) * 90];
      const k = id === 'r2' ? 1 : 0, flipped = id === 'r2' && u > 7;
      for (let i = 0; i < 20; i++) {
        const [x, y] = pos(i); let kind = '';
        if (id === 'r2') { const j = i % 10; if (i < 10) kind = (j < 3) !== flipped ? 'H' : 'T'; else kind = j < 7 ? 'H' : 'T'; if (u < 1.5) kind = ''; }
        coin(c, x, y, kind, split ? 24 : 32);
      }
      c.fillStyle = 'rgba(8,4,40,.62)'; c.fillRect(0, 0, 720, 1280);
      if (split) { tag(c, 185, 570, 'DHER A', P.violet, pop(u, 0.3), { size: 28 }); tag(c, 535, 570, 'DHER B', P.teal, pop(u, 0.5), { size: 28 }); }
      if (id === 'r1') tag(c, 260, 840, 'A ko PALAT do', P.pink, pop(u, 1.6), { size: 30 });
      if (id === 'r2') { stat(c, 185, 860, flipped ? '7 seedhe' : '3 seedhe', '', pop(u, 1.8), { size: 40, bg: flipped ? '#0f6b58' : P.ink }); stat(c, 535, 860, '7 seedhe', '', pop(u, 3.5), { size: 40, bg: '#0f6b58' }); if (flipped) tag(c, 360, 990, 'Dono mein 7 = 7 ✓', P.pink, pop(u, 7.4), { size: 34 }); }
      critter(c, 'owl', 360, 1180, 0.32, t, { mood: id === 'think' ? 'think' : 'ok', seed: 8, noShadow: true });
    },
  });
})();
