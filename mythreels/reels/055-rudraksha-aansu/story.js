KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const bead = (ctx, x, y, r = 40, a = 1) => { ctx.save(); ctx.globalAlpha = a; MYTH.ell(ctx, '#7a4a22', x, y, r, r, 0, 5); ctx.strokeStyle = '#3a2210'; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(x, y, r * (0.3 + i * 0.12), -0.9 + i * 0.3, 0.9 + i * 0.3); ctx.stroke(); } ctx.restore(); };
  const drops = (ctx, a, t, n = 10) => { ctx.save(); for (let i = 0; i < n; i++) { const u = ((t - a) * 0.6 + i * 0.13) % 1; if (t > a) { ctx.fillStyle = 'rgba(190,230,255,0.9)'; ctx.beginPath(); ctx.arc(330 + (i % 4) * 26, 760 + u * 380, 9, 0, 6.28); ctx.fill(); } } ctx.restore(); };

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { bead(ctx, 360, 880, 120); } },
    b1: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'asura', 360, 1170, 0.9, t, { arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); }, over: cardOn('b1', 'त्रिपुरासुर', 'त्रिपुरासुर', { y: 300, size: 70 }) },
    b2: { set: 'kailash', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { pose: 'sit', halo: true, arms: 'namaste', face: { eyes: 'open', mouth: 'calm' } }); } },
    b3: { set: 'kailash', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'closed', mouth: 'calm', tears: true } }); drops(ctx, at('b3', 8), t); } },
    b4: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { const u = H.clamp((t - at('b4', 3)) / 1.5); bead(ctx, 220, 1000, 50 * u); bead(ctx, 360, 900, 70 * u); bead(ctx, 500, 1000, 50 * u); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b4', 3), 16) },
    b5: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { bead(ctx, 360, 900, 110); }, over: cardOn('b5', 'रुद्र', 'रुद्र + अक्ष', { y: 300, size: 80 }) },
    end: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('end', 2), 22) },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 8, "hook": "रुद्राक्ष को शिव के\nआँसू क्यों कहते हैं?", "next": "तुलसी का विवाह\nशालिग्राम से क्यों?", "nextAt": "nx", "gold": ["रुद्राक्ष", "त्रिपुरासुर", "आँसू", "नेत्र", "रुद्र", "अक्ष"]});
