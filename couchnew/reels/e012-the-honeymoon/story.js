  // ==================== couch sitcom e012 "The Honeymoon" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const Y = 1070, SX = { sam: 130, mum: 360, maya: 590 };
    const seat3 = (ctx, t, so, mo, yo, withMum = true) => { sam(ctx, t, Object.assign({ pose: 'sit' }, so), SX.sam, Y); if (withMum) mum(ctx, t, Object.assign({ pose: 'sit' }, mo), SX.mum, Y); maya(ctx, t, Object.assign({ pose: 'sit' }, yo), SX.maya, Y); };
    return {
      n1: { set: 'plane', cam: WIDE, draw: (ctx, t) => { sam(ctx, t, { pose: 'sit', arms: 'down', face: { eyes: 'happy', mouth: 'grin' } }, 200, Y); maya(ctx, t, { pose: 'sit', arms: 'down', face: { eyes: 'happy', mouth: 'smile' } }, 520, Y); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('n1') - 0.1, 'THE HONEYMOON') },
      m1: { set: 'plane', cam: CU(520, 720), draw: (ctx, t) => maya(ctx, t, { pose: 'sit', arms: 'cheeks', face: { eyes: 'happy', mouth: 'smile', blush: 1, look: [-1, 0] } }, 520, Y) },
      s1: { set: 'plane', cam: CU(200, 720), draw: (ctx, t) => sam(ctx, t, { pose: 'sit', arms: 'up', face: { eyes: 'happy', mouth: 'grin' } }, 200, Y) },
      mu1: { set: 'plane', cam: [[360, 740, 1.15], [360, 740, 1.25]], shake: first('mu1'), draw: (ctx, t) => { const k = H.clamp((t - first('mu1') + 0.3) / 0.5); sam(ctx, t, { pose: 'sit', arms: 'cheeks', face: { eyes: 'wide', mouth: 'o' } }, H.lerp(200, SX.sam, k), Y); mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'half', mouth: 'smirk' } }, SX.mum, Y + 200 * (1 - k)); maya(ctx, t, { pose: 'sit', arms: 'cheeks', face: { eyes: 'wide', mouth: 'o' } }, H.lerp(520, SX.maya, k), Y); } },
      s2: { set: 'plane', cam: CU(SX.sam, 720), draw: (ctx, t) => sam(ctx, t, { pose: 'sit', arms: 'cheeks', squash: 1 + 0.08 * pulse(t, first('s2'), 0.3), face: { eyes: 'wide', mouth: 'shout', brows: 1, sweat: 1 } }, SX.sam, Y) },
      mu2: { set: 'plane', cam: CU(SX.mum, 720), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }, SX.mum, Y),
        over: (ctx, W, H_, t) => ADULT.card(ctx, '12 HOURS', 360, 430, popU(t, V('mu2', 'Twelve') - 0.1, 0.3), '#ffd23f', ADULT.INK, 54) },
      n2: { set: 'plane', setOpt: { night: true }, cam: [[250, 740, 1.4], [250, 740, 1.5]], draw: (ctx, t) => { sam(ctx, t, { pose: 'sit', arms: 'down', face: { eyes: 'half', mouth: 'frown', sweat: 1 } }, SX.sam, Y); mum(ctx, t, { pose: 'sit', arms: 'down', tilt: -0.4, face: { eyes: 'closed', mouth: 'o' } }, SX.mum - 40, Y); },
        over: (ctx, W, H_, t) => { ADULT.night(ctx, W, H_, 0.35); if (t < first('s3')) timeCard(ctx, W, H_, t, first('n2') - 0.1, 'HOUR 11'); else { ctx.fillStyle = '#fff'; ctx.font = '900 54px sans-serif'; ctx.fillText('Z', 420 + Math.sin(t * 2) * 10, 520 - (t * 60) % 120); ctx.fillText('z', 470, 470 - (t * 50) % 100); } } },
      m2: { set: 'plane', setOpt: { night: true }, cam: [[360, 740, 1.1], [360, 740, 1.15]], draw: (ctx, t) => seat3(ctx, t, { arms: 'down', face: { eyes: 'half', mouth: 'frown' } }, { arms: 'down', tilt: -0.4, face: { eyes: 'closed', mouth: 'o' } }, { arms: 'cheeks', face: { eyes: 'happy', mouth: 'smile', look: [-1, 0] } }),
        over: (ctx, W, H_) => ADULT.night(ctx, W, H_, 0.3) },
      n3: { set: 'plane', cam: [[360, 760, 1.02], [360, 760, 1.05]], draw: (ctx, t) => seat3(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }, { arms: 'hold', hold: 'mug', face: { eyes: 'half', mouth: 'smirk' } }, { arms: 'down', face: { eyes: 'happy', mouth: 'smile' } }), over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n1', 'n2', 'n3'], sound: (k, { V, first }) => { k.play('thud', first('mu1'), { gain: 0.4 }); COUCH.sounds.twist(k, V('mu1', 'Budge')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
