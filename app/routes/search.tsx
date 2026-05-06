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

type FilterValue = {
  id: string;
  label: string;
  count: number;
  input: string;
};

type FilterGroup = {
  id: string;
  label: string;
  type: string;
  values: FilterValue[];
};

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

const SORT_OPTIONS = [
  {value: 'relevance',   label: 'Relevance'},
  {value: 'name-asc',   label: 'Product name A-Z'},
  {value: 'name-desc',  label: 'Product name Z-A'},
  {value: 'price-desc', label: 'Highest price'},
  {value: 'price-asc',  label: 'Lowest price'},
  {value: 'newest',     label: 'New arrivals'},
];

const PAGE_SIZE_OPTIONS = [12, 36, 64, 128];

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
          {SORT_OPTIONS.map((o) => (
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
  const data = useLoaderData<typeof loader>() as ExtendedRegularSearch & {type: string};
  if (data.type === 'predictive') return null;

  const {term, result, error, productFilters = []} = data;
  const total = result?.total ?? 0;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [filterOpen, setFilterOpen] = useState(false);

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

            <aside className={`sf-filter-sidebar${filterOpen ? ' sf-filter-sidebar--open' : ''}`}>
              <div className="sf-filter-sidebar__head">
                <span className="sf-filter-sidebar__title">Filters</span>
                {hasActiveFilters && (
                  <button className="sf-filter-clear-btn" onClick={clearAllFilters}>
                    Clear all
                  </button>
                )}
              </div>

              {/* Checkbox filter groups */}
              {nonPriceFilters.map((group) => {
                const isOpen = openGroups[group.id] !== false; // default open
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
                      <div className="sf-filter-group__body">
                        {group.values.map((val) => {
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

/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      sku
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
    $filters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: 10,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: 10,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: $sortKey,
      reverse: $reverse,
      types: [PRODUCT],
      unavailableProducts: HIDE,
      productFilters: $filters,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
      productFilters {
        id
        label
        type
        values {
          id
          label
          count
          input
        }
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Regular search fetcher
 */
const ALLOWED_VENDORS = [
  'NTS',
  'PRIMO',
  'ABSOLUTE',
  'Cutlery Pro',
  'Top Rinse',
  'Iwatani',
  'Justa',
  'Kitchin',
  'VEESAN',
];
const VENDOR_FILTER = `(${ALLOWED_VENDORS.map((v) => `vendor:"${v}"`).join(' OR ')})`;

async function regularSearch({
  request,
  context,
}: Pick<
  Route.LoaderArgs,
  'request' | 'context'
>): Promise<RegularSearchReturn> {
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
  const filteredTerm = term ? `${term} AND ${VENDOR_FILTER}` : VENDOR_FILTER;

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
      variables: {...variables, term: filteredTerm, filters: parsedFilters, sortKey, reverse},
    });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
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
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

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
  const filteredTerm = term ? `${term} AND ${VENDOR_FILTER}` : VENDOR_FILTER;
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {
    predictiveSearch: items,
    errors,
  }: PredictiveSearchQuery & {errors?: Array<{message: string}>} =
    await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term: filteredTerm,
      },
    });

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}: {message: string}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, item: Array<unknown>) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}
