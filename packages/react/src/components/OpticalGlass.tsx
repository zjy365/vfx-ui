"use client";

import { useEffect, useState, type RefObject } from "react";

/** Geometry uses the short canvas edge, so resizing never stretches the glass. */
export function useOpticalSize(ref: RefObject<HTMLElement>) {
  const [size, setSize] = useState({ resX: 800, resY: 600 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      setSize({ resX: Math.max(1, width), resY: Math.max(1, height) });
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

/** Original optical study: ray-marched solids, two refraction interfaces,
 * Beer-Lambert absorption and studio reflections. The backdrop is procedural;
 * arbitrary DOM behind the canvas is deliberately not sampled or rasterized. */
export function opticalShader(header: string, setup: string, shape: number) {
  return /* wgsl */ `${header}
struct Material { time: f32, bend: f32, dispersion: f32, roughness: f32,
  rim: f32, scale: f32, radius: f32, tint: vec3f, pointer: vec2f, size: vec2f }
fn material() -> Material { ${setup} }
const SHAPE: i32 = ${shape};
fn rotate2(p: vec2f, a: f32) -> vec2f {
  return vec2f(cos(a)*p.x-sin(a)*p.y, sin(a)*p.x+cos(a)*p.y);
}
fn localPoint(p: vec3f) -> vec3f {
  let m = material();
  var q = p;
  let yaw = -0.24 + m.pointer.x * 0.42 + sin(m.time * 0.21) * 0.065;
  let pitch = 0.24 + m.pointer.y * 0.30;
  q = vec3f(rotate2(q.xz, yaw).x, q.y, rotate2(q.xz, yaw).y);
  q = vec3f(q.x, rotate2(q.yz, pitch));
  q = vec3f(rotate2(q.xy, -0.14 + sin(m.time*0.16)*0.035), q.z);
  return q;
}
fn distanceField(p: vec3f) -> f32 {
  let m = material();
  let q = localPoint(p);
  if (SHAPE == 0) {
    let bevel = clamp(m.radius, 0.015, 0.12);
    let b = vec3f(0.63, 0.405, 0.092) * clamp(m.scale, 0.32, 1.45);
    let d = abs(q) - b + bevel;
    return length(max(d, vec3f(0.0))) + min(max(d.x,max(d.y,d.z)),0.0) - bevel;
  }
  if (SHAPE == 1) {
    // Ellipsoid distance estimator: a biconvex optical pebble, not a flat pill.
    let r = vec3f(0.57,0.36,0.105);
    let k0 = length(q/r);
    let k1 = length(q/(r*r));
    return k0*(k0-1.0)/max(k1,0.0001);
  }
  if (SHAPE == 3) {
    let r = 0.65 * m.scale;
    let v = vec2f(q.x, q.y + r*0.22);
    let outer = max(-v.y-r*0.5, abs(v.x)*0.8660254+v.y*0.5-r*0.5);
    let inner = max(-v.y-r*0.5+0.065, abs(v.x)*0.8660254+v.y*0.5-r*0.5+0.065);
    let planar = max(outer,-inner);
    let d = vec2f(planar,abs(q.z)-0.022);
    return length(max(d,vec2f(0.0)))+min(max(d.x,d.y),0.0)-0.036;
  }
  // A molten annulus. Long travelling waves alter its actual silhouette.
  let angle = atan2(q.y,q.x);
  let wave = sin(angle*3.0+m.time*0.5)*0.024 + sin(angle*5.0-m.time*0.3)*0.012;
  let major = 0.365 + wave * m.bend;
  let minor = 0.125 + 0.021*sin(angle*2.0+m.time*0.35);
  return (length(vec2f(length(q.xy)-major,q.z*1.48)) - minor) / 1.48;
}
fn normalAt(p: vec3f) -> vec3f {
  let e = 0.0008;
  return normalize(vec3f(
    distanceField(p+vec3f(e,0,0))-distanceField(p-vec3f(e,0,0)),
    distanceField(p+vec3f(0,e,0))-distanceField(p-vec3f(0,e,0)),
    distanceField(p+vec3f(0,0,e))-distanceField(p-vec3f(0,0,e))));
}
fn grain(p: vec2f) -> f32 {
  var q = fract(p*vec2f(123.34,456.21));
  q += dot(q,q+45.32);
  return fract(q.x*q.y);
}
fn backdrop(p: vec2f) -> vec3f {
  let m = material();
  ${
    shape === 3
      ? `
  var paper = vec3f(params.c0r,params.c0g,params.c0b);
  let theta = 0.13 + sin(m.time*0.3)*0.045 + m.pointer.y*0.15;
  let axis = vec2f(cos(theta),sin(theta));
  let normal = vec2f(-axis.y,axis.x);
  let x = dot(p,axis);
  let y = dot(p,normal)+0.02;
  let width = max(params.beamWidth,0.001)*2.5;
  let split = max(x,0.0)*params.dispersion*0.13;
  let beam = exp(-pow((vec3f(y)+vec3f(-split,0,split))/width,vec3f(2.0)));
  let halo = exp(-pow((vec3f(y)+vec3f(-split,0,split))/(width*4.0),vec3f(2.0)));
  paper += vec3f(params.c2r,params.c2g,params.c2b)*(beam*0.45+halo*0.09);
  paper += (grain(p*800.0)-0.5)*0.016;
  return paper;
  `
      : `
  var col = vec3f(0.81,0.80,0.77);
  col += 0.07*exp(-dot(p-vec2f(-0.65,0.8),p-vec2f(-0.65,0.8))*1.8);
  // A ruled black print and a vermilion disk give transmission a visible subject.
  if (SHAPE == 1) {
    // An ink-black optical bench, three ivory slits and a single amber slit.
    let ink = vec3f(0.075,0.095,0.10);
    let v = rotate2(p,0.42);
    let slit = exp(-pow((abs(v.x)-0.25)/0.026,2.0));
    let centerSlit = exp(-pow((v.x+0.04)/0.008,2.0));
    let amber = exp(-pow((v.x-0.44)/0.048,2.0));
    return ink + vec3f(0.77,0.79,0.76)*slit + vec3f(0.38,0.43,0.42)*centerSlit + vec3f(0.75,0.31,0.08)*amber;
  }
  if (SHAPE == 2) {
    // Broad cobalt print passes through the molten loop; no competing disk.
    let v = rotate2(p,-0.42);
    let stripeA = 1.0-smoothstep(0.064,0.068,abs(v.y+0.13));
    let stripeB = 1.0-smoothstep(0.014,0.018,abs(v.y-0.14));
    let stripeC = 1.0-smoothstep(0.004,0.007,abs(v.y-0.22));
    return mix(vec3f(0.84,0.845,0.82),vec3f(0.06,0.18,0.57),max(stripeA,max(stripeB,stripeC))) + (grain(p*600.0)-0.5)*0.005;
  }
  let stripeP = rotate2(p-vec2f(-0.58,0.03),-0.24);
  let stripe = 1.0-smoothstep(0.10,0.14,abs(fract(stripeP.x*13.0)-0.5));
  let stripMask = 1.0-smoothstep(0.27,0.28,abs(stripeP.x));
  col = mix(col,vec3f(0.12,0.14,0.145),stripe*stripMask*0.83);
  let disk = 1.0-smoothstep(0.292,0.298,length(p-vec2f(0.40,-0.18)));
  let pigment = mix(vec3f(0.73,0.13,0.045),vec3f(0.96,0.36,0.08),0.5+0.5*p.y);
  col = mix(col,pigment,disk);
  col += (grain(p*650.0)-0.5)*0.009;
  return col;
  `
  }
}
fn environment(rd: vec3f) -> vec3f {
  // Rectangular studio softboxes produce broad reflections with a sharp lip.
  var col = vec3f(0.22,0.235,0.25);
  let top = pow(max(dot(rd,normalize(vec3f(-0.6,1.4,1.5))),0.0),12.0);
  col += vec3f(1.7,1.65,1.5)*top;
  let strip = pow(max(0.0,1.0-abs(rd.x+0.38)*3.2),18.0);
  col += vec3f(1.3)*strip*smoothstep(-0.3,0.4,rd.y);
  col += vec3f(0.4,0.52,0.65)*pow(max(dot(rd,normalize(vec3f(1.5,-0.2,0.8))),0.0),24.0);
  return col;
}
fn behind(ro: vec3f, rd: vec3f) -> vec3f {
  if (rd.z >= -0.001) { return environment(rd); }
  let distance = (-0.29-ro.z)/rd.z;
  return backdrop((ro+rd*max(0.0,distance)).xy);
}
fn transmission(hit: vec3f, rd: vec3f, n: vec3f, ior: f32) -> vec3f {
  let m = material();
  var direction = refract(rd,n,1.0/ior);
  var origin = hit + direction*0.003;
  var travelled = 0.003;
  // Advance inside the solid to its second interface.
  if (SHAPE == 1) {
    // Exact second intersection avoids unstable near-tangent marching on a lens.
    let radii = vec3f(0.57,0.36,0.105);
    let o = localPoint(origin) / radii;
    let d = localPoint(direction) / radii;
    let a = dot(d,d);
    let b = dot(o,d);
    let c = dot(o,o)-1.0;
    let exitDistance = max(0.0,(-b+sqrt(max(0.0,b*b-a*c)))/a);
    origin += direction*exitDistance;
    travelled += exitDistance;
  } else {
  for (var j=0; j<36; j++) {
    let d = abs(distanceField(origin));
    if (d<0.0007 && j>1) { break; }
    let stepLength = max(0.001,d*0.78);
    origin += direction*stepLength;
    travelled += stepLength;
    if (travelled>2.0) { break; }
  }
  }
  let exitNormal = normalAt(origin);
  var outgoing = refract(direction,-exitNormal,ior);
  if (dot(outgoing,outgoing)<0.01) {
    // One internal reflection prevents black holes at grazing angles.
    outgoing = reflect(direction,-exitNormal);
  }
  let absorbed = exp(-(vec3f(1.0)-m.tint)*travelled*2.4);
  return behind(origin+outgoing*0.002,outgoing)*absorbed;
}
fn renderPixel(uv: vec2f) -> vec4f {
  let m = material();
  let resolution = max(m.size,vec2f(1.0));
  let q = (uv-0.5)*vec2f(1.0,-1.0)*resolution/min(resolution.x,resolution.y)*1.85;
  let ro = vec3f(q,2.6);
  let rd = vec3f(0.0,0.0,-1.0);
  var col = backdrop(q);
  // Area-light contact shadow, sampled on the same 3D geometry.
  let shadowPoint = vec3f(q-vec2f(0.05,-0.09),0.0);
  let shadowDistance = distanceField(shadowPoint);
  let shadow = exp(-max(shadowDistance,0.0)*12.0)*0.22*${shape === 3 ? "params.shadow" : "1.0"};
  col *= 1.0-shadow;
  var depth = 0.0;
  var found = false;
  var position = ro;
  for (var i=0; i<64; i++) {
    position = ro+rd*depth;
    let d = distanceField(position);
    if (d<0.0007) { found=true; break; }
    depth += max(d*0.82,0.001);
    if (depth>3.4) { break; }
  }
  if (found) {
    let n = normalAt(position);
    let ior = 1.24 + clamp(m.bend,0.0,2.0)*0.14;
    let spread = clamp(m.dispersion,0.0,2.0)*0.0035;
    let red = transmission(position,rd,n,ior-spread);
    let green = transmission(position,rd,n,ior);
    let blue = transmission(position,rd,n,ior+spread);
    let refracted = vec3f(red.r,green.g,blue.b);
    let fresnel = 0.045+0.955*pow(1.0-max(dot(-rd,n),0.0),5.0);
    let reflected = environment(reflect(rd,n));
    col = mix(refracted,reflected,min(0.66,fresnel*(0.60+m.rim*0.24)));
    let edge = pow(1.0-abs(n.z),3.0);
    col += reflected*edge*0.12*m.rim;
    col = mix(col,col*0.9+vec3f(0.06),clamp(m.roughness,0.0,2.0)*0.045);
  }
  // Display-referred studio palette; preserve detail in specular highlights.
  col = col / (vec3f(1.0)+max(col-0.9,vec3f(0.0)));
  col += (grain(uv*resolution*2.0)-0.5)/255.0;
  return vec4f(clamp(col,vec3f(0.0),vec3f(1.0)),select(0.0,1.0,found));
}
@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let pixel = 0.32 / max(material().size,vec2f(1.0));
  let a = renderPixel(uv-pixel);
  let b = renderPixel(uv+pixel);
  return vec4f((a.rgb+b.rgb)*0.5,1.0);
}`;
}
