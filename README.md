# Commerce Monorepo

An Nx monorepo containing a Next.js storefront and a NestJS BFF (Backend-for-Frontend).

## Requirements

- Node.js >= 20.9.0 (required by the storefront's Next.js version)

## Structure

```
apps/
  storefront/   - Next.js ecommerce frontend (port 3000)
  bff/          - NestJS backend-for-frontend (port 4000)
libs/
  shared-types/ - Shared TypeScript types
```

## Running locally

```bash
npm install

# Run both apps
npx nx run-many -t dev

# Run individually
npx nx dev storefront
npx nx dev bff
```

- Storefront: [localhost:3000](http://localhost:3000/)
- BFF: [localhost:4000](http://localhost:4000/health)

## Production Mode

```bash
# Build everything (including shared libs)
npm run build

# Start both production servers
npm run start
```

- Storefront production server: [localhost:3000](http://localhost:3000/)
- BFF production server: [localhost:4000](http://localhost:4000/health)

You can also run each app independently:

```bash
npm run start:storefront
npm run start:bff
```

Optional BFF feature flag:

- `RESOLVER_V2_ENABLED=true` enables the new `slots` payload in `/page-data/resolve`.
- `/page-data/bootstrap` returns `{pageModel, messages, localeContext}` for the catch-all storefront route.
- `/i18n/domain-config` provides domain-to-locale negotiation config.
- `/i18n/messages` returns locale namespace JSON payloads consumed by the storefront lookup runtime.

Optional storefront rollout flags:

- `NEXT_PUBLIC_CONSERVATIVE_PREFETCH=true` keeps page-link prefetch conservative (`shell` links prefetch, content links do not by default).
- `NEXT_PUBLIC_DEFER_SHELL_INTERACTIONS=true` defers cart and mobile-menu hydration until user intent.

Storefront i18n is BFF-authoritative:

1. BFF resolves locale and message catalogs.
2. Storefront performs thin key lookup over bootstrap `shell.messages`.
3. No locale JSON files are stored in the storefront app.

## Theme Catalog

The storefront is light-only and uses three BFF-assigned theme keys:

- `theme-default`: blue accents, medium control radius
- `theme-green`: green accents, full control radius
- `theme-orange`: orange accents, md control radius

Current store mapping from BFF domain config:

- `storefront.example.com` (`store-a`) -> `theme-default`
- `storefront.es.example.com` (`store-b`) -> `theme-green`
- `storefront.nl.example.com` (`store-c`) -> `theme-orange`
