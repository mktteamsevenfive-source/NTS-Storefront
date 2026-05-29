import {Link} from 'react-router';

// Lucide icon placeholders
const CATEGORIES = [
  { title: 'Food Preparation', link: '/collections/food-preparation', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m11 12 2-2"/><path d="M15 10l5-5"/><path d="m11 12-2 2"/><path d="M5 18l-1 1"/><path d="M2 22l3-3"/><path d="M14 15l-1 1"/><path d="M19 14l-4 4"/></svg> },
  { title: 'Cooking Equipment', link: '/collections/cooking-equipment', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M12 2v6"/><path d="M8 3v5"/><path d="M16 3v5"/><path d="M4 11h16"/></svg> },
  { title: 'Refrigeration & Freezing', link: '/collections/refrigeration-equipment', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 22h14"/><path d="M12 2v20"/><path d="M5 9h14"/><path d="M5 2h14"/><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6v2"/><path d="M9 14v2"/></svg> },
  { title: 'Bakery Equipment', link: '/collections/bakery-equipment', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 0-4 4v1H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4Z"/><path d="M12 12v6"/></svg> },
  { title: 'Beverage Equipment', link: '/collections/beverage-equipment', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M6 8h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M10 12v3"/><path d="M14 12v3"/></svg> },
  { title: 'Dishwashing Equipment', link: '/collections/warewashing-sanitisation', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18"/><path d="M3 21h18"/><path d="M4 3v18"/><path d="M20 3v18"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> },
  { title: 'Stainless Steel & Sinks', link: '/collections/stainless-steel-fabrication', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v20"/><path d="M21 2v20"/><path d="M3 10h18"/><path d="M3 14h18"/><path d="M12 14v8"/></svg> },
  { title: 'Cleaning & Hygiene', link: '/collections/janitorial-supplies', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3Z"/><path d="M19 8H5a2 2 0 0 0-2 2v2h18v-2a2 2 0 0 0-2-2Z"/><path d="M18 12v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7"/><path d="M10 16v-2"/><path d="M14 16v-2"/></svg> },
  { title: 'Storage & Shelving', link: '/collections/storage-transport', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/><path d="M2 18h20v4H2z"/><path d="M6 10h12"/><path d="M6 6h12"/><path d="M6 14h12"/></svg> },
  { title: 'Ventilation & Hood', link: '/collections/ventilation-hood', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18"/><path d="M3 16h18"/><path d="M6 8l6-6 6 6"/><path d="M12 2v10"/></svg> },
];

export function CategoryGrid() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-500">Explore our wide range of product categories</p>
          </div>
          <Link to="/collections" className="text-[#00A859] font-medium flex items-center hover:underline">
            View all categories <span className="ml-1">›</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
          {/* View More Card */}
          <Link 
            to="/collections"
            className="group flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#00A859] hover:shadow-md transition-all text-center"
            prefetch="intent"
          >
            <div className="text-gray-400 group-hover:text-[#00A859] transition-colors mb-3 grid grid-cols-2 gap-1 w-[28px] h-[28px]">
              <div className="w-full h-full bg-current rounded-sm"></div>
              <div className="w-full h-full bg-current rounded-sm"></div>
              <div className="w-full h-full bg-current rounded-sm"></div>
              <div className="w-full h-full bg-current rounded-sm"></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-[#00A859] transition-colors">
              More<br/>Categories
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
