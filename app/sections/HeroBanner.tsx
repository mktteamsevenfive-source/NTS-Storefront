import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

// Try to use existing trust badge icons if they exist, or just use Lucide SVGs inline

export function HeroBanner({brandCollections}: {brandCollections?: Promise<any>}) {
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
    <section className="bg-white w-full overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row relative">
        
        {/* Left Content Area */}
        <div className="w-full lg:w-[45%] py-12 px-8 lg:py-24 lg:pr-12 lg:pl-8 flex flex-col justify-center z-10 bg-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1a1a] leading-[1.1] tracking-tight mb-4">
            Professional<br/>
            Kitchen Solutions<br/>
            <span className="text-[#00A859]">for Your Business</span>
          </h1>
          <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-md">
            One-stop solution for commercial kitchen equipment and services.
          </p>

          {/* Trust Badges Grid */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#00A859]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">Authorized<br/>Distributor</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#00A859]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">Genuine Products<br/>& Spare Parts</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#00A859]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">Professional<br/>Installation</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#00A859]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">Service Center<br/>& Support</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/collections" className="bg-[#00A859] text-white px-8 py-3.5 rounded-md font-bold hover:bg-[#008a49] transition-colors flex items-center gap-2">
              SHOP NOW
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/pages/catalogue" className="bg-white border-2 border-[#00A859] text-[#00A859] px-8 py-3 rounded-md font-bold hover:bg-green-50 transition-colors flex items-center gap-2">
              VIEW CATALOGUE
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </Link>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="w-full lg:w-[65%] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 h-[400px] lg:h-[600px]">
          {/* Diagonal cut effect for the white section overlaying the image */}
          <div className="hidden lg:block absolute left-[-1px] top-0 bottom-0 w-32 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%, 0 100%)', zIndex: 1 }} />
          
          <img 
            src="/images/hero_kitchen.png" 
            alt="Professional Commercial Kitchen" 
            className="w-full h-full object-cover object-center"
          />

          {/* Floating Top Brands Box */}
          <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-[600px] hidden md:block border border-gray-100 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Top Brands You Trust</h3>
              <Link to="/brands" className="text-[#00A859] text-sm font-semibold flex items-center hover:underline">
                View all brands <span className="ml-1">›</span>
              </Link>
            </div>
            <Suspense fallback={<div className="h-[60px] opacity-60 flex items-center justify-center text-sm text-gray-400">Loading brands...</div>}>
              <Await resolve={brandCollections}>
                {(response) => {
                  const renderBrand = (key: string) => {
                    const collection = response?.[key];
                    const displayName = brandDisplayNames[key];

                    const renderPlaceholder = () => (
                      <span className="font-black text-[#1a1a1a] tracking-tighter uppercase whitespace-nowrap" style={{fontSize: '14px'}}>
                        {displayName === 'nts' ? (
                          <span className="lowercase tracking-widest text-[#00a87a] flex items-center gap-1">
                            <span className="text-[8px]">✤</span> nts <span className="text-[8px]">✤</span>
                          </span>
                        ) : displayName === 'Iwatani' ? (
                          <span className="text-[#e02b27]">{displayName}</span>
                        ) : (
                          displayName
                        )}
                      </span>
                    );

                    const content = (
                      <div className="flex items-center justify-center min-w-[50px] md:min-w-[80px] h-[30px] transition-all duration-300 hover:scale-105">
                        {collection?.image ? (
                          <Image
                            data={collection.image}
                            sizes="120px"
                            className="object-contain max-h-[30px] w-auto"
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
                    <div className="flex flex-col gap-y-4 opacity-95 hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-4">
                        {firstRow.map(renderBrand)}
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-4">
                        {secondRow.map(renderBrand)}
                      </div>
                    </div>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </div>

      </div>
    </section>
  );
}
