import {useState, useEffect} from 'react';
import {NavLink, Link, useFetcher} from 'react-router';
import {useAside} from '~/components/Aside';
import {NTS_MENU_TREE, type CsvMenuNode} from '~/lib/menu';
import {type Viewport, type RecommendedProduct} from '~/types';
import type {HeaderQuery} from 'storefrontapi.generated';
import {getT} from '~/lib/locale';
import type {LangCode, T} from '~/lib/locale';

interface HeaderProps {
  header: HeaderQuery;
  publicStoreDomain: string;
}

function getTrans(title: string, t: T): string {
  return t.categories?.[title as keyof typeof t.categories] || (t as any)[`menu_${title.toLowerCase().replace(/ /g, '_')}`] || title;
}

function MobileMenuItem({node, close, t, depth = 0}: {node: CsvMenuNode; close: () => void; t: T; depth?: number}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <div className={`sf-header__mobile-item sf-header__mobile-item--level-${depth}${isOpen ? ' sf-header__mobile-item--open' : ''}`}>
      <div className="sf-header__mobile-item-header">
        <NavLink
          className="sf-header__nav-link"
          end
          onClick={close}
          prefetch="intent"
          to={node.url}
        >
          {getTrans(node.title, t)}
        </NavLink>
        {hasChildren && (
          <button 
            className="sf-header__mobile-toggle" 
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
            aria-label="Toggle submenu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`sf-chevron ${isOpen ? 'sf-chevron--up' : 'sf-chevron--down'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        )}
      </div>
      {hasChildren && (
        <div className="sf-header__subnav-wrapper">
          <div className={`sf-header__subnav sf-header__subnav--level-${depth + 1}`} role="menu">
            {node.children.map((child) => (
              <MobileMenuItem key={child.id} node={child} close={close} t={t} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenuTree({nodes, close, t}: {nodes: CsvMenuNode[]; close: () => void; t: T}) {
  return (
    <>
      {nodes.map((node) => (
        <MobileMenuItem key={node.id} node={node} close={close} t={t} depth={0} />
      ))}
    </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  availableHandles,
  lang,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  availableHandles?: Set<string>;
  lang?: LangCode;
}) {
  const t = getT(lang || 'EN');
  const className = `sf-header__nav sf-header__nav--${viewport}`;
  const {close} = useAside();
  const [openMegaMenuId, setOpenMegaMenuId] = useState<string | null>(null);

  function getHandle(url: string): string {
    const m = url.match(/\/collections\/([^/?#]+)/);
    return m ? m[1] : '';
  }

  function filterChildren(nodes: CsvMenuNode[], parentTitle?: string): CsvMenuNode[] {
    if (!availableHandles) return nodes;
    return nodes
      .map((node) => ({
        ...node,
        children: filterChildren(node.children, node.title),
      }))
      .filter((node) => {
        // Never hide top-level menu items (level 1)
        if (node.level === 1) return true;

        const handle = getHandle(node.url);
        if (!handle) return true;

        // Always show sub menus under "Hotel Supplies"
        if (parentTitle === 'Hotel Supplies') return true;

        return availableHandles.has(handle) || node.children.length > 0;
      });
  }

  const menuItems = filterChildren(NTS_MENU_TREE);

  if (viewport === 'mobile') {
    return (
      <nav className={className} role="navigation">
        <MobileMenuTree nodes={menuItems} close={close} t={t} />
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
              {getTrans(item.title, t)}
            </NavLink>

            {hasMegaMenu && (
              <div
                className="sf-mega-menu"
                role="menu"
                onMouseEnter={() => setOpenMegaMenuId(item.id)}
                onMouseLeave={() => setOpenMegaMenuId(null)}
              >
                <MegaMenuContent item={item} close={close} t={t} />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function MegaMenuContent({item, close, t}: {item: CsvMenuNode; close: () => void; t: T}) {
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
              {getTrans(group.title, t)}
            </Link>
            {group.children.length > 0 && (
              <span className="sf-mega-menu__sidebar-arrow" aria-hidden="true">›</span>
            )}
          </div>
        ))}
      </div>

      <div className="sf-mega-menu__center">
        {activeGroup && (
          <>
            <p className="sf-mega-menu__center-title">{getTrans(activeGroup.title, t)}</p>
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
                    {getTrans(child.title, t)}
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
              View All {getTrans(activeGroup.title, t)} →
            </Link>
          </>
        )}
      </div>

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
