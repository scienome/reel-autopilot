  // ==================== couch sitcom e010 "The Vows" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const scratch = (ctx, W, H_, t, at) => { const u = H.clamp((t - at) / 0.35); if (u <= 0) return; ctx.save(); ctx.strokeStyle = '#e8203a'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(150, 470); ctx.lineTo(150 + 420 * u, 470 + 40 * Math.sin(u * 9)); ctx.stroke(); ctx.restore(); };
    return {
      s1: { set: 'living', cam: [[470, 760, 1.3], [470, 750, 1.45]], draw: (ctx, t) => { sam(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'happy', mouth: 'grin' } }, 360); mum(ctx, t, { pose: 'sit', arms: 'cross', face: { eyes: 'half', mouth: 'flat', look: [-1, 0] } }, 600, 1150); } },
      mu1: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'cross', face: { eyes: 'half', mouth: 'flat', look: [-1, 0] } }, 600, 1150) },
      s2: { set: 'living', cam: CU(360), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'closed', mouth: 'smile', blush: 1 } }), over: (ctx, W, H_, t) => scratch(ctx, W, H_, t, V('mu2', 'Delete')) },
      mu2: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'point', flip: true, face: { eyes: 'half', mouth: 'flat' } }, 600, 1150) },
      s3: { set: 'kitchen', setOpt: { fire: 0 }, cam: CU(200), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'happy', mouth: 'grin' } }, 140), over: (ctx, W, H_, t) => scratch(ctx, W, H_, t, V('mu3', 'Delete')) },
      mu3: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'point', flip: true, face: { eyes: 'angry', mouth: 'flat' } }, 600, 1150) },
      s4: { set: 'living', cam: CU(360), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'sad', mouth: 'frown', brows: 1 } }) },
      mu4: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'cross', face: { eyes: 'closed', mouth: 'smile' } }, 600, 1150),
        over: (ctx, W, H_, t) => ADULT.card(ctx, '✓ KEEP', 360, 430, popU(t, V('mu4', 'Keep'), 0.3), '#4ad08a', ADULT.INK, 56) },
      m1: { set: 'living', cam: [[260, 760, 1.4], [260, 750, 1.55]], draw: (ctx, t) => { maya(ctx, t, { arms: 'cheeks', face: { eyes: 'sad', mouth: 'smile', tears: 1, blush: 1 } }, 150); sam(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'wide', mouth: 'grin' } }, 380); },
        over: (ctx, W, H_, t) => { for (let i = 0; i < 6; i++) { const u = t - first('m1') - i * 0.12; if (u > 0) FX.heart(ctx, 120 + i * 80, 760 - u * 150, 46 * popU(t, first('m1') + i * 0.12, 0.3), Math.sin(u * 3 + i) * 0.2); } } },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'cheeks', face: { eyes: 'happy', mouth: 'smile' } }); sam(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'happy', mouth: 'grin' } }); mum(ctx, t, { pose: 'sit', arms: 'cross', face: { eyes: 'half', mouth: 'smirk' } }, 600, 1150); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n3'], sound: (k, { V, first }) => { COUCH.sounds.heart(k, first('m1'), 5); k.play('stamp', first('n3'), { gain: 0.45 }); } });
