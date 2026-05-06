export type LangCode = 'EN' | 'TH';

export const translations = {
  EN: {
    // Header / nav
    search_placeholder: 'Search products...',
    cart: 'Cart',
    account: 'Account',
    view_all: 'View all',
    products: 'products',
    // Filters
    filters: 'FILTERS',
    clear_all: 'Clear all',
    apply: 'Apply',
    price: 'Price',
    to: 'to',
    // Sort / show toolbar
    sort_by: 'Sort By',
    show: 'Show',
    sort_featured: 'Featured',
    sort_best_selling: 'Best selling',
    sort_name_asc: 'Product name A–Z',
    sort_name_desc: 'Product name Z–A',
    sort_price_asc: 'Lowest price',
    sort_price_desc: 'Highest price',
    sort_newest: 'New arrivals',
    // Product card
    no_image: 'No image',
    add_to_cart: 'Add to Cart',
    sold_out: 'Sold out',
    unavailable: 'Unavailable',
  },
  TH: {
    // Header / nav
    search_placeholder: 'ค้นหาสินค้า...',
    cart: 'ตะกร้า',
    account: 'บัญชีผู้ใช้',
    view_all: 'ดูทั้งหมด',
    products: 'สินค้า',
    // Filters
    filters: 'ตัวกรอง',
    clear_all: 'ล้างทั้งหมด',
    apply: 'ยืนยัน',
    price: 'ราคา',
    to: 'ถึง',
    // Sort / show toolbar
    sort_by: 'เรียงตาม',
    show: 'แสดง',
    sort_featured: 'แนะนำ',
    sort_best_selling: 'ขายดี',
    sort_name_asc: 'ชื่อสินค้า ก–ฮ',
    sort_name_desc: 'ชื่อสินค้า ฮ–ก',
    sort_price_asc: 'ราคาต่ำสุด',
    sort_price_desc: 'ราคาสูงสุด',
    sort_newest: 'สินค้าใหม่',
    // Product card
    no_image: 'ไม่มีรูปภาพ',
    add_to_cart: 'เพิ่มลงตะกร้า',
    sold_out: 'สินค้าหมด',
    unavailable: 'ไม่พร้อมจำหน่าย',
  },
} as const;

export type T = typeof translations['EN'];

export function getT(lang: LangCode): T {
  return translations[lang] as T;
}
