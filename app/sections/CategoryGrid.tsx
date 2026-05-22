import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

export function CategoryGrid({
  collections,
}: {
  collections: FeaturedCollectionFragment[];
}) {
  const cats = collections.length > 0 ? collections.slice(0, 8) : [];
  if (cats.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Shop by Category</h2>
      </div>
      <div className="relative">
        {/* Left Arrow (Decorative) */}
        <button className="absolute left-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#00a87a] text-white flex items-center justify-center z-10 hover:bg-[#00c896] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        
        <div className="grid grid-cols-4 gap-4">
          {cats.map((cat) => (
            <Link
              key={cat.id}
              to={`/collections/${cat.handle}`}
              className="group block bg-[#f5f5f5] rounded-md overflow-hidden relative"
              prefetch="intent"
            >
              <div className="aspect-[4/3] p-4 flex items-center justify-center">
                {cat.image ? (
                  <Image
                    data={cat.image}
                    sizes="(min-width: 45em) 25vw, 50vw"
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    alt={cat.title}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-md py-2 text-center shadow-sm">
                <h3 className="text-sm font-bold text-[#1a1a1a] truncate px-2">{cat.title}</h3>
                <span className="text-[0.65rem] text-gray-500 block uppercase tracking-wider mt-0.5">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow (Decorative) */}
        <button className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#00a87a] text-white flex items-center justify-center z-10 hover:bg-[#00c896] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </section>
  );
}
