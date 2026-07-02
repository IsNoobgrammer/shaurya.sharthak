import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * Animates a number from 0 → target when it scrolls into view, writing straight
 * to the DOM node (no per-frame React re-render — smooth and jank-free).
 * Preserves any non-numeric prefix/suffix, e.g. "155+" → 155 then "+", "~2×".
 */
export default function CountUp({
  value,
  duration = 1.4,
  className,
  style,
}: {
  value: string | number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();

  const match = String(value).match(/^(\D*)(\d[\d.]*)(.*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match?.[3] ?? '';
  const isInt = Number.isInteger(target);
  const format = (n: number) => `${prefix}${isInt ? Math.round(n) : n.toFixed(1)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (reduce) { el.textContent = format(target); return; }
    if (!inView) { el.textContent = format(0); return; }
    el.textContent = format(0);
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = format(v); },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, target, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {match ? format(reduce ? target : 0) : value}
    </span>
  );
}
