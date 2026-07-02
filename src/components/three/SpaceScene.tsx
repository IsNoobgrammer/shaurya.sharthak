import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Effect, EffectAttribute } from "postprocessing";
import * as THREE from "three";

/**
 * Hero backdrop (obsidian). Physics is real, not faked:
 *  • 3 black holes on the figure-eight 3-body orbit (velocity-Verlet N-body).
 *  • The fabric is a live MEMBRANE SIMULATION — a finite-difference elastic sheet
 *    (damped wave equation) forced by gravity from every mass; it sags heavily
 *    toward masses and ripples propagate on their own (no analytic fake).
 *  • A spiral galaxy sits IN the fabric (top-right) with a heavy central black
 *    hole carving a deep well; the galaxy itself does not swirl.
 *  • Gravitational lensing at each black hole. Navigate: cursor aims,
 *    ctrl+scroll / pinch flies along that aim.
 */

const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;
const RX = -1.12,
  PY = -10,
  PZ = -40;
const cosRX = Math.cos(RX),
  sinRX = Math.sin(RX);
const BH_SCALE = 30;

// galaxy — sheet-local location (top-right region), radius, masses
const GLX = 108,
  GLY = 80,
  GLR = 15;
const MBH = 1.8,
  MGAL = 8.0;

// ── Live membrane fabric simulation (height field) ─────────────────────────────
const NX = 104,
  NY = 64,
  FW = 380,
  FH = 240;
const FDX = FW / (NX - 1),
  FDY = FH / (NY - 1);
let fz = new Float32Array(NX * NY);
let fzPrev = new Float32Array(NX * NY);
let fzTmp = new Float32Array(NX * NY);
// DAMP is high enough that gravitational-wave rings actually propagate across
// the sheet instead of dying within a few cells. Equilibrium well depth is
// damping-independent (steady state solves T·∇²z = G·g), so wells are unchanged.
const TENSION = 0.3,
  DAMP = 0.94,
  GSCALE = 0.9,
  SOFT = 26,
  FLOOR = -70;
// Gravitational waves — physically driven, cinematically retimed:
//   phase   = 2× the pair's relative angular velocity (quadrupole radiation is
//             emitted at twice the orbital frequency), integrated per substep
//   amp     ∝ 1/r² of the pair — the chirp: closer bodies → stronger AND faster
//   GW_TIMESCALE compresses the orbit's ~19s period into visible ripples while
//             keeping the frequency *tracking* (close approaches audibly chirp).
// GW_TIMESCALE tuned so the ripple wavelength is ~8 grid cells (membrane wave
// speed is √TENSION cells/step) — higher values alias into moiré rings.
const RSIG = 40,
  GW_EMIT = 0.25,
  GW_TIMESCALE = 13;
const pairPhase = [0, 0, 0]; // pairs (0,1) (0,2) (1,2)
const pairAmp = [0, 0, 0];
const gwSrc = [0, 0, 0]; // per-body emission this frame
function sampleZ(x: number, y: number): number {
  const i = Math.max(0, Math.min(NX - 1, Math.round((x + FW / 2) / FDX)));
  const j = Math.max(0, Math.min(NY - 1, Math.round((FH / 2 - y) / FDY)));
  return fz[j * NX + i];
}
// masses feeding the sim (updated each frame): {x,y,m} in sheet-local coords
const simMasses: { x: number; y: number; m: number }[] = [
  { x: 0, y: 0, m: MBH },
  { x: 0, y: 0, m: MBH },
  { x: 0, y: 0, m: MBH },
  { x: GLX, y: GLY, m: MGAL },
];
function stepMembrane() {
  for (let j = 1; j < NY - 1; j++) {
    const vy = FH / 2 - j * FDY;
    for (let i = 1; i < NX - 1; i++) {
      const idx = j * NX + i;
      const z0 = fz[idx];
      const neigh =
        (fz[idx - 1] + fz[idx + 1] + fz[idx - NX] + fz[idx + NX]) * 0.25;
      const vx = -FW / 2 + i * FDX;
      let g = 0,
        ripple = 0;
      for (let m = 0; m < simMasses.length; m++) {
        const dx = vx - simMasses[m].x,
          dy = vy - simMasses[m].y;
        const d2 = dx * dx + dy * dy;
        g += simMasses[m].m / (d2 + SOFT);
        if (m < 3 && d2 < 900) ripple += gwSrc[m] * Math.exp(-d2 / RSIG);
      }
      let zn =
        z0 +
        (z0 - fzPrev[idx]) * DAMP +
        TENSION * (neigh - z0) -
        GSCALE * g +
        ripple;
      if (zn < FLOOR) zn = FLOOR;
      fzTmp[idx] = zn;
    }
  }
  for (let i = 0; i < NX; i++) {
    fzTmp[i] = 0;
    fzTmp[(NY - 1) * NX + i] = 0;
  }
  for (let j = 0; j < NY; j++) {
    fzTmp[j * NX] = 0;
    fzTmp[j * NX + NX - 1] = 0;
  }
  const t = fzPrev;
  fzPrev = fz;
  fz = fzTmp;
  fzTmp = t;
}
// sheet-local (x,y,z) → world (tilted sheet frame)
function toWorld(x: number, y: number, z: number, out: THREE.Vector3) {
  out.set(x, PY + y * cosRX - z * sinRX, PZ + y * sinRX + z * cosRX);
}

// ── 3-body physics: figure-eight (G = m = 1) ──────────────────────────────────
const bodies = [
  { x: 0.97000436, y: -0.24308753, vx: 0.466203685, vy: 0.43236573 },
  { x: -0.97000436, y: 0.24308753, vx: 0.466203685, vy: 0.43236573 },
  { x: 0.0, y: 0.0, vx: -0.93240737, vy: -0.86473146 },
];
const EPS2 = 0.0025;
function accel(i: number): [number, number] {
  let ax = 0,
    ay = 0;
  for (let j = 0; j < 3; j++) {
    if (j === i) continue;
    const dx = bodies[j].x - bodies[i].x,
      dy = bodies[j].y - bodies[i].y;
    const inv = 1 / Math.pow(dx * dx + dy * dy + EPS2, 1.5);
    ax += dx * inv;
    ay += dy * inv;
  }
  return [ax, ay];
}
function stepVerlet(dt: number) {
  const a = [accel(0), accel(1), accel(2)];
  for (let i = 0; i < 3; i++) {
    bodies[i].x += bodies[i].vx * dt + 0.5 * a[i][0] * dt * dt;
    bodies[i].y += bodies[i].vy * dt + 0.5 * a[i][1] * dt * dt;
  }
  const a2 = [accel(0), accel(1), accel(2)];
  for (let i = 0; i < 3; i++) {
    bodies[i].vx += 0.5 * (a[i][0] + a2[i][0]) * dt;
    bodies[i].vy += 0.5 * (a[i][1] + a2[i][1]) * dt;
  }
}

// Pre-settle the membrane so the wells exist on the very first frame.
// (Longer settle: lower damping means the sheet rings longer before calming.)
for (let i = 0; i < 3; i++) {
  simMasses[i].x = bodies[i].x * BH_SCALE;
  simMasses[i].y = bodies[i].y * BH_SCALE;
}
for (let k = 0; k < 600; k++) stepMembrane();

// Bodies sit at a low-pass-filtered well depth: the GW ripples live on the
// fabric only (they're far too weak to move a black hole) — without the filter
// the emitters' own oscillation would visibly bob the bodies.
const bhZ = [0, 0, 0].map((_, i) =>
  sampleZ(bodies[i].x * BH_SCALE, bodies[i].y * BH_SCALE),
);
let galZ = sampleZ(GLX, GLY);

// shared state
const bhLocal = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
const bhWorld = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
const holeNDC = [
  new THREE.Vector2(9, 9),
  new THREE.Vector2(9, 9),
  new THREE.Vector2(9, 9),
  new THREE.Vector2(9, 9),
];
const holeVZ = [0, 0, 0, 0];
const galWorld = new THREE.Vector3();
const nav = { px: 0, py: 0, tpx: 0, tpy: 0, impulse: 0, speed: 0 };
const camPos = new THREE.Vector3(0, 2, 15);
const aim = new THREE.Vector3(0, 0, -1);
const _v = new THREE.Vector3();

function readAccent() {
  const cs = getComputedStyle(document.documentElement);
  return new THREE.Color(
    cs.getPropertyValue("--text-accent").trim() || "#8B5CF6",
  );
}

const noiseGLSL = /* glsl */ `
  vec2 hash(vec2 p){ p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return -1.0+2.0*fract(sin(p)*43758.5453123); }
  float noise(vec2 p){ const float K1=0.366025404,K2=0.211324865; vec2 i=floor(p+(p.x+p.y)*K1); vec2 a=p-i+(i.x+i.y)*K2;
    vec2 o=(a.x>a.y)?vec2(1.0,0.0):vec2(0.0,1.0); vec2 b=a-o+K2; vec2 c=a-1.0+2.0*K2;
    vec3 h=max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0);
    vec3 n=h*h*h*h*vec3(dot(a,hash(i)),dot(b,hash(i+o)),dot(c,hash(i+1.0))); return dot(n,vec3(70.0)); }
  float fbm(vec2 p){ float v=0.0,a=0.5; for(int k=0;k<4;k++){ v+=a*noise(p); p=p*2.02+1.7; a*=0.5; } return v; }
`;

// ── Gravitational lensing (fullscreen UV-warp; 3 BH + galaxy core) ─────────────
const lensFrag = /* glsl */ `
  #define NUM_HOLES 4
  uniform vec2 uHoles[NUM_HOLES];
  uniform float uMass[NUM_HOLES];
  void mainUv(inout vec2 uv){
    vec2 aspectFix = vec2(aspect, 1.0);
    vec2 total = vec2(0.0);
    for(int i=0;i<NUM_HOLES;i++){
      vec2 dir = (uv - uHoles[i]) * aspectFix;
      float d = max(length(dir), 0.03);
      total -= normalize(dir) * (uMass[i] / (d*d)) / aspectFix;
    }
    uv += total;
  }
`;
class LensingEffectImpl extends Effect {
  constructor() {
    super("LensingEffect", lensFrag, {
      attributes: EffectAttribute.NONE,
      uniforms: new Map<string, THREE.Uniform>([
        [
          "uHoles",
          new THREE.Uniform([
            new THREE.Vector2(9, 9),
            new THREE.Vector2(9, 9),
            new THREE.Vector2(9, 9),
            new THREE.Vector2(9, 9),
          ]),
        ],
        ["uMass", new THREE.Uniform([0, 0, 0, 0])],
      ]),
    });
  }
}

// ── Driver: 3-body + membrane step + camera + projections ─────────────────────
function Driver() {
  const { camera } = useThree();
  useFrame(() => {
    const PAIRS: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 2],
    ];
    for (let s = 0; s < 4; s++) {
      stepVerlet(0.0028);
      // GW phase: quadrupole radiation oscillates at 2× the pair's relative
      // angular velocity — integrate per substep so close flybys chirp.
      for (let p = 0; p < 3; p++) {
        const [a, b] = PAIRS[p];
        const dx = bodies[b].x - bodies[a].x,
          dy = bodies[b].y - bodies[a].y;
        const dvx = bodies[b].vx - bodies[a].vx,
          dvy = bodies[b].vy - bodies[a].vy;
        const r2 = dx * dx + dy * dy;
        const omega = Math.abs(dx * dvy - dy * dvx) / (r2 + 1e-6);
        pairPhase[p] += 2 * omega * 0.0028 * GW_TIMESCALE;
        pairAmp[p] = 1 / (r2 + 0.35);
      }
    }
    for (let i = 0; i < 3; i++) {
      bhLocal[i].set(bodies[i].x * BH_SCALE, bodies[i].y * BH_SCALE);
      simMasses[i].x = bhLocal[i].x;
      simMasses[i].y = bhLocal[i].y;
    }
    // each body emits the waves of the pairs it belongs to
    gwSrc[0] =
      GW_EMIT *
      (Math.sin(pairPhase[0]) * pairAmp[0] +
        Math.sin(pairPhase[1]) * pairAmp[1]);
    gwSrc[1] =
      GW_EMIT *
      (Math.sin(pairPhase[0]) * pairAmp[0] +
        Math.sin(pairPhase[2]) * pairAmp[2]);
    gwSrc[2] =
      GW_EMIT *
      (Math.sin(pairPhase[1]) * pairAmp[1] +
        Math.sin(pairPhase[2]) * pairAmp[2]);
    stepMembrane();
    // black-hole world positions sit in their wells; project for lensing.
    // Slow lerp = gravitational sag only; ripples never move the bodies.
    for (let i = 0; i < 3; i++) {
      bhZ[i] += (sampleZ(bhLocal[i].x, bhLocal[i].y) - bhZ[i]) * 0.03;
      toWorld(bhLocal[i].x, bhLocal[i].y, bhZ[i] + 1.0, bhWorld[i]);
      _v.copy(bhWorld[i]).applyMatrix4(camera.matrixWorldInverse);
      holeVZ[i] = _v.z;
      _v.copy(bhWorld[i]).project(camera);
      holeNDC[i].set(_v.x, _v.y);
    }
    galZ += (sampleZ(GLX, GLY) - galZ) * 0.03;
    toWorld(GLX, GLY, galZ + 1.0, galWorld);
    _v.copy(galWorld).applyMatrix4(camera.matrixWorldInverse);
    holeVZ[3] = _v.z;
    _v.copy(galWorld).project(camera);
    holeNDC[3].set(_v.x, _v.y);
    // navigation — asymptotic dive: forward speed scales with the remaining
    // distance to the nearest event horizon, so you can zoom forever and only
    // ever approach it (each impulse covers a fraction of what's left — at the
    // horizon you're "stuck", exactly like an outside observer in GR).
    nav.px += (nav.tpx - nav.px) * 0.05;
    nav.py += (nav.tpy - nav.py) * 0.05;
    aim.set(nav.px * 0.8, -nav.py * 0.6, -1).normalize();
    let dMin = Infinity;
    for (let i = 0; i < 3; i++)
      dMin = Math.min(dMin, camPos.distanceTo(bhWorld[i]));
    dMin = Math.min(dMin, camPos.distanceTo(galWorld));
    const HORIZON = 2.2; // just outside the 1.5-radius event-horizon sphere
    const approach = THREE.MathUtils.clamp((dMin - HORIZON) / 12, 0, 1);
    camPos.addScaledVector(
      aim,
      nav.impulse > 0 ? nav.impulse * approach : nav.impulse,
    );
    if (camPos.length() > 220) camPos.setLength(220); // don't get lost in the void
    nav.speed = nav.impulse;
    nav.impulse *= 0.9;
    camera.position.copy(camPos);
    camera.lookAt(
      camPos.x + aim.x * 30,
      camPos.y + aim.y * 30,
      camPos.z + aim.z * 30,
    );
  });
  return null;
}

// ── The simulated fabric (wireframe whose z is the live membrane) ─────────────
function Fabric() {
  const geom = useMemo(
    () => new THREE.PlaneGeometry(FW, FH, NX - 1, NY - 1),
    [],
  );
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uColor: { value: readAccent() } }), []);
  useEffect(() => {
    const update = () => uniforms.uColor.value.copy(readAccent());
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, [uniforms]);
  useFrame(() => {
    const pos = geom.attributes.position.array as Float32Array;
    for (let k = 0; k < NX * NY; k++) pos[k * 3 + 2] = fz[k];
    geom.attributes.position.needsUpdate = true;
  });
  return (
    <mesh geometry={geom} rotation={[RX, 0, 0]} position={[0, PY, PZ]}>
      <shaderMaterial
        ref={matRef}
        wireframe
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={
          /* glsl */ `
          varying float vDepth; varying vec2 vXY;
          void main(){ vDepth = clamp(-position.z*0.03, 0.0, 1.0); vXY = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `
        }
        fragmentShader={
          /* glsl */ `
          precision highp float; uniform vec3 uColor; varying float vDepth; varying vec2 vXY;
          void main(){
            float edge = 1.0 - smoothstep(95.0, 175.0, length(vXY));
            float a = (0.03 + vDepth*0.16) * edge;
            gl_FragColor = vec4(uColor*(0.5 + vDepth*1.1), a);
          }
        `
        }
      />
    </mesh>
  );
}

// ── A black hole (event horizon + accretion), sits in its well ────────────────
function BlackHole({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const disk = useRef<THREE.Mesh>(null);
  const diskMat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((s) => {
    if (group.current) group.current.position.copy(bhWorld[index]);
    if (diskMat.current)
      diskMat.current.uniforms.uTime.value = s.clock.elapsedTime;
    if (disk.current) disk.current.lookAt(camPos);
  });
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={disk}>
        <planeGeometry args={[8, 8]} />
        <shaderMaterial
          ref={diskMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={
            /* glsl */ `
            precision highp float; varying vec2 vUv; uniform float uTime;
            void main(){ vec2 p=vUv-0.5; float r=length(p); float ang=atan(p.y,p.x);
              float swirl=0.5+0.5*sin(ang*2.0 - uTime*1.6 + r*16.0);
              float ring=smoothstep(0.5,0.17,r)*smoothstep(0.11,0.19,r);
              float b=ring*(0.55+0.45*swirl);
              vec3 col=mix(vec3(1.0,0.72,0.34), vec3(0.9,0.32,0.12), r*2.0);
              gl_FragColor=vec4(col*b, b*0.6); }
          `
          }
        />
      </mesh>
    </group>
  );
}

// ── Spiral galaxy sitting IN the fabric (static — no swirl) + heavy core BH ────
function Galaxy() {
  const group = useRef<THREE.Group>(null);
  const COUNT = 11000,
    NARMS = 2;
  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const h = GLR * 0.3,
      pitch = 0.3;
    const bulge = Math.floor(COUNT * 0.3);
    for (let i = 0; i < COUNT; i++) {
      let r: number, a: number, zt: number;
      if (i < bulge) {
        r = Math.pow(Math.random(), 1.8) * GLR * 0.28;
        a = Math.random() * Math.PI * 2;
        zt = (Math.random() - 0.5) * (GLR * 0.28 - r) * 0.9;
      } else {
        do {
          r = -h * Math.log(1 - Math.random());
        } while (r > GLR);
        r += GLR * 0.12;
        const arm = Math.floor(Math.random() * NARMS) * ((Math.PI * 2) / NARMS);
        const baseAng = arm + Math.log(r / (GLR * 0.12)) / pitch;
        const scatter = 0.18 + 0.55 * (r / GLR);
        a =
          Math.random() < 0.82
            ? baseAng + (Math.random() - 0.5) * scatter
            : Math.random() * Math.PI * 2;
        zt = (Math.random() - 0.5) * 0.8 * (1 - r / (GLR + 2));
      }
      // disk lies in local XY plane so it can be laid flat into the tilted sheet
      pos[i * 3] = r * Math.cos(a);
      pos[i * 3 + 1] = r * Math.sin(a);
      pos[i * 3 + 2] = zt;
    }
    return pos;
  }, []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    [],
  );
  useFrame((s) => {
    if (uniforms.uTime) uniforms.uTime.value = s.clock.elapsedTime;
    if (group.current) group.current.position.copy(galWorld);
  });
  return (
    <group ref={group} rotation={[RX, 0, 0]}>
      {/* central heavy black hole */}
      <mesh>
        <sphereGeometry args={[1.6, 24, 24]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.4, 20, 20]} />
        <meshBasicMaterial
          color="#ffe6c0"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={
            /* glsl */ `
            uniform float uTime, uPixelRatio; varying vec3 vColor;
            float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
            void main(){
              float r = length(position.xy);
              vec4 mv = modelViewMatrix * vec4(position,1.0);
              float hh = hash(position);
              vec3 core  = vec3(1.0,0.93,0.78);
              vec3 bulge = mix(vec3(1.0,0.74,0.40), vec3(1.0,0.58,0.28), hh);
              vec3 arm   = mix(vec3(0.52,0.70,1.0), vec3(0.82,0.90,1.0), hh*0.5);
              vec3 col   = mix(bulge, arm, smoothstep(3.0, 7.0, r));
              col = mix(core, col, smoothstep(0.0, 1.6, r));
              if (r > 5.0 && hh > 0.965) col = vec3(1.0,0.5,0.72);
              float tw = 0.72 + 0.28*sin(uTime*2.0 + hh*40.0);
              vColor = col * tw * 0.66;
              float sz = mix(0.7, 2.4, hh) * (r < 4.0 ? 1.5 : 1.0);
              gl_Position = projectionMatrix * mv;
              gl_PointSize = sz * uPixelRatio * (150.0 / max(-mv.z, 0.1));
            }
          `
          }
          fragmentShader={`precision highp float; varying vec3 vColor; void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d); gl_FragColor=vec4(vColor, a*a); }`}
        />
      </points>
    </group>
  );
}

// ── Faint far nebula ──────────────────────────────────────────────────────────
function Nebula() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAccent: { value: readAccent() } }),
    [],
  );
  useEffect(() => {
    const update = () => uniforms.uAccent.value.copy(readAccent());
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, [uniforms]);
  useFrame((s) => {
    if (matRef.current)
      matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh scale={130}>
      <sphereGeometry args={[1, 32, 24]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={
          /* glsl */ `
          precision highp float; varying vec3 vP; uniform float uTime; uniform vec3 uAccent;
          ${noiseGLSL}
          void main(){ vec3 n=normalize(vP);
            vec2 uv=vec2(atan(n.z,n.x)*0.159+0.5, asin(clamp(n.y,-1.0,1.0))*0.318+0.5);
            float f=fbm(uv*3.0+uTime*0.008); float neb=smoothstep(0.62,0.95,f)*0.3;
            vec3 col=mix(vec3(0.09,0.05,0.16), uAccent, f*0.35);
            gl_FragColor=vec4(col*neb, neb*0.2); }
        `
        }
      />
    </mesh>
  );
}

// ── 30fps throttle + pause when hero off-screen / tab hidden ───────────────────
function FrameGovernor() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0,
      last = performance.now(),
      acc = 0,
      visible = true;
    const hero = document.getElementById("hero");
    const io = hero
      ? new IntersectionObserver(
          ([e]) => {
            visible = e.isIntersecting;
          },
          { threshold: 0 },
        )
      : null;
    if (hero && io) io.observe(hero);
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = t - last;
      last = t;
      if (document.hidden || !visible) return;
      acc += dt;
      if (acc >= FRAME_MS) {
        acc = 0;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [invalidate]);
  return null;
}

function SceneContents() {
  const lens = useMemo(() => new LensingEffectImpl(), []);
  useFrame(() => {
    const holes = lens.uniforms.get("uHoles")!.value as THREE.Vector2[];
    const mass = lens.uniforms.get("uMass")!.value as number[];
    for (let i = 0; i < 4; i++) {
      holes[i].set(holeNDC[i].x * 0.5 + 0.5, holeNDC[i].y * 0.5 + 0.5);
      const onScreen =
        Math.abs(holeNDC[i].x) < 1.4 && Math.abs(holeNDC[i].y) < 1.4;
      mass[i] = holeVZ[i] < -1 && onScreen ? (i === 3 ? 0.0011 : 0.0005) : 0.0;
    }
  });
  return (
    <>
      <Driver />
      <FrameGovernor />
      <Nebula />
      <Fabric />
      <BlackHole index={0} />
      <BlackHole index={1} />
      <BlackHole index={2} />
      <Galaxy />
      <EffectComposer>
        <primitive object={lens} dispose={null} />
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.6}
        />
        <Vignette eskil={false} offset={0.28} darkness={1.0} />
      </EffectComposer>
    </>
  );
}

export default function SpaceScene() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    const move = (e: PointerEvent) => {
      nav.tpx = (e.clientX / window.innerWidth) * 2 - 1;
      nav.tpy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // Adaptive zoom: sustained zooming in one direction winds up a streak that
    // multiplies both the per-tick gain and the speed cap — first ticks are
    // gentle, holding the zoom accelerates (both in AND out). Reversing
    // direction or pausing ~450ms resets it. The asymptotic horizon stall in
    // Driver still applies, so even a wound-up dive parks at the horizon.
    const zoom = { streak: 0, dir: 0, last: 0 };
    const applyZoom = (delta: number) => {
      const dir = Math.sign(delta);
      if (dir === 0) return;
      const now = performance.now();
      if (dir === zoom.dir && now - zoom.last < 450) {
        zoom.streak = Math.min(zoom.streak + 1, 30);
      } else {
        zoom.streak = 0;
      }
      zoom.dir = dir;
      zoom.last = now;
      const boost = 1 + zoom.streak * 0.15; // 1× → 5.5× while held
      const cap = 0.9 * boost;
      nav.impulse = Math.max(
        -cap,
        Math.min(cap, nav.impulse + delta * boost),
      );
    };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      const hero = document.getElementById("hero");
      if (hero && hero.getBoundingClientRect().bottom < 80) return;
      e.preventDefault();
      applyZoom(-e.deltaY * 0.004);
    };
    // Pinch zoom flies along the current aim (cursor direction) — only while
    // the hero is on screen, so page pinch-zoom still works elsewhere.
    let pStart = 0;
    const heroVisible = () => {
      const hero = document.getElementById("hero");
      return !hero || hero.getBoundingClientRect().bottom >= 80;
    };
    const dist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const tStart = (e: TouchEvent) => {
      if (e.touches.length === 2) pStart = dist(e.touches);
    };
    const tMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !heroVisible()) return;
      e.preventDefault();
      const d = dist(e.touches);
      applyZoom((d - pStart) * 0.02);
      pStart = d;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("touchstart", tStart, { passive: true });
    window.addEventListener("touchmove", tMove, { passive: false });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchstart", tStart);
      window.removeEventListener("touchmove", tMove);
    };
  }, []);
  if (!ready) return null;
  return (
    <div className="shader-bg" aria-hidden="true">
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={1}
        camera={{ position: [0, 2, 15], fov: 68 }}
        frameloop="demand"
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}
