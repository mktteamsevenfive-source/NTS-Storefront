export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    quantityAvailable
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment ColMoneyItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ColProductItem on Product {
    id
    handle
    title
    vendor
    featuredImage {
      id
      altText
      url
      width
      height
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      sku
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
    priceRange {
      minVariantPrice {
        ...ColMoneyItem
      }
    }
  }
` as const;

export const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    metafield(namespace: "custom", key: "link_pdf") {
      value
    }
    goodId: metafield(namespace: "custom", key: "good_id") {
      value
    }
    metafields(identifiers: [
      {namespace: "specs", key: "width_mm"},
      {namespace: "specs", key: "depth_mm"},
      {namespace: "specs", key: "height_mm"},
      {namespace: "specs", key: "length_mm"},
      {namespace: "specs", key: "weight_kg"},
      {namespace: "specs", key: "voltage"},
      {namespace: "specs", key: "hz"},
      {namespace: "specs", key: "wattage"},
      {namespace: "specs", key: "ampere"},
      {namespace: "specs", key: "refrigerant"},
      {namespace: "specs", key: "spareparts_warranty"},
      {namespace: "specs", key: "service_warranty"},
      {namespace: "specs", key: "compressor_warranty"},
      {namespace: "specs", key: "pump_warranty"},
      {namespace: "specs", key: "product_of"},
      {namespace: "specs", key: "made_in"},
      {namespace: "specs", key: "certificates"},
      {namespace: "specs", key: "construction"},
      {namespace: "specs", key: "material"},
      {namespace: "specs", key: "energy_type"},
      {namespace: "specs", key: "installation"},
      {namespace: "specs", key: "temperature"},
      {namespace: "specs", key: "gross_weight_kg"},
      {namespace: "specs", key: "net_weight_kg"},
      {namespace: "specs", key: "packing_width"},
      {namespace: "specs", key: "packing_length_mm"},
      {namespace: "specs", key: "packing_height_mm"},
      {namespace: "specs", key: "packing_weight_kg"},
      {namespace: "specs", key: "volume_mc"},
      {namespace: "specs", key: "rack_size_mm"},
      {namespace: "specs", key: "usable_chamber_height_mm"},
      {namespace: "specs", key: "max_dishes_height_mm"},
      {namespace: "specs", key: "max_trays_height_mm"}
    ]) {
      namespace
      key
      value
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;
