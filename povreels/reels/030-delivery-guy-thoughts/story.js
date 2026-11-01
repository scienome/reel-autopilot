  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

const SUBJ = (o) => Object.assign({ who: 'delivery', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["stairs", "lift", "nine", "pizzas", "judgement", "pyjamas", "third", "friends", "tip", "cry", "running", "robbery", "ten", "tomorrow", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["tired"];
      const T_v1 = [first("v1"), V("v1", "no", 1), V("v1", "of", 2)], M_v1 = ["tired", "tired", "mad"];
      const T_v2 = [first("v2"), V("v2", "for", 1), V("v2", "no", 1), V("v2", "okay", 1)], M_v2 = ["wow", "calm", "calm", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["calm"];
      const T_v3 = [first("v3"), V("v3", "i", 1), V("v3", "we", 1)], M_v3 = ["smug", "happy", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["sad"];
      const T_v4 = [first("v4"), V("v4", "it's", 1), V("v4", "i'm", 1), V("v4", "i'm", 2)], M_v4 = ["sad", "sad", "sad", "sad"];
      const T_n4 = [first("n4")], M_n4 = ["wow"];
      const T_v5 = [first("v5"), V("v5", "he's", 1), V("v5", "is", 1)], M_v5 = ["wow", "wow", "wow"];
      const T_n5 = [first("n5")], M_n5 = ["happy"];
      const T_v6 = [first("v6"), V("v6", "same", 1)], M_v6 = ["happy", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'street', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      v1: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_v1[idx(T_v1, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Four flights of stairs.", "No lift.", "Of course."][idx(T_v1, t)], pu(t, first("v1"))); }, },
      v2: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_v2[idx(T_v2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Nine pizzas.", "For one person.", "No judgement.", "Okay, a little."][idx(T_v2, t)], pu(t, first("v2"))); }, },
      n2: { set: 'street', cam: [[0, 1.8499999999999999, 2.35], [0, 2.17, -0.75], [0.0, 1.8599999999999999, 2.0500000000000003], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      v3: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_v3[idx(T_v3, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Third night this week.", "I know your order.", "We are basically friends."][idx(T_v3, t)], pu(t, first("v3"))); }, },
      n3: { set: 'street', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      v4: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_v4[idx(T_v4, t)]] })], over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#6a7aa0'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 2.0, -0.75], ["No tip.", "It's fine.", "I'm fine.", "I'm going to cry on the stairs."][idx(T_v4, t)], pu(t, first("v4"))); }, },
      n4: { set: 'street', cam: [[0, 1.8499999999999999, 2.35], [0, 2.17, -0.75], [0.0, 1.8599999999999999, 2.0500000000000003], [0, 2.17, -0.75]], he: NOONE, she: NOONE, shake: first("n4"), props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n4[idx(T_n4, t)]] })], },
      v5: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_v5[idx(T_v5, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Wait, what?", "He's running?", "Is this a robbery?"][idx(T_v5, t)], pu(t, first("v5"))); }, },
      n5: { set: 'street', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n5[idx(T_n5, t)]] })], },
      v6: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_v6[idx(T_v6, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Best day of my life.", "Same time tomorrow?"][idx(T_v6, t)], pu(t, first("v6"))); }, fx: [{ k: 'hearts', at: first('v6'), n: 3, y: 560 }], },
      cta: { set: 'street', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
