import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryParam<T = string>(
  name: string,
  defaultValue: T,
  dependencies: string[] = [],
): [T, (newValue: T) => void, () => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = useMemo(() => {
    try {
      return (
        (JSON.parse(decodeURI(searchParams.get(name) || '')) as T) ||
        defaultValue
      );
    } catch {
      return defaultValue;
    }
  }, [defaultValue, name, searchParams]);
  const onChangeValue = useCallback(
    (newValue: T) => {
      setSearchParams((previousParams) => {
        dependencies.forEach((dependence) => {
          previousParams.delete(dependence);
        });
        previousParams.set(name, encodeURI(JSON.stringify(newValue)));
        return previousParams.toString();
      });
    },
    [dependencies, name, setSearchParams],
  );
  const onRemoveValue = useCallback(() => {
    setSearchParams((previousParams) => {
      dependencies.forEach((dependence) => {
        previousParams.delete(dependence);
      });
      previousParams.delete(name);
      return previousParams.toString();
    });
  }, [dependencies, name, setSearchParams]);

  return [value, onChangeValue, onRemoveValue];
}
