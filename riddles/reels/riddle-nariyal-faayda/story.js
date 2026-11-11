(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, rr, glow } = F, { pop, coconut } = F.kit;
  // two separate deals: -60 +70 = +10, then -80 +90 = +10, total +20 (most people say 10). Checked: -60+70-80+90 = 20.
  const price = (c, x, y, s, col, k) => tag(c, x, y, s, col, k, { size: 40 });
  F.runRiddle('r', {
    ids: ['hook', 's1', 'think', 'r1', 'r2', 'cta'], min: { hook: 5.5, s1: 5.5, r1: 3.5, r2: 9 },
    think: ['*Kul faayda kitna?*', 'Rupaye comment karo'], cta: ['10 ya 20?', 'Comment karo'],
    caps: { hook: ['₹60 mein liya. *₹70 mein becha*', 50], s1: ['Phir ₹80 mein liya. *₹90 mein becha*', 46], r1: ['10 nahi! *₹20!*', 60], r2: ['Do alag sauda: *+10 aur +10*', 48] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      rr(c, 420, 760, 260, 200, 18, '#b8743a'); rr(c, 410, 740, 280, 30, 10, '#d12f52');
      critter(c, 'monkey', 200, 1060, 0.62, t, { mood: id === 'think' ? 'think' : id === 'r1' || id === 'r2' ? 'happy' : 'sly', seed: 1, hold: (q) => coconut(q, 0, -70, 1) });
      critter(c, 'rabbit', 550, 1060, 0.55, t, { mood: 'ok', seed: 2, flip: true });
      if (id === 'hook') { price(c, 200, 560, '-₹60', '#d12f52', pop(u, 0.4)); price(c, 520, 560, '+₹70', '#0f6b58', pop(u, 3.0)); }
      if (id === 's1') { price(c, 200, 560, '-₹80', '#d12f52', pop(u, 0.4)); price(c, 520, 560, '+₹90', '#0f6b58', pop(u, 3.0)); }
      if (id === 'r1') { glow(c, 360, 440, 200, P.yellow, 0.5); stat(c, 360, 440, '₹20', 'faayda', pop(u, 0.2), { size: 100, bg: '#0f6b58' }); }
      if (id === 'r2') {
        price(c, 190, 470, '-60 +70 = +10', '#3a3a8a', pop(u, 0.3));
        price(c, 530, 600, '-80 +90 = +10', '#3a3a8a', pop(u, 4.0));
        stat(c, 360, 770 - 160, '+20', '', pop(u, 7.2), { size: 80, bg: '#0f6b58' });
      }
    },
  });
})();
