# BFF I18n Domain

## Purpose

Owns locale resolution, translation messages, alternates, and cross-region URL switching.

## Key Files

- `apps/bff/src/modules/i18n/i18n.service.ts`
- `apps/bff/src/modules/i18n/i18n.controller.ts`
- `apps/bff/src/modules/i18n/switch-url.service.ts`

## Inputs And Outputs

- Inputs: host, locale query values, route descriptors, target region/language
- Outputs: locale context, translation payloads, switched URLs

## Notes

- Every bootstrapped page goes through locale resolution.
- Slug and page-data routing rely on this domain to keep localized paths canonical.
