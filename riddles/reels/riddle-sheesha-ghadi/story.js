(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const clock = (c, x, y, r, h, m, flip, col) => {
    c.save(); c.translate(x, y); if (flip) c.scale(-1, 1); circ(c, 0, 0, r + 10, P.ink); circ(c, 0, 0, r, col || '#fff');
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, l = i % 3 ? 22 : 36; line(c, [[Math.sin(a) * (r - 8), -Math.cos(a) * (r - 8)], [Math.sin(a) * (r - l), -Math.cos(a) * (r - l)]], i % 3 ? 5 : 9, P.ink); }
    circ(c, 0, -(r - 58), 10, P.pink);
    const ha = ((h % 12) + m / 60) * Math.PI / 6, ma = m * Math.PI / 30;
    line(c, [[0, 0], [Math.sin(ha) * r * 0.5, -Math.cos(ha) * r * 0.5]], 15, P.ink); line(c, [[0, 0], [Math.sin(ma) * r * 0.78, -Math.cos(ma) * r * 0.78]], 9, P.violet); circ(c, 0, 0, 12, P.ink); c.restore();
  };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 5, rule: 4, r1: 2.5, r2: 11 },
    think: ['*Asli samay?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['Sheeshe mein *3:15*', 62], rule: ['Sheesha *ulta* dikhata hai', 54], r1: ['Asli samay *8:45*', 60], r2: ['12:00 - 3:15 = *8:45*', 58] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const real = id === 'r1' || id === 'r2';
      rr(c, 95, real ? 270 : 330, 530, real ? 420 : 460, 34, '#b9c3d9'); rr(c, 112, real ? 286 : 346, 496, real ? 388 : 428, 26, '#d6e8f7'); poly(c, [[150, real ? 560 : 640], [260, real ? 300 : 360], [300, real ? 300 : 360], [190, real ? 560 : 640]], 'rgba(255,255,255,.35)');
      clock(c, 360, real ? 480 : 560, real ? 130 : 160, 8, 45, true, '#f3f9ff');
      tag(c, 360, real ? 740 : 830, 'SHEESHA: 3:15', P.violet, pop(u, 0.4), { size: 32 });
      if (real) { clock(c, 360, 930, 120, 8, 45, false); tag(c, 360, 1090, 'ASLI GHADI: 8:45', P.pink, pop(u, 0.5), { size: 32 }); }
      critter(c, 'monkey', 600, 1170, 0.34, t, { mood: id === 'think' ? 'think' : 'happy', seed: 6, flip: true, noShadow: true });
    },
  });
})();
