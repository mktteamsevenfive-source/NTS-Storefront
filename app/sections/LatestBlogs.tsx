import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {getT} from '~/lib/locale';
import type {LangCode} from '~/lib/locale';

export function LatestBlogs({blogs, lang = 'EN'}: {blogs: Promise<any>; lang?: LangCode}) {
  const t = getT(lang);
  return (
    <section className="max-w-[1440px] mx-auto px-8 py-16 bg-[#fafafa]">
      <div className="relative flex items-center justify-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">{t.blogs}</h2>
        <Link to="/blogs/news" className="absolute right-0 text-sm font-semibold text-[#1a1a1a] hover:text-[#00a87a] transition-colors">
          {t.view_all_blogs}
        </Link>
      </div>

      <Suspense fallback={<p className="text-center text-gray-500 py-10">Loading blogs…</p>}>
        <Await resolve={blogs}>
          {(response) => {
            const articles = response?.blogs?.nodes?.[0]?.articles?.nodes || [];
            
            if (articles.length === 0) {
              // Fallback placeholder if no blogs are available in Shopify
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                      <div className="aspect-[16/9] bg-gray-200" />
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-[#1a1a1a] uppercase mb-1">TYPES OF CATERING</h3>
                        <span className="text-[0.65rem] text-gray-400 mb-3 block">March 11, 2023</span>
                        <p className="text-xs text-gray-600 line-clamp-3 mb-4 flex-1">
                          Food Service is the practice or business of making, transporting, and serving prepared foods. The purpose of food service is...
                        </p>
                        <Link to="/blogs/news" className="text-[#00a87a] text-xs font-bold mt-auto">
                          Read More &gt;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article: any) => {
                  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });

                  return (
                    <div key={article.id} className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 flex flex-col group">
                      <Link to={`/blogs/${article.blog.handle}/${article.handle}`} className="aspect-[16/9] block overflow-hidden">
                        {article.image ? (
                          <Image
                            data={article.image}
                            sizes="(min-width: 45em) 30vw, 100vw"
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </Link>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-[#1a1a1a] uppercase mb-1 line-clamp-1">
                          <Link to={`/blogs/${article.blog.handle}/${article.handle}`} className="hover:text-[#00a87a] transition-colors">
                            {article.title}
                          </Link>
                        </h3>
                        <span className="text-[0.65rem] text-gray-400 mb-3 block">{date}</span>
                        <p className="text-xs text-gray-600 line-clamp-3 mb-4 flex-1">
                          {article.excerpt || 'Read this full article on our blog.'}
                        </p>
                        <Link to={`/blogs/${article.blog.handle}/${article.handle}`} className="text-[#00a87a] text-xs font-bold mt-auto hover:text-[#00c896] transition-colors">
                          Read More &gt;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
}
