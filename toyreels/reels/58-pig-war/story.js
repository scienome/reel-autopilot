  // ==================== true stories in bricks: 58-pig-war ====================
  makeComedy({
    badge: 'TRUE STORY', badgeCol: '#1f4f8f',
    captions: { say: {"eighteen fifty nine": "1859", "twelve": "12"}, keys: {"pig": "y", "war": "r", "potatoes": "o", "warships": "b", "admiral": "b", "only": "r", "germany": "y", "shot": "r"} },
    beats: ({ V }) => {
      // ---- shared brick helpers (animals, small props, people) ----
      const bx = (S, x, y, z, s, ry, dx, dy, dz, hx, hy, hz, c, bev = 0.3) => S.box((p) => add(rotY(mul(add(p, [dx, dy, dz]), s), ry), [x, y, z]), hx, hy, hz, c, { bevel: bev });
      const quad = (S, x, y, z, s, ry, c, o = {}) => {
        const B = (...a) => bx(S, x, y, z, s, ry, ...a);
        const hy = o.hy || 0.2, bob = o.bob || 0;
        B(0, 0.5 + bob, 0, 0.3, hy + 0.05, 0.5, c);
        B(0, 0.72 + bob, 0.58, 0.19, 0.17, 0.17, o.headCol || c);
        if (o.snout) B(0, 0.66 + bob, 0.78, 0.1, 0.07, 0.07, o.snout);
        B(-0.07, 0.8 + bob, 0.72, 0.03, 0.03, 0.03, [20, 20, 24], 0.5); B(0.07, 0.8 + bob, 0.72, 0.03, 0.03, 0.03, [20, 20, 24], 0.5);
        for (const a of [-1, 1]) { const eh = o.ears === 'long' ? 0.32 : 0.09; B(a * 0.11, 0.9 + eh + bob, 0.5, 0.04, eh, 0.03, o.earCol || c); for (const d of [-1, 1]) B(a * 0.2, 0.17, d * 0.36, 0.06, 0.17 + 0.0, 0.06, o.legCol || c); }
        B(0, 0.55 + bob, -0.54, 0.05, 0.05, 0.05, o.tail || c);
      };
      const emu = (S, x, z, s, t, ry = 0, run = 0) => {
        const w = Math.sin(t * 9) * 0.1 * run, B = (...a) => bx(S, x, w, z, s, ry, ...a), br = [120, 94, 74];
        B(0, 0.95, 0, 0.3, 0.26, 0.4, br); B(0, 1.0, -0.42, 0.18, 0.2, 0.12, [96, 74, 58]);
        B(0, 1.6, 0.36, 0.05, 0.38, 0.05, [150, 130, 104]); B(0, 2.02, 0.42, 0.09, 0.07, 0.13, br); B(0, 2.0, 0.58, 0.035, 0.03, 0.06, [230, 170, 60]);
        B(-0.07, 2.08, 0.5, 0.025, 0.025, 0.025, [255, 255, 255], 0.5); B(0.07, 2.08, 0.5, 0.025, 0.025, 0.025, [255, 255, 255], 0.5);
        for (const a of [-1, 1]) B(a * 0.14, 0.42 + a * w * 0.6, 0, 0.045, 0.42, 0.045, [160, 140, 110]);
      };
      const pig = (S, x, y, z, s, ry, bob = 0) => quad(S, x, y, z, s, ry, [248, 170, 180], { snout: [236, 130, 148], tail: [236, 130, 148], bob });
      const rabbit = (S, x, y, z, s, ry, bob = 0) => quad(S, x, y, z, s, ry, [240, 236, 228], { ears: 'long', earCol: [250, 190, 200], tail: [255, 255, 255], bob });
      const bearAn = (S, x, y, z, s, ry) => quad(S, x, y, z, s, ry, [110, 76, 50], { hy: 0.34, snout: [150, 112, 80] });
      const hen = (S, x, y, z, s, ry, head = true, t = 0) => {
        const B = (...a) => bx(S, x, y, z, s, ry, ...a), w = [250, 250, 245];
        B(0, 0.45, 0, 0.26, 0.24, 0.3, w); B(0, 0.5, -0.3, 0.1, 0.2, 0.1, [230, 230, 220]);
        B(0, 0.78, 0.2, 0.08, 0.16, 0.08, w);
        if (head) { B(0, 1.02, 0.26, 0.1, 0.1, 0.1, w); B(0, 1.14, 0.26, 0.03, 0.06, 0.07, [220, 40, 40]); B(0, 1.0, 0.4, 0.04, 0.03, 0.05, [240, 180, 40]); }
        else { B(0, 0.98, 0.2, 0.06, 0.04, 0.06, [200, 60, 60]); }
        for (const a of [-1, 1]) B(a * 0.1, 0.13 + Math.max(0, Math.sin(t * 12 + a)) * 0.04, 0, 0.03, 0.13, 0.03, [240, 180, 40]);
      };
      const bucket = (S, x, y, z, s = 1) => { S.cyl((p) => add(mul(p, s), [x, y, z]), 0.26, 0.4, [140, 100, 64], 14); S.box((p) => add(mul(p, s), [x, y + 0.5, z]), 0.26, 0.03, 0.03, [60, 60, 66], { bevel: 0.4 }); };
      const coin = (S, x, y, z, s = 1, spin = 0) => S.cyl((p) => add(rotY(rotX(mul(p, s), Math.PI / 2), spin), [x, y, z]), 0.2, 0.05, [250, 190, 40], 16);
      const crate = (S, x, y, z, s = 1, c = [150, 110, 70]) => S.box((p) => add(mul(p, s), [x, y + 0.2 * s, z]), 0.22, 0.2, 0.22, c, { bevel: 0.15 });
      const shell = (S, x, y, z, s = 1) => { S.cyl((p) => add(mul(p, s), [x, y, z]), 0.09, 0.32, [190, 160, 70], 10); S.cyl((p) => add(mul(p, s), [x, y + 0.32, z]), 0.05, 0.1, [190, 60, 50], 10); };
      const pizza = (S, x, y, z, s = 1) => { S.cyl((p) => add(mul(p, s), [x, y, z]), 0.4, 0.05, [236, 190, 100], 16); for (const [a, b] of [[0.1, 0.1], [-0.2, 0.05], [0.0, -0.22], [0.22, -0.12], [-0.12, -0.2]]) S.cyl((p) => add(mul(p, s), [x + a * s, y + 0.05 * s, z + b * s]), 0.07, 0.03, [200, 50, 40], 10); };
      const micro = (S, x, y, z, s = 1, glow = 0) => { S.box((p) => add(mul(p, s), [x, y + 0.3 * s, z]), 0.5, 0.3, 0.32, [222, 218, 206], { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#3a3f4a'; c.fillRect(w * 0.08, h * 0.15, w * 0.6, h * 0.7); c.fillStyle = 'rgba(255,200,60,' + glow + ')'; c.fillRect(w * 0.1, h * 0.2, w * 0.56, h * 0.6); c.fillStyle = '#9aa'; c.fillRect(w * 0.76, h * 0.2, w * 0.16, h * 0.2); } }); };
      const rockP = (S, x, y, z, s = 1, eyes = true) => { S.box((p) => add(mul(p, s), [x, y + 0.2 * s, z]), 0.3, 0.2, 0.25, [128, 128, 134], { bevel: 0.5, paint: eyes ? (c, w, h) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(w * 0.38, h * 0.4, w * 0.07, 0, 6.3); c.arc(w * 0.62, h * 0.4, w * 0.07, 0, 6.3); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(w * 0.39, h * 0.42, w * 0.03, 0, 6.3); c.arc(w * 0.61, h * 0.42, w * 0.03, 0, 6.3); c.fill(); } : undefined }); };
      const giantStone = (S, x, y, z, s = 1) => { const G = [172, 170, 160]; const B = (dx, dy, dz, hx, hy, hz) => S.box((p) => add(mul(add(p, [dx, dy, dz]), s), [x, y, z]), hx, hy, hz, G, { bevel: 0.3 });
        B(0, 0.15, 0, 0.3, 0.15, 0.9); B(0, 0.2, 1.05, 0.2, 0.18, 0.2); B(-0.14, 0.12, -1.0, 0.1, 0.1, 0.16); B(0.14, 0.12, -1.0, 0.1, 0.1, 0.16); B(-0.42, 0.2, 0.3, 0.1, 0.1, 0.5); B(0.42, 0.2, 0.3, 0.1, 0.1, 0.5); };
      const smoke = (S, x, y, z, t, n = 7, col = [120, 170, 60]) => { for (let i = 0; i < n; i++) { const a = i * 2.4 + t * 0.7; S.box((p) => add(p, [x + Math.cos(a) * (0.6 + i * 0.12), y + (i % 3) * 0.28 + Math.sin(t * 2 + i) * 0.05, z + Math.sin(a) * 0.3]), 0.3 + (i % 2) * 0.1, 0.2, 0.2, col, { bevel: 0.6 }); } };
      const chair = (S, x, z, c = [140, 40, 50]) => { S.box((p) => add(p, [x, 0.4, z]), 0.34, 0.06, 0.3, c, { bevel: 0.2 }); S.box((p) => add(p, [x, 0.95, z - 0.28]), 0.34, 0.5, 0.05, c, { bevel: 0.2 }); for (const a of [-1, 1]) for (const d of [-1, 1]) S.box((p) => add(p, [x + a * 0.28, 0.17, z + d * 0.24]), 0.04, 0.17, 0.04, [80, 50, 30], { bevel: 0.2 }); };
      const man = (x, z, ex = {}) => [null, x, z, ex.rot || 0, Object.assign({ shirt: [150, 110, 80], pants: [70, 70, 80], hair: 'short', hairCol: [60, 44, 34], mouth: 'smile' }, ex)];
      const sign = (S, x, y, z, w, h, txt, bg = '#f4ead0', fg = '#222') => S.box((p) => add(p, [x, y, z]), w, h, 0.03, [244, 234, 208], { bevel: 0.2, paint: (c, cw, ch) => { c.fillStyle = bg; c.fillRect(0, 0, cw, ch); c.fillStyle = fg; c.font = FONT(800, ch * 0.34); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, cw / 2, ch / 2); } });
      const S_ = (x, z, ex = {}) => man(x, z, Object.assign({ hat: 'army', shirt: [40, 60, 130], pants: [40, 60, 130], hold: 'gun' }, ex));
      const R_ = (x, z, ex = {}) => man(x, z, Object.assign({ hat: 'army', shirt: [190, 40, 40], pants: [230, 230, 230], hold: 'gun' }, ex));
      const FARM = { night: 0 };
      return {
        hook: { set: 'lawn', opt: FARM, cam: 'wide', props: (S, t) => { pig(S, 0.1, 0, -0.2, 1.0, 0.3, Math.abs(Math.sin(t * 4)) * 0.03); }, cast: [S_(-1.4, 0.3, { rot: 0.5 }), R_(1.4, 0.3, { rot: -0.5 })], tags: [[0, 2.55, 0.1, 'WAR OVER A PIG', V('hook', 'pig'), 'red', 1.4]] },
        b1: { set: 'lawn', opt: FARM, cam: 'mid', props: (S, t) => { pig(S, 0.9, 0, -0.1, 1.0, -0.6, 0); for (let i = 0; i < 4; i++) S.box((p) => add(p, [0.3 + i * 0.35, 0.08, 0.7]), 0.12, 0.08, 0.1, [190, 140, 80], { bevel: 0.6 }); }, cast: [man(-0.6, 0.2, { mouth: 'angry', brows: 'angry', hold: 'gun', arms: [1.5, 1.5], shirt: [90, 70, 120] })],
          tags: [[0, 2.5, 0, 'MY POTATOES!', V('b1', 'potatoes'), 'orange', 1.3]], booms: [[0.2, 1.3, 0.3, V('b1', 'shot'), 0.4]] },
        b2: { set: 'lawn', opt: FARM, cam: 'mid', props: (S, t) => { pig(S, 0.7, 0, 0, 1.0, -0.4, 0); }, cast: [man(-0.6, 0.2, { mouth: 'frown', brows: 'angry', shirt: [190, 40, 40], hat: 'tophat', arms: [0.4, 2.3] })], tags: [[0, 2.5, 0, 'BRITISH PIG', V('b2', 'british'), 'blue', 1.2]] },
        b3: { set: 'sky', cam: 'wide', props: (S, t) => { S.box((p) => add(p, [-1.1, 0.35, 0.2]), 0.9, 0.18, 0.28, [120, 80, 50], { bevel: 0.4 }); S.box((p) => add(p, [-1.1, 1.0, 0.2]), 0.03, 0.6, 0.03, [90, 60, 40]); S.box((p) => add(p, [-1.1, 1.05, 0.25]), 0.28, 0.36, 0.02, [240, 240, 230], { bevel: 0.2 }); }, cast: [S_(0.9, 0.5, { arms: [1.5, 1.5] }), S_(1.5, 0.3)],
          tags: [[0, 2.55, 0.2, 'WARSHIPS ARRIVE', V('b3', 'warships'), 'blue', 1.5]], sfx: [['thud', V('b3', 'arrived'), { gain: 0.6 }]] },
        b4: { set: 'palace', cam: 'close', props: (S, t) => {}, cast: [man(0, 0.1, { hat: 'peaked', shirt: [30, 40, 90], pants: [30, 40, 90], medals: 5, mustache: 'big', hairCol: [230, 230, 230], mouth: 'flat', brows: 'raised', arms: [0.3, 1.3] })], tags: [[0, 2.45, -0.3, 'NOT FOR A PIG', V('b4', 'pig'), 'blue', 1.3]] },
        twist: { set: 'lawn', opt: FARM, cam: 'mid', props: (S, t) => { pig(S, 0.5, 0.0, 0, 1.1, -0.3, 0); }, cast: [man(-0.8, 0.2, { eyes: 'x', mouth: 'o', arms: [0.2, 0.2], hold: 'flag', holdCol: [255, 255, 255] })], tags: [[0, 2.5, 0, 'ONLY CASUALTY', V('twist', 'casualty'), 'red', 1.4], [0.5, 1.3, 0.3, 'THE PIG', V('twist', 'pig'), 'yellow', 1.0]] },
        punch: { set: 'lawn', opt: FARM, cam: 'wide', props: (S, t) => { S.box((p) => add(p, [0, 0.25, -0.6]), 0.9, 0.25, 0.12, [140, 100, 60], { bevel: 0.3 }); }, cast: [S_(-1.0, 0.4, { mouth: 'grin' }), R_(0.1, 0.4, { mouth: 'grin' }), man(1.2, 0.2, { hat: 'peaked', medals: 5, mustache: 'big', shirt: [90, 90, 100], pants: [90, 90, 100], arms: [0.3, 2.3] })], tags: [[0, 2.55, 0.2, '12 YEARS SHARED', V('punch', 'twelve'), 'green', 1.5]] },
        cta: { set: 'lawn', opt: FARM, cam: 'mid', props: (S, t) => { pig(S, 0.7, 0, 0, 1.0, -0.3, Math.abs(Math.sin(t * 4)) * 0.03); }, cast: [S_(-0.8, 0.2, { mouth: 'smile' })], tags: [[0, 0.42, 0.7, 'WOULD YOU SHOOT THE PIG?', V('cta', 'pig'), 'yellow', 1.7]] },
      };
    },
  });
