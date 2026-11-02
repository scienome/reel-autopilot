  // ==================== true stories in bricks: 76-stone-of-scone-heist ====================
  makeComedy({
    badge: 'TRUE STORY', badgeCol: '#1f4f8f',
    captions: { say: {"nineteen fifty two": "1952", "nineteen ninety six": "1996", "nineteen fifty": "1950", "eighteen": "18", "four": "4"}, keys: {"students": "o", "stone": "y", "eighteen": "y", "scotland": "b", "abbey": "y", "home": "g", "heist": "r", "pulled": "g"} },
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
        hook: { set: 'museum', cam: 'mid', props: (S, t, u) => { stone(S,0.45,0.0,0.5,1.5); }, cast: [man(-0.9,0.3,{shirt:[60,90,60],hat:'beanie',mouth:'grin',arms:[1.4,1.4]}),man(-0.3,0.0,{shirt:[90,60,60],hat:'beanie',mouth:'grin'})], tags: [[0, 2.5, 0, "4 STUDENTS, 1 STONE", V("hook", "students"), 'orange', 2.1]] },
        b1: { set: 'palace', cam: 'mid', props: (S, t, u) => { stone(S,0,0.0,0.4,1.8); S.box((p)=>add(p,[0,0.9,0.4]),0.5,0.4,0.4,[120,80,40],{bevel:0.2}); }, cast: [], tags: [[0, 2.5, 0, "STONE OF SCONE", V("b1", "stone"), 'blue', 1.9]] },
        b2: { set: 'street', opt: { night: 0.8 }, cam: 'mid', props: (S, t, u) => { S.box((p)=>add(p,[0.5,0.35,0.4]),0.7,0.3,0.35,[70,100,150],{bevel:0.4}); S.box((p)=>add(p,[0.5,0.7,0.4]),0.4,0.2,0.3,[90,120,170],{bevel:0.4}); }, cast: [man(-0.8,0.3,{shirt:[60,90,60],hat:'beanie',mouth:'o',sweat:true,eyes:'sleepy'})], tags: [[0, 2.5, 0, "18 HOURS", V("b2", "eighteen"), 'yellow', 1.7]] },
        b3: { set: 'palace', cam: 'mid', props: (S, t, u) => { stone(S,0.4,0.0,0.4,1.4); }, cast: [man(-0.7,0.3,{shirt:[60,90,60],hat:'beanie',mouth:'grin',arms:[1.4,1.4]}),man(1.4,0.1,{shirt:[90,60,60],hat:'beanie',mouth:'grin',arms:[1.4,1.4]})], tags: [[0, 2.5, 0, "BACK TO SCOTLAND", V("b3", "scotland"), 'blue', 1.9]] },
        b4: { set: 'palace', cam: 'mid', props: (S, t, u) => { stone(S,0.45,0.0,0.4,1.4); }, cast: [man(-0.7,0.3,{shirt:[200,200,200],mouth:'smile',arms:[1.2,1.2]})], tags: [[0, 2.5, 0, "1952", V("b4", "abbey"), 'yellow', 1.5]] },
        twist: { set: 'stage', opt: { banner: 'SCOTLAND' }, cam: 'mid', props: (S, t, u) => { stone(S,0.45,0.0,0.5,1.4); }, cast: [man(-0.8,0.3,{shirt:[40,60,140],hair:'wild',mouth:'grin',arms:[2.6,2.6]})], tags: [[0, 2.5, 0, "WENT HOME 1996", V("twist", "home"), 'green', 2.1]], flash: [V('twist', 'home')] },
        punch: { set: 'museum', cam: 'mid', props: (S, t, u) => { stone(S,0.45,0.0,0.5,1.4); }, cast: [man(-0.8,0.3,{shirt:[60,90,60],hat:'beanie',mouth:'grin',brows:'raised',arms:[1.3,0.4]})], tags: [[0, 2.5, 0, "CHRISTMAS HEIST", V("punch", "heist"), 'red', 2.0]] },
        cta: { set: 'palace', cam: 'mid', props: (S, t, u) => { stone(S,0.45,0.0,0.5,1.4); }, cast: [man(-0.8,0.3,{shirt:[60,90,60],hat:'beanie'})], tags: [[0, 0.42, 0.7, "PULL IT OFF?", V("cta", "pulled"), 'yellow', 1.7]] },
      };
    },
  });
