# Research: i18n for Next.js App Router

## Decision: Use `next-intl`

### Rationale
- **Next.js Native**: Built specifically for the App Router and React Server Components (RSC).
- **Type Safety**: Provides excellent TypeScript support for translation keys.
- **Workflow**: Supports JSON-based messages which is simple and standard.
- **Middleware**: Handles locale detection and routing efficiently.

### Alternatives Considered
- **`react-i18next`**: Industry standard but requires more boilerplate to work with RSC (requires a separate service for server-side loading).
- **Native Next.js (middleware only)**: Low-level; requires manual implementation of message loading and interpolation.
- **`react-intl`**: Reliable but the developer experience for App Router is less streamlined compared to `next-intl`.

## Patterns for Success
1. **Locale-based Routing**: Use `[locale]` dynamic segment to enable SEO and clear language state.
2. **Standard Messages**: Store messages in `apps/web/src/i18n/messages/{locale}.json`.
3. **Shared Types**: Define translation keys or common i18n utilities in `packages/savings-core` if reusable.
4. **Client Components**: Use `NextIntlClientProvider` to pass messages to client-side components like `SimulationForm`.

## Unknowns Resolved
- **React 19 Compatibility**: `next-intl` is compatible with React 19 as it relies on standard React patterns and Next.js APIs.
- **Tailwind V4**: Tailwind v4's logical properties (`ms-*`, `me-*`) make it easier to support RTL if needed in the future, though Chinese/English are both LTR.
