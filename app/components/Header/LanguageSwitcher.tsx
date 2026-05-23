import type {LangCode} from '~/lib/locale';

export function LanguageSwitcher({lang}: {lang: LangCode}) {
  return (
    <form method="post" action="/locale" className="sf-lang-switcher">
      <div className="sf-lang-switcher__wrapper">
        <select
          name="lang"
          defaultValue={lang}
          onChange={(e) => e.currentTarget.form?.submit()}
          className="sf-lang-switcher__select"
          aria-label="Select language"
        >
          <option value="EN">English</option>
          <option value="TH">ภาษาไทย</option>
        </select>
        {/* Crisp inline SVG arrow that responds to hover states */}
        <svg
          className="sf-lang-switcher__arrow"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </div>
    </form>
  );
}
