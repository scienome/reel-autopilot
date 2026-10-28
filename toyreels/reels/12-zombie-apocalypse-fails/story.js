  // ==================== What if: the zombie apocalypse fails ====================
  makeComedy({
    badge: 'WHAT IF...?', badgeCol: '#2a8a4a',
    captions: { say: { 'four point nine': '4.9', three: '3' }, keys: { zombie: 'g', nobody: 'r', brains: 'r', empty: 'o', phones: 'y', starving: 'r', delivery: 'g', tip: 'r', "didn't": 'r' } },
    beats: ({ V }) => {
      const Z = (x, z, rot, ex = {}) => ['zombie', x, z, rot, (t) => Object.assign({ walk: t * 4, bob: Math.abs(Math.sin(t * 4)) * 0.03 }, typeof ex === 'function' ? ex(t) : ex)];
      return {
        hook: { set: 'street', opt: { night: 1, signs: ['PAWN', 'DONUTS', 'PHARMACY', 'LAWYER', 'PIZZA', 'TACOS'] }, cam: 'wide',
          cast: [Z(-1.2, 0.2, 0.3), Z(0, -0.3, 0), Z(1.2, 0.3, -0.3)],
          tags: [[0, 2.45, -0.4, 'NOBODY NOTICED', V('hook', 'nobody'), 'dark']], sfx: [['riser', V('hook', 'zombie') - 0.4, { dur: 0.5, gain: 0.4 }]] },
        rise: { set: 'graveyard', cam: 'mid',
          cast: [-1.3, -0.1, 1.2].map((x, i) => ['zombie', x, 0.2 - i * 0.2, 0.2 - i * 0.2, (t) => ({ s: 0.9 * popU(t, V('rise', 'crawled') + i * 0.35, 0.5), hide: t < V('rise', 'crawled') + i * 0.35 })]),
          tags: [[0, 0.35, 0.6, 'BRAINS?', V('rise', 'brains'), 'green']], sfx: [['thud', V('rise', 'crawled'), { f: 90, gain: 0.5 }], ['thud', V('rise', 'crawled') + 0.35, { f: 80, gain: 0.5 }], ['thud', V('rise', 'crawled') + 0.7, { f: 70, gain: 0.5 }]] },
        street: { set: 'street', opt: { night: 0.3 }, cam: 'wide', at: [-0.6, 0.6],
          cast: [Z(-1.6, 0.4, 1.2), Z(-0.6, 0.0, 1.2), Z(0.5, 0.5, 1.2), Z(1.5, -0.1, 1.2)],
          tags: [[0, 2.45, -0.5, 'EMPTY', V('street', 'empty'), 'orange']] },
        why: { set: 'office', opt: { desk: false }, cam: 'mid',
          cast: [[null, -0.8, 0, 0.3, { shirt: [200, 120, 160], pants: [60, 60, 70], hair: 'short', hold: 'phone', arms: [0.15, 1.9], look: 0.05, lookY: 0.05 }],
                 [null, 0.8, 0, -0.3, { shirt: [120, 160, 220], pants: [60, 60, 70], hair: 'bob', hold: 'phone', arms: [0.15, 1.9], lookY: 0.05 }]],
          tags: [[0, 2.45, -0.4, 'ORDER NOW', V('why', 'ordering'), 'green']], sfx: [['typing', V('why', 'ordering'), { gain: 0.4 }]] },
        starve: { set: 'street', opt: { night: 0.6 }, cam: 'mid',
          cast: [Z(-0.8, 0.2, 0.3, { walk: 0, bob: 0, arms: [0.1, 0.1], mouth: 'frown', eyes: 'sleepy' }), Z(0.8, 0.2, -0.3, { walk: 0, bob: 0, arms: [0.1, 0.1], mouth: 'frown', eyes: 'sleepy' })],
          tags: [[0, 2.45, -0.4, 'DAY 21', V('starve', 'three'), 'red']] },
        twist: { set: 'street', opt: { night: 0 }, cam: 'mid', at: [0.4, -0.4],
          cast: [Z(-0.7, 0.1, 0.4, { hat: 'cap', hatCol: [230, 90, 40], hold: 'bag', holdCol: [230, 90, 40] }), Z(0.7, 0.3, -0.4, { hat: 'cap', hatCol: [230, 90, 40], hold: 'bag', holdCol: [230, 90, 40] })],
          tags: [[0, 2.45, -0.4, 'NOW HIRING', V('twist', 'job'), 'yellow'], [0, 0.35, 0.6, 'FOOD DELIVERY', V('twist', 'delivery'), 'orange']], sfx: [['ding', V('twist', 'delivery'), { f: 'G5', gain: 0.4 }]] },
        punch: { set: 'street', opt: { night: 0 }, cam: 'mid',
          cast: [Z(-0.6, 0.1, 0.4, { hat: 'cap', hatCol: [230, 90, 40], walk: 0, mouth: 'grin', eyes: 'open' }),
                 [null, 0.7, 0.1, -0.4, (t) => ({ shirt: [150, 150, 160], hair: 'short', hold: 'phone', arms: [0.15, 1.8], mouth: t > V('punch', "didn't") ? 'open' : 'smile', eyes: t > V('punch', "didn't") ? 'wide' : 'open', hide: t > V('punch', 'tip') + 0.4 })]],
          booms: [[0.7, 1.0, 0.1, V('punch', 'tip') + 0.4, 0.8]],
          tags: [[-0.8, 2.45, -0.4, '★ 4.9', V('punch', 'rating'), 'yellow'], [0.7, 0.35, 0.6, '0% TIP', V('punch', "didn't"), 'red']], sfx: [['slap', V('punch', 'tip') + 0.4, { gain: 0.6 }]] },
        cta: { set: 'stage', opt: { banner: 'TIP OR NOT?' }, cam: 'mid',
          cast: [Z(0, 0, 0, { walk: 0, hat: 'cap', hatCol: [230, 90, 40], hold: 'bag', holdCol: [230, 90, 40], arms: [1.0, 0.4], mouth: 'grin' })] },
      };
    },
  });
