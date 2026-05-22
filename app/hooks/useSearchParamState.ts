/**
 * useSearchParamState
 *
 * A generic hook that syncs a URL search-param with a local change handler.
 * Navigation is debounce-free since all state lives in the URL.
 */
import {useSearchParams, useNavigate} from 'react-router';

interface UseSearchParamStateOptions {
  /** Params to delete when any value changes (pagination reset) */
  resetParams?: string[];
}

export function useSearchParamState(
  key: string,
  defaultValue: string,
  options: UseSearchParamStateOptions = {},
) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {resetParams = ['cursor', 'direction', 'page']} = options;

  const value = searchParams.get(key) ?? defaultValue;

  function setValue(newValue: string) {
    const p = new URLSearchParams(searchParams);
    p.set(key, newValue);
    resetParams.forEach((r) => p.delete(r));
    navigate(`?${p.toString()}`);
  }

  return [value, setValue] as const;
}
