// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const hanu = (ctx, x, y, s, t, o = {}) => char(ctx, 'hanuman', x, y, s, t, o);

  return {
    h1: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { hanu(ctx, 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b1: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'sita', 480, 1170, 0.78, t, { flip: true, arms: 'chin', face: { eyes: 'happy', mouth: 'smile' } }); hanu(ctx, 190, 1170, 0.72, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b1', 'सिंदूर', 'सिंदूर', { y: 300, size: 90 }) },
    b2: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { hanu(ctx, 250, 1170, 0.82, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'wide', mouth: 'open' } }); char(ctx, 'sita', 540, 1170, 0.7, t, { flip: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b3: { set: 'palace', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'sita', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b4: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { hanu(ctx, 360, 1170, 0.85, t, { arms: 'chin', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b5: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { const u = H.clamp((t - at('b5', 4)) / 1.5); hanu(ctx, 360, 1170, 0.85, t, { arms: 'up', face: { eyes: 'happy', mouth: 'smile' }, glow: `rgba(230,60,20,${0.6 * u})` }); } },
    b6: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'rama', 210, 1170, 0.75, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); hanu(ctx, 500, 1170, 0.72, t, { flip: true, arms: 'namaste', glow: 'rgba(230,60,20,0.5)', face: { eyes: 'closed', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b6', 4), 24) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { hanu(ctx, 360, 1170, 0.85, t, { halo: true, arms: 'bless', glow: 'rgba(230,60,20,0.5)', face: { eyes: 'calm', mouth: 'smile' } }); } },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 7, "hook": "सीता जी की एक बात,\nहनुमान जी लाल हो गए!", "next": "विष्णु जी गरुड़\nपर क्यों सवार हैं?", "nextAt": "nx", "gold": ["सिंदूर", "सीता", "हनुमान", "राम", "माँग", "भक्ति"]});
