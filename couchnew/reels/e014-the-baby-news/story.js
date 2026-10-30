  // ==================== couch sitcom e014 "The Baby News" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const faint = (t) => t > V('s2', 'Wow') + 0.4 && t < first('s3') - 0.2;
    const samFloor = (ctx, t) => { if (faint(t)) { ctx.save(); ctx.translate(360, 1130); ctx.rotate(-Math.PI / 2); sam(ctx, t, { arms: 'up', face: { eyes: 'closed', mouth: 'o' } }, 0, 0); ctx.restore(); } else sam(ctx, t, { pose: 'sit', arms: 'down', face: { eyes: 'wide', mouth: 'o', sweat: 1 } }, 360, 1150); };
    return {
      m1: { set: 'living', cam: [[260, 760, 1.3], [260, 750, 1.45]], draw: (ctx, t) => { maya(ctx, t, { arms: 'hold', face: { eyes: 'open', mouth: 'smile' } }, 150); sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 380); } },
      s1: { set: 'living', cam: CU(380), draw: (ctx, t) => sam(ctx, t, { pose: 'sit', arms: 'cheeks', face: { eyes: 'wide', mouth: 'o', sweat: 1, brows: 1 } }, 380, 1150) },
      m2: { set: 'living', cam: CU(150), draw: (ctx, t) => maya(ctx, t, { arms: 'cheeks', face: { eyes: 'happy', mouth: 'grin', blush: 1, tears: 1 } }, 150),
        over: (ctx, W, H_, t) => { for (let i = 0; i < 6; i++) { const u = t - V('m2', 'pregnant') - i * 0.1; if (u > 0) FX.heart(ctx, 120 + i * 90, 760 - u * 150, 44 * popU(t, V('m2', 'pregnant') + i * 0.1, 0.3), 0); } } },
      s2: { set: 'living', cam: WIDE, shake: V('s2', 'Wow') + 0.5, draw: (ctx, t) => { maya(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o' } }, 150); samFloor(ctx, t); },
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'THUD!', 420, 520, popU(t, V('s2', 'Wow') + 0.5, 0.25)) },
      mu1: { set: 'living', cam: [[470, 760, 1.25], [470, 750, 1.35]], draw: (ctx, t) => { samFloor(ctx, t); mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }, 600); } },
      m3: { set: 'living', cam: CU(150), shake: first('m3'), draw: (ctx, t) => maya(ctx, t, { arms: 'up', face: { eyes: 'wide', mouth: 'shout' } }, 150) },
      mu2: { set: 'living', cam: CU(600), draw: (ctx, t) => mum(ctx, t, { arms: AT(t, [[0, 'cross'], [V('mu2', 'search') - 0.3, 'phone']]), face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }, 600) },
      mu3: { set: 'living', cam: [[470, 760, 1.25], [470, 750, 1.35]], draw: (ctx, t) => { samFloor(ctx, t); mum(ctx, t, { arms: 'hold', hold: 'suitcase', face: { eyes: 'happy', mouth: 'smile' } }, 600); } },
      s3: { set: 'living', cam: CU(380), draw: (ctx, t) => sam(ctx, t, { pose: 'sit', arms: 'facepalm', face: { eyes: 'sad', mouth: 'frown', sweat: 1 } }, 380, 1150) },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'cheeks', face: { eyes: 'happy', mouth: 'smile' } }, 150); sam(ctx, t, { pose: 'sit', arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }, 360, 1150); mum(ctx, t, { arms: 'hold', hold: 'suitcase', face: { eyes: 'half', mouth: 'smirk' } }, 600); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n3'], sound: (k, { V, first }) => { COUCH.sounds.heart(k, V('m2', 'pregnant'), 5); k.play('impact', V('s2', 'Wow') + 0.5, { gain: 0.5 }); COUCH.sounds.twist(k, first('mu3')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
