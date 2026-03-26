# Bootstrap Orchestrator Refactoring Plan

## Overview

Refactoring the bootstrap orchestrator to use a **stage-based pipeline architecture** with a **context accumulator pattern**. This matches enterprise-grade ecommerce patterns (Amazon, Shopify, Commercetools) while keeping implementation simple and extensible.

## Goals

1. **Simplify orchestration** - Clear, linear flow through named stages
2. **Enable caching** - Add cache boundaries between stages without rewrites
3. **Support personalization** - Separate cacheable assembly from personal overlays
4. **Easy extensibility** - Add/remove/reorder stages with minimal code changes
5. **Maintain robustness** - Match major retailers' architecture patterns

## Why This Refactoring?

### Current Problems

1. **God Object Anti-Pattern** - `BootstrapOrchestratorService.buildBootstrap()` does too much (100+ lines)
2. **No Cache Boundaries** - Everything runs every time, no optimization points
3. **Mixed Concerns** - Cacheable assembly mixed with personalization
4. **Hard to Extend** - Adding features requires understanding entire flow
5. **Testing Difficulty** - Long method with sequential dependencies

### What We're NOT Doing

❌ **Complex pipeline abstractions** - No transformer interfaces with typed input/output chains  
❌ **Over-engineering** - No premature optimization for problems we don't have  
❌ **Big rewrites** - Incremental migration, keep current code working

## Architecture Decision: Context Accumulator Pattern

### Why Context Accumulator?

After evaluating three patterns:

1. ❌ **Typed Pipeline Stages** - Each stage has typed input/output, but causes refactor cascades
2. ❌ **Pure Functional Pipeline** - Immutable transformations, but complex TypeScript types
3. ✅ **Context Accumulator** - Single mutable context object, industry-proven

**Winner: Context Accumulator**

- ✅ Easy to add stages (2 lines of code)
- ✅ No type cascades (add fields to context, done)
- ✅ Clear state flow (all state in one object)
- ✅ Industry-proven (Express, Koa, NestJS middleware)
- ✅ Simple to test (mock context, call stage)

### Why Factory Pattern for DI?

After evaluating constructor approaches:

1. ❌ **Direct Injection** - 10+ constructor parameters, duplicated list
2. ❌ **Token Injection** - Magic tokens, order in module file
3. ✅ **Factory Pattern** - Clean constructor, clear pipeline definition

**Winner: Factory Pattern**

- ✅ Orchestrator has 4 constructor params (down from 10)
- ✅ Single source of truth for stage order
- ✅ No DI magic, explicit dependencies
- ✅ Easy to swap for registry later if needed

## New Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: Route Recognition & Early Validation              │
│ - Parse request, feature flags, route recognition          │
│ - Early exits: 503 (overload), 404 (unknown), 301 (redirect)│
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│ Stage 2: Context Resolution (Personalization Signals)      │
│ - Experience profile, merchandising profile                 │
│ - A/B tests, customer segments                              │
│ - Build cache key fingerprint                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│ Stage 3: Assembly Cache Check (FUTURE - stub for now)      │
│ - Check CDN/Redis/in-memory cache                           │
│ - Cache HIT: Skip to Stage 5                                │
│ - Cache MISS: Continue to Stage 4                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│ Stage 4: Page Assembly (Expensive, Cacheable)              │
│ - Route-specific assembler execution                        │
│ - Product/CMS data fetching                                 │
│ - SEO metadata, block overlays                              │
│ OUTPUT: AssemblyResult (cache candidate)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│ Stage 5: Slot Planning (Structural)                        │
│ - Convert content to slot manifests                         │
│ - Inline vs deferred strategy                               │
│ - Cache TTLs, revalidation tags                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│ Stage 6: Personalization Overlay (Non-Cacheable)           │
│ - Experience slot rules                                     │
│ - Merchandising slot rules                                  │
│ - Variant selection, inclusion/exclusion                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│ Stage 7: Link Localization & Finalization                  │
│ - Link normalization, i18n messages                         │
│ - Cache policy, response assembly                           │
│ - Metrics & logging                                         │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
apps/bff/src/modules/page-data/
├── bootstrap/
│   ├── bootstrap-orchestrator.service.ts       # Main orchestrator (simplified)
│   ├── bootstrap-context.model.ts              # Accumulator context
│   ├── bootstrap-stage.interface.ts            # Stage contract
│   ├── bootstrap-stage.factory.ts              # Pipeline builder (DI helper)
│   └── bootstrap-response.builder.ts           # Final response assembly
│
├── stages/
│   ├── route-recognition.stage.ts              # Stage 1
│   ├── context-resolution.stage.ts             # Stage 2
│   ├── assembly-cache.stage.ts                 # Stage 3 (stub)
│   ├── page-assembly.stage.ts                  # Stage 4
│   ├── slot-planning.stage.ts                  # Stage 5
│   ├── personalization.stage.ts                # Stage 6
│   └── link-localization.stage.ts              # Stage 7
│
├── models/
│   ├── assembly-result.model.ts                # Stage 4 output model
│   └── assembler-budget.config.ts              # Extracted config
│
└── assemblers/                                  # Existing (unchanged)
    ├── page-assembler.interface.ts
    ├── page-assembler.registry.ts
    └── ...
```
