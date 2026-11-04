  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const branch = (S) => { S.limb([-0.4, 1.05, -0.2], [0.8, 1.1, -0.2], 0.04, 0.03, [100, 70, 45]); };
  const DRAW = (S, t, mood, o) => { branch(S); bird(S, Object.assign({ x: 0.2, y: 1.1, z: -0.2, s: 1.6, col: [150, 115, 80], belly: [220, 200, 160], wing: [120, 90, 60], beak: [240, 190, 60], t, mood }, o)); };
  makeCouch({
    keys: ["outside", "window", "thinks", "you're", "still", "phone", "interesting", "watched", "three", "years", "you've", "video'", "thousand", "times", "night", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_o1 = [first("o1"), V("o1", "you're", 1), V("o1", "interesting", 1)], M_o1 = ["calm", "smug", "smug"];
      const T_o2 = [first("o2"), V("o2", "you've", 1)], M_o2 = ["smug", "tired"];
      const T_n2 = [first("n2")], M_n2 = ["sad"];
      const T_o3 = [first("o3"), V("o3", "i'm", 1), V("o3", "we", 1)], M_o3 = ["calm", "happy", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_o4 = [first("o4"), V("o4", "that", 1), V("o4", "now", 1)], M_o4 = ["happy", "happy", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, },
      o1: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_o1[idx(T_o1, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.2, 1.85, -0.2], ["Two a.m.", "You're still on your phone.", "Interesting."][idx(T_o1, t)], pu(t, first("o1"))); }, },
      o2: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_o2[idx(T_o2, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.2, 1.85, -0.2], ["I've watched you for three years.", "You've said 'one more video' nine thousand times."][idx(T_o2, t)], pu(t, first("o2"))); }, },
      n2: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, },
      o3: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_o3[idx(T_o3, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.2, 1.85, -0.2], ["I see you.", "I'm up too.", "We can be awake together."][idx(T_o3, t)], pu(t, first("o3"))); }, fx: [{ k: 'hearts', at: V('o3', 'together'), n: 4, y: 560 }], },
      n3: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, },
      o4: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_o4[idx(T_o4, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.2, 1.85, -0.2], ["Hoo.", "That means goodnight.", "Now put your phone down."][idx(T_o4, t)], pu(t, first("o4"))); }, },
      cta: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
