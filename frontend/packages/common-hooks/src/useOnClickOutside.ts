import { RefObject, useEffect } from 'react';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClickoutside: () => void,
) {
  useEffect(() => {
    function onClickEvent(event: MouseEvent) {
      const element = ref?.current;

      if (element && !element.contains(event.target as Node)) {
        onClickoutside();
      }
    }
    document.addEventListener('mousedown', onClickEvent);

    return () => document.removeEventListener('mousedown', onClickEvent);
  }, [onClickoutside, ref]);
}
