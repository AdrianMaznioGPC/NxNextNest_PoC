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
│   │   ├── accordion/             Collapsible panels (Base UI)
│   │   ├── avatar/                User/profile image with fallback (Base UI)
│   │   ├── badge/                 Status labels, tags, stock indicators
│   │   ├── button/                6 variants × 4 sizes, loading state
│   │   ├── card/                  Card, CardHeader, CardTitle, CardContent, CardFooter
│   │   ├── checkbox/              Accessible checkbox (Base UI)
│   │   ├── container/             Responsive max-width wrapper
│   │   ├── dialog/                Modal dialog (Base UI)
│   │   ├── drawer/                Slide-in panel from any edge (Base UI)
│   │   ├── dropdown-menu/         Context/action menu (Base UI)
│   │   ├── grid/                  Grid + GridItem layout primitives
│   │   ├── icon-button/           Square icon-only button (CVA)
│   │   ├── input/                 Styled text input
│   │   ├── label/                 Floating product label with price badge
│   │   ├── loading-dots/          Animated loading indicator
│   │   ├── price/                 Locale-aware currency formatting
│   │   ├── prose/                 Typography container for CMS HTML
│   │   ├── radio-card/            RadioCardGroup + RadioCard selection
│   │   ├── alert-dialog/          Confirmation dialog (Base UI)
│   │   ├── breadcrumb/            Breadcrumb navigation primitives
│   │   ├── collapsible/           Show/hide content panel (Base UI)
│   │   ├── combobox/              Searchable autocomplete input (Base UI)
│   │   ├── field/                 Form field with label, error, description (Base UI)
│   │   ├── meter/                 Static value gauge (Base UI)
│   │   ├── navigation-menu/       Desktop nav with dropdowns (Base UI)
│   │   ├── number-field/          Quantity stepper input (Base UI)
│   │   ├── pagination/            Page navigation primitives
│   │   ├── popover/               Floating content panel (Base UI)
│   │   ├── progress/              Progress bar indicator (Base UI)
│   │   ├── radio-group/           Plain radio button group (Base UI)
│   │   ├── scroll-area/           Custom scrollbar container (Base UI)
│   │   ├── select/                Styled select dropdown (Base UI)
│   │   ├── separator/             Horizontal/vertical divider (Base UI)
│   │   ├── skeleton/              Animated loading placeholder
│   │   ├── slider/                Range/value slider (Base UI)
│   │   ├── star-rating/           Star rating display (reviews)
│   │   ├── switch/                Toggle on/off (Base UI)
│   │   ├── table/                 Styled data table primitives
│   │   ├── tabs/                  Tab navigation panels (Base UI)
│   │   ├── textarea/              Multi-line text input
│   │   ├── toast/                 Notification toast (styled container)
│   │   └── tooltip/               Informational tooltip (Base UI)
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

| Layer          | File(s)                                            | What it controls                            | How to replace                                  |
| -------------- | -------------------------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| **Tokens**     | `src/styles/tokens.css`                            | Colors, radii, spacing                      | Override CSS custom properties or swap the file |
| **Variants**   | CVA maps in each component (e.g. `buttonVariants`) | Visual permutations per component           | Import and extend, or replace the variant map   |
| **Primitives** | `@base-ui/react`                                   | Accessible behavior (focus, keyboard, ARIA) | Not replaced — this is the stable foundation    |

## Dependencies

| Package                    | Purpose                                    |
| -------------------------- | ------------------------------------------ |
| `clsx`                     | Conditional class joining                  |
| `tailwind-merge`           | Deduplicate conflicting Tailwind classes   |
| `class-variance-authority` | Define typed component variants            |
| `@base-ui/react`           | Unstyled accessible interactive primitives |
| `react`, `react-dom`       | Peer dependencies (^18 or ^19)             |

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

<div
  className={cn(
    "p-4 text-sm",
    isActive && "bg-primary text-primary-foreground",
    className,
  )}
/>;
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

| Prop        | Type                                                                          | Default     | Description                              |
| ----------- | ----------------------------------------------------------------------------- | ----------- | ---------------------------------------- |
| `variant`   | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style                             |
| `size`      | `"sm" \| "md" \| "lg" \| "icon"`                                              | `"md"`      | Size preset                              |
| `loading`   | `boolean`                                                                     | `false`     | Shows spinner and disables the button    |
| `className` | `string`                                                                      | —           | Merged last, overrides any variant class |
| `ref`       | `Ref<HTMLButtonElement>`                                                      | —           | Forwarded ref                            |
| ...rest     | `ButtonHTMLAttributes`                                                        | —           | All native button attributes             |

**Using variants without the component:**

```tsx
import { buttonVariants } from "@commerce/ui";
import Link from "next/link";

// Apply button styling to a link
<Link
  href="/dashboard"
  className={buttonVariants({ variant: "outline", size: "sm" })}
>
  Dashboard
</Link>;
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

| Prop        | Type                             | Default | Description               |
| ----------- | -------------------------------- | ------- | ------------------------- |
| `maxWidth`  | `"sm" \| "md" \| "lg" \| "full"` | `"lg"`  | Maximum content width     |
| `className` | `string`                         | —       | Merged last               |
| `ref`       | `Ref<HTMLDivElement>`            | —       | Forwarded ref             |
| ...rest     | `HTMLAttributes<HTMLDivElement>` | —       | All native div attributes |

### Price

Locale-aware formatted price using `Intl.NumberFormat`.

```tsx
import { Price } from "@commerce/ui";

<Price amount="49.99" currencyCode="EUR" />
<Price amount="29.99" currencyCode="USD" currencyCodeClassName="hidden sm:inline" />
<Price amount="9.99" currencyCode="EUR" className="text-lg font-bold text-primary" />
```

| Prop                    | Type                                   | Default | Description                               |
| ----------------------- | -------------------------------------- | ------- | ----------------------------------------- |
| `amount`                | `string`                               | —       | Numeric price as string (e.g. `"29.99"`)  |
| `currencyCode`          | `string`                               | `"USD"` | ISO 4217 code (e.g. `"EUR"`, `"USD"`)     |
| `currencyCodeClassName` | `string`                               | —       | Class applied to the currency code suffix |
| `className`             | `string`                               | —       | Class applied to the `<p>` wrapper        |
| `ref`                   | `Ref<HTMLParagraphElement>`            | —       | Forwarded ref                             |
| ...rest                 | `HTMLAttributes<HTMLParagraphElement>` | —       | All native p attributes                   |

The component uses `suppressHydrationWarning` because `Intl.NumberFormat` output can differ between server and client locales.

### Prose

Typography container for rendering raw HTML (CMS content, product descriptions). Applies consistent heading, link, list, and paragraph styles using the `@tailwindcss/typography` plugin.

```tsx
import { Prose } from "@commerce/ui";

<Prose html={product.descriptionHtml} />
<Prose html={cmsBlock.html} className="mt-6 text-sm" />
```

| Prop        | Type                             | Default | Description               |
| ----------- | -------------------------------- | ------- | ------------------------- |
| `html`      | `string`                         | —       | Raw HTML string to render |
| `className` | `string`                         | —       | Merged last               |
| `ref`       | `Ref<HTMLDivElement>`            | —       | Forwarded ref             |
| ...rest     | `HTMLAttributes<HTMLDivElement>` | —       | All native div attributes |

Prose uses `dangerouslySetInnerHTML`. Only pass trusted/sanitized HTML.

### LoadingDots

Animated loading indicator rendered as blinking dots.

```tsx
import { LoadingDots } from "@commerce/ui";

<LoadingDots className="bg-white" />
<LoadingDots className="bg-primary" count={4} />
```

| Prop        | Type     | Default | Description                                                |
| ----------- | -------- | ------- | ---------------------------------------------------------- |
| `className` | `string` | —       | Class applied to each dot (use for color, e.g. `bg-white`) |
| `count`     | `number` | `3`     | Number of dots                                             |

The component renders with `role="status"` and an `sr-only` "Loading…" label for screen readers.

### Badge

Small status indicator for product tags, stock status, and labels.

```tsx
import { Badge } from "@commerce/ui";

<Badge>New</Badge>
<Badge variant="success">In Stock</Badge>
<Badge variant="destructive">Sold Out</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="outline">Sale</Badge>
```

**Variants:** `default`, `secondary`, `destructive`, `outline`, `success`, `warning`

| Prop        | Type                                                                               | Default     | Description                |
| ----------- | ---------------------------------------------------------------------------------- | ----------- | -------------------------- |
| `variant`   | `"default" \| "secondary" \| "destructive" \| "outline" \| "success" \| "warning"` | `"default"` | Visual style               |
| `className` | `string`                                                                           | —           | Merged last                |
| `ref`       | `Ref<HTMLSpanElement>`                                                             | —           | Forwarded ref              |
| ...rest     | `HTMLAttributes<HTMLSpanElement>`                                                  | —           | All native span attributes |

### Card

Surface container with border, background, and rounded corners. Composed of sub-components.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@commerce/ui";

<Card>
  <CardHeader>
    <CardTitle>Order Summary</CardTitle>
    <CardDescription>3 items in your cart</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>;
```

| Sub-component     | Element | Default padding      |
| ----------------- | ------- | -------------------- |
| `Card`            | `<div>` | — (just border + bg) |
| `CardHeader`      | `<div>` | `p-6`                |
| `CardTitle`       | `<h3>`  | —                    |
| `CardDescription` | `<p>`   | —                    |
| `CardContent`     | `<div>` | `p-6 pt-0`           |
| `CardFooter`      | `<div>` | `p-6 pt-0`           |

All sub-components forward refs and accept `className` overrides.

### Grid + GridItem

Responsive grid layout for product listings.

```tsx
import { Grid, GridItem } from "@commerce/ui";

<Grid columns={3}>
  <GridItem>…</GridItem>
  <GridItem>…</GridItem>
  <GridItem className="col-span-2">…</GridItem>
</Grid>;
```

| Prop (Grid) | Type                         | Default | Description  |
| ----------- | ---------------------------- | ------- | ------------ |
| `columns`   | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | —       | Column count |
| `className` | `string`                     | —       | Merged last  |

`GridItem` defaults to `aspect-square` with a fade transition. Override via `className`.

### Input

Styled text input with consistent border, focus ring, and dark mode support.

```tsx
import { Input } from "@commerce/ui";

<Input placeholder="Search products…" />
<Input type="email" required className="max-w-sm" />
```

| Prop        | Type                    | Default  | Description                 |
| ----------- | ----------------------- | -------- | --------------------------- |
| `type`      | `string`                | `"text"` | Input type                  |
| `className` | `string`                | —        | Merged last                 |
| `ref`       | `Ref<HTMLInputElement>` | —        | Forwarded ref               |
| ...rest     | `InputHTMLAttributes`   | —        | All native input attributes |

### Label

Floating product label overlay with title and optional price badge. Place inside a `position: relative` container.

```tsx
import { Label } from "@commerce/ui";

<div className="relative">
  <img src={product.image} />
  <Label title="Running Shoes" amount="129.99" currencyCode="EUR" />
</div>;
```

| Prop           | Type                   | Default    | Description       |
| -------------- | ---------------------- | ---------- | ----------------- |
| `title`        | `string`               | —          | Product title     |
| `amount`       | `string`               | —          | Price amount      |
| `currencyCode` | `string`               | —          | ISO 4217 code     |
| `position`     | `"bottom" \| "center"` | `"bottom"` | Vertical position |

### RadioCardGroup + RadioCard

Selectable card group for checkout options (delivery, payment, etc.).

```tsx
import {
  RadioCardGroup,
  RadioCard,
  RadioCardLabel,
  RadioCardDescription,
} from "@commerce/ui";

<RadioCardGroup name="delivery" value={selected} onValueChange={setSelected}>
  <RadioCard value="standard">
    <RadioCardLabel>Standard Shipping</RadioCardLabel>
    <RadioCardDescription>3-5 business days</RadioCardDescription>
  </RadioCard>
  <RadioCard value="express">
    <RadioCardLabel>Express Shipping</RadioCardLabel>
    <RadioCardDescription>1-2 business days</RadioCardDescription>
  </RadioCard>
</RadioCardGroup>;
```

| Prop (RadioCardGroup) | Type                      | Default | Description              |
| --------------------- | ------------------------- | ------- | ------------------------ |
| `name`                | `string`                  | —       | Form field name          |
| `value`               | `string`                  | —       | Currently selected value |
| `onValueChange`       | `(value: string) => void` | —       | Selection callback       |

| Prop (RadioCard) | Type      | Default | Description       |
| ---------------- | --------- | ------- | ----------------- |
| `value`          | `string`  | —       | Option value      |
| `disabled`       | `boolean` | `false` | Disables the card |

Highlights the active card with `border-primary` and a subtle background tint. Uses token colors so it automatically follows the theme.

### Skeleton

Animated placeholder for loading states.

```tsx
import { Skeleton } from "@commerce/ui";

<Skeleton className="h-4 w-48" />
<Skeleton className="h-64 w-full rounded-lg" />
<Skeleton className="h-8 w-8 rounded-full" />
```

Dimensions are controlled entirely via `className`. The component provides the animation and background color.

### StarRating

Star rating display for product reviews and testimonials.

```tsx
import { StarRating } from "@commerce/ui";

<StarRating rating={4} />
<StarRating rating={3} max={5} size="lg" />
```

| Prop     | Type                   | Default | Description               |
| -------- | ---------------------- | ------- | ------------------------- |
| `rating` | `number`               | —       | Rating value (0 to `max`) |
| `max`    | `number`               | `5`     | Total stars               |
| `size`   | `"sm" \| "md" \| "lg"` | `"md"`  | Star size                 |

Renders with `role="img"` and an accessible label (`"N out of M stars"`).

### Accordion

Collapsible panel group. Built on Base UI `Accordion`.

```tsx
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@commerce/ui";

<AccordionRoot>
  <AccordionItem value="shipping">
    <AccordionTrigger>Shipping Info</AccordionTrigger>
    <AccordionPanel>Free shipping on orders over €50.</AccordionPanel>
  </AccordionItem>
</AccordionRoot>;
```

### Avatar

User/profile image with fallback initials. Built on Base UI `Avatar`.

```tsx
import { AvatarRoot, AvatarImage, AvatarFallback } from "@commerce/ui";

<AvatarRoot>
  <AvatarImage src="/avatar.jpg" alt="John" />
  <AvatarFallback>JD</AvatarFallback>
</AvatarRoot>;
```

### Checkbox

Accessible checkbox with checked/indeterminate states. Built on Base UI `Checkbox`.

```tsx
import { Checkbox } from "@commerce/ui";

<Checkbox id="terms" />
<label htmlFor="terms">Accept terms and conditions</label>
```

### Dialog

Modal dialog with backdrop. Built on Base UI `Dialog`. Manages focus trap, Escape key, and click-outside dismissal.

```tsx
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@commerce/ui";

<DialogRoot>
  <DialogTrigger>Open</DialogTrigger>
  <DialogPortal>
    <DialogBackdrop />
    <DialogPopup>
      <DialogTitle>Confirm</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
      <DialogClose>Cancel</DialogClose>
    </DialogPopup>
  </DialogPortal>
</DialogRoot>;
```

### Drawer

Slide-in panel from any edge. Built on Base UI `Dialog` with directional transitions. Replaces `@headlessui/react` for cart slide-overs and mobile menus.

```tsx
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerPopup,
  DrawerTitle,
  DrawerClose,
} from "@commerce/ui";

<DrawerRoot>
  <DrawerTrigger>Cart</DrawerTrigger>
  <DrawerPortal>
    <DrawerBackdrop />
    <DrawerPopup side="right">
      <DrawerTitle>Your Cart</DrawerTitle>
      {/* cart contents */}
      <DrawerClose>Close</DrawerClose>
    </DrawerPopup>
  </DrawerPortal>
</DrawerRoot>;
```

**Sides:** `left`, `right` (default), `top`, `bottom`

### DropdownMenu

Action/context menu with keyboard navigation. Built on Base UI `Menu`. Supports items, radio items, checkbox items, groups, and separators.

```tsx
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuPopup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@commerce/ui";

<DropdownMenuRoot>
  <DropdownMenuTrigger>Options</DropdownMenuTrigger>
  <DropdownMenuPortal>
    <DropdownMenuPositioner>
      <DropdownMenuPopup>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuPopup>
    </DropdownMenuPositioner>
  </DropdownMenuPortal>
</DropdownMenuRoot>;
```

### IconButton

Square button sized for a single icon. Uses CVA with 3 variants and 3 sizes.

```tsx
import { IconButton } from "@commerce/ui";

<IconButton aria-label="Close" size="lg"><XMarkIcon /></IconButton>
<IconButton variant="ghost" aria-label="Menu"><Bars3Icon /></IconButton>
```

**Variants:** `default`, `ghost`, `destructive` &nbsp;|&nbsp; **Sizes:** `sm`, `md`, `lg`

### Select

Styled select dropdown. Built on Base UI `Select`.

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@commerce/ui";

const items = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

<Select items={items}>
  <SelectTrigger>
    <SelectValue placeholder="Sort by…" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>;
```

### Separator

Visual divider between content sections. Built on Base UI `Separator`.

```tsx
import { Separator } from "@commerce/ui";

<Separator />
<Separator orientation="vertical" className="h-6" />
```

### Switch

Toggle switch for boolean on/off states. Built on Base UI `Switch`.

```tsx
import { Switch } from "@commerce/ui";

<Switch id="newsletter" />
<label htmlFor="newsletter">Subscribe to newsletter</label>
```

### Textarea

Styled multi-line text input.

```tsx
import { Textarea } from "@commerce/ui";

<Textarea placeholder="Order notes…" rows={4} />;
```

### AlertDialog

Blocking confirmation dialog that requires user action. Built on Base UI `AlertDialog`. Unlike Dialog, it cannot be dismissed by clicking outside.

```tsx
import {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
} from "@commerce/ui";

<AlertDialogRoot>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogPortal>
    <AlertDialogBackdrop />
    <AlertDialogPopup>
      <AlertDialogTitle>Delete address?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
      <div className="mt-4 flex gap-2 justify-end">
        <AlertDialogClose>Cancel</AlertDialogClose>
        <Button variant="destructive">Delete</Button>
      </div>
    </AlertDialogPopup>
  </AlertDialogPortal>
</AlertDialogRoot>;
```

### Collapsible

Single show/hide panel. Building block for Accordion. Built on Base UI `Collapsible`.

```tsx
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "@commerce/ui";

<CollapsibleRoot>
  <CollapsibleTrigger>Show filters</CollapsibleTrigger>
  <CollapsiblePanel>…filter content…</CollapsiblePanel>
</CollapsibleRoot>;
```

### Field

Form field wrapper with label, description, and error message. Built on Base UI `Field`.

```tsx
import {
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  Input,
} from "@commerce/ui";

<FieldRoot>
  <FieldLabel>Email</FieldLabel>
  <FieldControl render={<Input type="email" />} />
  <FieldDescription>We'll never share your email.</FieldDescription>
  <FieldError>Please enter a valid email address.</FieldError>
</FieldRoot>;
```

### NumberField

Quantity stepper with decrement/increment buttons. Built on Base UI `NumberField`. Ideal for cart quantity selectors.

```tsx
import {
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldInput,
  NumberFieldIncrement,
} from "@commerce/ui";

<NumberFieldRoot defaultValue={1} min={1} max={99}>
  <NumberFieldGroup>
    <NumberFieldDecrement />
    <NumberFieldInput />
    <NumberFieldIncrement />
  </NumberFieldGroup>
</NumberFieldRoot>;
```

### Popover

Floating content panel anchored to a trigger. Built on Base UI `Popover`. For rich interactive content (mini cart, size guide, filter panel).

```tsx
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
  PopoverTitle,
  PopoverClose,
} from "@commerce/ui";

<PopoverRoot>
  <PopoverTrigger>Size guide</PopoverTrigger>
  <PopoverPortal>
    <PopoverPositioner>
      <PopoverPopup>
        <PopoverTitle>Size Guide</PopoverTitle>
        <PopoverClose>Close</PopoverClose>
      </PopoverPopup>
    </PopoverPositioner>
  </PopoverPortal>
</PopoverRoot>;
```

### Progress

Progress bar indicator. Built on Base UI `Progress`. For checkout steps, uploads, stock level visualization.

```tsx
import { ProgressRoot, ProgressTrack, ProgressIndicator } from "@commerce/ui";

<ProgressRoot value={60}>
  <ProgressTrack>
    <ProgressIndicator />
  </ProgressTrack>
</ProgressRoot>;
```

### RadioGroup

Plain radio button group (non-card layout). Built on Base UI `Radio` + `RadioGroup`.

```tsx
import { RadioGroupRoot, RadioGroupItem } from "@commerce/ui";

<RadioGroupRoot defaultValue="standard">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="standard" id="r-standard" />
    <label htmlFor="r-standard">Standard</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="express" id="r-express" />
    <label htmlFor="r-express">Express</label>
  </div>
</RadioGroupRoot>;
```

### Tabs

Tab navigation with panels. Built on Base UI `Tabs`. For product pages (description/specs/reviews), account sections.

```tsx
import { TabsRoot, TabsList, TabsTrigger, TabsPanel } from "@commerce/ui";

<TabsRoot defaultValue="description">
  <TabsList>
    <TabsTrigger value="description">Description</TabsTrigger>
    <TabsTrigger value="specs">Specifications</TabsTrigger>
    <TabsTrigger value="reviews">Reviews</TabsTrigger>
  </TabsList>
  <TabsPanel value="description">…</TabsPanel>
  <TabsPanel value="specs">…</TabsPanel>
  <TabsPanel value="reviews">…</TabsPanel>
</TabsRoot>;
```

### Toast

Styled notification container. Use with any toast library (sonner, react-hot-toast) or standalone.

```tsx
import { Toast, ToastTitle, ToastDescription } from "@commerce/ui";

<Toast variant="success">
  <ToastTitle>Order placed!</ToastTitle>
  <ToastDescription>Your order #1234 has been confirmed.</ToastDescription>
</Toast>;
```

**Variants:** `default`, `success`, `error`, `warning`, `info`

### Tooltip

Informational tooltip on hover/focus. Built on Base UI `Tooltip`. For icon buttons, truncated text, info hints.

```tsx
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
} from "@commerce/ui";

<TooltipRoot>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipPortal>
    <TooltipPositioner>
      <TooltipPopup>Helpful information</TooltipPopup>
    </TooltipPositioner>
  </TooltipPortal>
</TooltipRoot>;
```

### Breadcrumb

Composable breadcrumb navigation. Framework-agnostic — use any link component via the render pattern.

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@commerce/ui";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink isCurrentPage>Brake Pads</BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>;
```

### Combobox

Searchable autocomplete input with dropdown suggestions. Built on Base UI `Combobox`. For product search, address autocomplete.

```tsx
import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxItem,
  ComboboxEmpty,
} from "@commerce/ui";

<ComboboxRoot>
  <ComboboxInput placeholder="Search products…" />
  <ComboboxPortal>
    <ComboboxPositioner>
      <ComboboxPopup>
        <ComboboxItem value="brake-pads">Brake Pads</ComboboxItem>
        <ComboboxItem value="oil-filter">Oil Filter</ComboboxItem>
        <ComboboxEmpty>No results found</ComboboxEmpty>
      </ComboboxPopup>
    </ComboboxPositioner>
  </ComboboxPortal>
</ComboboxRoot>;
```

### Meter

Static value gauge for stock levels, review score distribution bars. Built on Base UI `Meter`.

```tsx
import { MeterRoot, MeterTrack, MeterIndicator } from "@commerce/ui";

<MeterRoot value={75} min={0} max={100}>
  <MeterTrack>
    <MeterIndicator />
  </MeterTrack>
</MeterRoot>;
```

### NavigationMenu

Desktop navigation bar with dropdown panels. Built on Base UI `NavigationMenu`.

```tsx
import {
  NavigationMenuRoot,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
} from "@commerce/ui";

<NavigationMenuRoot>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup>…subcategory links…</NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/deals">Deals</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenuRoot>;
```

### Pagination

Composable page navigation. Framework-agnostic — swap the link element for `next/link` or any router.

```tsx
import {
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@commerce/ui";

<PaginationRoot>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="?page=1" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=1">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=2" isActive>
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="?page=9">9</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="?page=3" />
    </PaginationItem>
  </PaginationContent>
</PaginationRoot>;
```

### ScrollArea

Custom scrollbar container. Built on Base UI `ScrollArea`. For cart line items, address picker, mega menu lists.

```tsx
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from "@commerce/ui";

<ScrollAreaRoot className="h-72 w-48">
  <ScrollAreaViewport>…long content…</ScrollAreaViewport>
  <ScrollAreaScrollbar>
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
</ScrollAreaRoot>;
```

### Slider

Range/value slider. Built on Base UI `Slider`. For price range filters.

```tsx
import {
  SliderRoot,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
} from "@commerce/ui";

<SliderRoot defaultValue={[25, 75]}>
  <SliderTrack>
    <SliderIndicator />
    <SliderThumb />
    <SliderThumb />
  </SliderTrack>
</SliderRoot>;
```

### Table

Styled data table. For order history, product specs, admin views.

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@commerce/ui";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Product</TableHead>
      <TableHead>Qty</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Brake Pads</TableCell>
      <TableCell>2</TableCell>
      <TableCell className="text-right">€49.99</TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

## Design Tokens

All tokens are defined in `src/styles/tokens.css` using Tailwind v4's `@theme` directive. This makes them available as both CSS custom properties and Tailwind utility classes.

### Token Reference

| Token                            | Tailwind Class                | Purpose                         |
| -------------------------------- | ----------------------------- | ------------------------------- |
| `--color-primary`                | `bg-primary`, `text-primary`  | Brand primary color             |
| `--color-primary-foreground`     | `text-primary-foreground`     | Text on primary backgrounds     |
| `--color-secondary`              | `bg-secondary`                | Secondary surfaces              |
| `--color-secondary-foreground`   | `text-secondary-foreground`   | Text on secondary surfaces      |
| `--color-destructive`            | `bg-destructive`              | Error / danger actions          |
| `--color-destructive-foreground` | `text-destructive-foreground` | Text on destructive backgrounds |
| `--color-background`             | `bg-background`               | Page background                 |
| `--color-foreground`             | `text-foreground`             | Default text color              |
| `--color-muted`                  | `bg-muted`                    | Muted / disabled surfaces       |
| `--color-muted-foreground`       | `text-muted-foreground`       | Muted text                      |
| `--color-accent`                 | `bg-accent`                   | Hover / highlight surfaces      |
| `--color-accent-foreground`      | `text-accent-foreground`      | Text on accent surfaces         |
| `--color-card`                   | `bg-card`                     | Card backgrounds                |
| `--color-card-foreground`        | `text-card-foreground`        | Card text                       |
| `--color-popover`                | `bg-popover`                  | Popover backgrounds             |
| `--color-popover-foreground`     | `text-popover-foreground`     | Popover text                    |
| `--color-border`                 | `border-border`               | Default border color            |
| `--color-input`                  | `border-input`                | Form input borders              |
| `--color-ring`                   | `ring-ring`                   | Focus ring color                |
| `--radius-sm`                    | `rounded-sm`                  | Small radius (0.25rem)          |
| `--radius-md`                    | `rounded-md`                  | Medium radius (0.375rem)        |
| `--radius-lg`                    | `rounded-lg`                  | Large radius (0.5rem)           |
| `--radius-xl`                    | `rounded-xl`                  | Extra-large radius (0.75rem)    |

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

| In `@commerce/ui` (42 components)                     | In `apps/storefront/components/`            |
| ----------------------------------------------------- | ------------------------------------------- |
| Button, IconButton, Badge, Card, Input, Textarea      | Cart modal, product gallery, navbar         |
| Dialog, Drawer, DropdownMenu, Select, Accordion       | CMS block renderers                         |
| Checkbox, Switch, RadioCardGroup, RadioCard           | Store switcher, checkout form               |
| Container, Grid, GridItem, Label, Separator, Skeleton | Breadcrumbs, pagination                     |
| Price, Prose, LoadingDots, StarRating, Avatar         | Address picker, variant selector            |
| No framework-specific imports                         | Uses `next/link`, `next/image`, `next-intl` |
| No domain types                                       | Imports from `lib/types`                    |

**Rule of thumb:** If a component can render in a Storybook without Next.js, it belongs in the library. If it needs routing, image optimization, or domain data, it stays in the app and _consumes_ library primitives.
