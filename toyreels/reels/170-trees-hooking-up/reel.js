// re-render: Kenney toy nature scenery (13 Nov 2026)
// 170 cinestory3d (story3d.js): mycorrhizal networks (Simard 1997; Karst 2023 debate). Scroll stopper: a cut-away forest floor with glowing threads joining two trees' roots.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fr = k.forest({ trees: 20 });
  const tA = k.add(k.LIB.prop('nature/tree_oak', { h: 6 }), [-2.2, 0, 0], 0, fr), tB = k.add(k.LIB.prop('nature/tree_birch', { h: 6.5 }), [2.2, 0, 0], 1, fr);
  const under = new T.Group(); fr.add(under); const soil = new T.Mesh(new T.BoxGeometry(9, 3, 0.4), M('#5a3a22', 0.95, 0, { transparent: true, opacity: 0.85 })); soil.position.set(0, -1.5, 0.6); under.add(soil);
  const RM = M('#c8a46a', 0.8), FM = new T.MeshBasicMaterial({ color: '#fff2a8', transparent: true, opacity: 0.9, toneMapped: false });
  const tube = (pts, r, m, p = under) => { const c = new T.CatmullRomCurve3(pts.map((q) => new T.Vector3(...q))); const o = new T.Mesh(new T.TubeGeometry(c, 30, r, 6), m); p.add(o); return { o, c }; };
  [-2.2, 2.2].forEach((x) => { for (let i = 0; i < 5; i++) tube([[x, 0, 0.8], [x + (i - 2) * 0.3, -0.6, 0.85], [x + (i - 2) * 0.7, -1.4 - (i % 2) * 0.4, 0.85]], 0.06 - i * 0.005, RM); });
  const threads = []; for (let i = 0; i < 9; i++) threads.push(tube([[-2.2 + (i % 3 - 1) * 0.5, -1.0 - (i % 3) * 0.3, 0.86], [0, -0.8 - Math.sin(i) * 0.6, 0.88], [2.2 + (i % 3 - 1) * 0.5, -1.1 - ((i + 1) % 3) * 0.3, 0.86]], 0.012, FM));
  const dots = []; for (let i = 0; i < 16; i++) { const d = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), new T.MeshBasicMaterial({ color: '#7fe0ff', toneMapped: false })); under.add(d); dots.push(d); }
  const glow = (t, n = 9, dir = 1) => { n = Math.max(1, n); threads.forEach((th, i) => { th.o.visible = i < n; th.o.material.opacity = 0.5 + 0.4 * Math.sin(t * 3 + i); }); dots.forEach((d, i) => { const th = threads[i % n]; const u = ((t * 0.3 + i / dots.length) % 1); d.visible = true; d.position.copy(th.c.getPointAt(dir > 0 ? u : 1 - u)); }); };
  let ov = null; const base = () => { k.only(fr); under.visible = true; dots.forEach((d) => { d.visible = false; }); };
  const cutCam = (o = {}) => k.cam([0, -0.6, 7.5], [0, -0.7, 0], 42, Object.assign({ sky: fr.sky, focus: [0.1, 0.95], blur: 2 }, o));
  const shots = {
    hook: (t, kk) => { base(); glow(t); ov = (ctx) => k.vignette(ctx, 0.5); return cutCam(); },
    forest: (t, kk) => { base(); under.visible = false; return k.cam([lerp(-4, 4, kk), 1.7, 9], [0, 2.5, 0], 44, { sky: fr.sky }); },
    roots: (t, kk) => { base(); glow(t, Math.floor(kk * 3)); return k.cam([-2.2, -0.9, 3.2], [-2.2, -1.0, 0.8], 38, { sky: fr.sky, focus: [0.3, 0.75], blur: 8 }); },
    web: (t, kk) => { base(); glow(t, 3 + Math.floor(kk * 6)); ov = (ctx) => k.card(ctx, 'WOOD WIDE WEB', { y: 200, bg: '#2f8a6a' }); return cutCam(); },
    deal: (t, kk) => { base(); glow(t, 9, kk < 0.5 ? -1 : 1); ov = (ctx) => { k.card(ctx, kk < 0.5 ? 'TREE → FUNGUS: SUGAR' : 'FUNGUS → TREE: WATER', { y: 200, bg: kk < 0.5 ? '#c9a24a' : '#2f6fd8', size: 38 }); }; return cutCam(); },
    share: (t, kk) => { base(); glow(t * 2); ov = (ctx) => k.card(ctx, 'CARBON MOVES BETWEEN TREES', { y: 200, bg: '#2f8a6a', size: 34 }); return k.cam([1.5, -0.4, 5.2], [0.3, -0.8, 0.8], 40, { sky: fr.sky }); },
    debate: (t, kk) => { base(); glow(t, 5); ov = (ctx) => k.big(ctx, '?', { y: 300, size: 200, col: '#ffd23f' }); return cutCam(); },
    outro: (t, kk) => { base(); glow(t); ov = (ctx) => k.big(ctx, 'HOOKED UP. 🌳', { y: 240, size: 72, col: '#ffd23f' }); return cutCam(); },
  };
  return { shots, lens: 28, sky: fr.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: [...LIB.toyKitAssets().filter((a) => a.startsWith('knature/')), 'nature/tree_oak', 'nature/tree_maple', 'nature/tree_birch', 'nature/rock_mossy', 'nature/rock_large_a'] });
