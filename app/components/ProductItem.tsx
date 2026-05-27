import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ColProductItemFragment,
  RecommendedProductFragment,
  SearchProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | ColProductItemFragment
    | RecommendedProductFragment
    | SearchProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = 'featuredImage' in product ? product.featuredImage : (product as any).selectedOrFirstAvailableVariant?.image;
  const vendor = (product as any).vendor as string | undefined;
  const variantSku = (product as any).selectedOrFirstAvailableVariant?.sku as string | undefined;

  // Price & discount logic
  const variant = (product as any).selectedOrFirstAvailableVariant;
  const compareAtPrice = variant?.compareAtPrice as {amount: string; currencyCode: string} | null | undefined;
  const variantPrice = variant?.price as {amount: string; currencyCode: string} | null | undefined;
  const currentPrice = variantPrice ?? ('priceRange' in product ? product.priceRange.minVariantPrice : null);

  const discountPercent =
    compareAtPrice && currentPrice && parseFloat(compareAtPrice.amount) > parseFloat(currentPrice.amount)
      ? Math.round(
          (1 - parseFloat(currentPrice.amount) / parseFloat(compareAtPrice.amount)) * 100,
        )
      : null;

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="product-item__img-wrap">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        ) : (
          <div className="product-item__no-image">No image</div>
        )}
        {discountPercent && (
          <span className="product-item__badge">-{discountPercent}%</span>
        )}
      </div>
      <div className="product-item__meta">
        {vendor ? <p className="product-item__vendor">{vendor}</p> : null}
        {variantSku ? <p className="product-item__sku">{variantSku}</p> : null}
        <h4 className="product-item__name">{product.title}</h4>
        <div className="product-item__price-row">
          <span className="product-item__price">
            {'priceRange' in product && product.priceRange ? (
              <Money data={product.priceRange.minVariantPrice} />
            ) : (product as any).selectedOrFirstAvailableVariant?.price ? (
              <Money data={(product as any).selectedOrFirstAvailableVariant.price} />
            ) : null}
          </span>
          {compareAtPrice && discountPercent && (
            <span className="product-item__compare-price">
              <Money data={compareAtPrice} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
