(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // apex lines A-B, A-D, A-E, A-C; transversals: mid line and base -> C(4,2) * 2 = 12.
  const A = [360, 430], B = [100, 1050], C = [620, 1050], Dp = [273, 1050], Ep = [447, 1050], K = 0.55;
  const at = (p, k) => [A[0] + (p[0] - A[0]) * k, A[1] + (p[1] - A[1]) * k];
  const pts = [B, Dp, Ep, C];
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 7, r1: 3.5, r2: 11 },
    think: ['*Kitne trikon?*', 'Number comment karo'], cta: ['Kitne gine?', 'Comment karo'],
    caps: { hook: ['Kitne *trikon* hain?', 60], r1: ['6 nahi! *12!*', 64], r2: ['Upar *6* + poore *6* = *12*', 52] },
    scene(c, t, id, u, d) {
      SET.office(c, t); rr(c, 60, 380, 600, 720, 24, P.paper);
      const hl = []; if (id === 'r2') { const f = u / d('r2'); const n = Math.min(12, Math.floor(f * 13)); for (let i = 0; i < n; i++) hl.push(i); }
      const pairs = []; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pairs.push([i, j]);
      hl.forEach((h) => { const [i, j] = pairs[h % 6], k = h < 6 ? K : 1; c.globalAlpha = h === hl.length - 1 ? 0.55 : 0.12; poly(c, [A, at(pts[i], k), at(pts[j], k)], h < 6 ? P.pink : P.teal); c.globalAlpha = 1; });
      line(c, [A, B, C, A], 8, P.ink); line(c, [A, Dp], 6, P.ink); line(c, [A, Ep], 6, P.ink); line(c, [at(B, K), at(C, K)], 6, P.ink);
      critter(c, 'owl', 600, 1180, 0.38, t, { mood: id === 'think' ? 'think' : 'happy', seed: 1 });
      if (id === 'r1' || id === 'r2') stat(c, 140, 300, id === 'r2' ? String(Math.max(1, hl.length)) : '12', 'trikon', 1, { size: 70, bg: '#0f6b58' });
    },
  });
})();
