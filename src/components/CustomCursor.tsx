import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * A comet cursor: a bright glowing core with a short lagging trail — a shooting
 * star instead of a ring. Direct-DOM rAF loop (no per-frame React renders).
 * Disabled on touch / coarse pointers and under reduced motion.
 */
const N = 7;
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, .filter-btn, .project-card, .blog-card, .social-link, .skill-item, .carousel-arrow, .carousel-dot';

export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dots = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.documentElement.classList.add('comet-cursor-active');

    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const pos = Array.from({ length: N }, () => ({ x: cx, y: cy }));
    const target = { x: cx, y: cy };
    let hover = false;
    let raf = 0;

    const move = (e: PointerEvent) => { target.x = e.clientX; target.y = e.clientY; };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      hover = !!t?.closest?.(INTERACTIVE);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      pos[0].x += (target.x - pos[0].x) * 0.35;
      pos[0].y += (target.y - pos[0].y) * 0.35;
      for (let i = 1; i < N; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * 0.42;
        pos[i].y += (pos[i - 1].y - pos[i].y) * 0.42;
      }
      for (let i = 0; i < N; i++) {
        const el = dots.current[i];
        if (!el) continue;
        const taper = 1 - i / N;
        const scale = i === 0 ? (hover ? 2.3 : 1) : taper;
        el.style.transform = `translate(${pos[i].x}px, ${pos[i].y}px) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(i === 0 ? 1 : taper * 0.5);
      }
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.classList.remove('comet-cursor-active');
    };
  }, [reduce]);

  if (!enabled) return null;
  return (
    <>
      {Array.from({ length: N }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { dots.current[i] = el; }}
          className={`comet-dot${i === 0 ? ' comet-core' : ''}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
