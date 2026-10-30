  // ==================== couch sitcom e008 "The Wedding Planner" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    return {
      mu1: { set: 'cafe', cam: [[470, 760, 1.25], [470, 750, 1.4]], draw: (ctx, t) => { sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 330); mum(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }, 600); } },
      s1: { set: 'cafe', cam: CU(330), draw: (ctx, t) => sam(ctx, t, { arms: 'shrug', face: { eyes: 'wide', mouth: 'open', brows: 1 } }, 330) },
      mu2: { set: 'cafe', cam: CU(600), draw: (ctx, t) => mum(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }, 600),
        over: (ctx, W, H_, t) => { ADULT.card(ctx, 'VENUE: HOSPITAL', 360, 430, popU(t, V('mu2', 'hospital') - 0.2, 0.3), '#7ad0b0', ADULT.INK, 46); } },
      m1: { set: 'living', cam: CU(150), draw: (ctx, t) => maya(ctx, t, { arms: 'hips', face: { eyes: 'half', mouth: 'flat', look: [1, 0] } }) },
      mu3: { set: 'living', cam: CU(580), draw: (ctx, t) => mum(ctx, t, { arms: AT(t, [[0, 'cross'], [V('mu3', 'socks') - 0.3, 'shrug']]), face: { eyes: 'half', mouth: 'smile', look: [-1, 0] } }) },
      s2: { set: 'living', cam: CU(360, 720), shake: first('s2'), draw: (ctx, t) => sam(ctx, t, { arms: 'up', bob: -20 * Math.abs(Math.sin(t * 10)), face: { eyes: 'happy', mouth: 'grin' } }) },
      mu4: { set: 'living', cam: CU(580), draw: (ctx, t) => mum(ctx, t, { arms: AT(t, [[0, 'cross'], [V('mu4', 'Wrong') - 0.2, 'point']]), flip: true, face: { eyes: 'half', mouth: 'flat' } }),
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, '✗', 360, 440, popU(t, V('mu4', 'Wrong'), 0.25), '#ff4a5a', 0) },
      s3: { set: 'living', cam: CU(360), draw: (ctx, t) => sam(ctx, t, { arms: 'cheeks', face: { eyes: 'sad', mouth: 'frown', brows: 1 } }) },
      mu5: { set: 'living', cam: [[470, 760, 1.3], [470, 750, 1.45]], draw: (ctx, t) => { sam(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }, 330); mum(ctx, t, { arms: 'hold', hold: 'doughnut', face: { eyes: t > V('mu5', 'Tradition') ? 'closed' : 'half', mouth: 'smirk' } }, 600); } },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'flat' } }); sam(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }); mum(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'half', mouth: 'smirk' } }); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n3'], sound: (k, { V, first }) => { k.play('thud', first('s2'), { gain: 0.3 }); COUCH.sounds.twist(k, V('mu5', 'Doughnuts')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
