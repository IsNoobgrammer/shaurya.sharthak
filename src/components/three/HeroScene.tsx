import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Gita verse transliteration — all 8 lines
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

interface SceneProps {
  gitaForeground: boolean;
}

function Particles({ gitaForeground }: SceneProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [positions, count] = useMemo(() => {
    const n = 600;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return [pos, n];
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.03;
    meshRef.current.rotation.x = Math.sin(t * 0.025) * 0.04;
    meshRef.current.position.x += (mouseRef.current.x * 0.12 - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (mouseRef.current.y * 0.08 - meshRef.current.position.y) * 0.05;
    const mat = (meshRef.current.material as THREE.PointsMaterial);
    const targetOpacity = gitaForeground ? 0.15 : 0.5;
    mat.opacity += (targetOpacity - mat.opacity) * 0.04;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#A78BFA"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Sanskrit text planes — rendered as WebGL canvas textures
function GitaText({ gitaForeground }: SceneProps) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const initialYRef = useRef<number[]>([]);

  const textMeshes = useMemo(() => {
    return GITA_LINES.map((line, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 96;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 1024, 96);
      ctx.font = '600 30px Georgia, serif';
      ctx.fillStyle = 'rgba(200, 170, 255, 1.0)';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(167, 139, 250, 0.8)';
      ctx.shadowBlur = 12;
      ctx.fillText(line, 512, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.PlaneGeometry(7, 0.55);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
      });

      // Aesthetically placed: cascading diagonally from top-right to bottom-left
      const col = i % 2; // alternating left/right lean
      const x = col === 0 ? -1.2 : 1.2;
      const ySpread = viewport.height * 0.8;
      const y = ySpread * 0.45 - i * (ySpread / (GITA_LINES.length - 1));
      const z = -1.2 - (i % 3) * 0.4;

      return { geometry, material, x, y, z };
    });
  }, [viewport.height]);

  // Store initial Y positions for drift reset
  useEffect(() => {
    initialYRef.current = textMeshes.map((tm) => tm.y);
  }, [textMeshes]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;

      // Target opacity: bg mode = 0.25-0.45 pulse, fg mode = 0.75-0.95 pulse
      const base = gitaForeground ? 0.80 : 0.30;
      const amp  = gitaForeground ? 0.10 : 0.12;
      const targetOp = base + Math.sin(t * 0.18 + i * 0.9) * amp;
      mat.opacity += (targetOp - mat.opacity) * 0.03;

      // Very slow upward drift
      mesh.position.y += 0.00025;
      const initY = initialYRef.current[i] ?? 0;
      if (mesh.position.y > initY + viewport.height * 0.55) {
        mesh.position.y = initY - viewport.height * 0.2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {textMeshes.map((tm, i) => (
        <mesh
          key={i}
          geometry={tm.geometry}
          material={tm.material}
          position={[tm.x, tm.y, tm.z]}
        />
      ))}
    </group>
  );
}

interface HeroSceneProps {
  gitaForeground?: boolean;
}

export default function HeroScene({ gitaForeground = false }: HeroSceneProps) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <GitaText gitaForeground={gitaForeground} />
        <Particles gitaForeground={gitaForeground} />
      </Canvas>
    </div>
  );
}
