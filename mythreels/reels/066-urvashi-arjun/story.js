// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  return {
    h1: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'arjuna', 360, 1170, 0.85, t, { hold: 'bow', arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); } },
    b1: { set: 'heaven', cam: CAM.wide, draw: two('arjuna', { hold: 'bow', arms: 'down', face: { eyes: 'calm', mouth: 'calm' } }, 'rambha', { as: 'rambha', arms: 'open', face: { eyes: 'calm', mouth: 'smile' } }), over: cardOn('b1', 7, 'उर्वशी', { y: 300, size: 90 }) },
    b2: { set: 'heaven', cam: CAM.close(240), draw: (ctx, t) => { char(ctx, 'arjuna', 240, 1170, 0.9, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b3: { set: 'heaven', cam: CAM.push, shake: at('b3', 6), draw: (ctx, t) => { char(ctx, 'rambha', 360, 1170, 0.85, t, { arms: 'point', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'angry', mouth: 'open' } }); }, over: cardOn('b3', 6, 'श्राप!', { y: 300, size: 100 }) },
    b4: { set: 'heaven', cam: CAM.wide, draw: two('indra', { hold: 'vajra', arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }, 'arjuna', { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }), over: cardOn('b4', 6, 'बस एक साल', { y: 300, size: 80 }) },
    b5: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'arjuna', 360, 1170, 0.8, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }); }, over: cardOn('b5', 2, 'अज्ञातवास', { y: 300, size: 80 }) },
    end: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'arjuna', 360, 1170, 0.82, t, { arms: 'open', style: { cloth: '#ff8ac0', cloth2: '#ffd23f' }, face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('end', 1, 'बृहन्नला', { y: 300, size: 90 }) },
  };
}, {"series": "श्राप जिन्होंने इतिहास बदला", "part": 2, "hook": "एक श्राप,\nजो ढाल बन गया", "nextAt": "nx", "gold": ["अर्जुन", "उर्वशी", "इंद्र", "बृहन्नला", "श्राप", "वरदान"], "next": "नारद के श्राप से\nराम-सीता बिछड़े"});
