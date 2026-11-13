// tb3d-024-useless-power Thought Bubble 3D (k.tb template): He's invisible. But only when nobody's looking. 🫥
STORY((k) => k.tb({ hook: "HE'S *INVISIBLE*.\nBUT ONLY WHEN NOBODY'S LOOKING.", tag: "TAG WHO'D GET THIS POWER 👇", cast: { kabir: { body: 'm', look: 'b' }, friend: { body: 'f', look: 'c' }, mum: { body: 'f', look: 'd' }, dog: { animal: 'dog', h: 0.7 }, ghost: { ghost: true } },
  sets: { st: { type: 'chai', at: { kabir: [-0.4, 1.9, 0.6, 0.18], friend: [0.8, 1.8, -0.6, 0.18] } },
   bed: { type: 'bedroom', at: { kabir: [0.3, -0.6, 0.2], mum: [-1.2, 0.6, 0.6], dog: [0.9, 0.7, -0.8], ghost: [-1.4, 1.0, 0.4] }, props: [['chair', -1.5, 0, -0.6, 0.4]] } },
  shots: { hook: { set: 'bed', cam: 'two', noBubble: true, hide: ['mum', 'ghost'], move: (t, kk, a) => { a.kabir.visible = Math.sin(t * 9) > -0.2 || kk > 0.6; } }, st: { set: 'st' },
   room: { set: 'bed', cam: 'two', hide: ['mum', 'kabir', 'ghost'] }, call: { set: 'bed', hide: ['ghost'] },
   twist: { set: 'bed', hide: ['mum', 'kabir'] }, outro: { set: 'bed', cam: 'wide', hide: ['mum', 'kabir', 'ghost'] } } }), { assets: [...(window.TB_ASSETS || []), 'mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/ual1', 'animals/dog'] });
