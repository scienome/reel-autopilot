  // ==================== couch sitcom e006 "The Dress" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 160, sam: 380, mum: 590 }, GOWN = { outfit: 'gown', top: '#fbfbff', top2: '#dfe4ee', veil: true };
    const sam = (ctx, t, o, x = X.sam) => char(ctx, 'sam', x, 1160, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya) => char(ctx, 'maya', x, 1150, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum) => char(ctx, 'mum', x, 1140, 0.8, t, o, X);
    const reveal = () => V('m1', 'eyes') + 0.2;
    const shine = (ctx, W, H_, t) => { const u = H.clamp((t - reveal()) / 0.5); if (u <= 0) return; ctx.save(); ctx.globalAlpha = 0.35 * u; for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 2 ? '#fff6c8' : '#ffffff'; ctx.beginPath(); ctx.moveTo(590, 640); const a = i * 0.63 + t * 0.4; ctx.lineTo(590 + Math.cos(a) * 900, 640 + Math.sin(a) * 900); ctx.lineTo(590 + Math.cos(a + 0.2) * 900, 640 + Math.sin(a + 0.2) * 900); ctx.fill(); } ctx.restore(); };
    return {
      mu1: { set: 'living', cam: [[480, 760, 1.25], [490, 750, 1.45]], draw: (ctx, t) => { sam(ctx, t, { arms: 'down', face: { eyes: 'open', mouth: 'smile', look: [1, 0] } }, 330); mum(ctx, t, { arms: AT(t, [[0, 'hips'], [V('mu1', 'bad') - 0.2, 'point']]), flip: true, face: { eyes: 'half', mouth: 'flat', look: [-1, 0] } }); } },
      s1: { set: 'living', cam: [[360, 720, 2.0], [360, 710, 2.2]], draw: (ctx, t) => sam(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'grin' } }, 360) },
      s2: { set: 'living', cam: [[380, 760, 1.0], [380, 760, 1.05]], shake: V('s2', 'Lamp'), draw: (ctx, t) => { const k = H.clamp((t - first('s2') + 0.4) / 2.2), x = 120 + 420 * k;
        sam(ctx, t, { walk: t * 8, arms: 'up', lean: Math.sin(t * 5) * 0.12, bob: 30 * pulse(t, V('s2', 'Lamp'), 0.3) + 30 * pulse(t, V('s2', 'lamp', 2), 0.3), face: { eyes: 'closed', mouth: t > V('s2', 'Lamp') ? 'shout' : 'grin', sweat: 1 } }, x); },
        over: (ctx, W, H_, t) => { ADULT.sfxWord(ctx, 'BONK!', 260, 420, popU(t, V('s2', 'Lamp'), 0.2) * (t < V('s2', 'Other') ? 1 : 0)); ADULT.sfxWord(ctx, 'CRASH!', 460, 470, popU(t, V('s2', 'lamp', 2), 0.2), '#ff6a7a', 0.1); } },
      m1: { set: 'living', cam: [[160, 740, 1.9], [160, 730, 2.1]], draw: (ctx, t) => maya(ctx, t, { arms: 'wave', face: { eyes: 'happy', mouth: 'grin' } }) },
      s3: { set: 'living', cam: [[480, 760, 1.15], [480, 750, 1.25]], shake: V('s3', 'MUM'), draw: (ctx, t) => { mum(ctx, t, { style: GOWN, arms: 'hips', face: { eyes: 'happy', mouth: 'grin', blush: 1 } }); sam(ctx, t, { arms: 'cheeks', squash: 1 + 0.12 * pulse(t, V('s3', 'MUM'), 0.3), face: { eyes: 'wide', mouth: 'shout', brows: 1, sweat: 1, look: [1, 0] } }, 330); },
        over: (ctx, W, H_, t) => shine(ctx, W, H_, t) },
      mu2: { set: 'living', cam: [[590, 760, 1.6], [590, 750, 1.8]], draw: (ctx, t) => mum(ctx, t, { style: GOWN, arms: AT(t, [[0, 'hips'], [V('mu2', 'fits') - 0.3, 'up']]), bob: t > V('mu2', 'fits') ? -14 * Math.abs(Math.sin(t * 7)) : 0, face: { eyes: 'half', mouth: 'smile', look: [-1, 0] } }), over: shine },
      m2: { set: 'living', cam: [[160, 740, 2.0], [160, 730, 2.2]], draw: (ctx, t) => maya(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat', look: [1, 0] } }) },
      mu3: { set: 'living', cam: [[590, 750, 1.9], [590, 740, 2.2]], draw: (ctx, t) => mum(ctx, t, { style: GOWN, arms: 'hips', face: { eyes: t > V('mu3', 'old') ? 'closed' : 'half', mouth: 'smirk', look: [-1, 0] } }), over: shine },
      n3: { set: 'living', cam: [[380, 770, 1.0], [380, 770, 1.04]], draw: (ctx, t) => { maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }); sam(ctx, t, { pose: 'kneel', arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }); mum(ctx, t, { style: GOWN, arms: 'up', face: { eyes: 'happy', mouth: 'grin' } }); },
        over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n3'], sound: (k, { V, first }) => { k.play('thud', V('s2', 'Lamp'), { gain: 0.5 }); k.play('impact', V('s2', 'lamp', 2), { gain: 0.5 }); COUCH.sounds.twist(k, V('s3', 'MUM')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
