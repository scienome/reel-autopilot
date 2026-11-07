  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const PERSON = (mood, t) => ({ who: 'bff', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold', face: FACE[mood] });
  makeCouch({
    keys: ["fine", "ask", "twice", "friend", "tired", "today", "text", "dinner", "listen", "here"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_f1 = [first("f1") + 0.0, first("f1") + 0.74, first("f1") + 1.48], M_f1 = ["smug", "smug", "sad"];
      const T_f2 = [first("f2") + 0.0, first("f2") + 1.11, first("f2") + 2.59], M_f2 = ["tired", "sad", "sad"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_f3 = [first("f3") + 0.0, first("f3") + 0.74, first("f3") + 1.48], M_f3 = ["wow", "sad", "sad"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["calm"];
      const T_f4 = [first("f4") + 0.0, first("f4") + 0.74, first("f4") + 3.33], M_f4 = ["happy", "happy", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.96], M_cta = ["smug", "smug"];
      return {
      hook: { set: "living", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_hook[idx(T_hook, t)], t)], over: (ctx, W, H_, t, S) => {  },  },
      f1: { set: "living", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_f1[idx(T_f1, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I'm fine.", "Totally fine.", "Don't look at me like that."][[0.0, 0.74, 1.48].filter((o) => t - first("f1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74, 1.48].filter((o) => t - first("f1") >= o - 0.05).length - 1], pu(t, first("f1"))); },  },
      f2: { set: "living", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_f2[idx(T_f2, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I'm so tired.", "I haven't told anyone.", "Please ask me again."][[0.0, 1.11, 2.59].filter((o) => t - first("f2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11, 2.59].filter((o) => t - first("f2") >= o - 0.05).length - 1], pu(t, first("f2"))); },  },
      n2: { set: "living", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_n2[idx(T_n2, t)], t)], over: (ctx, W, H_, t, S) => {  },  },
      f3: { set: "living", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_f3[idx(T_f3, t)], t)], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 2.0, -0.75], ["Oh no.", "You noticed.", "Okay. Okay. It's a lot."][[0.0, 0.74, 1.48].filter((o) => t - first("f3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74, 1.48].filter((o) => t - first("f3") >= o - 0.05).length - 1], pu(t, first("f3"))); },  },
      n3: { set: "living", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_n3[idx(T_n3, t)], t)], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); },  },
      f4: { set: "living", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_f4[idx(T_f4, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Thank you.", "I needed one person to ask twice.", "It was you."][[0.0, 0.74, 3.33].filter((o) => t - first("f4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74, 3.33].filter((o) => t - first("f4") >= o - 0.05).length - 1], pu(t, first("f4"))); }, fx: [{ k: 'hearts', at: first("f4") + 1.0, n: 4, y: 560 }], },
      cta: { set: "living", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_cta[idx(T_cta, t)], t)], over: (ctx, W, H_, t, S) => {  }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
