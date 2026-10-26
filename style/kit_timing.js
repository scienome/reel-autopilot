  // ==================== reel kit: timing ====================
  // The script lives in reels/<id>/script.json (window.SCRIPT): [{ id, phrases: ['text', ...] }, ...].
  // When the voiceover exists, tools/voice.py writes timing.json (window.WORD_TIMES): { beatId: [[t0, t1], ...] },
  // one entry per word in script order. Without it, times are estimated (about 2.7 words a second).
  const syl = (w) => { const m = w.toLowerCase().replace(/[^a-z]/g, '').replace(/e$/, '').match(/[aeiouy]+/g); return Math.max(1, m ? m.length : 1); };
  const normWord = (w) => w.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9']/g, '');
  const REEL_TIMING = (BEATS) => {
    const MEAS = window.WORD_TIMES || null, WORDS = {};
    let clock = 0.2, end = 0;
    BEATS.forEach((b) => {
      const out = (WORDS[b.id] = []), meas = MEAS && MEAS[b.id];
      let wi = 0;
      b.phrases.forEach((ph) => {
        const text = typeof ph === 'string' ? ph : ph[0], ws = text.split(/\s+/).filter(Boolean);
        const tot = ws.reduce((s, w) => s + syl(w), 0), dur = ws.length / 2.7; let acc = 0;
        ws.forEach((w) => {
          let t0 = clock + (dur * acc) / tot, t1 = clock + (dur * (acc + syl(w))) / tot;
          if (meas && meas[wi]) [t0, t1] = meas[wi];
          out.push({ w: normWord(w), t: t0, e: t1 }); acc += syl(w); wi++; end = Math.max(end, t1);
        });
        clock += dur + (/[.?!…]$/.test(text) ? 0.38 : 0.22);
      });
    });
    const Wt = (id, word, n = 1) => { let k = 0; for (const x of WORDS[id] || []) if (x.w === normWord(word) && ++k === n) return x.t; throw new Error('script has no word "' + word + '" in beat ' + id); };
    const V = (id, word, n) => Wt(id, word, n) - 0.12; // visuals lead the word slightly
    const first = (id) => WORDS[id][0].t - 0.12;
    const DURATION = +(Math.max(end, MEAS && window.VOICE_END ? window.VOICE_END : 0) + 1.0).toFixed(2);
    return { WORDS, Wt, V, first, DURATION, measured: !!MEAS };
  };
  const K = (w) => [w, true]; // a caption keyword (yellow)
  // shots: [[name, start], ...]; returns [name, start, end] at t
  const makeShotAt = (SH, DURATION) => (t) => { let i = 0; for (let k = 0; k < SH.length; k++) if (t >= SH[k][1]) i = k; return [SH[i][0], SH[i][1], i + 1 < SH.length ? SH[i + 1][1] : DURATION]; };
  // captions: CAPS = [[t0, lines], ...]; draws the newest chunk that started inside this shot
  const makeCaps = (CAPS) => (ctx, W, t, a, b) => { let cur = null; for (const c of CAPS) if (c[0] >= a - 0.2 && c[0] < b && t >= c[0]) cur = c; if (cur) caption(ctx, W, cur[1], cur[0], t); };

