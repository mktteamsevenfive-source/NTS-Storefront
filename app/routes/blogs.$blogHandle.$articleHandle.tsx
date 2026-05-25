import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `NTS | ${data?.article.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {handle: articleHandle, data: blog.articleByHandle},
    {handle: blogHandle, data: blog},
  );

  const article = blog.articleByHandle;
  return {article, blogHandle};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Article() {
  const {article, blogHandle} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  const readTime = contentHtml ? estimateReadTime(contentHtml) : null;

  return (
    <div className="sf-article">
      {/* ── Hero Image ── */}
      {image && (
        <div className="sf-article__hero">
          <Image
            data={image}
            alt={image.altText || title}
            sizes="100vw"
            loading="eager"
            className="sf-article__hero-img"
          />
          <div className="sf-article__hero-overlay" />
          <div className="sf-article__hero-content">
            <Link to={`/blogs/${blogHandle}`} className="sf-article__back-link">
              ← Back to News
            </Link>
            <h1 className="sf-article__hero-title">{title}</h1>
            <div className="sf-article__hero-meta">
              {author?.name && (
                <span className="sf-article__meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {author.name}
                </span>
              )}
              <span className="sf-article__meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {publishedDate}
              </span>
              {readTime && (
                <span className="sf-article__meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {readTime} min read
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── No-image fallback header ── */}
      {!image && (
        <div className="sf-article__header">
          <div className="sf-article__header-inner">
            <Link to={`/blogs/${blogHandle}`} className="sf-article__back-link sf-article__back-link--dark">
              ← Back to News
            </Link>
            <h1 className="sf-article__title">{title}</h1>
            <div className="sf-article__meta sf-article__meta--dark">
              {author?.name && (
                <span className="sf-article__meta-item sf-article__meta-item--dark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {author.name}
                </span>
              )}
              <span className="sf-article__meta-item sf-article__meta-item--dark">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {publishedDate}
              </span>
              {readTime && (
                <span className="sf-article__meta-item sf-article__meta-item--dark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {readTime} min read
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Article Body ── */}
      <div className="sf-article__body">
        <div
          className="sf-article__content"
          dangerouslySetInnerHTML={{__html: contentHtml}}
        />

        {/* ── Footer ── */}
        <div className="sf-article__footer">
          <Link to={`/blogs/${blogHandle}`} className="sf-article__footer-back">
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}

const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
