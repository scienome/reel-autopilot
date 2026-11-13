// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const fish = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 10); ctx.scale(s, s); ctx.fillStyle = '#3aa0b8'; ctx.beginPath(); ctx.ellipse(0, 0, 200, 80, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(180, 0); ctx.lineTo(290, -80); ctx.lineTo(290, 80); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(-130, -20, 16, 0, 7); ctx.fill(); ctx.fillStyle = '#1a2a3a'; ctx.beginPath(); ctx.arc(-130, -20, 7, 0, 7); ctx.fill(); ctx.restore(); };
  const sea = (ctx, t) => { ctx.fillStyle = 'rgba(30,90,170,0.55)'; ctx.fillRect(0, 900, 720, 400); };
  const son = (ctx, x, y, s, t, o = {}) => char(ctx, 'hanuman', x, y, s, t, Object.assign({ as: 'hanuman', style: { skin: '#5aa0a8', sh: '#3a7880', cloth: '#1a4a8a', cloth2: '#ffd23f' } }, o));
  return {
    h1: { set: 'ocean', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'hanuman', 230, 1170, 0.8, t, { hold: 'gada', arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); son(ctx, 500, 1170, 0.78, t, { flip: true, hold: 'gada', arms: 'down', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'hanuman', 360, 1170, 0.85, t, { arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); }, over: cardOn('b1', 10, 'मकरध्वज', { y: 300, size: 90 }) },
    b2: { set: 'ocean', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'hanuman', 360, 1170, 0.8, t, { arms: 'up', face: { eyes: 'calm', mouth: 'smile' } }); sea(ctx, t); } },
    b3: { set: 'ocean', cam: CAM.push, draw: (ctx, t) => { sea(ctx, t); fish(ctx, 330, 1060, 1.0, t); } },
    b4: { set: 'ocean', cam: CAM.mid, draw: (ctx, t) => { son(ctx, 360, 1170, 0.82, t, { arms: 'open', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b4', 7, 'आधा वानर, आधा मकर', { y: 300, size: 64 }) },
    b5: { set: 'underworld', cam: CAM.wide, shake: at('b5', 12), draw: two('hanuman', { hold: 'gada', arms: 'draw', face: { eyes: 'angry', mouth: 'open' } }, 'hanuman', { as: 'hanuman', hold: 'gada', style: { skin: '#5aa0a8', sh: '#3a7880', cloth: '#1a4a8a', cloth2: '#ffd23f' }, arms: 'draw', face: { eyes: 'angry', mouth: 'open' } }), over: cardOn('b5', 3, 'अहिरावण का पाताल', { y: 300, size: 64 }) },
    end: { set: 'heaven', cam: CAM.wide, draw: two('rama', { halo: true, hold: 'bow', arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }, 'hanuman', { as: 'hanuman', style: { skin: '#5aa0a8', sh: '#3a7880', cloth: '#1a4a8a', cloth2: '#ffd23f' }, arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }) },
  };
}, {"series": "हनुमान जी के अनसुने किस्से", "part": 1, "hook": "ब्रह्मचारी हनुमान,\nफिर भी एक बेटा!", "nextAt": "nx", "gold": ["हनुमान", "मकरध्वज", "अहिरावण", "पाताल", "राम"], "next": "जब भीम से हनुमान जी\nकी पूँछ नहीं उठी"});
