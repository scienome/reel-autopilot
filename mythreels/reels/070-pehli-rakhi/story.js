KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const thread = (ctx, x, y, t) => { ctx.save(); ctx.strokeStyle = '#e8384f'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(x, y, 40, 14, 0, 0, 7); ctx.stroke(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y - 14, 16 + Math.sin(t * 5) * 2, 0, 7); ctx.fill(); ctx.restore(); };
  const shachi = (ctx, x, y, s, t, o = {}) => char(ctx, 'parvati', x, y, s, t, Object.assign({ as: 'parvati', style: { cloth: '#e8384f', cloth2: '#ffd23f' } }, o));
  return {
    h1: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { thread(ctx, 360, 900, t); shachi(ctx, 220, 1170, 0.75, t, { arms: 'open', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'indra', 520, 1170, 0.78, t, { flip: true, hold: 'vajra', arms: 'down', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { thread(ctx, 360, 900, t); }, over: cardOn('b1', 13, 'पत्नी ने!', { y: 300, size: 100 }) },
    b2: { set: 'battle', cam: CAM.wide, shake: at('b2', 10), draw: two('indra', { hold: 'vajra', arms: 'draw', face: { eyes: 'wide', mouth: 'o' } }, 'asura', { arms: 'up', face: { eyes: 'angry', mouth: 'open' } }) },
    b3: { set: 'heaven', cam: CAM.wide, draw: two('parvati', { as: 'parvati', style: { cloth: '#e8384f', cloth2: '#ffd23f' }, arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }, 'sage', { as: 'sage', style: { cloth: '#f4c430', cloth2: '#ffffff' }, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }), over: cardOn('b3', 4, 'इंद्राणी', { y: 300, size: 90 }) },
    b4: { set: 'heaven', cam: CAM.close(360), draw: (ctx, t) => { char(ctx, 'sage', 360, 1170, 0.9, t, { as: 'sage', style: { cloth: '#f4c430', cloth2: '#ffffff' }, arms: 'open', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'closed', mouth: 'open' } }); thread(ctx, 360, 860, t); }, over: cardOn('b4', 4, 'रक्षा सूत्र', { y: 300, size: 90 }) },
    b5: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { shachi(ctx, 230, 1170, 0.8, t, { arms: 'open', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'indra', 500, 1170, 0.82, t, { flip: true, hold: 'vajra', arms: 'up', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'calm', mouth: 'smile' } }); thread(ctx, 400, 960, t); } },
    end: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { thread(ctx, 360, 820, t); char(ctx, 'villager', 360, 1170, 0.7, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); } },
  };
}, {"series": "ऐसा क्यों?", "part": 3, "hook": "राखी सबसे पहले\nकिसने बाँधी?", "nextAt": "nx", "gold": ["राखी", "इंद्र", "इंद्राणी", "बृहस्पति", "रक्षा", "श्रावण"], "next": "मंदिर में घंटी\nक्यों बजाते हैं?"});
