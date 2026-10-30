KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'ocean', setOpt: { time: 'night', lanka: true }, cam: [[560, 730, 2.0], [520, 740, 1.6]],
      draw: (ctx, t) => { for (let i = 0; i < 9; i++) MYTH.flame(ctx, 420 + i * 34, 760, 1.0 + 0.3 * Math.sin(i), t + i); } },
    b1: { set: 'kailash', cam: CAM.wide, draw: two('ravana', { arms: 'hips', face: { eyes: 'angry' } }, 'nandi', { arms: { r: 'point', l: 'hips' }, style: { monkey: true, bull: false, muzzle: '#f6e6d0' }, face: { eyes: 'calm', mouth: 'calm' } }, 0.62) },
    b2: { set: 'kailash', cam: CAM.mid, draw: one('ravana', { arms: 'belly', face: { eyes: 'happy', mouth: 'grin' } }), over: (ctx, W, H_, t) => MYTH.shock(ctx, 360, 640, t, V('b2', 'ठहाका'), 'rgba(255,200,120,') },
    rv: { set: 'kailash', cam: CAM.close(360), draw: one('ravana', { arms: { r: 'point', l: 'belly' }, face: { eyes: 'happy', mouth: 'grin' } }) },
    b3: { set: 'kailash', cam: CAM.close(360), draw: one('nandi', { halo: true, arms: 'down', style: { monkey: true, bull: false, muzzle: '#f6e6d0' }, face: { eyes: 'closed', mouth: 'calm' } }) },
    nd: { set: 'kailash', cam: [[360, 700, 1.9], [360, 680, 2.3]], shake: V('nd', 'नाश'), draw: one('nandi', { halo: true, arms: { r: 'point', l: 'down' }, style: { monkey: true, bull: false, muzzle: '#f6e6d0' }, face: { eyes: 'angry', mouth: 'calm' } }),
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.2) },
    b4: { set: 'ocean', setOpt: { time: 'night', lanka: true }, cam: CAM.wide,
      draw: (ctx, t) => { const u = H.clamp((t - V('b4', 'लंका')) / 1.2); for (let i = 0; i < 9; i++) MYTH.flame(ctx, 420 + i * 34, 760, 0.4 + 0.9 * u, t + i); char(ctx, 'hanuman', 200, 700 + Math.sin(t * 3) * 10, 0.45, t, { pose: 'fly', arms: 'fly', lean: 0.5, face: { mouth: 'grin' } }); } },
    end: { set: 'palace', cam: CAM.mid, draw: one('ravana', { arms: 'cover', face: { eyes: 'sad', mouth: 'frown' } }), over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.3) },
  };
}, {"series": "रावण के रहस्य", "part": 5, "hook": "रावण की एक हँसी...\nऔर लंका का अंत!", "next": "वो स्त्री जिसने आग\nमें कूदकर श्राप दिया", "nextAt": "nx", "gold": ["नंदीश्वर", "वानर", "हँसी", "लंका", "नाश"]});
