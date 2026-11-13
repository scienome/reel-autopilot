// narrator: Imran (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const gan = (ctx, x, y, s, t, o = {}) => char(ctx, 'amba', x, y, s, t, Object.assign({ as: 'amba', style: { cloth: '#f4f0e8', cloth2: '#c9b48a' }, face: { eyes: 'closed', mouth: 'frown' } }, o));
  return {
    h1: { set: 'battle', setOpt: { sun: false }, cam: CAM.mid, draw: (ctx, t) => { gan(ctx, 220, 1170, 0.8, t, { arms: 'point', face: { eyes: 'closed', mouth: 'open' } }); char(ctx, 'krishna', 520, 1170, 0.78, t, { flip: true, halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'battle', setOpt: { sun: false }, cam: CAM.wide, draw: (ctx, t) => { gan(ctx, 360, 1170, 0.82, t, { arms: 'cover', face: { eyes: 'closed', mouth: 'frown', tears: true } }); }, over: cardOn('b1', 3, 'सौ बेटे', { y: 300, size: 90 }) },
    b2: { set: 'palace', cam: CAM.wide, draw: two('amba', { as: 'amba', style: { cloth: '#f4f0e8', cloth2: '#c9b48a' }, arms: 'cover', face: { eyes: 'closed', mouth: 'frown', tears: true } }, 'krishna', { halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }) },
    b3: { set: 'palace', cam: CAM.close(240), draw: (ctx, t) => { gan(ctx, 240, 1170, 0.9, t, { arms: 'point', face: { eyes: 'closed', mouth: 'open' } }); } },
    b4: { set: 'palace', cam: CAM.push, shake: at('b4', 6), draw: (ctx, t) => { gan(ctx, 360, 1170, 0.85, t, { arms: 'up', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'closed', mouth: 'open' } }); }, over: cardOn('b4', 8, 'छत्तीस साल', { y: 300, size: 80 }) },
    b5: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'krishna', 360, 1170, 0.85, t, { halo: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'krishna', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
  };
}, {"series": "श्राप जिन्होंने इतिहास बदला", "part": 1, "hook": "एक माँ का श्राप,\nभगवान ने भी माना", "nextAt": "nx", "gold": ["गांधारी", "कृष्ण", "श्राप", "यदुवंश", "छत्तीस", "महाभारत"], "next": "वो श्राप, जिसने\nअर्जुन की जान बचाई"});
