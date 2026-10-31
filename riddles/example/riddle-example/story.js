// A complete small riddle. Copy this folder to riddles/reels/riddle-<slug> and change it.
// Shot ids: hook first, then any setup ids, then think, then r1, r2... (answers), then cta.
(function () {
  const F = window.FLAT, { P, SET, stat, critter, circ, oval } = F, { banana } = F.kit;
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'],
    // seconds each shot needs at least; the voice stretches them
    min: { hook: 4.5, r1: 3.5, r2: 5 },
    think: ['*100 + 100 = ?*', 'Minute comment karo'],
    cta: ['Phanse ya nahi?', 'Comment karo'],
    // captions: [text with *hot* words, size, hot colour]
    caps: { hook: ['5 bandar. 5 kele. *5 minute.*', 54], r1: ['100 nahi! *5 minute!*', 58], r2: ['Har bandar: *1 kela, 5 minute.*', 48] },
    // draws the world for a shot; u = seconds into the shot, d('r1') = that shot's length
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      if (id === 'hook' || id === 'r2') {
        [100, 230, 360, 490, 620].forEach((x, i) => critter(c, 'monkey', x, 1000, 0.66, t, { mood: 'happy', seed: i, hold: (q) => banana(q, 0, -70, 1) }));
        stat(c, 360, 420, '5', 'min', 1, { size: 90, bg: P.pink });
      } else {
        for (let r = 0; r < 10; r++) for (let q = 0; q < 10; q++) {
          const x = 68 + q * 65, y = 520 + r * 64 + Math.sin(t * 3 + q + r) * 3;
          circ(c, x - 22, y, 9, '#8a5430'); circ(c, x + 22, y, 9, '#8a5430'); circ(c, x, y, 25, '#8a5430'); oval(c, x, y + 4, 17, 14, '#f3c9a0');
          for (const sd of [-8, 8]) { circ(c, x + sd, y - 5, 4, P.white); circ(c, x + sd, y - 5, 2, P.ink); }
          banana(c, x, y + 28, 0.4);
        }
        stat(c, 360, 395, id === 'r1' ? '5' : '?', 'min', 1, { size: 86, bg: id === 'r1' ? '#0f6b58' : P.pink });
      }
    },
  });
})();
