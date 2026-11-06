(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const X = (m) => 60 + m * 66.6;
  const glass = (c, x, y, s, col) => { poly(c, [[x - 40 * s, y - 70 * s], [x + 40 * s, y - 70 * s], [x, y]], col); poly(c, [[x - 40 * s, y + 70 * s], [x + 40 * s, y + 70 * s], [x, y]], shade(col, 0.7)); rr(c, x - 50 * s, y - 80 * s, 100 * s, 12 * s, 4, P.ink); rr(c, x - 50 * s, y + 68 * s, 100 * s, 12 * s, 4, P.ink); };
  const shade = F.shade || ((a) => a);
  const SEG = { A: [[0, 4, P.pink], [4, 8, '#ff9fc0']], B: [[0, 7, P.violet], [7, 8, P.teal], [8, 9, P.sky]] }, RANGE = { r1: [0, 4], r2: [4, 7], r3: [7, 8], r4: [8, 9] };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'r3', 'r4', 'cta'], min: { hook: 5.5, rule: 4, r1: 6, r2: 6, r3: 7, r4: 4 },
    think: ['*Kaise 9 minute?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['*4 min* aur *7 min* ki ghadi', 52], rule: ['Gino *theek 9* minute', 52], r1: ['*4 min* par chaar wali *palto*', 48], r2: ['*7 min* par saat wali *palto*', 48], r3: ['*8 min* par saat wali *dobara palto*', 44], r4: ['*9 minute!*', 72] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      glass(c, 200, 420, 1.1, P.pink); tag(c, 200, 540, '4 min', P.pink, 1, { size: 30 }); glass(c, 520, 420, 1.1, P.violet); tag(c, 520, 540, '7 min', P.violet, 1, { size: 30 });
      const rg = RANGE[id], tau = rg ? rg[0] + (rg[1] - rg[0]) * Math.min(1, u / (d(id) - 0.8)) : 0;
      txt(c, 'Time ->', 360, 720, 28, P.white, 800);
      for (let m = 0; m <= 9; m++) { line(c, [[X(m), 760], [X(m), 780]], 3, P.white); txt(c, m, X(m), 800, 26, P.white, 800); }
      [['A', 860, '4'], ['B', 960, '7']].forEach(([k, y, lb]) => { rr(c, 50, y - 28, 620, 56, 10, 'rgba(22,13,63,.55)'); SEG[k].forEach(([a, b, col]) => { const e = Math.min(b, tau); if (e > a) rr(c, X(a), y - 22, X(e) - X(a) - 2, 44, 8, col); }); txt(c, lb, 28, y, 28, P.white); });
      if (rg) { line(c, [[X(tau), 740], [X(tau), 1000]], 5, P.yellow); stat(c, 360, 1090, 'Samay: ' + (Math.round(tau * 10) / 10) + ' min', '', 1, { size: 44, bg: id === 'r4' && tau >= 8.95 ? P.pink : P.ink }); }
      critter(c, 'owl', 620, 640, 0.28, t, { mood: id === 'think' ? 'think' : 'ok', seed: 8, flip: true, noShadow: true });
    },
  });
})();
