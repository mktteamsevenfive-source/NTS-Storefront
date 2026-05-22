import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

export function BrandLogos({brandCollections}: {brandCollections?: Promise<any>}) {
  const brandNames = [
    'cutleryPro',
    'topRinse',
    'primo',
    'nts',
    'iwatani',
    'absolute',
    'justa',
    'kitchin',
    'veetsan'
  ];

  const brandDisplayNames: Record<string, string> = {
    cutleryPro: 'Cutlery-Pro',
    topRinse: 'Top-Rinse',
    primo: 'PRIMO',
    nts: 'nts',
    iwatani: 'Iwatani',
    absolute: 'Absolute',
    justa: 'JUSTA',
    kitchin: 'kitchin',
    veetsan: 'VEETSAN'
  };

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-12 border-t border-b border-gray-100 my-8">
      <Suspense fallback={
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-60">
          <p className="text-gray-400 text-sm">Loading brands...</p>
        </div>
      }>
        <Await resolve={brandCollections}>
          {(response) => {
            const renderBrand = (key: string) => {
              const collection = response?.[key];
              const displayName = brandDisplayNames[key];

              const renderPlaceholder = () => (
                <span className="text-2xl font-black text-[#1a1a1a] tracking-tighter uppercase">
                  {displayName === 'nts' ? (
                    <span className="lowercase tracking-widest text-[#00a87a] flex items-center gap-1.5 text-xl">
                      <span className="text-[12px]">✤</span> nts <span className="text-[12px]">✤</span>
                    </span>
                  ) : displayName === 'Iwatani' ? (
                    <span className="text-[#e02b27]">{displayName}</span>
                  ) : (
                    displayName
                  )}
                </span>
              );

              const content = (
                <div className="flex items-center justify-center min-w-[140px] h-[60px] transition-all duration-300 hover:scale-105">
                  {collection?.image ? (
                    <Image
                      data={collection.image}
                      sizes="250px"
                      className="object-contain max-h-[60px] w-auto"
                      alt={collection.image.altText || displayName}
                    />
                  ) : (
                    renderPlaceholder()
                  )}
                </div>
              );

              if (collection?.handle) {
                return (
                  <Link key={key} to={`/collections/${collection.handle}`} className="block" prefetch="intent">
                    {content}
                  </Link>
                );
              }

              return <div key={key}>{content}</div>;
            };

            const firstRow = brandNames.slice(0, 5);
            const secondRow = brandNames.slice(5);

            return (
              <div className="flex flex-col gap-y-6 md:gap-y-8 opacity-95 hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6">
                  {firstRow.map(renderBrand)}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6">
                  {secondRow.map(renderBrand)}
                </div>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
}
