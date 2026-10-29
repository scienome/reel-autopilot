  // ==================== World leaders in bricks: musical chairs ====================
  makeComedy({
    badge: 'WORLD LEADERS IN BRICKS', badgeCol: '#c8282e',
    captions: { say: { five: '5' }, keys: { five: 'y', musical: 'o', chairs: 'y', chair: 'y', earth: 'b', trump: 'o', gold: 'y', putin: 'y', removed: 'r', nobody: 'r', kim: 'r', red: 'r', button: 'r', accident: 'r', confetti: 'g', party: 'g', biden: 'b', won: 'g', asleep: 'r', wrong: 'r' } },
    beats: ({ V }) => {
      const chair = (S, x, z, col = [120, 80, 50]) => { S.box((p) => add(p, [x, 0.45, z]), 0.26, 0.04, 0.26, col, { bevel: 0.3 }); S.box((p) => add(p, [x, 0.78, z - 0.24]), 0.26, 0.3, 0.03, col, { bevel: 0.3 }); for (const a of [-0.2, 0.2]) for (const b of [-0.2, 0.2]) S.box((p) => add(p, [x + a, 0.22, z + b]), 0.025, 0.22, 0.025, col, { bevel: 0.2 }); };
      const ring = (t, i, k = 1) => { const a = t * 0.9 * k + i * (TAU / 4); return { x: Math.cos(a) * 1.4, z: Math.sin(a) * 0.8 - 0.2, rot: -a, walk: t * 8 }; };
      const confetti = (S, t, at) => { if (t < at) return; const r = H.rng(9); for (let i = 0; i < 50; i++) { const x = -2.2 + r() * 4.4, y = 3.2 - ((t - at) * 1.2 + r() * 3) % 3.2, z = -1.2 + r() * 2.4; S.box((p) => add(rotY(p, t * 3 + i), [x, y, z]), 0.035, 0.005, 0.025, [[230, 60, 80], [60, 160, 230], [240, 200, 60], [80, 200, 120]][i % 4], { bevel: 0.1 }); } };
      return {
        hook: { set: 'stage', opt: { banner: 'WORLD SUMMIT' }, cam: 'wide', props: (S) => chair(S, 0, -0.2),
          cast: [['trump', 0, 0, 0, (t) => ring(t, 0)], ['putin', 0, 0, 0, (t) => ring(t, 1)], ['kim', 0, 0, 0, (t) => ring(t, 2)], ['obama', 0, 0, 0, (t) => ring(t, 3)]],
          tags: [[0, 2.6, -0.6, '1 CHAIR', V('hook', 'last'), 'yellow'], [0, 0.35, 1.1, 'MUSICAL CHAIRS', V('hook', 'musical'), 'orange', 1.1]] },
        trump: { set: 'palace', cam: 'mid', props: (S) => chair(S, 0.3, 0, [240, 200, 60]), cast: [['trump', -0.5, 0.2, 0.3, { mouth: 'grin', arms: [0.15, 2.2] }]], tags: [[0.3, 0.35, 0.8, 'GOLD', V('trump', 'gold'), 'yellow']], sfx: [['powerup', V('trump', 'gold'), { gain: 0.4 }]] },
        putin: { set: 'stage', opt: { banner: 'WORLD SUMMIT' }, cam: 'mid', props: (S, t) => chair(S, H.lerp(0.4, 1.4, H.clamp((t - V('putin', 'removed')) / 1.0)), 0),
          cast: [['putin', 0, 0, 0, (t) => ({ x: H.lerp(0.4, 1.4, H.clamp((t - V('putin', 'removed')) / 1.0)) - 0.45, mouth: 'flat', eyes: 'angry', walk: t * 6, rot: -1.2 })]], tags: [[0, 0.35, 0.9, 'NOBODY SAW', V('putin', 'nobody'), 'red']] },
        kim: { set: 'stage', opt: { banner: 'WORLD SUMMIT' }, cam: 'low', shake: V('kim', 'button'), props: (S, t) => bigButton(S, 0, 0.3, 0, 1.0, t > V('kim', 'button') ? 1 : 0),
          cast: [['kim', 0, 0, 0, (t) => ({ bob: t > V('kim', 'sat') ? -0.5 : 0, eyes: t > V('kim', 'button') ? 'wide' : 'open', mouth: t > V('kim', 'button') ? 'o' : 'grin', sweat: t > V('kim', 'accident') })]], tags: [[0, 2.4, -0.3, 'BIG RED BUTTON', V('kim', 'red'), 'red', 1.1]], flash: [V('kim', 'button')] },
        twist: { set: 'stage', opt: { banner: 'PARTY TIME' }, cam: 'wide', props: (S, t) => { bigButton(S, 0, 0.3, 0.4, 1.0, 1); confetti(S, t, V('twist', 'confetti') - 0.2); },
          cast: [['trump', -1.4, 0, 0.4, { mouth: 'o', eyes: 'wide', arms: [2.6, 2.6] }], ['putin', -0.6, -0.5, 0.2, { mouth: 'o' }], ['kim', 0.6, -0.5, -0.2, { mouth: 'grin', arms: [2.4, 2.4] }], ['obama', 1.4, 0, -0.4, { mouth: 'grin', arms: [2.0, 2.4] }]],
          tags: [[0, 0.35, 1.1, 'PARTY BUTTON', V('twist', 'party'), 'green', 1.1]], booms: [[0, 1.0, 0.4, V('twist', 'confetti') - 0.2, 0.5]] },
        punch: { set: 'stage', opt: { banner: 'WINNER' }, cam: 'mid', props: (S, t) => { chair(S, 0, 0.1); confetti(S, t, 0); },
          cast: [['biden', 0, 0.1, 0, { bob: -0.45, eyes: 'closed', mouth: 'o', arms: [0.6, 0.6] }]], tags: [[0, 2.4, -0.4, 'WINNER', V('punch', 'won'), 'green'], [0, 0.35, 0.9, 'ZZZ', V('punch', 'asleep'), 'blue']] },
        cta: { set: 'stage', opt: { banner: 'WORLD SUMMIT' }, cam: 'wide', props: (S) => chair(S, 0, -0.2), cast: [['trump', -1.2, 0.2, 0.3, { mouth: 'o' }], ['putin', -0.4, 0.4, 0.1, { mouth: 'flat' }], ['kim', 0.4, 0.4, -0.1, { mouth: 'grin' }], ['obama', 1.2, 0.2, -0.3, { mouth: 'smile' }]],
          tags: [[0, 0.35, 1.1, 'WRONG ANSWERS ONLY', V('cta', 'wrong'), 'red', 1.2]] },
      };
    },
  });
