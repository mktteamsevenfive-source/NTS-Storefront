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

import iconFacebook from '~/assets/social/facebook.png';
import iconIg from '~/assets/social/ig.png';
import iconLine from '~/assets/social/line.png';
import iconLine2 from '~/assets/social/line_2.png';

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
      {/* Super Top Bar */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8 flex justify-between items-center h-[40px] text-[13px] text-gray-600">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              <span>{t.authorized_distributor}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              <span>{t.products_over_50000}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>{t.service_center}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span>{t.professional_installation}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:02-423-7575">02-423-7575</a>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:sales@ntsmart.co.th">sales@ntsmart.co.th</a>
            </div>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <a href="https://page.line.me/lws7670q?oat_content=url&openQrModal=true" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><img src={iconLine2} alt="Line" width="18" height="18" className="opacity-70 hover:opacity-100" /></a>
              <a href="https://www.facebook.com/ntsmart.co.th" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><img src={iconFacebook} alt="Facebook" width="18" height="18" className="opacity-70 hover:opacity-100" /></a>
              <a href="https://www.instagram.com/nts.mart?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><img src={iconIg} alt="Instagram" width="18" height="18" className="opacity-70 hover:opacity-100" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Top row: Logo + Search + CTAs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-3 lg:py-5 flex items-center justify-between gap-4 relative">
          <NavLink prefetch="intent" to="/" className="flex-shrink-0" end>
            <img src={ntsLogo} alt={shop.name} className="h-10 lg:h-16 w-auto object-contain" />
          </NavLink>
          
          {/* Desktop Search Bar (hidden on mobile) */}
          <div className="hidden lg:block flex-1 w-full max-w-4xl lg:mx-8">
            <HeaderSearch t={t} />
          </div>
          
          {/* Right actions container */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0 ml-auto">
            {/* Mobile/Tablet Search Button (hidden on desktop) */}
            <div className="lg:hidden">
              <HeaderSearch t={t} />
            </div>

            {/* Language Switcher for Desktop (hidden on mobile) */}
            <div className="hidden lg:block ml-2">
              <LanguageSwitcher lang={lang} />
            </div>

            {/* Language Switcher for Mobile/Tablet (hidden on desktop) */}
            <div className="lg:hidden">
              <LanguageSwitcher lang={lang} />
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <HeaderMenuMobileToggle />
          </div>
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
          lang={lang}
          collections={header.collections}
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
  const t = getT('EN');
  return (
    <button onClick={onClick} className="sf-header__cart-btn" aria-label={t.open_cart}>
      <div className="sf-header__cart-icon-wrap">
        {/* Shopping cart outline icon in NTS Green */}
        <svg
          width="22"
          height="22"
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
  const t = getT('EN');
  return (
    <NavLink to={to} className="sf-header__account-btn" prefetch="intent" aria-label={t.account}>
      {/* Account outline icon in NTS Green */}
      <svg
        width="22"
        height="22"
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
