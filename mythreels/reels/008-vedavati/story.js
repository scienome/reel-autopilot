KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.push, draw: one('sita', { halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }) },
    b1: { set: 'forest', setOpt: { time: 'day' }, cam: CAM.wide, draw: one('vedavati', { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }, 360, 0.75, 1180), over: cardOn('b1', 'वेदवती...', 'वेदवती', { y: 300, size: 76 }) },
    b2: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.mid, shake: V('b2', 'पकड़'),
      draw: two('ravana', { arms: { r: 'point', l: 'hips' }, face: { eyes: 'angry', mouth: 'grin' } }, 'vedavati', { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }, 0.66) },
    b3: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.close(360), draw: one('vedavati', { arms: { r: 'up', l: 'fist' }, face: { eyes: 'angry', mouth: 'calm' } }), over: (ctx, W, H_, t) => MYTH.shock(ctx, 360, 600, t, V('b3', 'काट')) },
    vd: { set: 'forest', setOpt: { time: 'night' }, cam: [[360, 700, 1.9], [360, 680, 2.3]], shake: V('vd', 'विनाश'),
      draw: (ctx, t) => { MYTH.flame(ctx, 200, 1250, 1.5, t); MYTH.flame(ctx, 540, 1250, 1.5, t + 1); char(ctx, 'vedavati', 360, 1170, 0.85, t, { glow: 'rgba(255,140,60,0.4)', arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'calm' } }); } },
    b4: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.wide,
      draw: (ctx, t) => { const u = H.clamp((t - V('b4', 'अग्नि')) / 1.0); ctx.save(); ctx.globalAlpha = 1 - u; char(ctx, 'vedavati', 360, 1170, 0.75, t, { arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); ctx.restore(); for (let i = 0; i < 5; i++) MYTH.flame(ctx, 240 + i * 60, 1220, 1.2 + u, t + i); } },
    end: { set: 'forest', setOpt: { time: 'dawn', sun: true }, cam: CAM.push,
      draw: (ctx, t) => { MYTH.ell(ctx, '#8a5a3a', 360, 1200, 160, 30, 0, 5); char(ctx, 'sita', 360, 1180, 0.8, t, { halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); },
      over: (ctx, W, H_, t) => { MYTH.petals(ctx, W, t, V('end', 'सीता'), 30); } },
  };
}, {"series": "रावण के रहस्य", "part": 6, "hook": "सीता का जन्म...\nरावण के अंत के लिए!", "next": "रावण ने सीता को\nकभी छुआ क्यों नहीं?", "nextAt": "nx", "gold": ["सीता", "वेदवती...", "वेदवती", "विनाश", "अग्नि", "केश"]});
