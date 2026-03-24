# BFF Page Domain (Legacy)

## Purpose

Serves the older page-oriented endpoints outside the newer bootstrap pipeline. These endpoints return direct page data without the slot-manifest composition layer.

## Key Files

| File                 | Role                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| `page.controller.ts` | Legacy HTTP endpoints for home, search, product, collection, and content pages |

## Status

**Superseded by `page-data` domain.** New page orchestration uses the bootstrap pipeline (`/page-data/bootstrap`), which returns `PageBootstrapModel` with slot manifests. These legacy endpoints remain for backward compatibility but should not be used for new features.

## Interactions

- **Page Data Domain**: The modern replacement that adds slot planning, experience, and merchandising
