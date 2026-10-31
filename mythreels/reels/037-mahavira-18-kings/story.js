KATHA((h) => {
  const { at, char, CAM, cardOn } = h;
  const kings = (ctx, t, eyes = 'sad', y = 1130, arms = 'namaste') => { for (let i = 0; i < 4; i++) char(ctx, 'king', 90 + i * 180, y, 0.5, t, { flip: i > 1, arms, face: { eyes, mouth: 'calm' } }); };
  const light = (ctx, t, k = 1) => { if (k < 0.25) return; DIWA.glow(ctx, 360, 640, 360, '255,235,170', 0.85 * k); MYTH.aura(ctx, 360, 640, 120 * k, t); };
  const lit = (t, a, d) => H.clamp((t - a) / d);
  return {
    h1: { set: 'ayodhya', cam: CAM.push, draw: (ctx, t) => { kings(ctx, t, 'calm', 1070); DIWA.row(ctx, 1170, t, 1, 7, 1.3, 90, 630); } },
    b1: { set: 'river', setOpt: {}, cam: CAM.wide, draw: (ctx, t) => { MYTH.poly(ctx, '#f4f0e0', [[250, 860], [250, 700], [290, 650], [360, 520], [430, 650], [470, 700], [470, 860]], 5); MYTH.ell(ctx, MYTH.GOLD, 360, 512, 14, 18, 0, 3); for (const x of [295, 360, 425]) MYTH.ell(ctx, '#6a4a2a', x, 790, 22, 38, 0, 3); }, over: cardOn('b1', -1, 'पावापुरी', { y: 300, size: 86 }) },
    b2: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: (ctx, t) => { light(ctx, t); kings(ctx, t, 'calm'); } },
    b3: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.push, draw: (ctx, t) => { const d = 1 - lit(t, at('b3', 4), 1.3); light(ctx, t, d); }, over: cardOn('b3', 4, 'निर्वाण', { y: 300, size: 88 }) },
    b4: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.wide, draw: (ctx, t) => kings(ctx, t, 'sad'), over: (ctx, W, H_, t) => { MYTH.dark(ctx, W, H_, 0.42); MYTH.card(ctx, W, H_, t, at('b4', 0), '18 राजा', { y: 300, size: 86 }); } },
    b5: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.mid, draw: (ctx, t) => char(ctx, 'king', 360, 1170, 0.8, t, { arms: { r: 'open', l: 'down' }, face: { eyes: 'sad', mouth: 'open' } }), over: (ctx, W, H_) => MYTH.dark(ctx, W, H_, 0.32) },
    b6: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'king', 360, 1170, 0.84, t, { arms: { r: 'bless', l: 'down' }, face: { eyes: 'open', mouth: 'calm' } }); DIWA.diya(ctx, 440, 940, 1.2, t, lit(t, at('b6', 3), 0.4)); } },
    b7: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.wide, draw: (ctx, t) => { const k = lit(t, at('b7', 0), 2); kings(ctx, t, 'calm', 1060); DIWA.row(ctx, 1110, t, k, 9, 1.0); DIWA.row(ctx, 1200, t, k, 9, 1.2); } },
    end: { set: 'diwali', cam: CAM.push, draw: (ctx, t) => DIWA.row(ctx, 980, t, 1, 7, 1.5, 90, 630), over: cardOn('end', -3, 'दीप + आवली', { y: 300, size: 76 }) },
    nx: { set: 'field', cam: CAM.wide, draw: (ctx, t) => DIWA.rocketsFlying(ctx, t, 0) },
  };
}, {"series": "दिवाली के रहस्य", "part": 8, "hook": "18 राजाओं ने...\nएक ही रात दीये जलाए!", "gold": ["अठारह", "दीये", "पावापुरी", "महावीर", "निर्वाण", "दीयों", "दीपावली...", "प्रकाश"], "next": "दिवाली के बाद\nआग के गोलों का युद्ध!", "nextAt": "nx"});
