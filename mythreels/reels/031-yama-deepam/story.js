KATHA((h) => {
  const { at, char, CAM, cardOn } = h;
  const room = (ctx, t, x = 360) => { DIWA.jewels(ctx, x, 1170, 0.9, t); };
  return {
    h1: { set: 'ayodhya', setOpt: { lit: 1 }, cam: CAM.push, draw: (ctx, t) => { char(ctx, 'yama', 360, 1090, 0.78, t, { arms: { r: 'cover', l: 'hips' }, face: { eyes: 'wide', mouth: 'o' } }); DIWA.diya(ctx, 360, 1160, 2.4, t); } },
    b1: { set: 'court', setOpt: { throne: 360 }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'king', 230, 1100, 0.66, t, { arms: 'open', face: { eyes: 'sad', mouth: 'open' } }); char(ctx, 'pandit', 500, 1100, 0.62, t, { flip: true, arms: { r: 'point', l: 'down' }, face: { eyes: 'wide', mouth: 'open' } }); } },
    b2: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'prince', 240, 1170, 0.72, t, { arms: 'namaste', face: { eyes: 'wide', mouth: 'o' } }); DIWA.snake(ctx, 490, 1180, 1, t, true); }, over: cardOn('b2', 1, 'चौथे दिन!', { y: 300, size: 76 }) },
    b3: { set: 'ayodhya', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'prince', 230, 1090, 0.64, t, { pose: 'sit', arms: 'rest', face: { eyes: 'calm', mouth: 'calm' } }); char(ctx, 'bride', 490, 1090, 0.66, t, { flip: true, arms: { r: 'open', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); } },
    b4: { set: 'court', cam: [[360, 960, 1.0], [360, 960, 1.08]], draw: (ctx, t) => { char(ctx, 'bride', 160, 1090, 0.62, t, { arms: { r: 'open', l: 'down' }, face: { eyes: 'open', mouth: 'smile' } }); room(ctx, t, 430); DIWA.row(ctx, 1200, t, H.clamp((t - at('b4', -5)) / 1.2), 9, 0.95); } },
    b5: { set: 'ayodhya', cam: CAM.close(), draw: (ctx, t) => char(ctx, 'bride', 360, 1170, 0.82, t, { arms: { r: 'chin', l: 'rest' }, face: { eyes: 'happy', mouth: 'open', talk: true } }) },
    b6: { set: 'forest', setOpt: { time: 'night' }, cam: [[360, 980, 1.0], [360, 1000, 1.15]], draw: (ctx, t) => { DIWA.snake(ctx, 250, 1180, 1.1, t); DIWA.jewels(ctx, 540, 1170, 0.9, t); }, over: (ctx, W, H_, t) => MYTH.shock(ctx, 540, 900, t, at('b6', -2), 'rgba(255,230,140,') },
    b7: { set: 'ayodhya', cam: CAM.wide, draw: (ctx, t) => { DIWA.jewels(ctx, 240, 1170, 0.8, t); DIWA.snake(ctx, 240, 1060, 0.62, t); char(ctx, 'bride', 510, 1090, 0.62, t, { flip: true, arms: { r: 'chin', l: 'rest' }, face: { eyes: 'closed', mouth: 'open', talk: true } }); }, over: (ctx, W, H_, t) => { const d = H.clamp((t - at('b7', -2)) / 0.7); ctx.fillStyle = `rgba(255,200,120,${0.26 * d})`; ctx.fillRect(0, 0, W, H_); } },
    end: { set: 'diwali', cam: CAM.push, draw: (ctx, t) => { char(ctx, 'yama', 360, 1090, 0.62, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); DIWA.diya(ctx, 360, 1170, 2.6, t); } },
    nx: { set: 'underworld', cam: CAM.wide, draw: (ctx, t) => char(ctx, 'narakasura', 360, 1180, 0.84, t, { arms: 'fist', face: { eyes: 'angry', mouth: 'shout' } }) },
  };
}, {"series": "दिवाली के रहस्य", "part": 2, "hook": "एक दीये ने...\nयमराज को लौटा दिया!", "gold": ["यमराज", "दीये", "दीया", "साँप", "मौत।", "धनतेरस", "चौथे", "गहनों"], "next": "एक असुर की आखिरी\nइच्छा थी दिवाली?", "nextAt": "nx"});
