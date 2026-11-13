// tb3d-012-villain-hero Thought Bubble 3D (k.tb template): They fight on the news. Then they go home… together. 🦹🦸
STORY((k) => k.tb({ hook: 'THEY FIGHT ON THE NEWS.\nTHEN THEY GO HOME… *TOGETHER*.', tag: 'TAG YOUR FLATMATE 👇', cast: { gloom: { body: 'm', look: 'd', costume: 'villain' }, bright: { body: 'm', look: 'e', costume: 'hero' } },
  sets: { st: { type: 'street', night: true, at: { gloom: [-0.6, 1.8, 0.6, 0.18], bright: [0.8, 1.6, -0.6, 0.18] } },
   liv: { type: 'living', at: { gloom: [-0.6, 0.6, 0.3], bright: [0.6, 0.6, -0.3] }, props: [['sofa', 0, 0, -1.5, 0], ['tv', 0, 0.55, -2.3, 0]] },
   kit: { type: 'kitchen', at: { gloom: [-0.3, 0.3, 0.3], bright: [0.8, 0.5, -0.4] } } },
  shots: { hook: { set: 'st', cam: 'two', noBubble: true, card: '🔴 LIVE · BREAKING NEWS', cardBg: '#d8202a', pose: { gloom: 'attack', bright: 'attack' } }, fight: { set: 'st', boom: ['POW!', 0.5] }, home: { set: 'liv' },
   plan: { set: 'kit', dark: true }, twist: { set: 'liv', note: ['DEAR LANDLORD.\nFIX THE HEATER.\nOR ELSE.', '— Dr. Gloom 😈'], pose: { bright: 'dance' } }, outro: { set: 'liv', cam: 'wide' } } }), { assets: [...(window.TB_ASSETS || []), 'mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/ual1'] });
