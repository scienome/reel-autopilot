// narrator: Imran (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const kali = (ctx, x, y, s, t, o = {}) => char(ctx, 'parvati', x, y, s, t, Object.assign({ as: 'parvati', hold: 'sword', style: { skin: '#2a3a6a', sh: '#1a2448', cloth: '#d6102a', cloth2: '#ffd23f' } }, o));
  return {
    h1: { set: 'battle', setOpt: { sun: false }, cam: CAM.mid, draw: (ctx, t) => { kali(ctx, 360, 1170, 0.9, t, { arms: 'up', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'wide', mouth: 'open' } }); } },
    b1: { set: 'battle', setOpt: { sun: false }, cam: CAM.wide, draw: (ctx, t) => { kali(ctx, 360, 1100, 0.82, t, { arms: 'open', face: { eyes: 'wide', mouth: 'open' } }); char(ctx, 'shiva', 360, 1230, 0.5, t, { arms: 'down', face: { eyes: 'closed', mouth: 'calm' } }); } },
    b2: { set: 'battle', setOpt: { sun: false }, cam: CAM.wide, draw: (ctx, t) => { for (let i = 0; i < 3; i++) char(ctx, 'asura', 160 + i * 200, 1170, 0.6, t, { flip: i === 2, arms: 'up', face: { eyes: 'angry', mouth: 'open' } }); }, over: cardOn('b2', 2, 'रक्तबीज', { y: 300, size: 90 }) },
    b3: { set: 'battle', setOpt: { sun: false }, cam: CAM.push, draw: (ctx, t) => { kali(ctx, 360, 1170, 0.88, t, { arms: 'draw', face: { eyes: 'angry', mouth: 'open' } }); } },
    b4: { set: 'battle', setOpt: { sun: false }, cam: CAM.wide, shake: at('b4', 9), draw: (ctx, t) => { kali(ctx, 360, 1170, 0.85, t, { arms: 'up', glow: 'rgba(214,16,42,0.7)', face: { eyes: 'angry', mouth: 'open' } }); }, over: cardOn('b4', 6, 'क्रोध', { y: 300, size: 100 }) },
    b5: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, hold: 'trishul', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    end: { set: 'kailash', cam: CAM.close(360), draw: (ctx, t) => { kali(ctx, 360, 1170, 0.9, t, { arms: 'bless', face: { eyes: 'wide', mouth: 'o' } }); } },
  };
}, {"series": "देवियों के रहस्य", "part": 1, "hook": "माँ काली का क्रोध\nकिसने रोका?", "nextAt": "nx", "gold": ["काली", "रक्तबीज", "शिव", "जीभ", "क्रोध"], "next": "धरती पर शक्तिपीठ\nकैसे बने?"});
