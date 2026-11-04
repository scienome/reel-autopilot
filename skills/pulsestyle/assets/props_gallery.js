// Props pack 2 gallery: one page every 2 s. Render with: copy to reels/zz-gallery/story.js (plus a 7-line script.json) and run
// python3 tools/pulse_make.py zz-gallery --sheet 1 3 5 7 9 11 13   (then delete the folder; never push it)
(function () {
  const PAL = P.PAL, W = 720, H_ = 1280;
  const pages = [
    (c, t) => { P.bg(c, W, H_, 'deep', t); P.dumbbell(c, 200, 220, 1); P.kettlebell(c, 520, 230, 1, PAL.ink, '16'); P.plate(c, 190, 470, 90, PAL.red, '20'); P.plate(c, 360, 480, 70, PAL.blue, '10'); P.stopwatch(c, 560, 480, 90, (t % 2) / 2, '0:45');
      P.bench(c, 250, 820, 0.9, 0); P.bottle(c, 580, 760, 1, PAL.blue, 0.6); P.rope(c, 360, 1000, 420, t); P.pullupBar(c, 360, 1120, 380, 0.4); P.label(c, 'Equipment', W / 2, 80, 1, { color: PAL.amber }); },
    (c, t) => { P.bg(c, W, H_, 'violet', t); P.tub(c, 190, 300, 1, PAL.ink, 'WHEY', 'protein'); P.tub(c, 520, 300, 1, '#13304a', 'CREATINE', 'monohydrate', PAL.cyan); P.scoop(c, 200, 600, 1.2); P.pill(c, 450, 580, 1.1, 0.4); P.softgel(c, 600, 620, 1.1);
      P.coffee(c, 200, 860, 1, t); P.sun(c, 520, 860, 70, t); P.evidence(c, W / 2, 1110, 3); P.label(c, 'Supplements', W / 2, 80, 1, { color: PAL.amber }); },
    (c, t) => { P.bg(c, W, H_, 'plum', t); P.chicken(c, 190, 260, 1); P.steak(c, 520, 260, 1); P.rice(c, 190, 520, 1); P.banana(c, 520, 560, 1, -0.2); P.broccoli(c, 190, 780, 1.2); P.milk(c, 520, 780, 1);
      P.platePie(c, W / 2, 1060, 140, [[0.5, PAL.green, 'veg'], [0.25, '#f1c07a', 'protein'], [0.25, PAL.bone, 'carbs']]); P.label(c, 'Food', W / 2, 80, 1, { color: PAL.amber }); },
    (c, t) => { P.bg(c, W, H_, 'night', t); P.knee(c, 160, 420, 0.8, 0.5 + 0.5 * Math.sin(t * 2), 0.5); P.spine(c, 360, 180, 0.9, 0.6, 4); P.bone(c, 560, 220, 120, 1, 0.6); P.kidney(c, 560, 470, 1);
      P.neuron(c, 120, 720, 420, 760, t, (t % 1.5) / 1.5); P.stomach(c, 590, 760, 0.9, 0.6); P.protein(c, W / 2, 940, 560, t, 1); P.ecg(c, 70, 1100, 380, 120, t, 90); P.thermometer(c, 560, 1100, 0.6, 0.7); P.label(c, 'Body', W / 2, 80, 1, { color: PAL.amber }); },
    (c, t) => { P.bg(c, W, H_, 'deep', t); P.musclemap(c, 190, 760, 1.15, 'front', { chest: 1, quads: 1, abs: 0.5, shoulders: 0.4 }); P.musclemap(c, 530, 760, 1.15, 'back', { lats: 1, glutes: 1, hamstrings: 0.6, traps: 0.4 }, PAL.amber);
      P.label(c, 'Muscle map', W / 2, 80, 1, { color: PAL.amber }); P.bed(c, W / 2, 1180, 0.6, t); },
    (c, t) => { P.gym(c, W, H_, t); const k = 0.5 - 0.5 * Math.cos(t * 3);
      [['stand', 120, 470], ['hinge', 300, 470], ['squat', 470, 470], ['row', 630, 470], ['press', 120, 860], ['hang', 330, 900], ['pushup', 540, 860], ['plank', 540, 1180]].forEach(([p, x, y]) => { P.lifterSide(c, x, y, 0.62, p, { k, bar: p === 'hinge' || p === 'squat' || p === 'row' || p === 'press', wince: k > 0.7, smile: p === 'stand' }); P.label(c, p, x, y + 40, 1, { color: PAL.blue, size: 20 }); });
      P.label(c, 'Side-view lifter poses', W / 2, 80, 1, { color: PAL.amber }); },
    (c, t) => { P.bg(c, W, H_, 'violet', t); P.check(c, 'Heels down', W / 2, 200, true); P.check(c, 'Rounded back', W / 2, 300, false); P.verdict(c, 190, 450, false); P.verdict(c, 530, 450, true);
      P.versus(c, W / 2, 680, 640, 260, 'Whey', 'Food', 1, 2, (cc) => P.scoop(cc, 0, 30, 0.8), (cc) => P.chicken(cc, 0, 40, 0.7)); P.lineChart(c, 60, 1080, 360, 220, [0.1, 0.3, 0.35, 0.6, 0.7, 0.9], (t % 2) / 2, PAL.mint, 'strength');
      P.ring(c, 560, 940, 80, 1 - (t % 2) / 2, '90s'); P.progress(c, 560, 1080, 240, 0.7, PAL.amber, '70%'); P.reps(c, W / 2, 1180, 6, 8); P.seriesTag(c, W / 2, 80, 'Charts & UI'); },
  ];
  function explainer(ctx, W_, H2, t) { const i = Math.min(pages.length - 1, Math.floor(t / 2)); pages[i](ctx, t); P.finish(ctx, W, H_); }
  window.LESSON = { BEATS: pages.map((_, i) => ({ t: i * 2, name: 'p' + i })), DURATION: 14, explainer, WORDS: [], CHUNKS: [] };
  window.scoreSound = () => {};
