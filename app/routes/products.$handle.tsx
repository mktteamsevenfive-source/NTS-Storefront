import {useState} from 'react';
import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PRODUCT_QUERY} from '~/graphql/queries/product';
import {getLangFromRequest} from '~/lib/i18n';
import type {LangCode} from '~/lib/locale';
import {getT} from '~/lib/locale';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/graphql/queries/homepage';
import {RECOMMENDED_VENDOR_FILTER} from '~/utils/vendors';
import {RecommendedProducts} from '~/sections/RecommendedProducts';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Start fetching non-critical data
  const deferredData = loadDeferredData(args, criticalData.product);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
    lang: getLangFromRequest(request),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs, product: any) {
  const sku = product?.selectedOrFirstAvailableVariant?.sku || '';
  const prefixMatch = sku.match(/^([A-Za-z0-9]+)-/);
  const prefix = prefixMatch ? prefixMatch[1] : '';

  let filterQuery = RECOMMENDED_VENDOR_FILTER;
  if (prefix) {
    filterQuery = `${prefix}*`;
  }

  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        filterQuery,
        collectionHandle: 'non-existent-fallback-collection',
      },
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Product() {
  const {product, lang, recommendedProducts} = useLoaderData<typeof loader>();
  const t = getT(lang);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;
  const productId = product.goodId?.value ?? product.id.split('/').pop();

  const SPEC_LABELS: Record<string, string> = {
    width_mm: 'Width (mm)',
    depth_mm: 'Depth (mm)',
    height_mm: 'Height (mm)',
    length_mm: 'Length (mm)',
    weight_kg: 'Weight (kg)',
    voltage: 'Voltage',
    hz: 'Hz',
    wattage: 'Wattage',
    ampere: 'Ampere',
    refrigerant: 'Refrigerant',
    spareparts_warranty: 'Spareparts Warranty',
    service_warranty: 'Service Warranty',
    compressor_warranty: 'Compressor Warranty',
    pump_warranty: 'Pump Warranty',
    product_of: 'Product of',
    made_in: 'Made in',
    certificates: 'Certificates',
    construction: 'Construction',
    material: 'Material',
    energy_type: 'Energy Type',
    installation: 'Installation',
    temperature: 'Temperature',
    gross_weight_kg: 'Gross Weight (kg)',
    net_weight_kg: 'Net Weight (kg)',
    packing_width: 'Packing Width',
    packing_length_mm: 'Packing Length (mm)',
    packing_height_mm: 'Packing Height (mm)',
    packing_weight_kg: 'Packing Weight (kg)',
    volume_mc: 'Volume (mc)',
    rack_size_mm: 'Rack Size (mm)',
    usable_chamber_height_mm: 'Useable Chamber Height (mm)',
    max_dishes_height_mm: 'Maximum Dishes Height (mm)',
    max_trays_height_mm: 'Maximum Trays Height (mm)',
  };

  type MetafieldRow = {namespace: string; key: string; value: string};
  const specRows: {label: string; value: string}[] = (product.metafields ?? [])
    .filter((mf: MetafieldRow | null): mf is MetafieldRow => !!mf?.value)
    .map((mf: MetafieldRow) => ({label: SPEC_LABELS[mf.key] ?? mf.key, value: mf.value}));

  const [descOpen, setDescOpen] = useState(true);
  const [specOpen, setSpecOpen] = useState(true);

  return (
    <div className="sf-product-page">
      <div className="sf-product-container">
        {/* Gallery */}
        <div className="sf-product-gallery">
          <div className="sf-product-gallery__sticky">
            <ProductImage image={selectedVariant?.image} />
          </div>
        </div>

        {/* Info */}
        <div className="sf-product-info">
          {vendor && <div className="sf-product-vendor">{vendor}</div>}
          <h1 className="sf-product-title">{title}</h1>
          <div className="sf-product-meta">
            <span className="sf-product-meta__item">{t.product_id} : {productId}</span>
            {selectedVariant?.sku && (
              <span className="sf-product-meta__item">{selectedVariant.sku}</span>
            )}
          </div>

          <div className="sf-product-price-wrap">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          <div className="sf-product-stock">
            <span
              className={`sf-product-stock__dot${
                (selectedVariant?.quantityAvailable ?? 0) > 0 || selectedVariant?.availableForSale
                  ? ' sf-product-stock__dot--in'
                  : ' sf-product-stock__dot--out'
              }`}
            />
            {t.stock}:&nbsp;
            <strong>
              {selectedVariant?.quantityAvailable != null
                ? selectedVariant.quantityAvailable
                : selectedVariant?.availableForSale
                ? (lang === 'TH' ? 'มีสินค้า' : 'In Stock')
                : (lang === 'TH' ? 'สินค้าหมด' : 'Out of Stock')}
            </strong>
          </div>

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            lang={lang}
          />

          {descriptionHtml && (
            <div className="sf-product-accordion">
              <button
                type="button"
                className="sf-product-accordion__head"
                onClick={() => setDescOpen((o) => !o)}
                aria-expanded={descOpen}
              >
                <span>{t.description}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={descOpen ? 'sf-product-accordion__icon--open' : ''}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {descOpen && (
                <div
                  className="sf-product-accordion__body sf-product-description"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              )}
            </div>
          )}

          {specRows.length > 0 && (
            <div className="sf-product-accordion">
              <button
                type="button"
                className="sf-product-accordion__head"
                onClick={() => setSpecOpen((o) => !o)}
                aria-expanded={specOpen}
              >
                <span>{lang === 'TH' ? 'ข้อมูลจำเพาะทางเทคนิค' : 'Specification'}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={specOpen ? 'sf-product-accordion__icon--open' : ''}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {specOpen && (
                <div className="sf-product-accordion__body">
                  <table className="sf-product-spec__table">
                    <tbody>
                      {specRows.map((row) => (
                        <tr key={row.label}>
                          <td className="sf-product-spec__label">{row.label}</td>
                          <td className="sf-product-spec__value">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {product.metafield?.value && (
            <div className="sf-product-specsheet">
              <table className="sf-product-specsheet__table">
                <thead>
                  <tr>
                    <th>File type</th>
                    <th>File name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PDF</td>
                    <td>Spec Sheet</td>
                    <td>
                      <a
                        href={product.metafield.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sf-product-specsheet__link"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <RecommendedProducts products={recommendedProducts} lang={lang} />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}


