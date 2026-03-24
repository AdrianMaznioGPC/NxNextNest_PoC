# Storefront Icons Domain

## Purpose

Holds shared iconography and brand marks used across the storefront. Store flag icons are **not** stored here — they are loaded over the network from `/public/icons` using BFF-provided `storeFlagIconSrc` values.

## Key Files

| File       | Role                    |
| ---------- | ----------------------- |
| `logo.tsx` | SVG logo mark component |

## Important Policy

The CI guard `branding:svg-network:guard` ensures that SVG files are not imported as modules. Store flags and branding icons must always be loaded via `<img src="...">` from the network, using BFF-provided paths. This keeps the storefront free of domain/country/store mapping logic.
