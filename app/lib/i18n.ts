import type {I18nBase} from '@shopify/hydrogen';

export type LangCode = 'EN' | 'TH';

export function getLangFromRequest(request: Request): LangCode {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/(?:^|;\s*)lang=([^;]+)/);
  return match?.[1]?.toUpperCase() === 'TH' ? 'TH' : 'EN';
}

export function getLocaleFromRequest(request: Request): I18nBase {
  const lang = getLangFromRequest(request);
  return lang === 'TH'
    ? {language: 'TH', country: 'TH'}
    : {language: 'EN', country: 'TH'};
}
