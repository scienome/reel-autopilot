  // ==================== What if...? long noses ====================
  makeComedy({
    badge: 'WHAT IF...?', badgeCol: '#2a8a4a',
    captions: { say: {}, keys: { nose: 'o', grew: 'g', lied: 'r', salesmen: 'y', doors: 'r', lawyers: 'y', two: 'r', politician: 'y', moon: 'b', never: 'g', normal: 'g', nobody: 'r', trusted: 'r', elected: 'g', honest: 'y', broke: 'r', tv: 'r', longest: 'o' } },
    beats: ({ V }) => {
      const nose = (S, x, z, rot, len, y = 1.78) => { const L = Math.max(0.05, len); S.box((p) => add(rotY(p, rot), [x + Math.sin(rot) * (0.3 + L / 2), y, z + Math.cos(rot) * (0.3 + L / 2)]), 0.04, 0.04, L / 2, [230, 180, 140], { bevel: 0.4 }); };
      const grow = (t, at, max, k = 1.5) => Math.min(max, 0.05 + Math.max(0, t - at) * k);
      const suit = (ex) => Object.assign({ suit: true, tie: [200, 40, 40], mouth: 'grin' }, ex);
      return {
        hook: { set: 'street', cam: 'mid', props: (S, t) => nose(S, 0, 0.2, 0, grow(t, V('hook', 'lied'), 1.4)), cast: [[null, 0, 0.2, 0, { mouth: 'grin', eyes: 'open', hair: 'side', hairCol: [90, 60, 40] }]], tags: [[0, 0.35, 1.0, 'EVERY LIE', V('hook', 'lied'), 'red']] },
        b1: { set: 'bank', opt: { sign: 'CAR SALES' }, cam: 'wide', shake: V('b1', 'doors'), props: (S) => nose(S, 0.6, 0.6, -Math.PI / 2, 1.6), cast: [[null, 0.6, 0.6, -Math.PI / 2, suit({ hold: 'briefcase', eyes: 'wide', mouth: 'o' })]], tags: [[0, 0.35, 1.1, 'STUCK', V('b1', 'doors'), 'red']] },
        b2: { set: 'street', opt: { signs: ['LAWYER', 'PARKING', 'LAWYER', 'BANK'] }, cam: 'wide', props: (S) => nose(S, -0.8, 0.2, Math.PI / 2, 2.6), cast: [[null, -0.8, 0.2, Math.PI / 2, suit({ hold: 'briefcase', tie: [40, 60, 160] })]], tags: [[0, 0.35, 1.0, '2 PARKING SPACES', V('b2', 'two'), 'yellow', 1.2]] },
        b3: { set: 'moon', cam: 'wide', props: (S) => { S.box((p) => add(rotZ(p, 1.1), [-0.4, 1.4, 0]), 0.05, 2.4, 0.05, [230, 180, 140], { bevel: 0.4 }); S.cyl((p) => add(p, [0.6, 2.5, 0]), 0.12, 0.05, [230, 180, 140], 12); }, cast: [],
          tags: [[0, 0.35, 1.0, "POLITICIAN'S NOSE", V('b3', "politician's"), 'orange', 1.2], [0.8, 2.6, 0.2, 'MOON', V('b3', 'moon'), 'blue']] },
        twist: { set: 'street', cam: 'wide', props: (S) => { nose(S, -1.4, 0.0, 0.3, 1.2); nose(S, 1.4, 0.0, -0.3, 1.6); }, cast: [[null, -1.4, 0, 0.3, suit({ mouth: 'frown', brows: 'angry' })], [null, 0, 0.3, 0, { mouth: 'smile', shirt: [240, 240, 236], hair: 'side' }], [null, 1.4, 0, -0.3, suit({ mouth: 'frown', brows: 'angry', tie: [40, 160, 80] })]],
          tags: [[0, 2.5, -0.4, 'NORMAL NOSE', V('twist', 'normal'), 'green'], [0, 0.35, 1.0, 'TRUST: 0', V('twist', 'trusted'), 'red']] },
        punch: { set: 'stage', opt: { banner: 'PRESIDENT' }, cam: 'mid', props: (S, t) => { podium(S, 0, 0.3, 'VOTE ME'); nose(S, 0, -0.1, 0, t > V('punch', 'honest') ? grow(t, V('punch', 'honest'), 3.0, 6) : 0.05); },
          cast: [[null, 0, -0.1, 0, (t) => ({ suit: true, tie: [200, 40, 40], mouth: t > V('punch', 'honest') ? 'o' : 'grin', eyes: t > V('punch', 'honest') ? 'wide' : 'open', hair: 'side' })]], booms: [[0, 1.8, 2.4, V('punch', 'broke'), 0.5]],
          tags: [[0, 2.5, -0.6, 'ELECTED', V('punch', 'elected'), 'green'], [0, 0.35, 1.0, "I'LL BE HONEST", V('punch', 'honest'), 'yellow', 1.1]], flash: [V('punch', 'broke')] },
        cta: { set: 'street', cam: 'mid', props: (S) => nose(S, 0, 0.2, 0, 0.9), cast: [[null, 0, 0.2, 0, { mouth: 'grin', hair: 'side' }]], tags: [[0, 0.35, 1.0, 'TAG THEM', V('cta', 'tag'), 'yellow']] },
      };
    },
  });
