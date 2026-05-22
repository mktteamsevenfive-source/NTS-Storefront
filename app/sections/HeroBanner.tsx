import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

export function HeroBanner({
  collection,
}: {
  collection: FeaturedCollectionFragment | null;
}) {
  const image = collection?.image;
  return (
    <section className="sf-hero">
      {image ? (
        <Image
          data={image}
          sizes="100vw"
          className="sf-hero__bg"
          alt={image.altText || 'NTS Mart'}
        />
      ) : (
        <div className="sf-hero__bg sf-hero__bg--fallback" />
      )}
      <div className="sf-hero__overlay" />
      <div className="sf-hero__content">
        <p className="sf-eyebrow">Premium Commercial Kitchen Equipment</p>
        <h1 className="sf-hero__title">
          Engineered for<br />
          Professional Excellence
        </h1>
        <p className="sf-hero__sub">
          Serving Thailand's finest restaurants, hotels,<br />
          and foodservice operators since 2003
        </p>
        <div className="sf-hero__ctas">
          <Link to="/collections/all" className="sf-btn sf-btn--gold">
            Explore Products
          </Link>
          <Link to="/pages/about" className="sf-btn sf-btn--ghost">
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
