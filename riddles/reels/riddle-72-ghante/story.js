(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // midnight + 72 h = midnight again: no sunshine.
  const clock = (c, x, y, h, mlab) => { circ(c, x, y, 110, P.white); circ(c, x, y, 100, P.paper); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; circ(c, x + Math.sin(a) * 82, y - Math.cos(a) * 82, 5, P.ink); }
    const a = (h % 12) * Math.PI / 6; line(c, [[x, y], [x + Math.sin(a) * 55, y - Math.cos(a) * 55]], 10, P.ink); line(c, [[x, y], [x, y - 80]], 6, P.ink); tag(c, x, y + 140, mlab, P.navy, 1, { size: 28 }); };
  F.runRiddle('r', {
    ids: ['hook', 's1', 'think', 'r1', 'r2', 'cta'], min: { hook: 5, s1: 4.5, r1: 3, r2: 9 },
    think: ['*Haan ya na?*', 'Comment karo'], cta: ['Phanse ya nahi?', 'Comment karo'],
    caps: { hook: ['*Raat 12 baje* baarish', 58], s1: ['*72 ghante* baad dhoop?', 58], r1: ['*NA!*', 90], r2: ['72 ghante = *3 din* = phir *raat 12*', 44] },
    scene(c, t, id, u, d) {
      SET.bedroom(c, t);
      rr(c, 20, 610, 150, 80, 12, '#160d3f'); c.fillStyle = '#ff5a7a'; c.font = '900 44px Montserrat'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('12:00', 95, 652);
      for (let i = 0; i < 30; i++) { const x = (i * 97 + t * 40) % 720, y = (i * 211 + t * 700) % 1280; line(c, [[x, y], [x - 5, y + 20]], 2, 'rgba(200,230,255,0.5)'); }
      if (id === 'r2') { const f = u / d('r2'); const days = Math.min(3, Math.floor(f * 4)); clock(c, 360, 760, 12, days ? days + ' din baad' : 'abhi'); tag(c, 360, 560, 'RAAT 12 BAJE', P.night, 1, { size: 34 }); }
      else clock(c, 360, 760, 12, id === 's1' || id === 'think' ? '+72 ghante?' : 'raat 12 baje');
      critter(c, 'owl', 360, 1160, 0.45, t, { mood: id === 'think' ? 'think' : 'happy', seed: 1 });
      if (id === 'r1') stat(c, 360, 400, 'NA', '', 1, { size: 90, bg: '#d12f52' });
    },
  });
})();
