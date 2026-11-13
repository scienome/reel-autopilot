// motion: camera moves + living characters (kit/katha.js)
// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const tail = (ctx, x, y, t) => { ctx.save(); ctx.strokeStyle = '#c0552a'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 200, y + 30, x + 420, y - 10 + Math.sin(t * 2) * 6); ctx.stroke(); ctx.restore(); };
  return {
    h1: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { tail(ctx, 100, 1130, t); char(ctx, 'bhima', 430, 1170, 0.85, t, { hold: 'gada', arms: 'draw', face: { eyes: 'angry', mouth: 'open' } }); } },
    b1: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'bhima', 360, 1170, 0.82, t, { hold: 'gada', arms: 'down', face: { eyes: 'calm', mouth: 'calm' } }); }, over: cardOn('b1', 6, 'सौगंधिक फूल', { y: 300, size: 76 }) },
    b2: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'hanuman', 170, 1170, 0.65, t, { arms: 'down', style: { hair: '#e8e0d8' }, face: { eyes: 'closed', mouth: 'calm' } }); tail(ctx, 230, 1130, t); } },
    b3: { set: 'forest', cam: CAM.wide, draw: two('hanuman', { style: { hair: '#e8e0d8' }, arms: 'open', face: { eyes: 'calm', mouth: 'smile' } }, 'bhima', { hold: 'gada', arms: 'point', face: { eyes: 'angry', mouth: 'open' } }) },
    b4: { set: 'forest', cam: CAM.push, shake: at('b4', 3), draw: (ctx, t) => { tail(ctx, 60, 1130, t); char(ctx, 'bhima', 420, 1170, 0.85, t, { arms: 'draw', face: { eyes: 'angry', mouth: 'frown' } }); }, over: cardOn('b4', 9, 'हिली तक नहीं', { y: 300, size: 80 }) },
    b5: { set: 'sky', setOpt: { time: 'day', sun: true }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'hanuman', 360, 1170, 1.0, t, { halo: true, hold: 'gada', arms: 'bless', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'bhima', 560, 1170, 0.55, t, { flip: true, arms: 'namaste', face: { eyes: 'wide', mouth: 'o' } }); } },
    end: { set: 'battle', cam: CAM.mid, draw: two('arjuna', { hold: 'bow', arms: 'down', face: { eyes: 'calm', mouth: 'calm' } }, 'hanuman', { arms: 'bless', halo: true, face: { eyes: 'calm', mouth: 'smile' } }), over: cardOn('end', 19, 'कपिध्वज', { y: 300, size: 90 }) },
  };
}, {"series": "हनुमान जी के अनसुने किस्से", "part": 2, "hook": "महाबली भीम,\nएक पूँछ से हारे!", "nextAt": "nx", "gold": ["भीम", "हनुमान", "पवन", "अर्जुन", "द्रौपदी", "महाभारत"], "next": "हनुमान जी की रामायण,\nजो समुद्र में फेंकी गई"});
