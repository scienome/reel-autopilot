KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const mouse = (ctx, x, y, s, t, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s); ctx.strokeStyle = '#7a6a5a'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-90, 10); ctx.quadraticCurveTo(-170, 40 + Math.sin(t * 3) * 14, -190, -40); ctx.stroke(); MYTH.ell(ctx, '#9a8a7a', 0, 0, 100, 62, 0, 5); MYTH.ell(ctx, '#9a8a7a', 90, -18, 44, 36, 0, 5); MYTH.ell(ctx, '#e8a0a0', 74, -52, 18, 20, 0, 3); MYTH.ell(ctx, '#1a0c06', 112, -26, 6, 6, 0, 1); MYTH.ell(ctx, '#e8a0a0', 134, -14, 7, 6, 0, 1); ctx.strokeStyle = MYTH.INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-40, 56); ctx.lineTo(-40, 84); ctx.moveTo(40, 56); ctx.lineTo(40, 84); ctx.stroke(); ctx.restore(); };
  const gandharva = (ctx, x, y, s, t, o = {}) => char(ctx, 'deva', x, y, s, t, Object.assign({ as: 'deva', style: { cloth: '#8a4ad8', cloth2: '#f4c430' } }, o));

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { mouse(ctx, 360, 1000, 1.6, t); } },
    b1: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { gandharva(ctx, 210, 1170, 0.72, t, { arms: 'hips', face: { eyes: 'angry', mouth: 'grin' } }); char(ctx, 'sage', 520, 1170, 0.72, t, { flip: true, arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); }, over: cardOn('b1', 'क्रौंच', 'गंधर्व क्रौंच', { y: 300, size: 70 }) },
    b2: { set: 'forest', cam: CAM.mid, shake: V('b2', 'श्राप'), draw: (ctx, t) => { char(ctx, 'sage', 360, 1170, 0.85, t, { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }); } },
    b3: { set: 'village', cam: CAM.wide, draw: (ctx, t) => { mouse(ctx, 360, 1080, 2.0, t); } },
    b4: { set: 'village', cam: CAM.wide, draw: (ctx, t) => { mouse(ctx, 480, 1080, 1.6, t); char(ctx, 'ganesha', 170, 1170, 0.7, t, { halo: true, arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' } }); ctx.strokeStyle = '#e8b020'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(480, 1050, 190, 100, 0, 0, 6.28); ctx.stroke(); } },
    b5: { set: 'village', cam: CAM.wide, draw: (ctx, t) => { mouse(ctx, 500, 1090, 1.3, t); char(ctx, 'ganesha', 190, 1170, 0.8, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b6: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { mouse(ctx, 360, 1170, 1.7, t); char(ctx, 'ganesha', 360, 1040, 0.5, t, { pose: 'sit', halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1100, 0.82, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); mouse(ctx, 520, 1190, 0.8, t); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('end', 2), 20) },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 6, "hook": "गणेश जी का वाहन\nचूहा क्यों?", "next": "हनुमान जी सिंदूरी\nक्यों हैं?", "nextAt": "nx", "gold": ["क्रौंच", "चूहा", "मूषक", "गणेश", "पाश", "श्राप"]});
