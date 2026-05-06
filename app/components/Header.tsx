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
import {NTS_MENU_TREE, type CsvMenuNode} from '~/lib/menu';
import type {LangCode, T} from '~/lib/locale';
import {getT} from '~/lib/locale';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  lang?: LangCode;
}

type Viewport = 'desktop' | 'mobile';

function getViewAllUrl(item: CsvMenuNode) {
  if (item.title === 'Product') return '/collections/all';
  return item.url || '/';
}

function renderMobileMenuNodes(
  nodes: CsvMenuNode[],
  close: () => void,
  depth = 0,
) {
  return nodes.map((node) => (
    <div key={node.id} className={`sf-header__mobile-item sf-header__mobile-item--level-${depth}`}>
      <NavLink
        className="sf-header__nav-link"
        end
        onClick={close}
        prefetch="intent"
        to={node.url}
      >
        {node.title}
      </NavLink>
      {node.children.length > 0 ? (
        <div className={`sf-header__subnav sf-header__subnav--level-${depth + 1}`} role="menu">
          {renderMobileMenuNodes(node.children, close, depth + 1)}
        </div>
      ) : null}
    </div>
  ));
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
  lang = 'EN',
}: HeaderProps) {
  const {shop, menu} = header;
  const t = getT(lang);

  const availableHandles = new Set(
    (header.collections?.nodes ?? [])
      .filter((c) => c.products.nodes.length > 0)
      .map((c) => c.handle),
  );

  return (
    <header className="sf-header">
      {/* Top row: Logo + Search */}
      <div className="sf-header__top">
        <div className="sf-header__top-inner">
          <NavLink prefetch="intent" to="/" className="sf-header__logo" end>
            <img src={ntsLogo} alt={shop.name} className="sf-header__logo-img" />
          </NavLink>
          <HeaderSearch t={t} />
          <LanguageSwitcher lang={lang} />
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
          availableHandles={availableHandles}
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
  availableHandles,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  availableHandles?: Set<string>;
}) {
  const className = `sf-header__nav sf-header__nav--${viewport}`;
  const {close} = useAside();
  const [openMegaMenuId, setOpenMegaMenuId] = useState<string | null>(null);

  function getHandle(url: string): string {
    const m = url.match(/\/collections\/([^/?#]+)/);
    return m ? m[1] : '';
  }

  function isAvailable(url: string): boolean {
    if (!availableHandles) return true;
    const handle = getHandle(url);
    if (!handle) return true; // non-collection links always show
    return availableHandles.has(handle);
  }

  function filterChildren(nodes: CsvMenuNode[]): CsvMenuNode[] {
    if (!availableHandles) return nodes;
    return nodes
      .map((node) => ({
        ...node,
        children: filterChildren(node.children),
      }))
      .filter((node) => {
        // Non-collection nodes (pages, http) always show
        const handle = getHandle(node.url);
        if (!handle) return true;
        // Show if this collection has NTS products OR any filtered child exists
        return availableHandles.has(handle) || node.children.length > 0;
      });
  }

  const menuItems = filterChildren(NTS_MENU_TREE);

  if (viewport === 'mobile') {
    return (
      <nav className={className} role="navigation">
        {renderMobileMenuNodes(menuItems, close)}
      </nav>
    );
  }

  return (
    <nav className={className} role="navigation">
      {menuItems.map((item) => {
        const hasMegaMenu = item.children.length > 0;

        return (
          <div
            className={`sf-header__nav-item${hasMegaMenu ? ' sf-header__nav-item--has-mega' : ''}${openMegaMenuId === item.id ? ' sf-header__nav-item--mega-open' : ''}`}
            key={item.id}
            onMouseEnter={() => {
              if (hasMegaMenu) setOpenMegaMenuId(item.id);
            }}
            onMouseLeave={() => {
              if (hasMegaMenu) setOpenMegaMenuId(null);
            }}
          >
            <NavLink
              className={({isActive}) =>
                `sf-header__nav-link${isActive ? ' sf-header__nav-link--active' : ''}`
              }
              end
              onClick={close}
              prefetch="intent"
              to={item.url}
            >
              {item.title}
            </NavLink>

            {hasMegaMenu && (
              <div
                className="sf-mega-menu"
                role="menu"
                onMouseEnter={() => setOpenMegaMenuId(item.id)}
                onMouseLeave={() => setOpenMegaMenuId(null)}
              >
                <MegaMenuContent item={item} close={close} />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

type RecommendedProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {url: string; altText: string | null; width: number; height: number} | null;
  selectedOrFirstAvailableVariant?: {sku: string | null} | null;
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
};

function MegaMenuContent({item, close}: {item: CsvMenuNode; close: () => void}) {
  const [activeGroupId, setActiveGroupId] = useState<string>(item.children[0]?.id ?? '');
  const activeGroup = item.children.find((g) => g.id === activeGroupId) ?? item.children[0] ?? null;
  const fetcher = useFetcher<{collection?: {products?: {nodes?: RecommendedProduct[]}}}>();

  useEffect(() => {
    if (!activeGroup) return;
    const handle = activeGroup.url.match(/\/collections\/([^/?#]+)/)?.[1];
    if (handle) fetcher.load(`/collections/${handle}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroupId]);

  const recommended: RecommendedProduct[] = fetcher.data?.collection?.products?.nodes ?? [];

  return (
    <div className="sf-mega-menu__inner">
      {/* Left sidebar: category list */}
      <div className="sf-mega-menu__sidebar">
        {item.children.map((group) => (
          <div
            key={group.id}
            className={`sf-mega-menu__sidebar-item${group.id === activeGroup?.id ? ' sf-mega-menu__sidebar-item--active' : ''}`}
            onMouseEnter={() => setActiveGroupId(group.id)}
          >
            <Link
              to={group.url}
              className="sf-mega-menu__sidebar-link"
              onClick={close}
              prefetch="intent"
            >
              {group.title}
            </Link>
            {group.children.length > 0 && (
              <span className="sf-mega-menu__sidebar-arrow" aria-hidden="true">›</span>
            )}
          </div>
        ))}
      </div>

      {/* Center: subcategories of active group */}
      <div className="sf-mega-menu__center">
        {activeGroup && (
          <>
            <p className="sf-mega-menu__center-title">{activeGroup.title}</p>
            {activeGroup.children.length > 0 && (
              <div className="sf-mega-menu__center-grid">
                {activeGroup.children.map((child) => (
                  <Link
                    key={child.id}
                    to={child.url}
                    className="sf-mega-menu__center-link"
                    onClick={close}
                    prefetch="intent"
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
            <Link
              to={activeGroup.url}
              className="sf-mega-menu__view-all"
              onClick={close}
              prefetch="intent"
            >
              View all {activeGroup.title}
            </Link>
          </>
        )}
      </div>

      {/* Right: recommended products */}
      <div className="sf-mega-menu__recommended">
        <p className="sf-mega-menu__rec-label">RECOMMENDED</p>
        <p className="sf-mega-menu__rec-cat">{activeGroup?.title}</p>
        <div className="sf-mega-menu__rec-products">
          {recommended.slice(0, 2).map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="sf-mega-menu__rec-product"
              onClick={close}
              prefetch="intent"
            >
              {product.featuredImage ? (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  className="sf-mega-menu__rec-img"
                />
              ) : (
                <div className="sf-mega-menu__rec-img sf-mega-menu__rec-img--placeholder" />
              )}
              <p className="sf-mega-menu__rec-name">{product.title}</p>
              {product.selectedOrFirstAvailableVariant?.sku && (
                <p className="sf-mega-menu__rec-sku">SKU:{product.selectedOrFirstAvailableVariant.sku}</p>
              )}
              <p className="sf-mega-menu__rec-price">
                {product.priceRange.minVariantPrice.amount}{' '}
                {product.priceRange.minVariantPrice.currencyCode}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
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

function LanguageSwitcher({lang}: {lang: LangCode}) {
  return (
    <form method="post" action="/locale" className="sf-lang-switcher">
      <select
        name="lang"
        defaultValue={lang}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="sf-lang-switcher__select"
        aria-label="Select language"
      >
        <option value="EN">English</option>
        <option value="TH">ภาษาไทย</option>
      </select>
    </form>
  );
}

function HeaderSearch({t}: {t: T}) {
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
          placeholder={t.search_placeholder}
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
