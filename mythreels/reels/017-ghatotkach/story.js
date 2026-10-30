KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'battle', cam: CAM.push, draw: one('krishna', { halo: true, arms: { r: 'wave', l: 'up' }, face: { eyes: 'happy', mouth: 'grin' }, bob: Math.sin(Date.now() * 0) }) },
    b1: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.wide, draw: one('ghatotkach', { arms: 'fist', face: { eyes: 'open', mouth: 'grin' } }, 360, 0.82), over: cardOn('b1', 'घटोत्कच...', 'घटोत्कच', { y: 300, size: 78 }) },
    b2: { set: 'battle', cam: CAM.wide, shake: V('b2', 'तबाही'), draw: (ctx, t) => { char(ctx, 'ghatotkach', 360, 1180, 0.95, t, { arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); },
      over: (ctx, W, H_, t) => { MYTH.dark(ctx, W, H_, 0.4); MYTH.shock(ctx, 360, 900, t, V('b2', 'तबाही'), 'rgba(255,160,80,'); } },
    b3: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'duryodhana', 210, 1170, 0.66, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'open' } }); char(ctx, 'karna', 500, 1170, 0.7, t, { flip: true, arms: 'cross', face: { eyes: 'calm', mouth: 'calm' } }); }, over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.35) },
    b4: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'karna', 360, 1170, 0.8, t, { arms: { r: 'up', l: 'hips' }, hold: 'vajra', face: { eyes: 'calm', mouth: 'calm' } }); }, over: cardOn('b4', 'एक', 'सिर्फ़ 1 बार', { y: 300, size: 70 }) },
    b5: { set: 'battle', cam: CAM.wide, shake: V('b5', 'चला'), draw: (ctx, t) => { char(ctx, 'karna', 200, 1170, 0.62, t, { arms: { r: 'point', l: 'hips' }, face: { eyes: 'angry', mouth: 'shout' } }); char(ctx, 'ghatotkach', 520, 1180, 0.75, t, { flip: true, arms: 'open', face: { eyes: t > V('b5', 'चला') ? 'closed' : 'angry', mouth: 'o' } }); if (t > V('b5', 'चला') - 0.1 && t < V('b5', 'चला') + 0.5) MYTH.lightning(ctx, 260, 800, 500, 820, t, 9); },
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.35) },
    b6: { set: 'battle', cam: [[360, 760, 0.9], [360, 760, 1.0]], shake: V('b6', 'गिर'), draw: (ctx, t) => { const g = H.clamp((t - V('b6', 'विशाल')) / 1.2), f = H.clamp((t - V('b6', 'गिर')) / 0.8); char(ctx, 'ghatotkach', 360, 1220, 0.8 + 0.9 * g, t, { lean: 1.4 * f * f, arms: 'open', face: { eyes: 'closed', mouth: 'o' } }); },
      over: (ctx, W, H_, t) => { MYTH.dark(ctx, W, H_, 0.3); MYTH.shock(ctx, 500, 1100, t, V('b6', 'गिर') + 0.6, 'rgba(255,200,120,'); } },
    end: { set: 'heaven', cam: CAM.wide, draw: two('krishna', { halo: true, arms: { r: 'bless', l: 'down' }, face: { eyes: 'happy', mouth: 'smile' } }, 'arjuna', { holdL: 'bow', arms: { r: 'namaste', l: 'rest' }, face: { eyes: 'calm', mouth: 'smile' } }, 0.7) },
  };
}, {"series": "महाभारत के छुपे योद्धा", "part": 2, "hook": "घटोत्कच की मौत पर\nकृष्ण नाच उठे!", "next": "अर्जुन के बेटे ने\nअपनी बलि दे दी!", "nextAt": "nx", "gold": ["घटोत्कच", "कृष्ण", "कर्ण", "अर्जुन", "शक्ति"]});
