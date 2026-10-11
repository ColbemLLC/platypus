"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// Adapted from MengTo/threeui (MIT), TopoField.

type Mode = "dark" | "light";

export type TopoFieldProps = {
  mode?: Mode | "auto";
  speed?: number;
  length?: number;
  density?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

const VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_length;
uniform float u_bands;
uniform float u_strength;
uniform float u_edge;
uniform vec3 u_paper;
uniform vec3 u_ink;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;

  vec2 pos = st * u_length + vec2(u_time * 0.015, u_time * 0.025);
  float n = snoise(pos) * 0.5 + 0.5;
  float wave = abs(fract(n * u_bands) - 0.5) * 2.0;
  float line = smoothstep(u_edge, 0.0, wave) * u_strength;

  gl_FragColor = vec4(mix(u_paper, u_ink, line), 1.0);
}
`;

const PAPER = "#eef1f6";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function readMode(): Mode {
  const root = document.documentElement;
  const declared = root.dataset.scheme ?? root.dataset.theme;
  if (declared === "light" || declared === "dark") return declared;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useResolvedMode(mode: Mode | "auto"): Mode {
  const [auto, setAuto] = useState<Mode>("dark");

  useEffect(() => {
    if (mode !== "auto") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setAuto(readMode());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scheme", "data-theme"] });
    media.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, [mode]);

  return mode === "auto" ? auto : mode;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export default function TopoField({
  mode = "dark",
  speed = 1,
  length = 1,
  density = 1,
  opacity = 1,
  hue = 0,
  saturation = 1,
  brightness = 1,
  className,
  style,
}: TopoFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resolved = useResolvedMode(mode);
  const light = resolved === "light";
  const live = useRef({ speed: 1, length: 1.4, bands: 10, light: false });

  useEffect(() => {
    live.current = {
      speed: clamp(speed, 0, 3),
      length: 1.4 * clamp(length, 0.35, 2.5),
      bands: 10 * clamp(density, 0.25, 2.5),
      light,
    };
  }, [speed, length, density, light]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false, depth: false });
    if (!canvas || !gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const at = (name: string) => gl.getUniformLocation(program, name);
    const resolution = at("u_resolution");
    const time = at("u_time");
    const lengthLoc = at("u_length");
    const bandsLoc = at("u_bands");
    const strength = at("u_strength");
    const edge = at("u_edge");
    const paper = at("u_paper");
    const ink = at("u_ink");

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let t = 0;
    let last = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const v = live.current;
      t += ((now - last) / 1000) * v.speed * calm;
      last = now;

      gl.uniform1f(time, t);
      gl.uniform1f(lengthLoc, v.length);
      gl.uniform1f(bandsLoc, v.bands);

      if (v.light) {
        gl.uniform3f(paper, 0.933, 0.945, 0.965);
        gl.uniform3f(ink, 0.12, 0.14, 0.18);
        gl.uniform1f(strength, 0.95);
        gl.uniform1f(edge, 0.03);
      } else {
        gl.uniform3f(paper, 0, 0, 0);
        gl.uniform3f(ink, 1, 1, 1);
        gl.uniform1f(strength, 0.45);
        gl.uniform1f(edge, 0.02);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  const tuned = hue !== 0 || saturation !== 1 || brightness !== 1;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: light ? PAPER : "#000000",
        opacity: clamp(opacity, 0.05, 1),
        filter: tuned
          ? `hue-rotate(${clamp(hue, -180, 180)}deg) saturate(${clamp(saturation, 0, 2)}) brightness(${clamp(brightness, 0.35, 1.65)})`
          : undefined,
        ...style,
      }}
    />
  );
}