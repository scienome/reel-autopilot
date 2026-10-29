  // ==================== The Illuminati files: the eye ====================
  makeComedy({
    badge: 'THE ILLUMINATI FILES', badgeCol: '#a8841a',
    captions: { say: { ten: '10' }, keys: { 'all-seeing': 'y', eye: 'y', glasses: 'o', general: 'g', potato: 'o', goldfish: 'o', ten: 'r', bought: 'g', everything: 'r', clearly: 'g', camera: 'r', roll: 'r', old: 'o', back: 'r', never: 'r' } },
    beats: ({ V }) => {
      const specs = (S, on) => { if (!on) return; for (const x of [-0.18, 0.18]) S.cyl((p) => add(rotX(p, Math.PI / 2), [x, 2.15, -1.95]), 0.17, 0.01, [30, 30, 36], 18); S.box((p) => add(p, [0, 2.2, -1.95]), 0.04, 0.01, 0.01, [30, 30, 36], { bevel: 0.2 }); };
      const I = (x, z, rot, ex) => ['illuminati', x, z, rot, Object.assign({ mouth: 'grin' }, ex)];
      const blur = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(240,240,250,0.35)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
      return {
        hook: { set: 'lair', cam: 'wide', props: (S, t) => specs(S, t > V('hook', 'glasses')), cast: [I(-1.3, -0.4, 0.4, { mouth: 'o' }), I(1.3, -0.4, -0.4, { mouth: 'o' })], tags: [[0, 0.35, 1.0, 'NEEDS GLASSES', V('hook', 'glasses'), 'orange', 1.1]] },
        b1: { set: 'base', cam: 'mid', over: blur, props: (S) => { S.box((p) => add(p, [0.8, 0.25, 0.3]), 0.22, 0.16, 0.16, [180, 140, 90], { bevel: 0.8 }); }, cast: [['general', -0.4, 0.2, 0.3, { mouth: 'flat', arms: [0.15, 1.0] }]],
          tags: [[-0.4, 2.5, -0.3, 'POTATO?', V('b1', 'potato'), 'orange'], [0.8, 0.6, 0.3, 'GENERAL?', V('b1', 'potato'), 'green']] },
        b2: { set: 'office', cam: 'close', over: blur, props: (S, t) => { S.box((p) => add(p, [0, 1.3, 0.2]), 0.35, 0.28, 0.25, [170, 220, 250], { bevel: 0.2 }); S.box((p) => add(p, [Math.sin(t * 2) * 0.15, 1.3, 0.2]), 0.08, 0.05, 0.03, [255, 150, 40], { bevel: 0.6 }); }, cast: [],
          tags: [[0, 0.7, 0.6, '10 YEARS OF INTEL', V('b2', 'ten'), 'red', 1.1]] },
        b3: { set: 'lair', cam: [[0, 2.2, 3.6], [0, 2.2, -2], [0, 2.2, 3.0], [0, 2.2, -2]], props: (S, t) => specs(S, t > V('b3', 'glasses') - 0.2), cast: [I(-0.8, 0.4, 0.4, { hold: 'briefcase' })], tags: [[0, 1.0, 0.6, '👓', V('b3', 'glasses'), 'white', 0.5]], sfx: [['success', V('b3', 'glasses'), { f: 'C6', gain: 0.4 }]] },
        twist: { set: 'lair', cam: [[0, 2.0, 5.0], [0, 2.2, -2], [0, 2.1, 3.4], [0, 2.3, -2]], shake: V('twist', 'roll'), props: (S) => specs(S, true), cast: [I(-1.2, 0.3, 0.5, { mouth: 'open', eyes: 'wide', arms: [2.6, 2.6] }), I(1.2, 0.3, -0.5, { mouth: 'open', eyes: 'wide' })],
          tags: [[0, 0.35, 1.2, 'YOUR CAMERA ROLL', V('twist', 'camera'), 'red', 1.2]], flash: [V('twist', 'roll')] },
        punch: { set: 'lair', cam: 'mid', props: (S) => specs(S, false), cast: [I(0, 0.2, 0, { hold: 'phone', arms: [0.15, 1.6], mouth: 'frown' })], tags: [[0, 0.35, 0.9, 'OLD GLASSES PLEASE', V('punch', 'old'), 'orange', 1.2]] },
        cta: { set: 'lair', cam: 'wide', props: (S) => specs(S, true), cast: [I(-1.3, -0.4, 0.4), I(1.3, -0.4, -0.4)], tags: [[0, 0.35, 1.0, 'NEVER SEE?', V('cta', 'never'), 'red']] },
      };
    },
  });
