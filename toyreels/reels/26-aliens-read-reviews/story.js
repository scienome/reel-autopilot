  // ==================== What if: aliens read Earth's reviews ====================
  makeComedy({
    badge: 'WHAT IF...?', badgeCol: '#2a8a4a',
    captions: { say: { 'one point two': '1.2', five: '5' }, keys: { aliens: 'g', reviews: 'y', left: 'r', weapons: 'r', rating: 'y', stars: 'r', hot: 'o', loud: 'o', red: 'r', souvenir: 'y', zuckerberg: 'y', robotic: 'r' } },
    beats: ({ V }) => {
      const ufo = (S, x, y, z, s = 1, t = 0) => { const T = (p) => add(mul(p, s), [x, y + Math.sin(t * 2) * 0.05, z]); S.cyl((p) => T(add(p, [0, 0, 0])), 1.1, 0.14, [180, 186, 200], 24); S.cyl((p) => T(add(p, [0, 0.14, 0])), 0.5, 0.3, [120, 220, 160], 18); for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU + t; S.box((p) => T(add(p, [Math.cos(a) * 0.95, 0.04, Math.sin(a) * 0.95])), 0.06, 0.04, 0.06, i % 2 ? [255, 220, 60] : [255, 80, 80], { bevel: 0.4 }); } };
      const A = (x, z, rot, ex = {}) => ['alien', x, z, rot, ex];
      return {
        hook: { set: 'space', cam: 'wide', props: (S, t) => { ufo(S, H.lerp(-2.5, 0, H.clamp(t / 1.2)), 1.6, 0, 1, t); earth(S, [0, -1.6, -2.5], 1.3, t * 0.2); },
          tags: [[0, 2.6, 0, 'REVIEWS: 1.2★', V('hook', 'reviews'), 'red'], [0, 0.35, 0.8, 'LEFT', V('hook', 'left'), 'dark']], sfx: [['whoosh', 0.2, { dur: 1.0, gain: 0.5 }]] },
        land: { set: 'office', opt: { desk: false }, cam: 'wide', props: (S, t) => ufo(S, 0, 2.6, -1.4, 0.9, t),
          cast: [A(-0.8, 0.3, 0.3, { hold: 'gun', holdCol: [80, 220, 120], arms: [0.15, 1.4] }), A(0.8, 0.3, -0.3, { hold: 'gun', holdCol: [80, 220, 120], arms: [0.15, 1.4] })],
          tags: [[0, 0.35, 0.8, 'WEAPONS READY', V('land', 'weapons'), 'red']], sfx: [['powerup', V('land', 'weapons'), { gain: 0.5 }]] },
        reviews: { set: 'office', opt: { desk: false }, cam: 'mid',
          cast: [A(0, 0.2, 0, (t) => ({ hold: 'phone', arms: [0.15, 1.8], mouth: t > V('reviews', 'stars') ? 'o' : 'flat' }))],
          tags: [[0, 2.45, -0.4, 'EARTH ★☆☆☆☆', V('reviews', 'rating'), 'yellow'], [0, 0.35, 0.6, '1.2 STARS', V('reviews', 'stars'), 'red']] },
        quotes: { set: 'office', opt: { desk: false }, cam: 'mid',
          cast: [A(0, 0.2, 0, { hold: 'phone', arms: [0.15, 1.8], mouth: 'frown' })],
          tags: [[-0.8, 2.45, -0.3, '"TOO HOT"', V('quotes', 'hot'), 'orange'], [0.8, 2.2, -0.3, '"TOO LOUD"', V('quotes', 'loud'), 'orange'], [0, 0.35, 0.6, '"BIG RED BUTTONS"', V('quotes', 'red'), 'red', 1.1]], sfx: [['ding', V('quotes', 'hot'), { f: 'C5', gain: 0.3 }], ['ding', V('quotes', 'loud'), { f: 'D5', gain: 0.3 }]] },
        leave: { set: 'office', opt: { desk: false }, cam: 'wide', props: (S, t) => ufo(S, 0, 2.6 + Math.max(0, t - V('leave', 'took')) * 1.2, -1.4, 0.9, t),
          cast: [['zuckerberg', 0, 0.3, 0, (t) => ({ eyes: 'wide', mouth: 'flat', bob: Math.max(0, t - V('leave', 'took')) * 0.9 })]],
          over: (ctx, W, H_, t) => { if (t > V('leave', 'took') - 0.3) { ctx.fillStyle = 'rgba(140,255,170,0.18)'; ctx.beginPath(); ctx.moveTo(W * 0.38, H_ * 0.3); ctx.lineTo(W * 0.62, H_ * 0.3); ctx.lineTo(W * 0.78, H_ * 0.95); ctx.lineTo(W * 0.22, H_ * 0.95); ctx.fill(); } },
          tags: [[0, 2.45, -0.4, 'SOUVENIR', V('leave', 'souvenir'), 'yellow']], sfx: [['riser', V('leave', 'took'), { dur: 1.0, gain: 0.5 }]] },
        twist: { set: 'space', cam: 'mid', props: (S, t) => ufo(S, 0, -0.3, -1.6, 1.0, t),
          cast: [['zuckerberg', 0, 0.2, 0, (t) => ({ eyes: 'wide', mouth: 'flat', arms: [0.15, 0.15] })], A(-0.9, 0.2, 0.4, (t) => ({ mouth: t > V('twist', 'robotic') ? 'frown' : 'smile' })), A(0.9, 0.2, -0.4, (t) => ({ mouth: t > V('twist', 'robotic') ? 'frown' : 'smile', arms: [0.15, t > V('twist', 'returned') ? 1.8 : 0.15] }))],
          tags: [[0, 2.45, -0.4, 'ONE OF US?', V('twist', 'one'), 'green'], [0, 0.35, 0.6, 'TOO ROBOTIC', V('twist', 'robotic'), 'red']] },
        cta: { set: 'space', cam: 'mid', props: (S, t) => earth(S, [0, 1.3, -0.6], 0.9, t * 0.3), tags: [[0, 0.35, 0.6, 'RATE EARTH ★?', V('cta', 'rate'), 'yellow']] },
      };
    },
  });
