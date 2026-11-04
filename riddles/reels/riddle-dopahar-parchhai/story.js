(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // at noon the sun is overhead: shadows are short, so the owl's 'very long shadow' is a lie.
  F.runRiddle('r', {
    ids: ['hook', 's1', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, s1: 7, r1: 3.5, r2: 9 },
    think: ['*Sach ya jhooth?*', 'Comment karo'], cta: ['Pakda?', 'Comment karo'],
    caps: { hook: ['Theek *dopahar 12 baje*. Taj chori!', 48], s1: ['Ullu: *bahut lambi parchhai*', 50], r1: ['*Jhooth!* Ullu hi chor!', 56], r2: ['Dopahar = *parchhai sabse chhoti*', 46] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t); glow(c, 360, 220, 240, P.yellow, 0.8); circ(c, 360, 220, 70, P.yellow);
      const fx = id === 'r2' ? 1 : 0; oval(c, 200, 1070, 70, 14, 'rgba(22,13,63,0.35)'); critter(c, 'lion', 200, 1060, 0.55, t, { mood: id === 'hook' ? 'scared' : 'ok', seed: 1 }); tag(c, 200, 1090, 'Sher', P.navy, 1, { size: 26 });
      const hot = id === 'r1' || id === 'r2'; if (hot) glow(c, 520, 900, 200, P.pink, 0.45); oval(c, 520, 1070, 50, 10, 'rgba(22,13,63,0.35)'); critter(c, 'owl', 520, 1060, 0.5, t, { mood: hot ? 'scared' : id === 'think' ? 'think' : 'sly', seed: 2 }); tag(c, 520, 1090, 'Ullu', hot ? '#d12f52' : P.navy, 1, { size: 26 });
      if (id === 's1') { bubble(c, 470, 640, 'Chor ki parchhai|ped jitni lambi thi!', 520, 880, pop(u, 0.3), { size: 26 }); c.globalAlpha = 0.5 * pop(u, 2); poly(c, [[300, 1150], [700, 1180], [700, 1230], [300, 1200]], P.ink); c.globalAlpha = 1; }
      if (fx) { line(c, [[360, 290], [200, 1000]], 4, 'rgba(255,224,102,0.8)'); tag(c, 360, 380, 'SURAJ SIR KE UPAR', P.orange, pop(u, 0.5), { size: 28 }); tag(c, 360, 1180, 'parchhai = chhoti', '#0f6b58', pop(u, 2), { size: 28 }); }
    },
  });
})();
