export function BrandTrust() {
  const features = [
    {
      iconUrl: 'https://api.iconify.design/lucide/badge-percent.svg?color=%231a1a1a',
      title: 'Best Price Guarantee',
      subtitle: 'Best value assured with exclusive special offers'
    },
    {
      iconUrl: 'https://api.iconify.design/lucide/package.svg?color=%231a1a1a',
      title: 'Large Stock',
      subtitle: 'Over 35,000 items ready to meet all your needs'
    },
    {
      iconUrl: 'https://api.iconify.design/lucide/truck.svg?color=%231a1a1a',
      title: 'Free Shipping',
      subtitle: 'On orders over ฿5,000 to Bangkok, Phuket & Samui'
    },
    {
      iconUrl: 'https://api.iconify.design/lucide/headset.svg?color=%231a1a1a',
      title: 'After-Sales Service',
      subtitle: 'Expert support & consultation 24 hours, 365 days'
    },
    {
      iconUrl: 'https://api.iconify.design/lucide/wrench.svg?color=%231a1a1a',
      title: 'Repair & Maintenance',
      subtitle: 'Inspection and repairs by certified technicians'
    }
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-10 border-t border-b border-gray-100 my-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {features.map((item, index) => (
          <div key={index} className="flex items-center gap-4 md:border-r md:border-gray-200 md:pr-4 last:border-r-0">
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
              <span className="text-sm font-bold text-[#1a1a1a] leading-tight mb-1">{item.title}</span>
              <span className="text-[11px] text-gray-500 leading-normal">{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
