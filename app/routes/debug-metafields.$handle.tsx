/**
 * TEMPORARY DEBUG ROUTE — ลบทิ้งหลังใช้งานแล้ว
 * เข้าถึงผ่าน: /debug-metafields/<product-handle>
 * เช่น: /debug-metafields/upright-freezer-w1900-d860mm-6-doors
 *
 * แสดงให้เห็นว่า metafield key ไหนมีค่า และ key ไหน null
 */

import {useLoaderData} from 'react-router';
import type {Route} from './+types/debug-metafields.$handle';

// รายการ key ที่จะลองดึง (ปรับได้ตามต้องการ)
const CANDIDATE_KEYS = [
  // dimensions
  {namespace: 'custom', key: 'width_mm'},
  {namespace: 'custom', key: 'depth_mm'},
  {namespace: 'custom', key: 'height_mm'},
  {namespace: 'custom', key: 'weight_kg'},
  // electrical
  {namespace: 'custom', key: 'voltage'},
  {namespace: 'custom', key: 'hz'},
  {namespace: 'custom', key: 'wattage'},
  {namespace: 'custom', key: 'ampere'},
  // specs
  {namespace: 'custom', key: 'refrigerant'},
  {namespace: 'custom', key: 'spareparts_warranty'},
  {namespace: 'custom', key: 'service_warranty'},
  {namespace: 'custom', key: 'product_of'},
  {namespace: 'custom', key: 'certificates'},
  // packing
  {namespace: 'custom', key: 'packing_width_mm'},
  {namespace: 'custom', key: 'packing_length_mm'},
  {namespace: 'custom', key: 'packing_height_mm'},
  {namespace: 'custom', key: 'gross_weight_kg'},
  {namespace: 'custom', key: 'net_weight_kg'},
  {namespace: 'custom', key: 'volume_mc'},
  {namespace: 'custom', key: 'rack_size_mm'},
  // pdf
  {namespace: 'custom', key: 'link_pdf'},
  // alternative naming
  {namespace: 'custom', key: 'width'},
  {namespace: 'custom', key: 'depth'},
  {namespace: 'custom', key: 'height'},
  {namespace: 'custom', key: 'weight'},
  {namespace: 'custom', key: 'packing_width'},
  {namespace: 'custom', key: 'packing_depth'},
  {namespace: 'custom', key: 'packing_height'},
  {namespace: 'custom', key: 'gross_weight'},
  {namespace: 'custom', key: 'net_weight'},
  {namespace: 'custom', key: 'volume'},
  {namespace: 'custom', key: 'rack_size'},
  {namespace: 'custom', key: 'country_of_origin'},
  {namespace: 'custom', key: 'warranty_parts'},
  {namespace: 'custom', key: 'warranty_service'},
  {namespace: 'custom', key: 'spec_pdf'},
  {namespace: 'custom', key: 'pdf'},
];

const IDENTIFIERS_GQL = CANDIDATE_KEYS.map(
  ({namespace, key}) => `{namespace: "${namespace}", key: "${key}"}`,
).join(', ');

const DEBUG_QUERY = `#graphql
  query DebugMetafields($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      metafields(identifiers: [${IDENTIFIERS_GQL}]) {
        namespace
        key
        value
        type
      }
    }
  }
` as const;

export async function loader({context, params}: Route.LoaderArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Missing handle', {status: 400});

  const {product} = await context.storefront.query(DEBUG_QUERY, {
    variables: {handle},
  });

  if (!product) throw new Response('Product not found', {status: 404});

  return {product, candidateCount: CANDIDATE_KEYS.length};
}

export default function DebugMetafields() {
  const {product, candidateCount} = useLoaderData<typeof loader>();

  const found = (product.metafields ?? []).filter((m: any) => m?.value != null);
  const missing = CANDIDATE_KEYS.filter(
    ({namespace, key}) =>
      !found.find((m: any) => m.namespace === namespace && m.key === key),
  );

  return (
    <div style={{fontFamily: 'monospace', padding: '2rem', maxWidth: 900}}>
      <h1 style={{fontSize: '1.2rem', marginBottom: 4}}>
        🔍 Debug Metafields
      </h1>
      <p style={{color: '#666', marginBottom: '2rem'}}>
        Product: <strong>{product.title}</strong> ({product.handle})<br />
        Tried {candidateCount} keys — found {found.length} with values
      </p>

      <h2 style={{color: 'green', fontSize: '1rem', marginBottom: 8}}>
        ✅ มีค่า ({found.length})
      </h2>
      {found.length === 0 ? (
        <p style={{color: '#999'}}>ไม่พบ metafield ที่มีค่า</p>
      ) : (
        <table style={{borderCollapse: 'collapse', width: '100%', marginBottom: '2rem'}}>
          <thead>
            <tr style={{background: '#f0fdf4'}}>
              <th style={th}>namespace</th>
              <th style={th}>key</th>
              <th style={th}>type</th>
              <th style={th}>value</th>
            </tr>
          </thead>
          <tbody>
            {found.map((m: any) => (
              <tr key={`${m.namespace}.${m.key}`}>
                <td style={td}>{m.namespace}</td>
                <td style={{...td, fontWeight: 700}}>{m.key}</td>
                <td style={{...td, color: '#888'}}>{m.type}</td>
                <td style={{...td, wordBreak: 'break-all'}}>{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{color: '#dc2626', fontSize: '1rem', marginBottom: 8}}>
        ❌ ไม่พบค่า ({missing.length})
      </h2>
      <div style={{color: '#999', fontSize: '0.8rem', columns: 2, columnGap: '2rem'}}>
        {missing.map(({namespace, key}) => (
          <div key={`${namespace}.${key}`}>{namespace}.{key}</div>
        ))}
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  padding: '0.5rem 0.75rem',
  textAlign: 'left',
  fontSize: '0.8rem',
};
const td: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  padding: '0.45rem 0.75rem',
  fontSize: '0.82rem',
};
