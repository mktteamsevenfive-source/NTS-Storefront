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
        <h1 className="sf-hero__title" style={{ fontSize: '3rem', maxWidth: '800px', margin: '0 auto', marginBottom: '1rem' }}>
          Your Trusted Commercial Kitchen<br />
          Solution Partner
        </h1>
        <p className="sf-hero__sub" style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', fontWeight: 400 }}>
          For over 15 years, food service professionals have trusted our<br />
          Commercial kitchen design and equipment expertise.
        </p>
      </div>
    </section>
  );
}
