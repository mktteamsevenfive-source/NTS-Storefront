import {Link} from 'react-router';

// Generic placeholder images from unsplash or use standard images
const BUSINESS_TYPES = [
  {
    title: 'Restaurant',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
    image: '/images/biz_restaurant.png',
    link: '/collections/restaurant-equipment'
  },
  {
    title: 'Hotel',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-8"/><path d="M7 22v-8"/><path d="M11 22v-8"/><path d="M15 22v-8"/><path d="M19 22v-8"/><path d="M2 22h20"/><path d="M3 14V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10"/><path d="M12 10V6"/><path d="M8 10V6"/><path d="M16 10V6"/></svg>,
    image: '/images/biz_hotel.png',
    link: '/collections/hotel-supplies'
  },
  {
    title: 'Cafe',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
    image: '/images/biz_cafe.png',
    link: '/collections/cafe-equipment'
  },
  {
    title: 'Bakery',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4Z"/><path d="M12 12v6"/></svg>,
    image: '/images/biz_bakery.png',
    link: '/collections/bakery-equipment'
  },
  {
    title: 'Catering',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    image: '/images/biz_catering.png',
    link: '/collections/catering-equipment'
  },
  {
    title: 'Central Kitchen',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v20"/><path d="M18 2v20"/><path d="M2 10h20"/><path d="M2 14h20"/></svg>,
    image: '/images/biz_central_kitchen.png',
    link: '/collections/central-kitchen'
  },
  {
    title: 'Hospital',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>,
    image: '/images/biz_hospital.png',
    link: '/collections/hospital-equipment'
  },
  {
    title: 'School',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
    image: '/images/biz_school.png',
    link: '/collections/school-canteen'
  }
];

export function ShopByBusiness() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Business</h2>
            <p className="text-gray-500">Find the right solution for your business</p>
          </div>
          <Link to="/collections" className="text-[#00A859] font-medium flex items-center hover:underline">
            View all <span className="ml-1">›</span>
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-6 -mx-8 px-8 md:mx-0 md:px-0 gap-4 snap-x">
          {BUSINESS_TYPES.map((item, index) => (
            <Link 
              key={index}
              to={item.link}
              className="group flex-shrink-0 w-[240px] md:w-[calc(25%-12px)] lg:w-[calc(12.5%-14px)] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 snap-start relative"
              prefetch="intent"
            >
              <div className="h-[120px] overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute top-[96px] left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-sm border border-gray-100 text-[#00A859] group-hover:text-white group-hover:bg-[#00A859] transition-colors">
                {item.icon}
              </div>
              <div className="pt-10 pb-4 text-center">
                <span className="font-bold text-gray-900 text-sm group-hover:text-[#00A859] transition-colors">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
