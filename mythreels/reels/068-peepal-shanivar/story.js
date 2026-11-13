// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const tree = (ctx, x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#6a4024'; ctx.fillRect(-26, -260, 52, 260); ctx.fillStyle = '#2f7a3a'; [[0, -330, 150], [-110, -270, 110], [110, -270, 110], [-60, -400, 100], [70, -400, 100]].forEach(([a, b, r]) => { ctx.beginPath(); ctx.arc(a, b, r, 0, 7); ctx.fill(); }); ctx.restore(); };
  const lamp = (ctx, x, y, t) => { ctx.fillStyle = '#c86a2a'; ctx.beginPath(); ctx.ellipse(x, y, 34, 14, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(x, y - 24 + Math.sin(t * 9) * 2, 9, 20, 0, 0, 7); ctx.fill(); };
  const pip = (ctx, x, y, s, t, o = {}) => char(ctx, 'sage', x, y, s, t, Object.assign({ as: 'sage', style: { cloth: '#e86a1a', cloth2: '#f4c430' } }, o));
  return {
    h1: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { tree(ctx, 360, 1060, 1.1); lamp(ctx, 360, 1120, t); } },
    b1: { set: 'village', cam: CAM.wide, draw: (ctx, t) => { tree(ctx, 360, 1060, 1.0); lamp(ctx, 300, 1120, t); lamp(ctx, 420, 1120, t + 1); char(ctx, 'villager', 560, 1170, 0.7, t, { flip: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    b2: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { tree(ctx, 460, 1060, 1.0); char(ctx, 'balkrishna', 300, 1170, 0.7, t, { as: 'sage', style: { skin: '#f2c8a0', cloth: '#e86a1a', cloth2: '#f4c430' }, arms: 'up', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b2', 4, 'पिप्पलाद', { y: 300, size: 90 }) },
    b3: { set: 'forest', cam: CAM.close(360), draw: (ctx, t) => { pip(ctx, 360, 1170, 0.9, t, { arms: 'down', face: { eyes: 'angry', mouth: 'frown' } }); } },
    b4: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.wide, shake: at('b4', 8), draw: (ctx, t) => { pip(ctx, 220, 1170, 0.8, t, { arms: 'point', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'angry', mouth: 'open' } }); char(ctx, 'shani', 520, 1170, 0.78, t, { flip: true, arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }); } },
    b5: { set: 'heaven', cam: CAM.wide, draw: two('sage', { as: 'sage', style: { cloth: '#e86a1a', cloth2: '#f4c430' }, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }, 'shani', { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }), over: cardOn('b5', 9, 'एक शर्त', { y: 300, size: 90 }) },
    end: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { tree(ctx, 360, 1060, 1.1); lamp(ctx, 330, 1120, t); lamp(ctx, 390, 1120, t + 2); char(ctx, 'shani', 560, 1170, 0.65, t, { flip: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); } },
  };
}, {"series": "ऐसा क्यों?", "part": 1, "hook": "शनि देव का पैर\nकिसने तोड़ा?", "nextAt": "nx", "gold": ["पिप्पलाद", "शनि", "पीपल", "शनिवार", "दधीचि", "शिव"], "next": "एकादशी पर चावल\nक्यों नहीं?"});
