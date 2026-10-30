  // ==================== couch sitcom e018 "The Birth" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const DOC = { top: '#f4f4f6', top2: '#d8d8de', outfit: 'suit', tie: '#3a6ad0' };
    const doc = (ctx, t, o, x = 600) => char(ctx, 'boss', x, 1120, 0.78, t, Object.assign({ style: DOC }, o), X);
    const bedMaya = (ctx, t, o) => { ADULT.bed(ctx, 400, 1060, t); maya(ctx, t, Object.assign({ pose: 'bed' }, o), 400, 1030); ADULT.blanket(ctx, 400, 1060, t); };
    return {
      n1: { set: 'living', cam: WIDE, draw: (ctx, t) => { maya(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o' } }, 200); sam(ctx, t, { arms: 'up', face: { eyes: 'wide', mouth: 'shout', sweat: 1 } }, 470); },
        over: (ctx, W, H_, t) => { ADULT.night(ctx, W, H_, 0.35); timeCard(ctx, W, H_, t, first('n1') - 0.1, '3:00 A.M.'); } },
      m1: { set: 'living', cam: CU(200), shake: first('m1'), draw: (ctx, t) => maya(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout', sweat: 1 } }, 200), over: (ctx, W, H_) => ADULT.night(ctx, W, H_, 0.3) },
      s1: { set: 'living', cam: CU(470), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'box', bob: -14 * Math.abs(Math.sin(t * 10)), face: { eyes: 'happy', mouth: 'grin' } }, 470), over: (ctx, W, H_) => ADULT.night(ctx, W, H_, 0.3) },
      m2: { set: 'living', cam: [[330, 760, 1.4], [330, 750, 1.55]], draw: (ctx, t) => { maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }, 200); sam(ctx, t, { arms: 'hold', hold: 'doughnut', face: { eyes: 'wide', mouth: 'grin', sweat: 1 } }, 470); }, over: (ctx, W, H_) => ADULT.night(ctx, W, H_, 0.3) },
      n2: { set: 'hospital', cam: WIDE, draw: (ctx, t) => { bedMaya(ctx, t, { arms: 'cheeks', face: { eyes: 'closed', mouth: 'shout' } }); doc(ctx, t, { arms: 'hold', face: { mouth: 'smile' } }, 640); },
        over: (ctx, W, H_, t) => { if (t < first('doc1')) timeCard(ctx, W, H_, t, first('n2') - 0.1, 'THE HOSPITAL. AGAIN.'); } },
      doc1: { set: 'hospital', cam: CU(640, 700), draw: (ctx, t) => doc(ctx, t, { arms: 'up', face: { eyes: 'wide', mouth: 'shout' } }, 640) },
      s2: { set: 'hospital', cam: CU(170), draw: (ctx, t) => sam(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'shout', sweat: 1 } }, 170) },
      mu1: { set: 'hospital', cam: [[300, 760, 1.4], [300, 750, 1.55]], draw: (ctx, t) => { sam(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'o', sweat: 1 } }, 170); mum(ctx, t, { arms: 'point', flip: true, face: { eyes: 'half', mouth: 'flat' } }, 420); } },
      s3: { set: 'hospital', cam: [[300, 760, 1.6], [300, 750, 1.8]], shake: V('s3', 'Ow'), draw: (ctx, t) => { sam(ctx, t, { arms: 'hold', squash: 0.94, face: { eyes: 'wide', mouth: 'shout', sweat: 1, tears: 1 } }, 200); mum(ctx, t, { arms: 'hold', flip: true, face: { eyes: 'half', mouth: 'smirk' } }, 420); },
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'CRACK!', 360, 430, popU(t, V('s3', 'Ow'), 0.25), '#ff6a7a') },
      doc2: { set: 'hospital', cam: CU(640, 700), draw: (ctx, t) => doc(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'happy', mouth: 'grin' } }, 640),
        over: (ctx, W, H_, t) => { for (let i = 0; i < 7; i++) { const u = t - V('doc2', 'girl') - i * 0.1; if (u > 0) FX.heart(ctx, 100 + i * 85, 760 - u * 150, 46 * popU(t, V('doc2', 'girl') + i * 0.1, 0.3), 0); } } },
      mu2: { set: 'hospital', cam: [[470, 740, 1.5], [470, 730, 1.7]], draw: (ctx, t) => { bedMaya(ctx, t, { arms: 'down', face: { eyes: 'happy', mouth: 'smile', tears: 1 } }); mum(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'closed', mouth: 'smile', tears: 1 } }, 600); } },
      n3: { set: 'hospital', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { sam(ctx, t, { arms: 'cheeks', face: { eyes: 'sad', mouth: 'frown', tears: 1 } }, 170); bedMaya(ctx, t, { arms: 'down', face: { eyes: 'happy', mouth: 'smile' } }); mum(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'half', mouth: 'smirk' } }, 620); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n1', 'n2', 'n3'], sound: (k, { V, first }) => { k.play('impact', V('s3', 'Ow'), { gain: 0.4 }); COUCH.sounds.heart(k, V('doc2', 'girl'), 5); k.play('stamp', first('n3'), { gain: 0.45 }); } });
