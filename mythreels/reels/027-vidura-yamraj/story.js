KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'court', cam: CAM.push, draw: (ctx, t) => { char(ctx, 'vidura', 360, 1170, 0.82, t, { arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); if (t > 1.2) { ctx.save(); ctx.globalAlpha = 0.35 + 0.15 * Math.sin(t * 4); char(ctx, 'yama', 360, 1170, 0.95, t, { arms: 'down', face: { eyes: 'calm' } }); ctx.restore(); } } },
    b1: { set: 'forest', setOpt: { time: 'dusk', hut: 540 }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'sage', 200, 1170, 0.6, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); for (let i = 0; i < 2; i++) char(ctx, 'villager', 480 + i * 100, 1180, 0.45, t, { arms: 'cover', style: { turban: '#2a2a2a', cloth: '#3a3a3a', cloth2: '#2a2a2a' }, face: { eyes: 'open', mouth: 'grin' } }); } },
    b2: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'sage', 220, 1170, 0.62, t, { arms: 'back', face: { eyes: 'closed', mouth: 'calm' } }); char(ctx, 'arjuna', 520, 1170, 0.6, t, { flip: true, hold: 'sword', arms: { r: 'point', l: 'hips' }, style: { cloth: '#6a4a2a', crown: 'small', tilak: null }, face: { eyes: 'angry', mouth: 'shout' } }); }, over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.3) },
    b3: { set: 'underworld', cam: CAM.wide, draw: two('sage', { arms: 'cross', face: { eyes: 'angry', mouth: 'calm' } }, 'yama', { arms: 'hips', face: { eyes: 'calm', mouth: 'calm' } }, 0.68) },
    md: { set: 'underworld', cam: CAM.close(360), draw: one('sage', { arms: { r: 'point', l: 'down' }, face: { eyes: 'angry', mouth: 'open' } }) },
    b4: { set: 'underworld', cam: CAM.close(360), draw: one('yama', { arms: { r: 'open', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' } }), over: cardOn('b4', 'कीड़े', 'बचपन की भूल', { y: 300, size: 64 }) },
    b5: { set: 'underworld', cam: CAM.wide, shake: V('b5', 'श्राप'), draw: two('sage', { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }, 'yama', { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }, 0.68), over: (ctx, W, H_, t) => MYTH.shock(ctx, 360, 800, t, V('b5', 'श्राप')) },
    end: { set: 'court', cam: CAM.mid, draw: one('vidura', { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }), over: cardOn('end', 'विदुर', 'यमराज = विदुर', { y: 300, size: 64 }) },
  };
}, {"series": "महाभारत के छुपे योद्धा", "part": 12, "hook": "महाभारत के विदुर...\nअसल में यमराज थे!", "next": "महाभारत का योद्धा\nआज भी ज़िंदा है!", "nextAt": "nx", "gold": ["विदुर", "यमराज", "मांडव्य", "श्राप", "कीड़े"]});
