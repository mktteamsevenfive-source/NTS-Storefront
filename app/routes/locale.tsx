import {redirect} from 'react-router';
import type {Route} from './+types/locale';

const LOCALE_PATH_MAP: Record<string, string> = {
  '/pages/how-to-pay-nts': '/pages/การชำระเงิน',
  '/pages/การชำระเงิน': '/pages/how-to-pay-nts',
  '/pages/warranty-policy-nts': '/pages/การรับประกัน',
  '/pages/การรับประกัน': '/pages/warranty-policy-nts',
  '/pages/after-sales-service': '/pages/บริการหลังการขาย',
  '/pages/บริการหลังการขาย': '/pages/after-sales-service',
  '/pages/installation-policy': '/pages/นโยบายการติดตั้ง',
  '/pages/นโยบายการติดตั้ง': '/pages/installation-policy',
  '/pages/who-we-are': '/pages/เกี่ยวกับเรา',
  '/pages/เกี่ยวกับเรา': '/pages/who-we-are',
  '/pages/service-center': '/pages/ศูนย์บริการ',
  '/pages/ศูนย์บริการ': '/pages/service-center',
  '/pages/contact-us': '/pages/ติดต่อเรา',
  '/pages/ติดต่อเรา': '/pages/contact-us',
};

export async function action({request}: Route.ActionArgs) {
  const form = await request.formData();
  const lang = form.get('lang')?.toString() ?? 'EN';
  const validLang = lang === 'TH' ? 'TH' : 'EN';
  const referer = request.headers.get('referer') ?? '/';

  let location = referer;
  try {
    const url = new URL(referer);
    const mappedPath = LOCALE_PATH_MAP[url.pathname];
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
