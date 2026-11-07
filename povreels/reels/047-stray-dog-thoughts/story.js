  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood, o) => { dog(S, Object.assign({ x: 0, y: 0, z: 0, s: 0.62, col: [160, 150, 135], belly: [200, 190, 170], ears: 'big', grey: false, mood: mood === 'happy' ? 'calm' : mood === 'wow' ? 'calm' : mood, tongue: mood === 'happy', t }, o)); };
  makeCouch({
    keys: ["stray", "sandwich", "walk", "past", "home", "bed", "close", "food", "water", "dog"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_d1 = [first("d1") + 0.0, first("d1") + 1.48, first("d1") + 3.33], M_d1 = ["sad", "sad", "sad"];
      const T_d2 = [first("d2") + 0.0, first("d2") + 2.59, first("d2") + 5.55], M_d2 = ["sad", "calm", "happy"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_d3 = [first("d3") + 0.0, first("d3") + 1.11, first("d3") + 2.22], M_d3 = ["wow", "happy", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_d4 = [first("d4") + 0.0, first("d4") + 1.48, first("d4") + 2.22, first("d4") + 4.81], M_d4 = ["wow", "wow", "sad", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.22], M_cta = ["smug", "smug"];
      return {
      hook: { set: "street", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      d1: { set: "street", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d1[idx(T_d1, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 0.9, 0], ["Please don't walk past.", "I'm not asking for food.", "Okay. A little food."][[0.0, 1.48, 3.33].filter((o) => t - first("d1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.48, 3.33].filter((o) => t - first("d1") >= o - 0.05).length - 1], pu(t, first("d1"))); },  },
      d2: { set: "street", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d2[idx(T_d2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I watch the same shop every day.", "A man gave me half a sandwich once.", "I think about it daily."][[0.0, 2.59, 5.55].filter((o) => t - first("d2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 2.59, 5.55].filter((o) => t - first("d2") >= o - 0.05).length - 1], pu(t, first("d2"))); },  },
      n2: { set: "street", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); },  },
      d3: { set: "street", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d3[idx(T_d3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I knew it.", "You're the one.", "I've been waiting since the sandwich."][[0.0, 1.11, 2.22].filter((o) => t - first("d3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11, 2.22].filter((o) => t - first("d3") >= o - 0.05).length - 1], pu(t, first("d3"))); }, fx: [{ k: 'hearts', at: first("d3") + 1.0, n: 4, y: 560 }], },
      n3: { set: "street", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      d4: { set: "street", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d4[idx(T_d4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["Is this a bed?", "For me?", "I don't know how to do this.", "Can I just sit very close to you?"][[0.0, 1.48, 2.22, 4.81].filter((o) => t - first("d4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.48, 2.22, 4.81].filter((o) => t - first("d4") >= o - 0.05).length - 1], pu(t, first("d4"))); }, fx: [{ k: 'hearts', at: first("d4") + 1.0, n: 4, y: 560 }], },
      cta: { set: "street", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => {  }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
