  // ==================== What if...? gravity off ====================
  makeComedy({
    badge: 'WHAT IF...?', badgeCol: '#2a8a4a',
    captions: { say: { five: '5' }, keys: { gravity: 'g', five: 'y', monday: 'o', floated: 'b', coffee: 'o', tied: 'y', chairs: 'y', forgot: 'r', still: 'r', "didn't": 'r', space: 'b', gary: 'y', chair: 'y' } },
    beats: ({ V }) => {
      const fl = (t, at, k = 1) => (t > at ? Math.min(1.2, (t - at) * 0.6) * k + Math.sin(t * 2 + k * 3) * 0.08 : 0);
      const chair = (S, x, z) => { S.box((p) => add(p, [x, 0.45, z]), 0.3, 0.04, 0.3, [80, 80, 90], { bevel: 0.3 }); S.box((p) => add(p, [x, 0.8, z - 0.28]), 0.3, 0.32, 0.03, [80, 80, 90], { bevel: 0.3 }); S.cyl((p) => add(p, [x, 0.22, z]), 0.04, 0.22, [60, 60, 66], 8); };
      const worker = (x, z, rot, at, k, ex) => [null, x, z, rot, (t) => Object.assign({ bob: fl(t, at, k), arms: t > at ? [2.4, 2.0] : [0.15, 0.6], eyes: t > at ? 'wide' : 'open', mouth: t > at ? 'open' : 'flat' }, ex)];
      return {
        hook: { set: 'city', opt: { night: 0 }, cam: 'wide', cast: [worker(-1.0, 0, 0.3, 0.8, 1), worker(0.2, -0.4, 0, 1.0, 1.4, { hair: 'long', hairCol: [200, 150, 60] }), worker(1.2, 0.2, -0.3, 1.2, 0.8, { hold: 'briefcase' })], tags: [[0, 0.35, 1.0, '5 SECONDS', V('hook', 'five'), 'yellow']] },
        m1: { set: 'office', opt: { desk: false }, cam: 'wide', props: (S, t) => { for (let i = 0; i < 8; i++) S.box((p) => add(p, [-1.5 + i * 0.4, 1.0 + fl(t, V('m1', 'floated'), 1 + i * 0.1) + Math.sin(t * 3 + i) * 0.2, 0.3]), 0.05, 0.05, 0.05, [110, 70, 40], { bevel: 0.8 }); },
          cast: [worker(-0.8, 0.2, 0.3, V('m1', 'floated'), 1, { hold: 'phone' }), worker(0.8, 0, -0.3, V('m1', 'floated') + 0.2, 1.3, { suit: true })], tags: [[0, 0.35, 1.0, 'COFFEE EVERYWHERE', V('m1', 'coffee'), 'orange', 1.2]] },
        m2: { set: 'office', opt: { desk: false }, cam: 'mid', props: (S) => { chair(S, -0.6, 0.2); chair(S, 0.6, 0.2); }, cast: [[null, -0.6, 0.2, 0, { bob: -0.45, mouth: 'flat', eyes: 'sleepy', arms: [0.6, 0.6] }], [null, 0.6, 0.2, 0, { bob: -0.45, mouth: 'smile', hair: 'long', hairCol: [60, 40, 30], arms: [0.6, 0.6] }]],
          tags: [[0, 0.35, 0.9, 'TIED TO CHAIRS', V('m2', 'tied'), 'yellow', 1.1]] },
        m3: { set: 'sky', cam: 'low', cast: [[null, 0, 0, 0, (t) => ({ bob: 0.2 + Math.max(0, t - V('m3', 'forgot')) * 1.2, arms: [2.6, 2.6], eyes: 'wide', mouth: 'open', hold: 'briefcase' })]], tags: [[0, 0.35, 0.8, 'STILL UP THERE', V('m3', 'still'), 'red', 1.1]] },
        twist: { set: 'city', opt: { night: 0.5 }, cam: 'wide', shake: V('twist', 'back'), cast: [worker(-1.0, 0, 0.3, V('twist', 'gravity'), 2), worker(0.2, -0.4, 0, V('twist', 'gravity') + 0.2, 2.4, { hair: 'long', hairCol: [200, 150, 60] }), worker(1.2, 0.2, -0.3, V('twist', 'gravity') + 0.1, 1.8)],
          tags: [[0, 0.35, 1.0, "DIDN'T COME BACK", V('twist', "didn't"), 'red', 1.2]] },
        punch: { set: 'office', opt: { desk: false }, cam: 'mid', props: (S) => chair(S, 0, 0.1), cast: [[null, 0, 0.1, 0, { bob: -0.45, mouth: 'flat', eyes: 'open', arms: [0.6, 0.6], hold: 'phone', shirt: [200, 90, 60] }]],
          tags: [[0, 2.5, -0.5, 'GARY', V('punch', 'gary'), 'yellow'], [0, 0.35, 0.9, 'STILL TIED', V('punch', 'tied'), 'green']] },
        cta: { set: 'space', cam: 'mid', cast: [[null, -0.6, 0, 0.4, (t) => ({ bob: 0.8 + Math.sin(t * 1.5) * 0.2, arms: [2.0, 2.4], mouth: 'o', hold: 'bag' })], [null, 0.7, 0, -0.4, (t) => ({ bob: 1.1 + Math.cos(t * 1.3) * 0.2, arms: [2.4, 2.0], mouth: 'grin', hold: 'phone', hair: 'long', hairCol: [60, 40, 30] })]], tags: [[0, 0.35, 0.9, 'GRAB ONE THING', V('cta', 'grab'), 'yellow', 1.1]] },
      };
    },
  });
