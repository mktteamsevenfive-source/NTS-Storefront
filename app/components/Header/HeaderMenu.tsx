import {useState} from 'react';
import {NavLink, Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {NTS_MENU_TREE, type CsvMenuNode} from '~/lib/menu';
import {type Viewport} from '~/types';
import type {HeaderQuery} from 'storefrontapi.generated';
import {getT} from '~/lib/locale';
import type {LangCode, T} from '~/lib/locale';

interface HeaderProps {
  header: HeaderQuery;
  publicStoreDomain: string;
}

function getTrans(title: string, t: T): string {
  return t.categories?.[title as keyof typeof t.categories] || (t as any)[`menu_${title.toLowerCase().replace(/ /g, '_')}`] || title;
}

function MobileMenuItem({node, close, t, depth = 0}: {node: CsvMenuNode; close: () => void; t: T; depth?: number}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <div className={`sf-header__mobile-item sf-header__mobile-item--level-${depth}${isOpen ? ' sf-header__mobile-item--open' : ''}`}>
      <div className="sf-header__mobile-item-header">
        <NavLink
          className="sf-header__nav-link"
          end
          onClick={close}
          prefetch="intent"
          to={node.url}
        >
          {getTrans(node.title, t)}
        </NavLink>
        {hasChildren && (
          <button
            className="sf-header__mobile-toggle"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
            aria-label="Toggle submenu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`sf-chevron ${isOpen ? 'sf-chevron--up' : 'sf-chevron--down'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        )}
      </div>
      {hasChildren && (
        <div className="sf-header__subnav-wrapper">
          <div className={`sf-header__subnav sf-header__subnav--level-${depth + 1}`} role="menu">
            {node.children.map((child) => (
              <MobileMenuItem key={child.id} node={child} close={close} t={t} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenuTree({nodes, close, t}: {nodes: CsvMenuNode[]; close: () => void; t: T}) {
  return (
    <>
      {nodes.map((node) => (
        <MobileMenuItem key={node.id} node={node} close={close} t={t} depth={0} />
      ))}
    </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  availableHandles,
  lang,
  collections,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  availableHandles?: Set<string>;
  lang?: LangCode;
  collections?: any;
}) {
  const t = getT(lang || 'EN');
  const className = `sf-header__nav sf-header__nav--${viewport}`;
  const {close} = useAside();
  const [openMegaMenuId, setOpenMegaMenuId] = useState<string | null>(null);

  function getHandle(url: string): string {
    const m = url.match(/\/collections\/([^/?#]+)/);
    return m ? m[1] : '';
  }

  function filterChildren(nodes: CsvMenuNode[], parentTitle?: string): CsvMenuNode[] {
    if (!availableHandles) return nodes;
    return nodes
      .map((node) => ({
        ...node,
        children: filterChildren(node.children, node.title),
      }))
      .filter((node) => {
        if (node.level === 1) return true;
        const handle = getHandle(node.url);
        if (!handle) return true;
        if (parentTitle === 'Hotel Supplies') return true;
        return availableHandles.has(handle) || node.children.length > 0;
      });
  }

  const menuItems = filterChildren(NTS_MENU_TREE);

  if (viewport === 'mobile') {
    return (
      <nav className={className} role="navigation">
        <MobileMenuTree nodes={menuItems} close={close} t={t} />
      </nav>
    );
  }

  return (
    <nav className={className} role="navigation">
      {menuItems.map((item) => {
        const hasMegaMenu = item.children.length > 0;

        return (
          <div
            className={`sf-header__nav-item${hasMegaMenu ? ' sf-header__nav-item--has-mega' : ''}${openMegaMenuId === item.id ? ' sf-header__nav-item--mega-open' : ''}`}
            key={item.id}
            onMouseEnter={() => { if (hasMegaMenu) setOpenMegaMenuId(item.id); }}
            onMouseLeave={() => { if (hasMegaMenu) setOpenMegaMenuId(null); }}
          >
            <NavLink
              className={({isActive}) =>
                `sf-header__nav-link flex items-center gap-1.5${isActive ? ' sf-header__nav-link--active' : ''}`
              }
              end
              onClick={close}
              prefetch="intent"
              to={item.url}
            >
              {getTrans(item.title, t)}
              {hasMegaMenu && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mt-0.5"><polyline points="6 9 12 15 18 9"/></svg>
              )}
            </NavLink>

            {hasMegaMenu && (
              <div
                className="sf-mega-menu"
                role="menu"
                onMouseEnter={() => setOpenMegaMenuId(item.id)}
                onMouseLeave={() => setOpenMegaMenuId(null)}
              >
                <MegaMenuContent item={item} close={close} t={t} lang={lang} collections={collections} />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

const CUSTOM_CAT_TRANS: Record<string, { EN: string; TH: string }> = {
  'Food Preparation': { EN: 'Food Preparation', TH: 'เครื่องเตรียมอาหาร' },
  'Cooking Equipment': { EN: 'Cooking Equipment', TH: 'อุปกรณ์ทำอาหาร' },
  'Refrigeration & Freezing': { EN: 'Refrigeration & Freezing', TH: 'อุปกรณ์ทำความเย็น' },
  'Bakery Equipment': { EN: 'Bakery Equipment', TH: 'อุปกรณ์เบเกอรี่' },
  'Beverage Equipment': { EN: 'Beverage Equipment', TH: 'อุปกรณ์เครื่องดื่ม' },
  'Dishwashing Equipment': { EN: 'Dishwashing Equipment', TH: 'อุปกรณ์ล้างจานเชิงพาณิชย์' },
  'Cleaning & Hygiene': { EN: 'Cleaning & Hygiene', TH: 'อุปกรณ์ทำความสะอาดและสุขอนามัย' },
  'Stainless Steel & Sinks': { EN: 'Stainless Steel & Sinks', TH: 'เครื่องครัวสแตนเลสและอ่างล้างจาน' },
  'Storage & Shelving': { EN: 'Storage & Shelving', TH: 'ชั้นวางและอุปกรณ์จัดเก็บ' },
  'Ventilation & Hood': { EN: 'Ventilation & Hood', TH: 'เครื่องดูดควันและระบบระบายอากาศ' },
};

const SPARE_PARTS_CAT_TRANS: Record<string, { EN: string; TH: string }> = {
  'Consumables & Service Parts': { EN: 'Consumables & Service Parts', TH: 'ชิ้นส่วนสิ้นเปลืองและอะไหล่บริการ' },
  'Control Boards & Sensors': { EN: 'Control Boards & Sensors', TH: 'บอร์ดควบคุมและเซ็นเซอร์' },
  'Electrical & Electronic Components': { EN: 'Electrical & Electronic Components', TH: 'ชิ้นส่วนไฟฟ้าและอิเล็กทรอนิกส์' },
  'Mechanical & Mounting Hardware': { EN: 'Mechanical & Mounting Hardware', TH: 'ชิ้นส่วนกลไกและตัวยึดติดตั้ง' },
  'Safety & Protection Devices': { EN: 'Safety & Protection Devices', TH: 'อุปกรณ์ป้องกันและความปลอดภัย' },
  'Structural & Access Components': { EN: 'Structural & Access Components', TH: 'ชิ้นส่วนโครงสร้างและตัวเปิดปิด' },
  'Heating, Ignition & Gas Parts': { EN: 'Heating, Ignition & Gas Parts', TH: 'อะไหล่ระบบความร้อน จุดระเบิด และแก๊ส' },
  'Motors, Fans & Actuators': { EN: 'Motors, Fans & Actuators', TH: 'มอเตอร์ พัดลม และตัวกระตุ้น' },
  'Pumps, Compressors & Fluid Systems': { EN: 'Pumps, Compressors & Fluid Systems', TH: 'ปั๊ม คอมเพรสเซอร์ และระบบของเหลว' },
  'Storage, Handling & Mobility': { EN: 'Storage, Handling & Mobility', TH: 'อุปกรณ์จัดเก็บ การขนย้าย และการเคลื่อนที่' }
};

const POPULAR_CAT_TRANS: Record<string, { EN: string; TH: string }> = {
  'Combi Oven': { EN: 'Combi Oven', TH: 'เตาอบคอมบิ' },
  'Ice Machine': { EN: 'Ice Machine', TH: 'เครื่องทำน้ำแข็ง' },
  'Refrigerator': { EN: 'Refrigerator', TH: 'ตู้แช่เย็น' },
  'Meat Slicer': { EN: 'Meat Slicer', TH: 'เครื่องสไลด์เนื้อ' },
  'Mixer': { EN: 'Mixer', TH: 'เครื่องผสมอาหาร' },
  'Deep Fryer': { EN: 'Deep Fryer', TH: 'เตาทอดไฟฟ้า' },
};

const SIDEBAR_CATEGORIES = [
  {
    title: 'Food Preparation',
    url: '/collections/food-preparation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M10 3v4h4V3M9 7h6l-1 10H10L9 7zM9 17h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-3zM12 10v4"/>
      </svg>
    )
  },
  {
    title: 'Cooking Equipment',
    url: '/collections/cooking-equipment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8z"/>
        <path d="M2 10h20M12 4v3M8 5v2M16 5v2"/>
      </svg>
    )
  },
  {
    title: 'Refrigeration & Freezing',
    url: '/collections/refrigeration-equipment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 2h14v20H5V2zM5 10h14M8 6v2M8 14v4"/>
      </svg>
    )
  },
  {
    title: 'Bakery Equipment',
    url: '/collections/bakery-equipment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18c0-2 1-3 3-4M18 18c0-2-1-3-3-4M9 14c0-3.5 1.5-6 3-6s3 2.5 3 6M5 18h14v3H5v-3z"/>
      </svg>
    )
  },
  {
    title: 'Beverage Equipment',
    url: '/collections/beverage-equipment',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2M5 8h12L15 20H7L5 8zM6 2l2 6M14 2l-2 6"/>
      </svg>
    )
  },
  {
    title: 'Dishwashing Equipment',
    url: '/collections/warewashing-sanitisation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2"/>
        <path d="M4 8h16M8 6h.01M12 6h.01M8 12h8v4H8v-4z"/>
      </svg>
    )
  },
  {
    title: 'Cleaning & Hygiene',
    url: '/collections/janitorial-supplies',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2h4M12 2v4M9 6h6v4H9zM9 10l-1 11h8l-1-11H9zM12 13v4"/>
      </svg>
    )
  },
  {
    title: 'Stainless Steel & Sinks',
    url: '/collections/stainless-steel-fabrication',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v12H4V4zM4 10h16M9 10v6M15 10v6M8 4V2h2v2M14 4V2h2v2"/>
      </svg>
    )
  },
  {
    title: 'Storage & Shelving',
    url: '/collections/storage-transport',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18M21 3v18M3 7h18M3 13h18M3 19h18"/>
      </svg>
    )
  },
  {
    title: 'Ventilation & Hood',
    url: '/collections/commercial-exhaust-hood',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8v6H8V2zM4 14l4-6h8l4 6v8H4v-8zM12 14v4M9 16h6"/>
      </svg>
    )
  }
];

const SPARE_PARTS_SIDEBAR_CATEGORIES = [
  {
    title: 'Consumables & Service Parts',
    url: '/collections/consumables-service-parts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    )
  },
  {
    title: 'Control Boards & Sensors',
    url: '/collections/control-boards-sensors',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/>
      </svg>
    )
  },
  {
    title: 'Electrical & Electronic Components',
    url: '/collections/electrical-electronic-components',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    )
  },
  {
    title: 'Mechanical & Mounting Hardware',
    url: '/collections/mechanical-mounting-hardware',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    )
  },
  {
    title: 'Safety & Protection Devices',
    url: '/collections/safety-protection-devices',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  },
  {
    title: 'Structural & Access Components',
    url: '/collections/structural-access-components',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 3v18M3 9h6M3 15h6"/>
      </svg>
    )
  },
  {
    title: 'Heating, Ignition & Gas Parts',
    url: '/collections/heating-ignition-gas-parts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    )
  },
  {
    title: 'Motors, Fans & Actuators',
    url: '/collections/motors-fans-actuators',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v20M2 12h20M12 12l5.5-5.5M12 12l-5.5 5.5M12 12l5.5 5.5M12 12L6.5 6.5"/>
      </svg>
    )
  },
  {
    title: 'Pumps, Compressors & Fluid Systems',
    url: '/collections/pumps-compressors-fluid-systems',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  {
    title: 'Storage, Handling & Mobility',
    url: '/collections/storage-handling-mobility',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
    )
  }
];

const POPULAR_CATEGORIES = [
  { title: 'Combi Oven',   url: '/collections/commercial-ovens',       img: '/images/hero_buffet.png' },
  { title: 'Ice Machine',  url: '/collections/beverage-equipment',      img: '/images/hero_icemaker.png' },
  { title: 'Refrigerator', url: '/collections/refrigeration-equipment', img: '/images/hero_duck.png' },
  { title: 'Meat Slicer',  url: '/collections/food-preparation',        img: '/images/hero_foodpan.png' },
  { title: 'Mixer',        url: '/collections/food-preparation',        img: '/images/hero_faucet.png' },
  { title: 'Deep Fryer',   url: '/collections/cooking-equipment',       img: '/images/biz_central_kitchen.png' },
];

const BRAND_LOGOS = [
  {
    name: 'RATIONAL',
    url: '/collections/rational',
    logo: (
      <svg viewBox="0 0 100 32" width="90" height="28" style={{display:'block'}}>
        <rect x="1" y="1" width="98" height="30" fill="none" stroke="#c8102e" strokeWidth="2.5" rx="3"/>
        <text x="50" y="21.5" textAnchor="middle" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="13.5" fill="#c8102e" letterSpacing="0.2">RATIONAL</text>
      </svg>
    )
  },
  {
    name: 'HOSHIZAKI',
    url: '/collections/hoshizaki',
    logo: (
      <svg viewBox="0 0 120 32" width="110" height="28" style={{display:'block'}}>
        <text x="5" y="21" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#1a1a1a" letterSpacing="0.8">HOSHIZAKI</text>
        <path d="M110 8l4 4-4 4 4-4z" stroke="#00A859" strokeWidth="2"/>
      </svg>
    )
  },
  {
    name: 'robot coupe',
    url: '/collections/robot-coupe',
    logo: (
      <svg viewBox="0 0 110 32" width="100" height="28" style={{display:'block'}}>
        <text x="5" y="21" fontFamily="'Inter', 'Arial Black', sans-serif" fontStyle="italic" fontWeight="900" fontSize="15" fill="#c8102e" letterSpacing="-0.2">robot coupe</text>
      </svg>
    )
  },
  {
    name: 'SIRMAN',
    url: '/collections/sirman',
    logo: (
      <svg viewBox="0 0 90 32" width="80" height="28" style={{display:'block'}}>
        <text x="2" y="22" fontFamily="'Inter', 'Arial Black', sans-serif" fontStyle="italic" fontWeight="900" fontSize="19" fill="#c8102e" letterSpacing="0.2">SIRMAN</text>
      </svg>
    )
  },
  {
    name: 'UNOX',
    url: '/collections/unox',
    logo: (
      <svg viewBox="0 0 85 32" width="80" height="28" style={{display:'block'}}>
        <rect x="2" y="3" width="81" height="26" rx="13" fill="#1a1a1a"/>
        <text x="42.5" y="20.5" textAnchor="middle" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="#ffffff" letterSpacing="1">UNOX</text>
      </svg>
    )
  },
  {
    name: 'CAMBRO',
    url: '/collections/cambro',
    logo: (
      <svg viewBox="0 0 95 32" width="90" height="28" style={{display:'block'}}>
        <text x="5" y="21" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="15.5" fill="#c8102e" letterSpacing="0.4">CAMBRO</text>
      </svg>
    )
  }
];

const QUICK_LINKS = [
  { title: 'Best Sellers',   url: '/collections/best-sellers', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { title: 'New Arrivals',   url: '/collections/new-arrivals', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { title: 'Promotions',     url: '/collections/promotions',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg> },
  { title: 'Clearance Sale', url: '/collections/clearance',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><polyline points="8 6 18 6 18 16"/></svg> },
];

function MegaMenuContent({item, close, t, lang, collections}: {item: CsvMenuNode; close: () => void; t: T; lang?: LangCode; collections?: any}) {
  const isProductMenu = item.title === 'Product';
  const isSparePartsMenu = item.title === 'Spare Parts';

  const [activeCatTitle, setActiveCatTitle] = useState<string>(
    isProductMenu ? 'Food Preparation' :
    isSparePartsMenu ? 'Consumables & Service Parts' :
    (item.children[0]?.title ?? '')
  );

  const activeCategoryNode = item.children.find(
    (child) => child.title.toLowerCase().trim() === activeCatTitle.toLowerCase().trim()
  ) || item.children.find(
    (child) => child.title.toLowerCase().includes(activeCatTitle.toLowerCase())
  ) || item.children[0] || null;

  const brandHandles = [
    'cutlery-pro',
    'top-rinse',
    'primo',
    'nts',
    'iwatani',
    'absolute',
    'justa',
    'kitchin',
    'veetsan',
  ];

  const brandDisplayNames: Record<string, string> = {
    'cutlery-pro': 'Cutlery-Pro',
    'top-rinse': 'Top-Rinse',
    'primo': 'PRIMO',
    'nts': 'nts',
    'iwatani': 'Iwatani',
    'absolute': 'Absolute',
    'justa': 'JUSTA',
    'kitchin': 'kitchin',
    'veetsan': 'VEETSAN',
  };

  const renderBrandLogo = (handle: string) => {
    const col = collections?.nodes?.find((c: any) => c.handle === handle);
    const displayName = brandDisplayNames[handle] || handle;

    const renderFallback = () => (
      <span className="text-[14px] font-black text-[#1a1a1a] tracking-tighter uppercase select-none">
        {displayName === 'nts' ? (
          <span className="lowercase tracking-widest text-[#00a87a] flex items-center gap-1 text-[12px]">
            ✤ nts ✤
          </span>
        ) : displayName === 'Iwatani' ? (
          <span className="text-[#e02b27] text-[13px]">{displayName}</span>
        ) : (
          displayName
        )}
      </span>
    );

    return (
      <Link
        key={handle}
        to={`/collections/${handle}`}
        className="flex items-center justify-center bg-white border border-gray-100 rounded-xl p-2 h-[52px] shadow-sm hover:scale-[1.03] hover:border-[#00A859] hover:shadow-md transition-all duration-200"
        onClick={close}
      >
        {col?.image?.url ? (
          <img
            src={col.image.url}
            alt={col.image.altText || displayName}
            className="object-contain w-full h-full max-h-[38px]"
          />
        ) : (
          renderFallback()
        )}
      </Link>
    );
  };

  return (
    <div className="sf-mega-menu__inner">

      {/* LEFT: Category list */}
      <div className="sf-mega-menu__sidebar">
        {isProductMenu ? (
          SIDEBAR_CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              to={cat.url}
              className={`sf-mega-menu__sidebar-item-link flex items-center gap-3 py-2.5 px-4 text-[13px] font-semibold transition-colors border-l-2 ${
                activeCatTitle === cat.title
                  ? 'bg-green-50/50 text-[#00A859] border-[#00A859]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#00A859] border-transparent hover:border-[#00A859]'
              }`}
              onMouseEnter={() => setActiveCatTitle(cat.title)}
              onClick={close}
              prefetch="intent"
            >
              <span className={`flex items-center shrink-0 ${activeCatTitle === cat.title ? 'text-[#00A859]' : 'text-gray-400'}`}>
                {cat.icon}
              </span>
              <span className="flex-1 text-left">
                {lang === 'TH' ? CUSTOM_CAT_TRANS[cat.title].TH : CUSTOM_CAT_TRANS[cat.title].EN}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 transition-transform ${activeCatTitle === cat.title ? 'text-[#00A859] translate-x-0.5' : 'text-gray-300'}`}><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          ))
        ) : isSparePartsMenu ? (
          SPARE_PARTS_SIDEBAR_CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              to={cat.url}
              className={`sf-mega-menu__sidebar-item-link flex items-center gap-3 py-2.5 px-4 text-[13px] font-semibold transition-colors border-l-2 ${
                activeCatTitle === cat.title
                  ? 'bg-green-50/50 text-[#00A859] border-[#00A859]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#00A859] border-transparent hover:border-[#00A859]'
              }`}
              onMouseEnter={() => setActiveCatTitle(cat.title)}
              onClick={close}
              prefetch="intent"
            >
              <span className={`flex items-center shrink-0 ${activeCatTitle === cat.title ? 'text-[#00A859]' : 'text-gray-400'}`}>
                {cat.icon}
              </span>
              <span className="flex-1 text-left">
                {lang === 'TH' ? SPARE_PARTS_CAT_TRANS[cat.title].TH : SPARE_PARTS_CAT_TRANS[cat.title].EN}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 transition-transform ${activeCatTitle === cat.title ? 'text-[#00A859] translate-x-0.5' : 'text-gray-300'}`}><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          ))
        ) : (
          item.children.map((group) => (
            <Link
              key={group.id}
              to={group.url}
              className={`sf-mega-menu__sidebar-item-link flex items-center gap-3 py-2.5 px-4 text-[13px] font-semibold transition-colors border-l-2 ${
                activeCatTitle === group.title
                  ? 'bg-green-50/50 text-[#00A859] border-[#00A859]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#00A859] border-transparent hover:border-[#00A859]'
              }`}
              onMouseEnter={() => setActiveCatTitle(group.title)}
              onClick={close}
              prefetch="intent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{flexShrink:0}} className={activeCatTitle === group.title ? 'text-[#00A859]' : 'text-gray-500'}>
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
              <span style={{flex:1}} className="text-left">{getTrans(group.title, t)}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 transition-transform ${activeCatTitle === group.title ? 'text-[#00A859] translate-x-0.5' : 'text-gray-300'}`}><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          ))
        )}
        <Link to="/collections" className="sf-mega-menu__view-all-cats text-[#00A859] hover:text-[#008f4c] font-bold text-[12px] pt-3 mt-2 border-t border-gray-100 px-4" onClick={close}>
          {lang === 'TH' ? 'ดูหมวดหมู่ทั้งหมด' : 'VIEW ALL CATEGORIES'}
        </Link>
      </div>

      {/* CENTER: Dynamic Subcategories + Popular categories + Featured brands */}
      <div className="sf-mega-menu__center">
        {/* 1. Dynamic Subcategories list (restored sub menu) */}
        {activeCategoryNode && activeCategoryNode.children.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <p className="sf-mega-menu__section-label !m-0 !text-[#00A859]">
                {lang === 'TH'
                  ? `${isSparePartsMenu ? (SPARE_PARTS_CAT_TRANS[activeCategoryNode.title]?.TH || activeCategoryNode.title) : (CUSTOM_CAT_TRANS[activeCategoryNode.title]?.TH || getTrans(activeCategoryNode.title, t))} (หมวดหมู่ย่อย)`
                  : `${activeCategoryNode.title} SUBCATEGORIES`}
              </p>
              <Link
                to={activeCategoryNode.url}
                className="text-[#00A859] text-[11px] font-bold hover:underline transition-colors flex items-center gap-0.5"
                onClick={close}
              >
                {lang === 'TH' ? 'ดูทั้งหมด →' : 'View all →'}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 bg-[#f6faf7] p-4.5 rounded-xl border border-[#e2ece7]">
              {activeCategoryNode.children.map((sub) => (
                <Link
                  key={sub.id}
                  to={sub.url}
                  className="text-gray-700 hover:text-[#00A859] text-[12.5px] font-semibold flex items-center gap-2 transition-colors truncate"
                  onClick={close}
                >
                  <span className="text-[#00A859]/70 text-[6px] shrink-0">●</span>
                  <span className="truncate">{getTrans(sub.title, t)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 2. Popular Categories + Featured Brands (Only for Product Menu) */}
        {isProductMenu && (
          <>
            <p className="sf-mega-menu__section-label">
              {lang === 'TH' ? 'หมวดหมู่ยอดนิยม' : 'POPULAR CATEGORIES'}
            </p>
            <div className="sf-mega-menu__popular-grid mb-6">
              {POPULAR_CATEGORIES.map((cat) => (
                <Link key={cat.title} to={cat.url} className="sf-mega-menu__popular-item group" onClick={close} prefetch="intent">
                  <div className="sf-mega-menu__popular-img-wrap border border-gray-100 rounded-xl overflow-hidden aspect-square bg-white shadow-sm flex items-center justify-center p-2 group-hover:border-[#00A859] transition-all duration-200">
                    <img src={cat.img} alt={cat.title} className="sf-mega-menu__popular-img w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <span className="sf-mega-menu__popular-name text-[11px] font-bold text-gray-700 text-center mt-1 group-hover:text-[#00A859] transition-colors leading-snug">
                    {lang === 'TH' ? POPULAR_CAT_TRANS[cat.title].TH : POPULAR_CAT_TRANS[cat.title].EN}
                  </span>
                </Link>
              ))}
            </div>

            <p className="sf-mega-menu__section-label">
              {lang === 'TH' ? 'แบรนด์ยอดนิยม' : 'FEATURED BRANDS'}
            </p>
            <div className="sf-mega-menu__brands-row grid grid-cols-5 gap-3">
              {brandHandles.map(renderBrandLogo)}
            </div>
          </>
        )}
      </div>

      {/* RIGHT: Quick links + Expert advice */}
      <div className="sf-mega-menu__right">
        <p className="sf-mega-menu__section-label">
          {lang === 'TH' ? 'ลิงก์ด่วน' : 'QUICK LINKS'}
        </p>
        <div className="sf-mega-menu__quick-links">
          {QUICK_LINKS.map((link) => (
            <Link key={link.title} to={link.url} className="sf-mega-menu__quick-link text-gray-700 hover:text-[#00A859] hover:bg-gray-50 text-[13px] font-semibold" onClick={close} prefetch="intent">
              <span style={{color:'#9ca3af', display:'flex', alignItems:'center'}} className="group-hover:text-[#00A859]">{link.icon}</span>
              {lang === 'TH' && link.title === 'Best Sellers' ? 'สินค้าขายดี' :
               lang === 'TH' && link.title === 'New Arrivals' ? 'สินค้าใหม่' :
               lang === 'TH' && link.title === 'Promotions' ? 'โปรโมชั่น' :
               lang === 'TH' && link.title === 'Clearance Sale' ? 'สินค้าล้างสต๊อก' :
               link.title}
            </Link>
          ))}
        </div>

        <div className="sf-mega-menu__expert-box bg-[#eef7f2] border-0 rounded-xl p-5 flex gap-4 items-center mt-auto">
          <div style={{flex:1}} className="flex flex-col gap-1.5">
            <p className="sf-mega-menu__expert-title text-[#1a3a2a] text-[13px] font-extrabold uppercase tracking-wide m-0">
              {lang === 'TH' ? 'ต้องการคำแนะนำ?' : 'NEED EXPERT ADVICE?'}
            </p>
            <p className="sf-mega-menu__expert-desc text-gray-500 text-[11px] font-medium leading-relaxed m-0 mb-2">
              {lang === 'TH' ? 'ผู้เชี่ยวชาญของเราพร้อมช่วยคุณเลือกอุปกรณ์ที่ถูกต้อง' : 'Our experts are ready to help you find the right equipment.'}
            </p>
            <Link to="/pages/contact" className="sf-mega-menu__expert-btn self-start inline-flex items-center gap-2 bg-white text-[#00A859] border border-[#e2eae6] rounded-lg px-4 py-2 text-[11px] font-bold shadow-sm hover:bg-[#00A859] hover:text-white transition-all duration-200" onClick={close}>
              {lang === 'TH' ? 'คุยกับผู้เชี่ยวชาญ' : 'TALK TO AN EXPERT'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </Link>
          </div>
          <div className="bg-[#def0e5] p-3 rounded-full flex items-center justify-center shrink-0 self-start">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}
