# Next.js Commerce

A high-performance, server-rendered Next.js App Router ecommerce application.

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more.

## Architecture

The frontend communicates with a Backend-for-Frontend (BFF) layer via `lib/api/`. Currently, the BFF responses are mocked in `lib/api/mock-data.ts`. To connect to a real BFF, update the functions in `lib/api/index.ts` to fetch from your API.

### Key directories

- `lib/api/` - BFF client (data fetching functions + mock data)
- `lib/types.ts` - Domain types (Product, Cart, Collection, etc.)
- `components/` - UI components
- `app/` - Next.js App Router pages

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets.

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).
