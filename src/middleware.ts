import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(tr|en|nl)/:path*', '/((?!_next|_vercel|admin|.*\\..*).*)']
};
