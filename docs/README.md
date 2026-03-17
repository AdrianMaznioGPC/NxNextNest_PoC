# Documentation

## Contents

| Document | Description |
|----------|-------------|
| [Architecture](./architecture.md) | Project structure, how apps integrate, key architectural decisions |
| [BFF](./bff.md) | Hexagonal architecture, ports, adapters, domain services, controllers, product enrichment, CMS block resolution |
| [Storefront](./storefront.md) | Next.js app structure, pages, caching, server actions, CMS rendering, component organization |
| [Resilience](./resilience.md) | Timeout, retry, circuit breaker, concurrency limits, load shedding, cache policy, health endpoints |
| [Multi-Store](./multi-store.md) | Store configuration, request flow, what differs per store, adding new stores |
| [CMS Blocks](./cms-blocks.md) | Block resolution pipeline, adding new block types |
| [Cart & Checkout](./cart-and-checkout.md) | Cart mutations, purchasability validation, server-driven checkout forms, address book |
| [Error Handling](./error-handling.md) | Error response contract, BFF error filter, storefront error mapping |
| [Mock Data](./mock-data.md) | Data files, pre-enriched product index, stateful stores, adapter details |
| [Chaos Testing](./chaos-testing.md) | Chaos injection architecture, configuration, safety |
| [Load Testing](./load-testing.md) | k6 scenarios, running tests, interpreting results, chaos control plane |
