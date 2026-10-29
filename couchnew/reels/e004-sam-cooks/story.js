  // ==================== couch sitcom e004 "Sam Cooks" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { sam: 140, maya: 380, mum: 600 }, FIRE = { fire: null, smoke: null };
    const fireAt = () => ({ fire: first('n1') - 0.2, smoke: first('n1'), fireSize: 1 });
    const sam = (ctx, t, o, x = X.sam) => char(ctx, 'sam', x, 1160, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya) => char(ctx, 'maya', x, 1150, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum) => char(ctx, 'mum', x, 1140, 0.8, t, o, X);
    const glow = (ctx, W, H_, t) => { ctx.save(); ctx.globalAlpha = 0.18 + 0.06 * Math.sin(t * 13); ctx.fillStyle = '#ff7a30'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
    const alarm = (ctx, W, H_, t) => { if (t < first('m1') - 0.2 || Math.sin(t * 12) < 0) return; ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#ff2030'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
    return {
      s1: { set: 'kitchen', setOpt: FIRE, cam: [[300, 760, 1.15], [260, 740, 1.4]], draw: (ctx, t) => { mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat' } }); sam(ctx, t, { arms: AT(t, [[0, 'hold'], [V('s1', 'Finally') - 0.2, 'up']]), hold: t < V('s1', 'Finally') - 0.2 ? 'pan' : null, face: { eyes: t > V('s1', 'Finally') ? 'happy' : 'open', mouth: 'grin', look: [1, 0] } }); } },
      n1: { set: 'kitchen', setOpt: fireAt(), cam: [[330, 740, 1.0], [330, 740, 1.08]], shake: first('n1') - 0.2, draw: (ctx, t) => { mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat' } }); sam(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout', sweat: 1, brows: 1 } }); },
        over: (ctx, W, H_, t) => { glow(ctx, W, H_, t); timeCard(ctx, W, H_, t, first('n1') - 0.1, '20 MINUTES LATER'); } },
      mu1: { set: 'kitchen', setOpt: fireAt(), cam: [[600, 740, 1.9], [600, 730, 2.1]], draw: (ctx, t) => mum(ctx, t, { arms: 'hold', hold: 'mug', face: { eyes: 'half', mouth: 'flat', look: [-1, 0] } }), over: glow },
      s2: { set: 'kitchen', setOpt: fireAt(), cam: [[220, 720, 1.5], [220, 710, 1.7]], draw: (ctx, t) => sam(ctx, t, { arms: AT(t, [[0, 'hold'], [V('s2', 'French') - 0.2, 'shrug']]), hold: t < V('s2', 'French') - 0.2 ? 'pan' : null, face: { eyes: 'wide', mouth: 'grin', sweat: 1, brows: 1, look: [1, 0] } }),
        over: (ctx, W, H_, t) => { glow(ctx, W, H_, t); ADULT.sfxWord(ctx, 'OUI OUI!', 360, 440, popU(t, V('s2', 'French'), 0.25), '#7ad0f2', 0.1); } },
      m1: { set: 'kitchen', setOpt: fireAt(), cam: [[380, 740, 1.9], [380, 730, 2.1]], draw: (ctx, t) => maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'flat' } }), over: (ctx, W, H_, t) => { glow(ctx, W, H_, t); alarm(ctx, W, H_, t); } },
      mu2: { set: 'kitchen', setOpt: { smoke: 0 }, cam: [[600, 740, 1.9], [600, 730, 2.2]], draw: (ctx, t) => mum(ctx, t, { arms: 'hold', face: { eyes: 'closed', mouth: t < V('mu2', 'This') - 0.2 ? 'chew' : 'smile', blush: t > V('mu2', 'best') ? 1 : 0 } }) },
      s3: { set: 'kitchen', setOpt: { smoke: 0 }, cam: [[220, 720, 2.0], [220, 710, 2.4]], draw: (ctx, t) => sam(ctx, t, { arms: 'up', bob: -24 * Math.abs(Math.sin(t * 9)), face: { eyes: 'happy', mouth: 'grin', blush: 1, tears: 1 } }, 220),
        over: (ctx, W, H_, t) => { for (let i = 0; i < 5; i++) { const u = t - first('s3') - i * 0.1; if (u > 0) FX.heart(ctx, 200 + i * 80, 700 - u * 160, 48 * popU(t, first('s3') + i * 0.1, 0.3), Math.sin(u * 3 + i) * 0.2); } } },
      mu3: { set: 'kitchen', setOpt: { smoke: 0 }, cam: [[600, 740, 2.1], [600, 730, 2.4]], draw: (ctx, t) => mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }) },
      m2: { set: 'kitchen', setOpt: { smoke: 0 }, cam: [[370, 760, 1.0], [370, 770, 1.06]], draw: (ctx, t) => { mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk' } }); sam(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }); maya(ctx, t, { arms: 'hold', hold: 'box', face: { eyes: 'happy', mouth: 'smile' } }); } },
      n3: { set: 'kitchen', setOpt: { smoke: 0 }, cam: [[370, 770, 1.06], [370, 770, 1.08]], draw: (ctx, t) => { mum(ctx, t, { arms: 'hold', hold: 'box', face: { eyes: 'closed', mouth: 'chew' } }); sam(ctx, t, { arms: 'hold', hold: 'pan', face: { eyes: 'sad', mouth: 'frown' } }); maya(ctx, t, { arms: 'shrug', face: { eyes: 'half', mouth: 'smirk' } }); },
        over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n1', 'n3'], sound: (k, { V, first }) => { k.play('impact', first('n1') - 0.2, { gain: 0.5 }); k.play('sparkle', V('s1', 'Finally'), { gain: 0.3 }); COUCH.sounds.heart(k, first('s3'), 5); COUCH.sounds.twist(k, V('mu3', 'funeral')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
