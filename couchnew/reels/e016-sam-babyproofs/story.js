  // ==================== couch sitcom e016 "Sam Babyproofs" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const lock = (ctx, x, y) => { ADULT.oval(ctx, '#d8b030', x, y, 22, 20, 650 + x); ctx.lineWidth = 7; ctx.strokeStyle = ADULT.INK; ctx.beginPath(); ctx.arc(x, y - 18, 13, Math.PI, 0); ctx.stroke(); };
    const cupboard = (ctx, t) => { ADULT.poly(ctx, '#a07850', [[230, 520], [490, 520], [490, 1120], [230, 1120]], 660); ADULT.line(ctx, [[360, 520], [360, 1120]], 5, ADULT.INK, 661); lock(ctx, 360, 820); };
    return {
      s1: { set: 'kitchen', cam: [[300, 760, 1.15], [300, 750, 1.3]], draw: (ctx, t) => { sam(ctx, t, { arms: 'up', face: { eyes: 'happy', mouth: 'grin' } }, 300); lock(ctx, 620, 380); lock(ctx, 120, 700); } },
      m1: { set: 'kitchen', cam: CU(150), draw: (ctx, t) => maya(ctx, t, { arms: 'hips', face: { eyes: 'half', mouth: 'flat', look: [1, 0] } }, 150) },
      s2: { set: 'kitchen', cam: [[360, 700, 1.0], [360, 700, 1.1]], draw: (ctx, t) => { sam(ctx, t, { arms: AT(t, [[0, 'point'], [V('s2', 'Drawers') - 0.2, 'up'], [V('s2', 'Fridge') - 0.2, 'point']]), face: { eyes: 'happy', mouth: 'grin' } }, 300); if (t > V('s2', 'Drawers')) lock(ctx, 300, 820); if (t > V('s2', 'Fridge')) lock(ctx, 600, 520); },
        over: (ctx, W, H_, t) => { ADULT.card(ctx, 'CORNERS ✓', 200, 420, popU(t, V('s2', 'Corners'), 0.3), '#4ad08a', ADULT.INK, 36); ADULT.card(ctx, 'DRAWERS ✓', 520, 420, popU(t, V('s2', 'Drawers'), 0.3), '#4ad08a', ADULT.INK, 36); ADULT.card(ctx, 'FRIDGE ✓', 360, 520, popU(t, V('s2', 'Fridge'), 0.3), '#4ad08a', ADULT.INK, 36); } },
      mu1: { set: 'kitchen', cam: CU(600), draw: (ctx, t) => { mum(ctx, t, { arms: 'point', flip: true, face: { eyes: 'angry', mouth: 'flat' } }, 600); lock(ctx, 600, 520); } },
      s3: { set: 'kitchen', cam: CU(300), draw: (ctx, t) => sam(ctx, t, { arms: 'hips', face: { eyes: 'half', mouth: 'smirk' } }, 300) },
      n2: { set: 'living', cam: WIDE, draw: (ctx, t) => { cupboard(ctx, t); maya(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o' } }, 120); mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'half', mouth: 'smirk' } }, 600, 1150); },
        over: (ctx, W, H_, t) => { if (t < first('m2')) timeCard(ctx, W, H_, t, first('n2') - 0.1, '1 HOUR LATER'); } },
      s4: { set: 'living', cam: [[360, 800, 1.4], [360, 800, 1.6]], shake: first('s4'), draw: (ctx, t) => cupboard(ctx, t),
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'KNOCK KNOCK', 360, 440, popU(t, first('s4'), 0.25) * (0.9 + 0.1 * Math.sin(t * 20)), '#ffd23f', 0.06) },
      mu2: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'closed', mouth: 'smile' } }, 600, 1150) },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { cupboard(ctx, t); maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'smile' } }, 120); mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'closed', mouth: 'smile' } }, 600, 1150); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n2', 'n3'], sound: (k, { V, first }) => { k.play('click', V('s2', 'locked'), { gain: 0.5 }); COUCH.sounds.twist(k, first('mu2')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
