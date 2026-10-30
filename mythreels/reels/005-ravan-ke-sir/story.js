KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'forest', setOpt: { time: 'night' }, cam: [[360, 820, 1.2], [360, 760, 1.45]],
      draw: (ctx, t) => { MYTH.flame(ctx, 360, 1230, 1.6, t); char(ctx, 'ravana', 360, 1150, 0.62, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); },
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.15) },
    b1: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.wide,
      draw: (ctx, t) => { MYTH.flame(ctx, 360, 1230, 1.2, t); char(ctx, 'ravana', 360, 1150, 0.6, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); },
      over: cardOn('b1', 'दस', '10,000 साल', { y: 300 }) },
    b2: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.mid,
      draw: (ctx, t) => { const k = Math.min(4, Math.floor((t - first('b2')) / 0.8)); MYTH.flame(ctx, 360, 1240, 1.4 + 0.2 * Math.sin(t * 9), t); char(ctx, 'ravana', 360, 1150, 0.62, t, { pose: 'sit', arms: 'namaste', style: { heads: 10 - k }, face: { eyes: 'closed', mouth: 'calm' } }); } },
    b3: { set: 'forest', setOpt: { time: 'night' }, cam: [[360, 880, 1.4], [360, 860, 1.7]],
      draw: (ctx, t) => { MYTH.flame(ctx, 360, 1240, 1.6, t); char(ctx, 'ravana', 360, 1150, 0.62, t, { pose: 'sit', arms: { r: 'up', l: 'namaste' }, style: { heads: 1 }, face: { eyes: 'angry', mouth: 'calm' } }); },
      over: cardOn('b3', 'नौ', '9 सिर अर्पित', { y: 300 }) },
    b4: { set: 'heaven', cam: CAM.wide, shake: V('b4', 'प्रकट'),
      draw: (ctx, t) => { char(ctx, 'brahma', 470, 1150, 0.72, t, { flip: true, halo: t > V('b4', 'प्रकट'), arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); char(ctx, 'ravana', 200, 1170, 0.6, t, { arms: 'namaste', style: { heads: t > V('b4', 'लौटा') ? 10 : 1 }, face: { eyes: 'wide', mouth: 'o' } }); },
      over: (ctx, W, H_, t) => MYTH.shock(ctx, 200, 820, t, V('b4', 'लौटा')) },
    rv: { set: 'heaven', cam: CAM.close(360), shake: V('rv', 'कोई'), draw: one('ravana', { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }) },
    b5: { set: 'palace', cam: CAM.mid, draw: one('ravana', { arms: 'hips', face: { eyes: 'angry', mouth: 'grin' } }),
      over: cardOn('b5', 'मनुष्य।', 'मनुष्य?', { y: 300, size: 70 }) },
    end: { set: 'battle', cam: CAM.push, draw: one('rama', { holdL: 'bow', hold: 'arrow', arms: { r: 'draw', l: 'bowL' }, halo: true, face: { eyes: 'calm', mouth: 'calm' } }),
      over: cardOn('end', 'श्री', 'श्री राम', { y: 300, size: 80 }) },
  };
}, {"series": "रावण के रहस्य", "part": 3, "hook": "रावण ने अपने ही\n9 सिर काट दिए!", "next": "रावण को उसका नाम\nकिसने दिया?", "nextAt": "nx", "gold": ["रावण", "नौ", "सिर", "ब्रह्मा", "मनुष्य।", "राम।", "दसवाँ"]});
