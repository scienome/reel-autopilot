KATHA((h) => {
  const { V, first, char, card } = h;
  const BB = 'barbarik';
  const arrow = (ctx, x, y, ang, s = 1, glow = true) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
    if (glow) { const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 140); g.addColorStop(0, 'rgba(255,220,120,0.6)'); g.addColorStop(1, 'rgba(255,200,80,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(-20, 0, 160, 40, 0, 0, Math.PI * 2); ctx.fill(); }
    MYTH.ITEMS.arrow(ctx); ctx.restore(); };
  // the peepal tree's leaves, each pierced once the arrow passes (u = 0..1)
  const LEAVES = Array.from({ length: 34 }, (_, i) => [360 + Math.cos(i * 2.39) * (40 + (i * 37) % 190), 560 + Math.sin(i * 2.39) * (30 + (i * 53) % 150)]);
  const peepal = (ctx, t, u) => { MYTH.line(ctx, '#6a4426', 40, [[360, 1140], [360, 700]]); MYTH.ell(ctx, '#2f8a4a', 360, 560, 260, 210, 0, 6);
    LEAVES.forEach(([x, y], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate(i); MYTH.smooth(ctx, '#4aa85a', [[0, -22], [14, 0], [0, 22], [-14, 0]], 3); if (i / LEAVES.length < u) MYTH.ell(ctx, '#ffe08a', 0, 0, 5, 5, 0, 2); ctx.restore(); }); };
  return {
    // hook: one glowing arrow over the battlefield
    h1: { set: 'battle', cam: [[360, 760, 1.0], [360, 720, 1.15]],
      draw: (ctx, t) => { char(ctx, BB, 360, 1180, 0.8, t, { holdL: 'bow', hold: 'arrow', arms: { r: 'draw', l: 'bowL' }, face: { eyes: 'calm', mouth: 'calm' }, glow: 'rgba(255,210,120,0.35)' });
        const u = H.clamp((t - V('h1', 'मिनट') + 0.3) / 0.8); if (u > 0 && u < 1) arrow(ctx, -200 + 1200 * u, 420 - 120 * u, -0.1, 1.2); },
      over: (ctx, W, H_, t) => card(ctx, W, H_, t, V('h1', 'मिनट'), '1 मिनट', { y: 330, size: 70 }) },
    h2: { set: 'heaven', cam: [[360, 720, 1.8], [360, 700, 2.0]],
      draw: (ctx, t) => char(ctx, 'krishna', 360, 1170, 0.82, t, { halo: true, arms: { r: 'bless', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' } }) },
    b1: { set: 'forest', setOpt: { time: 'day' }, cam: [[360, 820, 1.1], [360, 760, 1.4]],
      draw: (ctx, t) => char(ctx, BB, 360, 1170, 0.86, t, { holdL: 'bow', arms: { r: 'hips', l: 'rest' }, face: { eyes: 'open', mouth: 'smile' } }),
      over: (ctx, W, H_, t) => card(ctx, W, H_, t, V('b1', 'बर्बरीक...'), 'बर्बरीक', { y: 300, size: 74 }) },
    // three arrows
    b2: { set: 'kailash', cam: [[360, 760, 1.1], [360, 720, 1.2]],
      draw: (ctx, t) => { char(ctx, BB, 360, 1180, 0.8, t, { arms: { r: 'up', l: 'hips' }, face: { eyes: 'open', mouth: 'smile', look: [0.5, -1] } });
        for (let i = 0; i < 3; i++) { const u = popU(t, V('b2', 'तीन') + i * 0.18, 0.35); if (u > 0) arrow(ctx, 360 + (i - 1) * 110, 330, -Math.PI / 2, 0.9 * u); } } },
    b3: { set: 'battle', cam: [[360, 740, 1.6], [360, 720, 1.9]],
      draw: (ctx, t) => char(ctx, BB, 360, 1180, 0.84, t, { arms: { r: 'fist', l: 'hips' }, face: { eyes: 'angry', mouth: 'calm' } }),
      over: (ctx, W, H_, t) => card(ctx, W, H_, t, V('b3', 'हारने'), 'हारने वाले का साथ', { y: 300, size: 54 }) },
    // switching sides forever: arrows fly both ways until nobody is left
    b4: { set: 'battle', cam: [[360, 760, 1.0], [360, 760, 1.0]],
      draw: (ctx, t) => { const a0 = first('b4'); for (let i = 0; i < 6; i++) { const u = (t - a0 - i * 0.35) / 0.5; if (u > 0 && u < 1) arrow(ctx, i % 2 ? 900 - 1100 * u : -180 + 1100 * u, 520 + i * 60, i % 2 ? Math.PI : 0, 0.8); } },
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, H.clamp((t - V('b4', 'बचता।') + 0.2) / 0.6) * 0.75) },
    // the test at the peepal tree
    b5: { set: 'forest', setOpt: { time: 'day' }, cam: [[360, 760, 0.95], [360, 740, 1.0]],
      draw: (ctx, t) => { const s0 = V('b5', 'एक'), u = H.clamp((t - s0) / 1.6); peepal(ctx, t, u);
        if (u > 0 && u < 1) { const a = u * Math.PI * 4; arrow(ctx, 360 + Math.cos(a) * 200, 560 + Math.sin(a) * 160, a + Math.PI / 2, 0.6); }
        char(ctx, BB, 120, 1010, 0.6, t, { holdL: 'bow', arms: { r: 'draw', l: 'bowL' }, face: { eyes: 'calm', mouth: 'calm' } });
        char(ctx, 'krishna', 610, 1010, 0.6, t, { flip: true, arms: 'hips', face: { eyes: 'calm', mouth: 'smile' } }); } },
    // the hidden leaf under Krishna's foot
    b6: { set: 'forest', setOpt: { time: 'day' }, cam: [[360, 1100, 2.2], [360, 1135, 2.5]],
      draw: (ctx, t) => { ctx.save(); ctx.translate(380, 1172); ctx.rotate(0.3); MYTH.smooth(ctx, '#4aa85a', [[0, -18], [40, 0], [0, 18], [-40, 0]], 3); ctx.restore();
        char(ctx, 'krishna', 360, 1170, 0.82, t, { arms: 'hips', face: { eyes: 'calm', mouth: 'smile' } });
        if (t > V('b6', 'बाण')) { const a = (t - V('b6', 'बाण')) * 6; arrow(ctx, 370 + Math.cos(a) * 70, 1150 + Math.sin(a) * 22, a + Math.PI / 2, 0.45); } } },
    b7: { set: 'forest', setOpt: { time: 'dusk' }, cam: [[360, 800, 1.1], [360, 780, 1.2]],
      draw: (ctx, t) => { char(ctx, 'krishna', 500, 1170, 0.75, t, { flip: true, halo: true, arms: { r: 'open', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' } });
        char(ctx, BB, 210, 1170, 0.72, t, { arms: 'namaste', face: { eyes: t > V('b7', 'शीश।') ? 'closed' : 'wide', mouth: t > V('b7', 'शीश।') ? 'smile' : 'o' } }); } },
    bb1: { set: 'forest', setOpt: { time: 'dusk' }, cam: [[360, 720, 1.9], [360, 700, 2.1]],
      draw: (ctx, t) => char(ctx, BB, 360, 1170, 0.84, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' }, glow: 'rgba(255,220,150,0.3)' }) },
    // Khatu Shyam: the sheesh on the hill, worshipped today
    end: { set: 'heaven', cam: [[360, 720, 1.2], [360, 700, 1.3]],
      draw: (ctx, t) => { MYTH.ell(ctx, '#6a8a4a', 360, 1180, 360, 220, 0, 6); MYTH.aura(ctx, 360, 760, 150, t);
        MYTH.head(ctx, MYTH.CAST.barbarik, 360, 780, { eyes: 'open', mouth: 'smile' }, t, 3, 1.6);
        for (let i = 0; i <= 16; i++) { const k = i / 16, x = 220 + 280 * k, y = 900 + Math.sin(k * Math.PI) * 70; MYTH.ell(ctx, i % 2 ? '#ff8a3a' : '#f4c430', x, y, 13, 13, 0, 2); } },
      over: (ctx, W, H_, t) => { MYTH.petals(ctx, W, t, V('end', 'खाटू'), 30); card(ctx, W, H_, t, V('end', 'खाटू'), 'खाटू श्याम', { y: 300, size: 74 }); } },
  };
}, {
  title: 'बर्बरीक का शीश दान',
  gold: ['बर्बरीक...', 'बर्बरीक', 'कृष्ण', 'तीन', 'शीश', 'शीश।', 'खाटू', 'श्याम', 'मिनट'],
});
