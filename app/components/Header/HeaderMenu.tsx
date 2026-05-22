import {useState, useEffect} from 'react';
import {NavLink, Link, useFetcher} from 'react-router';
import {useAside} from '~/components/Aside';
import {NTS_MENU_TREE, type CsvMenuNode} from '~/lib/menu';
import {type Viewport, type RecommendedProduct} from '~/types';
import type {HeaderQuery} from 'storefrontapi.generated';

interface HeaderProps {
  header: HeaderQuery;
  publicStoreDomain: string;
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

  function filterChildren(nodes: CsvMenuNode[]): CsvMenuNode[] {
    if (!availableHandles) return nodes;
    return nodes
      .map((node) => ({
        ...node,
        children: filterChildren(node.children),
      }))
      .filter((node) => {
        const handle = getHandle(node.url);
        if (!handle) return true;
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
