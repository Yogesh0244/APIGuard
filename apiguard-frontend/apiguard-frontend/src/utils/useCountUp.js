import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number counting up from its previous value to a new target
 * whenever `target` changes. Used on stat cards so the dashboard feels
 * alive rather than just swapping numbers instantly.
 */
export function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const numericTarget = Number(target) || 0;
    const startValue = startRef.current;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (numericTarget - startValue) * eased;
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        startRef.current = numericTarget;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
