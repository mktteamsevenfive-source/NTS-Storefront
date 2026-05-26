import {ALLOWED_VENDORS} from '~/lib/brands';

export {ALLOWED_VENDORS};

export const VENDOR_FILTER = `(${ALLOWED_VENDORS.map((v) => `vendor:"${v}"`).join(' OR ')})`;

export const RECOMMENDED_VENDOR_FILTER = ALLOWED_VENDORS.map(
  (vendor) => `vendor:"${vendor}"`,
).join(' OR ');
