  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const cm = (m) => m;
  const DRAW = (S, t, mood, o) => { S.rbox((p) => add(p, [0, 0.05, 0]), 0.5, 0.05, 0.38, [120, 40, 70], { bevel: 0.5 }); cat(S, Object.assign({ x: 0, y: 0.1, z: 0, s: 0.62, col: [32, 32, 40], mood: cm(mood), t }, o)); };
  makeCouch({
    keys: ["black", "luck", "crossed", "promotion", "cold", "chest", "purring", "medicine", "feed", "path"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_c1 = [first("c1") + 0.0, first("c1") + 1.48, first("c1") + 1.85], M_c1 = ["smug", "mad", "sad"];
      const T_c2 = [first("c2") + 0.0, first("c2") + 1.48, first("c2") + 2.96], M_c2 = ["smug", "smug", "smug"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_c3 = [first("c3") + 0.0, first("c3") + 1.11, first("c3") + 3.33], M_c3 = ["calm", "happy", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_c4 = [first("c4") + 0.0, first("c4") + 0.74, first("c4") + 2.22], M_c4 = ["mad", "happy", "smug"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.59], M_cta = ["smug", "smug"];
      return {
      hook: { set: "bedroom", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      c1: { set: "bedroom", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c1[idx(T_c1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["You walked around me.", "Rude.", "I'm not bad luck."][[0.0, 1.48, 1.85].filter((o) => t - first("c1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.48, 1.85].filter((o) => t - first("c1") >= o - 0.05).length - 1], pu(t, first("c1"))); },  },
      c2: { set: "bedroom", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c2[idx(T_c2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["Your exam went well.", "You got the promotion.", "Who do you think did that?"][[0.0, 1.48, 2.96].filter((o) => t - first("c2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.48, 2.96].filter((o) => t - first("c2") >= o - 0.05).length - 1], pu(t, first("c2"))); },  },
      n2: { set: "bedroom", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); },  },
      c3: { set: "bedroom", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c3[idx(T_c3, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 0.9, 0], ["Don't tell anyone.", "But I'm sitting on your chest.", "That's called purring. It's medicine."][[0.0, 1.11, 3.33].filter((o) => t - first("c3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11, 3.33].filter((o) => t - first("c3") >= o - 0.05).length - 1], pu(t, first("c3"))); }, fx: [{ k: 'hearts', at: first("c3") + 1.0, n: 4, y: 560 }], },
      n3: { set: "bedroom", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      c4: { set: "bedroom", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c4[idx(T_c4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["Luck? Please.", "I just like you.", "Now feed me."][[0.0, 0.74, 2.22].filter((o) => t - first("c4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74, 2.22].filter((o) => t - first("c4") >= o - 0.05).length - 1], pu(t, first("c4"))); },  },
      cta: { set: "bedroom", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => {  }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
