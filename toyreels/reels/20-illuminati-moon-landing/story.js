  // ==================== The Illuminati files: the moon landing ====================
  makeComedy({
    badge: 'THE ILLUMINATI FILES', badgeCol: '#a8841a',
    captions: { say: {}, keys: { illuminati: 'y', faked: 'r', actual: 'g', moon: 'y', desert: 'o', sweaty: 'o', budget: 'r', fake: 'r', real: 'g', cut: 'r', without: 'r', sequel: 'y' } },
    beats: ({ V }) => {
      const astro = (x, z, rot, ex = {}) => [null, x, z, rot, (t) => Object.assign({}, typeof ex === 'function' ? ex(t) : ex)];
      const camRig = (S, x, z) => { S.box((p) => add(p, [x, 1.2, z]), 0.18, 0.14, 0.25, [40, 40, 46], { bevel: 0.3 }); S.cyl((p) => add(p, [x, 0, z + 0.1]), 0.03, 1.05, [60, 60, 66], 8); };
      return {
        hook: { set: 'lair', cam: 'mid',
          cast: [['illuminati', -0.6, -0.4, 0.3, { arms: [0.15, 1.3], mouth: 'evil' }], ['illuminati', 0.6, -0.4, -0.3, { arms: [0.15, 0.15], mouth: 'grin' }]],
          tags: [[0, 2.45, -0.4, 'FAKED', V('hook', 'faked'), 'red'], [0, 0.35, 0.6, 'ON THE ACTUAL MOON', V('hook', 'actual'), 'green', 1.15]], flash: [V('hook', 'actual')] },
        plan: { set: 'desert', cam: 'wide',
          props: (S) => { camRig(S, 1.2, 0.6); S.cyl((p) => add(p, [-1.4, 0, -0.2]), 0.05, 2.0, [60, 60, 66], 8); S.box((p) => add(p, [-1.4, 2.1, -0.2]), 0.22, 0.16, 0.16, [250, 240, 200], { bevel: 0.3 }); },
          cast: [(() => { const a = (t) => ({ sweat: true, mouth: 'open', eyes: 'wide' }); return ['spiderBro', 0, 0, 0, () => ({})]; })()].slice(0, 0).concat([[null, 0, 0, 0, () => ({ shirt: [240, 240, 244], pants: [230, 230, 236], skin: [240, 240, 244], sweat: true, mouth: 'open', eyes: 'wide', hat: 'fullmask', hatCol: [244, 244, 248], maskEyes: 'big' })], ['illuminati', 1.3, 0.2, -0.6, { mouth: 'grin', arms: [0.15, 1.0] }]]),
          tags: [[-0.9, 2.45, -0.4, 'PLAN A', V('plan', 'plan'), 'yellow'], [0, 0.35, 0.6, 'VERY SWEATY', V('plan', 'sweaty'), 'orange']] },
        budget: { set: 'office', cam: 'mid', shake: V('budget', 'real'),
          cast: [['illuminati', 0, -1.1, 0, (t) => ({ arms: [0.15, 1.3], hold: 'phone', eyes: t > V('budget', 'more') ? 'wide' : 'open', mouth: t > V('budget', 'more') ? 'o' : 'flat' })]],
          tags: [[-0.8, 2.45, -0.5, 'FAKE MOON: $$$$', V('budget', 'fake'), 'red'], [0.8, 0.35, 0.4, 'REAL MOON: $$', V('budget', 'real'), 'green']], sfx: [['coin', V('budget', 'budget'), { gain: 0.5 }]] },
        moon: { set: 'moon', cam: 'wide',
          props: (S) => { camRig(S, 1.2, 0.6); missile(S, -1.8, 0, -1.4, 1.6, 0, 0, [236, 236, 240], [40, 70, 170]); },
          cast: [[null, 0, 0, 0, (t) => ({ shirt: [240, 240, 244], pants: [230, 230, 236], hat: 'fullmask', hatCol: [244, 244, 248], maskEyes: 'big', walk: t * 3, bob: Math.abs(Math.sin(t * 3)) * 0.2 })],
                 ['illuminati', 1.0, 0.2, -0.5, { arms: [0.15, 1.8], mouth: 'grin' }], ['illuminati', -0.9, 0.5, 0.4, { hold: 'phone', arms: [0.15, 1.6] }]],
          tags: [[0, 2.45, -0.4, 'TAKE 1', V('moon', 'filmed'), 'dark']], sfx: [['shutter', V('moon', 'filmed'), { gain: 0.5 }]] },
        twist: { set: 'moon', cam: 'wide', shake: V('twist', 'rocket'),
          props: (S, t) => { const up = Math.max(0, t - V('twist', 'rocket')); missile(S, -1.8, up * up * 1.5, -1.4, 1.6, 0, up > 0 ? 1 : 0, [236, 236, 240], [40, 70, 170]); },
          cast: [['illuminati', 1.0, 0.2, -0.5, (t) => ({ arms: t > V('twist', 'rocket') ? [2.6, 2.6] : [0.15, 1.8], mouth: t > V('twist', 'rocket') ? 'open' : 'grin', eyes: t > V('twist', 'rocket') ? 'wide' : 'open' })],
                 [null, 0, 0, 0, (t) => ({ shirt: [240, 240, 244], pants: [230, 230, 236], hat: 'fullmask', hatCol: [244, 244, 248], maskEyes: 'big', arms: t > V('twist', 'rocket') ? [2.6, 2.6] : [0.15, 0.15] })]],
          booms: [[-1.8, 0.2, -1.4, V('twist', 'rocket'), 1.2]],
          tags: [[0, 2.45, -0.4, 'CUT!', V('twist', 'cut'), 'red'], [0, 0.35, 0.6, 'LEFT BEHIND', V('twist', 'without'), 'dark']] },
        cta: { set: 'moon', cam: 'mid',
          cast: [['illuminati', -0.6, 0, 0.3, { mouth: 'frown', eyes: 'sleepy', arms: [0.1, 0.1] }], [null, 0.6, 0, -0.3, { shirt: [240, 240, 244], pants: [230, 230, 236], hat: 'fullmask', hatCol: [244, 244, 248], maskEyes: 'big', arms: [0.1, 0.1] }]],
          tags: [[0, 0.35, 0.6, 'DAY 20,000', V('cta', 'still'), 'yellow']] },
      };
    },
  });
