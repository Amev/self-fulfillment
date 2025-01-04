import { RefObject, useCallback, useEffect, useState } from 'react';

export function useIsInViewport<T extends Element>(ref: RefObject<T | null>) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const onIntersectingChange = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      setIsIntersecting(entries[0].isIntersecting);
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersectingChange);
    const localRef = ref.current;

    if (localRef) {
      observer.observe(localRef);
      setIsIntersecting(observer.takeRecords()[0]?.isIntersecting || false);
    }

    return () => {
      if (localRef) {
        observer.unobserve(localRef);
      }
    };
  }, [onIntersectingChange, ref]);

  return isIntersecting;
}
