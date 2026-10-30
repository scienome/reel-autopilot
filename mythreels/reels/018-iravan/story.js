KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'battle', cam: CAM.push, draw: one('iravan', { halo: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }) },
    b1: { set: 'river', setOpt: { night: true }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'arjuna', 200, 1170, 0.62, t, { holdL: 'bow', arms: { r: 'down', l: 'rest' } }); char(ctx, 'ulupi', 520, 1170, 0.66, t, { flip: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'iravan', 360, 1200, 0.5, t, { arms: 'namaste', face: { mouth: 'smile' } }); },
      over: cardOn('b1', 'इरावन...', 'इरावन', { y: 300, size: 78 }) },
    b2: { set: 'underworld', cam: CAM.mid, draw: (ctx, t) => { MYTH.flame(ctx, 360, 1240, 1.8, t); }, over: (ctx, W, H_, t) => { MYTH.om(ctx, 360, 640, 160, 0.5); } },
    b3: { set: 'battle', cam: CAM.mid, draw: one('iravan', { arms: { r: 'fist', l: 'hips' }, face: { eyes: 'calm', mouth: 'calm' } }) },
    ir: { set: 'battle', cam: CAM.close(360), draw: one('iravan', { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }) },
    b4: { set: 'court', setOpt: { throne: 360 }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'villager', 200, 1170, 0.62, t, { arms: 'cross', style: { turban: '#f4c430', cloth: '#6a2a8a' }, face: { eyes: 'angry', mouth: 'frown' } }); char(ctx, 'villager', 520, 1170, 0.62, t, { flip: true, arms: 'shrug', style: { turban: '#2a8a6a', cloth: '#f2f2f2' }, face: { eyes: 'sad', mouth: 'frown' } }); } },
    b5: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { const u = H.clamp((t - V('b5', 'मोहिनी')) / 0.8); MYTH.shock(ctx, 360, 700, t, V('b5', 'मोहिनी')); char(ctx, 'krishna', 360, 1170, 0.82, t, { halo: true, arms: 'namaste', style: u > 0.5 ? { girl: true, cloth: '#e85a9a', cloth2: '#f4c430', crown: 'small' } : {}, face: { eyes: 'calm', mouth: 'smile' } }); },
      over: cardOn('b5', 'मोहिनी', 'मोहिनी रूप', { y: 300, size: 70 }) },
    end: { set: 'village', cam: CAM.wide, draw: (ctx, t) => { MYTH.head(ctx, MYTH.CAST.iravan, 360, 760, { eyes: 'open', mouth: 'smile' }, t, 3, 1.5); MYTH.aura(ctx, 360, 760, 160, t); }, over: (ctx, W, H_, t) => { MYTH.petals(ctx, W, t, first('end'), 26); } },
  };
}, {"series": "महाभारत के छुपे योद्धा", "part": 3, "hook": "अर्जुन के बेटे ने\nअपनी बलि दे दी!", "next": "बिना गुरु के\nअर्जुन से बड़ा धनुर्धर!", "nextAt": "nx", "gold": ["इरावन...", "इरावन", "उलूपी", "मोहिनी", "बलि", "कूत्तांडवर"]});
