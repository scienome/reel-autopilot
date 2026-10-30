  // ==================== couch sitcom e011 "The Wedding" (callback to e001) ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const DOC = { top: '#f4f4f6', top2: '#d8d8de', outfit: 'suit', tie: '#3a6ad0' }, GOWN = { outfit: 'gown', top: '#fbfbff', top2: '#dfe4ee', veil: true };
    const doc = (ctx, t, o) => char(ctx, 'boss', 360, 1090, 0.72, t, Object.assign({ style: DOC }, o), X);
    const couple = (ctx, t, so, mo) => { sam(ctx, t, Object.assign({ style: { outfit: 'suit', top: '#2e3340', top2: '#22262f', tie: '#c0283a' } }, so), 230); maya(ctx, t, Object.assign({ style: GOWN }, mo), 490); };
    const talkDoc = (t, b) => ({ face: { eyes: 'open', mouth: 'smile', talk: t > first(b) - 0.05 && t < first(b) + 2.2 } });
    return {
      n1: { set: 'hospital', cam: WIDE, draw: (ctx, t) => { doc(ctx, t, { arms: 'hold', face: { mouth: 'smile' } }); couple(ctx, t, { arms: 'down', face: { eyes: 'happy', mouth: 'grin' } }, { arms: 'down', face: { eyes: 'happy', mouth: 'smile' } }); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('n1') - 0.1, 'THE WEDDING') },
      doc1: { set: 'hospital', cam: CU(360, 690), draw: (ctx, t) => doc(ctx, t, { arms: 'hold', face: { eyes: 'open', mouth: 'smile' } }) },
      mu1: { set: 'hospital', cam: CU(620), shake: first('mu1'), draw: (ctx, t) => mum(ctx, t, { arms: 'up', face: { eyes: 'half', mouth: 'flat' } }, 620) },
      s1: { set: 'hospital', cam: CU(230), draw: (ctx, t) => sam(ctx, t, { style: { outfit: 'suit', top: '#2e3340', top2: '#22262f', tie: '#c0283a' }, arms: 'cheeks', squash: 1 + 0.1 * pulse(t, first('s1'), 0.3), face: { eyes: 'wide', mouth: 'shout', brows: 1, sweat: 1 } }, 230) },
      mu2: { set: 'hospital', cam: CU(620), draw: (ctx, t) => mum(ctx, t, { arms: 'point', flip: true, face: { eyes: 'half', mouth: 'flat' } }, 620) },
      doc2: { set: 'hospital', cam: WIDE, draw: (ctx, t) => { doc(ctx, t, { arms: t > V('doc2', 'married') - 0.2 ? 'up' : 'hold', face: { eyes: 'open', mouth: 'smile' } }); couple(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); } },
      m1: { set: 'hospital', cam: [[360, 760, 1.2], [360, 750, 1.3]], draw: (ctx, t) => couple(ctx, t, { arms: 'up', bob: -20 * Math.abs(Math.sin(t * 9)), face: { eyes: 'happy', mouth: 'grin' } }, { arms: 'up', bob: -20 * Math.abs(Math.sin(t * 9 + 1)), face: { eyes: 'happy', mouth: 'grin', tears: 1 } }),
        over: (ctx, W, H_, t) => { for (let i = 0; i < 7; i++) { const u = t - first('m1') - i * 0.1; if (u > 0) FX.heart(ctx, 120 + i * 80, 760 - u * 150, 46 * popU(t, first('m1') + i * 0.1, 0.3), Math.sin(u * 3 + i) * 0.2); } } },
      s2: { set: 'hospital', cam: CU(230), draw: (ctx, t) => sam(ctx, t, { style: { outfit: 'suit', top: '#2e3340', top2: '#22262f', tie: '#c0283a' }, arms: 'shrug', face: { eyes: 'wide', mouth: 'o', sweat: 1 } }, 230) },
      mu3: { set: 'hospital', cam: [[620, 760, 2.1], [620, 760, 2.5]], shake: V('mu3', 'Crunchy'), draw: (ctx, t) => mum(ctx, t, { arms: 'hold', hold: t < V('mu3', 'Mm') ? 'doughnut' : null, squash: 1 - 0.06 * pulse(t, V('mu3', 'Crunchy'), 0.25), face: { eyes: 'closed', mouth: 'chew' } }, 620),
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'CRUNCH!', 360, 960, popU(t, V('mu3', 'Crunchy'), 0.25)) },
      n3: { set: 'hospital', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { couple(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }, { arms: 'hips', face: { eyes: 'half', mouth: 'flat' } }); mum(ctx, t, { arms: 'phone', face: { eyes: 'half', mouth: 'smirk' } }, 640); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n1', 'n3'], sound: (k, { V, first }) => { k.play('thud', first('mu1'), { gain: 0.4 }); COUCH.sounds.heart(k, first('m1'), 5); k.play('impact', V('mu3', 'Crunchy'), { gain: 0.5 }); k.play('stamp', first('n3'), { gain: 0.45 }); } });
