import {useState, useEffect, useCallback} from 'react';
import {Link} from 'react-router';
import bannerCooking from '~/assets/banner/banner-cooking.png';
import bannerRefrigeration from '~/assets/banner/banner-refrigeration.png';
import bannerHotel from '~/assets/banner/banner-hotel.png';

interface Slide {
  src: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cta?: {label: string; href: string};
  theme?: 'dark' | 'light'; // text colour on overlay
}

import heroDuck from '~/assets/banner/hero_duck.png';
import heroFoodpan from '~/assets/banner/hero_foodpan.png';
import heroBuffet from '~/assets/banner/hero_buffet.png';
import heroIcemaker from '~/assets/banner/hero_icemaker.png';
import heroFaucet from '~/assets/banner/hero_faucet.png';

const SLIDES_EN: Slide[] = [
  {
    src: bannerCooking,
    alt: 'Commercial Cooking Equipment',
    eyebrow: 'PROFESSIONAL GRADE',
    title: 'Commercial Cooking\nEquipment',
    subtitle: 'High-performance ovens, ranges and fryers built for the most demanding professional kitchens.',
    cta: {label: 'Shop Cooking Equipment', href: '/collections/cooking-equipment'},
    theme: 'dark',
  },
  {
    src: bannerRefrigeration,
    alt: 'Commercial Refrigeration',
    eyebrow: 'COLD CHAIN SOLUTIONS',
    title: 'Professional\nRefrigeration',
    subtitle: 'Walk-in coolers, commercial refrigerators and blast chillers engineered for reliability and efficiency.',
    cta: {label: 'Shop Refrigeration', href: '/collections/refrigeration'},
    theme: 'dark',
  },
  {
    src: bannerHotel,
    alt: 'Hotel & Restaurant Supplies',
    eyebrow: 'HOTEL SUPPLIES',
    title: 'Complete Hotel &\nRestaurant Solutions',
    subtitle: 'Premium tableware, serving equipment and hospitality supplies trusted by 5-star establishments.',
    cta: {label: 'Shop Hotel Supplies', href: '/collections/hotel-supplies'},
    theme: 'dark',
  },
  {
    src: heroDuck,
    alt: 'Duck Humid and Dry Blow Refrigerator',
    eyebrow: 'COMMERCIAL REFRIGERATION',
    title: 'Duck Humid &\nDry Blow Refrigerator',
    subtitle: 'Professional storage solutions for roasted duck and pork.',
    cta: {label: 'Shop Refrigeration', href: '/collections/refrigeration-equipment'},
    theme: 'dark',
  },
  {
    src: heroFoodpan,
    alt: 'Gastronorm Food Pan',
    eyebrow: 'KITCHEN ESSENTIALS',
    title: 'Gastronorm\nFood Pans',
    subtitle: 'High-quality stainless steel food pans for prep and storage.',
    cta: {label: 'Shop Smallwares', href: '/collections/smallwares'},
    theme: 'dark',
  },
  {
    src: heroBuffet,
    alt: 'Buffetware',
    eyebrow: 'CATERING & EVENTS',
    title: 'Premium\nBuffetware',
    subtitle: 'Elegant chafing dishes and serving equipment for events.',
    cta: {label: 'Shop Buffetware', href: '/collections/tableware-buffetware'},
    theme: 'dark',
  },
  {
    src: heroIcemaker,
    alt: 'Ice Maker',
    eyebrow: 'BEVERAGE EQUIPMENT',
    title: 'Commercial\nIce Makers',
    subtitle: 'Reliable high-capacity ice machines for bars and restaurants.',
    cta: {label: 'Shop Ice Makers', href: '/collections/ice-machines'},
    theme: 'dark',
  },
  {
    src: heroFaucet,
    alt: 'Faucet and Pre Rinse',
    eyebrow: 'WASHING SOLUTIONS',
    title: 'Faucets &\nPre-Rinse Units',
    subtitle: 'Heavy-duty commercial kitchen faucets for optimal hygiene.',
    cta: {label: 'Shop Faucets', href: '/collections/warewashing-sanitisation'},
    theme: 'dark',
  },
];

const SLIDES_TH: Slide[] = [
  {
    src: bannerCooking,
    alt: 'อุปกรณ์ทำอาหารเชิงพาณิชย์',
    eyebrow: 'คุณภาพระดับมืออาชีพ',
    title: 'อุปกรณ์ทำอาหาร\nเชิงพาณิชย์',
    subtitle: 'เตาอบ เตาทำอาหาร และเตาทอดประสิทธิภาพสูง ที่ออกแบบมาสำหรับห้องครัวระดับมืออาชีพ',
    cta: {label: 'เลือกซื้ออุปกรณ์ทำอาหาร', href: '/collections/cooking-equipment'},
    theme: 'dark',
  },
  {
    src: bannerRefrigeration,
    alt: 'ตู้แช่เย็นระดับมืออาชีพ',
    eyebrow: 'ระบบทำความเย็นครบวงจร',
    title: 'ตู้แช่เย็น\nระดับมืออาชีพ',
    subtitle: 'ห้องเย็น ตู้แช่เชิงพาณิชย์ และเครื่องแช่แข็งแบบฉับพลัน ที่ออกแบบมาเพื่อความทนทานและประสิทธิภาพสูง',
    cta: {label: 'เลือกซื้อตู้แช่เย็น', href: '/collections/refrigeration'},
    theme: 'dark',
  },
  {
    src: bannerHotel,
    alt: 'ของใช้ในโรงแรมและร้านอาหาร',
    eyebrow: 'ของใช้ในโรงแรม',
    title: 'โซลูชันสำหรับโรงแรม\nและร้านอาหารแบบครบวงจร',
    subtitle: 'อุปกรณ์บนโต๊ะอาหาร อุปกรณ์เสิร์ฟ และของใช้ในโรงแรมระดับพรีเมียมที่ได้รับการไว้วางใจจากสถานประกอบการระดับ 5 ดาว',
    cta: {label: 'เลือกซื้อของใช้ในโรงแรม', href: '/collections/hotel-supplies'},
    theme: 'dark',
  },
  {
    src: heroDuck,
    alt: 'ตู้แช่เป่าลม เป็ด หมูแดง หมูหัน',
    eyebrow: 'ตู้แช่เย็นเชิงพาณิชย์',
    title: 'ตู้แช่เป่าลม เป็ด\nหมูแดง หมูหัน',
    subtitle: 'โซลูชันการจัดเก็บระดับมืออาชีพสำหรับเป็ดย่างและหมูแดง',
    cta: {label: 'เลือกซื้อตู้แช่เย็น', href: '/collections/refrigeration-equipment'},
    theme: 'dark',
  },
  {
    src: heroFoodpan,
    alt: 'ถาดใส่อาหารสแตนเลส',
    eyebrow: 'อุปกรณ์ครัวพื้นฐาน',
    title: 'ถาดใส่อาหาร\nสแตนเลส (Gastronorm)',
    subtitle: 'ถาดอาหารสแตนเลสคุณภาพสูงสำหรับการเตรียมและจัดเก็บ',
    cta: {label: 'เลือกซื้ออุปกรณ์เครื่องครัว', href: '/collections/smallwares'},
    theme: 'dark',
  },
  {
    src: heroBuffet,
    alt: 'อุปกรณ์บุฟเฟ่ต์ งานจัดเลี้ยง',
    eyebrow: 'อุปกรณ์จัดเลี้ยง',
    title: 'อุปกรณ์บุฟเฟ่ต์\nระดับพรีเมียม',
    subtitle: 'อ่างอุ่นอาหารและอุปกรณ์เสิร์ฟที่หรูหราสำหรับงานจัดเลี้ยง',
    cta: {label: 'เลือกซื้ออุปกรณ์บุฟเฟ่ต์', href: '/collections/tableware-buffetware'},
    theme: 'dark',
  },
  {
    src: heroIcemaker,
    alt: 'เครื่องผลิตน้ำแข็ง',
    eyebrow: 'อุปกรณ์เครื่องดื่ม',
    title: 'เครื่องผลิตน้ำแข็ง\nเชิงพาณิชย์',
    subtitle: 'เครื่องทำน้ำแข็งความจุสูงที่วางใจได้สำหรับบาร์และร้านอาหาร',
    cta: {label: 'เลือกซื้อเครื่องทำน้ำแข็ง', href: '/collections/ice-machines'},
    theme: 'dark',
  },
  {
    src: heroFaucet,
    alt: 'ก๊อกน้ำและหัวฉีดชำระ',
    eyebrow: 'โซลูชันการล้างทำความสะอาด',
    title: 'ก๊อกน้ำและ\nหัวฉีดชำระ',
    subtitle: 'ก๊อกน้ำห้องครัวเชิงพาณิชย์แบบ Heavy-duty เพื่อสุขอนามัยที่ดีเยี่ยม',
    cta: {label: 'เลือกซื้ออุปกรณ์ทำความสะอาด', href: '/collections/warewashing-sanitisation'},
    theme: 'dark',
  },
];

const AUTO_PLAY_INTERVAL = 6000;

import type {LangCode} from '~/lib/locale';

export function HeroBanner({collection: _, lang = 'EN'}: {collection: unknown; lang?: LangCode}) {
  const slides = lang === 'TH' ? SLIDES_TH : SLIDES_EN;
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent((index + slides.length) % slides.length);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating, slides.length],
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => goTo(current + 1), AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [current, isHovered, goTo]);

  const slide = slides[current];

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      next();
    }
    if (distance < -50) {
      prev();
    }
  };

  return (
    <section
      className="sf-hero-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
      aria-label="Hero banner slideshow"
    >
      {/* Slides */}
      <div className="sf-hero-slider__track">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`sf-hero-slider__slide${i === current ? ' sf-hero-slider__slide--active' : ''}`}
            aria-hidden={i !== current}
          >
            <img
              src={s.src}
              alt={s.alt}
              className="sf-hero-slider__img"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Dark gradient overlay */}
      {slide.title && <div className="sf-hero-slider__overlay" />}

      {/* Text content */}
      {slide.title && (
        <div className={`sf-hero-slider__content${slide.theme === 'light' ? ' sf-hero-slider__content--light' : ''}`}>
          {slide.eyebrow && <p className="sf-hero-slider__eyebrow">{slide.eyebrow}</p>}
          <h1 className="sf-hero-slider__title">
            {slide.title.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < slide.title!.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
          {slide.subtitle && <p className="sf-hero-slider__subtitle">{slide.subtitle}</p>}
          {slide.cta && (
            <Link to={slide.cta.href} className="sf-hero-slider__cta" prefetch="intent">
              {slide.cta.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '0.5rem'}}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </div>
      )}
      {!slide.title && slide.cta && (
        <Link 
          to={slide.cta.href} 
          className="absolute inset-0 z-10 block" 
          aria-label={slide.cta.label}
          prefetch="intent" 
        />
      )}

      {/* Prev arrow */}
      <button
        className="sf-hero-slider__arrow sf-hero-slider__arrow--prev hidden md:flex"
        onClick={prev}
        aria-label="Previous slide"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        className="sf-hero-slider__arrow sf-hero-slider__arrow--next hidden md:flex"
        onClick={next}
        aria-label="Next slide"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="sf-hero-slider__dots" role="tablist" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`sf-hero-slider__dot${i === current ? ' sf-hero-slider__dot--active' : ''}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
