(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const clock = (c, x, y, r, hrs) => {
    circ(c, x, y, r + 12, P.ink); circ(c, x, y, r, '#fff');
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, l = i % 3 ? 22 : 38; line(c, [[x + Math.sin(a) * (r - 8), y - Math.cos(a) * (r - 8)], [x + Math.sin(a) * (r - l), y - Math.cos(a) * (r - l)]], i % 3 ? 5 : 9, P.ink); }
    const ha = hrs * Math.PI / 6, ma = (hrs % 1) * Math.PI * 2;
    line(c, [[x, y], [x + Math.sin(ha) * r * 0.5, y - Math.cos(ha) * r * 0.5]], 16, P.ink); line(c, [[x, y], [x + Math.sin(ma) * r * 0.8, y - Math.cos(ma) * r * 0.8]], 10, P.pink); circ(c, x, y, 13, P.ink);
  };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 4.5, rule: 8, r1: 3, r2: 14 },
    think: ['*Kitni baar?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['12 baje *dono kaante* mile', 54], rule: ['12 ghante mein *kitni baar* milenge?', 46], r1: ['*11* baar, 12 nahi!', 58], r2: ['Har *1 ghanta 5+ min* mein', 52] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); let hrs = 0;
      if (id === 'rule') hrs = Math.min(2.4, u * 0.35); if (id === 'think') hrs = 0; if (id === 'r2') hrs = Math.min(11.999, u * 0.9); if (id === 'r1') hrs = 11.999;
      clock(c, 360, 600, 200, hrs);
      const n = id === 'r2' || id === 'r1' ? Math.min(11, Math.floor(hrs * 11 / 12) + 1) : id === 'rule' ? Math.floor(hrs * 11 / 12) + 1 : 1;
      stat(c, 360, 940, 'Milan: ' + n, '', 1, { size: 62, bg: id === 'r1' ? P.pink : P.ink });
      if (id === 'r2' && u > 9) tag(c, 360, 1050, '12wa milan = agle 12 baje', P.violet, pop(u, 9.2), { size: 28 });
      critter(c, 'owl', 620, 1200, 0.32, t, { mood: id === 'think' ? 'think' : 'happy', seed: 3, flip: true, noShadow: true });
    },
  });
})();
