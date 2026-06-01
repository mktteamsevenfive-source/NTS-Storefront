import {Suspense} from 'react';
import {Await, NavLink, Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import iconFacebook from '~/assets/social/facebook.png';
import iconIg from '~/assets/social/ig.png';
import iconLine from '~/assets/social/line.png';
import iconDbd from '~/assets/dbd/dbd.png';

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
                  <Link to="/pages/delivery-and-shipping-policy-nts" prefetch="intent" className="sf-footer__link">
                    Delivery and shipping policy
                  </Link>
                  <Link to="/pages/after-sales-service-nts" prefetch="intent" className="sf-footer__link">
                    After sales service
                  </Link>
                  <Link to="/pages/installation-policy-nts" prefetch="intent" className="sf-footer__link">
                    Installation policy
                  </Link>
                </nav>
              </div>

              {/* About Us */}
              <div className="sf-footer__col">
                <h4 className="sf-footer__col-title">About Us</h4>
                <nav className="sf-footer__links">
                  <Link to="/pages/who-we-are-nts" prefetch="intent" className="sf-footer__link">
                    Who we are
                  </Link>
                  <Link to="/pages/service-center-nts" prefetch="intent" className="sf-footer__link">
                    Service center
                  </Link>
                  <Link to="/pages/contact-us-nts" prefetch="intent" className="sf-footer__link">
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
                      href="https://www.instagram.com/nts.mart?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                      aria-label="Instagram"
                    >
                      <img src={iconIg} alt="Instagram" width="32" height="32" className="object-contain" />
                    </a>
                    <a
                      href="https://www.facebook.com/ntsmart.co.th"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                      aria-label="Facebook"
                    >
                      <img src={iconFacebook} alt="Facebook" width="32" height="32" className="object-contain" />
                    </a>
                    <a
                      href="https://page.line.me/lws7670q?oat_content=url&openQrModal=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                      aria-label="Line"
                    >
                      <img src={iconLine} alt="Line" width="32" height="32" className="object-contain" />
                    </a>
                  </div>
                  <div className="sf-footer__dbd">
                    <a
                      href="https://datawarehouse.dbd.go.th/company/profile/50105557179002"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img src={iconDbd} alt="DBD Registered" className="object-contain" style={{ width: '140px', height: 'auto', marginTop: '0.25rem', display: 'block', borderRadius: '4px' }} />
                    </a>
                  </div>
                </address>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="sf-footer__bottom">
              <p className="sf-footer__copy">
                &copy; {new Date().getFullYear()} NTS Mart Co., Ltd. All rights reserved.
              </p>
              <nav className="sf-footer__legal">
                <NavLink to="/policies/privacy-policy" className="sf-footer__legal-link">Privacy Policy</NavLink>
                <span className="sf-footer__legal-link" style={{cursor: 'default', textDecoration: 'none'}}>Terms of Service</span>
              </nav>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}
