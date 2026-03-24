# BFF Menu Domain

## Purpose

Exposes storefront navigation data: **mega menu trees** and **featured links**. These power the navbar, mobile navigation, and footer link sections.

## Key Files

| File                 | Role                                   |
| -------------------- | -------------------------------------- |
| `menu.controller.ts` | HTTP endpoints for menu data by handle |

## Data Model

- `MegaMenuItem`: `{ title, path, image?, children?: MegaMenuItem[] }` — recursive tree structure for the mega menu
- `FeaturedLink`: `{ title, path }` — flat list of promoted links

Paths are localized according to the current language and prefix policy.

## Interactions

- **Storefront Layout**: `getLayoutData()` returns menus + featured links via `/page-data/layout`
- **Slug Domain**: All menu paths are normalized for the current language
