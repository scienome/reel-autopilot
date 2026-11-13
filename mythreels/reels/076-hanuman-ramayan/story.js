// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const rock = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#8a8478'; ctx.beginPath(); ctx.moveTo(-160, 0); ctx.lineTo(-130, -200); ctx.lineTo(40, -240); ctx.lineTo(160, -150); ctx.lineTo(150, 0); ctx.fill(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-100, -170 + i * 26); ctx.lineTo(100 - (i % 2) * 30, -170 + i * 26); ctx.stroke(); } ctx.restore(); };
  const valmiki = (ctx, x, y, s, t, o = {}) => char(ctx, 'sage', x, y, s, t, Object.assign({ as: 'sage' }, o));
  return {
    h1: { set: 'ocean', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'hanuman', 360, 1170, 0.85, t, { arms: 'up', face: { eyes: 'calm', mouth: 'smile' } }); rock(ctx, 360, 620, 0.6, t); } },
    b1: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { rock(ctx, 360, 1000, 1.0, t); }, over: cardOn('b1', 8, 'हनुमान जी ने!', { y: 300, size: 90 }) },
    b2: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { rock(ctx, 480, 1130, 1.0, t); char(ctx, 'hanuman', 240, 1170, 0.8, t, { arms: 'point', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b3: { set: 'kailash', cam: CAM.close(260), draw: (ctx, t) => { valmiki(ctx, 260, 1170, 0.9, t, { arms: 'cover', face: { eyes: 'sad', mouth: 'calm', tears: true } }); rock(ctx, 560, 1130, 0.8, t); } },
    b4: { set: 'kailash', cam: CAM.wide, draw: two('sage', { as: 'sage', arms: 'open', face: { eyes: 'sad', mouth: 'open' } }, 'hanuman', { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }) },
    b5: { set: 'ocean', cam: CAM.push, shake: at('b5', 8), draw: (ctx, t) => { const k = Math.min(1, Math.max(0, (t - at('b5', 6)) / 1.2)); char(ctx, 'hanuman', 300, 1170, 0.85, t, { arms: 'up', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'calm', mouth: 'calm' } }); rock(ctx, 300 + k * 260, 640 + k * 500, 0.55, t); }, over: cardOn('b5', 9, 'समुद्र में', { y: 300, size: 90 }) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'hanuman', 360, 1170, 0.85, t, { halo: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); }, over: cardOn('end', 19, 'विनम्रता', { y: 300, size: 100 }) },
  };
}, {"series": "हनुमान जी के अनसुने किस्से", "part": 3, "hook": "सबसे पहली रामायण\nसमुद्र में डूबी है!", "nextAt": "nx", "gold": ["हनुमान", "रामायण", "वाल्मीकि", "राम", "विनम्रता"], "next": "हनुमान जी को\nचिरंजीवी वरदान कैसे?"});
