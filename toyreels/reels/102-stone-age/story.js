  // ==================== random escalation: 102-stone-age ====================
  makeComedy({
    badge: 'STONE AGE', badgeCol: '#8a5a2b',
    captions: { keys: { "wheel": "y", "fire": "r", "burns": "r", "house": "b", "taxes": "r", "chases": "r", "mammoth": "y", "tank": "y", "t-rex": "r", "king": "g", "meteor": "r" } },
    beats: ({ V }) => {
      const bx = (S, x, y, z, hx, hy, hz, c, rot = 0) => S.box((p) => add(rotY(p, rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
      const ROCK = [130, 120, 110];
      const wheel = (S, x, z, t, roll = 0) => S.cyl((p) => add(rotZ(rotX(p, 1.5708), t * roll), [x, 0.35, z]), 0.35, 0.12, ROCK, 16);
      const fire = (S, x, z, t, s = 1) => { bx(S, x, 0.05, z, 0.25 * s, 0.05, 0.08 * s, [110, 70, 40], 0.5); bx(S, x, 0.05, z, 0.25 * s, 0.05, 0.08 * s, [110, 70, 40], -0.5);
        for (let i = 0; i < 5; i++) { const h = (0.2 + 0.15 * Math.abs(Math.sin(t * 9 + i * 2))) * s; bx(S, x + (i - 2) * 0.06 * s, 0.1 + h / 2, z, 0.05 * s, h / 2, 0.05 * s, i % 2 ? [255, 200, 40] : [255, 100, 30]); } };
      const cave = (S, burn = 0, t = 0) => { bx(S, -1.2, 0.8, -1.0, 0.9, 0.8, 0.6, burn ? [60, 50, 45] : ROCK); bx(S, -1.2, 0.45, -0.39, 0.35, 0.45, 0.01, [30, 25, 22]); if (burn) for (const dx of [-0.6, 0, 0.5]) fire(S, -1.2 + dx, -0.3, t, 1.4); };
      const hut = (S, x, z, squash = 0) => { const k = 1 - squash * 0.7; bx(S, x, 0.45 * k, z, 0.5, 0.45 * k, 0.45, [190, 150, 100]); bx(S, x, 0.95 * k, z, 0.6, 0.08, 0.55, [120, 160, 60]); bx(S, x, 0.3 * k, z + 0.46, 0.15, 0.3 * k, 0.01, [90, 60, 40]); };
      const mammoth = (S, x, z, s, t, rot = 0) => { const C = [120, 80, 50], B = (dx, dy, dz, hx, hy, hz, c = C) => bx(S, x + dx * s, dy * s, z + dz * s, hx * s, hy * s, hz * s, c, rot);
        B(0, 1.0, 0, 0.6, 0.45, 0.4); B(0.65, 1.15, 0, 0.28, 0.28, 0.3); B(0.9, 0.7, 0, 0.07, 0.35, 0.07); for (const a of [-1, 1]) { B(0.85, 0.85, a * 0.18, 0.18, 0.03, 0.03, [245, 240, 225]); for (const d of [-1, 1]) B(a * 0.4, 0.3, d * 0.25, 0.12, 0.3 + Math.sin(t * 8 + a) * 0.02, 0.12); B(0.65, 1.2, a * 0.33, 0.04, 0.2, 0.2, [100, 64, 40]); } };
      const trex = (S, x, z, s, t, rot = 0) => { const G = [70, 140, 80], k = Math.sin(t * 10) * 0.06, B = (dx, dy, dz, hx, hy, hz, c = G) => bx(S, x + dx * s, dy * s, z + dz * s, hx * s, hy * s, hz * s, c, rot);
        B(0, 1.0, 0, 0.45, 0.3, 0.28); B(0.55, 1.45 + k, 0, 0.3, 0.2, 0.22); B(0.8, 1.32 + k, 0, 0.2, 0.06, 0.18, [240, 240, 240]); B(-0.7, 0.95, 0, 0.45, 0.12, 0.12); for (const a of [-1, 1]) B(-0.05, 0.45, a * 0.2, 0.1, 0.45 + a * k, 0.1); };
      const crown = (S, x, y, z) => { bx(S, x, y, z, 0.17, 0.05, 0.17, [255, 210, 60]); for (const [dx, dz] of [[-0.12, 0], [0.12, 0], [0, -0.12], [0, 0.12]]) bx(S, x + dx, y + 0.1, z + dz, 0.03, 0.06, 0.03, [255, 210, 60]); };
      const YOU = (o = {}) => ['caveman', 0.5, 0.7, -0.3, Object.assign({ shirt: [80, 160, 210] }, o)];
      const TRIBE = (k = 0) => [['caveman', -1.5, 0.6, 0.6, (t) => ({ arms: Math.sin(t * 7 + k) > 0 ? 'up' : null })], ['caveman', -0.9, 1.2, 0.4], ['caveman', 1.6, 0.9, -0.6, (t) => ({ arms: Math.sin(t * 7 + k + 2) > 0 ? 'up' : null })]];
      return {
        hook: { set: 'lawn', cam: 'mid', cast: [YOU({ face: 'smile' })], props: (S, t) => { cave(S); wheel(S, -0.2, 0.9, t, 0); }, tags: [[-0.2, 1.1, 0.9, 'WHEEL v1', V('hook', 'wheel'), 'yellow']] },
        b1: { set: 'lawn', cam: 'wide', cast: [YOU({ face: 'sad' }), ...TRIBE()], props: (S, t, u) => { cave(S); wheel(S, -0.2 + u * 2.5, 0.9, t, -3); goldTank(S, 2.6, -1.6, 0.7, -0.8, t); }, tags: [[-1.2, 2.2, 0.7, 'FIRE!', V('b1', 'fire'), 'red']] },
        b2: { set: 'lawn', cam: 'pull', shake: V('b2', 'burns'), cast: [YOU({ face: 'wow' })], props: (S, t) => cave(S, t > V('b2', 'burns'), t), booms: [[-1.2, 1.2, -0.6, V('b2', 'burns'), 1.6]], flash: [V('b2', 'fire')] },
        b3: { set: 'lawn', cam: 'mid', cast: [YOU({ face: 'smile' })], props: (S, t, u) => hut(S, -0.6, -0.4, 0), tags: [[-0.6, 1.5, -0.4, 'HOUSE 1.0', V('b3', 'house'), 'blue']] },
        b4: { set: 'lawn', cam: 'wide', cast: [YOU({ face: 'smile', hold: 'bag' }), ...TRIBE(1)], props: (S) => { hut(S, -0.6, -0.6); hut(S, 1.4, -1.0); hut(S, -2.2, -1.2); }, tags: [[0.5, 2.3, 0.7, 'TAX: 3 ROCKS', V('b4', 'taxes'), 'red']] },
        b5: { set: 'desert', cam: 'wide', at: 0.2, shake: V('b5', 'chases'), cast: [YOU({ face: 'wow', walk: 1, x: 1.6 }), ['caveman', -0.4, 0.6, -1.57, (t) => ({ walk: 1, arms: 'up' })], ['caveman', -1.0, 1.0, -1.57, { walk: 1, arms: 'up' }], ['caveman', -1.6, 0.4, -1.57, { walk: 1 }]], props: (S, t, u) => { for (let i = 0; i < 4; i++) bx(S, -1 + u * 2 + i * 0.4, 1.5 + Math.sin(t * 6 + i) * 0.3, 0.6, 0.06, 0.06, 0.06, ROCK); } },
        b6: { set: 'lawn', cam: 'pull', shake: V('b6', 'sits'), cast: [YOU({ face: 'sad', x: 1.5 })], props: (S, t, u) => { hut(S, -0.4, -0.5, H.clamp((t - V('b6', 'sits')) * 3)); mammoth(S, -0.4, -0.5, 1.2, t); }, booms: [[-0.4, 0.3, -0.5, V('b6', 'sits'), 1.0]] },
        b7: { set: 'lawn', cam: 'low', flash: [V('b7', 'tank')], cast: [YOU({ face: 'smile', x: 1.4, z: 0.9 })], props: (S, t) => { goldTank(S, 0, 0.3, 1.8, -0.3, t, { fire: V('b7', 'tank') + 0.6 }); }, tags: [[0, 1.6, 0.3, 'TANK', V('b7', 'tank'), 'yellow']], sfx: [['impact', V('b7', 'tank'), { gain: 0.7 }]] },
        b8: { set: 'lawn', cam: 'wide', shake: V('b8', 'mammoth'), props: (S, t, u) => { goldTank(S, -1.8 + u * 1.2, 0.6, 1.3, 0, t, { fire: V('b8', 'mammoth') }); mammoth(S, 0.3 + u * 1.4, -0.9, 0.9, t, 3.14); trex(S, 1.2 + u * 1.2, 0.2, 0.9, t, 3.14); }, booms: [[1.0, 0.5, -0.6, V('b8', 'mammoth') + 0.2, 1.2], [2.2, 0.5, 0.2, V('b8', 'T-rex') + 0.2, 1.2]] },
        twist: { set: 'lawn', cam: 'mid', cast: [YOU({ face: 'smile', x: 0.4, z: 0.4 }), ...TRIBE(2)], props: (S, t) => { goldTank(S, -1.6, -0.6, 1.0, 0.5, t); crown(S, 0.4, 2.0 + Math.max(0, 1 - (t - V('twist', 'king')) * 2), 0.4); }, tags: [[1.2, 2.3, 0.5, 'KING', V('twist', 'king'), 'yellow']], flash: [V('twist', 'king')] },
        close: { set: 'lawn', cam: 'pull', opt: { night: 0.4 }, shake: V('close', 'meteor') + 0.6, cast: [YOU({ face: 'wow', x: 0.4, z: 0.4 }), ...TRIBE(3)], props: (S, t, u) => { goldTank(S, -1.6, -0.6, 1.0, 0.5, t); crown(S, 0.4, 2.0, 0.4); const k = H.ease.in(u); bx(S, 3 - k * 3, 6 - k * 5.5, -1.5, 0.5, 0.5, 0.5, [255, 120, 40], t * 2); }, booms: [[0, 0.8, -1.5, V('close', 'meteor') + 0.8, 3.0]] },
      };
    },
  });
