import {Link} from 'react-router';

const BRAND_STATS = [
  {value: '20+', label: 'Years of Excellence'},
  {value: '50+', label: 'Premium Brands'},
  {value: '1,000+', label: 'Professional Clients'},
  {value: '24/7', label: 'After-Sales Support'},
];

export function BrandTrust() {
  return (
    <section className="sf-trust">
      <div className="sf-trust__inner">
        <div className="sf-trust__text">
          <span className="sf-eyebrow sf-eyebrow--dark">Why Choose NTS Mart</span>
          <h2 className="sf-trust__title">
            Thailand's Most Trusted<br />
            Commercial Kitchen Partner
          </h2>
          <p className="sf-trust__desc">
            We partner with the world's leading manufacturers to bring
            professional-grade equipment to Thailand's most demanding
            foodservice operations. From boutique restaurants to five-star
            hotels — we deliver quality that performs.
          </p>
          <Link to="/pages/about" className="sf-btn sf-btn--outline-dark">
            Learn More
          </Link>
        </div>
        <div className="sf-trust__stats">
          {BRAND_STATS.map((s) => (
            <div key={s.label} className="sf-stat">
              <span className="sf-stat__val">{s.value}</span>
              <span className="sf-stat__lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
