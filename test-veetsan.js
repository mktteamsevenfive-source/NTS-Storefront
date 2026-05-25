const query = `
{
  products(first: 5, query: "vendor:veet* OR vendor:vees*") {
    nodes {
      title
      vendor
    }
  }
}
`;

fetch('https://zdhqgk-g2.myshopify.com/api/2024-01/graphql.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': '39950d94a2b24886432fe2d583d44ef4'
  },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(json => console.log(JSON.stringify(json, null, 2)))
.catch(err => console.error(err));


