import {useRef, useState, useEffect} from 'react';
import {Link} from 'react-router';

import bakeryEquipment from '~/assets/category/bakery-equipment.jpg';
import bakeryUtensils from '~/assets/category/bakery-utensils.jpg';
import barSupplies from '~/assets/category/bar-supplies.jpg';
import beverageEquipment from '~/assets/category/beverage-equipment.jpg';
import commercialOvens from '~/assets/category/commercial-ovens.jpg';
import cookingEquipment from '~/assets/category/cooking-equipment.jpg';
import foodPreparation from '~/assets/category/food-preparation.jpg';
import hotelSupplies from '~/assets/category/hotel-supplies.jpg';
import janitorialSupplies from '~/assets/category/janitorial-supplies.jpg';
import refrigeratorEquipment from '~/assets/category/refrigerator-equipment.jpg';
import smallwares from '~/assets/category/smallwares.jpg';
import stainlessSteelFabrication from '~/assets/category/stainless-steel-fabrication.jpg';
import storageTransportation from '~/assets/category/storage-transportation.jpg';
import tabletopBuffetware from '~/assets/category/tabletop-buffetware.jpg';
import warewashingSanitation from '~/assets/category/warewashing-sanitation.jpg';
import warmingEquipment from '~/assets/category/warming-equipment.jpg';

interface StaticCategory {
  title: string;
  handle: string;
  image: string;
}

const STATIC_CATEGORIES: StaticCategory[] = [
  {title: 'Cooking Equipment', handle: 'cooking-equipment', image: cookingEquipment},
  {title: 'Food Preparation', handle: 'food-preparation', image: foodPreparation},
  {title: 'Refrigeration Equipment', handle: 'refrigeration-equipment', image: refrigeratorEquipment},
  {title: 'Commercial Ovens', handle: 'commercial-ovens', image: commercialOvens},
  {title: 'Bakery Equipment', handle: 'bakery-equipment', image: bakeryEquipment},
  {title: 'Warming Equipment', handle: 'warming-equipment', image: warmingEquipment},
  {title: 'Beverage Equipment', handle: 'beverage-equipment', image: beverageEquipment},
  {title: 'Stainless Steel Fabrication', handle: 'stainless-steel-fabrication', image: stainlessSteelFabrication},
  {title: 'Warewashing & Sanitation', handle: 'warewashing-sanitation', image: warewashingSanitation},
  {title: 'Storage & Transportation', handle: 'storage-transportation', image: storageTransportation},
  {title: 'Smallwares', handle: 'smallwares', image: smallwares},
  {title: 'Bakery Utensils', handle: 'bakery-utensils', image: bakeryUtensils},
  {title: 'Tabletop & Buffetware', handle: 'tabletop-buffetware', image: tabletopBuffetware},
  {title: 'Janitorial Supplies', handle: 'janitorial-supplies', image: janitorialSupplies},
  {title: 'Bar Supplies', handle: 'bar-supplies', image: barSupplies},
  {title: 'Hotel Supplies', handle: 'hotel-supplies', image: hotelSupplies},
];

export function CategoryGrid({
  collections: _,
}: {
  collections?: any;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // Scroll by 2 columns (approx 600px)
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Auto-slide effect with 3s delay
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const {scrollLeft, clientWidth, scrollWidth} = scrollRef.current;
        // Check if we are close to the end (within 15px)
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          // Loop back to the start
          scrollRef.current.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
        } else {
          // Scroll forward by 2 columns (approx 600px)
          scrollRef.current.scrollBy({
            left: 600,
            behavior: 'smooth',
          });
        }
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Shop by Category</h2>
      </div>
      <div 
        className="relative group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-[-15px] sm:left-[-25px] md:left-[-35px] lg:left-[-50px] xl:left-[-60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#00a87a] text-white flex items-center justify-center z-10 hover:bg-[#00c896] transition-colors shadow-md active:scale-95"
          aria-label="Scroll left"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        
        {/* Scroll Container (2 Rows) */}
        <div 
          ref={scrollRef}
          className="grid grid-rows-1 sm:grid-rows-2 grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[calc(25%-12px)] gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 select-none"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Hide webkit scrollbars inline */}
          <style dangerouslySetInnerHTML={{__html: `
            div::-webkit-scrollbar {
              display: none !important;
            }
          `}} />

          {STATIC_CATEGORIES.map((cat) => (
            <Link
              key={cat.handle}
              to={`/collections/${cat.handle}`}
              className="group block bg-[#f5f5f5] rounded-md overflow-hidden relative snap-start shadow-sm hover:shadow-md transition-shadow duration-300"
              prefetch="intent"
            >
              <div className="aspect-[4/3] p-4 flex items-center justify-center bg-white">
                <img
                  src={cat.image}
                  className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  alt={cat.title}
                  draggable={false}
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-md py-3 text-center shadow-sm border border-gray-100 group-hover:border-[#00a87a]/20 transition-colors">
                <h3 className="text-sm font-bold text-[#1a1a1a] truncate px-2 group-hover:text-[#00a87a] transition-colors">{cat.title}</h3>
                <span className="text-[0.65rem] text-[#00a87a] font-bold block uppercase tracking-wider mt-0.5 group-hover:scale-105 transition-transform">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-[-15px] sm:right-[-25px] md:right-[-35px] lg:right-[-50px] xl:right-[-60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#00a87a] text-white flex items-center justify-center z-10 hover:bg-[#00c896] transition-colors shadow-md active:scale-95"
          aria-label="Scroll right"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </section>
  );
}
