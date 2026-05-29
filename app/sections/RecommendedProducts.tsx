import {Suspense, useRef} from 'react';
import {Await, Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

import {getT} from '~/lib/locale';
import type {LangCode} from '~/lib/locale';

export function RecommendedProducts({
  products,
  lang = 'EN',
}: {
  products: Promise<RecommendedProductsQuery | null>;
  lang?: LangCode;
}) {
  const t = getT(lang);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 240; // approximate card width
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-8">
        <Suspense fallback={<p className="text-center text-gray-500 py-10">Loading products…</p>}>
          <Await resolve={products}>
            {(response) => {
              const hasCollectionProducts = response?.collection?.products?.nodes && response.collection.products.nodes.length > 0;
              const nodes = hasCollectionProducts 
                ? response.collection!.products.nodes 
                : response?.products?.nodes ?? [];
                
              if (!nodes.length) return null;

              // For demonstration of the 3-column layout, we will split the nodes into 3 groups
              const bestSellers = nodes.slice(0, 2);
              const newArrivals = nodes.slice(2, 4);
              const hotPromotions = nodes.slice(4, 6);

              const ProductCard = ({product, tag, tagColor}: {product: any, tag?: string, tagColor?: string}) => {
                const price = parseFloat(product.priceRange.minVariantPrice.amount);
                const compareAtPriceNode = product.selectedOrFirstAvailableVariant?.compareAtPrice;
                let compareAtPrice = 0;
                let discountPercent = 0;
                
                if (compareAtPriceNode && parseFloat(compareAtPriceNode.amount) > price) {
                  compareAtPrice = parseFloat(compareAtPriceNode.amount);
                  discountPercent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
                }

                return (
                  <Link
                    to={`/products/${product.handle}`}
                    className="flex flex-col bg-white border border-gray-100 rounded-lg p-4 relative hover:shadow-lg transition-shadow duration-300 w-full"
                    prefetch="intent"
                  >
                    {tag && (
                      <div className={`absolute top-4 left-4 ${tagColor || 'bg-red-600'} text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider z-10`}>
                        {tag}
                      </div>
                    )}
                    <div className="aspect-square mb-4 relative flex items-center justify-center">
                      {product.featuredImage ? (
                        <Image
                          data={product.featuredImage}
                          sizes="200px"
                          className="object-contain w-full h-full mix-blend-multiply"
                          alt={product.title}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 rounded-md" />
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      {product.vendor && (
                        <span className="text-gray-900 text-[10px] font-black uppercase tracking-wider mb-1">
                          {product.vendor}
                        </span>
                      )}
                      <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2 mb-2 min-h-[38px]">
                        {product.title}
                      </h3>
                      {compareAtPrice > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-gray-400 text-xs line-through">
                            <Money data={compareAtPriceNode} />
                          </span>
                          <span className="text-red-600 text-lg font-bold">
                            <Money data={product.priceRange.minVariantPrice} />
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-0.5 mt-[18px]">
                          <span className="text-gray-900 text-lg font-bold">
                            <Money data={product.priceRange.minVariantPrice} />
                          </span>
                        </div>
                      )}
                      <div className="text-[#00A859] text-[11px] font-bold mt-2">
                        In Stock
                      </div>
                    </div>
                  </Link>
                );
              };

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Best Sellers */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Best Sellers</h2>
                        <p className="text-[13px] text-gray-500">Trusted by professionals.</p>
                      </div>
                      <Link to="/collections/best-sellers" className="text-[#00A859] text-sm font-semibold flex items-center hover:underline">
                        View all <span className="ml-1">›</span>
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </div>

                  {/* New Arrivals */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">New Arrivals</h2>
                        <p className="text-[13px] text-gray-500">Latest products in stock.</p>
                      </div>
                      <Link to="/collections/new-arrivals" className="text-[#00A859] text-sm font-semibold flex items-center hover:underline">
                        View all <span className="ml-1">›</span>
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {newArrivals.map(p => <ProductCard key={p.id} product={p} tag="NEW" tagColor="bg-[#00A859]" />)}
                    </div>
                  </div>

                  {/* Hot Promotions */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Hot Promotions</h2>
                        <p className="text-[13px] text-gray-500">Special offers for your business</p>
                      </div>
                      <Link to="/collections/hot-promotions" className="text-[#00A859] text-sm font-semibold flex items-center hover:underline">
                        View all <span className="ml-1">›</span>
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {hotPromotions.map((p, i) => <ProductCard key={p.id} product={p} tag={`SALE ${Math.floor(Math.random() * 20 + 10)}%`} />)}
                    </div>
                  </div>
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}
