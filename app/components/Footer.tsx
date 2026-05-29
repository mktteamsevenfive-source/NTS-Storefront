import { Suspense } from 'react';
import { Await, NavLink, Link } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
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
          <>
            {/* Green Pre-Footer Strip */}
            <div className="bg-[#00A859] py-10 text-white">
              <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 1 */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Let's Build Your<br/>Kitchen Success</h3>
                  <p className="text-sm text-green-100">
                    We provide complete solutions from planning to installation and after-sales service.
                  </p>
                </div>
                {/* 2 */}
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Talk to Expert</h4>
                    <p className="text-sm text-green-100 mb-2">Get professional advice from our specialists</p>
                    <a href="#" className="inline-flex text-sm hover:underline font-bold items-center gap-1">→</a>
                  </div>
                </div>
                {/* 3 */}
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Request Quotation</h4>
                    <p className="text-sm text-green-100 mb-2">Receive a personalized quote for your business</p>
                    <a href="#" className="inline-flex text-sm hover:underline font-bold items-center gap-1">→</a>
                  </div>
                </div>
                {/* 4 */}
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">LINE Official Account</h4>
                    <p className="text-sm text-green-100 mb-2">Chat with us on LINE for quick support</p>
                    <a href="#" className="inline-flex text-sm hover:underline font-bold items-center gap-1">→</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Main Footer */}
            <footer className="bg-[#111111] text-gray-400 py-16">
              <div className="max-w-[1440px] mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                  
                  {/* Brand Column */}
                  <div className="lg:col-span-1">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-[#1a1a1a] rounded flex items-center justify-center text-[#00A859] font-bold text-xl border border-gray-800">
                        NTS
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-6 max-w-xs">
                      Thailand's Professional Kitchen Equipment Supplier
                    </p>
                    <div className="flex gap-4">
                      <a href="#" className="text-gray-400 hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg></a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="lg:col-span-1">
                    <h4 className="text-white font-bold mb-6">PRODUCTS</h4>
                    <ul className="space-y-3 text-sm">
                      <li><Link to="/collections/food-preparation" className="hover:text-white transition-colors">Food Preparation</Link></li>
                      <li><Link to="/collections/cooking-equipment" className="hover:text-white transition-colors">Cooking Equipment</Link></li>
                      <li><Link to="/collections/refrigeration-equipment" className="hover:text-white transition-colors">Refrigeration & Freezing</Link></li>
                      <li><Link to="/collections/bakery-equipment" className="hover:text-white transition-colors">Bakery Equipment</Link></li>
                      <li><Link to="/collections/beverage-equipment" className="hover:text-white transition-colors">Beverage Equipment</Link></li>
                      <li><Link to="/collections/warewashing-sanitisation" className="hover:text-white transition-colors">Dishwashing Equipment</Link></li>
                      <li><Link to="/collections" className="hover:text-white transition-colors text-[#00A859]">View all categories ›</Link></li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div className="lg:col-span-1">
                    <h4 className="text-white font-bold mb-6">SUPPORT</h4>
                    <ul className="space-y-3 text-sm">
                      <li><Link to="/pages/service-center-nts" className="hover:text-white transition-colors">Service Center</Link></li>
                      <li><Link to="/pages/warranty-policy-nts" className="hover:text-white transition-colors">Warranty Policy</Link></li>
                      <li><Link to="/pages/delivery-and-shipping-policy-nts" className="hover:text-white transition-colors">Delivery & Shipping</Link></li>
                      <li><Link to="/pages/installation-policy-nts" className="hover:text-white transition-colors">Installation Service</Link></li>
                      <li><Link to="/pages/spare-parts" className="hover:text-white transition-colors">Spare Parts</Link></li>
                    </ul>
                  </div>

                  {/* Company */}
                  <div className="lg:col-span-1">
                    <h4 className="text-white font-bold mb-6">COMPANY</h4>
                    <ul className="space-y-3 text-sm">
                      <li><Link to="/pages/who-we-are-nts" className="hover:text-white transition-colors">About Us</Link></li>
                      <li><Link to="/pages/projects" className="hover:text-white transition-colors">Projects</Link></li>
                      <li><Link to="/brands" className="hover:text-white transition-colors">Brands</Link></li>
                      <li><Link to="/pages/careers" className="hover:text-white transition-colors">Careers</Link></li>
                      <li><Link to="/pages/contact-us-nts" className="hover:text-white transition-colors">Contact Us</Link></li>
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="lg:col-span-1">
                    <h4 className="text-white font-bold mb-6">CONTACT US</h4>
                    <ul className="space-y-4 text-sm">
                      <li className="flex gap-3">
                        <svg className="shrink-0 text-gray-500 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <a href="tel:02-423-7575" className="hover:text-white transition-colors">02-423-7575</a>
                      </li>
                      <li className="flex gap-3">
                        <svg className="shrink-0 text-gray-500 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <a href="mailto:sales@ntsmart.co.th" className="hover:text-white transition-colors break-all">sales@ntsmart.co.th</a>
                      </li>
                      <li className="flex gap-3">
                        <svg className="shrink-0 text-gray-500 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>73/5 Soi Pattanakan 53, Pattanakan Rd., Suan Luang, Bangkok 10250</span>
                      </li>
                      <li className="flex gap-3 items-center text-[#00A859] font-bold mt-2">
                        <div className="w-5 h-5 bg-[#00A859] rounded flex items-center justify-center text-[#111] text-[10px]">L</div>
                        @ntsmart
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Trust Badges bottom row */}
                <div className="border-t border-gray-800 py-8 mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-[#00A859]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    <div>
                      <h5 className="text-white text-xs font-bold">Authorized Distributor</h5>
                      <p className="text-[10px]">100% genuine products</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-[#00A859]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    <div>
                      <h5 className="text-white text-xs font-bold">Genuine Spare Parts</h5>
                      <p className="text-[10px]">Quality parts you can trust</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-[#00A859]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <div>
                      <h5 className="text-white text-xs font-bold">Nationwide Service</h5>
                      <p className="text-[10px]">Service center across Thailand</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-[#00A859]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    <div>
                      <h5 className="text-white text-xs font-bold">Professional Installation</h5>
                      <p className="text-[10px]">Experienced installation team</p>
                    </div>
                  </div>
                </div>

                {/* Bottom line */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                  <p>&copy; {new Date().getFullYear()} NTS Mart Co., Ltd. All rights reserved.</p>
                  <div className="flex gap-6">
                    <Link to="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/policies/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </Await>
    </Suspense>
  );
}


