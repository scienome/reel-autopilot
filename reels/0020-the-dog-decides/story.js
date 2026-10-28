  // ==================== 0020 "The dog decides." ====================
  const plate = (S) => { S.cyl((p) => add(p, [0, 0.47, 0.25]), 0.16, 0.015, [250, 250, 250], 16); S.ball([0.05, 0.49, 0.28], [0.03, 0.01, 0.03], [240, 200, 220]); };
  const DOG = (x, z, yaw = 0, wag = 0) => [{ kind: 'dog', x, z, yaw, wag }];
  const MOM = (o = {}) => ({ who: 'mil', x: 1.9, z: -0.3, sit: false, yaw: -0.5, arms: 'clasp', ...o });
  makeCouch({
    keys: ['birthday', 'cake', 'whole', 'blames', 'dog', 'decide', 'nothing', 'kitchen', 'mother', 'frosting', 'hour'],
    shots: ({ V }) => ({
      hook: { cam: 'wide', he: { arms: 'shrug', face: { eyes: 'wide', mouth: 'o' } }, she: { arms: 'head', face: { mouth: 'open', brows: 0.8 } }, props: plate, pets: DOG(0.1, 0.75, 0.3),
        fx: [{ k: 'card', text: 'HAPPY BIRTHDAY (CAKE: GONE)', at: V('hook', 'birthday'), y: 990, fill: '#2a1a3a', px: 34 }] },
      accuse: { cam: 'two', he: { arms: 'reach', face: { mouth: 'open', brows: -0.7 } }, she: { arms: 'reach', face: { mouth: 'open', brows: -0.8 } }, nope: V('accuse', 'blames', 2) },
      judge: { cam: [[0.1, 0.8, 1.6], [0.1, 0.4, 0.6], [0.1, 0.78, 1.35], [0.1, 0.42, 0.6]], pets: (t) => DOG(0.1, 0.6, 0.0, t * 9), fx: [{ k: 'stamp', text: 'THE JUDGE', x: 360, y: 1000, at: V('judge', 'dog'), col: '#ffd23f' }] },
      him: { cam: 'him', he: { arms: 'clasp', face: { mouth: 'flat', eyes: 'wide', brows: 0.5 } }, pets: DOG(-0.55, 0.15, 2.6), fx: [{ k: 'ring', who: 'he', at: V('him', 'Nothing'), mark: 'tick' }] },
      her: { cam: 'her', she: { arms: 'clasp', face: { mouth: 'flat', eyes: 'wide', brows: 0.5 } }, pets: DOG(0.55, 0.15, 0.6), fx: [{ k: 'ring', who: 'she', at: V('her', 'Nothing'), mark: 'tick' }] },
      walk: { set: 'kitchen', cam: 'wide', he: { hide: true }, she: { hide: true }, pets: (t, u) => DOG(-1.2 + 2.2 * u, 0.5, 0, t * 9), fx: [{ k: 'q', x: 360, y: 640, at: V('walk', 'Straight') }] },
      twist: { set: 'kitchen', cam: 'on', on: [1.2, 1.4, 0.2], he: { hide: true }, she: { hide: true }, extras: [MOM({ x: 1.2, z: 0.2, yaw: 0, arms: 'hold', face: { mouth: 'o', eyes: 'wide', brows: 0.7, blush: 0.6 } })],
        pets: DOG(0.8, 0.6, 0.4), twist: V('twist', 'Frosting'), props: (S) => S.ball([1.2, 1.43, 0.48], [0.035, 0.02, 0.02], [250, 240, 245]),
        fx: [{ k: 'stamp', text: 'GUILTY', x: 360, y: 1010, at: V('twist', 'Frosting'), col: '#ff4a4a', rot: -0.1 }] },
      close: { set: 'kitchen', cam: 'wide', he: { arms: 'head', face: { mouth: 'open', brows: 0.8 } }, she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.6, brows: -0.8 } }, extras: [MOM({ x: 0, z: 0.4, arms: 'shrug', face: { mouth: 'smile', lids: 0.3 } })], pets: DOG(1.4, 0.5, -0.4),
        fx: [{ k: 'card', text: 'VISIT: 1 HOUR. CAKE: 0', at: V('close', 'hour'), y: 1000, fill: '#5a1020' }] },
    }),
  });
