  // ==================== World leaders in bricks: the summit cook-off ====================
  makeComedy({
    badge: 'WORLD LEADERS IN BRICKS', badgeCol: '#c8282e',
    captions: { say: { 'forty seven': '47', eleven: '11' }, keys: { poisoned: 'r', putin: 'y', kim: 'y', trump: 'y', soup: 'o', noodles: 'o', takeout: 'o', trusted: 'r', swapped: 'o', taster: 'g', fine: 'g', eleven: 'r' } },
    beats: ({ V }) => {
      const table = (S) => S.box((p) => add(p, [0, 0.42, -0.3]), 1.7, 0.04, 0.35, [230, 230, 236], { bevel: 0.3 });
      const bowls = (S, t, k = 0) => [-1.1, 0, 1.1].forEach((x, i) => { const xs = [-1.1, 0, 1.1], j = (i + Math.floor(k)) % 3; S.cyl((p) => add(p, [xs[j], 0.46, -0.3]), 0.14, 0.08, [[200, 60, 40], [240, 200, 80], [240, 240, 236]][i], 14); });
      const P3 = (ex = {}) => [['putin', -1.1, -0.9, 0, ex.p || {}], ['kim', 0, -0.9, 0, ex.k || {}], ['trump', 1.1, -0.9, 0, ex.t || {}]];
      return {
        hook: { set: 'stage', opt: { banner: 'LEADERS COOK-OFF' }, cam: 'wide', props: (S, t) => { table(S); bowls(S, t); },
          cast: P3({ p: { mouth: 'evil' }, k: { mouth: 'grin' }, t: { mouth: 'o' } }),
          tags: [[0, 0.35, 0.8, '☠ 1 POISONED', V('hook', 'poisoned'), 'red']], flash: [V('hook', 'poisoned')] },
        cooks: { set: 'stage', opt: { banner: 'LEADERS COOK-OFF' }, cam: 'wide', props: (S, t) => { table(S); bowls(S, t); },
          cast: P3({ p: { mouth: 'evil', hold: 'sword' }, k: { mouth: 'grin', hold: 'remote' }, t: { hold: 'phone', arms: [0.15, 1.8], mouth: 'o' } }),
          tags: [[-1.1, 0.35, 0.3, 'SOUP', V('cooks', 'soup'), 'orange'], [0, 0.35, 0.3, 'NOODLES', V('cooks', 'noodles'), 'yellow'], [1.1, 0.35, 0.3, 'TAKEOUT', V('cooks', 'takeout'), 'red']] },
        swap: { set: 'stage', opt: { banner: 'LEADERS COOK-OFF' }, cam: 'wide', props: (S, t) => { table(S); bowls(S, t, t > V('swap', 'swapped') ? (t - V('swap', 'swapped')) * 6 : 0); },
          cast: P3({ p: { arms: [1.0, 1.0], eyes: 'angry', mouth: 'flat' }, k: { arms: [1.0, 1.0], eyes: 'angry', mouth: 'flat' }, t: { arms: [1.0, 1.0], eyes: 'angry', mouth: 'flat' } }),
          tags: [[0, 2.45, -0.6, 'SWAPS: 47', V('swap', 'forty'), 'orange']], sfx: [['swish', V('swap', 'swapped'), { gain: 0.5 }], ['swish', V('swap', 'again'), { gain: 0.5 }]] },
        taster: { set: 'stage', opt: { banner: 'LEADERS COOK-OFF' }, cam: 'wide', props: (S, t) => { table(S); if (t < V('taster', 'plate')) bowls(S, t); },
          cast: [...P3({ p: { eyes: 'wide', mouth: 'o' }, k: { eyes: 'wide', mouth: 'o' }, t: { eyes: 'wide', mouth: 'o' } }),
                 [null, 0, 0.5, 0, (t) => ({ x: H.lerp(-2.4, 0, H.clamp((t - V('taster', 'walked') + 0.3) / 1.0)), walk: t < V('taster', 'ate') ? t * 7 : 0, suit: true, tie: [40, 40, 44], hair: 'short', mouth: t > V('taster', 'fine') ? 'grin' : 'open', arms: [0.15, t > V('taster', 'ate') ? 1.6 : 0.2] })]],
          tags: [[0, 0.35, 0.9, 'ALL FINE 👍', V('taster', 'fine'), 'green']], sfx: [['pop', V('taster', 'ate'), { gain: 0.4 }], ['pop', V('taster', 'ate') + 0.3, { gain: 0.4 }], ['pop', V('taster', 'ate') + 0.6, { gain: 0.4 }]] },
        twist: { set: 'stage', opt: { banner: 'LEADERS COOK-OFF' }, cam: 'mid', props: (S) => table(S),
          cast: [[null, 0, 0.5, 0, (t) => ({ suit: true, tie: [40, 40, 44], hair: 'short', mouth: t > V('twist', 'eleven') ? 'open' : 'grin', eyes: t > V('twist', 'minutes') ? 'x' : 'open', hide: t > V('twist', 'minutes') + 0.5 })]],
          booms: [[0, 1.0, 0.5, V('twist', 'minutes') + 0.5, 1.1]],
          tags: [[0.9, 1.9, 0.6, '⏱ 11:00', V('twist', 'eleven'), 'red']], sfx: [['count', V('twist', 'eleven'), { gain: 0.5 }]] },
        cta: { set: 'stage', opt: { banner: 'WHOSE DISH?' }, cam: 'wide', props: (S, t) => { table(S); bowls(S, t); },
          cast: P3({ p: { mouth: 'evil', shades: true }, k: { mouth: 'grin' }, t: { mouth: 'o', hold: 'phone', arms: [0.15, 1.8] } }) },
      };
    },
  });
