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

  function handleIconClick(e: React.MouseEvent<HTMLButtonElement>) {
    // On mobile, if search is closed, open the full-screen overlay instead of submitting
    if (typeof window !== 'undefined' && window.innerWidth <= 768 && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
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
    <div ref={wrapperRef} style={{width:'100%', position:'relative', display:'flex'}} className={isOpen ? 'is-open' : ''}>
      <form
        onSubmit={handleSubmit}
        role="search"
        style={{display:'flex', width:'100%', height:'44px', alignItems:'stretch', boxSizing:'border-box'}}
      >
        {/* ALL CATEGORIES button */}
        <button
          type="button"
          style={{display:'none', alignItems:'center', gap:'8px', backgroundColor:'#00A859', color:'white', padding:'0 16px', border:'1px solid #00A859', borderRadius:'6px 0 0 6px', cursor:'pointer', fontSize:'13px', fontWeight:700, whiteSpace:'nowrap', flexShrink:0, height:'44px', boxSizing:'border-box', lineHeight:'1'}}
          className="md:!flex"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          ALL CATEGORIES
        </button>

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          name="q"
          placeholder="Search for products, brands..."
          aria-label="Search"
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={fetchResults}
          style={{flex:'1 1 auto', minWidth:0, height:'44px', boxSizing:'border-box', border:'1px solid #d1d5db', borderLeft:'none', borderRight:'none', padding:'0 14px', fontSize:'14px', color:'#1a1a1a', outline:'none', background:'white', fontFamily:'inherit', borderRadius:0, appearance:'none', WebkitAppearance:'none', margin:0}}
        />

        {/* All Categories dropdown */}
        <div
          style={{display:'none', alignItems:'center', gap:'4px', height:'44px', boxSizing:'border-box', border:'1px solid #d1d5db', borderLeft:'none', borderRight:'none', padding:'0 12px', background:'white', color:'#6b7280', fontSize:'13px', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0}}
          className="md:!flex"
        >
          All Categories
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        {/* Search button */}
        <button
          type="submit"
          aria-label="Submit search"
          onClick={handleIconClick}
          style={{height:'44px', boxSizing:'border-box', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#00A859', border:'1px solid #00A859', borderRadius:'0 6px 6px 0', padding:'0 18px', cursor:'pointer', color:'white', flexShrink:0}}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {isOpen && (
          <button type="button" onClick={closeDropdown} aria-label="Close search"
            style={{position:'absolute', right:'56px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', zIndex:10, padding:'4px', display:'flex', alignItems:'center', justifyContent:'center'}}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
                      const compareAtPrice = product?.selectedOrFirstAvailableVariant?.compareAtPrice;
                      const image = product?.selectedOrFirstAvailableVariant?.image;
                      const sku = product?.selectedOrFirstAvailableVariant?.sku;
                      
                      const discountPercent =
                        compareAtPrice && price && parseFloat(compareAtPrice.amount) > parseFloat(price.amount)
                          ? Math.round((1 - parseFloat(price.amount) / parseFloat(compareAtPrice.amount)) * 100)
                          : null;

                      return (
                        <Link key={product.id} to={productUrl} className="sf-search__prod-card" onClick={closeDropdown}>
                          <div className="sf-search__prod-img-wrap" style={{position: 'relative'}}>
                            {image ? (
                              <Image alt={image.altText ?? product.title} src={image.url} width={1600} className="sf-search__prod-img" />
                            ) : (
                              <div className="sf-search__prod-img-placeholder" />
                            )}
                            {discountPercent && (
                              <span className="product-item__badge" style={{fontSize: '0.65rem', padding: '0.1rem 0.3rem', top: '0.4rem', left: '0.4rem'}}>
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                          <div className="product-item__price-row" style={{marginTop: '0.2rem'}}>
                            {price && <p className="sf-search__prod-price" style={{margin: 0}}><Money data={price} /></p>}
                            {compareAtPrice && discountPercent && (
                              <span className="product-item__compare-price" style={{fontSize: '0.75rem'}}>
                                <Money data={compareAtPrice} />
                              </span>
                            )}
                          </div>
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
                      const compareAtPrice = product?.selectedOrFirstAvailableVariant?.compareAtPrice;
                      const image = product?.selectedOrFirstAvailableVariant?.image;
                      const sku = product?.selectedOrFirstAvailableVariant?.sku;
                      
                      const discountPercent =
                        compareAtPrice && price && parseFloat(compareAtPrice.amount) > parseFloat(price.amount)
                          ? Math.round((1 - parseFloat(price.amount) / parseFloat(compareAtPrice.amount)) * 100)
                          : null;

                      return (
                        <Link key={product.id} to={productUrl} className="sf-search__prod-card" onClick={closeDropdown}>
                          <div className="sf-search__prod-img-wrap" style={{position: 'relative'}}>
                            {image ? (
                              <Image alt={image.altText ?? product.title} src={image.url} width={1600} className="sf-search__prod-img" />
                            ) : (
                              <div className="sf-search__prod-img-placeholder" />
                            )}
                            {discountPercent && (
                              <span className="product-item__badge" style={{fontSize: '0.65rem', padding: '0.1rem 0.3rem', top: '0.4rem', left: '0.4rem'}}>
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                          <div className="product-item__price-row" style={{marginTop: '0.2rem'}}>
                            {price && <p className="sf-search__prod-price" style={{margin: 0}}><Money data={price} /></p>}
                            {compareAtPrice && discountPercent && (
                              <span className="product-item__compare-price" style={{fontSize: '0.75rem'}}>
                                <Money data={compareAtPrice} />
                              </span>
                            )}
                          </div>
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
