# Storefront Product Domain

## Purpose

Contains product-specific UI building blocks used on PDPs, product listings, and product cards throughout the site.

## Key Files

| File                      | Role                                                                              |
| ------------------------- | --------------------------------------------------------------------------------- |
| `gallery.tsx`             | Product image gallery with thumbnail navigation                                   |
| `product-description.tsx` | Product title, description, pricing, and add-to-cart                              |
| `variant-selector.tsx`    | Interactive option selector (e.g., size, color) that updates the selected variant |

## How Variant Selection Works

Products have `options[]` (e.g., Size with values [S, M, L]) and `variants[]` (specific combinations with price and availability). The `variant-selector` component:

1. Renders option buttons for each product option
2. When a user selects an option, finds the matching variant
3. Updates the displayed price and availability
4. The selected variant's `id` is used as the `merchandiseId` when adding to cart

## Interactions

- **Cart Domain**: Add-to-cart uses the selected `variant.id` as `merchandiseId`
- **PDP Slots**: The `page.pdp-main` slot renders these components
- **Product Listings**: Product cards in category and search pages use a simplified version of the product model
