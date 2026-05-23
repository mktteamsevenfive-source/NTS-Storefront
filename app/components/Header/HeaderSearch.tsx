import {useState, useRef, useEffect} from 'react';
import {useFetcher, useNavigate, Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {getEmptyPredictiveSearchResult, urlWithTrackingParams, type PredictiveSearchReturn} from '~/lib/search';
import type {T} from '~/lib/locale';

const POPULAR_SEARCHES = [
  'Commercial Oven',
  'Refrigerator',
  'Beverage Equipment',
  'Dishwasher',
  'Gas Range',
];

export function HeaderSearch({t}: {t: T}) {
  const [isOpen, setIsOpen] = useState(false);
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const term = useRef('');
  const navigate = useNavigate();

  const items = fetcher.data?.result?.items ?? getEmptyPredictiveSearchResult().items;
  const hasQuery = term.current.length > 0;

  function fetchResults(e: React.ChangeEvent<HTMLInputElement>) {
    term.current = e.target.value;
    fetcher.submit(
      {q: e.target.value, limit: 6, predictive: true},
      {method: 'GET', action: '/search'},
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value ?? '';
    setIsOpen(false);
    inputRef.current?.blur();
    void navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  function closeDropdown() {
    setIsOpen(false);
    term.current = '';
    if (inputRef.current) inputRef.current.value = '';
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch default prefix-1 recommendations when search is focused but query is empty
  useEffect(() => {
    if (isOpen && !term.current) {
      fetcher.submit(
        {q: '', limit: 5, predictive: true},
        {method: 'GET', action: '/search'},
      );
    }
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="sf-search">
      <form className="sf-header__search-form" onSubmit={handleSubmit} role="search">
        <button type="submit" className="sf-header__search-btn" aria-label="Submit search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="search"
          name="q"
          placeholder={t.search_placeholder}
          className="sf-header__search-input"
          aria-label="Search"
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={fetchResults}
        />
        {isOpen && (
          <button type="button" className="sf-header__search-close" onClick={closeDropdown} aria-label="Close search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </form>

      {isOpen && (
        <div className="sf-search__dropdown">
          {!hasQuery ? (
            /* ── Empty state ── */
            <div className="sf-search__layout">
              <div className="sf-search__left">
                <p className="sf-search__col-title">POPULAR SEARCHES</p>
                <div className="sf-search__pills">
                  {POPULAR_SEARCHES.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      className="sf-search__pill"
                      onClick={() => {
                        if (inputRef.current) inputRef.current.value = kw;
                        term.current = kw;
                        setIsOpen(false);
                        void navigate(`/search?q=${encodeURIComponent(kw)}`);
                      }}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sf-search__right">
                <div className="sf-search__right-head">
                  <p className="sf-search__col-title">RECOMMENDED PRODUCTS</p>
                  <Link to="/search" className="sf-search__view-all" onClick={closeDropdown}>
                    VIEW ALL PRODUCTS &rsaquo;
                  </Link>
                </div>
                {items.products.length > 0 ? (
                  <div className="sf-search__products-grid sf-search__collections-grid">
                    {items.products.slice(0, 5).map((product) => {
                      const productUrl = urlWithTrackingParams({
                        baseUrl: `/products/${product.handle}`,
                        trackingParams: product.trackingParameters,
                        term: '',
                      });
                      const price = product?.selectedOrFirstAvailableVariant?.price;
                      const image = product?.selectedOrFirstAvailableVariant?.image;
                      const sku = product?.selectedOrFirstAvailableVariant?.sku;
                      return (
                        <Link key={product.id} to={productUrl} className="sf-search__prod-card" onClick={closeDropdown}>
                          <div className="sf-search__prod-img-wrap">
                            {image ? (
                              <Image alt={image.altText ?? product.title} src={image.url} width={200} height={200} className="sf-search__prod-img" />
                            ) : (
                              <div className="sf-search__prod-img-placeholder" />
                            )}
                          </div>
                          {price && <p className="sf-search__prod-price"><Money data={price} /></p>}
                          {sku && <p className="sf-search__prod-sku">SKU: {sku}</p>}
                          <p className="sf-search__prod-title">{product.title}</p>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  /* Skeleton loading state while recommendations are fetched */
                  <div className="sf-search__products-grid sf-search__collections-grid">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div key={idx} className="sf-search__prod-card opacity-50">
                        <div className="sf-search__prod-img-wrap sf-search__prod-img-placeholder animate-pulse" />
                        <div style={{ height: '14px', width: '60px', background: 'var(--sf-gray-200)', borderRadius: '2px', marginBottom: '4px' }} className="animate-pulse" />
                        <div style={{ height: '12px', width: '80px', background: 'var(--sf-gray-200)', borderRadius: '2px', marginBottom: '4px' }} className="animate-pulse" />
                        <div style={{ height: '14px', width: '120px', background: 'var(--sf-gray-200)', borderRadius: '2px' }} className="animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Results state ── */
            <div className="sf-search__layout">
              <div className="sf-search__left">
                {items.collections.length > 0 && (
                  <>
                    <p className="sf-search__col-title">SUGGESTED COLLECTIONS ({items.collections.length})</p>
                    <div className="sf-search__pills">
                      {items.collections.map((col) => (
                        <Link
                          key={col.id}
                          to={`/collections/${col.handle}`}
                          className="sf-search__pill"
                          onClick={closeDropdown}
                        >
                          {col.title}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="sf-search__right">
                <div className="sf-search__right-head">
                  {items.products.length > 0 && (
                    <p className="sf-search__col-title">SUGGESTED ITEMS ({items.products.length})</p>
                  )}
                  <Link
                    to={`/search?q=${encodeURIComponent(term.current)}`}
                    className="sf-search__view-all"
                    onClick={closeDropdown}
                  >
                    VIEW ALL RESULTS &rsaquo;
                  </Link>
                </div>
                {items.products.length > 0 ? (
                  <div className="sf-search__products-grid">
                    {items.products.slice(0, 4).map((product) => {
                      const productUrl = urlWithTrackingParams({
                        baseUrl: `/products/${product.handle}`,
                        trackingParams: product.trackingParameters,
                        term: term.current,
                      });
                      const price = product?.selectedOrFirstAvailableVariant?.price;
                      const image = product?.selectedOrFirstAvailableVariant?.image;
                      const sku = product?.selectedOrFirstAvailableVariant?.sku;
                      return (
                        <Link key={product.id} to={productUrl} className="sf-search__prod-card" onClick={closeDropdown}>
                          <div className="sf-search__prod-img-wrap">
                            {image ? (
                              <Image alt={image.altText ?? product.title} src={image.url} width={200} height={200} className="sf-search__prod-img" />
                            ) : (
                              <div className="sf-search__prod-img-placeholder" />
                            )}
                          </div>
                          {price && <p className="sf-search__prod-price"><Money data={price} /></p>}
                          {sku && <p className="sf-search__prod-sku">SKU: {sku}</p>}
                          <p className="sf-search__prod-title">{product.title}</p>
                        </Link>
                      );
                    })}
                  </div>
                ) : fetcher.state === 'loading' ? (
                  <p className="sf-search__loading">Searching…</p>
                ) : (
                  <p className="sf-search__empty">No results for &ldquo;{term.current}&rdquo;</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
