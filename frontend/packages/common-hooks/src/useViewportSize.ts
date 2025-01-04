import { useCallback, useEffect, useRef, useState } from 'react';

const SIZES = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': Number.MAX_SAFE_INTEGER,
} as const;

function unitsToSize(units: number) {
  const size = Object.values(SIZES).find(
    (maxValue: number) => units < maxValue,
  );

  return size!;
}

export function useViewportSize() {
  const bodyRef = useRef(document.querySelector('body'));
  const [currentSize, setCurrentSize] = useState(
    unitsToSize(
      Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
      ),
    ),
  );
  const onResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      entries.forEach((entry) => {
        const newSize = unitsToSize(entry.target.clientWidth);

        if (newSize !== currentSize) {
          setCurrentSize(newSize);
        }
      });
    },
    [currentSize],
  );

  useEffect(() => {
    const observer = new ResizeObserver(onResize);
    const ref = bodyRef.current;

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [onResize]);

  return currentSize;
}
