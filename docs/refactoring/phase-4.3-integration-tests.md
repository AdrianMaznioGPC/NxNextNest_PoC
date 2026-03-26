# Phase 4.3: Integration Tests - Complete

**Date**: 2025-01-26  
**Status**: ✅ **COMPLETE**

---

## Overview

Implemented comprehensive integration tests for the bootstrap orchestrator pipeline, testing the full end-to-end flow from route recognition through response building.

## Test File

**Location**: `apps/bff/src/modules/page-data/bootstrap-orchestrator.integration.spec.ts`

**Test Count**: 16 integration test cases  
**Pass Rate**: 100%

---

## Test Coverage

### 1. Full Pipeline Execution ✅

- **Test**: `executes full pipeline for home page`
- **Validates**: Complete pipeline runs successfully for 200 responses
- **Assertions**:
  - Status 200
  - Route kind set correctly
  - SEO populated
  - Shell includes experience and merchandising
  - Slots generated
  - Cache hints included

### 2. Early Exit for 404 ✅

- **Test**: `early exit for 404 unknown route`
- **Validates**: Unknown routes return 404 but still populate shell
- **Assertions**:
  - Status 404
  - Route kind undefined
  - SEO shows "Page Not Found"
  - Empty slots array
  - Shell still populated (experience/merchandising)

### 3. Early Exit for 301 ✅

- **Test**: `early exit for 301 redirect`
- **Validates**: Redirect routes return 301 with redirect target
- **Assertions**:
  - Status 301
  - Redirect URL set
  - SEO shows redirect target page
  - Empty slots array
  - Shell still populated

### 4. Route Kind Coverage ✅

#### Home Route

- **Test**: `executes full pipeline for home page`
- **Validates**: Home page assembly and rendering

#### Category List

- **Test**: `executes pipeline for category-list route`
- **Validates**: Category list page processing

#### Search

- **Test**: `executes pipeline for search route`
- **Validates**: Search page with query parameters

#### Cart Blocking

- **Test**: `blocks cart route when cartUxMode is drawer`
- **Validates**: Cart route blocked when experience uses drawer UX
- **Expected**: Returns 404 status

### 5. Merchandising Features ✅

#### Default Sort Application

- **Test**: `applies merchandising default sort`
- **Validates**: Default sort applied when no sort in query
- **Assertions**:
  - `merchandisingApplied.defaultSortSlug = "relevance"`

#### No Sort Override

- **Test**: `does not apply merchandising sort when already present`
- **Validates**: Existing sort parameter not overridden
- **Assertions**:
  - `merchandisingApplied.defaultSortSlug = undefined`

### 6. Response Structure Validation ✅

#### Shell Data

- **Test**: `includes shell with experience and merchandising`
- **Validates**: Shell section fully populated
- **Assertions**:
  - Experience profile data
  - Theme configuration
  - Merchandising mode
  - I18n messages and namespaces

#### Localization Audit

- **Test**: `includes localization audit in response`
- **Validates**: Link localization runs without errors

#### Cache Hints

- **Test**: `sets correct cache hints per route kind`
- **Validates**: Cache control headers set based on route

#### Request Metadata

- **Test**: `includes requestId in response`
- **Test**: `includes translation version`
- **Test**: `includes matched rule ID`
- **Test**: `builds canonical URLs correctly`

### 7. Query Parameters ✅

- **Test**: `handles query parameters correctly`
- **Validates**: Query params passed through pipeline

---

## Mock Services Architecture

All tests use lightweight mock services instead of real dependencies:

```typescript
class MockI18nService {
  resolveLocaleContext() {
    return localeContext;
  }
  t(locale, key) {
    return translations[key];
  }
}

class MockRouteRecognitionService {
  recognize(path, locale) {
    // Returns route descriptor based on path
  }
}

class MockExperienceResolverService {
  async resolve() {
    return mockExperience;
  }
}

class MockPageAssemblerRegistry {
  getAssembler(routeKind) {
    // Returns mock assembler
  }
}
```

### Benefits of This Approach

1. No external dependencies (Jest, Sinon, etc.)
2. Tests run fast (< 5ms per test)
3. Full control over behavior
4. Easy to understand and maintain

---

## Key Findings & Fixes

### Issue #1: Experience/Merchandising Required for 404/301

**Problem**: Response builder expected `experience` and `merchandising` to be populated even for 404/301 responses.

**Root Cause**: Route recognition called `earlyReturn()` which stopped ALL subsequent stages, including context-resolution.

**Solution**:

- Route recognition sets status but does NOT call `earlyReturn()`
- Context resolution always runs (populates shell data)
- Assembly/slot stages check `ctx.status !== 200` and skip
- Only assembly failures call `earlyReturn()` to prevent slot processing

**Code Changes**:

```typescript
// OLD - route-recognition.stage.ts
if (route.status === 404) {
  ctx.earlyReturn(404); // ❌ Stops all stages
  return;
}

// NEW - route-recognition.stage.ts
if (route.status === 404) {
  ctx.status = 404; // ✅ Set status but continue
  return; // Continue to context-resolution
}
```

```typescript
// NEW - page-assembly.stage.ts
async execute(ctx: BootstrapContext) {
  if (ctx.status !== 200) {
    return;  // Skip assembly for non-200
  }
  // ... assembly logic
}
```

### Issue #2: Test Assumptions

**Problem**: Unit tests assumed stages would be called in isolation, but integration flow is different.

**Solution**: Updated unit tests to set `ctx.status = 200` before calling assembly stage.

---

## Test Execution

### Run Integration Tests Only

```bash
cd apps/bff
npx tsx --test src/modules/page-data/bootstrap-orchestrator.integration.spec.ts
```

### Run All Tests (Unit + Integration)

```bash
cd apps/bff
npx tsx --test 'src/modules/page-data/**/*.spec.ts'
```

**Output**:

```
ℹ tests 40
ℹ suites 8
ℹ pass 40
ℹ fail 0
```

---

## Architecture Insights

### Stage Execution Flow for 404

```
1. RouteRecognitionStage
   - Recognizes route is unknown
   - Sets ctx.status = 404
   - Sets ctx.seo (404 message)
   - Does NOT call earlyReturn()

2. ContextResolutionStage
   - Resolves experience profile (needed for shell)
   - Resolves merchandising profile
   - Runs normally

3. AssemblyCacheStage
   - Checks ctx.status !== 200
   - Returns early (skip cache check)

4. PageAssemblyStage
   - Checks ctx.status !== 200
   - Returns early (skip assembly)

5. SlotPlanningStage
   - Checks ctx.status === 404
   - Returns empty slots

6. PersonalizationStage
   - Checks ctx.status === 404
   - Returns empty slots

7. LinkLocalizationStage
   - Normalizes empty content/slots
   - Audits page-level paths

8. ResponseBuilder
   - Calls build404Response()
   - Includes shell with experience/merchandising
   - Returns empty slots
```

### Stage Execution Flow for Assembly Failure

```
1-3. [Normal execution]

4. PageAssemblyStage
   - Assembler returns null
   - Calls create404Assembly()
   - Sets ctx.status = 404
   - Calls ctx.earlyReturn(404) ← STOPS PROCESSING

5-7. [Skipped due to shouldStopProcessing() = true]

8. ResponseBuilder
   - Calls build404Response()
```

---

## Coverage Summary

| Category           | Coverage                           |
| ------------------ | ---------------------------------- |
| Pipeline Execution | ✅ Full flow tested                |
| Route Kinds        | ✅ Home, category, search, cart    |
| Error Handling     | ✅ 404, 301, cart blocking         |
| Merchandising      | ✅ Default sort, no override       |
| Response Structure | ✅ Page, shell, slots              |
| Metadata           | ✅ RequestId, timings, cache hints |
| Edge Cases         | ✅ Query params, localization      |

---

## Next Steps

✅ Phase 4.1: Module Integration - Complete  
✅ Phase 4.2: Unit Tests - Complete  
✅ Phase 4.3: Integration Tests - **Complete**  
⏭️ Phase 4.4: Manual Testing - TODO

After Phase 4.4, proceed to Phase 5 (Cleanup & Documentation).
