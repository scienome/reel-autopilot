  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const SUBJ = (o) => Object.assign({ who: 'exgirl', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["sister", "thinks", "charger", "again", "broke", "didn't", "twenty", "fifteen", "someone", "school", "nobody", "touches", "brother", "except", "apologise", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_s1 = [first("s1"), V("s1", "again", 1), V("s1", "he", 2)], M_s1 = ["mad", "mad", "smug"];
      const T_s2 = [first("s2"), V("s2", "he", 2), V("s2", "i", 2)], M_s2 = ["smug", "calm", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["mad"];
      const T_s3 = [first("s3"), V("s3", "except", 1)], M_s3 = ["mad", "smug"];
      const T_n3 = [first("n3")], M_n3 = ["smug"];
      const T_s4 = [first("s4"), V("s4", "now", 1)], M_s4 = ["smug", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'bedroom', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      s1: { set: 'bedroom', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_s1[idx(T_s1, t)]], arms: 'cross' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["He took my charger.", "Again.", "He will pay."][idx(T_s1, t)], pu(t, first("s1"))); }, },
      s2: { set: 'bedroom', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_s2[idx(T_s2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I told Mum he broke the vase.", "He didn't.", "I did. In twenty fifteen."][idx(T_s2, t)], pu(t, first("s2"))); }, },
      n2: { set: 'bedroom', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      s3: { set: 'bedroom', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, shake: V('s3', 'Nobody'), props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_s3[idx(T_s3, t)]], arms: 'cross' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Nobody touches my brother.", "Except me."][idx(T_s3, t)], pu(t, first("s3"))); }, },
      n3: { set: 'bedroom', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      s4: { set: 'bedroom', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_s4[idx(T_s4, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Don't ask what I did.", "Now give me my charger back."][idx(T_s4, t)], pu(t, first("s4"))); }, },
      cta: { set: 'bedroom', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
