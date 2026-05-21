import {redirect} from 'react-router';
import type {Route} from './+types/locale';

const TO_THAI_PATH_MAP: Record<string, string> = {
  '/pages/how-to-pay-nts': '/pages/การชำระเงิน',
  '/pages/warranty-policy-nts': '/pages/การรับประกัน',
  '/pages/after-sales-service': '/pages/บริการหลังการขาย',
  '/pages/installation-policy': '/pages/นโยบายการติดตั้ง',
  '/pages/who-we-are': '/pages/เกี่ยวกับเรา',
  '/pages/service-center': '/pages/ศูนย์บริการ',
  '/pages/contact-us': '/pages/ติดต่อเรา',
};

const TO_ENGLISH_PATH_MAP = Object.fromEntries(
  Object.entries(TO_THAI_PATH_MAP).map(([enPath, thPath]) => [thPath, enPath]),
);

export async function action({request}: Route.ActionArgs) {
  const form = await request.formData();
  const lang = form.get('lang')?.toString() ?? 'EN';
  const validLang = lang === 'TH' ? 'TH' : 'EN';
  const referer = request.headers.get('referer') ?? '/';

  let location = referer;
  try {
    const url = new URL(referer);
    const rawPath = decodeURIComponent(url.pathname);
    const lookupKey = rawPath in TO_THAI_PATH_MAP || rawPath in TO_ENGLISH_PATH_MAP ? rawPath : url.pathname;
    const mappedPath =
      validLang === 'TH'
        ? TO_THAI_PATH_MAP[lookupKey]
        : TO_ENGLISH_PATH_MAP[lookupKey];

    if (mappedPath) {
      url.pathname = mappedPath;
      location = url.toString();
    }
  } catch {
    location = referer;
  }

  return redirect(location, {
    headers: {
      'Set-Cookie': `lang=${validLang}; Path=/; Max-Age=31536000; SameSite=Lax`,
    },
  });
}
