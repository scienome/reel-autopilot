  // ==================== couch sitcom e005 "The Birthday" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 380, mum: 600 };
    const sam = (ctx, t, o, x = X.sam) => char(ctx, 'sam', x, 1160, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya) => char(ctx, 'maya', x, 1150, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum) => char(ctx, 'mum', x, 1140, 0.8, t, o, X);
    const blow = () => V('m3', 'wish') + 0.4, cake = (t) => (t > blow() ? 'cakeout' : 'cake');
    const party = (ctx, W, H_, t) => { ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = '#1a1040'; ctx.fillRect(0, 0, W, H_); ctx.restore(); if (t < blow()) { const g = ctx.createRadialGradient(360, 760, 20, 360, 760, 520); g.addColorStop(0, 'rgba(255,200,110,0.35)'); g.addColorStop(1, 'rgba(255,200,110,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); } };
    const rain = (ctx, W, H_, t) => { if (t < blow()) return; ctx.save(); ctx.strokeStyle = 'rgba(160,215,255,0.75)'; ctx.lineWidth = 4; for (let i = 0; i < 70; i++) { const x = (i * 97) % W, y = ((t * 1500 + i * 211) % (H_ + 120)) - 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 44); ctx.stroke(); } ctx.restore(); };
    const wet = (t) => (t > blow() ? { tears: 1 } : {});
    return {
      n1: { set: 'living', cam: [[370, 760, 1.0], [370, 770, 1.06]], draw: (ctx, t) => { maya(ctx, t, { pose: 'sit', arms: 'down', face: { eyes: 'half', mouth: 'flat', look: [1, 0] } }, 170); mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk' } }); },
        over: (ctx, W, H_, t) => { party(ctx, W, H_, t); timeCard(ctx, W, H_, t, first('n1') - 0.1, "MAYA'S BIRTHDAY"); } },
      s1: { set: 'living', cam: [[300, 760, 1.15], [300, 750, 1.3]], draw: (ctx, t) => { const k = H.clamp((t - first('s1') + 0.3) / 0.6); maya(ctx, t, { pose: 'sit', arms: 'cheeks', face: { eyes: 'wide', mouth: 'grin', look: [1, 0] } }, 170);
        sam(ctx, t, { walk: k < 1 ? t * 10 : null, arms: 'hold', hold: 'cake', face: { eyes: 'happy', mouth: 'grin', look: [-1, 0] } }, 700 - 300 * H.ease.out(k)); },
        over: (ctx, W, H_, t) => { party(ctx, W, H_, t); if (t > first('s1')) FX.confetti ? FX.confetti(ctx, W, t - first('s1')) : null; } },
      m1: { set: 'living', cam: [[170, 760, 2.0], [170, 750, 2.2]], draw: (ctx, t) => maya(ctx, t, { pose: 'sit', arms: 'cross', face: { eyes: 'half', mouth: 'flat', look: [1, 0] } }, 170), over: party },
      s2: { set: 'living', cam: [[400, 700, 2.3], [400, 690, 2.6]], draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'cake', face: { eyes: 'wide', mouth: 'grin', sweat: 1, brows: 1, look: [-1, 0] } }, 400), over: party },
      mu1: { set: 'living', cam: [[600, 740, 1.9], [600, 730, 2.1]], draw: (ctx, t) => mum(ctx, t, { arms: AT(t, [[0, 'cross'], [V('mu1', 'thirty') - 0.25, 'shrug']]), face: { eyes: 'half', mouth: 'smile', look: [-1, 0] } }), over: party },
      m2: { set: 'living', cam: [[170, 760, 2.1], [170, 750, 2.5]], shake: first('m2'), draw: (ctx, t) => maya(ctx, t, { pose: 'sit', arms: 'cheeks', face: { eyes: 'sad', mouth: 'shout', tears: 1, brows: 1 } }, 170), over: party },
      s3: { set: 'living', cam: [[300, 760, 1.2], [300, 760, 1.3]], draw: (ctx, t) => { maya(ctx, t, { pose: 'sit', arms: 'cross', face: { eyes: 'sad', mouth: 'frown', tears: 1 } }, 170); sam(ctx, t, { arms: 'hold', hold: 'cake', lean: -0.08, face: { eyes: 'wide', mouth: 'grin', sweat: 1, look: [-1, 0] } }, 360); }, over: party },
      m3: { set: 'living', cam: [[270, 760, 1.45], [270, 760, 1.55]], draw: (ctx, t) => { const b = t > blow() - 0.3 && t < blow() + 0.2; maya(ctx, t, { pose: 'sit', lean: b ? 0.1 : 0, arms: 'cross', face: Object.assign({ eyes: 'closed', mouth: b ? 'o' : 'smile' }, wet(t)) }, 170);
        sam(ctx, t, { arms: t > blow() ? 'cheeks' : 'hold', hold: t > blow() ? null : cake(t), face: Object.assign({ eyes: t > blow() ? 'wide' : 'happy', mouth: t > blow() ? 'shout' : 'grin' }, wet(t)) }, 360); },
        over: (ctx, W, H_, t) => { party(ctx, W, H_, t); rain(ctx, W, H_, t); ADULT.sfxWord(ctx, 'SPLASH!', 360, 420, popU(t, blow(), 0.25), '#7ad0f2'); } },
      mu2: { set: 'living', cam: [[600, 740, 1.9], [600, 730, 2.1]], draw: (ctx, t) => mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk', tears: 1, look: [-1, 0] } }), over: (ctx, W, H_, t) => { party(ctx, W, H_, t); rain(ctx, W, H_, t); } },
      s4: { set: 'living', cam: [[400, 700, 2.2], [400, 690, 2.5]], shake: first('s4'), draw: (ctx, t) => sam(ctx, t, { arms: 'shrug', face: { eyes: 'angry', mouth: 'shout', tears: 1, brows: -1 } }, 400), over: (ctx, W, H_, t) => { party(ctx, W, H_, t); rain(ctx, W, H_, t); } },
      n3: { set: 'living', cam: [[370, 770, 1.05], [370, 770, 1.08]], draw: (ctx, t) => { maya(ctx, t, { pose: 'sit', arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown', tears: 1 } }, 170); sam(ctx, t, { arms: 'hold', hold: 'cakeout', face: { eyes: 'sad', mouth: 'frown', tears: 1 } }); mum(ctx, t, { arms: 'hold', hold: 'mug', face: { eyes: 'closed', mouth: 'smile', tears: 1 } }); },
        over: (ctx, W, H_, t) => { party(ctx, W, H_, t); rain(ctx, W, H_, t); partTwo(ctx, W, H_, t, first('n3')); } },
    };
  }, { noSub: ['n1', 'n3'], sound: (k, { V, first }) => { k.play('pop', first('s1') - 0.2, { gain: 0.5 }); COUCH.sounds.twist(k, V('m3', 'wish') + 0.4); k.play('thud', first('s4'), { gain: 0.3 }); k.play('stamp', first('n3'), { gain: 0.45 }); } });
