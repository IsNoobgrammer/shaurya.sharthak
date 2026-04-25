import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const GITA_LINES = [
  'Yadā yadā hi dharmasya',
  'glānir bhavati bhārata',
  'Abhyutthānam adharmasya',
  'tadātmānaṁ sṛjāmy aham',
  'Paritrāṇāya sādhūnāṁ',
  'vināśāya ca duṣkṛtām',
  'Dharma-saṁsthāpanārthāya',
  'sambhavāmi yuge yuge',
];

const THEME_COLORS: Record<string, { particle: string; line: string; textFill: string; textShadow: string }> = {
  'velvet-purple': { particle: '#A78BFA', line: 'rgba(167,139,250,0.08)', textFill: 'rgba(200,170,255,1.0)', textShadow: 'rgba(167,139,250,0.8)' },
  'moonwhite':     { particle: '#2D2D2D', line: 'rgba(28,28,28,0.06)',    textFill: 'rgba(20,20,20,0.9)',    textShadow: 'rgba(28,28,28,0.35)' },
  'obsidian':      { particle: '#787470', line: 'rgba(120,116,112,0.06)', textFill: 'rgba(200,196,191,0.85)', textShadow: 'rgba(168,164,160,0.3)' },
  'midnight-teal': { particle: '#2DD4BF', line: 'rgba(45,212,191,0.07)', textFill: 'rgba(94,234,212,1.0)',  textShadow: 'rgba(20,184,166,0.8)' },
  'crimson-noir':  { particle: '#E11D48', line: 'rgba(225,29,72,0.06)',  textFill: 'rgba(253,164,175,1.0)', textShadow: 'rgba(190,18,60,0.8)' },
  'mocha-mint':    { particle: '#86EFAC', line: 'rgba(134,239,172,0.06)', textFill: 'rgba(134,239,172,1.0)', textShadow: 'rgba(74,222,128,0.7)' },
  'solar-amber':   { particle: '#FBBF24', line: 'rgba(251,191,36,0.06)', textFill: 'rgba(251,191,36,1.0)',  textShadow: 'rgba(245,158,11,0.7)' },
};

interface SceneProps {
  gitaForeground: boolean;
  theme: string;
}

// ── Particles with connecting lines ──────────────────────────────────────────
function ParticleField({ gitaForeground, theme }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const colors = THEME_COLORS[theme] ?? THEME_COLORS['velvet-purple'];
  const count = 500;
  const connectionDist = 1.8;

  // Particle positions + velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      vel[i * 3]     = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return [pos, vel];
  }, []);

  // Sizes — varied for depth feel
  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = 0.8 + Math.random() * 2.5;
    }
    return s;
  }, []);

  // Line geometry — preallocate max possible connections
  const maxLines = 800;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Update particle color when theme changes
  useEffect(() => {
    if (!pointsRef.current) return;
    (pointsRef.current.material as THREE.PointsMaterial).color.set(colors.particle);
  }, [colors.particle]);

  useEffect(() => {
    if (!linesRef.current) return;
    (linesRef.current.material as THREE.LineBasicMaterial).color.set(new THREE.Color(colors.particle));
    (linesRef.current.material as THREE.LineBasicMaterial).opacity = 0.06;
  }, [colors.particle]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;
    const t = state.clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Move particles
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     += velocities[i3]     + Math.sin(t * 0.1 + i) * 0.0003;
      pos[i3 + 1] += velocities[i3 + 1] + Math.cos(t * 0.08 + i * 0.5) * 0.0003;
      pos[i3 + 2] += velocities[i3 + 2];

      // Wrap around boundaries
      if (pos[i3] > 7)     pos[i3] = -7;
      if (pos[i3] < -7)    pos[i3] = 7;
      if (pos[i3+1] > 5)   pos[i3+1] = -5;
      if (pos[i3+1] < -5)  pos[i3+1] = 5;
      if (pos[i3+2] > 3)   pos[i3+2] = -3;
      if (pos[i3+2] < -3)  pos[i3+2] = 3;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Build connection lines between nearby particles
    let lineIdx = 0;
    const lp = linesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count && lineIdx < maxLines; i++) {
      for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
        const dx = pos[i*3] - pos[j*3];
        const dy = pos[i*3+1] - pos[j*3+1];
        const dz = pos[i*3+2] - pos[j*3+2];
        const d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < connectionDist * connectionDist) {
          const li = lineIdx * 6;
          lp[li]   = pos[i*3];   lp[li+1] = pos[i*3+1]; lp[li+2] = pos[i*3+2];
          lp[li+3] = pos[j*3];   lp[li+4] = pos[j*3+1]; lp[li+5] = pos[j*3+2];
          lineIdx++;
        }
      }
    }
    // Zero out remaining
    for (let k = lineIdx * 6; k < maxLines * 6; k++) lp[k] = 0;
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIdx * 2);

    // Mouse influence
    pointsRef.current.position.x += (mouseRef.current.x * 0.15 - pointsRef.current.position.x) * 0.04;
    pointsRef.current.position.y += (mouseRef.current.y * 0.10 - pointsRef.current.position.y) * 0.04;
    linesRef.current.position.copy(pointsRef.current.position);

    // Opacity
    const pMat = pointsRef.current.material as THREE.PointsMaterial;
    const lMat = linesRef.current.material as THREE.LineBasicMaterial;
    const targetOp = gitaForeground ? 0.12 : 0.55;
    const targetLineOp = gitaForeground ? 0.02 : 0.06;
    pMat.opacity += (targetOp - pMat.opacity) * 0.04;
    lMat.opacity += (targetLineOp - lMat.opacity) * 0.04;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={count} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={colors.particle}
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={maxLines * 2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={colors.particle} transparent opacity={0.06} depthWrite={false} />
      </lineSegments>
    </>
  );
}

// ── Gita text planes ─────────────────────────────────────────────────────────
function GitaText({ gitaForeground, theme }: SceneProps) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const initialYRef = useRef<number[]>([]);
  const colors = THEME_COLORS[theme] ?? THEME_COLORS['velvet-purple'];

  const textMeshes = useMemo(() => {
    return GITA_LINES.map((line, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 96;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 1024, 96);
      ctx.font = '600 30px Georgia, serif';
      ctx.fillStyle = colors.textFill;
      ctx.textAlign = 'center';
      ctx.shadowColor = colors.textShadow;
      ctx.shadowBlur = 12;
      ctx.fillText(line, 512, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.PlaneGeometry(7, 0.55);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.0, depthWrite: false });

      const col = i % 2;
      const x = col === 0 ? -1.2 : 1.2;
      const ySpread = viewport.height * 0.8;
      const y = ySpread * 0.45 - i * (ySpread / (GITA_LINES.length - 1));
      const z = -1.2 - (i % 3) * 0.4;

      return { geometry, material, x, y, z };
    });
  }, [viewport.height, colors.textFill, colors.textShadow]);

  useEffect(() => { initialYRef.current = textMeshes.map((tm) => tm.y); }, [textMeshes]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const base = gitaForeground ? 0.80 : 0.30;
      const amp  = gitaForeground ? 0.10 : 0.12;
      mat.opacity += (base + Math.sin(t * 0.18 + i * 0.9) * amp - mat.opacity) * 0.03;
      // Only drift when foreground mode active
      if (gitaForeground) {
        mesh.position.y += 0.00025;
        const initY = initialYRef.current[i] ?? 0;
        if (mesh.position.y > initY + viewport.height * 0.55) mesh.position.y = initY - viewport.height * 0.2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {textMeshes.map((tm, i) => (
        <mesh key={i} geometry={tm.geometry} material={tm.material} position={[tm.x, tm.y, tm.z]} />
      ))}
    </group>
  );
}

// ── Main scene ───────────────────────────────────────────────────────────────
interface HeroSceneProps {
  gitaForeground?: boolean;
  theme?: string;
}

export default function HeroScene({ gitaForeground = false, theme = 'obsidian' }: HeroSceneProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }} dpr={[1, 1.5]}>
        <GitaText gitaForeground={gitaForeground} theme={theme} />
        <ParticleField gitaForeground={gitaForeground} theme={theme} />
      </Canvas>
    </div>
  );
}
