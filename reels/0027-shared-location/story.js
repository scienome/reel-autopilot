  // ==================== 0027 "Shared location." ====================
  const MALL = { set: 'mall', opt: { signs: ['MASSAGE', 'SALE 70%', 'FOOD'] } };
  const pin = (label) => (c, w, h) => { c.fillStyle = '#e8eef2'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8d0d8'; c.lineWidth = 4; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, (i * h) / 6); c.lineTo(w, (i * h) / 6 + 20); c.stroke(); } c.fillStyle = '#ec3a32'; c.beginPath(); c.arc(w / 2, h * 0.42, w * 0.14, 0, TAU); c.fill(); c.fillStyle = '#1c1a22'; c.font = FONT(900, h * 0.07); c.textAlign = 'center'; c.fillText(label, w / 2, h * 0.75); };
  const chair = (x) => (S) => { S.rbox((p) => add(p, [x, 0.35, -0.55]), 0.38, 0.32, 0.38, [40, 40, 48], { bevel: 0.3 }); S.rbox((p) => add(p, [x, 0.95, -0.85]), 0.36, 0.4, 0.1, [40, 40, 48], { bevel: 0.4 }); };
  const SLEEP = { sit: true, arms: 'slump', face: { eyes: 'closed', mouth: 'open' } };
  makeCouch({
    keys: ['working', 'late', 'mall', 'keys', 'storms', 'war', 'asleep', 'massage', 'mom', 'dad', 'hiding', 'over'],
    shots: ({ V }) => ({
      hook: { cam: 'her', he: { hide: true }, she: { arms: 'phone', face: { mouth: 'flat', lids: 0.5, brows: -0.8 } }, sheHold: () => pin('MALL'),
        fx: [{ k: 'bubble', text: 'Working late, babe', x: 300, y: 720, at: V('hook', 'working'), side: -1 }, { k: 'q', who: 'she', at: V('hook', 'mall') }] },
      drive: { set: 'car', cam: 'her', he: { hide: true }, she: { arms: [[1.2, 0.05, 0.4], [1.2, 0.05, 0.4]], face: { mouth: 'frown', brows: -0.9 } }, fx: [{ k: 'speed', x: 360, y: 640, at: V('drive', 'grabs') }] },
      mall: { ...MALL, cam: 'wide', he: { hide: true }, she: { x: 0, z: 0.4, arms: 'cheer', face: { mouth: 'open', brows: -0.9 } }, fx: [{ k: 'stamp', text: 'READY FOR WAR', x: 360, y: 1000, at: V('mall', 'Ready'), col: '#ff4a4a' }] },
      found: { ...MALL, cam: [[-0.75, 1.55, 1.2], [-0.62, 1.25, -0.42], [-0.72, 1.55, 0.95], [-0.62, 1.27, -0.42]], he: { ...SLEEP, x: -0.62, z: -0.42 }, she: { hide: true }, props: chair(-0.62), fx: [{ k: 'zzz', who: 'he', at: V('found', 'Asleep') }, { k: 'card', text: 'MASSAGE CHAIR · 2 HOURS', at: V('found', 'massage'), y: 1000, fill: '#2a1a3a', px: 36 }] },
      why: { ...MALL, cam: [[-0.75, 1.55, 1.2], [-0.62, 1.25, -0.42], [-0.72, 1.55, 0.95], [-0.62, 1.27, -0.42]], he: { sit: true, arms: 'shrug', face: { eyes: 'wide', mouth: 'open', brows: 0.7 } }, she: { hide: true }, props: chair(-0.62), fx: [{ k: 'sweat', who: 'he', at: V('why', 'hiding') }] },
      twist: { ...MALL, cam: 'wide', he: { sit: true, arms: 'shrug', face: { mouth: 'o' } }, she: { hide: true }, extras: [{ who: 'dad', x: 0.62, z: -0.42, ...SLEEP }], props: (S) => { chair(-0.62)(S); chair(0.62)(S); }, twist: V('twist', 'dad'),
        fx: [{ k: 'stamp', text: 'HER DAD', x: 360, y: 1000, at: V('twist', 'dad'), col: '#ffd23f', rot: -0.1 }, { k: 'zzz', who: 'dad', at: V('twist', 'dad') }] },
      close: { ...MALL, cam: [[0, 1.6, 3.4], [0, 1.0, -0.4], [0, 1.6, 3.1], [0, 1.02, -0.4]], he: { ...SLEEP, x: -0.8 }, she: { sit: true, x: 0, arms: 'slump', face: { eyes: 'closed', mouth: 'smile' } }, extras: [{ who: 'dad', x: 0.8, z: -0.42, ...SLEEP }],
        props: (S) => { chair(-0.8)(S); chair(0)(S); chair(0.8)(S); }, fx: [{ k: 'card', text: 'MOM: 37 MISSED CALLS', at: V('close', 'Move'), y: 1000, fill: '#5a1020' }] },
    }),
  });
