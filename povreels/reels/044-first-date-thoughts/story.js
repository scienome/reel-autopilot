  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const SUBJ = (o) => Object.assign({ who: 'exgirl', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["first", "thinks", "minutes", "counting", "ordered", "himself", "strike", "spill", "water", "yourself", "everywhere", "that's", "actually", "don't", "laugh", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_d1 = [first("d1"), V("d1", "two", 1), V("d1", "i'm", 1)], M_d1 = ["calm", "smug", "mad"];
      const T_d2 = [first("d2"), V("d2", "okay", 1), V("d2", "strike", 1)], M_d2 = ["wow", "calm", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_d3 = [first("d3"), V("d3", "oh", 2), V("d3", "don't", 1)], M_d3 = ["wow", "happy", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["happy"];
      const T_d4 = [first("d4"), V("d4", "second", 1), V("d4", "but", 1)], M_d4 = ["happy", "happy", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      d1: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d1[idx(T_d1, t)]], arms: 'cross' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["He's late.", "Two minutes late.", "I'm counting."][idx(T_d1, t)], pu(t, first("d1"))); }, },
      d2: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d2[idx(T_d2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["He ordered for himself first.", "Okay.", "Strike one."][idx(T_d2, t)], pu(t, first("d2"))); }, },
      n2: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      d3: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d3[idx(T_d3, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Oh no.", "Oh, that's actually cute.", "Don't laugh. Don't laugh."][idx(T_d3, t)], pu(t, first("d3"))); }, },
      n3: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      d4: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d4[idx(T_d4, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Okay.", "Second date.", "But you're paying."][idx(T_d4, t)], pu(t, first("d4"))); }, fx: [{ k: 'hearts', at: V('d4', 'Second'), n: 4, y: 560 }], },
      cta: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
