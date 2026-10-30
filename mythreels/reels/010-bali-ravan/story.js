KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'ocean', setOpt: { time: 'dawn', sun: true }, cam: CAM.wide,
      draw: (ctx, t) => { char(ctx, 'vali', 360, 1050 + Math.sin(t * 3) * 10, 0.75, t, { pose: 'fly', arms: { r: 'fist', l: 'fly' }, lean: 0.35, face: { eyes: 'happy', mouth: 'grin' } }); char(ctx, 'ravana', 450, 820, 0.3, t, { lean: -1.2, style: { heads: 10 }, arms: 'up', face: { eyes: 'wide', mouth: 'shout' } }); } },
    b1: { set: 'forest', setOpt: { time: 'day' }, cam: CAM.mid, draw: one('vali', { halo: true, arms: 'hips', face: { eyes: 'open', mouth: 'smile' } }), over: cardOn('b1', 'बाली', 'बाली', { y: 300, size: 80 }) },
    b2: { set: 'ocean', setOpt: { time: 'dawn', sun: true }, cam: CAM.wide,
      draw: (ctx, t) => { char(ctx, 'vali', 470, 1180, 0.7, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); char(ctx, 'ravana', 160, 1180, 0.55, t, { arms: { r: 'point', l: 'hips' }, face: { eyes: 'open', mouth: 'grin' } }); } },
    b3: { set: 'ocean', setOpt: { time: 'dawn', sun: true }, cam: CAM.mid, shake: V('b3', 'पकड़ा'),
      draw: (ctx, t) => { const u = H.clamp((t - V('b3', 'पकड़ा')) / 0.3); char(ctx, 'vali', 360, 1180, 0.8, t, { arms: { r: 'fist', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); if (u > 0) char(ctx, 'ravana', 460, 820, 0.32, t, { lean: -1.3, arms: 'up', face: { eyes: 'wide', mouth: 'shout' } }); } },
    b4: { set: 'sky', setOpt: { time: 'day', rush: true }, cam: CAM.wide,
      draw: (ctx, t) => { char(ctx, 'vali', 320, 1080 + Math.sin(t * 4) * 12, 0.75, t, { pose: 'fly', arms: { r: 'fist', l: 'fly' }, lean: 0.4, face: { eyes: 'happy', mouth: 'smile' } }); char(ctx, 'ravana', 430, 830, 0.3, t, { lean: -1.1, arms: 'up', face: { eyes: 'wide', mouth: 'shout' } }); },
      over: (ctx, W, H_, t) => { MYTH.speed(ctx, W, H_, t, 1, 0.4); const dirs = ['दक्षिण', 'पश्चिम', 'उत्तर', 'पूर्व']; dirs.forEach((d, i) => { if (t > V('b4', d.endsWith('पूर्व') ? 'पूर्व...' : d + ',')) card(ctx, W, H_, t, V('b4', d.endsWith('पूर्व') ? 'पूर्व...' : d + ','), d, { y: 300 + 0 * i, size: 60 }); }); } },
    b5: { set: 'sky', setOpt: { time: 'dusk', rush: true }, cam: [[400, 860, 1.8], [400, 860, 2.0]],
      draw: (ctx, t) => { char(ctx, 'vali', 320, 1080, 0.75, t, { pose: 'fly', arms: { r: 'fist', l: 'fly' }, lean: 0.4, face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'ravana', 430, 830 + Math.sin(t * 14) * 6, 0.3, t, { lean: -1.1 + Math.sin(t * 12) * 0.1, arms: 'up', face: { eyes: 'closed', mouth: 'shout', tears: true } }); } },
    end: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: (ctx, t) => { MYTH.flame(ctx, 360, 1230, 0.8, t); char(ctx, 'vali', 520, 1170, 0.72, t, { flip: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'ravana', 180, 1170, 0.6, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'smile' } }); } },
  };
}, {"series": "रावण के रहस्य", "part": 8, "hook": "एक वानर ने रावण को\nबगल में दबा लिया!", "next": "वो राजा जिसने रावण को\nजानवर की तरह बाँधा", "nextAt": "nx", "gold": ["बाली", "रावण", "चार", "समुद्र", "दक्षिण,", "पश्चिम,", "उत्तर,", "पूर्व..."]});
