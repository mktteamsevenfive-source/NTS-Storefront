import {Suspense} from 'react';
import {Await, NavLink, Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import ntsLogo from '~/assets/logo/NTS-logo.jpg';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="sf-footer">
            <div className="sf-footer__top">
              {/* Brand Column */}
              <div className="sf-footer__brand">
                <Link to="/" className="sf-footer__logo">
                  <img src={ntsLogo} alt={header.shop.name} className="sf-footer__logo-img" />
                </Link>
                <p className="sf-footer__tagline">
                  Professional-grade commercial kitchen equipment for
                  Thailand's finest foodservice operators.
                </p>
                <div className="sf-footer__social">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-footer__social-link"
                    aria-label="Facebook"
                  >
                    FB
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-footer__social-link"
                    aria-label="Instagram"
                  >
                    IG
                  </a>
                  <a
                    href="https://line.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-footer__social-link"
                    aria-label="Line"
                  >
                    LINE
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="sf-footer__col">
                <h4 className="sf-footer__col-title">Quick Links</h4>
                {footer?.menu && header.shop.primaryDomain?.url && (
                  <FooterMenu
                    menu={footer.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                )}
              </div>

              {/* Categories */}
              <div className="sf-footer__col">
                <h4 className="sf-footer__col-title">Categories</h4>
                <nav className="sf-footer__links">
                  <Link to="/collections/cooking-equipment" prefetch="intent" className="sf-footer__link">Cooking Equipment</Link>
                  <Link to="/collections/refrigeration" prefetch="intent" className="sf-footer__link">Refrigeration</Link>
                  <Link to="/collections/beverage" prefetch="intent" className="sf-footer__link">Beverage Equipment</Link>
                  <Link to="/collections/warewashing" prefetch="intent" className="sf-footer__link">Warewashing</Link>
                  <Link to="/collections/spare-parts" prefetch="intent" className="sf-footer__link">Spare Parts</Link>
                </nav>
              </div>

              {/* Contact */}
              <div className="sf-footer__col">
                <h4 className="sf-footer__col-title">Contact Us</h4>
                <address className="sf-footer__address">
                  <p>Bangkok, Thailand</p>
                  <a href="tel:+6620000000" className="sf-footer__link">+66 2 000 0000</a>
                  <a href="mailto:info@sevenfive.co.th" className="sf-footer__link">
                    info@sevenfive.co.th
                  </a>
                  <p className="sf-footer__hours">
                    Mon – Fri: 8:00 – 17:30<br />
                    Sat: 8:00 – 12:00
                  </p>
                </address>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="sf-footer__bottom">
              <p className="sf-footer__copy">
                &copy; {new Date().getFullYear()} Sevenfive Co., Ltd. All rights reserved.
              </p>
              <nav className="sf-footer__legal">
                <NavLink to="/policies/privacy-policy" className="sf-footer__legal-link">Privacy Policy</NavLink>
                <NavLink to="/policies/terms-of-service" className="sf-footer__legal-link">Terms of Service</NavLink>
              </nav>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="sf-footer__links" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            href={url}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
            className="sf-footer__link"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            className="sf-footer__link"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};


