  // ==================== World leaders in bricks: the Mars race ====================
  makeComedy({
    badge: 'BILLIONAIRE PROBLEMS', badgeCol: '#1a6a8a',
    captions: { say: {}, keys: { musk: 'y', bezos: 'o', zuckerberg: 'b', mars: 'r', planet: 'r', fuel: 'r', wrong: 'r', metaverse: 'b', nobody: 'r', landed: 'g', private: 'r', rent: 'r', lizard: 'g', rocket: 'o', way: 'r' } },
    beats: ({ V }) => {
      const M = (ex) => ['musk', -1.0, 0.2, 0.3, ex], B = (ex) => ['bezos', 0, 0, 0, ex], Z = (ex) => ['zuckerberg', 1.0, 0.2, -0.3, ex];
      const sign = (S) => { S.box((p) => add(p, [0.8, 0.7, -0.4]), 0.04, 0.7, 0.04, [120, 84, 50], { bevel: 0.2 }); plate(S, 0.8, 1.55, -0.38, 0.8, 0.45, (c, w, h) => { c.fillStyle = '#f6efe0'; c.fillRect(0, 0, w, h); c.fillStyle = '#c82020'; c.textAlign = 'center'; c.font = FONT(900, h * 0.2); c.fillText('PRIVATE PROPERTY', w / 2, h * 0.32); c.fillStyle = '#222'; c.fillText('RENT IS DUE', w / 2, h * 0.65); c.font = FONT(700, h * 0.12); c.fillText('- MANAGEMENT 👁', w / 2, h * 0.88); }); };
      return {
        hook: { set: 'base', cam: 'wide', props: (S, t) => { missile(S, -1.6, 1.0, -1.2, 0.9, 0, 0); missile(S, 1.6, 1.0, -1.2, 0.9, 0, 0); }, cast: [M({ mouth: 'grin', arms: [0.15, 2.2] }), B({ mouth: 'grin', shades: true }), Z({ mouth: 'flat', eyes: 'open' })],
          tags: [[0, 2.6, -0.5, 'MARS', V('hook', 'mars'), 'red'], [0, 0.35, 1.0, 'WINNER OWNS IT', V('hook', 'winner'), 'yellow', 1.1]] },
        musk: { set: 'base', cam: 'low', shake: V('musk', 'launched'), props: (S, t) => missile(S, 0, 1.0 + Math.min(0.6, Math.max(0, t - V('musk', 'launched')) * 0.8) - Math.max(0, t - V('musk', 'fuel')) * 1.2, -0.6, 1.0, Math.max(0, t - V('musk', 'fuel')) * 0.8, t > V('musk', 'launched') && t < V('musk', 'fuel') ? 1 : 0),
          cast: [M({ x: -1.2, z: 0.6, eyes: 'wide', mouth: 'o', arms: [2.6, 2.6] })], booms: [[0, 0.4, -0.6, V('musk', 'fuel') + 0.6, 0.8]], tags: [[0, 0.35, 1.0, 'FUEL: 0', V('musk', 'fuel'), 'red']] },
        bezos: { set: 'space', cam: 'mid', props: (S, t) => { missile(S, 0.6, 1.4, -0.4, 0.7, 0.5, 1); S.box((p) => add(p, [-0.8, 1.2, 0]), 0.3, 0.22, 0.25, [190, 150, 100], { bevel: 0.15, paint: (c, w, h) => { c.fillStyle = '#222'; c.font = FONT(900, h * 0.22); c.fillText('NEPTUNE?', w * 0.1, h * 0.55); } }); },
          cast: [B({ x: 0.6, z: 0.2, rot: 0, bob: 0.4, mouth: 'o', eyes: 'wide' })], tags: [[0, 0.35, 0.9, 'WRONG PLANET', V('bezos', 'wrong'), 'red', 1.1]] },
        zuck: { set: 'stage', opt: { banner: 'MARS (VR)', audience: false }, cam: 'mid', cast: [Z({ x: 0, z: 0, rot: 0, mouth: 'smile', arms: [2.2, 2.2], facePaint: (c, w, h) => { c.fillStyle = '#222'; c.fillRect(w * 0.1, h * 0.3, w * 0.8, h * 0.25); } })],
          tags: [[0, 0.35, 0.8, 'VISITORS: 0', V('zuck', 'nobody'), 'red']], sfx: [['blip', V('zuck', 'metaverse'), { gain: 0.4 }]] },
        twist: { set: 'moon', cam: 'mid', props: sign, over: (ctx, W, H_) => { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(230,110,70,0.55)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }, cast: [M({ x: -0.5, z: 0.3, rot: 0.3, mouth: 'o', eyes: 'wide', hold: 'flag' })],
          tags: [[-0.5, 2.6, -0.2, 'LANDED', V('twist', 'landed'), 'green'], [0, 0.35, 1.0, 'RENT DUE', V('twist', 'rent'), 'red']] },
        punch: { set: 'moon', cam: 'wide', props: (S) => { sign(S); missile(S, -0.7, 1.0, -0.6, 0.8, 1.5, 0); }, over: (ctx, W, H_) => { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(230,110,70,0.55)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); },
          cast: [['reptilian', 0.8, 0.3, -0.4, { suit: true, mouth: 'grin', hold: 'briefcase' }], M({ x: -0.5, z: 0.4, rot: 0.2, mouth: 'frown', eyes: 'sleepy' })],
          tags: [[0.8, 2.6, 0, 'LANDLORD', V('punch', 'landlord'), 'green'], [-0.5, 0.35, 1.0, 'SLEEPS IN ROCKET', V('punch', 'sleeps'), 'orange', 1.2]] },
        cta: { set: 'base', cam: 'wide', props: (S) => missile(S, 0, 1.0, -1.2, 0.9, 0, 0), cast: [M({ mouth: 'frown' }), B({ mouth: 'o' }), Z({ mouth: 'flat' })], tags: [[0, 0.35, 1.0, 'ONE WAY', V('cta', 'way'), 'red']] },
      };
    },
  });
