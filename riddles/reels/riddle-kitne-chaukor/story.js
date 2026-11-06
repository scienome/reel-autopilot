(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const X0 = 96, Y0 = 380, S = 66;
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 4.5, rule: 5, r1: 3, r2: 14 },
    think: ['*Kitne chaukor?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['8 x 8 board mein *kitne chaukor*?', 48], rule: ['Chhote *aur bade* sab gino', 52], r1: ['64 nahi, *204*!', 66], r2: ['64 + 49 + 36 + ... + 1 = *204*', 42] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) rr(c, X0 + j * S, Y0 + i * S, S, S, 2, (i + j) % 2 ? '#4a35b8' : '#f3ecff');
      const sz = id === 'rule' ? 1 + Math.floor(u / 0.9) % 8 : id === 'r2' ? Math.min(8, Math.floor(u / 1.5) + 1) : 0;
      if (sz) { const n = (9 - sz) * (9 - sz); for (let i = 0; i <= 8 - sz; i++) for (let j = 0; j <= 8 - sz; j++) { c.strokeStyle = 'rgba(239,63,128,.55)'; c.lineWidth = 4; c.strokeRect(X0 + j * S + 3, Y0 + i * S + 3, sz * S - 6, sz * S - 6); } rr(c, X0, Y0, sz * S, sz * S, 4, 'rgba(239,63,128,.35)'); if (id === 'r2') stat(c, 360, 1010, sz + ' x ' + sz + ' : ' + n, '', 1, { size: 50, bg: P.ink }); }
      if (id === 'r2' && u > 12) stat(c, 360, 1110, '= 204', '', pop(u, 12), { size: 66, bg: P.pink });
      if (id === 'r1') stat(c, 360, 1010, '204', '', pop(u, 0.3), { size: 100, bg: P.pink });
      critter(c, 'monkey', 620, 1230, 0.3, t, { mood: id === 'think' ? 'think' : 'happy', seed: 2, flip: true, noShadow: true });
    },
  });
})();
