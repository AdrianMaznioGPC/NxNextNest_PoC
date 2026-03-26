# Storefront CMS Domain

## Purpose

Renders CMS-style content blocks on the home page and content pages. The BFF provides an array of typed `CmsBlock` objects, and this domain maps each block type to its corresponding React component.

## Key Files

| File                 | Role                                                               |
| -------------------- | ------------------------------------------------------------------ |
| `block-registry.tsx` | Maps `CmsBlock.type` to lazy-loaded React component                |
| `block-renderer.tsx` | Iterates over block arrays and renders each through the registry   |
| `blocks/*`           | Individual block components (hero banner, featured products, etc.) |

> **Architecture Note**: The block system uses lazy loading with explicit registration. See [block-registry-refactor.md](./block-registry-refactor.md) for details.

## Block Types

| Block Type            | Component                                            | Mode        |
| --------------------- | ---------------------------------------------------- | ----------- |
| `hero-banner`         | Hero banner with heading, subheading, CTA, and image | Server      |
| `featured-products`   | Product grid with heading                            | Server      |
| `featured-categories` | Category cards with heading                          | Server      |
| `product-carousel`    | Horizontal product carousel                          | Server      |
| `rich-text`           | Free-form HTML content                               | Server      |
| `winter-effects`      | Animated snowfall overlay                            | Client-only |

## How Block Overrides Work

The BFF experience layer can apply `blockOverrides` to CMS blocks before they reach the storefront. For example, a marketing campaign can replace the hero banner heading or swap featured products. These overrides are applied generically by `BlockOverlayService` in the BFF — the storefront just renders whatever block data it receives.

## Interactions

- **BFF Home Assembler**: Provides CMS block arrays as inline slot data
- **Experience Domain**: Can override block fields via `blockOverrides` in profiles or marketing directives
