# BFF Product Domain

## Purpose

Exposes product detail and product listing data from the BFF. Products are the core commerce entity — they include variants, options, pricing, images, and SEO metadata.

## Key Files

| File                    | Role                                          |
| ----------------------- | --------------------------------------------- |
| `product.controller.ts` | HTTP endpoints for product listing and search |

## Product Model

Each `Product` includes:

- `handle` (canonical identifier), `title`, `description`, `descriptionHtml`
- `path` (localized URL)
- `options[]` (e.g., Size, Color) and `variants[]` (specific combinations with price and availability)
- `priceRange` (min/max variant prices)
- `featuredImage` and `images[]`
- `seo`, `tags`, `breadcrumbs`

## Interactions

- **Page Data Assemblers**: `ProductDetailPageAssembler` fetches product + recommendations via `ProductPort`
- **Search**: `SearchPageAssembler` uses product search results
- **Slot Data Service**: PDP deferred slots (recommendations, reviews, FAQ) fetch additional product data
- **CMS Blocks**: Featured products and product carousel blocks reference products
- **Slug Domain**: Product paths are localized using `productSlugCatalog`
