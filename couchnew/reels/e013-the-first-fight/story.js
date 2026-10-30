  // ==================== couch sitcom e013 "The First Fight" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const stat = (ctx, n, col) => { ADULT.poly(ctx, '#f4f2ee', [[300, 380], [420, 380], [420, 500], [300, 500]], 640); ctx.fillStyle = col; ctx.font = '900 54px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(String(n) + '°', 360, 460); };
    const temp = (t) => t < first('m2') ? 21 : t < first('s2') ? 19 : t < first('mu2') ? 22 : 20;
    return {
      n1: { set: 'living', cam: WIDE, draw: (ctx, t) => { stat(ctx, temp(t), '#3a3a40'); maya(ctx, t, { arms: 'cross', face: { eyes: 'angry', mouth: 'frown', look: [1, 0] } }, 200); sam(ctx, t, { arms: 'cross', flip: true, face: { eyes: 'angry', mouth: 'frown', look: [-1, 0], sweat: 1 } }, 520); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('n1') - 0.1, 'ROUND 1') },
      m1: { set: 'living', cam: CU(200), draw: (ctx, t) => maya(ctx, t, { arms: 'cross', face: { eyes: 'angry', mouth: 'frown', look: [1, 0] } }, 200), over: (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(120,190,255,0.25)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } },
      s1: { set: 'living', cam: CU(520), draw: (ctx, t) => sam(ctx, t, { arms: 'shrug', flip: true, face: { eyes: 'angry', mouth: 'shout', sweat: 1 } }, 520), over: (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(255,120,60,0.22)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } },
      m2: { set: 'living', cam: [[360, 640, 1.5], [360, 630, 1.6]], shake: first('m2'), draw: (ctx, t) => { stat(ctx, temp(t), '#2a6ad0'); maya(ctx, t, { arms: 'point', face: { eyes: 'angry', mouth: 'shout' } }, 250); } },
      s2: { set: 'living', cam: [[360, 640, 1.5], [360, 630, 1.6]], shake: first('s2'), draw: (ctx, t) => { stat(ctx, temp(t), '#e8382a'); sam(ctx, t, { arms: 'point', flip: true, face: { eyes: 'angry', mouth: 'shout', sweat: 1 } }, 470); } },
      mu1: { set: 'living', cam: WIDE, draw: (ctx, t) => { const k = H.clamp((t - first('mu1') + 0.4) / 0.6); stat(ctx, temp(t), '#3a3a40'); maya(ctx, t, { arms: 'cross', face: { eyes: 'wide', mouth: 'o' } }, 150); sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 320); mum(ctx, t, { walk: k < 1 ? t * 9 : null, arms: 'hold', hold: 'remote', face: { eyes: 'half', mouth: 'flat' } }, H.lerp(800, 560, H.ease.out(k))); } },
      mu2: { set: 'living', cam: CU(560), draw: (ctx, t) => mum(ctx, t, { arms: 'hold', hold: 'remote', face: { eyes: 'half', mouth: 'flat' } }, 560), over: (ctx, W, H_, t) => ADULT.card(ctx, '20°', 360, 430, popU(t, first('mu2'), 0.3), '#4ad08a', ADULT.INK, 70) },
      s3: { set: 'living', cam: CU(320), draw: (ctx, t) => sam(ctx, t, { arms: 'down', face: { eyes: 'happy', mouth: 'smile' } }, 320) },
      m3: { set: 'living', cam: CU(150), draw: (ctx, t) => maya(ctx, t, { arms: 'down', face: { eyes: 'happy', mouth: 'smile' } }, 150) },
      mu3: { set: 'living', cam: [[560, 760, 1.6], [560, 750, 1.8]], draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'remote', face: { eyes: 'half', mouth: 'smirk' } }, 560, 1150) },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'cross', face: { mouth: 'flat' } }, 150); sam(ctx, t, { arms: 'cross', face: { mouth: 'flat' } }, 320); mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'remote', face: { eyes: 'closed', mouth: 'smile' } }, 560, 1150); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n1', 'n3'], sound: (k, { V, first }) => { k.play('impact', first('m2'), { gain: 0.3 }); k.play('impact', first('s2'), { gain: 0.3 }); COUCH.sounds.twist(k, first('mu2')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
