# Bootstrap Pipeline Stage Architecture

## Overview

The bootstrap pipeline uses a **stage-based architecture** where each stage performs a specific phase of page assembly. Stages are executed sequentially by the `BootstrapOrchestratorService`, passing a shared `BootstrapContext` object through the pipeline.

This architecture provides:

- **Separation of concerns** — Each stage has a single responsibility
- **Testability** — Stages can be tested in isolation with mock contexts
- **Extensibility** — New stages can be added without modifying existing code
- **Observability** — Each stage is timed and logged independently
- **Flexibility** — Stages can be conditional or skipped based on context state

## Core Components

### BootstrapContext

Mutable context object passed through all stages. Contains all data needed to build the final `PageBootstrapModel`.

**Key fields:**

- **Input** (set by orchestrator): `requestedPath`, `query`, `requestId`, `cookieHeader`
- **Route** (set by route-recognition): `route`, `localeContext`, `matchedRuleId`
- **Experience** (set by context-resolution): `experience`, `merchandising`, `defaultSortApplied`
- **Assembly** (set by page-assembly): `status`, `seo`, `content`, `revalidateTags`, `assemblerKey`
- **Slots** (set by slot-planning): `slots`
- **Audit** (set by link-localization): `localizationAudit`

**Helper methods:**

- `shouldStopProcessing()` — Returns true if pipeline should halt (e.g., after assembly failure)
- `earlyReturn(status, redirectTo?)` — Marks context for early exit and stops processing

### BootstrapStage Interface

```typescript
interface BootstrapStage {
  readonly name: string;
  execute(ctx: BootstrapContext): Promise<void> | void;
  shouldRun?(ctx: BootstrapContext): boolean;
}
```

- `name` — Unique identifier for logging and metrics
- `execute(ctx)` — Performs stage's work, mutating context as needed
- `shouldRun(ctx)` — Optional conditional execution logic

### BootstrapStageFactory

Dependency injection factory that creates the ordered pipeline of stages. Each stage is injected via constructor and returned in the correct execution order.

**Stage order is critical.** Do not reorder without understanding dependencies between stages.

### BootstrapResponseBuilder

Builds the final `PageBootstrapModel` from a fully-populated context. Handles 200/301/404 responses, i18n messages, cache hints, and experience shell data.

## Pipeline Stages

### 1. RouteRecognitionStage

**Responsibility:** Resolve locale context and match route against path-to-regexp rules.

**Sets:**

- `ctx.localeContext` — Full locale (language, region, currency, market, domain)
- `ctx.route` — Resolved route descriptor (kind, params, paths)
- `ctx.matchedRuleId` — Matched route rule ID for debugging
- `ctx.status` — 404 for unknown routes, 301 for redirects
- `ctx.redirectTo` — Redirect URL for 301 responses

**Notes:**

- Does NOT call `earlyReturn()` for 404/301 — shell data still needed
- Context resolution stage MUST run to populate shell even for errors

### 2. ContextResolutionStage

**Responsibility:** Resolve experience and merchandising profiles for this request.

**Sets:**

- `ctx.experience` — Experience profile (theme, layout, cart UX mode)
- `ctx.merchandising` — Merchandising profile (mode, default sort)
- `ctx.defaultSortApplied` — True if default sort was injected into query

**Notes:**

- Always runs, even for 404/301 responses (shell needs experience data)
- May mutate `ctx.query` to inject default sort
- Reads `ctx.route` and `ctx.localeContext` (must run after route recognition)

### 3. AssemblyCacheStage

**Responsibility:** Check if assembled page exists in cache and skip assembly if found.

**Sets (if cache hit):**

- `ctx.status`, `ctx.seo`, `ctx.content`, `ctx.revalidateTags`, `ctx.assemblerKey`
- Calls `earlyReturn()` to skip assembly stage

**Notes:**

- Currently a stub (always misses, returns early)
- Future: Integrate with Redis or CDN edge cache
- Cache key should fingerprint: route, query, experience, merchandising, locale

**Conditional:** Skipped if `ctx.status !== 200`

### 4. PageAssemblyStage

**Responsibility:** Execute route-specific assembler to build page content.

**Sets:**

- `ctx.status` — 200 for success, 404 for failures
- `ctx.seo` — Title, description, images
- `ctx.content` — Page content nodes (before slot planning)
- `ctx.revalidateTags` — Cache invalidation tags
- `ctx.assemblerKey` — Assembler identifier
- `ctx.assemblyVersion` — Schema version
- `ctx.translationVersion` — Translation version

**Notes:**

- Validates cart route against `cartUxMode` (blocks if drawer mode)
- Calls assembler with timeout/resilience wrapper
- Calls `earlyReturn(404)` on assembly failure or null result
- Scopes revalidation tags to current language

**Conditional:** Skipped if `ctx.status !== 200`

### 5. SlotPlanningStage

**Responsibility:** Convert page content nodes into slot manifests (inline vs deferred).

**Sets:**

- `ctx.slots` — Array of `SlotManifest` with payloads or references

**Notes:**

- Delegates to `SlotPlannerService.planSlots()`
- Returns empty slots for 404/301 responses

**Conditional:** Skipped if `ctx.status !== 200`

### 6. PersonalizationStage

**Responsibility:** Apply experience and merchandising overlays to slots.

**Modifies:**

- `ctx.slots` — Updates variant keys, layout keys, density, flags, include/exclude

**Notes:**

- Experience overlay runs first
- Merchandising overlay runs second (last wins)
- Returns empty slots for 404/301 responses

**Conditional:** Skipped if `ctx.status !== 200`

### 7. LinkLocalizationStage

**Responsibility:** Normalize all internal paths for current locale and audit compliance.

**Sets:**

- `ctx.localizationAudit` — Violations and warnings for non-compliant links

**Modifies:**

- `ctx.content` — Normalizes paths in content nodes
- `ctx.slots` — Normalizes paths in slot payloads

**Notes:**

- Always runs (even for 404/301) to ensure shell paths are localized
- Logs violations if `LINK_LOCALIZATION_WARN_ON_VIOLATIONS=true`
- Delegates to `LinkLocalizationPolicyService`

## Stage Execution Flow

```
BootstrapOrchestratorService.buildBootstrap()
  ↓
Create BootstrapContext
  ↓
For each stage in pipeline:
  ↓
  Check ctx.shouldStopProcessing() → break if true
  ↓
  Check stage.shouldRun(ctx) → skip if false
  ↓
  Execute stage.execute(ctx)
  ↓
  Track timing and metrics
  ↓
End loop
  ↓
BootstrapResponseBuilder.build(ctx) → PageBootstrapModel
```

## Timing and Metrics

Each stage is timed independently:

```json
{
  "type": "bootstrap",
  "requestId": "abc123",
  "routeKind": "product-detail",
  "status": 200,
  "timings": {
    "routeMs": 2.5,
    "assemblyMs": 45.3,
    "totalMs": 52.1
  },
  "stages": [
    { "name": "route-recognition", "durationMs": 2.5 },
    { "name": "context-resolution", "durationMs": 1.2 },
    { "name": "assembly-cache", "durationMs": 0.1 },
    { "name": "page-assembly", "durationMs": 45.3 },
    { "name": "slot-planning", "durationMs": 1.8 },
    { "name": "personalization", "durationMs": 0.9 },
    { "name": "link-localization", "durationMs": 0.4 }
  ]
}
```

## Adding a New Stage

1. **Create stage file** in `stages/<name>.stage.ts`:

```typescript
import { Injectable } from "@nestjs/common";
import type { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { BootstrapStage } from "../bootstrap/bootstrap-stage.interface";

@Injectable()
export class MyNewStage implements BootstrapStage {
  readonly name = "my-new-stage";

  shouldRun(ctx: BootstrapContext): boolean {
    // Optional: Add conditional logic
    return ctx.status === 200;
  }

  execute(ctx: BootstrapContext): void {
    // Perform stage work
    // Mutate ctx as needed
  }
}
```

2. **Register in module** (`page-data.module.ts`):

```typescript
import { MyNewStage } from "./stages/my-new-stage.stage";

@Module({
  providers: [
    // ... existing stages
    MyNewStage,
  ],
})
```

3. **Add to factory** (`bootstrap-stage.factory.ts`):

```typescript
constructor(
  // ... existing stages
  private readonly myNewStage: MyNewStage,
) {}

createPipeline(): BootstrapStage[] {
  return [
    // ... existing stages in order
    this.myNewStage,
  ];
}
```

4. **Write unit test** (`stages/my-new-stage.spec.ts`):

```typescript
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import { MyNewStage } from "./my-new-stage.stage";

describe("MyNewStage", () => {
  test("performs expected work", () => {
    const stage = new MyNewStage();
    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-1",
    });

    stage.execute(ctx);

    assert.equal(ctx.someField, "expected value");
  });
});
```

## Testing Strategies

### Unit Testing Individual Stages

Test each stage in isolation with mock context:

- Create minimal `BootstrapContext` with required fields
- Call `stage.execute(ctx)`
- Assert context mutations

### Integration Testing Full Pipeline

Test orchestrator with all stages:

- Create real orchestrator with all dependencies
- Call `buildBootstrap()` with test inputs
- Assert final `PageBootstrapModel` structure

### Conditional Execution Testing

Test `shouldRun()` logic:

- Create context with various states (404, 200, etc.)
- Assert stage skips or runs as expected

## Error Handling

### Stage Errors

Stages should:

- Catch errors and log with `ctx.requestId`
- Call `ctx.earlyReturn(404)` for critical failures
- Let non-critical errors bubble up (orchestrator catches)

### Orchestrator Errors

Orchestrator:

- Wraps pipeline in `LoadSheddingService.run()`
- Catches errors from stages
- Records metrics for failed requests
- Returns 500 response if pipeline fails

## Design Principles

1. **Stages are stateless** — All state is in context, not stage instances
2. **Stages are reentrant** — Safe to reuse for multiple requests
3. **Context is mutable** — Stages freely mutate context
4. **Pipeline order is fixed** — No dynamic reordering
5. **Early exit is explicit** — Use `ctx.earlyReturn()`, not exceptions
6. **Timing is mandatory** — All stages are timed for observability

## See Also

- [Main Page Data README](./README.md) — Overview of page-data domain
- [Bootstrap Refactor Plan](../../refactoring/bootstrap-orchestrator-refactor.md) — Refactoring design doc
- [Phase 4 Integration Tests](../../refactoring/phase-4.3-integration-tests.md) — Test coverage
