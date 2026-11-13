// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const sound = (ctx, x, y, a, t) => { if (t < a) return; ctx.save(); ctx.strokeStyle = 'rgba(255,220,120,0.8)'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { const u = ((t - a) * 0.9 + i * 0.25) % 1; ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(x, y, 60 + u * 260, 0, 6.28); ctx.stroke(); } ctx.restore(); };

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: { r: 'up', l: 'down' }, hold: 'damru', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'kailash', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: { r: 'up', l: 'down' }, hold: 'damru', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b2: { set: 'space', setOpt: { sun: false }, cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: { r: 'up', l: 'up' }, hold: 'damru', face: { eyes: 'calm', mouth: 'calm' } }); sound(ctx, 360, 640, at('b2', 10), t); }, over: cardOn('b2', 'चौदह', '14', { y: 300, size: 100 }) },
    b3: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'shiva', 440, 1170, 0.78, t, { halo: true, arms: { r: 'up', l: 'down' }, hold: 'damru', face: { eyes: 'calm', mouth: 'calm' } }); char(ctx, 'kumara', 150, 1170, 0.5, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); sound(ctx, 440, 700, 0, t); } },
    b4: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'sage', 360, 1170, 0.85, t, { pose: 'sit', halo: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); }, over: cardOn('b4', 'सूत्र', 'माहेश्वर सूत्र', { y: 300, size: 70 }) },
    b5: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'sage', 360, 1170, 0.85, t, { arms: 'rest', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b5', 'पाणिनि', 'पाणिनि', { y: 300, size: 90 }) },
    end: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: { r: 'up', l: 'down' }, hold: 'damru', face: { eyes: 'calm', mouth: 'smile' } }); sound(ctx, 360, 640, 0, t); } },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 12, "hook": "चौदह बार बजा डमरू...\nऔर जन्मी एक भाषा", "next": "पूरी सीरीज़\nप्रोफ़ाइल पर", "nextAt": "nx", "gold": ["डमरू", "शिव", "चौदह", "सूत्र", "पाणिनि", "संस्कृत"]});
