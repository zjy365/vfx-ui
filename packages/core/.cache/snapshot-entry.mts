
import { WAVE_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/WaveBackground.tsx";
import { FLUID_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/FluidGradient.tsx";
import { AURORA_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/Aurora.tsx";
import { STARFIELD_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/Starfield.tsx";
import { PARTICLE_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/ParticleField.tsx";
import { GLASS_CARD_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/GlassCard.tsx";
import { LIQUID_GLASS_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/LiquidGlass.tsx";
import { MESH_GRADIENT_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/MeshGradient.tsx";
import { IRIDESCENT_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/Iridescent.tsx";
import { VORTEX_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/Vortex.tsx";
import { WEB_GLOBE_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/WebGlobe.tsx";
import { LIVE_CHART_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/LiveChart.tsx";
import { ENERGY_ORB_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/EnergyOrb.tsx";
import { RIBBON_FIELD_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/RibbonField.tsx";
import { TIMELINE_ARC_SHADER } from "/Users/jingyang/zjy365/vfx-ui/packages/react/src/components/TimelineArc.tsx";
import { init, effect, target, frame } from "vgpu/node";
import { PNG } from "pngjs";
import { writeFileSync } from "node:fs";

const GATE_OVERRIDES = {"timeline-arc":{"stddevMin":8}};
const CATALOG = {
  "wave-background": { shader: WAVE_SHADER, uniforms: {"time":1,"speed":1,"amplitude":1,"frequency":2.5,"c0r":0.0078,"c0g":0.0235,"c0b":0.0902,"c1r":0.1137,"c1g":0.3059,"c1b":0.8471,"c2r":0.2196,"c2g":0.7412,"c2b":0.9725,"px":0.5,"py":0.5} },
  "fluid-gradient": { shader: FLUID_SHADER, uniforms: {"time":1.1,"speed":0.55,"warp":2.4,"scale":1.6,"c0r":0.043,"c0g":0.071,"c0b":0.125,"c1r":0.29,"c1g":0.35,"c1b":0.65,"c2r":0.55,"c2g":0.75,"c2b":0.95,"px":0.5,"py":0.5} },
  "aurora": { shader: AURORA_SHADER, uniforms: {"time":1.2,"speed":0.7,"intensity":1,"bands":4,"c0r":0.176,"c0g":0.831,"c0b":0.749,"c1r":0.506,"c1g":0.549,"c1b":0.973,"px":0.5,"py":0.5} },
  "starfield": { shader: STARFIELD_SHADER, uniforms: {"time":1.3,"density":0.35,"twinkle":0.8,"speed":1,"c0r":0.812,"c0g":0.894,"c0b":1,"px":0.5,"py":0.5} },
  "particle-field": { shader: PARTICLE_SHADER, uniforms: {"time":1.4,"density":0.45,"size":0.16,"speed":0.8,"c0r":0.62,"c0g":0.796,"c0b":1,"px":0.5,"py":0.5} },
  "glass-card": { shader: GLASS_CARD_SHADER, uniforms: {"time":1.5,"radius":0.05,"borderGlow":0.7,"shine":0.8,"cardScale":0.62,"c0r":0.647,"c0g":0.784,"c0b":1,"px":0.5,"py":0.5,"pActive":0} },
  "liquid-glass": { shader: LIQUID_GLASS_SHADER, uniforms: {"time":1.6,"speed":0.8,"distortion":0.45,"chromatic":0.6,"scale":1.2,"px":0.5,"py":0.5,"pActive":0} },
  "mesh-gradient": { shader: MESH_GRADIENT_SHADER, uniforms: {"time":0.8,"speed":0.6,"scale":3.2,"softness":0.09,"c0r":0.043,"c0g":0.067,"c0b":0.125,"c1r":0.082,"c1g":0.369,"c1b":0.459,"c2r":0.486,"c2g":0.227,"c2b":0.929,"c3r":0.957,"c3g":0.447,"c3b":0.714,"px":0.5,"py":0.5} },
  "iridescent": { shader: IRIDESCENT_SHADER, uniforms: {"time":1.5,"speed":0.8,"scale":2.4,"hueShift":0,"saturation":1,"brightness":0.9,"px":0.5,"py":0.5} },
  "vortex": { shader: VORTEX_SHADER, uniforms: {"time":0.6,"speed":0.5,"swirl":2.4,"arms":2,"coreGlow":1.2,"cr":0.506,"cg":0.549,"cb":0.973,"er":0.878,"eg":0.949,"eb":0.996,"px":0.5,"py":0.5} },
  "web-globe": { shader: WEB_GLOBE_SHADER, uniforms: {"time":0.8,"speed":0.35,"phi":0,"theta":0.35,"dots":520,"dotScale":1.15,"diffuse":1.2,"dark":0.92,"atmosphere":0.8,"seaLevel":0.46,"globeScale":0.98,"cr":0.616,"cg":0.706,"cb":0.839,"gr":0.49,"gg":0.827,"gb":0.988} },
  "live-chart": { shader: LIVE_CHART_SHADER, uniforms: {"time":0,"count":48,"lineWidth":0.006,"glow":0.4,"fill":0.6,"cr":0.22,"cg":0.74,"cb":0.97,"er":0.49,"eg":0.83,"eb":0.99,"px":0.5,"pActive":0,"pts":[[0.5,0.5,0,0],[0.6880599893484928,0.6880599893484928,0,0],[0.8035344230038807,0.8035344230038807,0,0],[0.8203134202134684,0.8203134202134684,0,0],[0.7710918692668219,0.7710918692668219,0,0],[0.7171224912331501,0.7171224912331501,0,0],[0.698950548572041,0.698950548572041,0,0],[0.7057660947314762,0.7057660947314762,0,0],[0.686562994434805,0.686562994434805,0,0],[0.5942986619270211,0.5942986619270211,0,0],[0.42896121566349726,0.42896121566349726,0,0],[0.24604636676161443,0.24604636676161443,0,0],[0.12300212982100277,0.12300212982100277,0,0],[0.10801160688706112,0.10801160688706112,0,0],[0.1889774686823272,0.1889774686823272,0,0],[0.30551940475865264,0.30551940475865264,0,0],[0.3945604535357848,0.3945604535357848,0,0],[0.43501651655474394,0.43501651655474394,0,0],[0.4581382495151453,0.4581382495151453,0,0],[0.5163595326095315,0.5163595326095315,0,0],[0.6351369869128449,0.6351369869128449,0,0],[0.7852556171304038,0.7852556171304038,0,0],[0.8975812085913506,0.8975812085913506,0,0],[0.9099872198487396,0.9099872198487396,0,0],[0.811596699753744,0.811596699753744,0,0],[0.6511942139552905,0.6511942139552905,0,0],[0.5034199201397278,0.5034199201397278,0,0],[0.41795194464623986,0.41795194464623986,0,0],[0.3894474858919309,0.3894474858919309,0,0],[0.37007678085748924,0.37007678085748924,0,0],[0.3141349496495159,0.3141349496495159,0,0],[0.21994997802862945,0.21994997802862945,0,0],[0.136484196569521,0.136484196569521,0,0],[0.12898635820690899,0.12898635820690899,0,0],[0.22936004730098952,0.22936004730098952,0,0],[0.408839251975214,0.408839251975214,0,0],[0.5940353236415418,0.5940353236415418,0,0],[0.7149051942453203,0.7149051942453203,0,0],[0.7492574607985786,0.7492574607985786,0,0],[0.7311458185566903,0.7311458185566903,0,0],[0.7178164684780469,0.7178164684780469,0,0],[0.7411059493340727,0.7411059493340727,0,0],[0.7807106956649897,0.7807106956649897,0,0],[0.7798771578568919,0.7798771578568919,0,0],[0.6915991324213161,0.6915991324213161,0,0],[0.5199673248148136,0.5199673248148136,0,0],[0.32467822872609775,0.32467822872609775,0,0],[0.18436799405256069,0.18436799405256069,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]} },
  "energy-orb": { shader: ENERGY_ORB_SHADER, uniforms: {"time":1.4,"speed":1,"smokeScale":1,"smokeStrength":1,"smokeSpeed":1,"hue":0,"saturation":1,"glow":1,"px":0.5,"py":0.5} },
  "ribbon-field": { shader: RIBBON_FIELD_SHADER, uniforms: {"time":1.2,"speed":1,"intensity":1,"drift":0,"grain":1,"resX":512,"resY":512} },
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
  const stddevMin = (GATE_OVERRIDES[name] ?? {}).stddevMin ?? 12;
  const verdict = stddev < stddevMin ? "FLAT" : maxRun > 170 ? "BANDING" : "OK";
  out.push({ name, stddev: +stddev.toFixed(1), colors: colors.size, maxRun, verdict });
}
console.log("REPORT:" + JSON.stringify(out));
