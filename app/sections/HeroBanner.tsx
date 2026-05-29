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
          <div className="absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-6 lg:p-7 rounded-2xl shadow-2xl w-[440px] max-w-[90%] hidden md:block border border-gray-100 z-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-extrabold text-gray-900 text-base">Top Brands You Trust</h3>
              <Link to="/brands" className="text-[#00A859] text-xs font-bold flex items-center hover:underline hover:text-[#008f4c] transition-colors">
                View all brands <span className="ml-1 text-[10px]">›</span>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {FLOATING_BRANDS.map((brand) => (
                <Link
                  key={brand.name}
                  to={brand.url}
                  className="flex items-center justify-center bg-white border border-gray-100 rounded-xl p-2.5 h-16 shadow-sm hover:scale-[1.03] hover:border-[#00A859] hover:shadow-md transition-all duration-200"
                  prefetch="intent"
                >
                  {brand.logo}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

const FLOATING_BRANDS = [
  {
    name: 'RATIONAL',
    url: '/collections/rational',
    logo: (
      <svg viewBox="0 0 100 32" width="85" height="26" style={{display:'block'}} className="mx-auto">
        <rect x="1" y="1" width="98" height="30" fill="none" stroke="#c8102e" strokeWidth="2.5" rx="3"/>
        <text x="50" y="21.5" textAnchor="middle" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="13.5" fill="#c8102e" letterSpacing="0.2">RATIONAL</text>
      </svg>
    )
  },
  {
    name: 'HOSHIZAKI',
    url: '/collections/hoshizaki',
    logo: (
      <svg viewBox="0 0 120 32" width="100" height="26" style={{display:'block'}} className="mx-auto">
        <circle cx="14" cy="16" r="9" fill="#005bac"/>
        <text x="14" y="20.5" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="bold" fontSize="12" fill="#ffffff">H</text>
        <text x="28" y="20.5" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="10.5" fill="#1a1a1a" letterSpacing="0.5">HOSHIZAKI</text>
      </svg>
    )
  },
  {
    name: 'robot coupe',
    url: '/collections/robot-coupe',
    logo: (
      <svg viewBox="0 0 110 32" width="95" height="26" style={{display:'block'}} className="mx-auto">
        <text x="2" y="21" fontFamily="'Inter', sans-serif" fontStyle="italic" fontWeight="900" fontSize="15" fill="#c8102e" letterSpacing="-0.2">robot coupe</text>
        <circle cx="68" cy="9" r="2.5" fill="#00A859"/>
      </svg>
    )
  },
  {
    name: 'SIRMAN',
    url: '/collections/sirman',
    logo: (
      <svg viewBox="0 0 90 32" width="80" height="26" style={{display:'block'}} className="mx-auto">
        <text x="2" y="22" fontFamily="'Inter', 'Arial Black', sans-serif" fontStyle="italic" fontWeight="900" fontSize="19" fill="#c8102e" letterSpacing="0.2">SIRMAN</text>
      </svg>
    )
  },
  {
    name: 'UNOX',
    url: '/collections/unox',
    logo: (
      <svg viewBox="0 0 85 32" width="75" height="26" style={{display:'block'}} className="mx-auto">
        <rect x="2" y="3" width="81" height="26" rx="13" fill="#1a1a1a"/>
        <text x="42.5" y="20.5" textAnchor="middle" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#ffffff" letterSpacing="1">UNOX</text>
      </svg>
    )
  },
  {
    name: 'CAMBRO',
    url: '/collections/cambro',
    logo: (
      <svg viewBox="0 0 95 32" width="85" height="26" style={{display:'block'}} className="mx-auto">
        <text x="5" y="21" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="15.5" fill="#c8102e" letterSpacing="0.4">CAMBRO</text>
      </svg>
    )
  },
  {
    name: 'HAMILTON BEACH COMMERCIAL',
    url: '/collections/hamilton-beach',
    logo: (
      <svg viewBox="0 0 130 32" width="110" height="26" style={{display:'block'}} className="mx-auto">
        <rect x="0" y="1" width="130" height="30" fill="none" stroke="#1a1a1a" strokeWidth="1.5" rx="2"/>
        <text x="65" y="14" textAnchor="middle" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="8.5" fill="#1a1a1a" letterSpacing="0.2">HAMILTON BEACH</text>
        <text x="65" y="24" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="7" fill="#666666" letterSpacing="1">COMMERCIAL</text>
      </svg>
    )
  },
  {
    name: 'Electrolux PROFESSIONAL',
    url: '/collections/electrolux',
    logo: (
      <svg viewBox="0 0 135 32" width="110" height="26" style={{display:'block'}} className="mx-auto">
        <g fill="#1a1a1a">
          <path d="M12 8a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm0 13.5a5.5 5.5 0 1 1 5.5-5.5 5.5 5.5 0 0 1-5.5 5.5z"/>
          <path d="M10 12h4v1.5h-4zM10 15h4v1.5h-4zM10 18h4v1.5h-4z"/>
        </g>
        <text x="28" y="16" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="11" fill="#1a1a1a" letterSpacing="0.2">Electrolux</text>
        <text x="28" y="25" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="7" fill="#666666" letterSpacing="1.2">PROFESSIONAL</text>
      </svg>
    )
  }
];
