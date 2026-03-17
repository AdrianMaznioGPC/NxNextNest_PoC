---
globs: libs/ui/**/*.{ts,tsx,css}
description: "Conventions for the @commerce/ui shared component library: file
  structure, CVA variants, design tokens, cn() usage, and what belongs in the
  library vs. the app"
alwaysApply: false
---

## @commerce/ui Component Library Conventions

### File Structure
Every component lives in `libs/ui/src/components/<component-name>/` with:
- `<component-name>.tsx` — the component implementation
- `index.ts` — barrel re-export

All components must be re-exported from `libs/ui/src/index.ts`.

### Styling Architecture
- Use `cn()` from `libs/ui/src/lib/utils.ts` (tailwind-merge + clsx) for all class merging — never raw `clsx`
- Use `class-variance-authority` (CVA) for defining variant-driven component APIs
- Reference design tokens via Tailwind utility classes that map to CSS custom properties in `libs/ui/src/styles/tokens.css` (e.g. `text-foreground`, `bg-primary`)
- Export the CVA variants object (e.g. `buttonVariants`) so consumers can compose styles without rendering the component

### Design Token Layer
- All visual properties (colors, radii, shadows) are CSS custom properties defined in `libs/ui/src/styles/tokens.css` using Tailwind v4 `@theme`
- To re-theme the library: override the CSS custom properties — never hardcode colors like `bg-blue-600` in the library; use semantic tokens like `bg-primary`
- Consumer apps import tokens via `@import` in their global CSS

### Component API
- Use `forwardRef` for all DOM-wrapping components
- Extend native HTML element props (e.g. `ButtonHTMLAttributes<HTMLButtonElement>`)
- Use `VariantProps<typeof variantsFn>` for CVA variant typing
- Expose a `className` prop that is merged last via `cn()` so consumers can always override
- Use Base UI (`@base-ui/react`) for unstyled accessible primitives when building complex interactive components (dialogs, menus, selects, etc.)

### What Goes in libs/ui vs. the App
- **libs/ui**: Framework-agnostic primitives — no `next/link`, `next/image`, `next-intl`, or app-specific `lib/` imports
- **App components**: Domain-coupled composites that depend on Next.js APIs, routing, or business types — these *consume* `@commerce/ui` primitives

### Monorepo Wiring
- Path alias: `@commerce/ui` → `libs/ui/src/index.ts` (in `tsconfig.base.json` and app tsconfigs)
- Consumer Next.js apps must add `transpilePackages: ["@commerce/ui"]`
- Consumer CSS must `@import` the tokens file and add `@source` for Tailwind class scanning