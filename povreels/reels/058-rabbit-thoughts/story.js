  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood, o) => { dog(S, Object.assign({ x: 0, y: 0, z: 0, s: 0.62, col: [244, 242, 238], belly: [252, 250, 246], ears: 'up', earCol: [238, 190, 200], mood: mood === 'happy' || mood === 'wow' ? 'calm' : mood, t }, o)); for (const sd of [-1, 1]) { S.limb([sd * 0.05, 0.5, 0.03], [sd * 0.09 + Math.sin(t * 2) * 0.01, 1.0, -0.03], 0.045, 0.03, [244, 242, 238]); S.limb([sd * 0.05, 0.56, 0.05], [sd * 0.085, 0.95, -0.01], 0.022, 0.014, [238, 190, 200]); } };
  makeCouch({
    keys: ["rabbit", "sitting", "planning", "cable", "jump", "carrot", "thump", "trust", "safe", "rare"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_r1 = [first("r1") + 0.0, first("r1") + 1.85, first("r1") + 2.96], M_r1 = ["calm", "smug", "mad"];
      const T_r2 = [first("r2") + 0.0, first("r2") + 2.96, first("r2") + 4.07], M_r2 = ["happy", "calm", "happy"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_r3 = [first("r3") + 0.0, first("r3") + 2.22, first("r3") + 3.7], M_r3 = ["smug", "smug", "wow"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["calm"];
      const T_r4 = [first("r4") + 0.0, first("r4") + 1.48, first("r4") + 3.7], M_r4 = ["sad", "happy", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.22], M_cta = ["smug", "smug"];
      return {
      hook: { set: "living", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      r1: { set: "living", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r1[idx(T_r1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.0, 0], ["You think I'm sitting quietly.", "I am planning.", "The cable is next."][idx(T_r1, t)], pu(t, first("r1"))); } },
      r2: { set: "living", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r2[idx(T_r2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.0, 0], ["I did a happy jump at three a.m.", "You were asleep.", "I did it for me."][idx(T_r2, t)], pu(t, first("r2"))); } },
      n2: { set: "living", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      r3: { set: "living", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r3[idx(T_r3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.0, 0], ["I will pretend I don't care.", "I'm turning my back.", "Is that a whole carrot?"][idx(T_r3, t)], pu(t, first("r3"))); } },
      n3: { set: "living", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      r4: { set: "living", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r4[idx(T_r4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.0, 0], ["Thumping means I'm scared.", "But I'm not scared of you.", "That's rare. Don't tell the others."][idx(T_r4, t)], pu(t, first("r4"))); }, fx: [{ k: 'hearts', at: first("r4") + 1.0, n: 4, y: 560 }] },
      cta: { set: "living", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
