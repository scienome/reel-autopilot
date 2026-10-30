  // ==================== couch sitcom e019 "Baby Brenda" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const cry = (ctx, x, y, t, at) => { if (t < at) return; ADULT.sfxWord(ctx, 'WAAAH!', x, y, popU(t, at, 0.2) * (0.92 + 0.08 * Math.sin(t * 30)), '#7ad0f2', 0.08); };
    return {
      n1: { set: 'living', cam: WIDE, draw: (ctx, t) => { maya(ctx, t, { arms: 'down', face: { eyes: 'half', mouth: 'smile', sweat: 1 } }, 150); sam(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'happy', mouth: 'grin' } }, 360); mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'half', mouth: 'smirk' } }, 600, 1150); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('n1') - 0.1, 'WEEK 1') },
      s1: { set: 'living', cam: CU(360), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'happy', mouth: 'smile' } }) },
      n2: { set: 'living', cam: CU(360), shake: first('n2'), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'wide', mouth: 'o', sweat: 1 } }), over: (ctx, W, H_, t) => cry(ctx, 380, 440, t, first('n2')) },
      m1: { set: 'living', cam: CU(150), draw: (ctx, t) => maya(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'open', mouth: 'smile' } }, 150) },
      n3x: { set: 'living', cam: CU(150), shake: first('n3x'), draw: (ctx, t) => maya(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'wide', mouth: 'o', sweat: 1 } }, 150), over: (ctx, W, H_, t) => { cry(ctx, 360, 440, t, first('n3x')); cry(ctx, 360, 560, t, first('n3x') + 0.4); } },
      mu1: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'hold', face: { eyes: 'half', mouth: 'flat' } }, 600, 1150) },
      n4: { set: 'living', cam: [[600, 770, 1.6], [600, 760, 1.85]], draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'baby', face: { eyes: 'closed', mouth: 'smile' } }, 600, 1150),
        over: (ctx, W, H_, t) => { if (t > first('n4')) { ctx.fillStyle = '#fff'; ctx.font = '900 54px sans-serif'; ctx.fillText('z', 500, 560 - (t * 50) % 100); ctx.fillText('Z', 540, 500 - (t * 40) % 100); } } },
      s2: { set: 'living', cam: CU(360), shake: first('s2'), draw: (ctx, t) => sam(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout', brows: 1 } }) },
      mu2: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'baby', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }, 600, 1150) },
      s3: { set: 'living', cam: CU(360), draw: (ctx, t) => sam(ctx, t, { arms: 'shrug', face: { eyes: 'wide', mouth: 'open', sweat: 1 } }) },
      mu3: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'baby', face: { eyes: 'closed', mouth: 'smirk' } }, 600, 1150) },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'smile' } }, 150); sam(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }); mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'baby', face: { eyes: 'happy', mouth: 'smile' } }, 600, 1150); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n1', 'n2', 'n3x', 'n4', 'n3'], sound: (k, { V, first }) => { k.play('impact', first('n2'), { gain: 0.3 }); COUCH.sounds.twist(k, first('mu3')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
