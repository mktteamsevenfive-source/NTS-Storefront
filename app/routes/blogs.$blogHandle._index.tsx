import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `NTS | ${data?.blog.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {pageBy: 9});

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {blogHandle: params.blogHandle, ...paginationVariables},
    }),
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;
  const nodes = articles.nodes ?? [];
  const [featured, ...rest] = nodes;

  return (
    <div className="sf-blog">
      {/* ── Hero / Page Header ── */}
      <div className="sf-blog__hero">
        <div className="sf-blog__hero-inner">
          <span className="sf-blog__hero-label">NTS Knowledge Hub</span>
          <h1 className="sf-blog__hero-title">{blog.title}</h1>
          <p className="sf-blog__hero-sub">
            Tips, guides and industry insights for food service professionals.
          </p>
        </div>
      </div>

      <div className="sf-blog__body">
        {/* ── Featured Article ── */}
        {featured && (
          <Link
            to={`/blogs/${featured.blog.handle}/${featured.handle}`}
            className="sf-blog__featured"
            prefetch="intent"
          >
            {featured.image && (
              <div className="sf-blog__featured-img-wrap">
                <Image
                  data={featured.image}
                  alt={featured.image.altText || featured.title}
                  aspectRatio="16/7"
                  loading="eager"
                  sizes="100vw"
                  className="sf-blog__featured-img"
                />
                <div className="sf-blog__featured-overlay" />
              </div>
            )}
            <div className="sf-blog__featured-content">
              <span className="sf-blog__tag">Featured</span>
              <h2 className="sf-blog__featured-title">{featured.title}</h2>
              <div className="sf-blog__featured-meta">
                {featured.author?.name && (
                  <span className="sf-blog__author">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {featured.author.name}
                  </span>
                )}
                <span className="sf-blog__date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {new Intl.DateTimeFormat('en-US', {year:'numeric',month:'long',day:'numeric'}).format(new Date(featured.publishedAt!))}
                </span>
                {featured.contentHtml && (
                  <span className="sf-blog__read-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {estimateReadTime(featured.contentHtml)} min read
                  </span>
                )}
              </div>
              <span className="sf-blog__read-btn">Read Article →</span>
            </div>
          </Link>
        )}

        {/* ── Grid ── */}
        {rest.length > 0 && (
          <div className="sf-blog__grid-section">
            <h2 className="sf-blog__section-title">Latest Articles</h2>
            <PaginatedResourceSection<ArticleItemFragment> connection={articles}>
              {({node: article, index}) => (
                <ArticleCard
                  article={article}
                  key={article.id}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  isFeatured={index === 0}
                />
              )}
            </PaginatedResourceSection>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  loading,
  isFeatured,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
  isFeatured?: boolean;
}) {
  if (isFeatured) return null; // already shown above

  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));

  const readTime = article.contentHtml
    ? estimateReadTime(article.contentHtml)
    : null;

  return (
    <Link
      to={`/blogs/${article.blog.handle}/${article.handle}`}
      className="sf-blog-card"
      prefetch="intent"
    >
      <div className="sf-blog-card__img-wrap">
        {article.image ? (
          <Image
            alt={article.image.altText || article.title}
            aspectRatio="16/9"
            data={article.image}
            loading={loading}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="sf-blog-card__img"
          />
        ) : (
          <div className="sf-blog-card__img-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        )}
        <div className="sf-blog-card__img-overlay" />
      </div>

      <div className="sf-blog-card__body">
        <h3 className="sf-blog-card__title">{article.title}</h3>

        <div className="sf-blog-card__meta">
          {article.author?.name && (
            <span className="sf-blog-card__author">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {article.author.name}
            </span>
          )}
          <span className="sf-blog-card__date">{publishedAt}</span>
          {readTime && (
            <span className="sf-blog-card__read-time">{readTime} min read</span>
          )}
        </div>

        <span className="sf-blog-card__cta">Read more →</span>
      </div>
    </Link>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
