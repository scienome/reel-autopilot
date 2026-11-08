  // ==================== random escalation: 99-barking-dog ====================
  makeComedy({
    badge: 'STEP BY STEP', badgeCol: '#2a6f3a',
    captions: { keys: { "barks": "r", "earplugs": "y", "wedding": "y", "dog": "y", "mayor": "b", "illegal": "r", "collapses": "r", "aliens": "g", "bark": "r", "moon": "b", "silence": "g", "rocket": "r", "bigger": "r" } },
    beats: ({ V }) => {
      const bx = (S, x, y, z, hx, hy, hz, c, rot = 0) => S.box((p) => add(rotY(p, rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
      const dog = (S, x, z, s = 1, t = 0, o = {}) => { const c = o.col || [200, 150, 90], b = Math.abs(Math.sin(t * 9)) * 0.03 * s + (o.y || 0), B = (dx, dy, dz, hx, hy, hz, col) => bx(S, x + dx * s, dy * s + b, z + dz * s, hx * s, hy * s, hz * s, col || c, o.rot || 0);
        B(0, 0.3, 0, 0.22, 0.1, 0.11); B(0.22, 0.44, 0, 0.1, 0.1, 0.1); B(0.33, 0.41, 0, 0.05, 0.04, 0.05, [90, 60, 40]); for (const a of [-1, 1]) { B(0.2, 0.57, a * 0.06, 0.03, 0.05, 0.02, [120, 80, 50]); for (const d of [-1, 1]) B(a * 0.14, 0.1, d * 0.07, 0.03, 0.1, 0.03); } B(-0.25, 0.4, 0, 0.03, 0.08, 0.02);
        if (o.tie) B(0.18, 0.3, 0, 0.02, 0.07, 0.04, P.red); if (o.hat) B(0.22, 0.6, 0, 0.09, 0.04, 0.09, [30, 30, 36]); };
      const house = (S, x, col = [236, 226, 206]) => { bx(S, x, 0.6, -0.8, 0.8, 0.6, 0.6, col); bx(S, x, 1.32, -0.8, 0.85, 0.12, 0.65, P.red); bx(S, x + 0.3, 0.5, -0.19, 0.2, 0.25, 0.02, [255, 230, 140]); };
      const WOOF = (pts) => pts.map(([x, y, z, tm], i) => [x, y, z, i % 3 ? 'WOOF' : 'WOOF!', tm, i % 2 ? 'red' : 'yellow']);
      const ufo = (S, y, t) => { S.cyl((p) => add(p, [0, y, -0.3]), 1.3, 0.14, [170, 175, 190], 24); S.cyl((p) => add(p, [0, y + 0.14, -0.3]), 0.5, 0.3, [140, 230, 255], 18); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + t * 2; bx(S, Math.cos(a) * 1.15, y - 0.02, -0.3 + Math.sin(a) * 1.15, 0.05, 0.03, 0.05, i % 2 ? [255, 220, 60] : [255, 80, 80]); } };
      const YOU = (o = {}) => [null, 1.0, 0.8, -0.4, Object.assign({ shirt: P.blue, pants: [50, 50, 60], face: 'flat' }, o)];
      const BRIDE = [null, 0.45, 0.2, 0, { shirt: [250, 250, 252], pants: [250, 250, 252], face: 'smile', hair: 'long' }];
      const crowd = (k = 0) => [['cop', -1.6, 0.9, 0.4, (t) => ({ arms: Math.sin(t * 8 + k) > 0 ? 'up' : null })], ['chef', -0.9, 1.2, 0.2], ['cowboy', 0.9, 1.2, -0.2], ['scientist', 1.6, 0.9, -0.4, (t) => ({ arms: Math.sin(t * 8 + k + 1) > 0 ? 'up' : null })]];
      return {
        hook: { set: 'lawn', opt: { night: 0.8 }, cam: 'wide', props: (S, t) => { house(S, -1.2); house(S, 1.3, [210, 220, 240]); dog(S, -0.6, 0.3, 1.1, t); goldTank(S, -1.3, 1.3, 0.8, 0.5, t); }, cast: [YOU({ face: 'sad' })],
          tags: WOOF([[-0.6, 1.2, 0.3, 0.3], [-1.2, 1.9, 0.0, 0.9], [0.0, 1.6, 0.4, 1.5], [-0.9, 2.3, 0.2, 2.0]]) },
        b1: { set: 'lawn', opt: { night: 0.8 }, cam: 'close', at: 1.0, cast: [YOU({ face: 'smile' })], props: (S) => { for (const a of [-1, 1]) bx(S, 1.0 + a * 0.2, 1.72, 0.8, 0.05, 0.05, 0.05, P.orange); },
          tags: [[1.0, 2.35, 0.8, 'EARPLUGS 3000', V('b1', 'earplugs'), 'orange']] },
        b2: { set: 'stage', cam: 'mid', cast: [BRIDE, ['judge', -0.3, -0.3, 0.2], ['chef', -1.4, 1.0, 0.3], ['cop', 1.5, 1.0, -0.3]], props: (S) => bx(S, -0.45, 0.6, 0.2, 0.18, 0.02, 0.18, [255, 200, 220]),
          tags: [[-0.45, 1.3, 0.2, 'GROOM?', V('b2', 'miss'), 'red']], sfx: [['buzz', V('b2', 'wedding'), { f: 110, dur: 0.3, gain: 0.4 }]] },
        b3: { set: 'stage', cam: 'mid', flash: [V('b3', 'dog')], cast: [[null, 0.7, 0.3, -0.3, BRIDE[4]], ['judge', 0, -0.7, 0]], props: (S, t) => dog(S, -0.4, 0.5, 2.4, t, { tie: true, hat: true, rot: 0.4 }),
          tags: [[0, 2.3, 0.2, 'JUST MARRIED', V('b3', 'marries'), 'yellow']] },
        b4: { set: 'city', opt: { night: 0 }, cam: 'wide', cast: crowd(), props: (S, t) => { podium(S, 0, -0.2, 'VOTE DOG', P.blue, 1); dog(S, 0, -0.2, 1.3, t, { tie: true, y: 1.05 }); for (let i = 0; i < 6; i++) bx(S, -2 + i * 0.8, 2.6 + Math.sin(t * 3 + i) * 0.1, -1.2, 0.18, 0.1, 0.01, i % 2 ? P.red : P.blue); },
          tags: [[0, 2.0, -0.2, 'MAYOR', V('b4', 'wins'), 'blue']], flash: [V('b4', 'wins')] },
        b5: { set: 'court', cam: 'mid', props: (S, t) => { podium(S, 0, -0.2, '', [120, 84, 50], 1); dog(S, 0, -0.2, 1.3, t, { tie: true, hat: true, y: 1.05 }); }, cast: [['judge', -1.2, 0.2, 0.3], ['cop', 1.2, 0.2, -0.3]],
          tags: [[0, 2.2, 0.0, 'MONDAY', V('b5', 'Mondays'), 'red']], booms: [[0, 2.2, 0.0, V('b5', 'illegal'), 1.2]] },
        b6: { set: 'city', opt: { night: 0.4 }, cam: 'high', shake: V('b6', 'collapses'), cast: crowd(3), props: (S, t, u) => { goldTank(S, H.lerp(-3, 3, u), 0.2, 1.4, 0, t, { fire: V('b6', 'collapses') }); for (let i = 0; i < 18; i++) cash(S, -2 + (i * 0.73) % 4, 3 - ((u * 4 + i * 0.37) % 3), -0.5 + (i % 5) * 0.3, 0.8, t * 3 + i); },
          booms: [[-1.5, 0.6, -1, V('b6', 'economy'), 1.4], [1.4, 0.6, -0.8, V('b6', 'collapses'), 1.8]], tags: [[0, 2.4, 0, 'STOCKS: 0', V('b6', 'collapses'), 'red']] },
        b7: { set: 'sky', opt: { night: 0.3 }, cam: 'pull', props: (S, t, u) => ufo(S, 3.5 - 2.2 * H.ease.out(u), t), cast: [['alien', -0.5, 0.5, 0.3, (t, u) => ({ hide: u < 0.6 })], ['alien', 0.6, 0.6, -0.3, (t, u) => ({ hide: u < 0.7 })]],
          tags: [[0, 2.9, 0, 'HELP IS HERE', V('b7', 'help'), 'green']] },
        b8: { set: 'sky', opt: { night: 0.3 }, cam: 'mid', props: (S, t) => ufo(S, 1.3, t), cast: [['alien', -0.5, 0.5, 0.3, { mouth: 'o' }], ['alien', 0.6, 0.6, -0.3, { mouth: 'o' }]],
          tags: WOOF([[-0.5, 2.2, 0.5, V('b8', 'bark')], [0.6, 2.4, 0.6, V('b8', 'bark') + 0.25], [0, 2.8, 0.3, V('b8', 'bark') + 0.5]]) },
        b9: { set: 'space', cam: 'pull', props: (S, t, u) => missile(S, H.lerp(-1.5, 1.5, u), H.lerp(-0.5, 2.5, u), 0, 0.9, 0.6, 1), tags: [[0, 2.5, 0, 'MOON OR BUST', V('b9', 'moon'), 'blue']] },
        b10: { set: 'moon', cam: 'wide', props: (S) => { astronaut(S, 0.5, 0.4, 0.9, -0.3); bx(S, -1.2, 0.5, -0.5, 0.6, 0.5, 0.5, [236, 236, 240]); }, tags: [[0.5, 2.2, 0.4, '0 dB', V('b10', 'Silence'), 'green']] },
        twist: { set: 'moon', cam: 'pull', shake: V('twist', 'next'), props: (S, t, u) => { astronaut(S, 0.5, 0.4, 0.9, -0.3); bx(S, -1.2, 0.5, -0.5, 0.6, 0.5, 0.5, [236, 236, 240]); missile(S, 1.9, H.lerp(5, 0.9, H.ease.out(Math.min(1, u * 1.3))), -0.6, 0.9, 0, 1); },
          booms: [[1.9, 0.3, -0.6, V('twist', 'next'), 1.2]] },
        close: { set: 'moon', cam: 'wide', shake: V('close', 'bigger'), props: (S, t) => { astronaut(S, 0.3, 0.6, 0.9, -0.3); astronaut(S, 2.0, 0.2, 0.9, -0.6); dog(S, -1.1, -0.5, 3.4, t); goldTank(S, 1.4, 0.9, 1.0, -2.4, t, { turret: 2.6 }); },
          tags: WOOF([[-0.4, 3.3, -0.6, V('close', 'bigger')], [-1.5, 2.5, -0.4, V('close', 'bigger') + 0.3], [0.6, 2.8, -0.2, V('close', 'bigger') + 0.6]]), flash: [V('close', 'bigger')] },
      };
    },
  });
