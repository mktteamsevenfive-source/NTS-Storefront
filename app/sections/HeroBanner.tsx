import {useState, useEffect, useCallback} from 'react';
import {Link} from 'react-router';
import bannerCooking from '~/assets/banner/banner-cooking.png';
import bannerRefrigeration from '~/assets/banner/banner-refrigeration.png';
import bannerHotel from '~/assets/banner/banner-hotel.png';

interface Slide {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: {label: string; href: string};
  theme: 'dark' | 'light'; // text colour on overlay
}

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
];

const AUTO_PLAY_INTERVAL = 6000;

import type {LangCode} from '~/lib/locale';

export function HeroBanner({collection: _, lang = 'EN'}: {collection: unknown; lang?: LangCode}) {
  const slides = lang === 'TH' ? SLIDES_TH : SLIDES_EN;
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [animating, setAnimating] = useState(false);

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

  return (
    <section
      className="sf-hero-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      <div className="sf-hero-slider__overlay" />

      {/* Text content */}
      <div className={`sf-hero-slider__content${slide.theme === 'light' ? ' sf-hero-slider__content--light' : ''}`}>
        <p className="sf-hero-slider__eyebrow">{slide.eyebrow}</p>
        <h1 className="sf-hero-slider__title">
          {slide.title.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < slide.title.split('\n').length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="sf-hero-slider__subtitle">{slide.subtitle}</p>
        <Link to={slide.cta.href} className="sf-hero-slider__cta" prefetch="intent">
          {slide.cta.label}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '0.5rem'}}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

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
