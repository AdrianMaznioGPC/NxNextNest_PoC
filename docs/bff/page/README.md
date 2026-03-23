# BFF Page Domain

## Purpose

Serves the older page-oriented endpoints outside the newer bootstrap pipeline.

## Key Files

- `apps/bff/src/modules/page/page.controller.ts`

## Inputs And Outputs

- Inputs: page identifiers and locale context
- Outputs: resolved page data payloads

## Notes

- New orchestration work is centered in `page-data`, not here.
