import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {MockShopNotice} from '~/components/MockShopNotice';
import {RECOMMENDED_VENDOR_FILTER} from '~/utils/vendors';
import {FEATURED_COLLECTION_QUERY, RECOMMENDED_PRODUCTS_QUERY, LATEST_BLOGS_QUERY, BRAND_COLLECTIONS_QUERY} from '~/graphql/queries/homepage';
import {HeroBanner} from '~/sections/HeroBanner';
import {CategoryGrid} from '~/sections/CategoryGrid';
import {RecommendedProducts} from '~/sections/RecommendedProducts';
import {LatestBlogs} from '~/sections/LatestBlogs';
import {BrandLogos} from '~/sections/BrandLogos';

export const meta: Route.MetaFunction = () => {
  return [{title: 'NTS Mart | Premium Commercial Kitchen Equipment'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Non-critical data is deferred – does not block first byte
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  const mainCategoryHandles = [
    'cooking-equipment',
    'food-preparation',
    'refrigerator-equipment',
    'refrigeration-equipment',
    'refrigeration',
    'commercial-ovens',
    'bakery-equipment',
    'warming-equipment',
    'beverage-equipment',
    'stainless-steel-fabrication',
    'warewashing-sanitisation',
    'warewashing-sanitation',
    'storage-transport',
    'storage-transportation',
    'smallwares',
    'bakery-utensils',
    'tableware-buffetware',
    'tabletop-buffetware',
    'janitorial-supplies',
    'bar-supplies',
    'hotel-supplies',
  ];

  const availableCollections = (collections?.nodes ?? []).filter(
    (collection: any) => collection.products?.nodes?.length > 0,
  );

  const mainCategories = availableCollections.filter((collection: any) =>
    mainCategoryHandles.includes(collection.handle),
  );

  const otherCollections = availableCollections.filter(
    (collection: any) => !mainCategoryHandles.includes(collection.handle),
  );

  mainCategories.sort((a: any, b: any) => {
    const indexA = mainCategoryHandles.indexOf(a.handle);
    const indexB = mainCategoryHandles.indexOf(b.handle);
    return indexA - indexB;
  });

  const sortedCollections = [...mainCategories, ...otherCollections];

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: sortedCollections[0] ?? null,
    categories: sortedCollections,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        filterQuery: RECOMMENDED_VENDOR_FILTER,
        collectionHandle: 'nts-product',
      },
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const latestBlogs = context.storefront
    .query(LATEST_BLOGS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const brandCollections = context.storefront
    .query(BRAND_COLLECTIONS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts, latestBlogs, brandCollections};
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      {data.isShopLinked ? null : <MockShopNotice />}
      <HeroBanner collection={data.featuredCollection} />
      <CategoryGrid collections={data.categories} />
      <RecommendedProducts products={data.recommendedProducts} />
      <LatestBlogs blogs={data.latestBlogs} />
      <BrandLogos brandCollections={data.brandCollections} />
    </div>
  );
}
