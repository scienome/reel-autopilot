  // ==================== 0016 "One week, she said." ====================
  const MOM = { who: 'mil', x: -0.62, z: -0.42, sit: true, yaw: 0.18 };
  const HER_MOM = (o = {}) => ({ who: 'mil', hair: [70, 50, 40], shirt: [40, 120, 110], pants: [50, 60, 70], face: { lids: 0.2, brows: -0.6, mouth: 'flat' }, ...o });
  const bags = (n, x0, z = 0.35, col = [200, 70, 60]) => (S) => { for (let i = 0; i < n; i++) S.rbox((p) => add(p, [x0 + i * 0.3, 0.3 + (i % 2) * 0.02, z]), 0.12, 0.3, 0.09, i % 2 ? [70, 90, 160] : col, { bevel: 0.3 }); };
  makeCouch({
    keys: ['week', 'suitcases', 'spot', 'remote', 'wifi', 'side', 'nice', 'doorbell', 'mom', 'four', 'war'],
    shots: ({ V }) => ({
      hook: { cam: 'wide', he: { arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } }, she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.4 } },
        extras: [{ who: 'mil', x: 0, z: 0.45, sit: false, yaw: 0, face: { mouth: 'smile', lids: 0.3 } }], props: bags(1, 0.35, 0.5),
        fx: [{ k: 'card', text: '"JUST ONE WEEK"', at: V('hook', 'for'), y: 980, fill: '#2a1a3a' }] },
      day1: { cam: [[0.1, 1.75, 2.7], [0, 1.4, 0.45], [0.08, 1.75, 2.4], [0, 1.42, 0.45]], extras: [{ who: 'mil', x: 0, z: 0.45, sit: false, face: { mouth: 'smile', lids: 0.4 } }], props: bags(3, -0.45, 0.6),
        fx: [{ k: 'stamp', text: 'DAY 1', x: 360, y: 1000, at: V('day1', 'Day'), col: '#ffd23f' }] },
      day30: { cam: 'wide', he: { sit: false, x: -1.45, z: -0.1, arms: 'shrug', face: { mouth: 'o', brows: 0.5 } }, she: { arms: 'clasp', face: { lids: 0.5, mouth: 'flat' } },
        extras: [MOM], fx: [{ k: 'stamp', text: 'DAY 30', x: 360, y: 1010, at: V('day30', 'Day'), col: '#ffd23f' }, { k: 'q', who: 'he', at: V('day30', 'spot') }] },
      day90: { cam: [[-0.45, 1.45, 1.75], [-0.62, 1.15, -0.42], [-0.47, 1.45, 1.5], [-0.62, 1.17, -0.42]], extras: [{ ...MOM, face: { lids: 0.4, mouth: 'smile' }, arms: 'hold' }],
        props: (S, t, u, he, she) => remote(S, [-0.5, 0.86, -0.1], [0, 0.2, 1]),
        fx: [{ k: 'card', text: 'WIFI: MOMSHOUSE', at: V('day90', 'And'), y: 1000, fill: '#1c1a2a' }] },
      side: { cam: 'two', he: { arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } }, she: { arms: 'shrug', face: { mouth: 'open', brows: -0.6 } },
        extras: [{ ...MOM, x: -1.5, z: 0.0, sit: false, yaw: 0.6, arms: 'cheer', face: { mouth: 'open', eyes: 'happy' } }],
        fx: [{ k: 'stamp', text: '2 VS 1', x: 360, y: 990, at: V('side', 'She'), col: '#f47aa6' }], nope: V('side', 'side') },
      day400: { cam: 'him', he: { arms: 'hug', face: { eyes: 'happy', mouth: 'smile', blush: 0.4 } }, fx: [{ k: 'sparkle', who: 'he', at: V('day400', 'He') }] },
      herface: { beat: 'day400', word: 'Isn\'t', cam: 'her', she: { arms: 'clasp', face: { lids: 0.55, mouth: 'smile', brows: -0.5 } }, fx: [{ k: 'smug', who: 'she', at: V('day400', 'nice') }] },
      bell: { cam: 'wide', set: 'living', he: { arms: 'rest', face: { look: [0.5, 0], mouth: 'o' } }, she: { arms: 'rest', face: { mouth: 'smile', lids: 0.5 } }, extras: [{ ...MOM, x: -1.5, sit: false, z: 0 }],
        fx: [{ k: 'q', text: '!', x: 560, y: 760, at: V('bell', 'Doorbell') }], flash: [V('bell', 'Doorbell')] },
      twist: { cam: [[0.3, 1.75, 2.7], [0.2, 1.4, 0.45], [0.28, 1.75, 2.4], [0.2, 1.42, 0.45]], extras: [HER_MOM({ x: 0.2, z: 0.45, sit: false })], props: bags(4, -0.55, 0.6, [60, 140, 90]), twist: V('twist', 'Her'),
        fx: [{ k: 'stamp', text: '4 SUITCASES', x: 360, y: 1010, at: V('twist', 'Four'), col: '#ffd23f', rot: -0.08 }] },
      close: { cam: 'wide', he: { sit: false, x: 0, z: 0.55, arms: 'head', face: { eyes: 'wide', mouth: 'o', brows: 0.8 } }, she: { arms: 'clasp', face: { lids: 0.5, mouth: 'smile' } },
        extras: [{ ...MOM, face: { brows: -0.8, mouth: 'flat' }, yaw: 0.6 }, HER_MOM({ x: 1.55, z: -0.1, sit: false, yaw: -0.7 })],
        fx: [{ k: 'sweat', who: 'he', at: V('close', 'Welcome') }, { k: 'card', text: 'DAY 402: ???', at: V('close', 'cold'), y: 1000, fill: '#5a1020' }] },
    }),
  });
