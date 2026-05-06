import {useState} from 'react';
import {redirect, useLoaderData, useSearchParams, useNavigate, Link, useRouteLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics, Image, Money, Pagination} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getT} from '~/lib/locale';
import type {RootLoader} from '~/root';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `NTS | ${data?.collection.title ?? ''}`}];
};

type FilterValue = {id: string; label: string; count: number; input: string};
type FilterGroup = {id: string; label: string; type: string; values: FilterValue[]};

const SORT_OPTIONS = [
  {value: 'manual',      label: 'Featured'},
  {value: 'best-selling',label: 'Best selling'},
  {value: 'name-asc',    label: 'Product name A–Z'},
  {value: 'name-desc',   label: 'Product name Z–A'},
  {value: 'price-asc',   label: 'Lowest price'},
  {value: 'price-desc',  label: 'Highest price'},
  {value: 'newest',      label: 'New arrivals'},
];

const SORT_MAP: Record<string, {sortKey: string; reverse: boolean}> = {
  manual:        {sortKey: 'MANUAL',           reverse: false},
  'best-selling':{sortKey: 'BEST_SELLING',     reverse: false},
  'name-asc':    {sortKey: 'TITLE',            reverse: false},
  'name-desc':   {sortKey: 'TITLE',            reverse: true},
  'price-asc':   {sortKey: 'PRICE',            reverse: false},
  'price-desc':  {sortKey: 'PRICE',            reverse: true},
  newest:        {sortKey: 'CREATED',          reverse: true},
};

const PAGE_SIZE_OPTIONS = [12, 36, 64, 128];

const ALLOWED_VENDORS = [
  'NTS', 'PRIMO', 'ABSOLUTE', 'Cutlery Pro', 'Top Rinse', 'Iwatani', 'Justa', 'Kitchin', 'VEESAN',
];

export async function loader(args: Route.LoaderArgs) {
  return loadCriticalData(args);
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw redirect('/collections');

  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') ?? 'manual';
  const pageSizeParam = Number(url.searchParams.get('show') ?? '12');
  const pageBy = PAGE_SIZE_OPTIONS.includes(pageSizeParam) ? pageSizeParam : 12;
  const {sortKey, reverse} = SORT_MAP[sortParam] ?? SORT_MAP['manual'];
  const paginationVariables = getPaginationVariables(request, {pageBy});

  const rawFilters = url.searchParams.getAll('filters');
  const parsedFilters: Record<string, unknown>[] = rawFilters
    .map((f) => { try { return JSON.parse(f); } catch { return null; } })
    .filter(Boolean) as Record<string, unknown>[];

  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    parsedFilters.push({price: {min: minPrice ? Number(minPrice) : 0, max: maxPrice ? Number(maxPrice) : undefined}});
  }

  // Always restrict to allowed vendors (OR within vendor type, AND with user filters)
  const vendorFilters = ALLOWED_VENDORS.map((v) => ({productVendor: v}));
  const allFilters = [...vendorFilters, ...parsedFilters];

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        sortKey,
        reverse,
        filters: allFilters,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function SortShowToolbar() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const t = getT(rootData?.lang ?? 'EN');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentSort = searchParams.get('sort') ?? 'manual';
  const currentShow = searchParams.get('show') ?? '12';

  const SORT_OPTIONS_T = [
    {value: 'manual',       label: t.sort_featured},
    {value: 'best-selling', label: t.sort_best_selling},
    {value: 'name-asc',     label: t.sort_name_asc},
    {value: 'name-desc',    label: t.sort_name_desc},
    {value: 'price-asc',    label: t.sort_price_asc},
    {value: 'price-desc',   label: t.sort_price_desc},
    {value: 'newest',       label: t.sort_newest},
  ];

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
        <label className="sf-sort-toolbar__label" htmlFor="col-sort-select">{t.sort_by}</label>
        <select
          id="col-sort-select"
          className="sf-sort-toolbar__select"
          value={currentSort}
          onChange={(e) => changeParam('sort', e.target.value)}
        >
          {SORT_OPTIONS_T.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="sf-sort-toolbar__group">
        <label className="sf-sort-toolbar__label" htmlFor="col-show-select">{t.show}</label>
        <select
          id="col-show-select"
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

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const t = getT(rootData?.lang ?? 'EN');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [filterOpen, setFilterOpen] = useState(false);

  const products = collection.products;
  const productFilters: FilterGroup[] = (products as any).filters ?? [];
  const priceGroup = productFilters.find((g) => g.type === 'PRICE_RANGE') ?? null;
  const nonPriceFilters = productFilters.filter((g) => g.type !== 'PRICE_RANGE');

  const activeFilters = searchParams.getAll('filters');
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const hasActiveFilters = activeFilters.length > 0 || minPrice || maxPrice;
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1'));

  function toggleFilter(input: string) {
    const current = searchParams.getAll('filters');
    const next = current.includes(input)
      ? current.filter((f) => f !== input)
      : [...current, input];
    const p = new URLSearchParams(searchParams);
    p.delete('filters');
    next.forEach((f) => p.append('filters', f));
    p.delete('cursor');
    p.delete('page');
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
    p.delete('page');
    navigate(`?${p.toString()}`);
  }

  function clearAllFilters() {
    const p = new URLSearchParams();
    const sort = searchParams.get('sort');
    const show = searchParams.get('show');
    if (sort) p.set('sort', sort);
    if (show) p.set('show', show);
    navigate(`?${p.toString()}`);
  }

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({...prev, [id]: !prev[id]}));

  function withPage(url: string, page: number): string {
    if (/[?&]page=/.test(url)) {
      return url.replace(/([?&])page=\d+/, `$1page=${page}`);
    }
    return `${url}${url.includes('?') ? '&' : '?'}page=${page}`;
  }

  return (
    <div className="sf-search-page">
      <div className="sf-search-page__header">
        <span className="sf-search-page__term">{collection.title}</span>
        {products.nodes.length > 0 && (
          <span className="sf-search-page__count">{products.nodes.length} products</span>
        )}
      </div>

      <div className="sf-search-layout">
        {/* Filter column */}
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
              <span className="sf-filter-sidebar__title">{t.filters}</span>
              {hasActiveFilters && (
                <button className="sf-filter-clear-btn" onClick={clearAllFilters}>{t.clear_all}</button>
              )}
            </div>

            {nonPriceFilters.map((group) => {
              const isOpen = openGroups[group.id] !== false;
              return (
                <div key={group.id} className="sf-filter-group">
                  <button className="sf-filter-group__head" onClick={() => toggleGroup(group.id)}>
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
                      {group.values.map((val) => (
                        <label key={val.id} className="sf-filter-option">
                          <input
                            type="checkbox"
                            checked={activeFilters.includes(val.input)}
                            onChange={() => toggleFilter(val.input)}
                            className="sf-filter-option__checkbox"
                          />
                          <span className="sf-filter-option__label">{val.label}</span>
                          <span className="sf-filter-option__count">{val.count}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {priceGroup && (
              <div className="sf-filter-group">
                <button className="sf-filter-group__head" onClick={() => toggleGroup('price')}>
                  <span>{t.price}</span>
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
                          <input name="minPrice" type="number" min="0" placeholder="0" defaultValue={minPrice} className="sf-filter-price-input" />
                        </div>
                        <span className="sf-filter-price-sep">{t.to}</span>
                        <div className="sf-filter-price-input-wrap">
                          <span className="sf-filter-price-input-wrap__prefix">฿</span>
                          <input name="maxPrice" type="number" min="0" placeholder="Any" defaultValue={maxPrice} className="sf-filter-price-input" />
                        </div>
                      </div>
                      <button type="submit" className="sf-filter-price-apply">{t.apply}</button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* Products area */}
        <div className="sf-search-results-area">
          <SortShowToolbar />
          <Pagination connection={products}>
            {({nodes, hasPreviousPage, hasNextPage, nextPageUrl, previousPageUrl}) => {
              const prevUrl = hasPreviousPage ? withPage(previousPageUrl, currentPage - 1) : null;
              const nextUrl = hasNextPage ? withPage(nextPageUrl, currentPage + 1) : null;

              return (
                <div>
                  <div className="sf-search-product-grid">
                    {nodes.map((product) => {
                      const image = product.featuredImage;
                      const price = product.priceRange.minVariantPrice;
                      const sku = product.selectedOrFirstAvailableVariant?.sku;
                      return (
                        <Link
                          key={product.id}
                          to={`/products/${product.handle}`}
                          className="sf-search-product-card"
                          prefetch="intent"
                        >
                          <div className="sf-search-product-card__img-wrap">
                            {image ? (
                              <Image data={image} alt={product.title} width={240} height={240} className="sf-search-product-card__img" />
                            ) : (
                              <div className="sf-search-product-card__no-img">{t.no_image}</div>
                            )}
                          </div>
                          <div className="sf-search-product-card__body">
                            {product.vendor && (
                              <span className="sf-search-product-card__vendor">{product.vendor}</span>
                            )}
                            {sku && <span className="sf-search-product-card__sku">{sku}</span>}
                            <p className="sf-search-product-card__title">{product.title}</p>
                            <span className="sf-search-product-card__price">
                              <Money data={price} />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {(hasPreviousPage || hasNextPage) && (
                    <nav className="sf-paginator">
                      {prevUrl ? (
                        <Link to={prevUrl} className="sf-paginator__btn sf-paginator__btn--arrow">‹</Link>
                      ) : (
                        <span className="sf-paginator__btn sf-paginator__btn--arrow sf-paginator__btn--disabled">‹</span>
                      )}
                      {hasPreviousPage && prevUrl && (
                        <Link to={prevUrl} className="sf-paginator__btn">{currentPage - 1}</Link>
                      )}
                      <span className="sf-paginator__btn sf-paginator__btn--active">{currentPage}</span>
                      {hasNextPage && nextUrl && (
                        <Link to={nextUrl} className="sf-paginator__btn">{currentPage + 1}</Link>
                      )}
                      {nextUrl ? (
                        <Link to={nextUrl} className="sf-paginator__btn sf-paginator__btn--arrow">›</Link>
                      ) : (
                        <span className="sf-paginator__btn sf-paginator__btn--arrow sf-paginator__btn--disabled">›</span>
                      )}
                    </nav>
                  )}
                </div>
              );
            }}
          </Pagination>
        </div>
      </div>

      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment ColMoneyItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ColProductItem on Product {
    id
    handle
    title
    vendor
    featuredImage {
      id
      altText
      url
      width
      height
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      sku
    }
    priceRange {
      minVariantPrice {
        ...ColMoneyItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        nodes {
          ...ColProductItem
        }
        filters {
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
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
