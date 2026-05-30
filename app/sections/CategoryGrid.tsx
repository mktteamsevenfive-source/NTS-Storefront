import {Link} from 'react-router';

// Lucide icon placeholders
const CATEGORIES = [
  { title: 'Food Preparation', link: '/collections/food-preparation', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5Z"/><path d="M8 4.5h6"/><path d="M15 3l5 5-4 4-5-5 4-4Z"/><path d="M17 5.5v2"/></svg> },
  { title: 'Cooking Equipment', link: '/collections/cooking-equipment', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M12 2v6"/><path d="M8 3v5"/><path d="M16 3v5"/><path d="M4 11h16"/></svg> },
  { title: 'Refrigeration & Freezing', link: '/collections/refrigeration-equipment', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 22h14"/><path d="M12 2v20"/><path d="M5 9h14"/><path d="M5 2h14"/><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6v2"/><path d="M9 14v2"/></svg> },
  { title: 'Bakery Equipment', link: '/collections/bakery-equipment', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 0-4 4v1H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4Z"/><path d="M12 12v6"/></svg> },
  { title: 'Beverage Equipment', link: '/collections/beverage-equipment', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M6 8h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M10 12v3"/><path d="M14 12v3"/></svg> },
  { title: 'Dishwashing Equipment', link: '/collections/warewashing-sanitisation', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18"/><path d="M3 21h18"/><path d="M4 3v18"/><path d="M20 3v18"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
  { title: 'Stainless Steel & Sinks', link: '/collections/stainless-steel-fabrication', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v20"/><path d="M21 2v20"/><path d="M3 10h18"/><path d="M3 14h18"/><path d="M12 14v8"/></svg> },
  { title: 'Cleaning & Hygiene', link: '/collections/janitorial-supplies', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3Z"/><path d="M19 8H5a2 2 0 0 0-2 2v2h18v-2a2 2 0 0 0-2-2Z"/><path d="M18 12v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7"/><path d="M10 16v-2"/><path d="M14 16v-2"/></svg> },
  { title: 'Storage & Shelving', link: '/collections/storage-transport', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/><path d="M2 18h20v4H2z"/><path d="M6 10h12"/><path d="M6 6h12"/><path d="M6 14h12"/></svg> },
  { title: 'Ventilation & Hood', link: '/collections/ventilation-hood', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18"/><path d="M3 16h18"/><path d="M6 8l6-6 6 6"/><path d="M12 2v10"/></svg> },
  { title: 'Tableware & Buffetware', link: '/collections/tableware-buffetware', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v8c0 1.1.9 2 2 2h3Z" /><path d="M18 17v5" /></svg> },
  { title: 'Hotel Supplies', link: '/collections/hotel-supplies', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 18h20M5 18a7 7 0 0 1 14 0" /><path d="M12 11V7M9 7h6" /></svg> },
];

export function CategoryGrid() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-500">Explore our wide range of product categories</p>
        </div>

        <div className="block md:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4 snap-x snap-mandatory">
            {CATEGORIES.map((cat, index) => (
              <Link
                key={index}
                to={cat.link}
                className="snap-start shrink-0 min-w-[180px] sm:min-w-[200px] flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-3xl hover:border-[#00A859] hover:shadow-md transition-all text-center"
                prefetch="intent"
              >
                <div className="text-gray-400 group-hover:text-[#00A859] transition-colors mb-3">
                  {cat.icon}
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#00A859] transition-colors line-clamp-2">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={index}
              to={cat.link}
              className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-lg hover:border-[#00A859] hover:shadow-md transition-all text-center"
              prefetch="intent"
            >
              <div className="text-gray-400 group-hover:text-[#00A859] transition-colors mb-3">
                {cat.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#00A859] transition-colors line-clamp-2">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
