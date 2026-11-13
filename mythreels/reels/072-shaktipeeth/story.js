// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const fire = (ctx, x, y, t, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); [['#d6102a', 90], ['#ff8a1e', 66], ['#ffd23f', 40]].forEach(([c, r], i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.quadraticCurveTo(-r * 0.6, -r * 1.6 - Math.sin(t * 8 + i) * 12, 0, -r * 2.4); ctx.quadraticCurveTo(r * 0.6, -r * 1.6 + Math.sin(t * 7 + i) * 12, r, 0); ctx.fill(); }); ctx.restore(); };
  const sati = (ctx, x, y, s, t, o = {}) => char(ctx, 'parvati', x, y, s, t, Object.assign({ as: 'parvati' }, o));
  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'open', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    b1: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { for (let i = 0; i < 6; i++) { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(140 + (i % 3) * 220, 820 + Math.floor(i / 3) * 180, 26 + Math.sin(t * 3 + i) * 4, 0, 7); ctx.fill(); } }, over: cardOn('b1', 0, 'शक्तिपीठ', { y: 300, size: 90 }) },
    b2: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { fire(ctx, 360, 1120, t, 0.9); char(ctx, 'sage', 180, 1170, 0.72, t, { as: 'sage', style: { cloth: '#d6102a', cloth2: '#ffd23f' }, arms: 'point', face: { eyes: 'angry', mouth: 'open' } }); }, over: cardOn('b2', 1, 'दक्ष का यज्ञ', { y: 300, size: 80 }) },
    b3: { set: 'palace', cam: CAM.push, shake: at('b3', 14), draw: (ctx, t) => { fire(ctx, 470, 1120, t, 1.2); sati(ctx, 260, 1170, 0.8, t, { arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    b4: { set: 'space', setOpt: { sun: false }, cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'open', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    b5: { set: 'space', setOpt: { sun: false }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, hold: 'chakra', arms: 'up', face: { eyes: 'calm', mouth: 'calm' } }); }, over: cardOn('b5', 4, 'सुदर्शन चक्र', { y: 300, size: 80 }) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { for (let i = 0; i < 9; i++) { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(120 + (i % 3) * 240, 760 + Math.floor(i / 3) * 140, 22 + Math.sin(t * 3 + i) * 4, 0, 7); ctx.fill(); } }, over: cardOn('end', 19, 'इक्यावन', { y: 300, size: 100 }) },
  };
}, {"series": "देवियों के रहस्य", "part": 2, "hook": "धरती पर इक्यावन जगह\nक्या गिरा था?", "nextAt": "nx", "gold": ["सती", "दक्ष", "शिव", "विष्णु", "शक्तिपीठ", "सुदर्शन"], "next": "माँ दुर्गा का वाहन\nशेर क्यों?"});
