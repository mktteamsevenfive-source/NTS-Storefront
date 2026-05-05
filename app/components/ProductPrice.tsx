import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const discountPercent =
    compareAtPrice && price
      ? Math.round(
          (1 - parseFloat(price.amount) / parseFloat(compareAtPrice.amount)) *
            100,
        )
      : null;

  return (
    <div aria-label="Price" className="product-price" role="group">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          {discountPercent && discountPercent > 0 ? (
            <span className="product-price-badge">-{discountPercent}%</span>
          ) : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
