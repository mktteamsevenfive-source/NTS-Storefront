import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {MockShopNotice} from '~/components/MockShopNotice';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sevenfive | Premium Commercial Kitchen Equipment'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collections.nodes[0] ?? null,
    categories: collections.nodes,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      {data.isShopLinked ? null : <MockShopNotice />}
      <HeroBanner collection={data.featuredCollection} />
      <CategoryGrid collections={data.categories} />
      <RecommendedProducts products={data.recommendedProducts} />
      <BrandTrust />
    </div>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────
function HeroBanner({
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
          alt={image.altText || 'Sevenfive'}
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

// ─── Category Grid ────────────────────────────────────────────────────────────
const FALLBACK_CATEGORIES = [
  {id: 'c1', title: 'Cooking Equipment', handle: 'cooking-equipment', image: null},
  {id: 'c2', title: 'Refrigeration', handle: 'refrigeration', image: null},
  {id: 'c3', title: 'Beverage Equipment', handle: 'beverage', image: null},
  {id: 'c4', title: 'Warewashing', handle: 'warewashing', image: null},
];

function CategoryGrid({
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

// ─── Brand Trust ──────────────────────────────────────────────────────────────
const BRAND_STATS = [
  {value: '20+', label: 'Years of Excellence'},
  {value: '50+', label: 'Premium Brands'},
  {value: '1,000+', label: 'Professional Clients'},
  {value: '24/7', label: 'After-Sales Support'},
];

function BrandTrust() {
  return (
    <section className="sf-trust">
      <div className="sf-trust__inner">
        <div className="sf-trust__text">
          <span className="sf-eyebrow sf-eyebrow--dark">Why Choose Sevenfive</span>
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

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="sf-products">
      <div className="sf-section-head">
        <span className="sf-eyebrow sf-eyebrow--dark">Our Selection</span>
        <h2 className="sf-section-title">Recommended Products</h2>
      </div>
      <Suspense fallback={<p className="sf-loading">Loading products…</p>}>
        <Await resolve={products}>
          {(response) => (
            <div className="sf-products__grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.handle}`}
                      className="sf-prod-card"
                      prefetch="intent"
                    >
                      <div className="sf-prod-card__media">
                        {product.featuredImage && (
                          <Image
                            data={product.featuredImage}
                            sizes="(min-width: 45em) 20vw, 50vw"
                            aspectRatio="4/3"
                            className="sf-prod-card__img"
                          />
                        )}
                      </div>
                      <div className="sf-prod-card__info">
                        <h3 className="sf-prod-card__title">{product.title}</h3>
                        <Money
                          className="sf-prod-card__price"
                          data={product.priceRange.minVariantPrice}
                        />
                      </div>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
