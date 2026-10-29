  // ==================== Superhero problems: sued ====================
  makeComedy({
    badge: 'SUPERHERO PROBLEMS', badgeCol: '#2a2a3a',
    captions: { say: { 'one million dollars': '$1,000,000', 'three hundred percent': '300%' }, keys: { 'spider-bro': 'r', webbed: 'y', sued: 'r', cried: 'b', emotional: 'o', sticky: 'y', 'bat-guy': 'y', money: 'g', guilty: 'r', million: 'r', pay: 'r', robber: 'o', getaway: 'r', crime: 'r', thrilled: 'g', villain: 'r' } },
    beats: ({ V }) => {
      const SB = (ex) => ['spiderBro', 0.8, 0.3, -0.3, ex], RB = (ex) => ['robber', -0.6, -0.4, 0.2, ex];
      const web = (S, x, y, z) => { for (let i = 0; i < 5; i++) S.box((p) => add(rotZ(p, -0.9 + i * 0.45), [x, y, z + 0.25]), 0.5, 0.012, 0.012, [245, 245, 250], { bevel: 0.2 }); };
      return {
        hook: { set: 'street', cam: 'wide', props: (S, t) => { if (t > V('hook', 'webbed')) web(S, -0.6, 1.3, -0.4); }, flash: [V('hook', 'sued')],
          cast: [RB((t) => ({ hold: 'bag', arms: t > V('hook', 'webbed') ? [2.6, 2.6] : [0.15, 1.0], eyes: 'wide', mouth: 'o' })), SB({ arms: [0.15, 2.2], mouth: 'grin' })],
          tags: [[-0.6, 2.5, -0.4, 'WEBBED', V('hook', 'webbed'), 'yellow'], [0, 0.35, 0.9, 'SUED', V('hook', 'sued'), 'red']] },
        court: { set: 'court', cam: 'mid', cast: [RB({ x: -0.5, z: 0.3, rot: 0.3, mouth: 'open', eyes: 'closed', sweat: true, arms: [2.4, 0.4] }), ['judge', 0, -1.5, 0, { hold: 'gavel' }]],
          tags: [[-0.5, 2.5, -0.3, 'EMOTIONAL DAMAGE', V('court', 'emotional'), 'orange', 1.1], [-0.5, 0.35, 0.8, 'STICKY TROUSERS', V('court', 'sticky'), 'yellow', 1.1]], sfx: [['hurt', V('court', 'cried'), { gain: 0.4 }]] },
        lawyer: { set: 'court', cam: 'mid', cast: [['batGuy', -0.4, 0.2, 0.3, { hold: 'briefcase', mouth: 'grin', arms: [0.15, 1.0] }], RB({ x: 0.6, z: 0.2, rot: -0.3, mouth: 'grin' })],
          tags: [[-0.4, 2.5, -0.3, 'LAWYER', V('lawyer', 'lawyer'), 'yellow'], [0, 0.35, 0.8, 'NEEDED THE MONEY', V('lawyer', 'money'), 'green', 1.1]], sfx: [['coin', V('lawyer', 'money'), { gain: 0.5 }]] },
        verdict: { set: 'court', cam: 'low', shake: V('verdict', 'guilty'), cast: [['judge', 0, -1.5, 0, (t) => ({ hold: 'gavel', arms: [0.15, t > V('verdict', 'guilty') ? 2.4 : 1.2], mouth: 'flat' })], SB({ x: 0.7, z: 0.4, eyes: 'wide', mouth: 'o' })],
          tags: [[0, 2.6, -1.4, 'GUILTY', V('verdict', 'guilty'), 'red'], [0, 0.35, 0.9, '$1,000,000', V('verdict', 'million'), 'red']], sfx: [['stamp', V('verdict', 'guilty'), { gain: 0.6 }]] },
        twist: { set: 'bank', opt: { sign: 'BANK' }, cam: 'wide', props: (S, t) => S.box((p) => add(p, [0.3, 2.8, 0]), 0.01, 1.2, 0.01, [245, 245, 250], { bevel: 0.1 }),
          cast: [SB((t) => ({ x: H.lerp(-0.4, 2.6, H.clamp((t - V('twist', 'getaway')) / 1.5)), bob: 0.6 + Math.sin(t * 4) * 0.1, arms: [2.8, 0.15], mouth: 'frown' })), RB((t) => ({ x: H.lerp(-0.6, 2.8, H.clamp((t - V('twist', 'getaway')) / 1.5)), z: 0.3, bob: 0.4, hold: 'bag', mouth: 'grin', arms: [0.15, 2.4] }))],
          tags: [[0, 2.6, -0.6, "CAN'T PAY", V('twist', 'pay'), 'red'], [0, 0.35, 1.0, 'GETAWAY RIDE', V('twist', 'getaway'), 'orange', 1.1]], sfx: [['whoosh', V('twist', 'ride'), { dur: 0.6, gain: 0.5 }]] },
        punch: { set: 'city', opt: { night: 1 }, cam: 'mid', cast: [['batGuy', -0.6, 0.2, 0.3, { hold: 'briefcase', mouth: 'grin', shades: true }], ['judge', 0.6, 0.2, -0.3, { hold: 'gavel', mouth: 'grin', arms: [2.4, 2.4] }]],
          tags: [[0, 2.6, -0.5, 'CRIME +300%', V('punch', 'crime'), 'red'], [0, 0.35, 0.9, 'LAWYERS: THRILLED', V('punch', 'thrilled'), 'green', 1.1]] },
        cta: { set: 'court', cam: 'mid', cast: [SB({ x: -0.6, mouth: 'frown', arms: [0.15, 0.15] }), RB({ x: 0.6, z: 0.2, mouth: 'grin', hold: 'bag' })], tags: [[0, 0.35, 0.8, 'REAL VILLAIN?', V('cta', 'villain'), 'red']] },
      };
    },
  });
