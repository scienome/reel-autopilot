KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'court', setOpt: { throne: 360 }, cam: CAM.push, draw: one('vikarna', { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'open' } }) },
    b1: { set: 'court', setOpt: { throne: 600 }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'bhishma', 140, 1150, 0.5, t, { arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); char(ctx, 'drona', 290, 1150, 0.5, t, { arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); char(ctx, 'draupadi', 520, 1190, 0.62, t, { flip: true, arms: 'cover', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    b2: { set: 'court', cam: CAM.mid, draw: one('vikarna', { arms: 'hips', face: { eyes: 'angry', mouth: 'calm' } }), over: cardOn('b2', 'विकर्ण', 'विकर्ण', { y: 300, size: 80 }) },
    vk: { set: 'court', cam: CAM.close(360), shake: V('vk', 'अधर्म'), draw: one('vikarna', { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }), over: cardOn('vk', 'अधर्म', 'ये अधर्म है!', { y: 300, size: 70 }) },
    b3: { set: 'court', cam: CAM.wide, draw: two('karna', { arms: { r: 'point', l: 'hips' }, face: { eyes: 'angry', mouth: 'shout' } }, 'vikarna', { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }, 0.68) },
    b4: { set: 'battle', cam: CAM.wide, draw: two('bhima', { hold: 'gada', arms: { r: 'rest', l: 'open' }, face: { eyes: 'sad', mouth: 'open' } }, 'vikarna', { hold: 'sword', arms: { r: 'up', l: 'fist' }, face: { eyes: 'calm', mouth: 'calm' } }, 0.66) },
    end: { set: 'battle', cam: CAM.mid, draw: one('bhima', { hold: 'gada', arms: { r: 'rest', l: 'cover' }, face: { eyes: 'closed', mouth: 'frown', tears: true } }), over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.3) },
  };
}, {"series": "महाभारत के छुपे योद्धा", "part": 6, "hook": "पूरी सभा चुप थी...\nसिर्फ़ एक कौरव बोला!", "next": "बेटे ने अपने ही\nपिता अर्जुन को मारा!", "nextAt": "nx", "gold": ["विकर्ण", "द्रौपदी", "अधर्म", "भीम"]});
