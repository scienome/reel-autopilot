  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const SUBJ = (o) => Object.assign({ who: 'dad', x: 0, z: -0.75, yaw: 0, sit: true, arms: 'hold', outfit: 'tee' }, o);
  makeCouch({
    keys: ["driver", "thinks", "airport", "short", "there", "phone", "going", "music", "won't", "start", "crying", "tissues", "volume", "drives", "doesn't", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_t1 = [first("t1"), V("t1", "i", 1), V("t1", "there", 1)], M_t1 = ["happy", "smug", "smug"];
      const T_t2 = [first("t2"), V("t2", "he's", 2), V("t2", "he", 1)], M_t2 = ["calm", "tired", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["sad"];
      const T_t3 = [first("t3"), V("t3", "okay", 1), V("t3", "volume", 1)], M_t3 = ["wow", "calm", "sad"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_t4 = [first("t4"), V("t4", "you", 1), V("t4", "hope", 1)], M_t4 = ["calm", "sad", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'car', cam: [[0, 1.5, 1.7], [0, 1.62, -0.75], [0, 1.5, 1.4], [0, 1.62, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      t1: { set: 'car', cam: [[0, 1.45, 1.25], [0, 1.62, -0.75], [0, 1.46, 0.95], [0, 1.62, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t1[idx(T_t1, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.72, -0.75], ["Airport? Easy.", "I know a short cut.", "There is no short cut."][idx(T_t1, t)], pu(t, first("t1"))); }, },
      t2: { set: 'car', cam: [[0, 1.45, 1.25], [0, 1.62, -0.75], [0, 1.46, 0.95], [0, 1.62, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t2[idx(T_t2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.72, -0.75], ["He's on the phone.", "He's going to ask me to turn the music down.", "He won't."][idx(T_t2, t)], pu(t, first("t2"))); }, },
      n2: { set: 'car', cam: [[0, 1.5, 1.7], [0, 1.62, -0.75], [0, 1.5, 1.4], [0, 1.62, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      t3: { set: 'car', cam: [[0, 1.45, 1.25], [0, 1.62, -0.75], [0, 1.46, 0.95], [0, 1.62, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t3[idx(T_t3, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 1.72, -0.75], ["Oh no.", "Okay. Tissues in the door.", "Volume down."][idx(T_t3, t)], pu(t, first("t3"))); }, },
      n3: { set: 'car', cam: [[0, 1.5, 1.7], [0, 1.62, -0.75], [0, 1.5, 1.4], [0, 1.62, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      t4: { set: 'car', cam: [[0, 1.45, 1.25], [0, 1.62, -0.75], [0, 1.46, 0.95], [0, 1.62, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_t4[idx(T_t4, t)]] })], over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 1.72, -0.75], ["Twenty years of driving.", "You never forget the sad ones.", "Hope you got there."][idx(T_t4, t)], pu(t, first("t4"))); }, fx: [{ k: 'hearts', at: V('t4', 'Hope'), n: 4, y: 560 }], },
      cta: { set: 'car', cam: [[0, 1.5, 1.7], [0, 1.62, -0.75], [0, 1.5, 1.4], [0, 1.62, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
