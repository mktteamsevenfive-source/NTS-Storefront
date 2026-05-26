import {useState} from 'react';
import {useLoaderData, useSearchParams, useNavigate} from 'react-router';
import type {Route} from './+types/search';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';
import type {
  RegularSearchQuery,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';

import {
  type FilterValue,
  type FilterGroup,
} from '~/types';
import {SEARCH_SORT_OPTIONS, PAGE_SIZE_OPTIONS} from '~/utils/sort';
import {VENDOR_FILTER, ALLOWED_VENDORS} from '~/utils/vendors';
import {SEARCH_QUERY, PREDICTIVE_SEARCH_QUERY} from '~/graphql/queries/search';

type ExtendedRegularSearch = RegularSearchReturn & {
  productFilters: FilterGroup[];
};

export const meta: Route.MetaFunction = () => {
  return [{title: `Hydrogen | Search`}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  if (isPredictive) {
    const p = predictiveSearch({request, context});
    p.catch(console.error);
    return await p;
  }
  const p = regularSearch({request, context});
  p.catch(console.error);
  return await p;
}

function SortShowToolbar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentSort = searchParams.get('sort') ?? 'relevance';
  const currentShow = searchParams.get('show') ?? '12';

  function changeParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams);
    p.set(key, value);
    p.delete('cursor');
    p.delete('direction');
    p.delete('page');
    navigate(`?${p.toString()}`);
  }

  return (
    <div className="sf-sort-toolbar">
      <div className="sf-sort-toolbar__group">
        <label className="sf-sort-toolbar__label" htmlFor="sf-sort-select">Sort By</label>
        <select
          id="sf-sort-select"
          className="sf-sort-toolbar__select"
          value={currentSort}
          onChange={(e) => changeParam('sort', e.target.value)}
        >
          {SEARCH_SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="sf-sort-toolbar__group">
        <label className="sf-sort-toolbar__label" htmlFor="sf-show-select">Show</label>
        <select
          id="sf-show-select"
          className="sf-sort-toolbar__select"
          value={currentShow}
          onChange={(e) => changeParam('show', e.target.value)}
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={String(n)}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
  const data = useLoaderData<typeof loader>() as (ExtendedRegularSearch | PredictiveSearchReturn) & {type: string};
  if (data.type === 'predictive') return null;

  const {term, result, error, productFilters = []} = data as ExtendedRegularSearch;
  const total = result?.total ?? 0;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState<Record<string, string>>({});

  const activeFilters = searchParams.getAll('filters');
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';

  function toggleFilter(input: string) {
    const current = searchParams.getAll('filters');
    const next = current.includes(input)
      ? current.filter((f) => f !== input)
      : [...current, input];
    const p = new URLSearchParams(searchParams);
    p.delete('filters');
    next.forEach((f) => p.append('filters', f));
    // reset pagination
    p.delete('cursor');
    navigate(`?${p.toString()}`);
  }

  function applyPrice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const min = (form.elements.namedItem('minPrice') as HTMLInputElement).value;
    const max = (form.elements.namedItem('maxPrice') as HTMLInputElement).value;
    const p = new URLSearchParams(searchParams);
    if (min) p.set('minPrice', min); else p.delete('minPrice');
    if (max) p.set('maxPrice', max); else p.delete('maxPrice');
    p.delete('cursor');
    navigate(`?${p.toString()}`);
  }

  function clearAllFilters() {
    const p = new URLSearchParams();
    if (term) p.set('q', term);
    navigate(`?${p.toString()}`);
  }

  const hasActiveFilters = activeFilters.length > 0 || minPrice || maxPrice;

  // Inject price filter group if not already present
  const priceGroup: FilterGroup | null =
    productFilters.find((g) => g.type === 'PRICE_RANGE') ?? null;
  const nonPriceFilters = productFilters.filter((g) => g.type !== 'PRICE_RANGE');

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({...prev, [id]: !prev[id]}));

  return (
    <div className="sf-search-page">
      {/* Header bar */}
      <div className="sf-search-page__header">
        {term ? (
          <>
            <span className="sf-search-page__label">Search results for</span>
            <span className="sf-search-page__term">&ldquo;{term}&rdquo;</span>
            {total > 0 && (
              <span className="sf-search-page__count">
                {total} product{total !== 1 ? 's' : ''}
              </span>
            )}
          </>
        ) : (
          <span className="sf-search-page__label">Enter a search term above</span>
        )}
      </div>

      {error && <div className="sf-search-page__error">{error}</div>}

      <div className="sf-search-layout">
        {/* Filter column */}
        {productFilters.length > 0 && (
          <div className="sf-filter-col">
            <button
              className="sf-filter-toggle-btn"
              onClick={() => setFilterOpen((v) => !v)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              Filters
              {hasActiveFilters && <span className="sf-filter-toggle-btn__dot" />}
            </button>

            <div 
              className={`sf-filter-backdrop${filterOpen ? ' sf-filter-backdrop--open' : ''}`}
              onClick={() => setFilterOpen(false)}
              aria-hidden="true"
            />

            <aside className={`sf-filter-sidebar${filterOpen ? ' sf-filter-sidebar--open' : ''}`}>
              <div className="sf-filter-sidebar__head">
                <span className="sf-filter-sidebar__title">Filters</span>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button className="sf-filter-clear-btn" onClick={clearAllFilters}>
                      Clear all
                    </button>
                  )}
                  <button 
                    className="sf-filter-close-btn flex items-center justify-center p-1 text-gray-500 hover:text-gray-700" 
                    onClick={() => setFilterOpen(false)}
                    aria-label="Close filters"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="sf-filter-sidebar__content">

              {/* Checkbox filter groups */}
              {nonPriceFilters.map((group) => {
                const isBrandGroup = group.id === 'filter.p.vendor' || group.label.toLowerCase() === 'brand' || group.label.toLowerCase() === 'แบรนด์';
                let groupValues = group.values;
                if (isBrandGroup) {
                  groupValues = groupValues.filter(val => ALLOWED_VENDORS.includes(val.label as any));
                }
                if (groupValues.length === 0) return null;

                const isOpen = openGroups[group.id] !== false; // default open
                const isLarge = groupValues.length > 8;
                const query = (filterSearch[group.id] ?? '').toLowerCase();
                const filteredValues = groupValues.filter((val) =>
                  val.label.toLowerCase().includes(query),
                );

                return (
                  <div key={group.id} className="sf-filter-group">
                    <button
                      className="sf-filter-group__head"
                      onClick={() => toggleGroup(group.id)}
                    >
                      <span>{group.label}</span>
                      <svg
                        className={`sf-filter-group__chevron${isOpen ? ' sf-filter-group__chevron--open' : ''}`}
                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="flex flex-col">
                        {isLarge && (
                          <div className="px-4 pt-2">
                            <input
                              type="text"
                              placeholder="Search..."
                              value={filterSearch[group.id] ?? ''}
                              onChange={(e) =>
                                setFilterSearch((prev) => ({
                                  ...prev,
                                  [group.id]: e.target.value,
                                }))
                              }
                              className="sf-filter-search-input"
                            />
                          </div>
                        )}
                        <div
                          className={`sf-filter-group__body${
                            isLarge ? ' sf-filter-group__body--scrollable' : ''
                          }`}
                        >
                          {filteredValues.map((val) => {
                            const isChecked = activeFilters.includes(val.input);
                            return (
                              <label key={val.id} className="sf-filter-option">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleFilter(val.input)}
                                  className="sf-filter-option__checkbox"
                                />
                                <span className="sf-filter-option__label">{val.label}</span>
                                <span className="sf-filter-option__count">{val.count}</span>
                              </label>
                            );
                          })}
                          {filteredValues.length === 0 && (
                            <span className="text-xs text-gray-400 py-2">No results</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Price range */}
              {priceGroup && (
                <div className="sf-filter-group">
                  <button
                    className="sf-filter-group__head"
                    onClick={() => toggleGroup('price')}
                  >
                    <span>Price</span>
                    <svg
                      className={`sf-filter-group__chevron${openGroups['price'] !== false ? ' sf-filter-group__chevron--open' : ''}`}
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openGroups['price'] !== false && (
                    <div className="sf-filter-group__body">
                      <form onSubmit={applyPrice} className="sf-filter-price-form">
                        <div className="sf-filter-price-inputs">
                          <div className="sf-filter-price-input-wrap">
                            <span className="sf-filter-price-input-wrap__prefix">฿</span>
                            <input
                              name="minPrice"
                              type="number"
                              min="0"
                              placeholder="0"
                              defaultValue={minPrice}
                              className="sf-filter-price-input"
                            />
                          </div>
                          <span className="sf-filter-price-sep">to</span>
                          <div className="sf-filter-price-input-wrap">
                            <span className="sf-filter-price-input-wrap__prefix">฿</span>
                            <input
                              name="maxPrice"
                              type="number"
                              min="0"
                              placeholder="Any"
                              defaultValue={maxPrice}
                              className="sf-filter-price-input"
                            />
                          </div>
                        </div>
                        <button type="submit" className="sf-filter-price-apply">Apply</button>
                      </form>
                  </div>
                )}
              </div>
            )}
              </div>

              <div className="sf-filter-sidebar__footer">
                <button 
                  className="sf-filter-view-results-btn"
                  onClick={() => setFilterOpen(false)}
                >
                  View Results
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Results */}
        <div className="sf-search-results-area">
          {!term || !total ? (
            <SearchResults.Empty />
          ) : (
            <>
              <SortShowToolbar />
              <SearchResults result={result} term={term}>
                {({articles, pages, products, term}) => (
                  <div>
                    <SearchResults.Products products={products} term={term} total={total} />
                    <SearchResults.Pages pages={pages} term={term} />
                    <SearchResults.Articles articles={articles} term={term} />
                  </div>
                )}
              </SearchResults>
            </>
          )}
        </div>
      </div>

      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}



async function regularSearch({
  request,
  context,
}: Pick<
  Route.LoaderArgs,
  'request' | 'context'
>): Promise<ExtendedRegularSearch> {
  const {storefront} = context;
  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') ?? 'relevance';
  const pageSizeParam = Number(url.searchParams.get('show') ?? '12');
  const pageBy = [12, 36, 64, 128].includes(pageSizeParam) ? pageSizeParam : 12;
  const SORT_MAP: Record<string, {sortKey: string; reverse: boolean}> = {
    relevance:   {sortKey: 'RELEVANCE',    reverse: false},
    'name-asc':  {sortKey: 'RELEVANCE',    reverse: false},
    'name-desc': {sortKey: 'RELEVANCE',    reverse: false},
    'price-asc': {sortKey: 'PRICE',        reverse: false},
    'price-desc':{sortKey: 'PRICE',        reverse: true},
    newest:      {sortKey: 'RELEVANCE',    reverse: false},
    popular:     {sortKey: 'RELEVANCE',    reverse: false},
  };
  const {sortKey, reverse} = SORT_MAP[sortParam] ?? SORT_MAP['relevance'];
  const variables = getPaginationVariables(request, {pageBy});
  const term = String(url.searchParams.get('q') || '');
  // Build a query that matches the term in all fields (Shopify Storefront API does not support sku: field prefix, so we search cleanTerm or prefix cleanTerm*)
  const cleanTerm = term.trim();
  const termQuery = cleanTerm ? `(${cleanTerm} OR ${cleanTerm}*)` : '';
  const filteredTerm = termQuery ? `${termQuery} AND ${VENDOR_FILTER}` : VENDOR_FILTER;

  // Parse active filters from URL params
  const rawFilters = url.searchParams.getAll('filters');
  const parsedFilters = rawFilters
    .map((f) => { try { return JSON.parse(f); } catch { return null; } })
    .filter(Boolean);

  // Add price filter if present
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    parsedFilters.push({price: {min: minPrice ? Number(minPrice) : 0, max: maxPrice ? Number(maxPrice) : undefined}});
  }

  // Search articles, pages, and products for the `q` term
  const {
    errors,
    ...items
  }: {errors?: Array<{message: string}>} & RegularSearchQuery =
    await storefront.query(SEARCH_QUERY, {
      variables: {...variables, term: filteredTerm, filters: parsedFilters as any, sortKey: sortKey as any, reverse},
    });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  // Perform client-side SKU-prioritized sorting for search results
  if (items.products?.nodes) {
    const cleanTermLower = cleanTerm.toLowerCase();
    if (cleanTermLower) {
      const rankProduct = (product: any): number => {
        const title = (product.title || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        
        const skus: string[] = [];
        if (product.selectedOrFirstAvailableVariant?.sku) {
          skus.push(product.selectedOrFirstAvailableVariant.sku.toLowerCase());
        }
        const variants = product.variants?.nodes || [];
        variants.forEach((v: any) => {
          if (v.sku) {
            const s = v.sku.toLowerCase();
            if (!skus.includes(s)) skus.push(s);
          }
        });

        // Tier 1: Exact SKU match
        if (skus.some(sku => sku === cleanTermLower)) return 1;
        // Tier 2: SKU starts with search term
        if (skus.some(sku => sku.startsWith(cleanTermLower))) return 2;
        // Tier 3: SKU contains search term
        if (skus.some(sku => sku.includes(cleanTermLower))) return 3;
        // Tier 4: Title starts with search term
        if (title.startsWith(cleanTermLower)) return 4;
        // Tier 5: Title contains search term
        if (title.includes(cleanTermLower)) return 5;
        // Tier 6: Description contains search term
        if (description.includes(cleanTermLower)) return 6;
        return 7;
      };

      items.products.nodes = [...items.products.nodes].sort((a, b) => rankProduct(a) - rankProduct(b));
    }
  }

  const total = Object.values(items).reduce(
    (acc: number, {nodes}: {nodes: Array<unknown>}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}: {message: string}) => message).join(', ')
    : undefined;

  // Extract productFilters from the search result
  const productFilters: FilterGroup[] =
    ((items as any).products?.productFilters ?? []);

  return {type: 'regular' as const, term, error, result: {total, items}, productFilters};
}



/**
 * Predictive search fetcher
 */
async function predictiveSearch({
  request,
  context,
}: Pick<
  Route.ActionArgs,
  'request' | 'context'
>): Promise<PredictiveSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) {
    // Fetch a pool of products to shuffle and return as empty-state recommendations
    const regResult = await storefront.query(SEARCH_QUERY, {
      variables: {
        term: VENDOR_FILTER,
        first: 100,
      },
    }).catch((err) => {
      console.error('Loader error fetching prefix-1 recommended products:', err);
      return null;
    });

    const regProducts = regResult?.products?.nodes || [];

    // Filter for products that have a prefix-1 SKU and have an image
    const prefix1Products = regProducts.filter((product: any) => {
      const sku = product.selectedOrFirstAvailableVariant?.sku || '';
      const hasImage = !!product.selectedOrFirstAvailableVariant?.image?.url;
      const isPrefix1 = /^[A-Z]{3,4}1-/i.test(sku);
      return isPrefix1 && hasImage;
    });

    // Shuffle the filtered products
    const shuffledProducts = [...prefix1Products].sort(() => 0.5 - Math.random());

    // Slice to 5 recommended products
    const recommendedProducts = shuffledProducts.slice(0, 5);

    const finalItems = {
      articles: [],
      collections: [],
      pages: [],
      queries: [],
      products: recommendedProducts,
    };

    return {type, term, result: {items: finalItems, total: recommendedProducts.length}};
  }

  // Perform a parallel fetch:
  // 1. Predictive search query (to get articles, collections, pages, queries, and default products)
  // 2. Regular search query with a wider net (first: 50) specifically to capture SKU prefix matches that might be ranked poorly by Shopify's fuzzy default ranking.
  const cleanTerm = term.trim();
  const termQuery = cleanTerm ? `(${cleanTerm} OR ${cleanTerm}*)` : '';
  const filteredTerm = termQuery ? `${termQuery} AND ${VENDOR_FILTER}` : VENDOR_FILTER;

  const [predResult, regResult] = await Promise.all([
    storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        limit,
        limitScope: 'EACH',
        term,
      },
    }).catch((err) => {
      console.error('Predictive search API error:', err);
      return null;
    }),
    storefront.query(SEARCH_QUERY, {
      variables: {
        term: filteredTerm,
        first: 50,
      },
    }).catch((err) => {
      console.error('Regular search inside predictive API error:', err);
      return null;
    }),
  ]);

  const predItems = predResult?.predictiveSearch;
  const regProducts = regResult?.products?.nodes || [];

  // Merge and de-duplicate products from both queries by product ID
  const combinedProductsMap = new Map<string, any>();
  
  // First add products from regular search
  regProducts.forEach((product: any) => {
    if (product?.id) {
      combinedProductsMap.set(product.id, product);
    }
  });

  // Then add products from predictive search (which handles predictive-specific trackingParameters)
  const predProducts = predItems?.products || [];
  predProducts.forEach((product: any) => {
    if (product?.id) {
      const existing = combinedProductsMap.get(product.id);
      if (existing) {
        combinedProductsMap.set(product.id, { ...existing, ...product });
      } else {
        combinedProductsMap.set(product.id, product);
      }
    }
  });

  let mergedProducts = Array.from(combinedProductsMap.values());

  // Filter out any products that are not from allowed NTS vendors
  mergedProducts = mergedProducts.filter((product: any) => {
    if (!product.vendor) return true;
    return ALLOWED_VENDORS.some(
      (v) => v.toLowerCase() === product.vendor.toLowerCase()
    );
  });

  // Apply tier-based client-side sorting for perfect SKU priority ranking
  const cleanTermLower = cleanTerm.toLowerCase();
  if (cleanTermLower) {
    const rankProduct = (product: any): number => {
      const title = (product.title || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      
      const skus: string[] = [];
      if (product.selectedOrFirstAvailableVariant?.sku) {
        skus.push(product.selectedOrFirstAvailableVariant.sku.toLowerCase());
      }
      const variants = product.variants?.nodes || [];
      variants.forEach((v: any) => {
        if (v.sku) {
          const s = v.sku.toLowerCase();
          if (!skus.includes(s)) skus.push(s);
        }
      });

      // Tier 1: Exact SKU match
      if (skus.some(sku => sku === cleanTermLower)) return 1;
      // Tier 2: SKU starts with clean term
      if (skus.some(sku => sku.startsWith(cleanTermLower))) return 2;
      // Tier 3: SKU contains clean term
      if (skus.some(sku => sku.includes(cleanTermLower))) return 3;
      // Tier 4: Title starts with clean term
      if (title.startsWith(cleanTermLower)) return 4;
      // Tier 5: Title contains clean term
      if (title.includes(cleanTermLower)) return 5;
      // Tier 6: Description contains clean term
      if (description.includes(cleanTermLower)) return 6;
      return 7;
    };

    mergedProducts.sort((a, b) => rankProduct(a) - rankProduct(b));
  }

  // Slice back to the requested dropdown limit
  const finalProducts = mergedProducts.slice(0, limit);

  const finalItems = {
    articles: predItems?.articles || [],
    collections: predItems?.collections || [],
    pages: predItems?.pages || [],
    queries: predItems?.queries || [],
    products: finalProducts,
  };

  const total = Object.values(finalItems).reduce(
    (acc: number, item: Array<unknown>) => acc + (item?.length || 0),
    0,
  );

  return {type, term, result: {items: finalItems, total}};
}
