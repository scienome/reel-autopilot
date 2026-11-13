// tb3d-019-asteroid-truth Thought Bubble 3D (k.tb template): We have 24 hours left. So I told the truth. ☄️
STORY((k) => k.tb({ hook: 'WE HAVE *24 HOURS* LEFT.\nSO I TOLD THE TRUTH.', tag: "TAG WHO YOU'D CONFESS TO 👇", cast: { arjun: { body: 'm', look: 'b' }, mira: { body: 'f', look: 'e' }, mum: { body: 'f', look: 'd' }, boss: { body: 'm', look: 'f' } },
  sets: { st: { type: 'street', night: true, at: { arjun: [-0.5, 1.8, 0.6, 0.18], mira: [0.7, 1.7, -0.6, 0.18] }, props: [['asteroid', 2.5, 6.5, -6, 0]] },
   kit: { type: 'kitchen', at: { arjun: [-0.4, 0.4, 0.4], mum: [0.7, 0.3, -0.4] } },
   off: { type: 'office', at: { arjun: [-0.6, 0.5, 0.4], boss: [0.7, 0.3, -0.4] } } },
  shots: { hook: { set: 'st', cam: [[0.2, 0.8, 5.0], [0.8, 3.0, -2.0], 50], noCut: true, noBubble: true, dark: true }, news: { set: 'st', card: '🚨 BREAKING: ASTEROID TOMORROW', cardBg: '#d8202a', dark: true, cam: [[0.2, 0.9, 5.0], [0.8, 2.6, -2.0], 48] },
   crush: { set: 'st', dark: true }, mum: { set: 'kit' }, boss: { set: 'off' }, twist: { set: 'st', card: 'UPDATE: IT MISSED. 😐', cardBg: '#2a6ae0', move: (t, kk, a, g) => { const r = g.userData.asteroid; if (r) r.position.set(2.5 + kk * 14, 6.5 + kk * 3, -6); } },
   outro: { set: 'st', cam: 'wide' } } }), { assets: [...(window.TB_ASSETS || []), 'mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/ual1'] });
