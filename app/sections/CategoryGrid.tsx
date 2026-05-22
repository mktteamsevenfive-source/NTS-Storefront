import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

const FALLBACK_CATEGORIES = [
  {id: 'c1', title: 'Cooking Equipment', handle: 'cooking-equipment', image: null},
  {id: 'c2', title: 'Refrigeration', handle: 'refrigeration', image: null},
  {id: 'c3', title: 'Beverage Equipment', handle: 'beverage', image: null},
  {id: 'c4', title: 'Warewashing', handle: 'warewashing', image: null},
];

export function CategoryGrid({
  collections,
}: {
  collections: FeaturedCollectionFragment[];
}) {
  const cats =
    collections.length > 0 ? collections.slice(0, 4) : FALLBACK_CATEGORIES;
  return (
    <section className="sf-categories">
      <div className="sf-section-head">
        <span className="sf-eyebrow sf-eyebrow--dark">Our Portfolio</span>
        <h2 className="sf-section-title">Product Categories</h2>
      </div>
      <div className="sf-categories__grid">
        {cats.map((cat) => (
          <Link
            key={cat.id}
            to={`/collections/${cat.handle}`}
            className="sf-cat-card"
            prefetch="intent"
          >
            <div className="sf-cat-card__media">
              {cat.image ? (
                <Image
                  data={cat.image}
                  sizes="(min-width: 45em) 25vw, 50vw"
                  className="sf-cat-card__img"
                />
              ) : (
                <div className="sf-cat-card__placeholder" />
              )}
            </div>
            <div className="sf-cat-card__info">
              <h3 className="sf-cat-card__title">{cat.title}</h3>
              <span className="sf-cat-card__cta">Shop Now →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
