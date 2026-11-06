(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const face = (c, O, U, V, hl, grid, col) => {
    const pt = (a, b) => [O[0] + U[0] * a + V[0] * b, O[1] + U[1] * a + V[1] * b];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const e = (i === 1) !== (j === 1), on = hl && e; poly(c, [pt(i / 3, j / 3), pt((i + 1) / 3, j / 3), pt((i + 1) / 3, (j + 1) / 3), pt(i / 3, (j + 1) / 3)], on ? P.yellow : col); if (grid) { c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = grid; c.beginPath(); [pt(i / 3, j / 3), pt((i + 1) / 3, j / 3), pt((i + 1) / 3, (j + 1) / 3), pt(i / 3, (j + 1) / 3)].forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke(); } }
  };
  const cube = (c, cx, cy, grid, hl) => { const a = 130, h = 75, L = 150; face(c, [cx - a, cy - h], [a, -h], [a, h], hl, grid, '#e5383b'); face(c, [cx - a, cy - h], [a, h], [0, L], hl, grid, '#c42b3a'); face(c, [cx, cy], [a, -h], [0, L], hl, grid, '#ef5a5a'); };
  const ROWS = [['8 kone', '3 rang', 8, P.pink], ['12 kinare', '2 rang', 12, P.orange], ['6 faces ke beech', '1 rang', 6, P.violet], ['1 andar', '0 rang', 1, P.teal]];
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 5, rule: 4, r1: 2.5, r2: 14 },
    think: ['*Exactly 2 rang?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['3x3x3 cube, bahar se *laal*', 52], rule: ['*27* chhote cube mein kata', 52], r1: ['*12* cube', 72], r2: ['8 + 12 + 6 + 1 = *27*', 56] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const grid = id === 'hook' ? 0 : 5, hl = id === 'r1' || id === 'r2' || id === 'think';
      cube(c, 360, 520, grid, hl);
      if (id === 'r2') ROWS.forEach(([a, b, n, col], i) => { const k = pop(u, 1 + i * 2.6); if (k > 0) { tag(c, 200, 830 + i * 85, a, col, k, { size: 30 }); tag(c, 470, 830 + i * 85, b + ': ' + n, col, k, { size: 30 }); } });
      if (id === 'r1') stat(c, 360, 900, '12', '', pop(u, 0.3), { size: 100, bg: P.pink });
      critter(c, 'monkey', 620, 1230, 0.3, t, { mood: id === 'think' ? 'think' : 'happy', seed: 2, flip: true, noShadow: true });
    },
  });
})();
