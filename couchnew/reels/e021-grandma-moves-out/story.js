  // ==================== couch sitcom e021 "Grandma Moves Out" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const window_ = (ctx, t, show) => { ADULT.poly(ctx, '#2a3a6a', [[470, 180], [680, 180], [680, 470], [470, 470]], 700); ADULT.line(ctx, [[575, 180], [575, 470]], 6, ADULT.INK, 701); ADULT.line(ctx, [[470, 325], [680, 325]], 6, ADULT.INK, 702); if (show) { mum(ctx, t, { arms: 'wave', face: { eyes: 'happy', mouth: 'grin' } }, 575, 640); } };
    return {
      mu1: { set: 'living', cam: [[470, 760, 1.3], [470, 750, 1.45]], draw: (ctx, t) => { sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 330); mum(ctx, t, { arms: 'hold', hold: 'suitcase', face: { eyes: 'half', mouth: 'smile' } }, 600); } },
      s1: { set: 'living', cam: CU(330), shake: first('s1'), draw: (ctx, t) => sam(ctx, t, { arms: 'up', bob: -20 * Math.abs(Math.sin(t * 10)), face: { eyes: 'happy', mouth: 'grin' } }, 330) },
      m1: { set: 'living', cam: CU(150), draw: (ctx, t) => maya(ctx, t, { arms: 'cheeks', face: { eyes: 'sad', mouth: 'frown', tears: 1 } }, 150) },
      s2: { set: 'living', cam: CU(330), draw: (ctx, t) => sam(ctx, t, { arms: 'point', face: { eyes: 'half', mouth: 'flat' } }, 330) },
      n2: { set: 'living', cam: WIDE, draw: (ctx, t) => { maya(ctx, t, { pose: 'sit', arms: 'hold', hold: 'baby', face: { eyes: 'happy', mouth: 'smile' } }, 170, 1150); sam(ctx, t, { arms: 'up', face: { eyes: 'happy', mouth: 'grin' } }, 420); },
        over: (ctx, W, H_, t) => { if (t < first('s3')) timeCard(ctx, W, H_, t, first('n2') - 0.1, '1 WEEK LATER'); } },
      s3: { set: 'living', cam: CU(420), draw: (ctx, t) => sam(ctx, t, { arms: 'up', bob: -10 * Math.abs(Math.sin(t * 4)), face: { eyes: 'closed', mouth: 'smile' } }, 420),
        over: (ctx, W, H_, t) => { for (let i = 0; i < 5; i++) FX.sparkle(ctx, 140 + i * 110, 560 + Math.sin(t * 3 + i) * 40, 18, t * 4 + i); } },
      n4: { set: 'living', cam: WIDE, shake: first('n4'), draw: (ctx, t) => { window_(ctx, t, false); maya(ctx, t, { pose: 'sit', arms: 'hold', hold: 'baby', face: { eyes: 'wide', mouth: 'o' } }, 170, 1150); sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 380); } },
      mu2: { set: 'living', cam: [[575, 330, 2.1], [575, 340, 2.3]], draw: (ctx, t) => window_(ctx, t, true) },
      s4: { set: 'living', cam: CU(380), shake: first('s4'), draw: (ctx, t) => sam(ctx, t, { arms: 'cheeks', squash: 1 + 0.1 * pulse(t, first('s4'), 0.3), face: { eyes: 'wide', mouth: 'shout', brows: 1, sweat: 1 } }, 380) },
      mu3: { set: 'living', cam: [[575, 330, 2.1], [575, 340, 2.3]], draw: (ctx, t) => window_(ctx, t, true) },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { window_(ctx, t, true); maya(ctx, t, { pose: 'sit', arms: 'hold', hold: 'baby', face: { eyes: 'happy', mouth: 'smile' } }, 170, 1150); sam(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }, 380); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n2', 'n4', 'n3'], sound: (k, { V, first }) => { COUCH.sounds.twist(k, first('mu2')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
