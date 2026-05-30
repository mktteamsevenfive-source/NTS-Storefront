import type {LangCode} from '~/lib/locale';

const FEATURES_EN = [
  {
    iconUrl: 'https://api.iconify.design/lucide/shield-check.svg?color=%23ffffff',
    title: 'Best Price Guarantee',
    subtitle: 'Best value assured with exclusive special offers'
  },
  {
    iconUrl: 'https://api.iconify.design/lucide/boxes.svg?color=%23ffffff',
    title: 'Large Stock',
    subtitle: 'Over 35,000 items ready to meet all your needs'
  },
  {
    iconUrl: 'https://api.iconify.design/lucide/truck.svg?color=%23ffffff',
    title: 'Free Shipping',
    subtitle: 'On orders over ฿5,000 to Bangkok, Phuket & Samui'
  },
  {
    iconUrl: 'https://api.iconify.design/lucide/headset.svg?color=%23ffffff',
    title: 'After-Sales Service',
    subtitle: 'Expert support & consultation 24 hours, 365 days'
  },
  {
    iconUrl: 'https://api.iconify.design/lucide/wrench.svg?color=%23ffffff',
    title: 'Repair & Maintenance',
    subtitle: 'Inspection and repairs by certified technicians'
  }
];

const FEATURES_TH = [
  {
    iconUrl: 'https://api.iconify.design/lucide/shield-check.svg?color=%23ffffff',
    title: 'รับประกันราคาดีที่สุด',
    subtitle: 'คุ้มค่าที่สุดด้วยข้อเสนอสุดพิเศษ'
  },
  {
    iconUrl: 'https://api.iconify.design/lucide/boxes.svg?color=%23ffffff',
    title: 'สินค้าพร้อมส่ง',
    subtitle: 'สินค้ากว่า 35,000 รายการพร้อมตอบสนองทุกความต้องการ'
  },
  {
    iconUrl: 'https://api.iconify.design/lucide/truck.svg?color=%23ffffff',
    title: 'จัดส่งฟรี',
    subtitle: 'เมื่อสั่งซื้อครบ 5,000 บาท ในเขตกรุงเทพฯ ภูเก็ต และสมุย'
  },
  {
    iconUrl: 'https://api.iconify.design/lucide/headset.svg?color=%23ffffff',
    title: 'บริการหลังการขาย',
    subtitle: 'ทีมผู้เชี่ยวชาญพร้อมให้คำปรึกษาตลอด 24 ชั่วโมง 365 วัน'
  },
  {
    iconUrl: 'https://api.iconify.design/lucide/wrench.svg?color=%23ffffff',
    title: 'บริการซ่อมบำรุง',
    subtitle: 'ตรวจสอบและซ่อมแซมโดยช่างผู้ชำนาญการ'
  }
];

export function BrandTrust({lang = 'EN'}: {lang?: LangCode}) {
  const features = lang === 'TH' ? FEATURES_TH : FEATURES_EN;

  return (
    <section className="w-full bg-[#00A859] text-white py-10 mt-8 mb-0">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((item, index) => (
            <div key={index} className="flex items-center gap-4 lg:border-r lg:border-white/20 lg:pr-4 last:border-r-0">
              <div className="flex-shrink-0">
                <img
                  src={item.iconUrl}
                  alt={item.title}
                  width="40"
                  height="40"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white leading-tight mb-1">{item.title}</span>
                <span className="text-[11px] text-green-100 leading-normal">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
