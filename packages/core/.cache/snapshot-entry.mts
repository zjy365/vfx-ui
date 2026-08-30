
import { TIMELINE_ARC_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/TimelineArc.tsx";
import { init, effect, target, frame } from "vgpu/node";
import { PNG } from "pngjs";
import { writeFileSync } from "node:fs";

const CATALOG = {
  "timeline-arc": { shader: TIMELINE_ARC_SHADER, uniforms: {"time":1.2,"speed":1,"activeT":0.5714,"yearCount":8,"cr":0.145,"cg":0.388,"cb":0.922,"resX":512,"resY":512} },
};

const gpu = await init();
const out = [];
for (const [name, { shader, uniforms }] of Object.entries(CATALOG)) {
  const t = target(gpu, { size: [512, 512], format: "rgba8unorm" });
  const fx = effect(gpu, shader, { set: structuredClone(uniforms) });
  frame(gpu, (f) => f.pass({ target: t, clear: [0, 0, 0, 0] }, (p) => p.draw(fx)));
  const rgba = await t.read();
  const png = new PNG({ width: 512, height: 512 });
  Buffer.from(rgba).copy(png.data);
  writeFileSync(process.argv[2] + "/" + name + ".png", PNG.sync.write(png));

  let sum = 0, sum2 = 0;
  const colors = new Set();
  const d = png.data;
  for (let i = 0; i < d.length; i += 4) {
    sum += d[i] + d[i + 1] + d[i + 2];
    sum2 += d[i] * d[i] + d[i + 1] * d[i + 1] + d[i + 2] * d[i + 2];
    colors.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
  }
  const n = 512 * 512;
  const mean = sum / (n * 3);
  const stddev = Math.sqrt(Math.max(0, sum2 / (n * 3) - mean * mean));
  let run = 0, maxRun = 0;
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4 + 1;
      const opaque = d[(y * 512 + x) * 4 + 3] > 8;
      if (opaque && x > 0 && d[i] === d[i - 4] && d[i - 3] > 8) { run++; if (run > maxRun) maxRun = run; }
      else run = 0;
    }
  }
  const verdict = stddev < 12 ? "FLAT" : maxRun > 170 ? "BANDING" : "OK";
  out.push({ name, stddev: +stddev.toFixed(1), colors: colors.size, maxRun, verdict });
}
console.log("REPORT:" + JSON.stringify(out));
