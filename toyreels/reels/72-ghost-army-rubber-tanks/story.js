  // ==================== true stories in bricks: 72-ghost-army-rubber-tanks ====================
  makeComedy({
    badge: 'TRUE STORY', badgeCol: '#1f4f8f',
    captions: { say: {"two": "2", "eleven hundred": "1,100", "twenty": "20", "fifty": "50"}, keys: {"rubber": "o", "ghost": "b", "tanks": "g", "sound": "y", "radio": "b", "twenty": "g", "secret": "r", "fifty": "r", "fake": "y", "army": "y"} },
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
        hook: { set: 'lawn', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => { tank(S,0.45,0.5,1.1,[96,112,70],0.1); tank(S,1.1,-0.3,0.9,[96,112,70],0.1); }, cast: [man(-0.8,0.3,Object.assign({},SOL,{mouth:'grin',arms:[1.4,1.4]}))], tags: [[0, 2.5, 0, "RUBBER ARMY", V("hook", "rubber"), 'orange', 2.0]] },
        b1: { set: 'base', cam: 'mid', props: (S, t, u) => { tank(S,0.5,0.3,1.0); }, cast: [man(-1.0,0.3,Object.assign({},SOL,{})), man(-0.2,0.0,Object.assign({},SOL,{hat:'peaked',medals:3}))], tags: [[0, 2.5, 0, "GHOST ARMY", V("b1", "ghost"), 'blue', 1.7]] },
        b2: { set: 'lawn', opt: { night: 0.5 }, cam: 'mid', props: (S, t, u) => { tank(S,0.45,0.4,1.1+0.3*Math.sin(t*4),[96,112,70],0.15*u); }, cast: [man(-0.8,0.3,Object.assign({},SOL,{arms:[0.4,1.5]}))], tags: [[0, 2.5, 0, "FAKE TANKS", V("b2", "fake"), 'green', 1.5]] },
        b3: { set: 'lawn', opt: { night: 0.7 }, cam: 'mid', props: (S, t, u) => { S.box((p)=>add(p,[0.5,0.5,0.4]),0.6,0.4,0.4,[80,90,70],{bevel:0.3}); sign(S,0.45,0.6,0.82,0.5,0.2,'SOUND'); for(let i=0;i<4;i++) S.cyl((p)=>add(rotX(p,Math.PI/2),[1.0+i*0.2,0.8+Math.sin(t*8+i)*0.08,0.4]),0.1,0.03,[240,220,80],12); }, cast: [man(-0.7,0.3,Object.assign({},SOL,{mouth:'o',arms:[2.0,2.0]}))], tags: [[0, 2.5, 0, "FAKE SOUNDS", V("b3", "sound"), 'yellow', 1.7]] },
        b4: { set: 'bunker', cam: 'mid', props: (S, t, u) => { crate(S,0.45,0,0.6,1.3); }, cast: [man(-0.6,0.2,Object.assign({},SOL,{hold:'phone',mouth:'grin'}))], tags: [[0, 2.5, 0, "FAKE RADIO", V("b4", "fake"), 'blue', 1.7]] },
        twist: { set: 'stage', opt: { banner: 'GHOST ARMY' }, cam: 'mid', props: (S, t, u) => { tank(S,0.6,0.5,0.8,[96,112,70],0.1); }, cast: [man(-0.8,0.3,Object.assign({},SOL,{arms:[2.6,2.6],mouth:'grin'}))], tags: [[0, 2.5, 0, "20+ OPERATIONS", V("twist", "twenty"), 'green', 2.0]], flash: [V('twist', 'twenty')] },
        punch: { set: 'bunker', opt: { alarm: 0.3 }, cam: 'mid', props: (S, t, u) => { sign(S,0.45,1.0,0.5,0.6,0.35,'TOP SECRET','#f6d6d6','#a01818'); }, cast: [man(-0.8,0.3,Object.assign({},SOL,{eyes:'wide',mouth:'o',sweat:true}))], tags: [[0, 2.5, 0, "SECRET 50+ YEARS", V("punch", "secret"), 'red', 2.2]], booms: [[0.2, 2.0, 0.2, V('punch', 'secret'), 0.4]] },
        cta: { set: 'lawn', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => { tank(S,0.45,0.4,1.1,[96,112,70],0.15); }, cast: [man(-0.8,0.3,Object.assign({},SOL,{}))], tags: [[0, 0.42, 0.7, "RUBBER TANK?", V("cta", "rubber"), 'yellow', 1.7]] },
      };
    },
  });
