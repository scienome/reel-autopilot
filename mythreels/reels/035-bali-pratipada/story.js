KATHA((h) => {
  const { at, char, CAM, cardOn } = h;
  return {
    h1: { set: 'underworld', cam: CAM.push, draw: (ctx, t) => char(ctx, 'bali', 360, 1180, 0.84, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }) },
    b1: { set: 'court', setOpt: { throne: 360 }, cam: CAM.wide, draw: (ctx, t) => char(ctx, 'bali', 360, 1100, 0.78, t, { arms: 'hips', face: { eyes: 'open', mouth: 'smile' } }), over: cardOn('b1', 3, 'तीनों लोक', { y: 300, size: 78 }) },
    b2: { set: 'court', cam: CAM.mid, draw: (ctx, t) => char(ctx, 'vamana', 360, 1120, 0.95, t, { hold: 'kamandal', arms: { r: 'rest', l: 'bless' }, glow: 'rgba(255,220,130,0.35)', face: { eyes: 'calm', mouth: 'smile' } }) },
    b3: { set: 'court', cam: CAM.close(380), draw: (ctx, t) => char(ctx, 'vamana', 360, 1120, 0.9, t, { arms: { r: 'wave', l: 'rest' }, face: { eyes: 'calm', mouth: 'smile' } }), over: cardOn('b3', 2, '3 पग ज़मीन', { y: 300, size: 80 }) },
    b4: { set: 'court', setOpt: { throne: 200 }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'bali', 200, 1100, 0.72, t, { arms: { r: 'open', l: 'down' }, face: { eyes: 'happy', mouth: 'smile' } }); char(ctx, 'vamana', 520, 1110, 0.62, t, { flip: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b5: { set: 'space', setOpt: { sun: false, earth: true }, cam: [[360, 900, 1.0], [360, 640, 0.75]], shake: at('b5', 3), draw: (ctx, t) => { const g = H.clamp((t - at('b5', 3)) / 2); char(ctx, 'vishnu', 360, 1190, 0.6 + 1.2 * g, t, { halo: true, arms: { r: 'bless', l: 'open' }, face: { eyes: 'calm', mouth: 'smile' } }); } },
    b6: { set: 'court', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'bali', 300, 1110, 0.74, t, { lean: 0.5 * H.clamp((t - at('b6', 4)) / 0.6), arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); const y = 620 - 120 * Math.max(0, 1 - H.clamp((t - at('b6', 5)) / 0.8)); MYTH.ell(ctx, '#3a6ec0', 460, y, 92, 42, 0, 6); MYTH.ell(ctx, '#3a6ec0', 530, y - 14, 30, 22, 0, 4); }, over: cardOn('b6', 0, 'तीसरा पग?', { y: 300, size: 76 }) },
    b7: { set: 'underworld', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'bali', 230, 1180, 0.68, t, { arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); char(ctx, 'vishnu', 500, 1180, 0.72, t, { flip: true, halo: true, arms: { r: 'bless', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); } },
    end: { set: 'diwali', cam: CAM.push, draw: (ctx, t) => { char(ctx, 'bali', 360, 1100, 0.68, t, { arms: 'wave', face: { eyes: 'happy', mouth: 'smile' } }); }, over: cardOn('end', -3, 'बलि प्रतिपदा', { y: 300, size: 76 }) },
    nx: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { DIWA.board(ctx, 360, 1070, 0.8, t); DIWA.die(ctx, 300, 1060, 1, 6, t * 4); DIWA.die(ctx, 430, 1050, 1, 5, -t * 3); } },
  };
}, {"series": "दिवाली के रहस्य", "part": 6, "hook": "जिसे पाताल भेजा...\nउसी की पूजा!", "gold": ["बलि", "वामन", "विष्णु", "तीन", "सिर", "वर", "प्रतिपदा,", "पाताल"], "next": "दिवाली की रात\nमहादेव पासे में हारे!", "nextAt": "nx"});
