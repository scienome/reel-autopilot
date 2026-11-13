KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const lion = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e8a030'; ctx.beginPath(); ctx.ellipse(0, -90, 150, 70, 0, 0, 7); ctx.fill(); for (const lx of [-100, -50, 60, 110]) ctx.fillRect(lx - 14, -50, 28, 50); ctx.fillStyle = '#a85a1a'; ctx.beginPath(); ctx.arc(140, -150, 80 + Math.sin(t * 2) * 3, 0, 7); ctx.fill(); ctx.fillStyle = '#f0b848'; ctx.beginPath(); ctx.arc(150, -145, 50, 0, 7); ctx.fill(); ctx.fillStyle = '#2a1a0a'; ctx.beginPath(); ctx.arc(135, -158, 6, 0, 7); ctx.arc(168, -158, 6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(152, -130, 9, 0, 7); ctx.fill(); ctx.strokeStyle = '#a85a1a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-145, -100); ctx.quadraticCurveTo(-210, -160 + Math.sin(t * 3) * 20, -190, -200); ctx.stroke(); ctx.restore(); };
  const par = (ctx, x, y, s, t, o = {}) => char(ctx, 'parvati', x, y, s, t, Object.assign({ as: 'parvati' }, o));
  return {
    h1: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { lion(ctx, 200, 1170, 1.0, t); par(ctx, 470, 1170, 0.8, t, { halo: true, hold: 'trishul', arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { lion(ctx, 230, 1170, 0.9, t); par(ctx, 470, 1170, 0.75, t, { halo: true, hold: 'trishul', arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b2: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { par(ctx, 360, 1170, 0.85, t, { arms: 'namaste', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'closed', mouth: 'calm' } }); }, over: cardOn('b2', 5, 'कठोर तप', { y: 300, size: 90 }) },
    b3: { set: 'forest', cam: CAM.wide, shake: at('b3', 1), draw: (ctx, t) => { lion(ctx, 210, 1170, 1.0, t); par(ctx, 500, 1170, 0.75, t, { arms: 'namaste', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'closed', mouth: 'calm' } }); } },
    b4: { set: 'forest', cam: CAM.push, draw: (ctx, t) => { lion(ctx, 260, 1170, 1.05, t); }, over: cardOn('b4', 6, 'साल बीते', { y: 300, size: 90 }) },
    b5: { set: 'forest', cam: CAM.close(420), draw: (ctx, t) => { par(ctx, 420, 1170, 0.9, t, { arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { lion(ctx, 220, 1170, 1.0, t); par(ctx, 480, 1170, 0.8, t, { halo: true, hold: 'trishul', arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
  };
}, {"series": "देवियों के रहस्य", "part": 3, "hook": "शेर आया था\nमाँ को खाने!", "nextAt": "nx", "gold": ["दुर्गा", "शेर", "पार्वती", "तप", "वाहन"], "next": "नवरात्रि में देवी के\nनौ रूप क्यों?"});
