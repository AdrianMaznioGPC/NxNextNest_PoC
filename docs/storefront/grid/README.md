# Storefront Grid Domain

## Purpose

Contains low-level visual grid primitives used by merchandising and marketing layouts. These are the building blocks for product grids, category card layouts, and featured content sections.

## Key Files

| File              | Role                                                       |
| ----------------- | ---------------------------------------------------------- |
| `index.tsx`       | Base `Grid` component with responsive column configuration |
| `three-items.tsx` | Featured three-item promotional layout (used on home page) |
| `tile.tsx`        | Individual grid tile with image, title, and overlay        |

## Interactions

- **CMS Blocks**: Featured products and categories use grid layouts
- **Category Products**: Product listing variants use grid or list layouts
- **Home Page**: Three-items grid is a common home page pattern
