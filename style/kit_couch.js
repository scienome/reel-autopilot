  // ==================== reel kit: makeCouch (a whole couple reel from short per-beat specs) ====================
  // Everything lives in COUCH / makeCouch so older reels that define their own helpers keep working.
  //
  // makeCouch({
  //   keys: ['honest', 'relationship', ...],      // caption keywords (yellow); captions are built from script.json
  //   shots: ({ V }) => ({ name: spec, ... }),    // in time order; one per beat by default
  //   sound: (k, { V }) => {...},                 // extra sounds (cuts, captions and fx already have sounds)
  // })
  // spec = {
  //   beat: 'id' (default: the shot name), word: 'w' (+ n) to cut in mid-beat (default: the beat's first word),
  //   cam: 'wide' | 'two' | 'him' | 'her' | [E0, T0, E1, T1],  room: { table: true } (livingRoom options),
  //   he / she: { arms: 'phone' | 'rest' | 'hold' | 'clasp' | 'shrug' | 'hug' | 'reach' | 'head' | 'cheer' | 'cheeks' |
  //              'slump' | [[f, o, bend], [f, o, bend]], head: { yaw, pitch, tilt }, face: {...}, lean, yaw, hide }
  //              or (t, u) => {...} (u = 0..1 through the shot),
  //   heHold / sheHold: true (a phone) | 'meme' | 'food:pizza' | a screen painter (c, w, h) => {},
  //   props: (S, t, u, he, she) => {...} (3D, after the couple),
  //   fx: [{ k: 'q' | 'sparkle' | 'sweat' | 'buzz' | 'zzz' | 'smug' | 'heart' | 'hearts' | 'bubble' | 'card' | 'stamp' |
  //          'ring' | 'speed', at: time, who: 'he' | 'she' (or x, y in px), text, side, n, mark, col }],
  //   twist: time (impact + success + flash), nope: time (marker cross + buzz), flash: [times],
  //   over: (ctx, W, H_, t, S, he, she) => {...} (2D on top), dof }
  const COUCH = (() => {
    const CAMS = {
      wide: [[0.25, 1.55, 3.9], [0, 1.0, -0.35], [0.12, 1.5, 3.4], [0, 1.03, -0.35]],
      two: [[0, 1.55, 3.0], [0, 1.25, -0.4], [0, 1.55, 2.65], [0, 1.28, -0.4]],
      him: [[-0.78, 1.62, 1.15], [-0.62, 1.58, -0.42], [-0.74, 1.62, 0.92], [-0.62, 1.58, -0.42]],
      her: [[0.74, 1.6, 1.15], [0.62, 1.56, -0.42], [0.71, 1.6, 0.92], [0.62, 1.56, -0.42]],
      close: [[0.05, 1.5, 2.6], [0, 1.25, -0.4], [0.05, 1.52, 2.2], [0, 1.3, -0.4]],
    };
    const POSE = {
      rest: [[0.35, 0.18, 0.7], [0.5, 0.05, 0.9]], phone: [[1.0, 0.05, 1.1], [1.0, 0.05, 1.1]], hold: [[1.05, 0.05, 0.75], [1.05, 0.05, 0.75]],
      clasp: [[0.55, -0.25, 1.15], [0.55, -0.25, 1.15]], shrug: [[1.0, -0.2, 1.9], [1.0, -0.2, 1.9]], hug: [[0.6, -0.1, 1.6], [0.6, -0.1, 1.6]],
      reach: [[1.6, 0.1, 0.1], [1.6, 0.1, 0.1]], head: [[2.3, 0.35, 1.9], [2.3, 0.35, 1.9]], cheer: [[2.6, -0.55, 0.3], [2.6, -0.55, 0.3]],
      cheeks: [[1.2, 0.5, 2.2], [1.2, 0.5, 2.2]], slump: [[0.7, 0.12, 1.5], [0.7, 0.12, 1.5]],
    };
    const label = (ctx, txt, x, y, px, col = '#1c1a22', w = 900) => { ctx.font = FONT(w, px); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(txt, x, y); };
    const card = (ctx, x, y, w, h, u, fill = '#fff8ec', rot = 0) => {
      if (u <= 0) return false; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(u, u);
      ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6; ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, Math.min(w, h) * 0.22); ctx.fill();
      ctx.shadowColor = 'transparent'; return true;
    };
    const bubble = (ctx, x, y, txt, side, u, px = 34) => {
      if (u <= 0) return; ctx.save(); ctx.font = FONT(800, px); const w = ctx.measureText(txt).width + px * 1.2, h = px * 1.9;
      ctx.translate(x, y); ctx.scale(u, u); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
      ctx.fillStyle = side > 0 ? '#3d8bf2' : '#f2f0f5'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(side * (w / 2 - 22), h / 2 - 14); ctx.lineTo(side * (w / 2 + 6), h / 2 + 6); ctx.lineTo(side * (w / 2 - 40), h / 2 - 4); ctx.fill();
      ctx.shadowColor = 'transparent'; label(ctx, txt, 0, 2, px, side > 0 ? '#ffffff' : '#1c1a22', 800); ctx.restore();
    };
    const stamp = (ctx, x, y, txt, u, col = '#f47aa6', rot = 0.1, px = 64) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(u, u); ctx.font = FONT(900, px); ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = px * 0.19; ctx.strokeStyle = '#1c1a22'; ctx.strokeText(txt, 0, 0); ctx.fillStyle = col; ctx.fillText(txt, 0, 0); ctx.restore(); };
    const zzz = (ctx, x, y, t, u) => { if (u <= 0) return; for (let i = 0; i < 3; i++) { const k = ((t * 0.6 + i / 3) % 1); ctx.save(); ctx.globalAlpha = u * (1 - k); ctx.translate(x + k * 60 + i * 6, y - k * 120); ctx.rotate(-0.2); FX.qmark(ctx, 0, 0, 0.35 + 0.25 * k, 'Z', 0); ctx.restore(); } };
    const hearts = (ctx, W, t, st, n = 5, y0 = 640) => { for (let i = 0; i < n; i++) { const s0 = st + i * 0.3, u = t - s0; if (u < 0) continue; FX.heart(ctx, W * 0.5 + Math.sin(u * 2 + i) * 50 + (i - (n - 1) / 2) * 55, y0 - u * 120, 66 * popU(t, s0, 0.4), Math.sin(u * 3 + i) * 0.2); } };
    const meme = (c, w, h) => { c.fillStyle = '#f4f2f7'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.fillRect(w * 0.1, h * 0.12, w * 0.8, h * 0.4); c.fillStyle = '#1c1a22'; c.beginPath(); c.arc(w * 0.38, h * 0.28, w * 0.06, 0, Math.PI * 2); c.arc(w * 0.62, h * 0.28, w * 0.06, 0, Math.PI * 2); c.fill(); c.fillRect(w * 0.15, h * 0.62, w * 0.7, h * 0.05); c.fillRect(w * 0.15, h * 0.72, w * 0.5, h * 0.05); };
    const sounds = {
      heart: (k, st, n = 5) => { for (let i = 0; i < n; i++) k.play('pop', st + i * 0.3, { f: 900 + i * 80, gain: 0.45, minor: true }); ['C5', 'E5', 'G5'].forEach((f, i) => k.play('ding', st + 0.1 + i * 0.1, { f, gain: 0.3 })); },
      nope: (k, t) => { k.play('stroke', t, { material: 'marker', dur: 0.3, gain: 0.45 }); k.play('buzz', t + 0.3, { f: 110, dur: 0.3, gain: 0.55 }); k.play('thud', t + 0.28, { f: 120, gain: 0.45 }); },
      twist: (k, t) => { k.play('riser', t - 0.45, { dur: 0.45, gain: 0.4 }); k.play('impact', t, { gain: 0.7 }); k.play('success', t + 0.04, { f: 'C6', gain: 0.6 }); k.play('sparkle', t + 0.1, { gain: 0.6, minor: true }); },
    };
    // captions from the script: chunks of up to 4 words (never across a phrase), lines of up to 3, keywords yellow
    const autoCaps = (BEATS, WORDS, keys) => {
      const ks = new Set((keys || []).map((w) => normWord(w))), out = [];
      BEATS.forEach((b) => { let wi = 0; b.phrases.forEach((ph) => { const ws = (typeof ph === 'string' ? ph : ph[0]).split(/\s+/).filter(Boolean);
        for (let i = 0; i < ws.length;) { const rem = ws.length - i, n = rem <= 4 ? rem : rem === 5 ? 3 : 4, ch = ws.slice(i, i + n); i += n;
          const t0 = WORDS[b.id][wi].t - 0.05, toks = ch.map((w) => (ks.has(normWord(w)) ? K(w.toUpperCase()) : w.toUpperCase()));
          out.push([t0, toks.length > 3 ? [toks.slice(0, 2), toks.slice(2)] : [toks]]); wi += ch.length; } }); });
      return out;
    };
    return { CAMS, POSE, label, card, bubble, stamp, zzz, hearts, meme, sounds, autoCaps };
  })();

  // ==================== the bigger world: locations, outfits, extra characters, pets ====================
  // spec.set: 'living' (default) | 'bedroom' | 'kitchen' | 'restaurant' | 'car' | 'mall' | 'party' | 'wedding' | 'street'
  //   (opt: { banner: 'HAPPY ANNIVERSARY', signs: [...] , table: false }). Kitchen, mall, party, wedding and street stand
  //   the couple up (cameras lift to match); he / she { sit: true | false } overrides. They keep their usual places
  //   (him at x -0.62, her at x 0.62), so 'him' / 'her' / 'two' / 'wide' cameras work everywhere.
  // he / she: { outfit: 'suit' | 'pajamas' | 'gym' | 'party' | 'wedding' | 'dress' | 'apron' | 'winter' | 'towel', cap: col,
  //   shirt, pants, hair, x, z, yaw, sit } on top of the usual pose options.
  // spec.extras: [{ who: 'mil' | 'dad' | 'bff' | 'bro' | 'ex' | 'exgirl' | 'delivery' | 'waiter' | 'cop' | 'boss' | 'kid',
  //   x, z, yaw, sit, arms, head, face, outfit, hide } or (t, u) => [...]]  (fx can point at them with who: 'mil' etc.)
  // spec.pets: [{ kind: 'dog' | 'cat', x, z, yaw, col }]
  // cam: 'on' with on: [x, y, z] frames a close-up on any point (an extra's head, a prop).
  const COUCHWORLD = (() => {
    const WZ = -1.25;
    const wall = (S, col, paint) => S.quad([[-7, 0, WZ], [7, 0, WZ], [7, 4.2, WZ], [-7, 4.2, WZ]], col, { bg: true, z: 99, paint: paint && ((c, w, h) => { c.save(); c.translate(0, h); c.scale(1, -1); paint(c, w, h); c.restore(); }) }); // the quad maps its texture from the floor up: flip so y = 0 is the top and text reads
    const floor = (S, col, paint) => S.quad([[-7, 0, WZ], [7, 0, WZ], [7, 0, 9], [-7, 0, 9]], col, { z: 98, paint });
    const planks = (n) => (c, w, h) => { for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? 'rgba(0,0,0,0.05)' : 'rgba(255,230,200,0.04)'; c.fillRect((i * w) / n, 0, w / n, h); } };
    const checker = (n, a, b) => (c, w, h) => { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = (i + j) & 1 ? a : b; c.fillRect((i * w) / n, (j * h) / n, w / n + 1, h / n + 1); } };
    const glow = (c, x, y, r, col) => { const g = c.createRadialGradient(x, y, 2, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); };
    const txt = (c, s2, x, y, px, col) => { c.font = FONT(900, px); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(s2, x, y); };
    const SETS = {
      living: { stand: false, build: (S, o) => livingRoom(S, Object.assign({ table: true }, o)) },
      bedroom: { stand: false, build: (S) => {
        wall(S, [92, 96, 146], (c, w, h) => { glow(c, w * 0.5, h * 0.62, w * 0.3, 'rgba(255,200,140,0.35)'); c.fillStyle = '#1c2250'; c.fillRect(w * 0.62, h * 0.3, w * 0.12, h * 0.22); c.fillStyle = '#f2ecc8'; c.beginPath(); c.arc(w * 0.7, h * 0.36, h * 0.03, 0, TAU); c.fill(); c.strokeStyle = '#e8e0d0'; c.lineWidth = 6; c.strokeRect(w * 0.62, h * 0.3, w * 0.12, h * 0.22); });
        floor(S, [118, 84, 70], planks(26));
        S.rbox((p) => add(p, [0, 0.27, -0.62]), 1.9, 0.2, 0.62, [240, 236, 228], { bevel: 0.3, bias: 0.6 });
        S.rbox((p) => add(p, [0, 0.42, -0.5]), 1.85, 0.06, 0.55, [120, 150, 210], { bevel: 0.5, bias: 0.55 });
        S.rbox((p) => add(p, [0, 0.95, -1.18]), 1.95, 0.55, 0.06, [110, 74, 52], { bevel: 0.3, bg: true });
        [-0.62, 0.62].forEach((x) => S.rbox((p) => add(p, [x, 0.6, -1.05]), 0.4, 0.1, 0.16, [250, 248, 240], { bevel: 0.6 }));
        [-2.25, 2.25].forEach((x) => { S.rbox((p) => add(p, [x, 0.3, -0.95]), 0.28, 0.3, 0.26, [130, 86, 60], { bevel: 0.2 }); S.ball([x, 0.82, -0.95], [0.16, 0.18, 0.16], [255, 220, 150], { gloss: 0.4 }); });
      } },
      kitchen: { stand: true, build: (S) => {
        wall(S, [214, 222, 214], (c, w, h) => { for (let i = 0; i < 40; i++) for (let j = 0; j < 10; j++) { c.fillStyle = (i + j) & 1 ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.03)'; c.fillRect((i * w) / 40, h * 0.62 + (j * h * 0.2) / 10, w / 40, (h * 0.2) / 10); } c.fillStyle = '#7a9a8a'; c.fillRect(w * 0.25, h * 0.12, w * 0.5, h * 0.22); c.strokeStyle = 'rgba(0,0,0,0.2)'; c.lineWidth = 3; for (let k = 1; k < 5; k++) { c.beginPath(); c.moveTo(w * (0.25 + k * 0.1), h * 0.12); c.lineTo(w * (0.25 + k * 0.1), h * 0.34); c.stroke(); } });
        floor(S, [200, 196, 186], checker(24, '#c8c2b4', '#e2ddd0'));
        S.rbox((p) => add(p, [0, 0.46, -1.0]), 2.6, 0.46, 0.26, [110, 150, 140], { bevel: 0.15 }); S.rbox((p) => add(p, [0, 0.94, -1.0]), 2.65, 0.03, 0.28, [236, 232, 222], { bevel: 0.3 });
        S.rbox((p) => add(p, [2.3, 1.0, -0.9]), 0.42, 1.0, 0.36, [236, 238, 242], { bevel: 0.15, paint: (c, w, h) => { c.fillStyle = 'rgba(0,0,0,0.15)'; c.fillRect(0, h * 0.38, w, h * 0.02); c.fillStyle = '#9aa0aa'; c.fillRect(w * 0.08, h * 0.12, w * 0.05, h * 0.2); } });
        S.cyl((p) => add(p, [-0.9, 0.97, -1.0]), 0.16, 0.16, [70, 70, 80], 14);
      } },
      restaurant: { stand: false, build: (S, o) => {
        wall(S, [96, 30, 40], (c, w, h) => { c.fillStyle = '#1a1c3a'; c.fillRect(w * 0.3, h * 0.2, w * 0.4, h * 0.38); const r = H.rng(3); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,${200 + r.range(0, 50) | 0},120,${r.range(0.4, 0.9)})`; c.fillRect(w * 0.3 + r.range(0, w * 0.4), h * 0.3 + r.range(0, h * 0.28), 4, 6); } c.strokeStyle = '#d8b060'; c.lineWidth = 8; c.strokeRect(w * 0.3, h * 0.2, w * 0.4, h * 0.38); glow(c, w * 0.15, h * 0.5, w * 0.12, 'rgba(255,190,110,0.35)'); glow(c, w * 0.85, h * 0.5, w * 0.12, 'rgba(255,190,110,0.35)'); });
        floor(S, [86, 52, 42], planks(30));
        [-0.62, 0.62].forEach((x) => S.rbox((p) => add(p, [x, 0.75, -0.75]), 0.3, 0.32, 0.05, [60, 30, 26], { bevel: 0.3 }));
        if (o.table !== false) { S.rbox((p) => add(p, [0, 0.72, 0.22]), 1.15, 0.03, 0.34, [246, 244, 238], { bevel: 0.3, bias: -0.3 }); S.rbox((p) => add(p, [0, 0.36, 0.22]), 0.06, 0.36, 0.06, [60, 40, 30], { bevel: 0.3 });
          [-0.45, 0.45].forEach((x) => S.cyl((p) => add(p, [x, 0.75, 0.22]), 0.13, 0.015, [250, 250, 250], 16)); S.cyl((p) => add(p, [0, 0.75, 0.22]), 0.025, 0.12, [250, 240, 220], 8); S.ball([0, 0.9, 0.22], [0.025, 0.04, 0.025], [255, 200, 90], { gloss: 0.6 }); }
      } },
      car: { stand: false, build: (S) => {
        wall(S, [20, 22, 44], (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#141836'); g.addColorStop(1, '#3a3060'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2a36'; c.fillRect(0, h * 0.62, w, h * 0.38); c.fillStyle = 'rgba(255,230,160,0.8)'; for (let i = 0; i < 9; i++) c.fillRect((i * w) / 9 + 20, h * 0.78, w / 30, 6); for (let i = 0; i < 7; i++) { glow(c, (i * w) / 6, h * 0.35, 40, 'rgba(255,210,120,0.5)'); } });
        floor(S, [30, 30, 36]);
        [-0.62, 0.62].forEach((x) => { S.rbox((p) => add(p, [x, 0.42, -0.5]), 0.36, 0.14, 0.32, [60, 60, 70], { bevel: 0.4 }); S.rbox((p) => add(rotX(p, -0.2), [x, 0.95, -0.82]), 0.34, 0.42, 0.08, [70, 70, 82], { bevel: 0.5 }); });
        S.rbox((p) => add(p, [0, 0.82, 0.45]), 1.7, 0.12, 0.25, [40, 40, 48], { bevel: 0.3, bias: -0.4 });
        S.cyl((p) => add(rotX(p, 1.2), [-0.62, 0.98, 0.32]), 0.2, 0.03, [30, 30, 34], 20, { bias: -0.5 });
        [-1.25, 1.25].forEach((x) => S.rbox((p) => add(rotZ(p, x > 0 ? -0.35 : 0.35), [x, 1.5, 0.3]), 0.04, 0.8, 0.04, [40, 40, 48], { bevel: 0.3 }));
      } },
      mall: { stand: true, build: (S, o) => {
        const sg = o.signs || ['SALE 70%', 'SHOES', 'PHONES'];
        wall(S, [236, 232, 240], (c, w, h) => { [0.08, 0.38, 0.68].forEach((x, i) => { c.fillStyle = ['#e85a8a', '#4a8ae8', '#f0b030'][i]; c.fillRect(w * x, h * 0.3, w * 0.24, h * 0.07); txt(c, sg[i] || '', w * (x + 0.12), h * 0.335, h * 0.045, '#fff'); c.fillStyle = 'rgba(160,200,230,0.55)'; c.fillRect(w * x, h * 0.38, w * 0.24, h * 0.42); c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(w * (x + 0.02), h * 0.4, w * 0.03, h * 0.35); }); });
        floor(S, [230, 226, 220], checker(20, '#e8e4dc', '#d8d2c8'));
      } },
      party: { stand: true, build: (S, o) => {
        wall(S, [70, 40, 96], (c, w, h) => { for (let i = 0; i < 26; i++) { const x = (i / 25) * w, y = h * 0.18 + Math.sin(i * 0.9) * h * 0.03; c.fillStyle = ['#ffd23f', '#ff6a8a', '#6ae0ff', '#9aff6a'][i % 4]; c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill(); } if (o.banner) { c.fillStyle = '#f2e6ff'; c.fillRect(w * 0.25, h * 0.26, w * 0.5, h * 0.08); txt(c, o.banner, w / 2, h * 0.3, h * 0.04, '#6a2a8a'); } });
        floor(S, [60, 40, 70], checker(18, '#3c2c4a', '#4c3a5c'));
        const r = H.rng(9); for (let i = 0; i < 7; i++) { const x = -2.4 + i * 0.8 + r.range(-0.2, 0.2), y = 2.1 + r.range(0, 0.5); S.ball([x, y, -1.0], [0.17, 0.21, 0.17], [[240, 80, 120], [80, 160, 240], [255, 210, 60], [140, 230, 120]][i % 4], { gloss: 0.5, bg: true }); }
      } },
      wedding: { stand: true, build: (S) => {
        wall(S, [244, 238, 230], (c, w, h) => glow(c, w / 2, h * 0.45, w * 0.35, 'rgba(255,220,180,0.4)'));
        floor(S, [220, 214, 204], planks(30)); S.quad([[-0.5, 0.003, -1.2], [0.5, 0.003, -1.2], [0.5, 0.003, 4], [-0.5, 0.003, 4]], [200, 40, 60], { z: 97 });
        const r = H.rng(4); for (let i = 0; i <= 16; i++) { const a = Math.PI * (i / 16); S.ball([Math.cos(a) * 1.35, 0.2 + Math.sin(a) * 2.3, -1.05], 0.16 + r.range(0, 0.06), i % 3 ? [250, 250, 250] : [240, 150, 170], { bg: true, rim: false }); }
      } },
      street: { stand: true, night: true, build: (S, o, ctx, t) => nightStreet(ctx, S, t, 1) },
    };
    const OUTFIT = {
      suit: { shirt: [40, 44, 62], pants: [40, 44, 62], tie: [200, 40, 50] }, wedding: { shirt: [30, 30, 36], pants: [30, 30, 36], tie: [240, 240, 240] },
      pajamas: { shirt: [150, 176, 230], pants: [150, 176, 230] }, gym: { shirt: [70, 200, 130], pants: [40, 40, 48] }, party: { shirt: [200, 60, 160], pants: [30, 30, 40] },
      dress: { shirt: [200, 40, 70], pants: [200, 40, 70], dress: [200, 40, 70] }, bride: { shirt: [250, 250, 250], pants: [250, 250, 250], dress: [252, 252, 252] },
      apron: { apron: [246, 246, 246] }, winter: { shirt: [160, 50, 50], pants: [50, 60, 90], scarf: [240, 200, 60] }, towel: { shirt: [226, 172, 128], pants: [255, 255, 255] },
    };
    const CAST = {
      mil: { kind: 'girl', hair: [205, 205, 210], shirt: [120, 60, 140], pants: [80, 50, 90], s: 0.95, face: { lids: 0.35, brows: -0.4, mouth: 'flat' } },
      dad: { kind: 'boy', hair: [190, 190, 196], hairStyle: 'flat', shirt: [130, 100, 70], pants: [70, 70, 80], face: { mouth: 'flat' } },
      bff: { kind: 'girl', hair: [30, 24, 22], shirt: [250, 180, 60], pants: [60, 80, 140] },
      bro: { kind: 'boy', hair: [210, 150, 60], shirt: [60, 170, 150], pants: [60, 60, 70] },
      ex: { kind: 'boy', hair: [20, 20, 24], shirt: [30, 30, 36], pants: [30, 30, 36], face: { mouth: 'smile', lids: 0.3 } },
      exgirl: { kind: 'girl', hair: [232, 200, 110], shirt: [30, 30, 36], pants: [30, 30, 36], face: { mouth: 'smile', lids: 0.3 } },
      delivery: { kind: 'boy', shirt: [230, 90, 40], pants: [50, 50, 60], cap: [230, 90, 40] },
      waiter: { kind: 'boy', hair: [30, 26, 24], hairStyle: 'flat', shirt: [246, 246, 246], pants: [30, 30, 36], tie: [30, 30, 36] },
      cop: { kind: 'boy', shirt: [40, 60, 130], pants: [30, 40, 90], cap: [30, 40, 90] },
      boss: { kind: 'boy', hair: [120, 110, 100], hairStyle: 'flat', shirt: [50, 50, 60], pants: [50, 50, 60], tie: [120, 30, 40], face: { brows: -0.5, mouth: 'flat' } },
      kid: { kind: 'boy', s: 0.65, shirt: [240, 200, 60], pants: [70, 110, 200] },
    };
    const sitLegs = [[1.42, 1.38], [1.42, 1.38]];
    // one person: role defaults (he / she / a cast name), the set's sit/stand, an outfit, then accessories
    const person = (S, base, o, standDefault) => {
      const q = Object.assign({}, base, o.outfit ? OUTFIT[o.outfit] : {}, o);
      const sit = q.sit != null ? q.sit : !standDefault;
      const opts = Object.assign({}, q, { legs: q.legs || (sit ? sitLegs : [[0, 0], [0, 0]]) });
      const s = q.s || 1, y = sit ? 0.62 : 1.03 * s, yaw = q.yaw ?? 0, x = q.x, z = q.z;
      const d = S.doll(x, y, z, yaw, opts);
      const L = (p) => add(rotY(mul(p, s), yaw), [x, y, z]);
      if (q.tie) S.rbox((p) => L(add(p, [0, 0.4, 0.245])), 0.035, 0.15, 0.012, q.tie, { bevel: 0.3, bias: -0.05 });
      if (q.apron) S.rbox((p) => L(add(p, [0, 0.22, 0.235])), 0.24, 0.3, 0.012, q.apron, { bevel: 0.3, bias: -0.05 });
      if (q.scarf) S.cyl((p) => L(add(p, [0, 0.6, 0.0])), 0.17, 0.08, q.scarf, 14);
      if (q.dress && !sit) S.cyl((p) => L(add(p, [0, -0.85, 0])), 0.42, 0.95, q.dress, 18, { top: 0.62 });
      if (q.cap) { S.ball(add(d.head, d.Rh([0, 0.17 * s, -0.01])), [0.29 * s, 0.17 * s, 0.28 * s], q.cap, { gloss: 0.2 }); S.rbox((p) => add(d.head, d.Rh(add(mul(p, s), [0, 0.12 * s, 0.27 * s]))), 0.18, 0.02, 0.1, q.cap, { bevel: 0.4 }); }
      return d;
    };
    const pet = (S, o) => {
      const T = (p) => add(rotY(p, o.yaw || 0), [o.x || 0, 0, o.z || 0.6]), col = o.col || (o.kind === 'cat' ? [60, 60, 66] : [200, 150, 90]), s = o.kind === 'cat' ? 0.8 : 1;
      S.ball(T([0, 0.22 * s, 0]), [0.24 * s, 0.14 * s, 0.13 * s], col); S.ball(T([0.24 * s, 0.34 * s, 0]), [0.12 * s, 0.11 * s, 0.11 * s], col);
      [[-0.15, -0.07], [-0.15, 0.07], [0.13, -0.07], [0.13, 0.07]].forEach(([a, b]) => S.limb(T([a * s, 0.18 * s, b * s]), T([a * s, 0.02, b * s]), 0.035 * s, 0.03 * s, col));
      if (o.kind === 'cat') [-0.05, 0.05].forEach((b) => S.limb(T([0.26 * s, 0.43 * s, b * s]), T([0.27 * s, 0.5 * s, b * s * 1.3]), 0.03, 0.005, col));
      else [-0.07, 0.07].forEach((b) => S.ball(T([0.22 * s, 0.38 * s, b * 1.4]), [0.04, 0.07, 0.03], shade(col, 0.7), { rim: false }));
      S.limb(T([-0.22 * s, 0.26 * s, 0]), T([-0.36 * s, 0.38 * s + (o.wag ? Math.sin(o.wag) * 0.04 : 0), 0]), 0.03, 0.015, col);
      S.ball(T([0.34 * s, 0.37 * s, -0.05]), 0.014, [20, 20, 20], { rim: false }); S.ball(T([0.34 * s, 0.37 * s, 0.05]), 0.014, [20, 20, 20], { rim: false });
      S.shadow(T([0, 0, 0]), 0.35 * s, 0.18 * s, 0.35);
    };
    return { SETS, OUTFIT, CAST, person, pet };
  })();

  const makeCouch = (cfg) => {
    const BEATS = window.SCRIPT, TM = REEL_TIMING(BEATS), { V, WORDS, DURATION } = TM;
    const specs = cfg.shots(TM), names = Object.keys(specs);
    const startOf = (n, i) => { if (i === 0) return 0; const s = specs[n], b = s.beat || n; return (s.word ? V(b, s.word, s.n) : TM.first(b)) - 0.03; };
    const SH = names.map((n, i) => [n, startOf(n, i)]).sort((a, b) => a[1] - b[1]);
    const shotAt = makeShotAt(SH, DURATION);
    const CAPS = COUCH.autoCaps(BEATS, WORDS, cfg.keys);
    const caps = makeCaps(CAPS);
    const pose = (a) => (typeof a === 'string' ? COUCH.POSE[a] : a);
    const screenOf = (h) => (h === true ? undefined : h === 'meme' ? COUCH.meme : typeof h === 'string' && h.startsWith('food:') ? foodScreen(h.slice(5)) : h);
    const doll = (fn, o) => { if (!o || o.hide) return null; const p = Object.assign({}, o); if (p.arms) p.arms = pose(p.arms); return fn(p); };
    const pulse = (t, at, k = 6) => Math.exp(-Math.pow((t - at) * k, 2));
    const STORY = (ctx, W, H_, t) => {
      const [name, a, b] = shotAt(t), sp = specs[name] || {}, u = H.clamp((t - a) / Math.max(0.01, b - a));
      const val = (v) => (typeof v === 'function' ? v(t, u) : v);
      const set = COUCHWORLD.SETS[sp.set || 'living'] || COUCHWORLD.SETS.living, standDef = set.stand;
      const heO = val(sp.he) || { arms: 'rest' }, sheO = val(sp.she) || { arms: 'rest' };
      const standing = (heO.sit != null ? !heO.sit : standDef) || (sheO.sit != null ? !sheO.sit : standDef);
      let cam = sp.cam === 'on' ? (() => { const q = sp.on || [0, 1.6, 0]; return [[q[0] + 0.12, q[1] + 0.04, q[2] + 1.55], q, [q[0] + 0.1, q[1] + 0.04, q[2] + 1.3], q]; })() : typeof sp.cam === 'string' || !sp.cam ? COUCH.CAMS[sp.cam || 'wide'] : sp.cam;
      if (standing && sp.cam !== 'on' && !Array.isArray(sp.cam)) cam = cam.map((v) => [v[0], v[1] + 0.4, v[2]]);
      const [E, TG] = shotCam(t, a, b, ...cam); const S = Scene(E, TG, W, H_);
      if (set.night) nightSky(ctx, W, H_, t);
      set.build(S, Object.assign({}, sp.room || {}, sp.opt || {}), ctx, t);
      const role = (base, o) => { if (!o || o.hide) return null; const p = Object.assign({}, o); if (p.arms) p.arms = pose(p.arms); return COUCHWORLD.person(S, base, p, standDef); };
      const he = role({ kind: 'boy', x: -0.62, z: -0.42, yaw: 0.18, head: { yaw: 0.25 } }, heO), she = role({ kind: 'girl', s: 0.95, x: 0.62, z: -0.42, yaw: -0.2, head: { yaw: -0.3 } }, sheO);
      const people = { he, she };
      for (const ex of val(sp.extras) || []) { const e = val(ex); if (!e || e.hide) continue; people[e.who] = role(Object.assign({ x: 0, z: 0.3, yaw: 0 }, COUCHWORLD.CAST[e.who] || {}), e); }
      for (const pt of val(sp.pets) || []) COUCHWORLD.pet(S, pt);
      if (sp.heHold && he) phone(S, add(midHands(he), [0, 0.06, 0.04]), 0.2, 1.1, screenOf(val(sp.heHold)));
      if (sp.sheHold && she) phone(S, add(midHands(she), [0, 0.06, 0.04]), -0.2, 1.1, screenOf(val(sp.sheHold)));
      if (sp.props) sp.props(S, t, u, he, she);
      S.render(ctx, W, H_, Object.assign({ dof: sp.dof == null ? (sp.cam === 'him' || sp.cam === 'her' || sp.cam === 'on' ? 0.22 : 0.28) : sp.dof }, set.night ? { bg: 'rgba(0,0,0,0)', dof: 0 } : {}));
      for (const f of sp.fx || []) {
        const d = f.who ? people[f.who] : null, hp = d ? S.proj(d.head) : [f.x ?? W / 2, f.y ?? 900], side = f.who === 'he' ? -1 : 1;
        const pu = popU(t, f.at ?? a, 0.3), x = hp[0] + (f.dx ?? (d ? side * 190 : 0)), y = hp[1] + (f.dy ?? (d ? -140 : 0));
        if (t < (f.at ?? a) || (f.until != null && t > f.until)) continue;
        if (f.k === 'q') FX.qmark(ctx, x, y, 0.8 * pu, f.text || '?', -0.12 * side);
        else if (f.k === 'sparkle') { FX.sparkle(ctx, x, y, 26 * pu, t * 2); FX.sparkle(ctx, x + 34, y + 30, 16 * pu, -t * 2); }
        else if (f.k === 'smug') { FX.sparkle(ctx, x, y, 26 * pu, t * 2); FX.sparkle(ctx, x + 34, y + 30, 16 * pu, -t * 2); }
        else if (f.k === 'sweat') FX.sweat(ctx, x - side * 60, y + 60, 1.1 * pu);
        else if (f.k === 'buzz') FX.buzz(ctx, x, y + 160, 1.2, Math.sin(t * 14) > 0 ? 1 : 0);
        else if (f.k === 'zzz') COUCH.zzz(ctx, x, y, t, pu);
        else if (f.k === 'heart') FX.heart(ctx, x, y, 60 * pu, Math.sin(t * 3) * 0.2);
        else if (f.k === 'hearts') COUCH.hearts(ctx, W, t, f.at, f.n || 5, f.y ?? 620);
        else if (f.k === 'bubble') COUCH.bubble(ctx, x, y, f.text, f.side ?? side, pu);
        else if (f.k === 'stamp') COUCH.stamp(ctx, f.x ?? x, f.y ?? y, f.text, pu, f.col, f.rot ?? 0.1);
        else if (f.k === 'ring') FX.ring(ctx, x, y, f.r || 90, f.col || (f.mark === 'tick' ? '#3cc46a' : '#ec3a32'), pu, f.mark || 'x');
        else if (f.k === 'speed') FX.speed(ctx, W, H_, x, y, pu, t);
        else if (f.k === 'card') { const px = f.px || 40; ctx.font = FONT(900, px); const w = ctx.measureText(f.text).width + px * 1.4; if (COUCH.card(ctx, f.x ?? W / 2, f.y ?? 940, w, px * 1.9, pu, f.fill || '#1c1a2a', f.rot ?? -0.04)) { COUCH.label(ctx, f.text, 0, 2, px, f.col || '#ffd23f'); ctx.restore(); } }
      }
      if (sp.over) sp.over(ctx, W, H_, t, S, he, she);
      let flash = 0; for (const at of [...(sp.flash || []), ...(sp.twist != null ? [sp.twist] : [])]) flash = Math.max(flash, 0.15 * pulse(t, at, 7));
      caps(ctx, W, t, a, b);
      finish(ctx, W, H_, t, flash);
    };
    function scoreSound(k) {
      SH.slice(1).forEach(([, s]) => k.play('whoosh', s - 0.06, { dur: 0.22, gain: 0.35, minor: true }));
      CAPS.forEach(([t]) => k.play('pop', t, { f: 760, gain: 0.35, minor: true }));
      for (const n of names) { const sp = specs[n];
        if (sp.twist != null) COUCH.sounds.twist(k, sp.twist);
        if (sp.nope != null) COUCH.sounds.nope(k, sp.nope);
        for (const f of sp.fx || []) { const at = f.at; if (at == null) continue;
          if (f.k === 'hearts') COUCH.sounds.heart(k, at, f.n || 5);
          else if (f.k === 'q') k.play('pop', at, { f: 500, gain: 0.4 });
          else if (f.k === 'sparkle' || f.k === 'smug') k.play('sparkle', at, { gain: 0.35 });
          else if (f.k === 'bubble') k.play('blip', at, { f: 1100, gain: 0.3 });
          else if (f.k === 'stamp' || f.k === 'card') k.play('stamp', at, { gain: 0.4 });
          else if (f.k === 'buzz') for (let j = 0; j < 2; j++) k.play('buzz', at + j * 0.14, { f: 170, dur: 0.1, gain: 0.3 });
          else if (f.k === 'ring') k.play(f.mark === 'tick' ? 'ding' : 'buzz', at, f.mark === 'tick' ? { f: 'E6', gain: 0.4 } : { f: 110, dur: 0.3, gain: 0.45 });
          else if (f.k === 'sweat') k.play('blip', at, { f: 600, gain: 0.25 });
        }
      }
      if (cfg.sound) cfg.sound(k, TM);
    }
    window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
    window.scoreSound = scoreSound;
  };
