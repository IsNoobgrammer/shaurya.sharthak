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
  'obsidian':      { particle: '#787470', line: 'rgba(120,116,112,0.06)', textFill: 'rgba(200,196,191,0.85)', textShadow: 'rgba(168,164,160,0.3)' },
  'midnight-teal': { particle: '#2DD4BF', line: 'rgba(45,212,191,0.07)', textFill: 'rgba(94,234,212,1.0)',  textShadow: 'rgba(20,184,166,0.8)' },
  'moonwhite':     { particle: '#2D2D2D', line: 'rgba(28,28,28,0.06)',    textFill: 'rgba(20,20,20,0.9)',    textShadow: 'rgba(28,28,28,0.35)' },
};

interface SceneProps {
  gitaForeground: boolean;
  theme: string;
}

// ── Particles with connecting lines ──────────────────────────────────────────
function ParticleField({ gitaForeground, theme }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const colors = THEME_COLORS[theme] ?? THEME_COLORS['velvet-purple'];
  const isLight = theme === 'moonwhite';
  const count = 320;
  const connectionDist = 1.9;

  // Generate soft glowing particle texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      vel[i * 3]     = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return [pos, vel];
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 1.0 + Math.random() * 3.5;
    return s;
  }, []);

  const maxLines = 550;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), []);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useEffect(() => {
    if (!pointsRef.current) return;
    (pointsRef.current.material as THREE.PointsMaterial).color.set(colors.particle);
  }, [colors.particle]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    const themeColor = new THREE.Color(colors.particle);

    // Slowly rotate the entire field
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.15;
    groupRef.current.rotation.x = Math.cos(t * 0.07) * 0.05;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     += velocities[i3]     + Math.sin(t * 0.1 + i) * 0.0002;
      pos[i3 + 1] += velocities[i3 + 1] + Math.cos(t * 0.08 + i * 0.5) * 0.0002;
      pos[i3 + 2] += velocities[i3 + 2];

      if (pos[i3] > 7)     pos[i3] = -7;
      if (pos[i3] < -7)    pos[i3] = 7;
      if (pos[i3+1] > 5)   pos[i3+1] = -5;
      if (pos[i3+1] < -5)  pos[i3+1] = 5;
      if (pos[i3+2] > 3)   pos[i3+2] = -3;
      if (pos[i3+2] < -3)  pos[i3+2] = 3;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    let lineIdx = 0;
    const lp = linesRef.current.geometry.attributes.position.array as Float32Array;
    const lc = linesRef.current.geometry.attributes.color.array as Float32Array;

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

          // Fade out based on distance
          const alpha = (1.0 - Math.sqrt(d2) / connectionDist) * 0.8;
          let r, g, b;
          if (isLight) {
            // Fade to moonwhite bg (#F5F3ED)
            r = themeColor.r * alpha + 0.96 * (1 - alpha);
            g = themeColor.g * alpha + 0.95 * (1 - alpha);
            b = themeColor.b * alpha + 0.93 * (1 - alpha);
          } else {
            r = themeColor.r * alpha;
            g = themeColor.g * alpha;
            b = themeColor.b * alpha;
          }
          lc[li] = r; lc[li+1] = g; lc[li+2] = b;
          lc[li+3] = r; lc[li+4] = g; lc[li+5] = b;
          
          lineIdx++;
        }
      }
    }
    // Zero out unused lines
    for (let k = lineIdx * 6; k < maxLines * 6; k++) {
      lp[k] = 0; lc[k] = 0;
    }
    
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIdx * 2);

    // Mouse parallax
    groupRef.current.position.x += (mouseRef.current.x * 0.2 - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (mouseRef.current.y * 0.15 - groupRef.current.position.y) * 0.03;

    const pMat = pointsRef.current.material as THREE.PointsMaterial;
    const lMat = linesRef.current.material as THREE.LineBasicMaterial;
    const targetOp = gitaForeground ? 0.08 : 0.45;
    const targetLineOp = gitaForeground ? 0.05 : 0.25;
    
    pMat.opacity += (targetOp - pMat.opacity) * 0.04;
    lMat.opacity += (targetLineOp - lMat.opacity) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={count} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          map={particleTexture}
          size={0.15}
          color={colors.particle}
          transparent
          opacity={isLight ? 0.8 : 0.45}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={maxLines * 2} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} count={maxLines * 2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial 
          vertexColors 
          transparent 
          opacity={isLight ? 0.4 : 0.25} 
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </lineSegments>
    </group>
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
  active?: boolean;
}

export default function HeroScene({ gitaForeground = false, theme = 'obsidian', active = true }: HeroSceneProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
      >
        <GitaText gitaForeground={gitaForeground} theme={theme} />
        <ParticleField gitaForeground={gitaForeground} theme={theme} />
      </Canvas>
    </div>
  );
}
