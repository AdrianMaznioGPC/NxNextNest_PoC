# Commerce Monorepo

An Nx monorepo containing a Next.js storefront and a NestJS BFF (Backend-for-Frontend).

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
