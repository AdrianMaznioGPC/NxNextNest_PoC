# BFF Collection Domain

## Purpose

Exposes collection and category data from the BFF. Collections represent the product taxonomy — they can be flat lists or nested hierarchies with subcollections.

## Key Files

| File                       | Role                                                  |
| -------------------------- | ----------------------------------------------------- |
| `collection.controller.ts` | HTTP endpoints for listing and retrieving collections |

## How Collections Work

Collections back two page types:

- **Category List** (`/categories`): Shows all top-level collections
- **Category Detail** (`/categories/brakes`): Shows either subcollections (if the category has children) or products (if it's a leaf category). The `CategoryDetailPageAssembler` decides which content node to produce.

Each `Collection` has: `handle`, `title`, `description`, `path` (localized), `seo`, optional `image`, optional `parentHandle`, and optional `subcollections[]`.

## Interactions

- **Page Data Assemblers**: `CategoryListPageAssembler` and `CategoryDetailPageAssembler` fetch collections via the `CollectionPort`
- **Slug Domain**: Collection paths are localized using the `categorySlugCatalog`
- **Menu Domain**: Navigation menus reference collection paths
