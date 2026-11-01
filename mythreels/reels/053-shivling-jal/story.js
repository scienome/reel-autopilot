KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const poison = (ctx, x, y, t, s = 1) => { ctx.save(); ctx.translate(x, y); for (let i = 0; i < 7; i++) { const a = i * 0.9 + t * 1.3; MYTH.ell(ctx, i % 2 ? '#3a8a4a' : '#1e4a2e', Math.cos(a) * 70 * s, Math.sin(a) * 50 * s - i * 8, 70 * s, 50 * s, 0, 4); } ctx.restore(); };

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'ocean', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'deva', 120, 1170, 0.5, t, { arms: 'carry', face: { eyes: 'angry', mouth: 'open' } }); char(ctx, 'asura', 600, 1170, 0.55, t, { flip: true, arms: 'carry', face: { eyes: 'angry', mouth: 'open' } }); MYTH.ell(ctx, '#7a5a3a', 360, 1000, 80, 230, 0, 6); } },
    b2: { set: 'ocean', cam: CAM.mid, shake: V('b2', 'हलाहल'), draw: (ctx, t) => { poison(ctx, 360, 900, t, 1.8); }, over: cardOn('b2', 'हलाहल', 'हलाहल विष', { y: 300, size: 80 }) },
    b3: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: { r: 'open', l: 'down' }, hold: 'pot', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b4: { set: 'kailash', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'closed', mouth: 'calm' } }); MYTH.ell(ctx, 'rgba(30,60,200,0.55)', 360, 842, 40, 22, 0, 0); }, over: cardOn('b4', 'नीलकंठ', 'नीलकंठ', { y: 300, size: 90 }) },
    b5: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'shiva', 440, 1170, 0.78, t, { halo: true, arms: 'bless', face: { eyes: 'closed', mouth: 'calm' } }); char(ctx, 'indra', 150, 1170, 0.5, t, { arms: { r: 'open', l: 'down' }, hold: 'pot', face: { eyes: 'calm', mouth: 'calm' } }); }, over: (ctx, W, H_, t) => { ctx.save(); ctx.fillStyle = 'rgba(120,200,255,0.8)'; const a = V('b5', 'जल'); for (let i = 0; i < 18; i++) { const u = ((t - a) * 1.2 + i * 0.1) % 1; if (t > a) { ctx.beginPath(); ctx.arc(190 + u * 150 + (i % 3) * 8, 520 + u * 360, 7, 0, 6.28); ctx.fill(); } } ctx.restore(); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('end', 3), 22) },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 7, "hook": "शिवलिंग पर जल\nक्यों चढ़ाते हैं?", "next": "रुद्राक्ष को शिव के\nआँसू क्यों कहते हैं?", "nextAt": "nx", "gold": ["समुद्र", "मंथन", "हलाहल", "विष", "नीलकंठ", "जल"]});
