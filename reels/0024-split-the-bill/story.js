  // ==================== 0024 "Let's split it." ====================
  const R = { set: 'restaurant' };
  const food = (n) => (S) => { const cols = [[230, 80, 60], [150, 90, 60], [250, 220, 200], [240, 180, 200], [200, 120, 80], [120, 70, 50]]; for (let i = 0; i < n; i++) S.ball([0.2 + (i % 3) * 0.17, 0.79, 0.12 + Math.floor(i / 3) * 0.17], [0.07, 0.04, 0.07], cols[i % 6], { gloss: 0.4 }); };
  const salad = (S) => S.ball([-0.45, 0.78, 0.22], [0.06, 0.025, 0.06], [120, 200, 100]);
  const bill = (len) => (S) => S.rbox((p) => add(p, [-0.2, 0.76, 0.3 + len / 2]), 0.08, 0.003, len / 2, [252, 250, 240], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = 'rgba(30,30,40,0.55)'; for (let i = 0; i < 40; i++) c.fillRect(w * 0.1, (i * h) / 40 + 2, w * 0.6, 2); } });
  const WAITER = (o = {}) => ({ who: 'waiter', x: 1.0, z: 0.6, yaw: -0.5, sit: false, arms: 'hold', face: { mouth: 'smile' }, ...o });
  const card = (c, w, h) => { c.fillStyle = '#2a3a8a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.fillRect(w * 0.1, h * 0.3, w * 0.25, h * 0.18); c.fillStyle = '#ffffff'; c.font = FONT(800, h * 0.12); c.textAlign = 'left'; c.fillText('HIS', w * 0.1, h * 0.8); };
  makeCouch({
    keys: ['split', 'bill', 'menu', 'lobster', 'steak', 'desserts', 'salad', 'arm', 'fifty', 'card', 'accounts'],
    shots: ({ V }) => ({
      hook: { ...R, cam: 'wide', he: { outfit: 'suit', arms: 'shrug', face: { mouth: 'smile', lids: 0.3 } }, she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'flat', lids: 0.5 } }, fx: [{ k: 'bubble', text: "Let's split it!", who: 'he', at: V('hook', 'split'), side: -1 }] },
      menu: { ...R, cam: 'her', she: { outfit: 'dress', arms: 'hold', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, fx: [{ k: 'smug', who: 'she', at: V('menu', 'smiles') }] },
      order: { ...R, cam: 'wide', he: { outfit: 'suit', arms: 'clasp', face: { eyes: 'wide', mouth: 'o' } }, she: { outfit: 'dress', arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } }, extras: [WAITER()], props: (S, t, u) => food(1 + Math.floor(5 * u))(S),
        fx: [{ k: 'stamp', text: 'LOBSTER', x: 360, y: 980, at: V('order', 'Lobster'), col: '#ff6a5a' }, { k: 'stamp', text: '+3 DESSERTS', x: 360, y: 1060, at: V('order', 'Three'), col: '#ffd23f' }] },
      him: { ...R, cam: 'him', he: { outfit: 'suit', arms: 'clasp', face: { mouth: 'frown', brows: 0.6 } }, props: salad, fx: [{ k: 'sweat', who: 'he', at: V('him', 'salad') }] },
      bill: { ...R, cam: [[0, 1.8, 1.6], [0, 0.78, 0.45], [0, 1.75, 1.35], [0, 0.8, 0.45]], props: (S, t, u) => { food(6)(S); salad(S); bill(0.2 + 0.8 * u)(S); }, fx: [{ k: 'card', text: 'TOTAL: OUCH', at: V('bill', 'longer'), y: 1000, fill: '#5a1020' }] },
      fifty: { ...R, cam: 'her', she: { outfit: 'dress', arms: 'shrug', face: { mouth: 'smile', lids: 0.5 } }, fx: [{ k: 'stamp', text: '50 / 50', x: 360, y: 1000, at: V('fifty', 'Fifty-fifty'), col: '#9aff6a' }] },
      twist: { ...R, cam: 'wide', he: { outfit: 'suit', arms: 'reach', face: { eyes: 'wide', mouth: 'open', brows: 0.9 } }, she: { outfit: 'dress', arms: 'phone', face: { mouth: 'smile', lids: 0.5 } }, sheHold: () => card, extras: [WAITER({ face: { mouth: 'o' } })], twist: V('twist', 'His'),
        fx: [{ k: 'stamp', text: 'HIS CARD', x: 360, y: 1010, at: V('twist', 'His'), col: '#ff4a4a', rot: -0.1 }] },
      close: { ...R, cam: 'two', he: { outfit: 'suit', arms: 'head', face: { mouth: 'frown', eyes: 'closed', brows: 0.8 } }, she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'smile', lids: 0.5 } },
        fx: [{ k: 'card', text: 'CHECKING + SAVINGS', at: V('close', 'accounts'), y: 1000, fill: '#2a1a3a' }] },
    }),
  });
