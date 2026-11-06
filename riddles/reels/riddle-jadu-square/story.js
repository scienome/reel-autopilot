(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const G = [[6, 1, 8], [7, 5, 3], [2, 9, 4]], SHOWN = [[1, 0, 1], [0, 1, 0], [1, 0, 1]];
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 7, rule: 5, r1: 2.5, r2: 13 },
    think: ['*? = kya*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['1 se 9, *har ek bar*', 58], rule: ['Har line ka *jod barabar*', 54], r1: ['Khana = *7*', 66], r2: ['*15* - (6 + 2) = 7', 58] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const x0 = 135, y0 = 410, S = 150, done = id === 'r1' || id === 'r2';
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        const x = x0 + j * S, y = y0 + i * S, tgt = i === 1 && j === 0, show = SHOWN[i][j] || (done && (id === 'r2' || tgt));
        rr(c, x + 4, y + 4, S - 8, S - 8, 16, tgt ? P.yellow : show ? P.white : '#1c2f7d');
        txt(c, show ? G[i][j] : '?', x + S / 2, y + S / 2 + 4, 80, tgt ? P.pink : show ? P.ink : '#8f7bf0');
      }
      if (id === 'rule') { line(c, [[x0 + 12, y0 + 12], [x0 + 3 * S - 12, y0 + 3 * S - 12]], 8, P.pink); stat(c, 360, 960, '6 + 5 + 4 = 15', '', pop(u, 1.5), { size: 52, bg: P.ink }); }
      if (id === 'r2') { line(c, [[x0 + 12, y0 + 12], [x0 + 3 * S - 12, y0 + 3 * S - 12]], 5, P.pink); line(c, [[x0 + 75, y0 + 12], [x0 + 75, y0 + 3 * S - 12]], 5, P.teal); stat(c, 360, 960, '6 + 5 + 4 = 15', '', pop(u, 0.5), { size: 48, bg: P.ink }); stat(c, 360, 1060, '15 - 6 - 2 = 7', '', pop(u, 6), { size: 52, bg: '#0f6b58' }); }
      critter(c, 'owl', 360, 1230, 0.3, t, { mood: id === 'think' ? 'think' : 'happy', seed: 6, noShadow: true });
    },
  });
})();
