import {useState} from 'react';
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/brands';

const ALLOWED_VENDORS = [
  'NTS',
  'PRIMO',
  'ABSOLUTE',
  'Cutlery Pro',
  'Top Rinse',
  'Iwatani',
  'Justa',
  'Kitchin',
  'VEESAN',
] as const;

const VENDOR_FIRST_PRODUCT_QUERY = `#graphql
  query VendorCollection($query: String!) {
    collections(first: 1, query: $query) {
      nodes {
        handle
        image {
          url(transform: {maxWidth: 300, maxHeight: 200})
          altText
        }
      }
    }
  }
` as const;

export const meta: Route.MetaFunction = () => {
  return [{title: 'NTS | Brand'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const vendorData = await Promise.all(
    ALLOWED_VENDORS.map(async (vendor) => {
      try {
        const data = await context.storefront.query(
          VENDOR_FIRST_PRODUCT_QUERY,
          {variables: {query: `title:"${vendor}"`}},
        );
        const img = data?.collections?.nodes?.[0]?.image;
        return {
          vendor,
          image: img?.url ?? null,
          imageAlt: img?.altText ?? vendor,
        };
      } catch {
        return {vendor, image: null, imageAlt: vendor};
      }
    }),
  );
  return {vendorData};
}

type VendorItem = {vendor: string; image: string | null; imageAlt: string};

export default function BrandsPage() {
  const {vendorData} = useLoaderData<typeof loader>();
  const [activeLetter, setActiveLetter] = useState<string>('ALL');

  const sorted = [...vendorData].sort((a, b) =>
    a.vendor.localeCompare(b.vendor),
  );

  const activeLettersSet = new Set(sorted.map((b) => b.vendor[0].toUpperCase()));

  const filtered =
    activeLetter === 'ALL'
      ? sorted
      : sorted.filter((b) => b.vendor[0].toUpperCase() === activeLetter);

  // Group by first letter
  const groups = filtered.reduce<Record<string, VendorItem[]>>((acc, brand) => {
    const letter = brand.vendor[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(brand);
    return acc;
  }, {});

  const groupEntries = Object.entries(groups).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const letters = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '#'];

  return (
    <div className="sf-brands-page">
      <h1 className="sf-brands-title">Brand</h1>

      {/* Letter filter */}
      <div className="sf-brands-filter">
        {letters.map((l) => {
          const isAll = l === 'ALL';
          const hasItems = isAll || l === '#' || activeLettersSet.has(l);
          const isActive = activeLetter === l;
          return (
            <button
              key={l}
              onClick={() => setActiveLetter(l)}
              disabled={!isAll && !hasItems}
              className={[
                'sf-brands-filter__btn',
                isActive ? 'sf-brands-filter__btn--active' : '',
                !isAll && !hasItems ? 'sf-brands-filter__btn--empty' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {isAll ? 'All Brand' : l}
            </button>
          );
        })}
      </div>

      {/* Brand grid grouped by letter */}
      <div className="sf-brands-content">
        {groupEntries.map(([letter, brands]) => (
          <section key={letter} className="sf-brands-group">
            <h2 className="sf-brands-group__letter">{letter}</h2>
            <div className="sf-brands-grid">
              {brands.map(({vendor, image, imageAlt}) => (
                <Link
                  key={vendor}
                  to={`/search?q=${encodeURIComponent(`vendor:"${vendor}"`)}`}
                  className="sf-brands-card"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={imageAlt}
                      className="sf-brands-card__img"
                    />
                  ) : (
                    <span className="sf-brands-card__name">{vendor}</span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
