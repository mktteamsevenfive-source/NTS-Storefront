import type {LangCode} from '~/lib/locale';

export function LanguageSwitcher({lang}: {lang: LangCode}) {
  return (
    <form method="post" action="/locale" className="sf-lang-switcher">
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
    </form>
  );
}
