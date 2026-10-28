  // ==================== The higher powers: Dracula and the energy drinks ====================
  makeComedy({
    badge: 'MONSTER PROBLEMS', badgeCol: '#6a1a2a',
    captions: { say: { 'five hundred': '500', 'four hundred': '400', three: '3', four: '4' }, keys: { dracula: 'r', blood: 'r', worst: 'r', perfect: 'g', energy: 'y', drink: 'y', addict: 'o', heart: 'r', beating: 'r', podcast: 'o', taxes: 'o', sun: 'y', wired: 'o', seconds: 'r' } },
    beats: ({ V }) => {
      const D = (ex) => ['dracula', 0, 0.2, 0, ex];
      const bags = (S, n) => { for (let i = 0; i < n; i++) S.box((p) => add(p, [-0.9 + (i % 7) * 0.3, 0.1 + Math.floor(i / 7) * 0.2, -0.4]), 0.1, 0.1, 0.05, [190, 20, 30], { bevel: 0.5 }); };
      return {
        hook: { set: 'bank', opt: { sign: 'BLOOD BANK' }, cam: 'mid', cast: [D({ hold: 'bag', holdCol: [190, 20, 30], arms: [0.15, 1.0], mouth: 'evil' })],
          tags: [[0, 0.35, 0.6, 'WORST DECISION', V('hook', 'worst'), 'red']] },
        heist: { set: 'bank', opt: { sign: 'BLOOD BANK' }, cam: 'wide', props: (S, t) => bags(S, Math.min(35, Math.floor((t - V('heist', 'five')) * 14))),
          cast: [D({ x: 1.3, rot: -0.4, mouth: 'grin', arms: [1.2, 1.2] })], tags: [[0, 2.45, -0.4, '500 BAGS', V('heist', 'five'), 'red'], [0, 0.35, 0.8, 'PERFECT HEIST', V('heist', 'perfect'), 'green']] },
        drink: { set: 'graveyard', cam: 'mid', cast: [D((t) => ({ hold: 'bag', holdCol: [190, 20, 30], arms: [0.15, 2.0], mouth: t > V('drink', 'energy') ? 'o' : 'grin', eyes: t > V('drink', 'addict') ? 'wide' : 'closed' }))],
          tags: [[0, 2.45, -0.4, '⚡ ENERGY DRINK ADDICTS', V('drink', 'energy'), 'yellow', 1.2]], sfx: [['powerup', V('drink', 'addict'), { gain: 0.5 }]] },
        effect: { set: 'graveyard', cam: 'close', shake: V('effect', 'beating'), cast: [D({ eyes: 'wide', mouth: 'open', sweat: true })],
          tags: [[0, 0.95, 0.4, '♥ BA-DUM', V('effect', 'beating'), 'red']], sfx: [['thud', V('effect', 'beating'), { f: 60, gain: 0.8 }], ['thud', V('effect', 'beating') + 0.35, { f: 60, gain: 0.8 }], ['thud', V('effect', 'beating') + 0.7, { f: 60, gain: 0.8 }]] },
        wired: { set: 'office', cam: 'mid', cast: [D((t) => ({ hold: 'phone', arms: [0.15, 1.8], eyes: 'wide', mouth: 'grin', bob: Math.abs(Math.sin(t * 18)) * 0.05 }))],
          tags: [[-0.8, 2.45, -0.3, 'NO SLEEP: 3 MONTHS', V('wired', 'sleep'), 'orange', 1.1], [0, 0.35, 0.8, '🎙 PODCAST', V('wired', 'podcast'), 'yellow'], [0.8, 2.2, -0.3, 'TAXES × 2', V('wired', 'taxes'), 'green']] },
        twist: { set: 'desert', cam: 'mid',
          cast: [D((t) => ({ eyes: t > V('twist', 'four') + 0.5 ? 'x' : 'wide', mouth: 'grin', bob: Math.abs(Math.sin(t * 18)) * 0.05, hide: t > V('twist', 'seconds') + 0.4 }))],
          booms: [[0, 1.0, 0.2, V('twist', 'seconds') + 0.4, 1.0]], tags: [[0, 2.45, -0.4, '☀ SUNRISE', V('twist', 'sun'), 'yellow'], [0, 0.35, 0.6, '4 SECONDS', V('twist', 'four'), 'red']] },
        cta: { set: 'graveyard', cam: 'mid', props: (S) => S.box((p) => add(p, [0, 0.05, 0.2]), 0.3, 0.05, 0.2, [60, 56, 54], { bevel: 0.5 }), tags: [[0, 2.45, -0.4, 'COFFEE OR ⚡?', V('cta', 'coffee'), 'yellow']] },
      };
    },
  });
