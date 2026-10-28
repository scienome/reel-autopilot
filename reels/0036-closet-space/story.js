  // ==================== 0036 "Closet space." ====================
  const BED = { set: 'bedroom' };
  // the closet on the back wall: n of 10 rails are hers (red), the rest his (mustard)
  const closet = (hers) => (S) => { S.rbox((p) => add(p, [0, 1.2, -1.15]), 1.3, 1.0, 0.08, [140, 100, 76], { bevel: 0.1, bg: true });
    for (let i = 0; i < 10; i++) S.rbox((p) => add(p, [-1.1 + i * 0.245, 1.15, -1.07]), 0.09, 0.5, 0.03, i < hers ? [200, 40, 70] : [230, 170, 40], { bevel: 0.3 }); };
  const dogBed = (S) => { S.cyl((p) => add(p, [1.6, 0.06, 0.45]), 0.42, 0.12, [150, 110, 90], 18); for (let i = 0; i < 3; i++) S.rbox((p) => add(p, [1.5 + i * 0.1, 0.18 + i * 0.04, 0.45]), 0.22, 0.02, 0.15, [230, 170, 40], { bevel: 0.3 }); };
  makeCouch({
    keys: ['closet', 'space', 'half', 'quarters', 'one', 'hanger', 'clothes', 'down', 'dog', 'bed', 'hoodie', 'too'],
    shots: ({ V }) => ({
      hook: { ...BED, cam: 'her', he: { hide: true }, she: { sit: false, z: -0.1, arms: 'clasp', face: { mouth: 'smile', eyes: 'happy', brows: 0.5 } }, props: closet(5), fx: [{ k: 'bubble', text: 'Just a little more space?', x: 360, y: 840, at: V('hook', 'needs'), side: 1 }] },
      half: { ...BED, cam: [[0, 1.6, 2.6], [0, 1.15, -1.1], [0, 1.6, 2.3], [0, 1.17, -1.1]], he: { hide: true }, she: { hide: true }, props: closet(5), fx: [{ k: 'stamp', text: 'WEEK 1: 50%', x: 360, y: 1000, at: V('half', 'Week'), col: '#ffd23f' }] },
      more: { ...BED, cam: [[0, 1.6, 2.6], [0, 1.15, -1.1], [0, 1.6, 2.3], [0, 1.17, -1.1]], he: { hide: true }, she: { hide: true }, props: closet(8), fx: [{ k: 'stamp', text: 'WEEK 2: 75%', x: 360, y: 1000, at: V('more', 'Week'), col: '#ff6a5a' }] },
      one: { ...BED, cam: [[0.9, 1.5, 1.3], [1.1, 1.15, -1.1], [0.9, 1.5, 1.1], [1.1, 1.17, -1.1]], he: { hide: true }, she: { hide: true }, props: closet(9), fx: [{ k: 'stamp', text: '1 HANGER', x: 360, y: 1000, at: V('one', 'hanger'), col: '#ff4a4a', rot: -0.1 }] },
      where: { ...BED, cam: 'him', he: { sit: false, z: -0.1, arms: 'shrug', face: { eyes: 'wide', mouth: 'open', brows: 0.8 } }, she: { hide: true }, fx: [{ k: 'q', who: 'he', at: V('where', 'where') }] },
      twist: { ...BED, cam: [[1.2, 1.1, 2.0], [1.6, 0.25, 0.45], [1.25, 1.0, 1.75], [1.6, 0.27, 0.45]], he: { hide: true }, she: { hide: true }, props: dogBed, pets: [{ kind: 'dog', x: 1.6, z: 0.45, yaw: 0.5, col: [230, 170, 40] }], twist: V('twist', 'hoodie'),
        fx: [{ k: 'stamp', text: 'HIS HOODIE', x: 360, y: 1000, at: V('twist', 'hoodie'), col: '#ffd23f', rot: -0.1 }] },
      close: { ...BED, cam: 'wide', he: { sit: false, x: -0.7, z: 0.2, arms: 'head', face: { eyes: 'closed', mouth: 'frown' } }, she: { sit: false, x: 0.2, z: 0.2, arms: 'clasp', face: { mouth: 'smile', lids: 0.5 } }, props: (S) => { closet(10)(S); dogBed(S); }, pets: [{ kind: 'dog', x: 1.6, z: 0.45, yaw: -0.4 }],
        fx: [{ k: 'card', text: 'CLOSET: 100% HERS', at: V('close', 'too'), y: 1000, fill: '#5a1020' }] },
    }),
  });
