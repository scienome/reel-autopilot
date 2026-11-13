KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const plant = (ctx, x, y, k, t) => { ctx.save(); ctx.strokeStyle = '#d8a830'; ctx.lineWidth = 12; ctx.lineCap = 'round'; for (let i = -4; i <= 4; i++) { const tx = x + i * 50 + Math.sin(t * 2 + i) * 10, ty = y - 320 * k; ctx.beginPath(); ctx.moveTo(x + i * 30, y); ctx.quadraticCurveTo(x + i * 36, y - 160 * k, tx, ty); ctx.stroke(); ctx.fillStyle = '#ffe08a'; for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.ellipse(tx + (j % 2 ? 10 : -10), ty + j * 22, 9, 18, j % 2 ? 0.4 : -0.4, 0, 7); ctx.fill(); } } ctx.restore(); };
  const bowl = (ctx, x, y) => { ctx.fillStyle = '#b8682a'; ctx.beginPath(); ctx.ellipse(x, y, 110, 30, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#fbf7ec'; ctx.beginPath(); ctx.ellipse(x, y, 100, 26, 0, Math.PI, 0); ctx.fill(); };
  const medha = (ctx, x, y, s, t, o = {}) => char(ctx, 'sage', x, y, s, t, Object.assign({ as: 'sage' }, o));
  return {
    h1: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { bowl(ctx, 360, 1000); char(ctx, 'villager', 360, 1170, 0.6, t, { arms: 'open', face: { eyes: 'wide', mouth: 'o' } }); } },
    b1: { set: 'village', cam: CAM.wide, draw: (ctx, t) => { bowl(ctx, 360, 960); }, over: cardOn('b1', 3, 'एकादशी', { y: 300, size: 100 }) },
    b2: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { medha(ctx, 360, 1170, 0.85, t, { arms: 'namaste', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'closed', mouth: 'calm' } }); }, over: cardOn('b2', 2, 'महर्षि मेधा', { y: 300, size: 80 }) },
    b3: { set: 'forest', cam: CAM.push, shake: at('b3', 3), draw: (ctx, t) => { const k = Math.max(0.35, 1 - (t - at('b3', 0)) / 3); ctx.save(); ctx.globalAlpha = k; medha(ctx, 360, 1170 + (1 - k) * 200, 0.85, t, { arms: 'namaste', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'closed', mouth: 'calm' } }); ctx.restore(); } },
    b4: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { plant(ctx, 360, 1100, Math.min(1, Math.max(0, (t - at('b4', 0)) / 2)), t); }, over: cardOn('b4', 7, 'चावल और जौ', { y: 300, size: 80 }) },
    b5: { set: 'village', cam: CAM.close(360), draw: (ctx, t) => { bowl(ctx, 360, 960); plant(ctx, 360, 1100, 1, t); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, hold: 'chakra', arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
  };
}, {"series": "ऐसा क्यों?", "part": 2, "hook": "एकादशी के चावल में\nकिसका अंश है?", "nextAt": "nx", "gold": ["एकादशी", "चावल", "मेधा", "जौ", "व्रत"], "next": "राखी सबसे पहले\nकिसने बाँधी?"});
