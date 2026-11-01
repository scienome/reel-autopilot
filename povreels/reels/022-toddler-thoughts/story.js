  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const SUBJ = (o) => Object.assign({ who: 'kid', s: 0.72, x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold', shirt: [250, 220, 120], pants: [90, 150, 230], hair: [90, 60, 40] }, o);
  makeCouch({
    keys: ["toddler", "banana", "scream", "bedtime", "tired", "nine", "hundred", "years", "lights", "stay", "asleep", "love", "angel", "boss", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["happy"];
      const T_t1 = [first("t1"), V("t1", "not", 1), V("t1", "the", 1)], M_t1 = ["happy", "mad", "mad"];
      const T_t2 = [first("t2"), V("t2", "i", 1)], M_t2 = ["mad", "mad"];
      const T_n2 = [first("n2")], M_n2 = ["tired"];
      const T_t3 = [first("t3"), V("t3", "i've", 1)], M_t3 = ["happy", "tired"];
      const T_n3 = [first("n3")], M_n3 = ["sad"];
      const T_t4 = [first("t4"), V("t4", "just", 1), V("t4", "i", 1)], M_t4 = ["sad", "sad", "happy"];
      const T_n4 = [first("n4")], M_n4 = ["calm"];
      const T_t5 = [first("t5"), V("t5", "i", 1), V("t5", "where's", 1)], M_t5 = ["wow", "happy", "mad"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'kitchen', cam: [[0, 1.25, 1.35], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 1.05], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      t1: { set: 'kitchen', cam: [[0, 1.25, 0.95], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 0.6499999999999999], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t1[idx(T_t1, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.5, -0.75], ["Banana.", "Not that banana.", "The other banana."][idx(T_t1, t)], pu(t, first("t1"))); }, },
      t2: { set: 'kitchen', cam: [[0, 1.25, 0.95], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 0.6499999999999999], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t2[idx(T_t2, t)]], arms: 'cheer' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.5, -0.75], ["You cut it wrong.", "I will scream until you fix it."][idx(T_t2, t)], pu(t, first("t2"))); }, },
      n2: { set: 'bedroom', cam: [[0, 1.25, 1.35], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 1.05], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); timeCard(ctx, t, first("n2") - 0.1, "BEDTIME"); }, },
      t3: { set: 'bedroom', cam: [[0, 1.25, 0.95], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 0.6499999999999999], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t3[idx(T_t3, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 1.5, -0.75], ["I'm not tired.", "I've been awake for nine hundred years."][idx(T_t3, t)], pu(t, first("t3"))); }, },
      n3: { set: 'bedroom', cam: [[0, 1.2999999999999998, 1.9500000000000002], [0, 1.6199999999999999, -0.75], [0.0, 1.3099999999999998, 1.6500000000000001], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, },
      t4: { set: 'bedroom', cam: [[0, 1.25, 0.95], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 0.6499999999999999], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t4[idx(T_t4, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 1.5, -0.75], ["Stay.", "Just till I'm asleep.", "I like it when you're here."][idx(T_t4, t)], pu(t, first("t4"))); }, fx: [{ k: 'hearts', at: V('t4', 'I'), n: 3, y: 600 }], },
      n4: { set: 'bedroom', cam: [[0, 1.25, 1.35], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 1.05], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n4[idx(T_n4, t)]] })], over: (ctx, W, H_, t, S) => { timeCard(ctx, t, first("n4") - 0.1, "5 A.M."); }, },
      t5: { set: 'bedroom', cam: [[0, 1.25, 0.95], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 0.6499999999999999], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t5[idx(T_t5, t)]], arms: 'cheer' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.5, -0.75], ["Wake up!", "I love you!", "Where's my banana?"][idx(T_t5, t)], pu(t, first("t5"))); }, },
      cta: { set: 'kitchen', cam: [[0, 1.25, 1.35], [0, 1.6199999999999999, -0.75], [0.0, 1.265, 1.05], [0, 1.6199999999999999, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
