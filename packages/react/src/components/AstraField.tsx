"use client";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export interface AstraFieldProps {
  /** Spiral galaxy or the extended, six-shaped spiral. */
  shape?: "six" | "galaxy";
  color?: string;
  intensity?: number;
  speed?: number;
  /** Stable procedural composition. */
  seed?: number;
  /** Gather scattered stars into the spiral on mount. */
  intro?: boolean;
  /** Assembly duration in seconds, independent of ambient speed. */
  introDuration?: number;
  /** Drag to orbit; arrow keys rotate, Home resets. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
}
export const ASTRA_FIELD_PRESETS = {
  astra: { shape: "six", color: "#8cbeed", intensity: 1, speed: 0.35 },
  galaxy: { shape: "galaxy", color: "#abcaff", intensity: 1, speed: 0.5 },
  ember: { shape: "six", color: "#eab58f", intensity: 0.9, speed: 0.25 },
} as const;

/** Seeded 3D points; original implementation inspired by OpenAI's Astra page. */
export function createAstraStars(
  seed: number,
  shape: "six" | "galaxy",
  count = 14000,
) {
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const normal = () =>
    Math.sqrt(-2 * Math.log(Math.max(1e-8, random()))) *
    Math.cos(random() * Math.PI * 2);
  const data = new Float32Array(count * 7);
  for (let i = 0; i < count; i++) {
    let x = 0,
      y = 0,
      z = 0;
    const background = i < count * 0.12;
    const t = random();
    if (background) {
      x = (random() - 0.5) * 5;
      y = (random() - 0.5) * 3;
      z = (random() - 0.5) * 3;
    } else if (shape === "six" && t > 0.72) {
      const u = (t - 0.72) / 0.28,
        v = 1 - u;
      const strand = random() < 0.5 ? -0.022 : 0.022;
      x =
        v * v * v * -0.49 +
        3 * v * v * u * -0.57 +
        3 * v * u * u * -0.25 +
        u * u * u * 0.43 +
        strand;
      y =
        v * v * v * -0.22 +
        3 * v * v * u * 0.22 +
        3 * v * u * u * 0.9 +
        u * u * u * 0.86;
      const spread = 0.007 + Math.sin(u * Math.PI) * 0.008;
      x += normal() * spread;
      y += normal() * spread;
      z = normal() * 0.016;
    } else {
      const u = shape === "six" ? t / 0.72 : t;
      const angle = -u * Math.PI * 3;
      const radius = 0.012 + 0.48 * Math.pow(u, 0.87);
      const strand = random() < 0.5 ? -0.013 : 0.013;
      x = Math.cos(angle) * radius;
      y =
        Math.sin(angle) * radius * (shape === "six" ? 0.96 : 0.7) -
        (shape === "six" ? 0.22 : 0);
      const spread = 0.006 + 0.009 * u;
      x += normal() * spread + Math.cos(angle) * strand;
      y += normal() * spread + Math.sin(angle) * strand;
      z = normal() * (0.012 + 0.014 * u);
    }
    if (i >= count * .12 && i < count * .14) { x=normal()*.019; y=normal()*.019-(shape === "six" ? .22 : 0); z=normal()*.015; }
    const bright = random();
    const size = background
      ? (bright > .99 ? 5 : 1) + random()
      : bright > 0.986
        ? 8 + random() * 9
        : bright > 0.87
          ? 2 + random() * 3
          : 0.55 + random() * 1.4;
    data.set(
      [
        x,
        y,
        z,
        size,
        random(),
        background
          ? 0.12 + random() * 0.25
          : bright > 0.986
            ? 1.2
            : 0.25 + random() * 0.65,
        random() * 6.283,
      ],
      i * 7,
    );
  }
  data.set([0,shape === "six" ? -.22 : 0,0,80,.2,.8,0],data.length-7);
  return data;
}
const VERTEX = `attribute vec3 position;attribute float size;attribute float tint;attribute float luminosity;attribute float phase;
uniform vec2 viewport;uniform vec2 orbit;uniform float time;uniform float assembly;uniform float intensity;uniform vec3 color;
varying vec3 light;varying float alpha;
float hash(float n){return fract(sin(n)*43758.5453);}
void main(){
float id=phase*117.3+position.x*31.7+position.y*59.1;
float progress=clamp((assembly-hash(id+2.0)*.18)/.82,0.0,1.0);
float ease=progress*progress*progress*(progress*(progress*6.0-15.0)+10.0);
vec3 cloud=vec3((hash(id+3.0)-.5)*5.2,(hash(id+9.0)-.5)*3.6,(hash(id+17.0)-.5)*2.0);
float sweep=(1.0-ease)*(1.1+hash(id+5.0)*1.4);
cloud.xy=mat2(cos(sweep),-sin(sweep),sin(sweep),cos(sweep))*cloud.xy;
vec3 p=mix(cloud,position,ease);
p.z+=sin(progress*3.14159265)*.35;
float a=orbit.x,b=orbit.y; p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;p.yz=mat2(cos(b),-sin(b),sin(b),cos(b))*p.yz;
float perspective=3.0/(3.0+p.z);float scale=min(viewport.x/1.6,viewport.y/2.0);gl_Position=vec4(p.xy*perspective*scale/viewport*2.0,0.0,1.0);
gl_PointSize=max(1.6,size*max(.85,viewport.y/720.0)*perspective);light=mix(color,vec3(1.0,.66,.39),step(.8,tint));light=mix(light,vec3(1.0),.45);alpha=luminosity*intensity*2.5*mix(.45,1.0,ease)*(size>40.0?smoothstep(.7,1.0,ease):1.0)*(.86+.14*sin(time*.7+phase));}`;
const FRAGMENT = `precision mediump float;varying vec3 light;varying float alpha;void main(){vec2 p=(gl_PointCoord-.5)*2.0;float r=dot(p,p);if(r>1.0)discard;float glow=exp(-r*4.0)*.4+exp(-r*24.0)*.9;gl_FragColor=vec4(light,glow*alpha);}`;
export function AstraField({
  shape = "six",
  color = "#8cbeed",
  intensity = 1,
  speed = 0.35,
  seed = 762419,
  intro = true,
  introDuration = 4.8,
  interactive = false,
  className,
  style,
  fallback,
}: AstraFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const latest = useRef({ color, intensity, speed });
  latest.current = { color, intensity, speed };
  const wakeRef = useRef(() => {});
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      setFailed(true);
      return;
    }
    let raf = 0,
      disposed = false,
      visible = true,
      last = 0,
      time = 0,
      assemblyTime = 0,
      dragging = false,
      px = 0,
      py = 0;
    const target: [number, number] = [0, 0],
      orbit: [number, number] = [0, 0];
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const shaders: WebGLShader[] = [];
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    try {
      const compile = (type: number, source: string) => {
        const s = gl.createShader(type)!;
        shaders.push(s);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
          throw new Error(
            gl.getShaderInfoLog(s) ?? "Shader compilation failed",
          );
        return s;
      };
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program) ?? "Link failed");
      gl.useProgram(program);
      const stars = createAstraStars(seed, shape);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, stars, gl.STATIC_DRAW);
      [
        ["position", 3, 0],
        ["size", 1, 3],
        ["tint", 1, 4],
        ["luminosity", 1, 5],
        ["phase", 1, 6],
      ].forEach(([name, size, offset]) => {
        const loc = gl.getAttribLocation(program!, name as string);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(
          loc,
          size as number,
          gl.FLOAT,
          false,
          28,
          (offset as number) * 4,
        );
      });
      const uniforms = Object.fromEntries(
        ["viewport", "orbit", "time", "assembly", "intensity", "color"].map((name) => [
          name,
          gl.getUniformLocation(program!, name),
        ]),
      ) as Record<
        "viewport" | "orbit" | "time" | "assembly" | "intensity" | "color",
        WebGLUniformLocation | null
      >;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.clearColor(0, 0, 0, 0);
      const duration = Number.isFinite(introDuration) ? Math.max(.1, introDuration) : 4.8;
      const draw = (now: number) => {
        raf = 0;
        if (disposed || !visible || document.hidden) return;
        const p = latest.current;
        if (now - last >= 1000 / 45 || !last) {
          const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
          last = now;
          if (!media.matches) time += dt * Math.max(0, p.speed);
          assemblyTime = !intro || media.matches ? duration : Math.min(duration, assemblyTime + dt);
          orbit[0] += (target[0] - orbit[0]) * 0.12;
          orbit[1] += (target[1] - orbit[1]) * 0.12;
          const dpr = Math.min(devicePixelRatio, 1.5),
            w = Math.max(1, Math.round(canvas.clientWidth * dpr)),
            h = Math.max(1, Math.round(canvas.clientHeight * dpr));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
          gl.viewport(0, 0, w, h);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.uniform2f(uniforms.viewport, w, h);
          gl.uniform2f(
            uniforms.orbit,
            orbit[0] + Math.sin(time * 0.12) * 0.025,
            orbit[1],
          );
          gl.uniform1f(uniforms.time, time);
          gl.uniform1f(uniforms.assembly, assemblyTime / duration);
          canvas.dataset.assembly = assemblyTime >= duration ? "complete" : "gathering";
          gl.uniform1f(uniforms.intensity, Math.max(0, p.intensity));
          const hex = /^#[0-9a-f]{6}$/i.test(p.color) ? p.color : "#8cbeed";
          gl.uniform3f(
            uniforms.color,
            parseInt(hex.slice(1, 3), 16) / 255,
            parseInt(hex.slice(3, 5), 16) / 255,
            parseInt(hex.slice(5, 7), 16) / 255,
          );
          gl.drawArrays(gl.POINTS, 0, stars.length / 7);
          canvas.dataset.ready = "true";
        }
        if (
          (!media.matches && (p.speed > 0 || assemblyTime < duration)) ||
          Math.abs(target[0] - orbit[0]) + Math.abs(target[1] - orbit[1]) >
            0.001
        )
          raf = requestAnimationFrame(draw);
      };
      function wake() {
        if (!disposed && !raf) {
          last = 0;
          raf = requestAnimationFrame(draw);
        }
      }
      wakeRef.current = wake;
      const down = (e: PointerEvent) => {
        if (!interactive) return;
        dragging = true;
        px = e.clientX;
        py = e.clientY;
        canvas.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        target[0] += (e.clientX - px) * 0.004;
        target[1] = Math.max(
          -1,
          Math.min(1, target[1] + (e.clientY - py) * 0.004),
        );
        px = e.clientX;
        py = e.clientY;
        wake();
      };
      const up = () => {
        dragging = false;
      };
      const key = (e: KeyboardEvent) => {
        if (!interactive) return;
        const delta: Record<string, [number, number]> = {
          ArrowLeft: [-0.12, 0],
          ArrowRight: [0.12, 0],
          ArrowUp: [0, -0.12],
          ArrowDown: [0, 0.12],
        };
        if (e.key === "Home") {
          target[0] = target[1] = 0;
        } else if (delta[e.key]) {
          target[0] += delta[e.key]![0];
          target[1] += delta[e.key]![1];
        } else return;
        e.preventDefault();
        wake();
      };
      const lost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(raf);
        setFailed(true);
      };
      const ro = new ResizeObserver(wake);
      ro.observe(canvas);
      const io = new IntersectionObserver((es) => {
        visible = es.at(-1)?.isIntersecting ?? true;
        wake();
      });
      io.observe(canvas);
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
      canvas.addEventListener("keydown", key);
      canvas.addEventListener("webglcontextlost", lost);
      media.addEventListener("change", wake);
      document.addEventListener("visibilitychange", wake);
      wake();
      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", up);
        canvas.removeEventListener("keydown", key);
        canvas.removeEventListener("webglcontextlost", lost);
        media.removeEventListener("change", wake);
        document.removeEventListener("visibilitychange", wake);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        shaders.forEach((s) => gl.deleteShader(s));
        wakeRef.current = () => {};
      };
    } catch (error) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((s) => gl.deleteShader(s));
      console.error("[vfx-ui] astra field", error);
      setFailed(true);
    }
  }, [shape, seed, interactive, intro, introDuration]);
  useEffect(() => wakeRef.current(), [color, intensity, speed]);
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 65%,#122334 0%,#060c12 40%,#010304 80%)",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 61%,#bfd4eb38,transparent 12%)",
        }}
      />
      {failed ? (
        fallback
      ) : (
        <canvas
          ref={ref}
          tabIndex={interactive ? 0 : undefined}
          role={interactive ? "img" : undefined}
          aria-label={
            interactive
              ? "Spiral star field. Drag or use arrow keys to rotate. Home resets."
              : undefined
          }
          aria-hidden={interactive ? undefined : true}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            touchAction: interactive ? "pan-y" : undefined,
            cursor: interactive ? "grab" : undefined,
          }}
        />
      )}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse,transparent 47%,#0003 72%,#000b 100%)",
        }}
      />
    </div>
  );
}
