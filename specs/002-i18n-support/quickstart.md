# Quickstart: i18n Development

## Prerequisites
- Node.js installed
- Dependencies installed: `npm install`

## Adding a New Translation
1. Open `apps/web/src/i18n/messages/zh.json` (as base).
2. Add your key-value pair.
3. Add the same key to `apps/web/src/i18n/messages/en.json` with the English translation.
4. In your component, use the `useTranslations` hook:
   ```tsx
   import { useTranslations } from 'next-intl';
   
   const t = useTranslations('Index');
   return <h1>{t('title')}</h1>;
   ```

## Switching Language Locally
- The language switcher in the header will update the URL path (e.g., from `/zh` to `/en`).
- The middleware will handle the redirection and locale detection.

## Verification
- Run tests: `npm test`
- Check linting: `npm run lint`
