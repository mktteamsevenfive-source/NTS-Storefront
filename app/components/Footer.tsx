import {Suspense} from 'react';
import {Await, NavLink, Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

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
              {/* Help & FAQ */}
              <div className="sf-footer__col">
                <h4 className="sf-footer__col-title">Help & FAQ</h4>
                <nav className="sf-footer__links">
                  <Link to="/pages/how-to-pay-nts" prefetch="intent" className="sf-footer__link">
                    How to pay
                  </Link>
                </nav>
              </div>

              {/* Service */}
              <div className="sf-footer__col">
                <h4 className="sf-footer__col-title">Service</h4>
                <nav className="sf-footer__links">
                  <Link to="/pages/warranty-policy-nts" prefetch="intent" className="sf-footer__link">
                    Warranty policy
                  </Link>
                  <Link to="/policies/shipping-policy" prefetch="intent" className="sf-footer__link">
                    Delivery and shipping policy
                  </Link>
                  <Link to="/pages/after-sales-service" prefetch="intent" className="sf-footer__link">
                    After sales service
                  </Link>
                  <Link to="/pages/installation-policy" prefetch="intent" className="sf-footer__link">
                    Installation policy
                  </Link>
                </nav>
              </div>

              {/* About Us */}
              <div className="sf-footer__col">
                <h4 className="sf-footer__col-title">About Us</h4>
                <nav className="sf-footer__links">
                  <Link to="/pages/who-we-are" prefetch="intent" className="sf-footer__link">
                    Who we are
                  </Link>
                  <Link to="/pages/service-center" prefetch="intent" className="sf-footer__link">
                    Service center
                  </Link>
                  <Link to="/pages/contact-us" prefetch="intent" className="sf-footer__link">
                    Contact us
                  </Link>
                </nav>
              </div>

              {/* Contact */}
              <div className="sf-footer__col">
                <h4 className="sf-footer__col-title">Contact Us</h4>
                <address className="sf-footer__address">
                  <a href="mailto:sales@ntsmart.co.th" className="sf-footer__link">
                    sales@ntsmart.co.th
                  </a>
                  <a href="tel:+6624237575" className="sf-footer__link">
                    02-423-7575 Ext 105
                  </a>
                  <a href="tel:+66661685275" className="sf-footer__link">
                    066-168-5275
                  </a>
                  <div className="sf-footer__social">
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
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sf-footer__social-link"
                      aria-label="Facebook"
                    >
                      FB
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


