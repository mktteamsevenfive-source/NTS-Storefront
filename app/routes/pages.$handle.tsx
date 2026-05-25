import {useLoaderData, redirect} from 'react-router';
import type {Route} from './+types/pages.$handle';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

export function links({data}: {data?: {page?: {handle?: string}}} = {}) {
  const handle = data?.page?.handle;
  if (handle === 'warranty-policy-nts') {
    return [
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
      },
    ];
  }
  return [];
}

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
const HANDLE_FALLBACKS: Record<string, string> = {
  'การชำระเงิน': 'how-to-pay-nts',
  'การรับประกัน': 'warranty-policy-nts',
  'บริการหลังการขาย': 'after-sales-service-nts',
  'นโยบายการติดตั้ง': 'installation-policy-nts',
  'นโยบายการจัดส่งและการขนส่ง': 'delivery-and-shipping-policy-nts',
  'เกี่ยวกับเรา': 'who-we-are-nts',
  'ศูนย์บริการ': 'service-center-nts',
  'ติดต่อเรา': 'contact-us-nts',
  'after-sales-service': 'after-sales-service-nts',
  'installation-policy': 'installation-policy-nts',
  'delivery-and-shipping-policy': 'delivery-and-shipping-policy-nts',
  'who-we-are': 'who-we-are-nts',
  'service-center': 'service-center-nts',
  'contact-us': 'contact-us-nts',
};

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  // Redirect /pages/brand to our custom /brands route
  if (params.handle === 'brand') {
    throw redirect('/brands');
  }

  // Mock the Catalogue page to ensure it always works without requiring Shopify admin setup
  if (params.handle === 'catalog' || params.handle === 'catalogue') {
    return {
      page: {
        handle: params.handle,
        id: 'mock-catalog-page',
        title: 'Catalogue',
        body: '',
        seo: {
          title: 'NTS Catalogue',
          description: 'NTS Product Catalogue',
        },
      },
    };
  }

  const pageQuery = async (handle: string) =>
    context.storefront.query(PAGE_QUERY, {
      variables: {handle},
    });

  let {page} = await pageQuery(params.handle);
  if (!page) {
    const fallbackHandle = HANDLE_FALLBACKS[params.handle];
    if (fallbackHandle) {
      const fallbackResult = await pageQuery(fallbackHandle);
      page = fallbackResult.page;
    }
  }

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

const FOOTER_PAGE_HANDLES = new Set([
  'how-to-pay-nts',
  'warranty-policy-nts',
  'delivery-and-shipping-policy-nts',
  'after-sales-service',
  'after-sales-service-nts',
  'installation-policy',
  'installation-policy-nts',
  'who-we-are',
  'who-we-are-nts',
  'service-center',
  'service-center-nts',
  'contact-us',
  'contact-us-nts',
  'การชำระเงิน',
  'ช่องทางการชำระเงิน-nts',
  'การรับประกัน',
  'บริการหลังการขาย',
  'นโยบายการติดตั้ง',
  'นโยบายการจัดส่งและการขนส่ง',
  'เกี่ยวกับเรา',
  'ศูนย์บริการ',
  'ติดต่อเรา',
]);

function shouldHidePageTitle(page: {handle: string; title: string}) {
  return FOOTER_PAGE_HANDLES.has(page.handle);
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();
  const isCatalog = page.handle === 'catalog' || page.handle === 'catalogue';

  return (
    <div className="page">
      <header>
        {!shouldHidePageTitle(page) && !isCatalog && <h1>{page.title}</h1>}
      </header>
      {isCatalog ? (
        <main className="sf-catalog-main">
          <div className="sf-catalog-embed">
            <iframe
              src="https://online.fliphtml5.com/dsalh/okjv/"
              title="NTS-catalogue New 2021"
              seamless
              scrolling="no"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </main>
      ) : (
        <main dangerouslySetInnerHTML={{__html: page.body}} />
      )}
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
