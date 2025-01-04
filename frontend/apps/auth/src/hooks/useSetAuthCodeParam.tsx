import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function useSetAuthCodeParams(code = '') {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (code) {
      setSearchParams((searchParams) => {
        searchParams.set('code', code!);
        return searchParams.toString();
      });
    }
  }, [setSearchParams, code]);
}
