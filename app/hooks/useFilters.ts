/**
 * useFilters
 *
 * Encapsulates URL-synced filter state used by both the Collection
 * and Search pages (checkbox filters + price range).
 */
import {useSearchParams, useNavigate} from 'react-router';

export interface UseFiltersReturn {
  activeFilters: string[];
  minPrice: string;
  maxPrice: string;
  hasActiveFilters: boolean;
  toggleFilter: (input: string) => void;
  applyPrice: (min: string, max: string) => void;
  clearFilters: () => void;
}

export function useFilters(): UseFiltersReturn {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeFilters = searchParams.getAll('filters');
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const hasActiveFilters = activeFilters.length > 0 || Boolean(minPrice) || Boolean(maxPrice);

  function buildBase() {
    const p = new URLSearchParams(searchParams);
    p.delete('cursor');
    p.delete('page');
    return p;
  }

  function toggleFilter(input: string) {
    const next = activeFilters.includes(input)
      ? activeFilters.filter((f) => f !== input)
      : [...activeFilters, input];
    const p = buildBase();
    p.delete('filters');
    next.forEach((f) => p.append('filters', f));
    navigate(`?${p.toString()}`);
  }

  function applyPrice(min: string, max: string) {
    const p = buildBase();
    if (min) p.set('minPrice', min);
    else p.delete('minPrice');
    if (max) p.set('maxPrice', max);
    else p.delete('maxPrice');
    navigate(`?${p.toString()}`);
  }

  function clearFilters() {
    const p = new URLSearchParams(searchParams);
    p.delete('filters');
    p.delete('minPrice');
    p.delete('maxPrice');
    p.delete('cursor');
    p.delete('page');
    navigate(`?${p.toString()}`);
  }

  return {
    activeFilters,
    minPrice,
    maxPrice,
    hasActiveFilters,
    toggleFilter,
    applyPrice,
    clearFilters,
  };
}
