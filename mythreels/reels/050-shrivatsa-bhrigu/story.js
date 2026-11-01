KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const bhrigu = (ctx, x, y, s, t, o = {}) => char(ctx, 'sage', x, y, s, t, Object.assign({ as: 'sage', style: { cloth: '#d8a030', cloth2: '#8a5a1a' } }, o));
  const mark = (ctx, x, y, s = 1, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#f4c030'; ctx.strokeStyle = MYTH.INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -26); ctx.bezierCurveTo(30, -26, 34, 10, 0, 28); ctx.bezierCurveTo(-34, 10, -30, -26, 0, -26); ctx.fill(); ctx.stroke(); ctx.restore(); };

  return {
    h1: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); mark(ctx, 340, 830, 0.9); } },
    b1: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { bhrigu(ctx, 360, 1170, 0.8, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'open' } }); }, over: cardOn('b1', 'भृगु', 'भृगु ऋषि', { y: 300, size: 80 }) },
    b2: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'brahma', 200, 1170, 0.62, t, { arms: 'fist', face: { eyes: 'angry', mouth: 'open' } }); char(ctx, 'shiva', 530, 1170, 0.66, t, { flip: true, arms: 'fist', face: { eyes: 'angry', mouth: 'calm' } }); } },
    b3: { set: 'ocean', cam: CAM.wide, shake: V('b3', 'प्रहार'), draw: (ctx, t) => { char(ctx, 'vishnu', 460, 1000, 0.62, t, { pose: 'sit', arms: 'rest', face: { eyes: 'closed', mouth: 'calm' } }); bhrigu(ctx, 190, 1170, 0.72, t, { arms: 'fist', face: { eyes: 'angry', mouth: 'shout' } }); } },
    b4: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'vishnu', 220, 1170, 0.7, t, { halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); bhrigu(ctx, 520, 1170, 0.7, t, { flip: true, arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); } },
    b5: { set: 'heaven', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b6: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { bhrigu(ctx, 360, 1170, 0.85, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm', tears: true } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b6', 6), 20) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); mark(ctx, 340, 830, 0.9, H.clamp((t - at('end', 5)) / 0.8)); }, over: cardOn('end', 'श्रीवत्स', 'श्रीवत्स', { y: 300, size: 90 }) },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 4, "hook": "विष्णु की छाती पर\nये निशान क्यों?", "next": "कार्तिकेय के साथ\nमोर क्यों?", "nextAt": "nx", "gold": ["भृगु", "विष्णु", "श्रीवत्स", "चरण", "निशान", "क्षमा"]});
