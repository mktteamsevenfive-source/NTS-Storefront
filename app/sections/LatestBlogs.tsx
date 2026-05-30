import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {getT} from '~/lib/locale';
import type {LangCode} from '~/lib/locale';

export function LatestBlogs({blogs, lang = 'EN'}: {blogs: Promise<any>; lang?: LangCode}) {
  const t = getT(lang);
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Center</h2>
            <p className="text-gray-500">Tips, guides and inspiration for your business</p>
          </div>
          <Link to="/blogs/news" className="text-[#00A859] font-medium flex items-center hover:underline">
            View all articles <span className="ml-1">›</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Blog Posts (3 Columns) */}
          <div className="flex-1 w-full lg:w-3/4">
            <Suspense fallback={<p className="text-center text-gray-500 py-10">Loading blogs…</p>}>
              <Await resolve={blogs}>
                {(response) => {
                  const articles = response?.blogs?.nodes?.[0]?.articles?.nodes || [];
                  
                  if (articles.length === 0) {
                    // Fallback placeholder
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                            <div className="aspect-[4/3] bg-gray-200" />
                            <div className="p-5 flex flex-col flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="bg-[#00A859] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">GUIDE</span>
                                <span className="text-[11px] text-gray-400 font-medium">May 10, 2024</span>
                              </div>
                              <h3 className="text-base font-bold text-gray-900 leading-tight mb-3">
                                How to Choose the Right Combi Oven for Your Kitchen
                              </h3>
                              <Link to="/blogs/news" className="text-[#00A859] text-xs font-bold mt-auto flex items-center hover:underline">
                                Read more <span className="ml-1">›</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                      {articles.slice(0, 3).map((article: any, idx: number) => {
                        const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        });
                        const tag = idx === 0 ? 'GUIDE' : idx === 1 ? 'TIPS' : 'BUSINESS';
                        const tagColor = idx === 0 ? 'bg-[#00A859]' : idx === 1 ? 'bg-blue-600' : 'bg-orange-500';

                        return (
                          <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow">
                            <Link to={`/blogs/${article.blog.handle}/${article.handle}`} className="aspect-[4/3] block overflow-hidden relative">
                              {article.image ? (
                                <Image
                                  data={article.image}
                                  sizes="400px"
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200" />
                              )}
                            </Link>
                            <div className="p-5 flex flex-col flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className={`${tagColor} text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider`}>{tag}</span>
                                <span className="text-[11px] text-gray-400 font-medium">{date}</span>
                              </div>
                              <h3 className="text-base font-bold text-gray-900 leading-tight mb-3 line-clamp-2">
                                <Link to={`/blogs/${article.blog.handle}/${article.handle}`} className="hover:text-[#00A859] transition-colors">
                                  {article.title}
                                </Link>
                              </h3>
                              <Link to={`/blogs/${article.blog.handle}/${article.handle}`} className="text-[#00A859] text-xs font-bold mt-auto flex items-center hover:underline">
                                Read more <span className="ml-1">›</span>
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
          </div>

          {/* Right: Expert Advice CTA */}
          <div className="w-full lg:w-1/4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between relative">
            <div className="p-6 pb-0 z-10">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Need Expert Advice?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Our experts are ready to help you find the right equipment.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-[#00A859] shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Quick response
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-[#00A859] shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Professional consultation
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-[#00A859] shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Solution tailored to your needs
                </li>
              </ul>
              
              <Link to="/pages/contact-us-nts" className="bg-[#00A859] text-white px-6 py-3 rounded-md font-bold hover:bg-[#008a49] transition-colors w-full flex items-center justify-center gap-2">
                TALK TO AN EXPERT
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </Link>
            </div>
            
            {/* Portrait placeholder */}
            <div className="relative h-48 mt-4 bg-gray-100 shrink-0">
              <img src="/images/expert_portrait.png" alt="NTS Expert" className="absolute bottom-0 w-full object-cover object-top h-64 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
