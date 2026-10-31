KATHA((h) => {
  const { at, char, CAM, cardOn } = h;
  return {
    h1: { set: 'street', cam: CAM.push, draw: (ctx, t) => DIWA.effigy(ctx, 360, 1170, 1.0, t, 0.75) },
    b1: { set: 'street', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'gramin', 220, 1170, 0.62, t, { arms: 'wave', face: { eyes: 'happy', mouth: 'grin' } }); char(ctx, 'gramin2', 500, 1170, 0.62, t, { flip: true, arms: 'open', face: { eyes: 'happy', mouth: 'open' } }); } },
    b2: { set: 'street', cam: [[360, 900, 1.3], [360, 620, 0.95]], draw: (ctx, t) => { DIWA.effigy(ctx, 380, 1180, 1.02, t); char(ctx, 'gramin', 130, 1190, 0.42, t, { arms: 'up', face: { eyes: 'happy', mouth: 'grin' } }); }, over: cardOn('b2', -2, 'विशाल पुतला', { y: 300, size: 72 }) },
    b3: { set: 'street', cam: CAM.wide, draw: (ctx, t) => { DIWA.effigy(ctx, 360, 1090, 0.72, t); for (let i = 0; i < 4; i++) char(ctx, i % 2 ? 'gramin2' : 'gramin', 90 + i * 180, 1200, 0.45, t, { flip: i > 1, bob: Math.abs(Math.sin(t * 8 + i)) * 14, arms: i % 2 ? 'up' : 'wave', face: { eyes: 'happy', mouth: 'grin' } }); } },
    b4: { set: 'street', cam: CAM.mid, draw: (ctx, t) => { DIWA.effigy(ctx, 460, 1130, 0.74, t); char(ctx, 'pandit', 170, 1180, 0.64, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'open', mouth: 'calm' } }); }, over: cardOn('b4', -3, 'इनाम!', { y: 300, size: 84 }) },
    b5: { set: 'ocean', setOpt: { time: 'dawn', sun: true }, cam: CAM.wide, draw: (ctx, t) => char(ctx, 'pandit', 360, 1180, 0.8, t, { arms: { r: 'chin', l: 'rest' }, face: { eyes: 'calm', mouth: 'calm' } }) },
    b6: { set: 'street', setOpt: { time: 'dawn' }, cam: CAM.wide, draw: (ctx, t) => { DIWA.effigy(ctx, 360, 1090, 0.72, t); for (let i = 0; i < 5; i++) char(ctx, i % 2 ? 'gramin2' : 'gramin', 70 + i * 145, 1210, 0.4, t, { flip: i > 2, arms: 'down', face: { eyes: 'open', mouth: 'calm' } }); } },
    b7: { set: 'street', setOpt: { time: 'dawn' }, cam: CAM.push, shake: at('b7', 1), draw: (ctx, t) => DIWA.effigy(ctx, 360, 1170, 0.98, t, H.clamp((t - at('b7', 1)) / 1.2)), over: (ctx, W, H_, t) => MYTH.shock(ctx, 360, 900, t, at('b7', 1), 'rgba(255,170,80,') },
    end: { set: 'street', setOpt: { time: 'dawn' }, cam: CAM.wide, draw: (ctx, t) => { DIWA.effigy(ctx, 360, 1090, 0.72, t, 1); for (let i = 0; i < 4; i++) char(ctx, i % 2 ? 'gramin2' : 'gramin', 90 + i * 180, 1210, 0.42, t, { flip: i > 1, arms: 'up', face: { eyes: 'happy', mouth: 'grin' } }); } },
    nx: { set: 'diwali', cam: CAM.wide, draw: (ctx, t) => DIWA.dog(ctx, 300, 1100, 1.6, t, { garland: true, tika: true }) },
  };
}, {"series": "दिवाली के रहस्य", "part": 4, "hook": "गोवा में दिवाली...\nराक्षस जलाकर शुरू होती है!", "gold": ["नरकासुर", "राक्षस", "विशाल", "चिंगारी", "इनाम।", "भोर"], "next": "दिवाली पर यहाँ\nकुत्तों की पूजा!", "nextAt": "nx"});
