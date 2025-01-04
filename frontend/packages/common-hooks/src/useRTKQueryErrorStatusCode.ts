import { useMemo } from 'react';

export function useRTKQueryErrorStatusCode(error: unknown) {
  return useMemo(() => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (typeof error.status === 'string' || typeof error.status === 'number')
    ) {
      return error.status;
    }

    return undefined;
  }, [error]);
}
