KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const axe = (ctx, x, y, rot = 0, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = '#6a3a1a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(0, -150); ctx.stroke(); ctx.fillStyle = '#c8ccd4'; ctx.strokeStyle = MYTH.INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(6, -140); ctx.quadraticCurveTo(90, -150, 80, -60); ctx.quadraticCurveTo(70, -90, 6, -85); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); };
  const parashu = (ctx, x, y, s, t, o = {}) => char(ctx, 'sage', x, y, s, t, Object.assign({ as: 'sage', style: { cloth: '#8a2a1a', cloth2: '#c8501a' } }, o));

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: one('ganesha', { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }, 360, 0.85) },
    b1: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ganesha', 520, 1170, 0.7, t, { flip: true, arms: { r: 'bless', l: 'hips' }, face: { eyes: 'calm', mouth: 'calm' } }); parashu(ctx, 190, 1170, 0.72, t, { arms: 'down', face: { eyes: 'calm', mouth: 'calm' } }); axe(ctx, 90, 1000, 0.1, 0.8); }, over: cardOn('b1', 'कैलाश', 'कैलाश', { y: 300, size: 80 }) },
    b2: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 500, 1170, 0.8, t, { flip: true, arms: { r: 'point', l: 'hips' }, face: { eyes: 'calm', mouth: 'open' } }); parashu(ctx, 190, 1170, 0.78, t, { arms: 'hips', face: { eyes: 'angry', mouth: 'calm' } }); } },
    b3: { set: 'kailash', cam: CAM.wide, shake: V('b3', 'बढ़'), draw: (ctx, t) => { char(ctx, 'ganesha', 520, 1170, 0.72, t, { flip: true, arms: 'fist', face: { eyes: 'angry', mouth: 'calm' } }); parashu(ctx, 190, 1170, 0.76, t, { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }); } },
    b4: { set: 'sky', setOpt: { time: 'dusk' }, cam: [[360, 800, 1.0], [360, 760, 1.25]], draw: (ctx, t) => { parashu(ctx, 460, 1170, 0.85, t, { arms: 'fist', face: { eyes: 'angry', mouth: 'shout' } }); axe(ctx, 190, 900, -0.25, 1.5); }, over: cardOn('b4', 'फरसा', 'शिव जी का दिया फरसा', { y: 300, size: 52 }) },
    b5: { set: 'kailash', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, V('b5', 'दाँत'), 18) },
    b6: { set: 'kailash', cam: CAM.mid, shake: V('b6', 'कटकर'), draw: (ctx, t) => { char(ctx, 'ganesha', 340, 1170, 0.8, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); MYTH.ell(ctx, '#fff6e0', 470, 1130 + 20 * H.clamp((t - V('b6', 'गिर')) / 0.4), 12, 46, 0.8, 4); parashu(ctx, 600, 1170, 0.55, t, { flip: true, arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { halo: true, arms: { r: 'bless', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('end', 'एकदंत', 'एकदंत', { y: 300, size: 90 }) },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 2, "hook": "गणेश जी का एक\nदाँत कैसे टूटा?", "next": "शिव आधे स्त्री\nरूप में क्यों?", "nextAt": "nx", "gold": ["एकदंत", "दाँत", "परशुराम", "फरसा", "कैलाश", "गणेश"]});
