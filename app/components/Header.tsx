/**
 * Header component – thin orchestrator.
 * All sub-components live in ~/components/Header/*.
 */
import {NavLink} from 'react-router';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import ntsLogo from '~/assets/logo/NTS-logo.jpg';
import {getT} from '~/lib/locale';
import type {LangCode} from '~/lib/locale';
import {HeaderMenu} from '~/components/Header/HeaderMenu';
import {HeaderSearch} from '~/components/Header/HeaderSearch';
import {LanguageSwitcher} from '~/components/Header/LanguageSwitcher';
import {HeaderMenuMobileToggle} from '~/components/Header/MobileMenuToggle';

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
      {/* Top row: Logo + Search + Lang + Mobile toggle */}
      <div className="sf-header__top">
        <div className="sf-header__top-inner">
          <NavLink prefetch="intent" to="/" className="sf-header__logo" end>
            <img src={ntsLogo} alt={shop.name} className="sf-header__logo-img" />
          </NavLink>
          <HeaderSearch t={t} />
          <LanguageSwitcher lang={lang} />
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
