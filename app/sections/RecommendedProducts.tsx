import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

export function RecommendedProducts({
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
                        {(product as any).vendor ? (
                          <p className="sf-prod-card__vendor">{(product as any).vendor}</p>
                        ) : null}
                        {(product as any).selectedOrFirstAvailableVariant?.sku ? (
                          <p className="sf-prod-card__sku">
                            {(product as any).selectedOrFirstAvailableVariant.sku}
                          </p>
                        ) : null}
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
