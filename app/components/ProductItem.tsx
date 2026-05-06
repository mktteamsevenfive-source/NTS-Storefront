import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const vendor = (product as any).vendor as string | undefined;
  const variantSku = (product as any).selectedOrFirstAvailableVariant?.sku as
    | string
    | undefined;

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <div className="product-item__meta">
        {vendor ? <p className="product-item__vendor">{vendor}</p> : null}
        {variantSku ? <p className="product-item__sku">{variantSku}</p> : null}
        <h4 className="product-item__name">{product.title}</h4>
        <small className="product-item__price">
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </div>
    </Link>
  );
}
