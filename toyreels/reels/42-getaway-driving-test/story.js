  // ==================== Heists gone wrong: the getaway ====================
  makeComedy({
    badge: 'HEISTS GONE WRONG', badgeCol: '#c8781a',
    captions: { say: { four: '4', ten: '10' }, keys: { getaway: 'r', driving: 'y', school: 'y', instructor: 'o', mirror: 'g', signal: 'g', belts: 'g', red: 'r', indicated: 'y', police: 'r', minutes: 'o', parallel: 'y', prison: 'r', passed: 'g', test: 'g' } },
    beats: ({ V }) => {
      const car = (S, x, z, rot = 0, sign = true) => { const T = (p) => add(rotY(p, rot), [x, 0, z]);
        S.box((p) => T(add(p, [0, 0.42, 0])), 1.0, 0.22, 0.5, [240, 200, 40], { bevel: 0.25 }); S.box((p) => T(add(p, [0, 0.82, 0])), 0.6, 0.2, 0.46, [160, 210, 240], { bevel: 0.3 });
        for (const [a, b] of [[-0.65, 0.48], [0.65, 0.48], [-0.65, -0.48], [0.65, -0.48]]) S.cyl((p) => T(add(rotX(p, Math.PI / 2), [a, 0.2, b])), 0.2, 0.08, [30, 30, 34], 14);
        if (sign) S.box((p) => T(add(p, [0, 1.12, 0])), 0.3, 0.1, 0.12, [220, 40, 40], { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = '#fff'; c.font = FONT(900, h * 0.6); c.textAlign = 'center'; c.fillText('L  LEARNER', w / 2, h * 0.75); } }); };
      const inCar = (who, x, z, ex) => [who, x, z, Math.PI, Object.assign({ bob: -0.55 }, ex)];
      const R1 = (ex) => inCar('robber', 0.25, -0.1, ex), R2 = (ex) => inCar('robber', -0.25, 0.15, Object.assign({ balaclava: [60, 30, 30] }, ex)), IN = null;
      const light = (S, red) => { S.box((p) => add(p, [1.6, 1.1, -0.6]), 0.03, 1.1, 0.03, [60, 60, 66], { bevel: 0.2 }); S.box((p) => add(p, [1.6, 2.3, -0.6]), 0.12, 0.28, 0.1, [30, 30, 34], { bevel: 0.2 }); S.cyl((p) => add(rotX(p, Math.PI / 2), [1.6, 2.45, -0.49]), 0.06, 0.02, red ? [255, 40, 40] : [80, 30, 30], 12); S.cyl((p) => add(rotX(p, Math.PI / 2), [1.6, 2.15, -0.49]), 0.06, 0.02, red ? [30, 80, 30] : [40, 255, 80], 12); };
      return {
        hook: { set: 'bank', opt: { sign: 'BANK' }, cam: 'wide', props: (S) => car(S, 0.4, 0.4, 0.2), shake: V('hook', 'school'),
          cast: [['robber', -1.2, 0.6, 0.6, (t) => ({ hold: 'bag', walk: t * 9, mouth: 'grin' })], ['robber', -1.8, 0.2, 0.6, (t) => ({ hold: 'bag', walk: t * 9, balaclava: [60, 30, 30], mouth: 'grin' })]],
          tags: [[0.4, 2.0, 0.4, 'L = LEARNER', V('hook', 'school'), 'red', 1.0], [0, 0.35, 1.0, 'GETAWAY CAR', V('hook', 'getaway'), 'orange', 1.1]] },
        inst: { set: 'street', cam: 'mid', props: (S) => car(S, 0, 0, 0), cast: [R1({ eyes: 'wide', mouth: 'o' }), R2({ eyes: 'wide', mouth: 'o' }), ['scientist', 0.25, 0.15, Math.PI, { bob: -0.55, rot: 0, mouth: 'flat', hold: 'phone' }]], tags: [[0.25, 2.2, 0.2, 'INSTRUCTOR', V('inst', 'instructor'), 'yellow']] },
        rules: { set: 'street', cam: 'close', props: (S) => car(S, 0, 0, 0), cast: [['scientist', 0.25, 0.15, 0, { bob: -0.55, mouth: 'flat', arms: [0.15, 1.8], brows: 'raised' }]],
          tags: [[-0.6, 1.4, 0.4, 'MIRROR ✓', V('rules', 'mirror'), 'green'], [0.6, 1.4, 0.4, 'SIGNAL ✓', V('rules', 'signal'), 'green'], [0, 0.6, 0.7, 'SEAT BELTS', V('rules', 'belts'), 'yellow']], sfx: [['click', V('rules', 'belts'), { gain: 0.5 }]] },
        drive: { set: 'street', cam: 'wide', props: (S, t) => { car(S, H.lerp(-1.6, 0.6, H.clamp((t - V('drive', 'stopped') + 1) / 1.2)), 0.2, 0); light(S, true); },
          cast: [], tags: [[1.6, 2.8, -0.6, 'RED', V('drive', 'red'), 'red'], [0, 0.35, 1.0, 'INDICATING', V('drive', 'indicated'), 'yellow']] },
        twist: { set: 'street', opt: { signs: ['PARKING', 'BANK', 'DONUTS'] }, cam: 'wide', props: (S, t) => { car(S, 0.2, 0.2, 0.25 * Math.sin(t * 2)); car(S, -1.8, 0.4, 0, false); },
          cast: [['cop', 1.4, 0.6, -0.5, { mouth: 'grin', arms: [0.15, 2.0], hold: 'phone' }], ['cop', 1.9, 0.0, -0.5, { mouth: 'o', arms: [2.4, 2.4] }]],
          tags: [[0, 2.6, -0.6, '4 MINUTES', V('twist', 'minutes'), 'orange'], [0.2, 0.35, 1.0, 'PARALLEL PARKING', V('twist', 'parallel'), 'yellow', 1.2]], sfx: [['buzz', V('twist', 'police'), { gain: 0.4 }]] },
        punch: { set: 'prison', opt: { bars: true }, cam: 'mid', props: (S) => plate(S, 0, 1.2, 1.9, 0.5, 0.32, (c, w, h) => { c.fillStyle = '#e8f0ff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a4a9a'; c.font = FONT(900, h * 0.15); c.fillText('DRIVING LICENCE', w * 0.05, h * 0.3); c.fillStyle = '#2a8a4a'; c.font = FONT(900, h * 0.3); c.fillText('PASSED ✓', w * 0.1, h * 0.75); }),
          cast: [['prisoner', -0.6, 0.0, 0.2, { mouth: 'grin', arms: [2.4, 0.15] }], ['prisoner', 0.6, 0.0, -0.2, { mouth: 'grin', arms: [0.15, 2.4], number: '24602' }]],
          tags: [[0, 2.3, 1.9, '10 YEARS', V('punch', 'ten'), 'red'], [0, 0.4, 1.9, 'PASSED', V('punch', 'passed'), 'green']], sfx: [['success', V('punch', 'passed'), { f: 'C6', gain: 0.5 }]] },
        cta: { set: 'street', cam: 'mid', props: (S) => { car(S, 0, 0.2, 0); light(S, true); }, cast: [], tags: [[0, 0.35, 1.0, 'BE HONEST', V('cta', 'honest'), 'yellow']] },
      };
    },
  });
