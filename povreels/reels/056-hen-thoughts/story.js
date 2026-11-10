  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood, o) => { S.rbox((p) => add(p, [0.2, 1.02, -0.2]), 0.5, 0.05, 0.4, [235, 245, 252], { bevel: 0.5 }); bird(S, Object.assign({ x: 0.2, y: 1.07, z: -0.2, s: 1.8, col: [247, 242, 232], belly: [252, 248, 240], wing: [228, 216, 196], beak: [240, 170, 50], crest: [220, 50, 60], t, mood }, o)); };
  makeCouch({
    keys: ["hen", "egg", "nine", "years", "thank", "duck", "swim", "mums", "watch", "count"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_h1 = [first("h1") + 0.0, first("h1") + 1.48, first("h1") + 3.7, first("h1") + 4.81], M_h1 = ["smug", "mad", "sad", "sad"];
      const T_h2 = [first("h2") + 0.0, first("h2") + 2.22, first("h2") + 2.96], M_h2 = ["mad", "calm", "smug"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_h3 = [first("h3") + 0.0, first("h3") + 2.96, first("h3") + 4.81], M_h3 = ["mad", "smug", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_h4 = [first("h4") + 0.0, first("h4") + 1.85, first("h4") + 4.81], M_h4 = ["sad", "happy", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 3.33], M_cta = ["smug", "smug"];
      return {
      hook: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      h1: { set: "street", cam: [[0.2, 1.75, 1.9], [0.2, 1.75, -0.2], [0.2, 1.74, 1.6], [0.2, 1.75, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_h1[idx(T_h1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.0, -0.2], ["Everyone thinks I'm dumb.", "I laid an egg every day.", "For nine years.", "Nobody said thank you."][idx(T_h1, t)], pu(t, first("h1"))); } },
      h2: { set: "street", cam: [[0.2, 1.75, 1.9], [0.2, 1.75, -0.2], [0.2, 1.74, 1.6], [0.2, 1.75, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_h2[idx(T_h2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.0, -0.2], ["You eat my work for breakfast.", "That's fine.", "I'm not bitter."][idx(T_h2, t)], pu(t, first("h2"))); } },
      n2: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      h3: { set: "street", cam: [[0.2, 1.75, 1.9], [0.2, 1.75, -0.2], [0.2, 1.74, 1.6], [0.2, 1.75, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_h3[idx(T_h3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.0, -0.2], ["The farmer swapped it for a duck egg.", "I know. I can count.", "I'm keeping it anyway."][idx(T_h3, t)], pu(t, first("h3"))); }, fx: [{ k: 'hearts', at: first("h3") + 1.0, n: 4, y: 560 }] },
      n3: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      h4: { set: "street", cam: [[0.2, 1.75, 1.9], [0.2, 1.75, -0.2], [0.2, 1.74, 1.6], [0.2, 1.75, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_h4[idx(T_h4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.0, -0.2], ["He swims. I can't swim.", "So I stand at the edge and watch.", "That's what mums do."][idx(T_h4, t)], pu(t, first("h4"))); }, fx: [{ k: 'hearts', at: first("h4") + 1.0, n: 4, y: 560 }] },
      cta: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
