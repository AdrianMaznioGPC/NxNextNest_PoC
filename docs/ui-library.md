# UI Component Library (`@commerce/ui`)

## Overview

`@commerce/ui` is the shared component library for the commerce monorepo. It provides framework-agnostic, accessible UI primitives styled with Tailwind CSS v4 and driven by design tokens. Components are built to be re-themed without code changes — swap a CSS file and the entire library updates.

**Location:** `libs/ui/`

## Design Principles

1. **Token-driven styling.** All visual properties (colors, radii, shadows) are CSS custom properties. Components reference semantic tokens (`bg-primary`, `text-foreground`), never hardcoded values like `bg-blue-600`. Changing the theme means changing variables, not component code.
2. **Variant-driven APIs.** Components expose variants (e.g. `variant="outline"`, `size="lg"`) via [class-variance-authority](https://cva.style/docs) (CVA). The variant maps are exported separately so consumers can compose styles without rendering the component.
3. **Framework-agnostic.** No `next/link`, `next/image`, `next-intl`, or app-specific imports. Components depend only on React and the library's own utilities. This makes the library usable in any React application — not just the storefront.
4. **Accessible by default.** Interactive components use [Base UI](https://base-ui.com/) (`@base-ui/react`) for unstyled accessible primitives (focus management, keyboard navigation, ARIA). Styling is layered on top and can be replaced independently.
5. **Consumer override.** Every component accepts a `className` prop that is merged last via `cn()` (tailwind-merge + clsx). Consumers can always override any style without specificity battles.

## Architecture

```
libs/ui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.tsx         Component implementation
│   │   │   └── index.ts           Barrel re-export
│   │   ├── container/
│   │   ├── loading-dots/
│   │   ├── price/
│   │   └── prose/
│   ├── lib/
│   │   └── utils.ts               cn() helper
│   ├── styles/
│   │   └── tokens.css             Design tokens (CSS custom properties)
│   └── index.ts                   Public API barrel export
├── package.json
├── project.json
└── tsconfig.json
```

### Three Layers

The library is designed for easy design replacement at three independent layers:

| Layer | File(s) | What it controls | How to replace |
|-------|---------|-----------------|----------------|
| **Tokens** | `src/styles/tokens.css` | Colors, radii, spacing | Override CSS custom properties or swap the file |
| **Variants** | CVA maps in each component (e.g. `buttonVariants`) | Visual permutations per component | Import and extend, or replace the variant map |
| **Primitives** | `@base-ui/react` | Accessible behavior (focus, keyboard, ARIA) | Not replaced — this is the stable foundation |

## Dependencies

| Package | Purpose |
|---------|---------|
| `clsx` | Conditional class joining |
| `tailwind-merge` | Deduplicate conflicting Tailwind classes |
| `class-variance-authority` | Define typed component variants |
| `@base-ui/react` | Unstyled accessible interactive primitives |
| `react`, `react-dom` | Peer dependencies (^18 or ^19) |

## Setup for Consumer Apps

### 1. TypeScript path alias

Already configured in `tsconfig.base.json`:

```json
{
  "paths": {
    "@commerce/ui": ["libs/ui/src/index.ts"]
  }
}
```

Consumer app tsconfigs that set `baseUrl` must also add the alias with the correct relative path:

```json
{
  "paths": {
    "@commerce/ui": ["../../libs/ui/src/index.ts"]
  }
}
```

### 2. Next.js transpilation

Add to `next.config.ts`:

```typescript
transpilePackages: ["@commerce/ui"],
```

### 3. Import design tokens and source scanning

Add to the consumer's global CSS:

```css
@import "tailwindcss";
@import "../../../libs/ui/src/styles/tokens.css";

/* Ensure Tailwind scans the library for class usage */
@source "../../../libs/ui/src/**/*.{ts,tsx}";
```

The `@source` directive tells Tailwind v4 to include the library's source files when scanning for class names. Without it, classes used only inside `@commerce/ui` would be purged from the consumer's CSS output.

## Utilities

### `cn(...inputs)`

The single class-merging function used across the entire library and recommended for consumer apps. Combines `clsx` (conditional logic) with `tailwind-merge` (deduplication).

```tsx
import { cn } from "@commerce/ui";

<div className={cn("p-4 text-sm", isActive && "bg-primary text-primary-foreground", className)} />
```

Use `cn()` instead of raw `clsx()` anywhere Tailwind classes are involved. It prevents conflicts like `p-4 p-2` (keeps only the last) and handles conditional/array/object syntax.

## Components

### Button

Accessible button with 6 visual variants and 4 sizes.

```tsx
import { Button } from "@commerce/ui";

<Button variant="default" size="md">Save</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" size="lg">Cancel</Button>
<Button variant="ghost" size="icon"><TrashIcon /></Button>
<Button loading>Saving…</Button>
```

**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

**Sizes:** `sm`, `md`, `lg`, `icon`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | Size preset |
| `loading` | `boolean` | `false` | Shows spinner and disables the button |
| `className` | `string` | — | Merged last, overrides any variant class |
| `ref` | `Ref<HTMLButtonElement>` | — | Forwarded ref |
| ...rest | `ButtonHTMLAttributes` | — | All native button attributes |

**Using variants without the component:**

```tsx
import { buttonVariants } from "@commerce/ui";
import Link from "next/link";

// Apply button styling to a link
<Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
  Dashboard
</Link>
```

### Container

Responsive max-width wrapper with consistent horizontal padding.

```tsx
import { Container } from "@commerce/ui";

<Container>Full-width content</Container>
<Container maxWidth="md">Narrower content</Container>
<Container maxWidth="sm" className="py-12">Custom padding</Container>
```

**Max-width options:** `sm` (48rem), `md` (64rem), `lg` (80rem, default), `full`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `"sm" \| "md" \| "lg" \| "full"` | `"lg"` | Maximum content width |
| `className` | `string` | — | Merged last |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded ref |
| ...rest | `HTMLAttributes<HTMLDivElement>` | — | All native div attributes |

### Price

Locale-aware formatted price using `Intl.NumberFormat`.

```tsx
import { Price } from "@commerce/ui";

<Price amount="49.99" currencyCode="EUR" />
<Price amount="29.99" currencyCode="USD" currencyCodeClassName="hidden sm:inline" />
<Price amount="9.99" currencyCode="EUR" className="text-lg font-bold text-primary" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `amount` | `string` | — | Numeric price as string (e.g. `"29.99"`) |
| `currencyCode` | `string` | `"USD"` | ISO 4217 code (e.g. `"EUR"`, `"USD"`) |
| `currencyCodeClassName` | `string` | — | Class applied to the currency code suffix |
| `className` | `string` | — | Class applied to the `<p>` wrapper |
| `ref` | `Ref<HTMLParagraphElement>` | — | Forwarded ref |
| ...rest | `HTMLAttributes<HTMLParagraphElement>` | — | All native p attributes |

The component uses `suppressHydrationWarning` because `Intl.NumberFormat` output can differ between server and client locales.

### Prose

Typography container for rendering raw HTML (CMS content, product descriptions). Applies consistent heading, link, list, and paragraph styles using the `@tailwindcss/typography` plugin.

```tsx
import { Prose } from "@commerce/ui";

<Prose html={product.descriptionHtml} />
<Prose html={cmsBlock.html} className="mt-6 text-sm" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `html` | `string` | — | Raw HTML string to render |
| `className` | `string` | — | Merged last |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded ref |
| ...rest | `HTMLAttributes<HTMLDivElement>` | — | All native div attributes |

Prose uses `dangerouslySetInnerHTML`. Only pass trusted/sanitized HTML.

### LoadingDots

Animated loading indicator rendered as blinking dots.

```tsx
import { LoadingDots } from "@commerce/ui";

<LoadingDots className="bg-white" />
<LoadingDots className="bg-primary" count={4} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Class applied to each dot (use for color, e.g. `bg-white`) |
| `count` | `number` | `3` | Number of dots |

The component renders with `role="status"` and an `sr-only` "Loading…" label for screen readers.

## Design Tokens

All tokens are defined in `src/styles/tokens.css` using Tailwind v4's `@theme` directive. This makes them available as both CSS custom properties and Tailwind utility classes.

### Token Reference

| Token | Tailwind Class | Purpose |
|-------|---------------|---------|
| `--color-primary` | `bg-primary`, `text-primary` | Brand primary color |
| `--color-primary-foreground` | `text-primary-foreground` | Text on primary backgrounds |
| `--color-secondary` | `bg-secondary` | Secondary surfaces |
| `--color-secondary-foreground` | `text-secondary-foreground` | Text on secondary surfaces |
| `--color-destructive` | `bg-destructive` | Error / danger actions |
| `--color-destructive-foreground` | `text-destructive-foreground` | Text on destructive backgrounds |
| `--color-background` | `bg-background` | Page background |
| `--color-foreground` | `text-foreground` | Default text color |
| `--color-muted` | `bg-muted` | Muted / disabled surfaces |
| `--color-muted-foreground` | `text-muted-foreground` | Muted text |
| `--color-accent` | `bg-accent` | Hover / highlight surfaces |
| `--color-accent-foreground` | `text-accent-foreground` | Text on accent surfaces |
| `--color-card` | `bg-card` | Card backgrounds |
| `--color-card-foreground` | `text-card-foreground` | Card text |
| `--color-popover` | `bg-popover` | Popover backgrounds |
| `--color-popover-foreground` | `text-popover-foreground` | Popover text |
| `--color-border` | `border-border` | Default border color |
| `--color-input` | `border-input` | Form input borders |
| `--color-ring` | `ring-ring` | Focus ring color |
| `--radius-sm` | `rounded-sm` | Small radius (0.25rem) |
| `--radius-md` | `rounded-md` | Medium radius (0.375rem) |
| `--radius-lg` | `rounded-lg` | Large radius (0.5rem) |
| `--radius-xl` | `rounded-xl` | Extra-large radius (0.75rem) |

### Re-theming

**Option 1: Override variables in CSS.** Add a second CSS file after the tokens import:

```css
@import "../../../libs/ui/src/styles/tokens.css";
@import "./my-brand-overrides.css";
```

```css
/* my-brand-overrides.css */
@theme {
  --color-primary: oklch(0.637 0.237 25.33);
  --color-primary-foreground: oklch(0.985 0.002 247.84);
}
```

**Option 2: Scope overrides to a class.** Apply a theme class to a subtree:

```css
.theme-brand-b {
  --color-primary: oklch(0.723 0.219 149.58);
  --color-background: oklch(0.985 0.002 247.84);
}
```

```tsx
<div className="theme-brand-b">
  <Button>I'm green now</Button>
</div>
```

**Option 3: Dark mode.** Add a `prefers-color-scheme` or class-based override:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: oklch(0.145 0.028 264.44);
    --color-foreground: oklch(0.985 0.002 247.84);
    --color-card: oklch(0.208 0.042 265.75);
    --color-border: oklch(0.274 0.043 264.44);
  }
}
```

## Adding a New Component

### 1. Create the component directory

```
libs/ui/src/components/badge/
├── badge.tsx
└── index.ts
```

### 2. Implement with CVA + tokens

```tsx
// badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";
```

### 3. Create the barrel export

```tsx
// index.ts
export { Badge, badgeVariants, type BadgeProps } from "./badge";
```

### 4. Add to the public API

```tsx
// src/index.ts
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";
```

### Checklist

- [ ] Uses `cn()` for all class merging (never raw `clsx`)
- [ ] Uses `forwardRef` for DOM-wrapping components
- [ ] Extends native HTML element attributes
- [ ] Uses CVA for variants, exports the variants map
- [ ] References design tokens (e.g. `bg-primary`), never hardcoded colors
- [ ] Accepts `className` prop, merged last via `cn()`
- [ ] Has no imports from `next/*`, `next-intl`, or app-specific `lib/`
- [ ] Exported from `src/index.ts`

## What Belongs Here vs. in the App

| In `@commerce/ui` | In `apps/storefront/components/` |
|---|---|
| Button, Container, Badge, Input, Select, Dialog | Cart modal, product gallery, navbar |
| Price, Prose, LoadingDots | CMS block renderers |
| Generic layout primitives | Store switcher, checkout form |
| No framework-specific imports | Uses `next/link`, `next/image`, `next-intl` |
| No domain types | Imports from `lib/types` |

**Rule of thumb:** If a component can render in a Storybook without Next.js, it belongs in the library. If it needs routing, image optimization, or domain data, it stays in the app and _consumes_ library primitives.
