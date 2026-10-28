  // ==================== Heists gone wrong: the Illuminati's bank ====================
  makeComedy({
    badge: 'HEISTS GONE WRONG', badgeCol: '#c8781a',
    captions: { say: {}, keys: { wrong: 'r', illuminati: 'y', perfect: 'g', zero: 'r', money: 'o', eye: 'y', everything: 'r', passwords: 'r', search: 'r', history: 'r', job: 'g', world: 'y', badly: 'r' } },
    beats: ({ V }) => {
      const R1 = (ex) => ['robber', -0.6, 0.2, 0.3, ex], R2 = (ex) => ['robber', 0.6, 0.2, -0.3, Object.assign({ balaclava: [60, 30, 30] }, ex)];
      return {
        hook: { set: 'bank', opt: { sign: 'BANK 👁' }, cam: 'wide',
          cast: [R1((t) => ({ walk: t * 7, x: H.lerp(-2.2, -0.6, H.clamp(t / 1.5)) })), R2((t) => ({ walk: t * 7, x: H.lerp(-1.2, 0.6, H.clamp(t / 1.5)), hold: 'gun' }))],
          tags: [[0, 0.35, 0.6, 'WRONG BANK', V('hook', 'wrong'), 'red'], [0, 2.45, -0.6, 'ILLUMINATI', V('hook', "illuminati's"), 'yellow']], flash: [V('hook', "illuminati's")] },
        plan: { set: 'bank', cam: 'mid',
          cast: [R1({ arms: [1.2, 1.2], mouth: 'grin' }), R2({ hold: 'bag', arms: [0.15, 1.0], mouth: 'grin' })],
          tags: [[-0.8, 2.45, -0.4, 'MASKS ✓', V('plan', 'masks'), 'green'], [0.8, 2.45, -0.4, 'BAGS ✓', V('plan', 'bags'), 'green'], [0, 0.35, 0.6, 'BRAIN CELLS: 0', V('plan', 'zero'), 'red']] },
        vault: { set: 'lair', opt: { eye: 0, table: false }, cam: 'wide',
          cast: [R1({ x: -0.9, z: 0.6, rot: Math.PI, arms: [0.6, 0.6] }), R2({ x: 0.9, z: 0.6, rot: Math.PI, hold: 'bag', arms: [0.15, 0.6] })],
          tags: [[0, 0.35, 0.8, '$0', V('vault', 'money'), 'red']], sfx: [['riser', V('vault', 'eye') - 0.3, { dur: 0.5, gain: 0.5 }]] },
        eye: { set: 'lair', opt: { table: false }, cam: [[0, 1.6, 6.5], [0, 2.4, -2], [0, 1.8, 5.2], [0, 2.6, -2]],
          props: () => {}, over: (ctx, W, H_, t) => {}, cast: [R1({ x: -0.9, z: 0.8, rot: Math.PI }), R2({ x: 0.9, z: 0.8, rot: Math.PI })],
          tags: [[-1.2, 0.9, 0.2, 'NAMES', V('eye', 'names'), 'yellow'], [0, 0.5, 0.2, 'PASSWORDS', V('eye', 'passwords'), 'orange'], [1.2, 0.9, 0.2, 'SEARCH HISTORY', V('eye', 'search'), 'red']], sfx: [['glitch', V('eye', 'search'), { gain: 0.6 }]] },
        twist: { set: 'lair', cam: 'mid',
          cast: [['illuminati', 0, -0.6, 0, (t) => ({ hold: t > V('twist', 'job') ? 'briefcase' : null, arms: [0.15, t > V('twist', 'job') ? 1.0 : 0.15] })], R1({ x: -1.0, z: 0.4, rot: 0.6, eyes: 'wide', mouth: 'o' }), R2({ x: 1.0, z: 0.4, rot: -0.6, eyes: 'wide', mouth: 'o' })],
          tags: [[0, 2.45, -0.6, 'YOU\'RE HIRED', V('twist', 'job'), 'green']], sfx: [['success', V('twist', 'job'), { f: 'C6', gain: 0.5 }]] },
        punch: { set: 'office', cam: 'mid', shake: V('punch', 'badly'),
          cast: [['illuminati', -0.6, -1.1, 0.2, { balaclava: [30, 30, 36], hold: 'phone', arms: [0.15, 1.8], mouth: 'grin' }], ['illuminati', 0.6, -1.1, -0.2, { balaclava: [60, 30, 30], hold: 'remote', mouth: 'grin' }]],
          booms: [[1.6, 1.5, -2.0, V('punch', 'badly'), 1.0]],
          tags: [[0, 0.35, 0.6, 'RUNNING THE WORLD', V('punch', 'world'), 'yellow'], [0, 2.45, -0.6, 'BADLY', V('punch', 'badly'), 'red']] },
        cta: { set: 'lair', cam: 'mid', cast: [['illuminati', 0, 0, 0, { balaclava: [30, 30, 36], arms: [2.3, 2.3], mouth: 'grin' }]], tags: [[0, 0.35, 0.6, 'EXPLAINS A LOT', V('cta', 'explains'), 'yellow']] },
      };
    },
  });
