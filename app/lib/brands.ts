export const ALLOWED_VENDORS = [
  'NTS',
  'PRIMO',
  'ABSOLUTE',
  'Cutlery Pro',
  'Top Rinse',
  'Iwatani',
  'Justa',
  'Kitchin',
  'VEETSAN',
] as const;

export const VENDOR_DISPLAY_NAMES: Record<string, string> = {
  VEETSAN: 'Veetsan',
};

export function getVendorDisplayName(vendor: string) {
  return VENDOR_DISPLAY_NAMES[vendor] || vendor;
}
