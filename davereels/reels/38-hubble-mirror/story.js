  // Dave reel 38: Hubble's flawed mirror (1990). The edge was 2.2 microns too flat because the reflective null corrector
  // used to test it was 1.3 mm out; fixed in 1993 with corrective optics. Dave holds the eye chart. R.I.P. Dave #37.
  const FOIL = [214, 216, 224], PANEL = [60, 80, 150];
  // Hubble along +x (aperture at +x); o.door 0..1 opens the lid; o.panel = solar wing swing angle
  const hubble = (S, c, o = {}) => { const T = (p) => add(rotY(p, o.yaw || 0), c);
    S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [-2.0, 0, 0])), 0.75, 3.2, FOIL, 18, { paint: (cc, w, h) => { cc.strokeStyle = 'rgba(0,0,0,0.12)'; for (let i = 1; i < 10; i++) { cc.beginPath(); cc.moveTo(0, (i * h) / 10); cc.lineTo(w, (i * h) / 10); cc.stroke(); } } });
    S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [-2.6, 0, 0])), 0.8, 0.6, [180, 182, 190], 18);
    S.box((p) => T(add(rotZ(p, -(o.door ?? 1) * 1.2), [1.2, 0.75, 0])), 0.02, 0.02, 0.01, FOIL); S.cyl((p) => T(add(rotZ(p, -Math.PI / 2 + (1 - (o.door ?? 1)) * 0), [1.2, 0, 0])), 0.7, 0.02, [30, 34, 44], 18);
    for (const sz of [-1, 1]) S.box((p) => T(add(rotZ(rotY(p, 0), (o.panel || 0) * sz), [-0.6, 0, sz * 2.2])), 1.2, 0.02, 1.2, PANEL, { bevel: 0.05, paint: (cc, w, h) => { cc.strokeStyle = 'rgba(200,220,255,0.4)'; for (let i = 1; i < 8; i++) { cc.beginPath(); cc.moveTo((i * w) / 8, 0); cc.lineTo((i * w) / 8, h); cc.stroke(); } } });
    for (const sz of [-1, 1]) S.rod(T([-0.6, 0, sz * 0.75]), T([-0.6, 0, sz * 1.0]), 0.03, [150, 150, 160], 6); };
  // a framed picture of a galaxy, blurred by `blur` px
  const photo = (ctx, W, H_, blur, a, label) => { if (a <= 0) return; const L = MXC.ph || (MXC.ph = H.layer(260, 260)), g = L.getContext('2d'); g.fillStyle = '#05060c'; g.fillRect(0, 0, 260, 260); const r = H.rng(7); for (let i = 0; i < 160; i++) { const ang = r() * TAU * 3, d = r() * 110; g.fillStyle = `rgba(255,${200 + r() * 55},${180 + r() * 75},${0.4 + r() * 0.6})`; g.fillRect(130 + Math.cos(ang + d * 0.04) * d, 130 + Math.sin(ang + d * 0.04) * d * 0.6, 3, 3); } g.fillStyle = '#fff2d0'; g.beginPath(); g.arc(130, 130, 12, 0, TAU); g.fill();
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#f4f2ee'; ctx.fillRect(W * 0.2 - 8, H_ * 0.56 - 8, W * 0.6 + 16, W * 0.6 + 50); ctx.filter = `blur(${blur}px)`; ctx.drawImage(L, W * 0.2, H_ * 0.56, W * 0.6, W * 0.6); ctx.filter = 'none'; ctx.fillStyle = '#1a1820'; ctx.font = FONT(800, 28); ctx.textAlign = 'center'; ctx.fillText(label, W / 2, H_ * 0.56 + W * 0.6 + 30); ctx.restore(); };
  makeDave({
    rip: { n: 37, cause: 'cause of death:\nlost focus' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'space', cam: { orbit: [[0, 0, 0], 10, 9, 2.4, 1.8, 0.7, 0.4, [-0.6, 0, 0]] },
        build: (S) => hubble(S, [0, 0, 0]),
        over: (ctx, W, H_, t) => photo(ctx, W, H_, 9, ramp(t, V('hook', 'blurry') - 0.3, 0.3), 'FIRST LIGHT: BLURRY'),
        tags: [['HUBBLE · 1990', 0.2, 0.15], ['$1.5 BILLION', V('hook', 'billion'), 0.22, { col: '#ffd24a' }]] },
      // the mirror on the bench and its edge profile: the right curve vs the one they made (exaggerated)
      flaw: { set: 'lab', cam: { orbit: [[0, 0, 0], 3.2, 2.9, 1.3, 1.3, -0.3, 0.1, [0, 1.15, 0]] },
        build: (S) => { stand(S, [0, 0, 0], 0.5, 0.35, 0.55); S.cyl((p) => add(rotX(p, Math.PI / 2 - 0.25), [0, 1.15, 0]), 0.6, 0.08, [200, 220, 240], 28, { cap: [230, 240, 252], gloss: 0.8 }); },
        over: (ctx, W, H_, t) => { const a = ramp(t, V('flaw', 'edge') - 0.3, 0.3); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(20,20,28,0.85)'; ctx.fillRect(W * 0.08, H_ * 0.58, W * 0.84, H_ * 0.17); ctx.lineWidth = 6; const curve = (k, col) => { ctx.strokeStyle = col; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = -1 + i / 20, y = 0.9 * x * x - k * x ** 6; const px = W * 0.5 + x * W * 0.36, py = H_ * 0.73 - y * H_ * 0.11; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }; curve(0, '#7ee07a'); curve(0.35, '#ff6a5a'); ctx.font = FONT(800, 24); ctx.fillStyle = '#7ee07a'; ctx.fillText('SPEC', W * 0.12, H_ * 0.61); ctx.fillStyle = '#ff6a5a'; ctx.fillText('MADE', W * 0.12, H_ * 0.645); ctx.restore(); },
        tags: [['EDGE TOO FLAT', V('flaw', 'edge'), 0.15, { col: '#ff6a5a' }], ['2.2 MICRONS', V('flaw', 'two'), 0.22, { col: '#ffd24a' }], ['= 1/50 OF A SHEET OF PAPER', V('flaw', 'fiftieth'), 0.29]] },
      // the test rig: a tube of lenses, one of them sitting 1.3 mm out of place (shown far bigger)
      cause: { set: 'lab', cam: { orbit: [[0, 0, 0], 3.2, 2.8, 1.4, 1.3, 0.4, 0.1, [0, 1.1, 0]] },
        crew: [{ who: 'scientist', pos: [-1.4, 0, 0.4], pose: 'thumbs', yaw: 0.7 }],
        build: (S, t) => { const off = 0.18 * ramp(t, V('cause', 'wrong') - 0.2, 0.4); S.cyl((p) => add(rotZ(p, Math.PI / 2), [0.9, 1.1, 0]), 0.16, 1.8, [180, 186, 196], 14, { alpha: 0.35 }); [-0.6, 0, 0.5].forEach((x, i) => S.cyl((p) => add(rotZ(p, Math.PI / 2), [x + (i === 1 ? off : 0), 1.1, 0]), 0.14, 0.03, i === 1 && off > 0.05 ? [255, 120, 100] : [170, 220, 255], 16, { glow: i === 1 && off > 0.05 })); },
        tags: [['TEST TOOL OFF BY 1.3 mm', V('cause', 'wrong'), 0.15, { col: '#ff6a5a' }], ['PERFECT, TO THE WRONG SPEC', V('cause', 'perfectly'), 0.22, { col: '#ffd24a' }]] },
      fix: { set: 'space', cam: { orbit: [[0, 0, 0], 6.5, 5.8, 1.2, 0.9, -0.5, -0.2, [-0.6, 0, 0]] },
        build: (S) => hubble(S, [0, 0, 0]),
        crew: [{ who: 'astronaut', pos: [-1.6, 0.8, 0.9], pose: 'carry', yaw: -0.6 }, { who: 'astronaut', pos: [-0.6, -1.7, 0.6], pose: 'wave', yaw: 0.2, roll: 0.6 }],
        over: (ctx, W, H_, t, u, S) => { const a = ramp(t, V('fix', 'glasses') - 0.2, 0.3); photo(ctx, W, H_, 0, ramp(t, V('fix', 'optics'), 0.3) * (1 - a), 'AFTER: SHARP'); if (a <= 0) return; const c = S.proj([1.3, 0.2, 0]); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#1a1820'; ctx.lineWidth = 12; for (const dx of [-60, 60]) { ctx.beginPath(); ctx.arc(c[0] + dx, c[1], 48, 0, TAU); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(c[0] - 12, c[1]); ctx.lineTo(c[0] + 12, c[1]); ctx.stroke(); ctx.restore(); },
        tags: [['1993 · SERVICING MISSION', V('fix', 'nineteen'), 0.15], ['CORRECTIVE OPTICS', V('fix', 'corrective'), 0.22, { col: '#7ee07a' }], ['= GLASSES', V('fix', 'glasses'), 0.29, { col: '#ffd24a', px: 46 }]] },
      // Dave floats in front of the telescope with an eye chart. A solar wing swings round and swats him into deep space.
      end: { set: 'space', cam: { orbit: [[1.2, 0, 0], 7, 7.5, 1.2, 1.5, 0.9, 0.7, [0.3, 0, 0]] },
        build: (S, t) => { const hit = V('end', 'chart') - 0.1; hubble(S, [0, 0, 0], { panel: t > hit - 0.4 ? 1.2 * H.clamp((t - hit + 0.4) / 0.4) : 0 }); },
        dave: (t) => { const hit = V('end', 'chart') - 0.1, u = H.clamp((t - hit) / 2.4); return { pos: [2.8, -0.9, 0.6], pose: 'carry', yaw: -Math.PI / 2, t, s: 0.8, death: u > 0 ? 'blown' : undefined, u, to: [4, 2.5, -5], arc: 0.4, mouth: 1, xeyes: u > 0.2 }; },
        over: (ctx, W, H_, t, u, S) => { const hit = V('end', 'chart') - 0.1; if (t > hit) return; const p = S.proj([2.8, 0.15, 0.9]); ctx.save(); ctx.fillStyle = '#f4f2ee'; ctx.fillRect(p[0] - 44, p[1] - 56, 88, 112); ctx.fillStyle = '#1a1820'; ['E', 'F P', 'T O Z'].forEach((l, i) => { ctx.font = FONT(800, 34 - i * 9); ctx.textAlign = 'center'; ctx.fillText(l, p[0], p[1] - 20 + i * 30); }); ctx.restore(); },
        flash: [V('end', 'chart') - 0.1], shake: V('end', 'chart') - 0.1 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.tone(0.1, { f: 'C3', type: 'sine', dur: 2, gain: 0.05, a: 0.5, minor: true }); k.play('error', V('hook', 'blurry'), { gain: 0.35 });
      k.play('stamp', V('flaw', 'two'), { gain: 0.4 });
      k.play('click', V('cause', 'wrong'), { gain: 0.4 }); k.play('ding', V('cause', 'perfectly'), { gain: 0.3 });
      k.play('success', V('fix', 'optics'), { gain: 0.35 }); k.play('pop', V('fix', 'glasses'), { gain: 0.4 });
      k.play('whoosh', V('end', 'chart') - 0.5, { dur: 0.45, gain: 0.5 }); k.play('slap', V('end', 'chart') - 0.1, { gain: 0.7 }); k.play('impact', V('end', 'chart') - 0.1, { gain: 0.5 });
    },
  });
