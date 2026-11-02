  // ==================== true stories in bricks: 74-dancing-plague-1518 ====================
  makeComedy({
    badge: 'TRUE STORY', badgeCol: '#1f4f8f',
    captions: { say: {"fifteen eighteen": "1518", "four hundred": "400"}, keys: {"dancing": "o", "strasbourg": "b", "dozens": "y", "four": "r", "shrine": "b", "why": "y", "hysteria": "r", "joined": "g"} },
    beats: ({ V }) => {

      const man = (x, z, ex = {}) => [null, x, z, ex.rot || 0, Object.assign({ shirt: [150, 110, 80], pants: [70, 70, 80], hair: 'short', hairCol: [60, 44, 34], mouth: 'smile' }, ex)];
      const sign = (S, x, y, z, w, h, txt, bg = '#f4ead0', fg = '#222') => S.box((p) => add(p, [x, y, z]), w, h, 0.03, [244, 234, 208], { bevel: 0.2, paint: (c, cw, ch) => { c.fillStyle = bg; c.fillRect(0, 0, cw, ch); c.fillStyle = fg; c.font = FONT(800, ch * 0.34); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, cw / 2, ch / 2); } });
      const tank = (S, x, z, s = 1, col = [96, 112, 70], puff = 0) => { const B = (dx, dy, dz, hx, hy, hz, c) => S.box((p) => add(mul(add(p, [dx, dy, dz]), s), [x, 0, z]), hx, hy, hz, c, { bevel: 0.6 }); B(0, 0.3 + puff, 0, 0.55, 0.25 + puff, 0.8, col); B(0, 0.7 + puff, 0, 0.35, 0.18, 0.4, col); B(0, 0.72 + puff, 0.8, 0.06, 0.06, 0.5, col); };
      const bell = (S, x, y, z, s = 1, tilt = 0) => { S.cyl((p) => add(rotZ(mul(p, s), tilt), [x, y + 0.35 * s, z]), 0.38, 0.35, [212, 170, 70], 16); S.box((p) => add(mul(p, s), [x, y + 0.8 * s, z]), 0.4, 0.06, 0.06, [90, 70, 40], { bevel: 0.3 }); };
      const stone = (S, x, y, z, s = 1) => S.box((p) => add(mul(p, s), [x, y + 0.2 * s, z]), 0.45, 0.2, 0.28, [150, 148, 140], { bevel: 0.4 });
      const frame = (S, x, y, z, s = 1, txt = 'MONA') => { S.box((p) => add(mul(p, s), [x, y, z]), 0.36, 0.48, 0.03, [200, 160, 50], { bevel: 0.2 }); sign(S, x, y, z + 0.03 * s, 0.28 * s, 0.4 * s, txt, '#6a5a3a', '#f4ead0'); };
      const crate = (S, x, y, z, s = 1, c = [150, 110, 70]) => S.box((p) => add(mul(p, s), [x, y + 0.2 * s, z]), 0.22, 0.2, 0.22, c, { bevel: 0.15 });
      const SOL = { hat: 'army', shirt: [88, 100, 64], pants: [88, 100, 64] };

      return {
        hook: { set: 'street', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.6,0.3,{shirt:[180,60,60],hair:'bun',arms:[2.3,2.3],mouth:'grin'})], tags: [[0, 2.5, 0, "DANCING IN THE STREET", V("hook", "dancing"), 'orange', 2.0]] },
        b1: { set: 'palace', cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.6,0.3,{shirt:[180,60,60],hair:'bun',arms:[2.3,1.0],mouth:'o',sweat:true})], tags: [[0, 2.5, 0, "STRASBOURG", V("b1", "strasbourg"), 'blue', 1.6]] },
        b2: { set: 'street', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => {  }, cast: [man(-1.4,0.3,{shirt:[180,60,60],hair:'bun',arms:[2.3,2.3]}),man(-0.4,0.0,{arms:[2.3,2.3],mouth:'o'}),man(0.6,0.3,{shirt:[60,120,80],arms:[2.3,2.3],mouth:'o'}),man(1.5,0.0,{arms:[2.3,2.3],mouth:'o',sweat:true})], tags: [[0, 2.5, 0, "DOZENS JOIN", V("b2", "dozens"), 'yellow', 1.7]] },
        b3: { set: 'street', opt: { night: 0 }, cam: 'wide', props: (S, t, u) => {  }, cast: [man(-1.6,0.3,{arms:[2.3,2.3],mouth:'o'}),man(-0.8,0.0,{shirt:[180,60,60],arms:[2.3,2.3]}),man(0,0.3,{arms:[2.3,2.3],mouth:'o'}),man(0.8,0.0,{shirt:[60,120,80],arms:[2.3,2.3],mouth:'o'}),man(1.6,0.3,{arms:[2.3,2.3],mouth:'o',sweat:true})], tags: [[0, 2.5, 0, "UP TO 400", V("b3", "four"), 'red', 1.9]] },
        b4: { set: 'palace', cam: 'mid', props: (S, t, u) => { S.box((p)=>add(p,[0.5,0.5,0.4]),0.35,0.5,0.25,[190,190,200],{bevel:0.3}); }, cast: [man(-0.6,0.3,{shirt:[180,60,60],hair:'bun',arms:[2.3,2.3],mouth:'o'}),man(0.2,0.1,{shirt:[60,60,60],hat:'tophat',mouth:'frown'})], tags: [[0, 2.5, 0, "SENT TO A SHRINE", V("b4", "shrine"), 'blue', 1.8]] },
        twist: { set: 'graveyard', cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.5,0.3,{shirt:[180,60,60],hair:'bun',mouth:'o',eyes:'wide',arms:[0.6,2.4]})], tags: [[0, 2.5, 0, "???", V("twist", "why"), 'yellow', 1.8]], flash: [V('twist', 'why')] },
        punch: { set: 'museum', cam: 'mid', props: (S, t, u) => { sign(S,0.45,1.2,0.5,0.9,0.4,'HYSTERIA','#fff4d6','#a01818'); }, cast: [man(-0.7,0.3,{shirt:[40,40,60],hair:'wild',mouth:'grin',arms:[1.4,0.4]})], tags: [[0, 2.5, 0, "MASS HYSTERIA?", V("punch", "hysteria"), 'red', 2.2]] },
        cta: { set: 'street', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.7,0.3,{arms:[2.3,2.3],mouth:'grin'})], tags: [[0, 0.42, 0.7, "JOIN IN?", V("cta", "joined"), 'yellow', 1.7]] },
      };
    },
  });
