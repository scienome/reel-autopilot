KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'battle', cam: CAM.push, draw: (ctx, t) => { MYTH.chariot(ctx, 360, 1210, 0.8, t); char(ctx, 'karna', 300, 1050, 0.5, t, { holdL: 'bow', arms: { r: 'fist', l: 'rest' }, face: { eyes: 'angry', mouth: 'frown' } }); char(ctx, 'shalya', 450, 1060, 0.48, t, { arms: { r: 'point', l: 'hips' }, face: { eyes: 'open', mouth: 'smile' } }); } },
    b1: { set: 'forest', setOpt: { time: 'day' }, cam: CAM.mid, draw: one('shalya', { arms: { r: 'point', l: 'hips' }, face: { eyes: 'open', mouth: 'smile' } }), over: cardOn('b1', 'शल्य...', 'राजा शल्य', { y: 300, size: 74 }) },
    b2: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'shalya', 360, 1170, 0.72, t, { arms: 'open', face: { eyes: 'happy', mouth: 'grin' } }); for (const x of [120, 600]) { ctx.save(); ctx.translate(x, 1120); MYTH.ITEMS.pot(ctx); ctx.restore(); } }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, first('b2'), 18) },
    b3: { set: 'palace', cam: CAM.wide, shake: V('b3', 'दुर्योधन।'), draw: two('duryodhana', { arms: 'namaste', face: { eyes: 'open', mouth: 'grin' } }, 'shalya', { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }, 0.68) },
    b4: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: two('deva', { arms: 'namaste', style: { skin: '#d8a07a', sh: '#bb805a', cloth: '#f2f2f2', cloth2: '#3a6ec0', crown: 'tall', mustache: true }, face: { eyes: 'calm', mouth: 'calm' } }, 'shalya', { arms: 'namaste', face: { eyes: 'sad', mouth: 'smile' } }, 0.68), over: cardOn('b4', 'हौसला', 'कर्ण का हौसला तोड़ो', { y: 300, size: 54 }) },
    end: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'karna', 230, 1170, 0.66, t, { holdL: 'bow', arms: { r: 'cover', l: 'rest' }, face: { eyes: 'sad', mouth: 'frown' } }); char(ctx, 'shalya', 500, 1170, 0.62, t, { flip: true, arms: { r: 'point', l: 'hips' }, face: { eyes: 'open', mouth: 'grin' } }); } },
  };
}, {"series": "महाभारत के छुपे योद्धा", "part": 11, "hook": "कर्ण का सारथी...\nपांडवों का साथी था!", "next": "विदुर असल में\nयमराज थे!", "nextAt": "nx", "gold": ["शल्य", "शल्य...", "कर्ण", "दुर्योधन।", "हौसला"]});
