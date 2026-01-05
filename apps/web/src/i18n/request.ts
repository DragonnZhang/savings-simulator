import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {Locale, LOCALES} from 'savings-core';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This should correspond to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !LOCALES.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
