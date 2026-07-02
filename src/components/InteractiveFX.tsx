import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Global, delegated pointer effects — mounted once.
 *  • [data-spotlight]  → sets --mx/--my (cursor position %) for a CSS sheen.
 *  • [data-tilt]       → 3D-tilts the element toward the cursor.
 * One rAF-throttled listener handles every opted-in card, so it stays cheap.
 * Disabled on coarse pointers and under reduced-motion.
 */
const MAX_TILT = 7; // degrees

export default function InteractiveFX() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let lastEvent: PointerEvent | null = null;

    const apply = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      const el = (e.target as HTMLElement | null)?.closest?.('[data-spotlight],[data-tilt]') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      if (el.hasAttribute('data-spotlight')) {
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      }
      if (el.hasAttribute('data-tilt')) {
        const rx = (0.5 - py) * MAX_TILT * 2;
        const ry = (px - 0.5) * MAX_TILT * 2;
        el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
        el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      }
    };

    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onOut = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('[data-tilt]') as HTMLElement | null;
      if (el && !el.contains(e.relatedTarget as Node)) {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      }
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return null;
}
