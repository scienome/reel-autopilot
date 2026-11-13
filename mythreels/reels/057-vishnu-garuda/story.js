// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const wing = (ctx, x, y, s, flip, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s); ctx.rotate(Math.sin(t * 3) * 0.05); for (let i = 0; i < 6; i++) { ctx.save(); ctx.rotate(-0.1 - i * 0.2); MYTH.ell(ctx, i % 2 ? '#e8a030' : '#c8501a', 120, 0, 170 - i * 10, 28, 0, 4); ctx.restore(); } ctx.restore(); };
  const garuda = (ctx, x, y, s, t, o = {}) => { wing(ctx, x - 40 * s, y - 330 * s, s, true, t); wing(ctx, x + 40 * s, y - 330 * s, s, false, t); return char(ctx, 'deva', x, y, s, t, Object.assign({ as: 'deva', style: { skin: '#e8a030', sh: '#c07818', cloth: '#c8332a', cloth2: '#f4c430', crown: 'tall' } }, o)); };
  const pot = (ctx, x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); MYTH.ell(ctx, '#f4c030', 0, 0, 60, 66, 0, 5); MYTH.ell(ctx, '#c48a1c', 0, -62, 30, 14, 0, 4); ctx.restore(); };

  return {
    h1: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { garuda(ctx, 360, 1130, 0.78, t, { arms: 'open', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: (ctx, t) => { garuda(ctx, 250, 1150, 0.62, t, { arms: 'fist', face: { eyes: 'angry', mouth: 'calm' } }); char(ctx, 'sita', 540, 1170, 0.55, t, { flip: true, arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); }, over: cardOn('b1', 'अमृत', 'अमृत', { y: 300, size: 90 }) },
    b2: { set: 'heaven', cam: CAM.mid, shake: V('b2', 'हराया'), draw: (ctx, t) => { garuda(ctx, 360, 1140, 0.8, t, { arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); pot(ctx, 360, 640, 0.9); } },
    b3: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: (ctx, t) => { garuda(ctx, 190, 1150, 0.6, t, { arms: 'down', face: { eyes: 'calm', mouth: 'calm' } }); pot(ctx, 190, 700, 0.5); char(ctx, 'vishnu', 520, 1170, 0.72, t, { flip: true, halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b4: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, arms: { r: 'bless', l: 'down' }, face: { eyes: 'calm', mouth: 'open' } }); } },
    b5: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { garuda(ctx, 360, 1160, 0.8, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'open' } }); } },
    b6: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { garuda(ctx, 250, 1150, 0.7, t, { arms: 'namaste', face: { eyes: 'happy', mouth: 'smile' } }); char(ctx, 'vishnu', 520, 1170, 0.72, t, { flip: true, halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b6', 4), 22) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { garuda(ctx, 360, 1100, 0.58, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'vishnu', 360, 930, 0.4, t, { pose: 'sit', halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('end', 'गरुड़', 'गरुड़', { y: 300, size: 90 }) },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 8, "hook": "माँ को छुड़ाने के लिए\nअमृत छीन लाया!", "next": "विष्णु जी का चक्र\nकिसने दिया?", "nextAt": "nx", "gold": ["गरुड़", "अमृत", "विनता", "विष्णु", "वर", "ध्वज"]});
