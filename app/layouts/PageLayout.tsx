import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {LanguageSwitcher} from '~/components/Header/LanguageSwitcher';
import {BrandTrust} from '~/sections/BrandTrust';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {getT} from '~/lib/locale';
import type {LangCode, T} from '~/lib/locale';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  lang?: LangCode;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  lang = 'EN',
}: PageLayoutProps) {
  const t = getT(lang);
  return (
    <Aside.Provider>
      <CartAside cart={cart} t={t} />
      <SearchAside t={t} />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} lang={lang} t={t} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
          lang={lang}
        />
      )}
      <main>{children}</main>
      <BrandTrust lang={lang} />
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart, t}: {cart: PageLayoutProps['cart']; t: T}) {
  return (
    <Aside type="cart" heading={t.cart}>
      <Suspense fallback={<p>{t.loading}</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside({t}: {t: T}) {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading={t.search}>
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder={t.search_placeholder}
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>{t.search}</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive t={t}>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} t={t} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                  t={t}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                  t={t}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                  t={t}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                  t={t}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      {t.view_all_results} <q>{term.current}</q>
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
  lang = 'EN',
  t,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
  lang?: LangCode;
  t: T;
}) {
  const availableHandles = new Set(
    (header.collections?.nodes ?? [])
      .filter((c) => c.products.nodes.length > 0)
      .map((c) => c.handle),
  );

  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading={t.menu}>
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
          availableHandles={availableHandles}
          lang={lang}
        />
        <div style={{ padding: '24px 16px', borderTop: '1px solid #e5e7eb', marginTop: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.05em' }}>LANGUAGE / ภาษา</p>
          <LanguageSwitcher lang={lang} />
        </div>
      </Aside>
    )
  );
}
