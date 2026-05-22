export const ALLOWED_VENDORS = [
  'NTS',
  'PRIMO',
  'ABSOLUTE',
  'Cutlery Pro',
  'Top Rinse',
  'Iwatani',
  'Justa',
  'Kitchin',
  'VEESAN',
];

export const VENDOR_FILTER = `(${ALLOWED_VENDORS.map((v) => `vendor:"${v}"`).join(' OR ')})`;

export const RECOMMENDED_VENDOR_FILTER = ALLOWED_VENDORS.map(
  (vendor) => `vendor:"${vendor}"`,
).join(' OR ');
