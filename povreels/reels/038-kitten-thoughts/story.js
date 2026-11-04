  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const cm = (m) => m === 'happy' ? 'calm' : m === 'wow' ? 'calm' : m;
  const DRAW = (S, t, mood, o) => { cat(S, Object.assign({ x: 0, y: 0, z: 0, s: 0.5, col: [235, 150, 70], mood: cm(mood), t }, o)); };
  makeCouch({
    keys: ["kitten", "thinks", "everything", "sandwich", "three", "nowhere", "climbs", "curtain", "stuck", "meant", "rescue", "saved", "forever", "starting", "after", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_k1 = [first("k1"), V("k1", "the", 1), V("k1", "your", 1), V("k1", "your", 2)], M_k1 = ["happy", "smug", "smug", "happy"];
      const T_k2 = [first("k2"), V("k2", "time", 1), V("k2", "very", 1)], M_k2 = ["wow", "happy", "happy"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_k3 = [first("k3"), V("k3", "i", 2), V("k3", "help", 1)], M_k3 = ["smug", "sad", "sad"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_k4 = [first("k4"), V("k4", "i", 1), V("k4", "starting", 1)], M_k4 = ["happy", "happy", "tired"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'living', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, },
      k1: { set: 'living', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_k1[idx(T_k1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["Everything is mine.", "The sofa.", "Your face.", "Your sandwich."][idx(T_k1, t)], pu(t, first("k1"))); }, },
      k2: { set: 'living', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_k2[idx(T_k2, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 0.9, 0], ["Three a.m.", "Time to run.", "Very fast. Nowhere."][idx(T_k2, t)], pu(t, first("k2"))); }, },
      n2: { set: 'living', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, },
      k3: { set: 'living', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_k3[idx(T_k3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I meant to do this.", "I live up here now.", "Help."][idx(T_k3, t)], pu(t, first("k3"))); }, },
      n3: { set: 'living', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, },
      k4: { set: 'living', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_k4[idx(T_k4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["You saved me.", "I will love you forever.", "Starting after my nap."][idx(T_k4, t)], pu(t, first("k4"))); }, fx: [{ k: 'hearts', at: V('k4', 'love'), n: 4, y: 560 }], },
      cta: { set: 'living', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
