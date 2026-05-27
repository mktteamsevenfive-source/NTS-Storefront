import {FEATURED_COLLECTION_FRAGMENT} from '../fragments/collection';

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    vendor
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
  query RecommendedProducts (
    $country: CountryCode,
    $language: LanguageCode,
    $filterQuery: String!,
    $collectionHandle: String!
  )
    @inContext(country: $country, language: $language) {
    collection(handle: $collectionHandle) {
      handle
      products(first: 18) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
    products(first: 18, sortKey: UPDATED_AT, reverse: true, query: $filterQuery) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

export const LATEST_BLOGS_QUERY = `#graphql
  query LatestBlogs($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blogs(first: 1) {
      nodes {
        articles(first: 3, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            publishedAt
            excerpt
            image {
              url
              altText
              width
              height
            }
            blog {
              handle
            }
          }
        }
      }
    }
  }
` as const;

export const FEATURED_COLLECTION_QUERY = `#graphql
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
  ${FEATURED_COLLECTION_FRAGMENT}
` as const;

export const BRAND_COLLECTIONS_QUERY = `#graphql
  fragment BrandFragment on Collection {
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
  }
  query BrandCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cutleryPro: collection(handle: "cutlery-pro") { ...BrandFragment }
    topRinse: collection(handle: "top-rinse") { ...BrandFragment }
    primo: collection(handle: "primo") { ...BrandFragment }
    nts: collection(handle: "nts") { ...BrandFragment }
    iwatani: collection(handle: "iwatani") { ...BrandFragment }
    absolute: collection(handle: "absolute") { ...BrandFragment }
    justa: collection(handle: "justa") { ...BrandFragment }
    kitchin: collection(handle: "kitchin") { ...BrandFragment }
    veetsan: collection(handle: "veetsan") { ...BrandFragment }
  }
` as const;
