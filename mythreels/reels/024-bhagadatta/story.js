KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'battle', cam: CAM.push, draw: (ctx, t) => { char(ctx, 'krishna', 360, 1170, 0.82, t, { halo: true, arms: 'open', style: { garland: true }, face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.shock(ctx, 360, 820, t, 0.6) },
    b1: { set: 'battle', cam: CAM.mid, draw: one('bhagadatta', { arms: { r: 'point', l: 'hips' }, face: { eyes: 'angry', mouth: 'grin' } }), over: cardOn('b1', 'भगदत्त...', 'भगदत्त', { y: 300, size: 78 }) },
    b2: { set: 'battle', cam: CAM.close(360), draw: one('bhagadatta', { arms: 'down', face: { eyes: 'half', mouth: 'calm' } }) },
    b3: { set: 'battle', cam: CAM.wide, shake: V('b3', 'रौंद'), draw: (ctx, t) => { MYTH.elephant(ctx, 330, 1200, 1.0, t); char(ctx, 'bhagadatta', 300, 900, 0.42, t, { hold: 'gada', arms: { r: 'up', l: 'hips' }, face: { eyes: 'angry', mouth: 'shout' } }); }, over: cardOn('b3', 'सुप्रतीक', 'सुप्रतीक', { y: 300, size: 70 }) },
    b4: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { MYTH.elephant(ctx, 200, 1200, 0.7, t); char(ctx, 'bhagadatta', 190, 990, 0.32, t, { hold: 'chakra', arms: { r: 'up', l: 'hips' }, face: { eyes: 'angry', mouth: 'shout' } }); MYTH.chariot(ctx, 560, 1210, 0.55, t, true); char(ctx, 'arjuna', 560, 1100, 0.36, t, { flip: true, holdL: 'bow', arms: { r: 'cover', l: 'rest' }, face: { eyes: 'wide' } }); }, over: cardOn('b4', 'वैष्णवास्त्र।', 'वैष्णवास्त्र', { y: 300, size: 70 }) },
    b5: { set: 'battle', cam: CAM.mid, shake: V('b5', 'छाती'), draw: (ctx, t) => { const u = H.clamp((t - V('b5', 'माला')) / 0.5); char(ctx, 'krishna', 360, 1170, 0.82, t, { halo: true, arms: 'open', style: { garland: u > 0.3 }, face: { eyes: 'calm', mouth: 'smile' } }); if (t > V('b5', 'छाती') - 0.3 && u < 1) MYTH.lightning(ctx, 760, 400, 380, 820, t, 9); },
      over: (ctx, W, H_, t) => { MYTH.shock(ctx, 360, 830, t, V('b5', 'छाती')); MYTH.petals(ctx, W, t, V('b5', 'माला'), 26); } },
    end: { set: 'heaven', cam: CAM.close(360), draw: one('krishna', { halo: true, hold: 'chakra', arms: { r: 'up', l: 'bless' }, style: { garland: true }, face: { eyes: 'calm', mouth: 'smile' } }) },
  };
}, {"series": "महाभारत के छुपे योद्धा", "part": 9, "hook": "कृष्ण ने अर्जुन के लिए\nअस्त्र छाती पर झेला!", "next": "वो राजा जो\n2 टुकड़ों में पैदा हुआ!", "nextAt": "nx", "gold": ["कृष्ण", "भगदत्त...", "सुप्रतीक", "वैष्णवास्त्र।", "माला"]});
