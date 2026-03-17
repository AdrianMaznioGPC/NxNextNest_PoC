# Commerce Monorepo

A multi-store e-commerce platform built with Next.js 15 and NestJS, following a Backend-for-Frontend (BFF) pattern with hexagonal architecture. The BFF aggregates, enriches, and shapes data from multiple backend services into page-ready responses. The storefront is a thin rendering layer with no business logic.

## Architecture

```
Browser ──→ Caddy (domain routing) ──→ Next.js Storefront (:3000)
                                              │
                                         fetch() calls
                                              │
                                              ▼
                                       NestJS BFF (:4000)
                                              │
                                    ┌─────────┼─────────┐
                                    ▼         ▼         ▼
                              Product    Pricing   Availability
                              Port       Port      Port
```

The storefront makes a single BFF call per page and receives everything it needs — products enriched with pricing and availability, breadcrumbs, recommendations, sort options, and pagination. The BFF owns all business logic: product enrichment, purchasability validation, CMS block resolution, and canonical URL generation.

See [docs/architecture.md](docs/architecture.md) for the full rationale.

## Project Structure

```
apps/
  bff/              NestJS Backend-for-Frontend (port 4000)
  storefront/       Next.js 15 frontend (port 3000)
libs/
  shared-types/     TypeScript types shared between apps
  store-config/     Multi-store configuration (locales, currencies, domains)
k6/                 Load testing scenarios
docs/               Documentation
```

## Key Features

- **Multi-store** — Multiple storefronts from a single deployment. Each store has its own locale, currency, domain, product catalog, pricing, and CMS content. Currently: France (fr) and Ireland (ie).
- **Hexagonal architecture** — Ports define interfaces, adapters implement them. Swap from mock data to real backends by writing new adapters — zero changes to domain services.
- **Resilience layer** — Every backend port call is wrapped with timeout, retry, circuit breaker, and concurrency control. Pricing and availability degrade gracefully (products render as unavailable instead of erroring).
- **Load shedding** — Global and per-scope request limits. Returns 503 with Retry-After when overloaded.
- **Server-driven CMS** — CMS delivers raw blocks (product handles, collection IDs). The BFF resolves them into display-ready blocks. The storefront renders via a component registry.
- **Server-driven checkout** — Address form schemas, delivery options, and payment options are returned by the BFF per store. The frontend renders them without hardcoding field definitions.
- **Chaos testing** — A chaos backend module injects configurable latency, errors, and hangs. k6 load test scenarios validate every resilience mechanism.
- **Optimistic cart** — React 19 `useOptimistic()` for instant cart UI updates while server actions are in flight.

## Quick Start

```bash
npm install
npm run dev
```

- Storefront: [localhost:3000](http://localhost:3000)
- BFF: [localhost:4000](http://localhost:4000/health/live)

### Run individually

```bash
npm run dev:bff        # BFF only
npm run dev:storefront # Storefront only
```

### Multi-domain local development

Install [Caddy](https://caddyserver.com/) and run:

```bash
caddy run
```

Then visit:

- `http://winparts.fr.localhost` — France store
- `http://winparts.ie.localhost` — Ireland store

### Chaos mode (for load testing)

```bash
BFF_BACKEND=chaos npm run dev:bff
```

See [docs/chaos-testing.md](docs/chaos-testing.md) and [docs/load-testing.md](docs/load-testing.md).

## Documentation

| Document                                     | Description                                                       |
| -------------------------------------------- | ----------------------------------------------------------------- |
| [Architecture](docs/architecture.md)         | Project structure, integration pattern, key decisions             |
| [BFF](docs/bff.md)                           | Ports, adapters, domain services, controllers, product enrichment |
| [Storefront](docs/storefront.md)             | Pages, caching, server actions, CMS rendering, components         |
| [Resilience](docs/resilience.md)             | Timeout, retry, circuit breaker, load shedding, health endpoints  |
| [Multi-Store](docs/multi-store.md)           | Store config, request flow, adding new stores                     |
| [CMS Blocks](docs/cms-blocks.md)             | Block resolution pipeline, adding new block types                 |
| [Cart & Checkout](docs/cart-and-checkout.md) | Cart mutations, checkout forms, address book                      |
| [Error Handling](docs/error-handling.md)     | Error contracts, mapping, graceful degradation                    |
| [Mock Data](docs/mock-data.md)               | Data files, pre-enriched index, stateful stores                   |
| [Chaos Testing](docs/chaos-testing.md)       | Chaos injection, control plane, safety                            |
| [Load Testing](docs/load-testing.md)         | k6 scenarios, running tests, interpreting results                 |

## Tech Stack

| Layer        | Technology                                       |
| ------------ | ------------------------------------------------ |
| Frontend     | Next.js 15, React 19, Tailwind CSS v4, next-intl |
| BFF          | NestJS 11, Fastify, class-validator              |
| Monorepo     | Nx, npm workspaces                               |
| Load testing | k6                                               |
| Local proxy  | Caddy                                            |
| Types        | TypeScript 5.8 (strict)                          |
