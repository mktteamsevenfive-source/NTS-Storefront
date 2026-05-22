// Place holder for common formatting functions

export function formatPrice(amount: number, currencyCode: string = 'THB') {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}
