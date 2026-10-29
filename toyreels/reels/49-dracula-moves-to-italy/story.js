  // ==================== Monster problems: Dracula in Italy ====================
  makeComedy({
    badge: 'MONSTER PROBLEMS', badgeCol: '#6a1a2a',
    captions: { say: {}, keys: { dracula: 'r', italy: 'g', worst: 'r', garlic: 'y', coffee: 'o', grandma: 'y', spoon: 'o', bite: 'r', bit: 'r', back: 'r', pizzeria: 'g', zero: 'r', review: 'y', star: 'y', mum: 'o', pineapple: 'y' } },
    beats: ({ V }) => {
      const DR = (ex) => ['dracula', 0, 0.2, 0, ex];
      const nonna = (x, z, rot, ex) => ['devil', x, z, rot, Object.assign({ hat: null, horns: false, skin: [230, 196, 170], hair: 'bun', hairCol: [210, 210, 216], robe: [40, 40, 50], shirt: [40, 40, 50], hold: 'wand', mouth: 'frown', brows: 'angry', facePaint: null, tail: false }, ex)];
      const garlic = (S, x, y, z) => { S.cyl((p) => add(p, [x, y, z]), 0.08, 0.07, [245, 240, 225], 10); S.box((p) => add(p, [x, y + 0.1, z]), 0.015, 0.04, 0.015, [200, 220, 150], { bevel: 0.2 }); };
      return {
        hook: { set: 'street', opt: { signs: ['PIZZA', 'PASTA', 'GELATO', 'GARLIC'] }, cam: 'wide', cast: [DR((t) => ({ hold: 'bag', walk: t * 6, x: H.lerp(-2.0, 0, H.clamp(t / 1.6)), mouth: 'grin' }))], tags: [[0, 2.6, -0.6, 'ITALY', V('hook', 'italy'), 'green'], [0, 0.35, 1.0, 'WORST DECISION', V('hook', 'worst'), 'red', 1.1]] },
        garlic: { set: 'palace', opt: { throne: false }, cam: 'mid', props: (S) => { S.box((p) => add(p, [0, 0.42, 0.5]), 0.8, 0.04, 0.4, [240, 240, 236], { bevel: 0.2 }); garlic(S, -0.4, 0.52, 0.5); garlic(S, 0, 0.52, 0.5); garlic(S, 0.4, 0.52, 0.5); },
          cast: [DR((t) => ({ z: -0.2, eyes: t > V('garlic', 'coffee') ? 'x' : 'wide', mouth: 'open', sweat: true, arms: t > V('garlic', 'coffee') ? [2.6, 2.6] : [0.15, 1.0] }))],
          tags: [[-1.0, 2.5, -0.4, 'BREAD 🧄', V('garlic', 'bread'), 'yellow'], [0, 2.5, -0.4, 'PASTA 🧄', V('garlic', 'pasta'), 'yellow'], [1.0, 2.5, -0.4, 'COFFEE 🧄', V('garlic', 'coffee'), 'red']] },
        nonna: { set: 'street', opt: { signs: ['PIZZA', 'PASTA', 'GELATO', 'NONNA'] }, cam: 'wide', cast: [nonna(-1.3, 0.1, 0.4), nonna(-0.4, -0.3, 0.1), nonna(0.5, -0.3, -0.1), nonna(1.3, 0.1, -0.4), DR({ z: 0.8, rot: Math.PI, mouth: 'o', eyes: 'wide' })],
          tags: [[0, 0.35, 1.1, 'WOODEN SPOONS', V('nonna', 'spoon'), 'orange', 1.1]] },
        chef: { set: 'bank', opt: { sign: 'PIZZA' }, cam: 'mid', shake: V('chef', 'bit'), cast: [DR((t) => ({ x: -0.4, rot: 0.6, mouth: t > V('chef', 'bit') ? 'open' : 'evil', eyes: t > V('chef', 'bit') ? 'x' : 'angry', arms: [1.6, 1.6] })), ['chef', 0.6, 0.2, -0.6, { mouth: 'grin', arms: [0.15, 2.0] }]],
          tags: [[0.6, 2.6, -0.3, 'BIT BACK', V('chef', 'back'), 'red']], sfx: [['hurt', V('chef', 'back'), { gain: 0.6 }]] },
        twist: { set: 'bank', opt: { sign: 'PIZZERIA DRACULA' }, cam: 'wide', props: (S) => { S.cyl((p) => add(p, [0, 0.42, 0.5]), 0.5, 0.03, [230, 170, 80], 20); S.cyl((p) => add(p, [0, 0.45, 0.5]), 0.42, 0.01, [210, 60, 40], 20); },
          cast: [DR({ z: -0.3, hat: 'chef', mouth: 'grin', arms: [2.2, 2.2] })], tags: [[-1.2, 2.5, -0.4, 'NO GARLIC', V('twist', 'garlic'), 'green'], [0, 0.35, 1.0, 'CUSTOMERS: 0', V('twist', 'zero'), 'red']] },
        punch: { set: 'graveyard', cam: 'mid', cast: [DR({ hat: 'chef', hold: 'phone', arms: [0.15, 1.8], mouth: 'frown', brows: 'worried' })], tags: [[0, 0.5, 0.6, '★☆☆☆☆', V('punch', 'star'), 'yellow'], [0, 2.4, -0.3, '- MUM', V('punch', 'mum'), 'orange']] },
        cta: { set: 'street', opt: { signs: ['PIZZA', 'PASTA', 'GELATO', 'GARLIC'] }, cam: 'mid', cast: [DR({ hat: 'chef', mouth: 'grin', arms: [0.15, 2.0] })], tags: [[0, 0.35, 0.9, '🍍 OR 🧄?', V('cta', 'pineapple'), 'yellow']] },
      };
    },
  });
