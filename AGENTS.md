# Agent Guidelines for Commerce Monorepo

## Project Overview

This is an Nx monorepo containing a Next.js storefront and a NestJS BFF (Backend-for-Frontend).

```
apps/
  storefront/   - Next.js ecommerce frontend (port 3000)
  bff/          - NestJS backend-for-frontend (port 4000)
  api/          - Java Spring Boot backend API (Gradle, port 8080)
libs/
  shared-types/ - Shared TypeScript types
```

### API Backend (apps/api)

A Java Spring Boot application that serves as the real commerce backend.
It uses JPA entities (Product, ProductVariant, ProductOption, etc.) with an
in-memory H2 database and a `DataSeeder` for dev data.

The BFF currently runs against `MockCommerceModule` only. A future
`SpringCommerceModule` adapter will implement the BFF ports against this API.

## Commands

### Development

```bash
# Run both apps
npm run dev

# Run individually
npm run dev:storefront
npm run dev:bff
```

### Build & Production

```bash
# Build everything (including shared libs)
npm run build

# Build individual apps
npm run build:storefront
npm run build:bff

# Start production servers
npm run start
npm run start:storefront
npm run start:bff
```

### Testing

- No test framework is currently configured
- If tests are added, run single test with: `nx test <project> --testFile=<name>`

### Linting & Formatting

```bash
# Format code with Prettier
npm run prettier

# Check formatting
npm run prettier:check
```

### Theme/Quality Guards (CI checks)

```bash
npm run storefront:theme:ci  # Runs all theme validation scripts
npm run theme:guard         # Check for hardcoded colors
npm run theme:catalog:guard # Check theme contrast
npm run theme:light-only:guard   # Ensure no dark mode
npm run branding:svg-network:guard # No SVG imports
npm run theme-pack:wiring    # Theme pack wiring validation
npm run storefront:css:budget # CSS budget check
```

## Code Style Guidelines

### TypeScript

- Use explicit return types for functions, especially public API methods
- Avoid `any` - use `unknown` when type is truly unknown
- Use TypeScript strict mode (enabled in tsconfig)
- Prefer interfaces over types for object shapes (easier to extend)
- Use utility types like `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`

### Imports

- Use absolute imports for internal packages: `import { Type } from '@commerce/shared-types'`
- Use relative imports for local files: `import { Component } from './components/Component'`
- Group imports: external (alphabetical) -> internal -> relative
- Enable VS Code auto-organize on save (configured in `.vscode/settings.json`)

### Naming Conventions

- **Files**: kebab-case for components (`product-card.tsx`), camelCase for utilities (`fetchProducts.ts`)
- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCart.ts`)
- **Types/Interfaces**: PascalCase, suffix with `Type` or descriptive (`Product`, `CartItem`)
- **Constants**: SCREAMING_SNAKE_CASE for config values, camelCase for runtime constants
- **Enums**: PascalCase, values also PascalCase

### React/Next.js Specific

- Use functional components with hooks
- Use TypeScript generics for reusable components
- Prefer composition over inheritance
- Keep components small and focused
- Use `next-intl` for internationalization - never hardcode user-facing strings

### NestJS/BFF Specific

- Use dependency injection via constructors
- Controllers should be thin - delegate to services
- Use DTOs for input validation (class-validator)
- Follow NestJS module organization (controllers, services, dtos, guards)
- Use Fastify adapter (configured in main.ts)

### Error Handling

- Use custom error classes extending `Error` or `HttpException`
- Log errors with appropriate context (use structured logging)
- Return proper HTTP status codes
- Never expose internal error details to clients
- Use try/catch at service boundaries, let exceptions propagate appropriately

### Styling

- Use Tailwind CSS 4 (configured in `postcss.config.mjs`)
- Use `tailwindcss/container-queries`, `@tailwindcss/typography` plugins
- Never use arbitrary values - use theme tokens
- Avoid custom CSS - use Tailwind utilities or CSS variables
- Theme uses CSS variables defined in `:root` for theming

### Git/Version Control

- Create feature branches from `main`
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Run `npm run prettier` before committing
- Ensure `npm run storefront:theme:ci` passes before merging to main

## VS Code Settings

The project includes `.vscode/settings.json` with recommended settings:

- Auto-fix, organize imports, and sort members on save
- Use workspace TypeScript version

## Key Dependencies

- **Storefront**: Next.js 15.6.0-canary.60, React 19, next-intl, Tailwind 4, Geist font
- **BFF**: NestJS 11, Fastify, path-to-regexp
- **Shared**: TypeScript types only

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
