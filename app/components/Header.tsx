/**
 * Header component – thin orchestrator.
 * All sub-components live in ~/components/Header/*.
 */
import {Suspense} from 'react';
import {NavLink, Await} from 'react-router';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import ntsLogo from '~/assets/logo/NTS-logo.jpg';
import {getT} from '~/lib/locale';
import type {LangCode} from '~/lib/locale';
import {HeaderMenu} from '~/components/Header/HeaderMenu';
import {HeaderSearch} from '~/components/Header/HeaderSearch';
import {LanguageSwitcher} from '~/components/Header/LanguageSwitcher';
import {HeaderMenuMobileToggle} from '~/components/Header/MobileMenuToggle';
import {useAside} from '~/components/Aside';

// Re-export for consumers that import from ~/components/Header
export {HeaderMenu} from '~/components/Header/HeaderMenu';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  lang?: LangCode;
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
      {/* Top row: Logo + Search + CTAs (Cart + Account + Lang) */}
      <div className="sf-header__top">
        <div className="sf-header__top-inner">
          <NavLink prefetch="intent" to="/" className="sf-header__logo" end>
            <img src={ntsLogo} alt={shop.name} className="sf-header__logo-img" />
          </NavLink>
          <HeaderSearch t={t} />
          
          <div className="sf-header__ctas">
            <HeaderCartToggle cart={cart} />
            <HeaderAccountToggle isLoggedIn={isLoggedIn} />
            <LanguageSwitcher lang={lang} />
          </div>

          <HeaderMenuMobileToggle />
        </div>
      </div>

      {/* Bottom row: Desktop nav */}
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

function HeaderCartToggle({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  const {open} = useAside();
  return (
    <Suspense fallback={<CartBadge count={0} onClick={() => open('cart')} />}>
      <Await resolve={cart}>
        {(resolvedCart) => {
          const count = resolvedCart?.totalQuantity ?? 0;
          return <CartBadge count={count} onClick={() => open('cart')} />;
        }}
      </Await>
    </Suspense>
  );
}

function CartBadge({count, onClick}: {count: number; onClick: () => void}) {
  return (
    <button onClick={onClick} className="sf-header__cart-btn" aria-label="Open cart">
      <div className="sf-header__cart-icon-wrap">
        {/* Shopping cart outline icon in NTS Green */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00b050"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" fill="#00b050" />
          <circle cx="20" cy="21" r="1" fill="#00b050" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && (
          <span className="sf-header__cart-count">
            {count}
          </span>
        )}
      </div>
    </button>
  );
}

function HeaderAccountToggle({isLoggedIn}: {isLoggedIn: Promise<boolean>}) {
  return (
    <Suspense fallback={<AccountLink to="/account" />}>
      <Await resolve={isLoggedIn}>
        {(isLoggedInVal) => (
          <AccountLink to={isLoggedInVal ? '/account' : '/account/login'} />
        )}
      </Await>
    </Suspense>
  );
}

function AccountLink({to}: {to: string}) {
  return (
    <NavLink to={to} className="sf-header__account-btn" prefetch="intent">
      {/* Account outline icon in NTS Green */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00b050"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </NavLink>
  );
}
