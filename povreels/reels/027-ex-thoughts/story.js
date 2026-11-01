  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

const SUBJ = (o) => Object.assign({ who: 'exgirl', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["fine", "amazing", "hair", "great", "group", "chat", "phone", "buzzes", "prettier", "nicer", "hoodie", "sleep", "returning", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["smug"];
      const T_x1 = [first("x1"), V("x1", "i", 1), V("x1", "i", 2)], M_x1 = ["smug", "smug", "tired"];
      const T_n2 = [first("n2")], M_n2 = ["happy"];
      const T_x2 = [first("x2"), V("x2", "remember", 1)], M_x2 = ["wow", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_x3 = [first("x3"), V("x3", "is", 2), V("x3", "is", 3), V("x3", "please", 1)], M_x3 = ["mad", "mad", "sad", "sad"];
      const T_n4 = [first("n4")], M_n4 = ["sad"];
      const T_x4 = [first("x4"), V("x4", "i", 2), V("x4", "i'm", 1)], M_x4 = ["sad", "sad", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      x1: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_x1[idx(T_x1, t)]], arms: 'hold' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I'm totally fine.", "I look amazing.", "I spent two hours on this hair."][idx(T_x1, t)], pu(t, first("x1"))); }, },
      n2: { set: 'restaurant', cam: [[0, 1.8499999999999999, 2.35], [0, 2.17, -0.75], [0.0, 1.8599999999999999, 2.0500000000000003], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      x2: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_x2[idx(T_x2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Yes!", "Remember this for the group chat."][idx(T_x2, t)], pu(t, first("x2"))); }, fx: [{ k: 'hearts', at: first('x2'), n: 3, y: 560 }], },
      n3: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      x3: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, shake: first("x3"), props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_x3[idx(T_x3, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Who is she?", "Is she prettier?", "Is she nicer?", "Please say no."][idx(T_x3, t)], pu(t, first("x3"))); }, },
      n4: { set: 'restaurant', cam: [[0, 1.8499999999999999, 2.35], [0, 2.17, -0.75], [0.0, 1.8599999999999999, 2.0500000000000003], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n4[idx(T_n4, t)]] })], over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#6a7aa0'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }, },
      x4: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_x4[idx(T_x4, t)]] })], over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#6a7aa0'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 2.0, -0.75], ["I still have your hoodie.", "I sleep in it.", "I'm not returning it."][idx(T_x4, t)], pu(t, first("x4"))); }, },
      cta: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
