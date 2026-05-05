import {Suspense, useState, useRef, useEffect, useCallback} from 'react';
import {Await, NavLink, useAsyncValue, Link, useFetcher, useNavigate} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import ntsLogo from '~/assets/logo/NTS-logo.jpg';
import {getEmptyPredictiveSearchResult, urlWithTrackingParams, type PredictiveSearchReturn} from '~/lib/search';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="sf-header">
      {/* Top row: Logo + Search */}
      <div className="sf-header__top">
        <div className="sf-header__top-inner">
          <NavLink prefetch="intent" to="/" className="sf-header__logo" end>
            <img src={ntsLogo} alt={shop.name} className="sf-header__logo-img" />
          </NavLink>
          <HeaderSearch />
          {/* Mobile toggle */}
          <HeaderMenuMobileToggle />
        </div>
      </div>
      {/* Bottom row: Nav menu */}
      <div className="sf-header__nav-bar">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `sf-header__nav sf-header__nav--${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className="sf-header__nav-link"
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className={({isActive}) =>
              `sf-header__nav-link${isActive ? ' sf-header__nav-link--active' : ''}`
            }
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="sf-header__mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <span className="sf-header__hamburger" />
    </button>
  );
}

const POPULAR_SEARCHES = [
  'Commercial Oven',
  'Refrigerator',
  'Beverage Equipment',
  'Dishwasher',
  'Gas Range',
];

function HeaderSearch() {
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

  return (
    <div ref={wrapperRef} className="sf-search">
      <form className="sf-header__search-form" onSubmit={handleSubmit} role="search">
        <input
          ref={inputRef}
          type="search"
          name="q"
          placeholder="What are you looking for today?"
          className="sf-header__search-input"
          aria-label="Search"
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={fetchResults}
        />
        <button type="submit" className="sf-header__search-btn" aria-label="Submit search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
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
                  <p className="sf-search__col-title">POPULAR</p>
                  <Link to="/collections" className="sf-search__view-all" onClick={closeDropdown}>
                    VIEW ALL COLLECTIONS &rsaquo;
                  </Link>
                </div>
                {items.collections.length > 0 ? (
                  <div className="sf-search__collections-grid">
                    {items.collections.slice(0, 5).map((col) => {
                      const url = `/collections/${col.handle}`;
                      return (
                        <Link key={col.id} to={url} className="sf-search__col-card" onClick={closeDropdown}>
                          <div className="sf-search__col-img-wrap">
                            {col.image ? (
                              <Image alt={col.image.altText ?? col.title} src={col.image.url} width={220} height={280} className="sf-search__col-img" />
                            ) : (
                              <div className="sf-search__col-img-placeholder" />
                            )}
                          </div>
                          <span className="sf-search__col-name">{col.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="sf-search__collections-grid">
                    {['Cooking Equipment','Refrigeration','Beverage','Warewashing','Storage'].map((name) => (
                      <Link key={name} to={`/collections/${name.toLowerCase().replace(/ /g, '-')}`} className="sf-search__col-card" onClick={closeDropdown}>
                        <div className="sf-search__col-img-wrap sf-search__col-img-placeholder" />
                        <span className="sf-search__col-name">{name}</span>
                      </Link>
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

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/brand',
      resourceId: null,
      tags: [],
      title: 'Brand',
      type: 'HTTP',
      url: '/brands',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? '600' : undefined,
    color: isPending ? 'var(--sf-gold)' : 'var(--sf-black)',
  };
}
