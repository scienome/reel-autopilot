// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const narad = (ctx, x, y, s, t, o = {}) => char(ctx, 'sage', x, y, s, t, Object.assign({ as: 'sage', hold: 'veena', style: { cloth: '#f4c430', cloth2: '#ffffff' } }, o));
  return {
    h1: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { narad(ctx, 230, 1170, 0.8, t, { arms: 'point', face: { eyes: 'angry', mouth: 'open' } }); char(ctx, 'vishnu', 520, 1170, 0.8, t, { flip: true, halo: true, hold: 'chakra', arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { narad(ctx, 360, 1170, 0.85, t, { arms: 'down', face: { eyes: 'closed', mouth: 'smile' } }); }, over: cardOn('b1', 11, 'घमंड', { y: 300, size: 100 }) },
    b2: { set: 'palace', cam: CAM.wide, draw: two('vishnu', { halo: true, hold: 'chakra', arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }, 'sita', { as: 'sita', arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }), over: cardOn('b2', 6, 'माया', { y: 300, size: 100 }) },
    b3: { set: 'palace', cam: CAM.close(360), draw: (ctx, t) => { char(ctx, 'hanuman', 360, 1170, 0.85, t, { as: 'sage', style: { cloth: '#f4c430', cloth2: '#ffffff' }, crown: false, arms: 'open', face: { eyes: 'wide', mouth: 'smile' } }); }, over: cardOn('b3', 10, 'वानर का मुँह!', { y: 300, size: 76 }) },
    b4: { set: 'palace', cam: CAM.wide, shake: at('b4', 1), draw: (ctx, t) => { narad(ctx, 360, 1170, 0.8, t, { arms: 'down', face: { eyes: 'angry', mouth: 'frown' } }); } },
    b5: { set: 'palace', cam: CAM.push, shake: at('b5', 2), draw: (ctx, t) => { narad(ctx, 360, 1170, 0.85, t, { arms: 'point', glow: 'rgba(255,200,80,0.75)', face: { eyes: 'angry', mouth: 'open' } }); }, over: cardOn('b5', 2, 'श्राप!', { y: 300, size: 100 }) },
    end: { set: 'forest', cam: CAM.wide, draw: two('rama', { hold: 'bow', arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }, 'hanuman', { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }) },
  };
}, {"series": "श्राप जिन्होंने इतिहास बदला", "part": 3, "hook": "एक ऋषि का श्राप,\nराम-सीता बिछड़े", "nextAt": "nx", "gold": ["नारद", "विष्णु", "राम", "सीता", "वानर", "रामचरितमानस"], "next": "एक हिरण का श्राप,\nजिसने पांडु की जान ली"});
