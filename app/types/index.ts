export type FilterValue = {
  id: string;
  label: string;
  count: number;
  input: string;
};

export type FilterGroup = {
  id: string;
  label: string;
  type: string;
  values: FilterValue[];
};

export type RecommendedProduct = {
  id: string;
  handle: string;
  title: string;
  vendor?: string;
  featuredImage?: {url: string; altText: string | null; width: number; height: number} | null;
  selectedOrFirstAvailableVariant?: {sku: string | null} | null;
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
};

export type Viewport = 'desktop' | 'mobile';
