KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'battle', cam: CAM.push, draw: (ctx, t) => { for (let i = 0; i < 6; i++) char(ctx, 'duryodhana', 40 + i * 52, 1150 - (i % 2) * 20, 0.34, t, { arms: 'fist', face: { eyes: 'angry' } }); char(ctx, 'yuyutsu', 540, 1180, 0.72, t, { flip: true, halo: true, arms: { r: 'point', l: 'hips' }, face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'court', setOpt: { throne: 520 }, cam: CAM.wide, draw: two('yuyutsu', { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }, 'dhritarashtra', { arms: 'bless', face: { mouth: 'calm' } }, 0.66), over: cardOn('b1', 'युयुत्सु...', 'युयुत्सु', { y: 300, size: 78 }) },
    b2: { set: 'battle', cam: CAM.mid, draw: one('deva', { arms: { r: 'open', l: 'down' }, style: { skin: '#d8a07a', sh: '#bb805a', cloth: '#f2f2f2', cloth2: '#3a6ec0', crown: 'tall', mustache: true }, face: { eyes: 'calm', mouth: 'open' } }), over: cardOn('b2', 'धर्म', 'धर्म के साथ कौन?', { y: 300, size: 58 }) },
    b3: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { const u = H.ease.inOut(H.clamp((t - V('b3', 'मोड़ा,')) / 2)); MYTH.chariot(ctx, H.lerp(160, 520, u), 1180, 0.6, t, u > 0.02 ? false : true); char(ctx, 'yuyutsu', H.lerp(160, 520, u), 1050, 0.45, t, { arms: { r: 'point', l: 'hips' }, face: { eyes: 'calm' } }); } },
    b4: { set: 'battle', cam: CAM.wide, draw: one('yuyutsu', { halo: true, arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }), over: (ctx, W, H_, t) => { MYTH.dark(ctx, W, H_, 0.35); card(ctx, W, H_, t, V('b4', 'अठारह'), '100 में से 1', { y: 300, size: 70 }); } },
    end: { set: 'court', setOpt: { throne: 360 }, cam: CAM.mid, draw: one('yuyutsu', { arms: 'bless', style: { crown: 'tall' }, face: { eyes: 'calm', mouth: 'smile' } }) },
  };
}, {"series": "महाभारत के छुपे योद्धा", "part": 5, "hook": "100 कौरवों में एक\nपांडवों की तरफ़ लड़ा!", "next": "वो कौरव जिसने\nद्रौपदी के लिए आवाज़ उठाई", "nextAt": "nx", "gold": ["युयुत्सु...", "युयुत्सु", "धर्म", "पांडवों", "अठारह"]});
