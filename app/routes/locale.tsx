import {redirect} from 'react-router';
import type {Route} from './+types/locale';

export async function action({request}: Route.ActionArgs) {
  const form = await request.formData();
  const lang = form.get('lang')?.toString() ?? 'EN';
  const validLang = lang === 'TH' ? 'TH' : 'EN';
  const referer = request.headers.get('referer') ?? '/';
  return redirect(referer, {
    headers: {
      'Set-Cookie': `lang=${validLang}; Path=/; Max-Age=31536000; SameSite=Lax`,
    },
  });
}
