  // ==================== World leaders in bricks: the elevator ====================
  makeComedy({
    badge: 'WORLD LEADERS IN BRICKS', badgeCol: '#c8282e',
    captions: { say: {}, keys: { trump: 'o', putin: 'y', kim: 'r', stuck: 'r', elevator: 'y', every: 'o', twice: 'r', apologised: 'y', missile: 'r', opened: 'g', ground: 'y', whole: 'r', 'out': 'r', order: 'r', three: 'y', nobody: 'r' } },
    beats: ({ V }) => {
      const box = (S) => { S.box((p) => add(p, [0, 1.4, -1.0]), 1.6, 1.4, 0.05, [170, 160, 140], { bevel: 0.05 }); for (const x of [-1.6, 1.6]) S.box((p) => add(p, [x, 1.4, 0]), 0.05, 1.4, 1.0, [150, 140, 120], { bevel: 0.05 });
        plate(S, 1.5, 1.4, 0.2, 0.22, 0.6, (c, w, h) => { c.fillStyle = '#2a2a30'; c.fillRect(0, 0, w, h); for (let i = 0; i < 12; i++) { c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w * (i % 2 ? 0.68 : 0.32), h * (0.08 + Math.floor(i / 2) * 0.15), w * 0.12, 0, TAU); c.fill(); } }, [60, 60, 66], -Math.PI / 2); };
      const T = (ex) => ['trump', -0.9, 0, 0.3, ex], P = (ex) => ['putin', 0, -0.3, 0, ex], K = (ex) => ['kim', 0.9, 0, -0.3, ex];
      const soot = (t) => t > V('b3', 'missile') + 0.3 ? { facePaint: (c, w, h) => { c.fillStyle = 'rgba(30,30,30,0.55)'; c.fillRect(0, h * 0.5, w, h * 0.5); } } : {};
      return {
        hook: { set: 'office', opt: { desk: false }, cam: 'wide', shake: 0.3, props: box, cast: [T({ mouth: 'o' }), P({ eyes: 'wide' }), K({ mouth: 'o' })], tags: [[0, 0.35, 0.8, 'STUCK', V('hook', 'stuck'), 'red']] },
        b1: { set: 'office', opt: { desk: false }, cam: 'mid', props: box, cast: [T((t) => ({ x: 1.0, rot: -1.2, arms: [0.15, 1.6 + Math.sin(t * 20) * 0.3], mouth: 'open' })), P({ mouth: 'flat', brows: 'angry' }), K({ x: -0.9, rot: 0.3, mouth: 'frown' })],
          tags: [[1.2, 2.45, -0.3, 'ALL OF THEM', V('b1', 'every'), 'orange'], [0, 0.35, 0.8, 'TWICE', V('b1', 'twice'), 'red']], sfx: [['blip', V('b1', 'every'), { gain: 0.4 }], ['blip', V('b1', 'twice'), { gain: 0.4 }]] },
        b2: { set: 'office', opt: { desk: false }, cam: 'close', props: box, cast: [P({ rot: 0, z: -0.4, mouth: 'flat', brows: 'angry', eyes: 'angry' })], tags: [[0, 0.5, 0.6, 'DOOR: SORRY', V('b2', 'apologised'), 'yellow']] },
        b3: { set: 'office', opt: { desk: false }, cam: 'mid', shake: V('b3', 'missile') + 0.3, props: (S, t) => { box(S); if (t < V('b3', 'missile') + 0.3) missile(S, 0.9, 1.5, 0.3, 0.25, -0.3, t > V('b3', 'missile') ? 1 : 0); },
          cast: [T((t) => Object.assign({ mouth: 'o', eyes: 'wide' }, soot(t))), P((t) => Object.assign({ mouth: 'flat' }, soot(t))), K((t) => Object.assign({ mouth: 'grin', arms: [0.15, 1.6] }, soot(t)))],
          booms: [[0.3, 2.0, -0.6, V('b3', 'missile') + 0.3, 0.8]], tags: [[0.9, 2.45, -0.3, 'TINY MISSILE', V('b3', 'tiny'), 'red']] },
        twist: { set: 'office', opt: { desk: false }, cam: 'pull', props: (S, t, u) => { S.box((p) => add(p, [-1.2 - u * 0.8, 1.4, 1.1]), 0.8, 1.4, 0.04, [180, 180, 186], { bevel: 0.05 }); S.box((p) => add(p, [1.2 + u * 0.8, 1.4, 1.1]), 0.8, 1.4, 0.04, [180, 180, 186], { bevel: 0.05 }); },
          cast: [T(soot(99)), P(soot(99)), K(soot(99))].map((c) => [c[0], c[1], c[2], c[3], Object.assign({ eyes: 'wide', mouth: 'o' }, c[4])]),
          tags: [[0, 2.5, -0.6, 'GROUND FLOOR', V('twist', 'ground'), 'yellow', 1.1], [0, 0.35, 1.0, 'THE WHOLE TIME', V('twist', 'whole'), 'red', 1.1]] },
        punch: { set: 'office', opt: { desk: false }, cam: 'mid', props: (S) => plate(S, 0, 1.6, -0.9, 1.1, 0.7, (c, w, h) => { c.fillStyle = '#fff6a8'; c.fillRect(0, 0, w, h); c.fillStyle = '#c82020'; c.textAlign = 'center'; c.font = FONT(900, h * 0.17); c.fillText('OUT OF ORDER', w / 2, h * 0.3); c.fillText('НЕ РАБОТАЕТ', w / 2, h * 0.58); c.fillText('고장', w / 2, h * 0.86); }),
          cast: [T({ x: -1.2, mouth: 'o', arms: [2.6, 0.15] }), K({ x: 1.2, mouth: 'frown' })], tags: [[0, 0.35, 0.8, 'NOBODY READ IT', V('punch', 'nobody'), 'red', 1.1]] },
        cta: { set: 'stage', opt: { banner: 'LOCK THEM IN' }, cam: 'wide', props: box, cast: [T({ mouth: 'o' }), P({ mouth: 'flat' }), K({ mouth: 'frown' })], tags: [[0, 0.35, 0.8, '3 NAMES', V('cta', 'three'), 'yellow']] },
      };
    },
  });
