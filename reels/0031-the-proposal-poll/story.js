  // ==================== 0031 "The proposal poll." ====================
  const R5 = { set: 'restaurant' };
  const ring = (S, t, u, he) => { if (!he) return; const m = midHands(he); S.rbox((p) => add(p, [m[0], m[1] + 0.05, m[2] + 0.05]), 0.06, 0.04, 0.06, [200, 40, 60], { bevel: 0.3 }); S.ball([m[0], m[1] + 0.11, m[2] + 0.05], 0.025, [220, 240, 255], { gloss: 0.9 }); };
  const KNEEL = { sit: false, x: -0.55, z: -0.1, yaw: 0.45, arms: 'hold' };
  const poll = (a, b, who) => (c, w, h) => { c.fillStyle = '#f4f2f7'; c.fillRect(0, 0, w, h); c.fillStyle = '#1c1a22'; c.font = FONT(900, h * 0.06); c.textAlign = 'center'; c.fillText('MARRY HIM?', w / 2, h * 0.16);
    [['YES', a, '#3cc46a'], ['NO', b, '#ec3a32']].forEach(([l, v, col], i) => { c.fillStyle = '#ddd'; c.fillRect(w * 0.1, h * (0.3 + i * 0.22), w * 0.8, h * 0.14); c.fillStyle = col; c.fillRect(w * 0.1, h * (0.3 + i * 0.22), w * 0.8 * v, h * 0.14); c.fillStyle = '#1c1a22'; c.font = FONT(800, h * 0.05); c.fillText(l + ' ' + Math.round(v * 100) + '%', w / 2, h * (0.39 + i * 0.22)); }); if (who) { c.fillText(who, w / 2, h * 0.9); } };
  makeCouch({
    keys: ['knee', 'marry', 'ring', 'think', 'poll', 'votes', 'fifty-fifty', 'kneeling', 'deciding', 'mom', 'no', 'spite'],
    shots: ({ V }) => ({
      hook: { ...R5, cam: 'wide', opt: { table: false }, he: { outfit: 'suit', ...KNEEL, face: { mouth: 'smile', eyes: 'happy' } }, she: { outfit: 'dress', sit: false, arms: 'cheeks', face: { eyes: 'wide', mouth: 'o', blush: 0.6 } }, props: ring, fx: [{ k: 'hearts', at: V('hook', 'knee'), n: 5, y: 600 }] },
      ask: { ...R5, cam: 'two', opt: { table: false }, he: { outfit: 'suit', ...KNEEL, face: { mouth: 'open', eyes: 'happy', blush: 0.4 } }, she: { hide: true }, props: ring, fx: [{ k: 'bubble', text: 'Will you marry me?', x: 360, y: 860, at: V('ask', 'Will'), side: -1 }] },
      think: { ...R5, cam: 'her', opt: { table: false }, she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'flat', lids: 0.4, look: [-0.4, -0.4] } }, he: { hide: true }, fx: [{ k: 'q', who: 'she', at: V('think', 'think') }] },
      poll: { ...R5, cam: 'her', opt: { table: false }, she: { outfit: 'dress', arms: 'phone', face: { mouth: 'smile', lids: 0.5 } }, sheHold: () => poll(0, 0), he: { hide: true }, fx: [{ k: 'stamp', text: 'POSTED', x: 360, y: 1000, at: V('poll', 'posts'), col: '#3d8bf2' }] },
      votes: { ...R5, cam: 'her', opt: { table: false }, she: { outfit: 'dress', arms: 'phone', face: { mouth: 'o', eyes: 'wide' } }, sheHold: () => poll(0.5, 0.5), he: { hide: true }, fx: [{ k: 'buzz', who: 'she', at: V('votes', 'pour') }, { k: 'stamp', text: '50 / 50', x: 360, y: 1000, at: V('votes', 'Fifty-fifty'), col: '#ffd23f' }] },
      waits: { ...R5, cam: 'wide', opt: { table: false }, he: { outfit: 'suit', ...KNEEL, face: { mouth: 'frown', eyes: 'closed', brows: 0.8 } }, she: { outfit: 'dress', sit: false, arms: 'phone', face: { mouth: 'flat' } }, sheHold: true, props: ring,
        fx: [{ k: 'card', text: '10 MINUTES LATER', at: V('waits', 'Ten'), y: 990, fill: '#2a1a3a' }, { k: 'sweat', who: 'he', at: V('waits', 'knee') }] },
      twist: { ...R5, cam: 'her', opt: { table: false }, she: { outfit: 'dress', arms: 'phone', face: { eyes: 'wide', mouth: 'open', brows: 0.9 } }, sheHold: () => poll(0.49, 0.51, 'LAST VOTE: HIS MOM'), he: { hide: true }, twist: V('twist', 'No'),
        fx: [{ k: 'stamp', text: 'HIS MOM: NO', x: 360, y: 1010, at: V('twist', 'mom'), col: '#ff4a4a', rot: -0.1 }] },
      close: { ...R5, cam: 'wide', opt: { table: false }, he: { outfit: 'suit', sit: false, x: -0.5, z: 0.4, arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } }, she: { outfit: 'dress', sit: false, x: 0.5, z: 0.4, arms: 'cheer', face: { mouth: 'smile', lids: 0.5, brows: -0.7 } },
        fx: [{ k: 'card', text: 'YES. OUT OF SPITE.', at: V('close', 'spite'), y: 1000, fill: '#5a1020' }, { k: 'hearts', at: V('close', 'yes'), n: 4, y: 600 }] },
    }),
  });
