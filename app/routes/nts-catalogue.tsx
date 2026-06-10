import type {Route} from './+types/nts-catalogue';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Hydrogen | NTS Catalogue'},
    {name: 'description', content: 'NTS Product Catalogue'},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  return {
    page: {
      handle: 'nts-catalogue',
      id: 'nts-catalog-page',
      title: 'Catalogue',
      body: '',
      seo: {
        title: 'NTS Catalogue',
        description: 'NTS Product Catalogue',
      },
    },
  };
}

export default function NTSCatalogue() {
  return (
    <div className="page">
      <header>
        {/* Title is hidden for catalog */}
      </header>
      <main className="sf-catalog-main">
        <div className="sf-catalog-embed">
          <iframe
            src="https://online.fliphtml5.com/dsalh/okjv/"
            title="NTS-catalogue New 2021"
            seamless
            scrolling="no"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </main>
    </div>
  );
}
