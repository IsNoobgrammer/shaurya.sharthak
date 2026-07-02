import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;

/**
 * A fixed, full-viewport animated shader wash that lives BEHIND all content
 * (z-index:-1). It blends the active theme's --bg-primary with --text-accent
 * using flowing fbm noise, so it re-tints itself whenever the theme changes.
 * Kept deliberately subtle; perf-gated by the parent (desktop, no reduced-motion).
 */

function readThemeColors() {
  const cs = getComputedStyle(document.documentElement);
  const bg = cs.getPropertyValue('--bg-primary').trim() || '#0c0c0c';
  const accent = cs.getPropertyValue('--text-accent').trim() || '#888888';
  return { bg: new THREE.Color(bg), accent: new THREE.Color(accent) };
}

const vertexShader = /* glsl */ `
  void main() { gl_Position = vec4(position, 1.0); }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3  uBg;
  uniform vec3  uAccent;
  uniform vec2  uRes;

  vec2 hash(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p){
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * aspect, uv.y) * 2.6;
    float t = uTime * 0.045;

    float f = fbm(p + vec2(t, t * 0.6));
    f = f * 0.5 + 0.5;

    float grad = smoothstep(0.0, 1.0, 1.0 - uv.y);
    float amt  = f * 0.16 + grad * 0.06;

    vec3 col = mix(uBg, uAccent, clamp(amt, 0.0, 1.0));

    float vig = smoothstep(1.25, 0.15, length(uv - 0.5));
    col = mix(uBg, col, 0.55 + 0.45 * vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Wash() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const invalidate = useThree((s) => s.invalidate);
  const uniforms = useMemo(() => {
    const { bg, accent } = readThemeColors();
    return {
      uTime: { value: 0 },
      uBg: { value: bg },
      uAccent: { value: accent },
      uRes: { value: new THREE.Vector2(1, 1) },
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const { bg, accent } = readThemeColors();
      uniforms.uBg.value.copy(bg);
      uniforms.uAccent.value.copy(accent);
      invalidate();
    };
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, [uniforms, invalidate]);

  // Drive rendering at ~30fps, and never while the tab is hidden.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = t - last;
      last = t;
      if (document.hidden) return;
      acc += dt;
      if (acc >= FRAME_MS) { acc = 0; invalidate(); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uRes.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  return (
    <div className="shader-bg" aria-hidden="true">
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={0.5}
        camera={{ position: [0, 0, 1] }}
        frameloop="demand"
      >
        <Wash />
      </Canvas>
    </div>
  );
}
