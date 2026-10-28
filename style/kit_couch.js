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
      const cam = typeof sp.cam === 'string' || !sp.cam ? COUCH.CAMS[sp.cam || 'wide'] : sp.cam;
      const [E, TG] = shotCam(t, a, b, ...cam); const S = Scene(E, TG, W, H_); livingRoom(S, sp.room || { table: true });
      const val = (v) => (typeof v === 'function' ? v(t, u) : v);
      const he = doll((o) => BOY(S, o), val(sp.he) || { arms: 'rest' }), she = doll((o) => GIRL(S, o), val(sp.she) || { arms: 'rest' });
      if (sp.heHold && he) phone(S, add(midHands(he), [0, 0.06, 0.04]), 0.2, 1.1, screenOf(val(sp.heHold)));
      if (sp.sheHold && she) phone(S, add(midHands(she), [0, 0.06, 0.04]), -0.2, 1.1, screenOf(val(sp.sheHold)));
      if (sp.props) sp.props(S, t, u, he, she);
      S.render(ctx, W, H_, { dof: sp.dof == null ? (sp.cam === 'him' || sp.cam === 'her' ? 0.22 : 0.28) : sp.dof });
      for (const f of sp.fx || []) {
        const d = f.who === 'he' ? he : f.who === 'she' ? she : null, hp = d ? S.proj(d.head) : [f.x ?? W / 2, f.y ?? 900], side = f.who === 'he' ? -1 : 1;
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
