// 5 friends, every pair shakes once: 4+3+2+1 = 10.
(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, line } = F, { pop } = F.kit;
  const KINDS = ['lion', 'fox', 'rabbit', 'bear', 'monkey'], NAME = ['Sher', 'Lomdi', 'Khargosh', 'Bhalu', 'Bandar'];
  // five friends around a pentagon
  const PT = KINDS.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return [360 + Math.cos(a) * 235, 800 + Math.sin(a) * 215]; });
  const PAIRS = []; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) PAIRS.push([i, j]);
  const COL = [P.pink, P.teal, P.orange, P.sky, P.lav];
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'r3', 'cta'],
    min: { hook: 6, r1: 5, r2: 9, r3: 5 },
    think: ['*Kitne handshake?*', 'Comment karo'],
    cta: ['Kitna gina?', 'Comment karo'],
    caps: { hook: ['*5 dost.* Har jodi *1 baar* haath milati hai.', 48], r1: ['*5 x 5* nahi!', 62], r2: ['Har dost ke *naye* haath.', 52], r3: ['4 + 3 + 2 + 1 = *10!*', 56] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      let shown = 0, cur = -1;
      if (id === 'r2') { const f = u / d('r2'); shown = Math.min(10, Math.floor(f * 10.4)); cur = shown < 4 ? 0 : shown < 7 ? 1 : shown < 9 ? 2 : 3; }
      if (id === 'r3') shown = 10;
      if (id === 'hook') shown = Math.min(3, Math.floor(u / (d('hook') / 4)));
      PAIRS.forEach(([a, b], k) => { if (k >= shown) return; line(c, [PT[a], PT[b]], 9, COL[a]); });
      PT.forEach(([x, y], i) => critter(c, KINDS[i], x, y + 64, 0.5, t, { mood: id === 'r3' ? 'happy' : cur === i ? 'happy' : 'ok', seed: i, arms: cur === i ? 'up' : null }));
      PT.forEach(([x, y], i) => tag(c, x, y + 84, NAME[i], COL[i], 1, { size: 24 }));
      if (id === 'r1') { stat(c, 360, 420, '25', 'handshake?', 1, { size: 80, bg: '#8a2b3d' }); const k = pop(u, 0.8, 0.3); line(c, [[190, 460], [190 + 340 * k, 380]], 12, '#ffd93b'); }
      if (id === 'r2' || id === 'r3') stat(c, 360, 420, String(id === 'r3' ? 10 : shown), 'handshake', 1, { size: 80, bg: id === 'r3' ? '#0f6b58' : P.navy });
    },
  });
})();
