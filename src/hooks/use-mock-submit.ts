import { useEffect, useRef, useState } from 'react';

/**
 * Simulates an async submit (no backend yet): flips `loading` for
 * `delayMs`, then runs the callback. The pending timer is cleared on
 * unmount so navigation can't fire on a dead screen.
 */
export function useMockSubmit(delayMs = 900) {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const run = (onDone: () => void) => {
    if (loading) return;
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      onDone();
    }, delayMs);
  };

  return { loading, run };
}
