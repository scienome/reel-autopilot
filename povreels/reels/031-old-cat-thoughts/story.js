  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const cm = (m) => m === 'happy' ? 'calm' : m === 'wow' ? 'calm' : m;
  const DRAW = (S, t, mood, o) => { S.rbox((p) => add(p, [0, 0.05, 0]), 0.5, 0.05, 0.38, [200, 150, 180], { bevel: 0.5 }); cat(S, Object.assign({ x: 0, y: 0.1, z: 0, s: 0.62, col: [150, 145, 140], mood: cm(mood), t }, o)); };
  makeCouch({
    keys: ["thinks", "she's", "fifteen", "years", "before", "first", "phone", "heartbreak", "every", "paper", "passed", "anyway", "you're", "welcome", "sleeps", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook"), V("hook", "she's", 1)], M_hook = ["calm", "calm"];
      const T_c1 = [first("c1"), V("c1", "before", 2)], M_c1 = ["calm", "smug"];
      const T_c2 = [first("c2"), V("c2", "you", 2)], M_c2 = ["smug", "happy"];
      const T_n2 = [first("n2")], M_n2 = ["tired"];
      const T_c3 = [first("c3"), V("c3", "but", 1), V("c3", "every", 1)], M_c3 = ["tired", "sad", "sad"];
      const T_n3 = [first("n3")], M_n3 = ["sad"];
      const T_c4 = [first("c4"), V("c4", "i", 1), V("c4", "i", 2)], M_c4 = ["happy", "smug", "sad"];
      const T_n4 = [first("n4")], M_n4 = ["calm"];
      const T_c5 = [first("c5"), V("c5", "just", 1)], M_c5 = ["happy", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, },
      c1: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c1[idx(T_c1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I was here before your first phone.", "Before your first heartbreak."][idx(T_c1, t)], pu(t, first("c1"))); }, },
      c2: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c2[idx(T_c2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I sat on every exam paper you had.", "You passed anyway. You're welcome."][idx(T_c2, t)], pu(t, first("c2"))); }, },
      n2: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { timeCard(ctx, t, first("n2") - 0.1, "NOW"); }, },
      c3: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c3[idx(T_c3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["My legs are slow now.", "But I still wait at the door.", "Every evening."][idx(T_c3, t)], pu(t, first("c3"))); }, },
      n3: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, },
      c4: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c4[idx(T_c4, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 0.9, 0], ["There you are.", "I wasn't worried.", "I was very worried."][idx(T_c4, t)], pu(t, first("c4"))); }, },
      n4: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n4[idx(T_n4, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }, },
      c5: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_c5[idx(T_c5, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 0.9, 0], ["Stay.", "Just like when you were small."][idx(T_c5, t)], pu(t, first("c5"))); }, fx: [{ k: 'hearts', at: V('c5', 'Stay'), n: 4, y: 560 }], },
      cta: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
