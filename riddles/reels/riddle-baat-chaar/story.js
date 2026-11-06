(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const wt = (c, x, y, v, r, col) => { circ(c, x, y, r, col); circ(c, x, y, r * 0.78, 'rgba(255,255,255,.18)'); txt(c, v, x, y + 2, r * 0.85, P.white); };
  const bal = (c, tilt) => { line(c, [[360, 560], [360, 900]], 14, P.ink); rr(c, 300, 900, 120, 22, 8, P.ink); c.save(); c.translate(360, 560); c.rotate(tilt); rr(c, -260, -9, 520, 18, 8, P.violet); c.restore(); circ(c, 360, 560, 18, P.amber); };
  const pan = (c, x, y) => { line(c, [[x - 100, y - 160], [x - 100, y]], 4, P.ink); line(c, [[x + 100, y - 160], [x + 100, y]], 4, P.ink); c.fillStyle = P.teal; c.beginPath(); c.moveTo(x - 120, y); c.lineTo(x + 120, y); c.quadraticCurveTo(x, y + 56, x - 120, y); c.fill(); };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, rule: 4, r1: 4, r2: 13 },
    think: ['*Kaunse 4 baat?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['1 se *40 kg*, sirf *4 baat*', 56], rule: ['Baat *dono pallo* mein', 56], r1: ['*1, 3, 9, 27*', 70], r2: ['*9* = 5 + 3 + 1', 46] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); bal(c, 0); pan(c, 140, 700); pan(c, 580, 700);
      const W = [[1, 28, '#ef3f80'], [3, 36, '#4a35b8'], [9, 44, '#149c86'], [27, 52, '#ef7435']];
      if (id === 'r2') {
        rr(c, 70, 610, 110, 74, 10, '#c98a45'); txt(c, '5 kg', 125, 648, 34, P.white); wt(c, 200, 654, '3', 36, W[1][2]); wt(c, 250, 664, '1', 28, W[0][2]); wt(c, 580, 640, '9', 44, W[2][2]);
        tag(c, 360, 1010, '9 = 5 + 3 + 1', P.pink, pop(u, 1.4), { size: 44 });
        W.forEach(([v, r, col], i) => wt(c, 140 + i * 150, 1130, v, r * 0.8, col)); 
      } else if (id === 'r1') W.forEach(([v, r, col], i) => wt(c, 110 + i * 166, 1010, v, r * 1.4, col)); 
      else [0, 1, 2, 3].forEach((i) => wt(c, 110 + i * 166, 1010, '?', 48, '#6a5fb0'));
      critter(c, 'elephant', 360, 1215, 0.3, t, { mood: id === 'think' ? 'think' : 'ok', seed: 5, noShadow: true });
    },
  });
})();
