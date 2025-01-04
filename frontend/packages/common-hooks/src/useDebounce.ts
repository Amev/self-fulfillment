import { useCallback, useState } from 'react';

export function useDebounce<T>(
  callback: (value: T) => void,
  timer: number = 200,
): (value: T) => void {
  const [timeoutID, setTimeoutID] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const debouncedFunction = useCallback(
    (value: T) => {
      if (timeoutID !== null) {
        clearTimeout(timeoutID);
      }

      setTimeoutID(setTimeout(() => callback(value), timer));
    },
    [setTimeoutID, callback, timer, timeoutID],
  );

  return debouncedFunction;
}
