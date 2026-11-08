  // ==================== random escalation: 101-tv-remote-voice2 ====================
  makeComedy({
    badge: 'STEP BY STEP', badgeCol: '#2a6f3a',
    captions: { keys: { "remote": "y", "sofa": "b", "nothing": "r", "detector": "b", "pirate": "r", "deeper": "y", "dig": "y", "core": "r", "stone": "y", "god": "y", "t-rex": "r", "home": "g", "hand": "g" } },
    beats: ({ V }) => {
      const bx = (S, x, y, z, hx, hy, hz, c, rot = 0) => S.box((p) => add(rotY(p, rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
      const room = (S) => { bx(S, 0, 0.3, -0.9, 1.3, 0.3, 0.4, [120, 60, 140]); bx(S, 0, 0.75, -1.2, 1.3, 0.35, 0.12, [140, 74, 160]); for (const a of [-1, 1]) bx(S, a * 1.25, 0.55, -0.9, 0.1, 0.25, 0.4, [140, 74, 160]);
        bx(S, 1.9, 0.9, -0.2, 0.06, 0.5, 0.8, [30, 30, 36], 0); bx(S, 1.86, 0.9, -0.2, 0.01, 0.42, 0.72, [60, 120, 200]); bx(S, -1.9, 0.6, -0.8, 0.25, 0.6, 0.25, [150, 110, 70]); };
      const remote = (S, x, y, z, s = 1) => { bx(S, x, y, z, 0.05 * s, 0.02 * s, 0.14 * s, [30, 30, 36]); bx(S, x, y + 0.02 * s, z - 0.09 * s, 0.015 * s, 0.01, 0.015 * s, P.red); };
      const detector = (S, x, z, t) => { bx(S, x + 0.25, 0.5, z, 0.015, 0.45, 0.015, [180, 180, 190], 0); S.cyl((p) => add(p, [x + 0.25, 0.05, z + 0.1]), 0.15, 0.03, [60, 60, 70], 18); bx(S, x + 0.25, 0.85, z, 0.05, 0.04, 0.05, Math.sin(t * 20) > 0 ? [255, 60, 60] : [90, 30, 30]); };
      const trex = (S, x, z, s, t, rot = 0) => { const G = [70, 140, 80], k = Math.sin(t * 10) * 0.06, B = (dx, dy, dz, hx, hy, hz, c = G) => bx(S, x + dx * s, dy * s, z + dz * s, hx * s, hy * s, hz * s, c, rot);
        B(0, 1.0, 0, 0.45, 0.3, 0.28); B(0.55, 1.45 + k, 0, 0.3, 0.2, 0.22); B(0.8, 1.32 + k, 0, 0.2, 0.06, 0.18, [240, 240, 240]); B(-0.7, 0.95, 0, 0.45, 0.12, 0.12); B(0.6, 1.62 + k, 0.12, 0.04, 0.04, 0.02, [20, 20, 20]);
        for (const a of [-1, 1]) { B(-0.05, 0.45, a * 0.2, 0.1, 0.45 + a * k, 0.1); B(0.35, 0.85, a * 0.18, 0.12, 0.03, 0.03); } };
      const hole = (S, x, z, r) => S.cyl((p) => add(p, [x, 0.005, z]), r, 0.01, [30, 22, 18], 20);
      const YOU = (o = {}) => [null, 0.5, 0.6, -0.3, Object.assign({ shirt: [240, 200, 60], pants: [50, 50, 60], face: 'flat' }, o)];
      return {
        hook: { set: 'office', cam: 'wide', cast: [YOU({ face: 'sad' })], props: (S) => room(S), tags: [[1.85, 1.6, -0.2, 'NO SIGNAL', 0.6, 'dark']] },
        b1: { set: 'office', cam: 'low', cast: [YOU({ x: 0.3, z: -0.2, rot: 3.1, face: 'flat' })], props: (S, t) => { room(S); for (let i = 0; i < 6; i++) bx(S, -0.9 + i * 0.35, 0.03, -0.4, 0.04, 0.02, 0.04, i % 2 ? [255, 210, 60] : [200, 160, 110]); },
          tags: [[0, 1.4, -0.3, '3 COINS', V('b1', 'sofa'), 'yellow'], [0.6, 1.9, -0.3, 'NOTHING', V('b1', 'Nothing'), 'red']] },
        b2: { set: 'lawn', cam: 'mid', cast: [YOU({ face: 'smile' })], props: (S, t) => detector(S, 0.5, 0.8, t), tags: [[0.9, 1.0, 0.8, 'BEEP', V('b2', 'detector') + 0.3, 'red'], [0.2, 1.4, 0.6, 'BEEP', V('b2', 'detector') + 0.7, 'yellow']] },
        b3: { set: 'lawn', cam: 'mid', flash: [V('b3', 'pirate')], cast: [YOU({ face: 'wow' }), ['pirate', -0.6, 0.4, 0.4, (t, u) => ({ hide: t < V('b3', 'pirate') })]],
          props: (S, t) => { hole(S, -0.6, 0.4, 0.5); detector(S, 0.5, 0.8, t); bx(S, -0.1, 0.06, 0.9, 0.3, 0.02, 0.03, [200, 200, 210], 0.4); }, tags: [[-0.1, 0.5, 0.9, 'SWORD', V('b3', 'sword'), 'blue']] },
        b4: { set: 'lawn', cam: 'close', at: -0.6, cast: [['pirate', -0.6, 0.4, 0.4]], props: (S) => hole(S, -0.6, 0.4, 0.5), tags: [[-0.6, 2.45, 0.4, 'DEEPER', V('b4', 'deeper'), 'yellow']] },
        b5: { set: 'office', cam: 'high', shake: V('b5', 'dig'), cast: [YOU({ face: 'wow', hold: 'shovel' })], props: (S, t, u) => { room(S); hole(S, 0.5, 0.6, 0.2 + u * 0.8); }, booms: [[0.5, 0.2, 0.6, V('b5', 'floor'), 1.2]] },
        b6: { set: 'hell', cam: 'pull', cast: [YOU({ face: 'wow', y: 0 })], props: (S, t) => { for (let i = 0; i < 6; i++) bx(S, -2 + i * 0.8, 0.2 + Math.abs(Math.sin(t * 3 + i)) * 0.4, -0.6, 0.15, 0.15, 0.15, [255, 120 + i * 20, 30]); }, tags: [[0.5, 2.3, 0.6, '6000°C', V('b6', 'core'), 'red']] },
        b7: { set: 'desert', cam: 'wide', cast: [YOU({ face: 'wow' }), ['caveman', -1.0, 0.2, 0.5], ['caveman', -1.6, -0.3, 0.6]], props: (S, t) => { hole(S, 0.5, 0.6, 0.6); goldTank(S, 2.2, -1.2, 1.0, -0.5, t); }, tags: [[0, 2.4, 0, '65,000,000 BC', V('b7', 'stone'), 'yellow']] },
        b8: { set: 'desert', cam: 'mid', cast: [YOU({ face: 'smile', hold: 'phone' }), ['caveman', -0.7, 0.9, 0.9, { arms: 'up' }], ['caveman', -1.2, 0.5, 0.7, { arms: 'up' }], ['caveman', 1.3, 0.9, -0.9, { arms: 'up' }]],
          props: (S, t) => { for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + t; bx(S, 0.5 + Math.cos(a) * 0.5, 2.2 + Math.sin(a) * 0.5, 0.6, 0.03, 0.1, 0.01, [255, 230, 120], a); } }, tags: [[0.5, 2.7, 0.6, 'GOD', V('b8', 'god'), 'yellow']] },
        b9: { set: 'desert', cam: 'wide', shake: V('b9', 'chases'), cast: [YOU({ face: 'wow', x: 1.2, walk: 1 }), ['caveman', -0.6, 1.2, 0.3, (t, u) => ({ x: -0.6 + u * 2.5, walk: 1 })]],
          props: (S, t, u) => { trex(S, -1.6 + u * 1.2, -0.8, 1.6, t); goldTank(S, -2.6 + u * 3.5, 1.4, 0.9, 0, t); }, tags: [[1.5, 2.6, 0, 'RUN', V('b9', 'chases'), 'red']] },
        twist: { set: 'office', cam: 'mid', cast: [YOU({ face: 'flat', x: 0, z: -0.85 })], props: (S) => room(S) },
        close: { set: 'office', cam: 'close', at: 0, cast: [YOU({ face: 'wow', x: 0, z: -0.85, hold: 'remote' })], props: (S) => room(S), flash: [V('close', 'hand')],
          tags: [[-0.5, 2.1, -0.6, 'REMOTE', V('close', 'hand'), 'yellow']] },
      };
    },
  });
