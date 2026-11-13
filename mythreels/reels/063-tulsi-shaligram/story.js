// motion: camera moves + living characters (kit/katha.js)
// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const stone = (ctx, x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); MYTH.ell(ctx, '#2a2a34', 0, 0, 90, 70, 0.2, 6); MYTH.ell(ctx, '#f4c030', -10, -8, 28, 20, 0.4, 3); ctx.restore(); };
  const plant = (ctx, x, y, s = 1, t = 0) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#b86a3a'; ctx.strokeStyle = MYTH.INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(70, 0); ctx.lineTo(50, 90); ctx.lineTo(-50, 90); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#3a8a4a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -140); ctx.stroke(); for (let i = 0; i < 6; i++) MYTH.ell(ctx, '#3aa04a', (i % 2 ? 30 : -30), -30 - i * 24 + Math.sin(t * 2 + i) * 3, 26, 14, i % 2 ? 0.4 : -0.4, 3); ctx.restore(); };
  const tul = (ctx, x, y, s, t, o = {}) => char(ctx, 'sita', x, y, s, t, Object.assign({ as: 'sita', style: { cloth: '#2f8a4a', cloth2: '#f0d070' } }, o));

  return {
    h1: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { plant(ctx, 360, 1000, 1.8, t); } },
    b1: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { tul(ctx, 360, 1170, 0.85, t, { halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); }, over: cardOn('b1', 'तुलसी', 'तुलसी', { y: 300, size: 90 }) },
    b2: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.mid, draw: (ctx, t) => { tul(ctx, 360, 1170, 0.85, t, { arms: 'cover', face: { eyes: 'sad', mouth: 'calm', tears: true } }); } },
    b3: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.wide, shake: V('b3', 'श्राप'), draw: (ctx, t) => { tul(ctx, 210, 1170, 0.78, t, { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }); char(ctx, 'vishnu', 520, 1170, 0.72, t, { flip: true, halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b4: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b4', 7), 18) },
    b5: { set: 'village', cam: CAM.wide, draw: (ctx, t) => { stone(ctx, 200, 1130, 1.2); plant(ctx, 520, 1100, 1.5, t); }, over: cardOn('b5', 'शालिग्राम', 'शालिग्राम', { y: 300, size: 70 }) },
    end: { set: 'village', cam: CAM.wide, draw: (ctx, t) => { stone(ctx, 240, 1130, 1.2); plant(ctx, 480, 1100, 1.5, t); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('end', 3), 26) },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 9, "hook": "एक पत्नी का श्राप...\nभगवान पत्थर बन गए!", "next": "गणेश जी को तुलसी\nक्यों नहीं चढ़ती?", "nextAt": "nx", "gold": ["तुलसी", "शालिग्राम", "श्राप", "विष्णु", "पत्थर", "विवाह"]});
