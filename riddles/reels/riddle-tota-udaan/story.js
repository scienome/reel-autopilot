// Rabbit and fox close 120 m at 3+3 m/s: they meet after 20 s. The parrot flies at 6 m/s the whole time: 120 m.
(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, rr, line, parrot } = F, { pop, txt } = F.kit, X0 = 70, PX = 580 / 120;
  const px = (m) => X0 + m * PX;
  // parrot position (metres from the left) after tau seconds: fly to the other animal, turn, repeat
  function birdAt(tau) {
    let a = 0, b = 120, t0 = 0, dir = 1;
    for (let i = 0; i < 60; i++) {
      const gap = b - a, tt = gap / (6 + 3); // parrot 6 vs approaching animal 3
      const t1 = t0 + tt;
      const start = dir > 0 ? a : b;
      if (tau <= t1) return start + dir * 6 * (tau - t0);
      a += 3 * tt; b -= 3 * tt;
      t0 = t1; dir = -dir;
      if (b - a < 0.05) break;
    }
    return (a + b) / 2;
  }
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'r3', 'cta'],
    min: { hook: 11, r1: 4.5, r2: 8, r3: 7 },
    think: ['*Tota kitna udaa?*', 'Comment karo'],
    cta: ['Aapka jawab?', 'Comment karo'],
    caps: { hook: ['*120 m* door. Tota *udta* rahe!', 52], r1: ['Har chakkar *mat* jodo!', 56], r2: ['Dono milke *6 m/s!*', 58], r3: ['6 x 20 = *120 m!*', 60] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      let tau = 0;
      if (id === 'hook') tau = Math.min(9, (u / d('hook')) * 9);
      if (id === 'think') tau = 6; if (id === 'r1') tau = 3 + u * 0.8;
      if (id === 'r2') tau = Math.min(20, (u / (d('r2') - 1.2)) * 20);
      if (id === 'r3') tau = 20;
      const a = 3 * tau, b = 120 - 3 * tau;
      rr(c, 40, 950, 640, 30, 12, '#c9a46a'); for (let m = 0; m <= 120; m += 20) { line(c, [[px(m), 960], [px(m), 990]], 4, '#7a5a2a'); }
      critter(c, 'rabbit', px(a), 950, 0.55, t, { mood: id === 'r3' ? 'happy' : 'ok', seed: 1 });
      critter(c, 'fox', px(b), 950, 0.55, t, { mood: id === 'r3' ? 'happy' : 'ok', seed: 2, flip: true });
      const bm = birdAt(tau); parrot(c, px(bm), 700 + Math.sin(t * 6) * 10, 1.1, t, 1);
      if (id === 'hook' || id === 'think') { tag(c, 110, 1030, '3 m/s', P.pink, 1, { size: 28 }); tag(c, 610, 1030, '3 m/s', P.orange, 1, { size: 28 }); tag(c, 360, 1030, 'Tota 6 m/s', P.teal, pop(u, 3.5), { size: 28 }); }
      if (id === 'r1') { stat(c, 360, 420, 'chakkar 1+2+3+...', '', 1, { size: 44, bg: '#8a2b3d' }); }
      if (id === 'r2') { stat(c, 360, 420, `${Math.round(tau)}`, 'sec', 1, { size: 80, bg: P.navy }); tag(c, 360, 1030, '3 + 3 = 6 m/s paas', P.pink, pop(u, 0.3), { size: 30 }); }
      if (id === 'r3') { stat(c, 360, 420, '120', 'm', pop(u, 1.5), { size: 90, bg: '#0f6b58' }); tag(c, 360, 1030, '6 m/s x 20 sec', P.teal, pop(u, 0.4), { size: 32 }); }
    },
  });
})();
