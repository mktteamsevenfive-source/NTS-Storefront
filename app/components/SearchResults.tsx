import {Link, useSearchParams} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="sf-search-section">
      <h2 className="sf-search-section__title">Articles</h2>
      <div className="sf-search-articles">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              prefetch="intent"
              to={articleUrl}
              key={article.id}
              className="sf-search-article-link"
            >
              {article.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="sf-search-section">
      <h2 className="sf-search-section__title">Pages</h2>
      <div className="sf-search-articles">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              prefetch="intent"
              to={pageUrl}
              key={page.id}
              className="sf-search-article-link"
            >
              {page.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
  total = 0,
}: PartialSearchResult<'products'> & {total?: number}) {
  if (!products?.nodes.length) {
    return null;
  }

  const [searchParams] = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1'));

  return (
    <div className="sf-search-section">
      <Pagination connection={products}>
        {({nodes, hasPreviousPage, hasNextPage, nextPageUrl, previousPageUrl}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <Link
                prefetch="intent"
                to={productUrl}
                key={product.id}
                className="sf-search-product-card"
              >
                <div className="sf-search-product-card__img-wrap">
                  {image ? (
                    <Image
                      data={image}
                      alt={product.title}
                      width={240}
                      height={240}
                      className="sf-search-product-card__img"
                    />
                  ) : (
                    <div className="sf-search-product-card__no-img">
                      No image
                    </div>
                  )}
                </div>
                <div className="sf-search-product-card__body">
                  {product.vendor && (
                    <span className="sf-search-product-card__vendor">
                      {product.vendor}
                    </span>
                  )}
                  <p className="sf-search-product-card__title">
                    {product.title}
                  </p>
                  {price && (
                    <span className="sf-search-product-card__price">
                      <Money data={price} />
                    </span>
                  )}
                </div>
              </Link>
            );
          });

          function withPage(url: string, page: number): string {
            if (/[?&]page=/.test(url)) {
              return url.replace(/([?&])page=\d+/, `$1page=${page}`);
            }
            return `${url}${url.includes('?') ? '&' : '?'}page=${page}`;
          }

          const prevUrl = hasPreviousPage ? withPage(previousPageUrl, currentPage - 1) : null;
          const nextUrl = hasNextPage ? withPage(nextPageUrl, currentPage + 1) : null;

          const showPaginator = hasPreviousPage || hasNextPage;

          return (
            <div>
              <div className="sf-search-product-grid">{ItemsMarkup}</div>
              {showPaginator && (
                <nav className="sf-paginator">
                  {prevUrl ? (
                    <Link to={prevUrl} className="sf-paginator__btn sf-paginator__btn--arrow">‹</Link>
                  ) : (
                    <span className="sf-paginator__btn sf-paginator__btn--arrow sf-paginator__btn--disabled">‹</span>
                  )}

                  {hasPreviousPage && prevUrl && (
                    <Link to={prevUrl} className="sf-paginator__btn">{currentPage - 1}</Link>
                  )}

                  <span className="sf-paginator__btn sf-paginator__btn--active">{currentPage}</span>

                  {hasNextPage && nextUrl && (
                    <Link to={nextUrl} className="sf-paginator__btn">{currentPage + 1}</Link>
                  )}

                  {nextUrl ? (
                    <Link to={nextUrl} className="sf-paginator__btn sf-paginator__btn--arrow">›</Link>
                  ) : (
                    <span className="sf-paginator__btn sf-paginator__btn--arrow sf-paginator__btn--disabled">›</span>
                  )}
                </nav>
              )}
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="sf-search-empty">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <p>No products found. Try a different search term.</p>
    </div>
  );
}
