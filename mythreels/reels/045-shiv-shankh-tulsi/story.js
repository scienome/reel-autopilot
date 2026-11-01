KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const tulsi = (ctx, x, y, s, t, o = {}) => char(ctx, 'sita', x, y, s, t, Object.assign({ as: 'sita', style: { cloth: '#2f8a4a', cloth2: '#f0d070' } }, o));
  const chud = (ctx, x, y, s, t, o = {}) => char(ctx, 'asura', x, y, s, t, o);

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { chud(ctx, 220, 1170, 0.78, t, { arms: 'hips', face: { eyes: 'angry', mouth: 'grin' } }); tulsi(ctx, 520, 1170, 0.68, t, { flip: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b1', 'तुलसी', 'तुलसी', { y: 300, size: 80 }) },
    b2: { set: 'battle', cam: CAM.mid, shake: V('b2', 'हार'), draw: (ctx, t) => { chud(ctx, 360, 1170, 0.9, t, { arms: 'up', hold: 'gada', face: { eyes: 'angry', mouth: 'shout' } }); char(ctx, 'indra', 130, 1170, 0.4, t, { flip: false, arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); char(ctx, 'deva', 600, 1170, 0.4, t, { flip: true, arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); } },
    b3: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'shiva', 430, 1170, 0.8, t, { halo: true, arms: { r: 'up', l: 'down' }, hold: 'trishul', face: { eyes: 'angry', mouth: 'calm' } }); char(ctx, 'indra', 150, 1170, 0.45, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }); } },
    b4: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 220, 1170, 0.8, t, { arms: { r: 'point', l: 'down' }, hold: 'trishul', face: { eyes: 'angry', mouth: 'calm' } }); chud(ctx, 520, 1170 + 200 * H.clamp((t - at('b4', 3)) / 1.0), 0.7, t, { flip: true, arms: 'down', face: { eyes: 'closed', mouth: 'calm' } }); }, over: cardOn('b4', 'शंख', 'शंख', { y: 300, size: 90 }) },
    b5: { set: 'kailash', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: { r: 'open', l: 'down' }, hold: 'conch', face: { eyes: 'calm', mouth: 'calm' } }); }, over: (ctx, W, H_, t) => { const u = H.clamp((t - V('b5', 'मना')) / 0.3); if (u > 0) { ctx.save(); ctx.strokeStyle = '#e8384f'; ctx.lineWidth = 16; ctx.globalAlpha = u; ctx.beginPath(); ctx.arc(360, 560, 120, 0, 6.2832); ctx.moveTo(275, 475); ctx.lineTo(445, 645); ctx.stroke(); ctx.restore(); } } },
    b6: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.mid, draw: (ctx, t) => { tulsi(ctx, 360, 1170, 0.85, t, { halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); }, over: cardOn('b6', 'तुलसी', 'तुलसी', { y: 300, size: 90 }) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, arms: 'bless', hold: 'conch', face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('end', 3), 22) },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 3, "hook": "शिव को शंख और\nतुलसी क्यों नहीं?", "next": "कलावे के मंत्र में\nदानव राजा का नाम!", "nextAt": "nx", "gold": ["शंखचूड़", "तुलसी", "शंख", "त्रिशूल", "विष्णु", "महादेव"]});
