"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

// Adapted from MengTo/threeui (MIT), TopoField.
const topoFieldSource = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <canvas id="topo-canvas"></canvas>
    <script>
        const canvas = document.getElementById('topo-canvas');
        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });

        if (gl) {
            gl.getExtension('OES_standard_derivatives');

            const vsSource = \`
                attribute vec2 a_position;
                void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
            \`;

            const fsSource = \`
                #extension GL_OES_standard_derivatives : enable
                precision highp float;
                uniform vec2 u_resolution;
                uniform float u_time;

                vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
                float snoise(vec2 v){
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy) );
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
                    i = mod(i, 289.0);
                    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m; m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                    vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                void main() {
                    vec2 st = gl_FragCoord.xy / u_resolution.xy;
                    st.x *= u_resolution.x / u_resolution.y;

                    vec2 noisePos = st * __NOISE_SCALE__ + vec2(u_time * 0.015, u_time * 0.025);
                    float n = snoise(noisePos) * 0.5 + 0.5;
                    float bandVal = n * __NUM_BANDS__;
                    float d = abs(fract(bandVal) - 0.5);

                    #ifdef GL_OES_standard_derivatives
                        float w = max(fwidth(bandVal), 0.0001);
                    #else
                        float w = 0.02;
                    #endif

                    float topoLines = (1.0 - smoothstep(0.0, w, d)) * 0.45;
                    gl_FragColor = vec4(vec3(__LINE_RGB__) * topoLines, topoLines);
                }
            \`;

            function createShader(gl, type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                return shader;
            }

            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, "a_position");
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
            const timeLocation = gl.getUniformLocation(program, "u_time");

            function resizeCanvas() {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            const startTime = performance.now();
            function render() {
                gl.uniform1f(timeLocation, (performance.now() - startTime) * 0.001);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        }
    </script>
</body>
</html>`;

type Rgb = [number, number, number];

export type TopoFieldProps = {
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

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function glslFloat(value: number, digits = 3) {
  const fixed = Number(value).toFixed(digits);
  return fixed.includes(".") ? fixed : `${fixed}.0`;
}

function resolveColor(css: string): Rgb {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0.96, 0.96, 0.96];
  ctx.fillStyle = "#000";
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  if (r + g + b === 0) return [0.96, 0.96, 0.96];
  return [r / 255, g / 255, b / 255];
}

function useLineColor(): Rgb | null {
  const [color, setColor] = useState<Rgb | null>(null);

  useEffect(() => {
    const update = () => setColor(resolveColor(getComputedStyle(document.body).color));
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-scheme", "data-theme"],
    });
    media.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return color;
}

function buildFocusedDocument({ length, density, color }: { length: number; density: number; color: Rgb }) {
  const patched = topoFieldSource
    .replace("__NOISE_SCALE__", glslFloat(1.4 * length, 3))
    .replace("__NUM_BANDS__", glslFloat(10 * density, 2))
    .replace("__LINE_RGB__", color.map((v) => glslFloat(v, 3)).join(", "));

  const targetJson = JSON.stringify([{ selector: "#topo-canvas", role: "background" }]).replace(/</g, "\\u003c");

  const focusStyle = `<style data-threeui-focus>
html, body { width: 100% !important; height: 100% !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: transparent !important; }
body { position: relative !important; }
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-role="background"] { position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; z-index: 0 !important; opacity: 1 !important; pointer-events: none !important; }
</style>`;

  const controlScript = `<script data-threeui-controls>
(function () {
  var controls = { speed: 1, opacity: 1 };
  window.__SF_CONTROLS = controls;
  var origin = performance.now();
  var virtual = 0;
  var last = origin;
  var performanceNow = performance.now.bind(performance);
  performance.now = function () {
    var real = performanceNow();
    virtual += (real - last) * (controls.speed || 1);
    last = real;
    return origin + virtual;
  };
  function applyVisual() {
    var opacity = controls.opacity == null ? 1 : controls.opacity;
    Array.prototype.forEach.call(document.querySelectorAll('[data-threeui-role]'), function (element) {
      element.style.opacity = String(opacity);
    });
  }
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'threeui-controls') return;
    var next = event.data.controls || {};
    Object.keys(next).forEach(function (key) { controls[key] = next[key]; });
    applyVisual();
  });
  window.__SF_APPLY_CONTROLS = applyVisual;
})();
</script>`;

  const focusScript = `<script data-threeui-focus>
(function () {
  var isolated = false;
  function isolate() {
    if (isolated) return;
    var specs = ${targetJson};
    var roots = [];
    specs.forEach(function (spec) {
      var element = document.querySelector(spec.selector);
      if (!element) return;
      element.setAttribute('data-threeui-role', spec.role);
      if (!roots.some(function (root) { return root.contains(element); })) roots.push(element);
    });
    if (!roots.length) return;
    isolated = true;
    roots.forEach(function (root) { document.body.appendChild(root); });
    Array.from(document.body.children).forEach(function (element) {
      if (roots.indexOf(element) !== -1) return;
      element.setAttribute('data-threeui-residual', '');
      element.setAttribute('aria-hidden', 'true');
      if ('inert' in element) element.inert = true;
    });
    document.body.setAttribute('data-threeui-ready', '');
    if (window.__SF_APPLY_CONTROLS) window.__SF_APPLY_CONTROLS();
    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
  }
  function scheduleIsolation() { setTimeout(isolate, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleIsolation, { once: true });
  else scheduleIsolation();
  window.addEventListener('load', isolate, { once: true });
})();
</script>`;

  return patched
    .replace(/<head([^>]*)>/i, `<head$1>${controlScript}${focusStyle}`)
    .replace(/<\/body>/i, `${focusScript}</body>`);
}

export default function TopoField({
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const color = useLineColor();
  const colorKey = color ? color.join(",") : "";

  const safeSpeed = clamp(speed, 0, 3);
  const safeLength = clamp(length, 0.35, 2.5);
  const safeDensity = clamp(density, 0.25, 2.5);
  const safeOpacity = clamp(opacity, 0.05, 1);
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);

  const source = useMemo(
    () =>
      colorKey
        ? buildFocusedDocument({
            length: safeLength,
            density: safeDensity,
            color: colorKey.split(",").map(Number) as Rgb,
          })
        : "",
    [colorKey, safeLength, safeDensity],
  );

  const post = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "threeui-controls", controls: { speed: safeSpeed, opacity: safeOpacity } },
      "*",
    );
  };

  useEffect(post, [safeSpeed, safeOpacity, source]);

  if (!source) return null;

  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe
      ref={iframeRef}
      className={className}
      title="Topo Field"
      srcDoc={source}
      sandbox="allow-scripts"
      loading="eager"
      onLoad={post}
      style={{ display: "block", width: "100%", height: "100%", border: 0, background: "transparent", filter, ...style }}
    />
  );
}