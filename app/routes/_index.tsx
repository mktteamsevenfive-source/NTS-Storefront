import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {MockShopNotice} from '~/components/MockShopNotice';
import {RECOMMENDED_VENDOR_FILTER} from '~/utils/vendors';
import {FEATURED_COLLECTION_QUERY, RECOMMENDED_PRODUCTS_QUERY} from '~/graphql/queries/homepage';
import {HeroBanner} from '~/sections/HeroBanner';
import {CategoryGrid} from '~/sections/CategoryGrid';
import {BrandTrust} from '~/sections/BrandTrust';
import {RecommendedProducts} from '~/sections/RecommendedProducts';

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

  const filteredCollections = (collections?.nodes ?? []).filter(
    (collection: any) => collection.products?.nodes?.length > 0,
  );

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: filteredCollections[0] ?? null,
    categories: filteredCollections,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {filterQuery: RECOMMENDED_VENDOR_FILTER},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
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
