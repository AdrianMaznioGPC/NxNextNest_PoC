# Architecture Docs

This folder contains architecture and domain documentation for the repo.

## Overview

- Monorepo shape:
  - `apps/storefront`: Next.js storefront that renders the bootstrap contract returned by the BFF
  - `apps/bff`: NestJS backend-for-frontend that recognizes routes, resolves experience, assembles pages, and returns slot manifests
  - `libs/shared-types`: shared bootstrap, slot, page, and commerce contracts used on both sides
- [`page-pipeline.md`](./page-pipeline.md): end-to-end page and slot rendering diagrams

## BFF Domains

- [`bff/cart/README.md`](./bff/cart/README.md)
- [`bff/checkout/README.md`](./bff/checkout/README.md)
- [`bff/collection/README.md`](./bff/collection/README.md)
- [`bff/customer/README.md`](./bff/customer/README.md)
- [`bff/experience/README.md`](./bff/experience/README.md)
- [`bff/i18n/README.md`](./bff/i18n/README.md)
- [`bff/menu/README.md`](./bff/menu/README.md)
- [`bff/merchandising/README.md`](./bff/merchandising/README.md)
- [`bff/page/README.md`](./bff/page/README.md)
- [`bff/page-data/README.md`](./bff/page-data/README.md)
- [`bff/product/README.md`](./bff/product/README.md)
- [`bff/slug/README.md`](./bff/slug/README.md)
- [`bff/system/README.md`](./bff/system/README.md)

## Storefront Domains

- [`storefront/cart/README.md`](./storefront/cart/README.md)
- [`storefront/checkout/README.md`](./storefront/checkout/README.md)
- [`storefront/cms/README.md`](./storefront/cms/README.md)
- [`storefront/grid/README.md`](./storefront/grid/README.md)
- [`storefront/icons/README.md`](./storefront/icons/README.md)
- [`storefront/layout/README.md`](./storefront/layout/README.md)
- [`storefront/page-renderer/README.md`](./storefront/page-renderer/README.md)
- [`storefront/product/README.md`](./storefront/product/README.md)

## Shared Contracts

- [`shared-types/README.md`](./shared-types/README.md)
