import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

export function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="max-w-[1440px] mx-auto px-8 pb-16">
      <Suspense fallback={<p className="text-center text-gray-500 py-10">Loading products…</p>}>
        <Await resolve={products}>
          {(response) => {
            if (!response || !response.products.nodes.length) return null;
            const nodes = response.products.nodes;
            
            return (
              <div className="relative">
                {/* Left Arrow */}
                <button className="absolute left-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#00a87a] text-white flex items-center justify-center z-10 hover:bg-[#00c896] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {nodes.map((product) => {
                    const price = parseFloat(product.priceRange.minVariantPrice.amount);
                    const compareAtPriceNode = (product as any).selectedOrFirstAvailableVariant?.compareAtPrice;
                    let compareAtPrice = 0;
                    let discountPercent = 0;
                    
                    if (compareAtPriceNode && parseFloat(compareAtPriceNode.amount) > price) {
                      compareAtPrice = parseFloat(compareAtPriceNode.amount);
                      discountPercent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
                    }

                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.handle}`}
                        className="group flex flex-col bg-white border border-gray-200 rounded-md p-3 relative hover:shadow-lg transition-shadow duration-300"
                        prefetch="intent"
                      >
                        {/* Discount Badge */}
                        {discountPercent > 0 && (
                          <div className="absolute top-2 right-2 bg-[#e02b27] text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full z-10">
                            -{discountPercent}%
                          </div>
                        )}

                        <div className="aspect-square mb-3 relative flex items-center justify-center overflow-hidden">
                          {product.featuredImage ? (
                            <Image
                              data={product.featuredImage}
                              sizes="(min-width: 45em) 15vw, 50vw"
                              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                              alt={product.title}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>

                        <div className="flex flex-col flex-1 text-left">
                          {product.vendor && (
                            <span className="text-[#00a87a] text-[0.65rem] font-bold uppercase tracking-wider mb-1">
                              {product.vendor}
                            </span>
                          )}
                          <h3 className="text-xs font-semibold text-[#1a1a1a] leading-snug line-clamp-2 mb-2 flex-1">
                            {product.title}
                          </h3>
                          
                          <div className="mt-auto">
                            {compareAtPrice > 0 ? (
                              <div className="flex flex-col">
                                <span className="text-gray-400 text-[0.65rem] line-through">
                                  <Money data={compareAtPriceNode} />
                                </span>
                                <span className="text-[#e02b27] text-sm font-bold">
                                  <Money data={product.priceRange.minVariantPrice} />
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-[#e02b27] text-sm font-bold">
                                  <Money data={product.priceRange.minVariantPrice} />
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Right Arrow */}
                <button className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#00a87a] text-white flex items-center justify-center z-10 hover:bg-[#00c896] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            );
          }}
        </Await>
      </Suspense>

      <div className="text-center mt-8">
        <Link to="/collections/all" className="inline-block text-sm font-bold text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:text-[#00a87a] hover:border-[#00a87a] transition-colors">
          View All Product
        </Link>
      </div>
    </section>
  );
}
