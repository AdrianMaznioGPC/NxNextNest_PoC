# Bootstrap Orchestrator Refactoring - Progress Tracker

## Phase 1: Foundation (No Breaking Changes)

### 1.1 Create `bootstrap-context.model.ts`

- [x] Create file `apps/bff/src/modules/page-data/bootstrap/bootstrap-context.model.ts`
- [x] Define `BootstrapContext` class with all fields
- [x] Add `shouldStopProcessing()` helper method
- [x] Add `earlyReturn(status, redirectTo?)` helper method
- [x] Add constructor with required params

### 1.2 Create `bootstrap-stage.interface.ts`

- [x] Create file `apps/bff/src/modules/page-data/bootstrap/bootstrap-stage.interface.ts`
- [x] Define `BootstrapStage` interface
- [x] Add `name: string` property
- [x] Add `execute(ctx: BootstrapContext): Promise<void> | void` method
- [x] Add optional `shouldRun?(ctx: BootstrapContext): boolean` method

### 1.3 Create `assembly-result.model.ts`

- [x] Create file `apps/bff/src/modules/page-data/models/assembly-result.model.ts`
- [x] Define `AssemblyResult` type
- [x] Include: status, seo, content, revalidateTags, assemblerKey, assemblyVersion, translationVersion

### 1.4 Create `assembler-budget.config.ts`

- [x] Create file `apps/bff/src/modules/page-data/models/assembler-budget.config.ts`
- [x] Define `AssemblerBudgetConfig` interface
- [x] Create `DefaultAssemblerBudgetConfig` implementation
- [x] Extract hardcoded budget map from orchestrator
- [x] Add `getBudgetMs(routeKind: string): number` method
- [x] Add to module providers

---

## Phase 2: Create Stages (One at a Time)

### 2.1 Create `route-recognition.stage.ts`

- [x] Create file `apps/bff/src/modules/page-data/stages/route-recognition.stage.ts`
- [x] Implement `BootstrapStage` interface
- [x] Set `name = 'route-recognition'`
- [x] Inject `RouteRecognitionService` and `I18nService`
- [x] Extract route recognition logic from orchestrator
- [x] Add early validation for 404/301
- [x] Write unit test

### 2.2 Create `context-resolution.stage.ts`

- [x] Create file `apps/bff/src/modules/page-data/stages/context-resolution.stage.ts`
- [x] Implement `BootstrapStage` interface
- [x] Set `name = 'context-resolution'`
- [x] Inject `ExperienceResolverService` and `MerchandisingResolverService`
- [x] Extract experience resolution logic
- [x] Extract merchandising resolution logic
- [x] Apply merchandising defaults
- [x] Record merchandising metrics
- [ ] Write unit test

### 2.3 Create `assembly-cache.stage.ts`

- [x] Create file `apps/bff/src/modules/page-data/stages/assembly-cache.stage.ts`
- [x] Implement `BootstrapStage` interface
- [x] Set `name = 'assembly-cache'`
- [x] Add `buildCacheKey(ctx)` method
- [x] Add `get(cacheKey)` method (stub returning null)
- [x] Add `set(cacheKey, assembly, ttl)` method (stub)
- [x] Add `isEnabled()` method (returns false for now)
- [x] Add TODO comments for Redis/CDN integration
- [ ] Write unit test

### 2.4 Create `page-assembly.stage.ts`

- [x] Create file `apps/bff/src/modules/page-data/stages/page-assembly.stage.ts`
- [x] Implement `BootstrapStage` interface
- [x] Set `name = 'page-assembly'`
- [x] Inject `PageAssemblerRegistry`, `ResilienceService`, `AssemblerBudgetConfig`, `ScalabilityMetricsService`, `Logger`
- [x] Extract cart route validation logic
- [x] Extract assembler execution logic
- [x] Extract error handling logic
- [x] Add `create404Assembly()` helper
- [ ] Write unit test

### 2.5 Create `slot-planning.stage.ts`

- [x] Create file `apps/bff/src/modules/page-data/stages/slot-planning.stage.ts`
- [x] Implement `BootstrapStage` interface
- [x] Set `name = 'slot-planning'`
- [x] Inject `SlotPlannerService`
- [x] Wrap existing slot planner logic
- [x] Handle 404 case (return empty slots)
- [ ] Write unit test

### 2.6 Create `personalization.stage.ts`

- [x] Create file `apps/bff/src/modules/page-data/stages/personalization.stage.ts`
- [x] Implement `BootstrapStage` interface
- [x] Set `name = 'personalization'`
- [x] Inject `ExperienceResolverService` and `MerchandisingResolverService`
- [x] Apply experience overlay first
- [x] Apply merchandising overlay second
- [x] Handle 404 case (skip overlays)
- [ ] Write unit test

### 2.7 Create `link-localization.stage.ts`

- [x] Create file `apps/bff/src/modules/page-data/stages/link-localization.stage.ts`
- [x] Implement `BootstrapStage` interface
- [x] Set `name = 'link-localization'`
- [x] Inject `LinkLocalizationPolicyService`, `ScalabilityMetricsService`, `Logger`
- [x] Normalize content paths
- [x] Normalize slot paths
- [x] Audit page-level paths
- [x] Merge audits
- [x] Log violations
- [ ] Write unit test

---

## Phase 3: Factory & Orchestrator

### 3.1 Create `bootstrap-stage.factory.ts`

- [x] Create file `apps/bff/src/modules/page-data/bootstrap/bootstrap-stage.factory.ts`
- [x] Create `BootstrapStageFactory` class with `@Injectable()`
- [x] Inject all 7 stage services in constructor
- [x] Add `createPipeline(): BootstrapStage[]` method
- [x] Return stages in correct order
- [x] Add to module providers

### 3.2 Create `bootstrap-response.builder.ts`

- [x] Create file `apps/bff/src/modules/page-data/bootstrap/bootstrap-response.builder.ts`
- [x] Create `BootstrapResponseBuilder` class with `@Injectable()`
- [x] Inject `I18nService`, `LinkLocalizationPolicyService`, `CachePolicyService`
- [x] Add `build(ctx: BootstrapContext): PageBootstrapModel` method
- [x] Add `build404Response(ctx)` helper
- [x] Add `build301Response(ctx)` helper
- [x] Extract response assembly logic from orchestrator
- [x] Add to module providers

### 3.3 Refactor `bootstrap-orchestrator.service.ts`

- [x] Update constructor to inject: `BootstrapStageFactory`, `BootstrapResponseBuilder`, `LoadSheddingService`, `ScalabilityMetricsService`
- [x] Initialize `this.stages` from factory in constructor
- [x] Keep public `buildBootstrap()` API unchanged
- [x] Refactor `execute()` to use generic stage loop
- [x] Add timing tracking per stage
- [x] Add metrics recording per stage
- [x] Add early exit logic (`ctx.shouldStopProcessing()`)
- [x] Add conditional execution logic (`stage.shouldRun()`)
- [x] Remove old inline logic (moved to stages)
- [x] Clean up unused imports

---

## Phase 4: Integration & Testing

### 4.1 Update `page-data.module.ts`

- [x] Import all 7 stage classes
- [x] Import `BootstrapStageFactory`
- [x] Import `BootstrapResponseBuilder`
- [x] Import `DefaultAssemblerBudgetConfig`
- [x] Add all to providers array
- [x] Verify DI graph is correct
- [x] Run `npm run build:bff` to check for errors

### 4.2 Write unit tests for each stage

- [x] Test `route-recognition.stage.ts`
- [x] Test `context-resolution.stage.ts`
- [x] Test `assembly-cache.stage.ts`
- [x] Test `page-assembly.stage.ts`
- [x] Test `slot-planning.stage.ts`
- [x] Test `personalization.stage.ts`
- [x] Test `link-localization.stage.ts`

### 4.3 Write integration test for full pipeline

- [x] Create test file `bootstrap-orchestrator.integration.spec.ts`
- [x] Test full pipeline execution
- [x] Test early exit for 404
- [x] Test early exit for 301
- [x] Test all route kinds (home, product, category, search, cart, checkout)
- [x] Assert final response structure
- [x] Verify timings are recorded

### 4.4 Manual testing

- [ ] Start BFF: `npm run dev:bff`
- [ ] Test home page: `curl http://localhost:4000/page-data/bootstrap?path=/`
- [ ] Test product page: `curl http://localhost:4000/page-data/bootstrap?path=/product/...`
- [ ] Test category page: `curl http://localhost:4000/page-data/bootstrap?path=/category/...`
- [ ] Test search page: `curl http://localhost:4000/page-data/bootstrap?path=/search?q=test`
- [ ] Test cart page: `curl http://localhost:4000/page-data/bootstrap?path=/cart`
- [ ] Test checkout page: `curl http://localhost:4000/page-data/bootstrap?path=/checkout`
- [ ] Test 404: `curl http://localhost:4000/page-data/bootstrap?path=/invalid`
- [ ] Test with experience profile: `curl http://localhost:4000/page-data/bootstrap?path=/&customerProfile=vip`
- [ ] Test with merchandising: `curl http://localhost:4000/page-data/bootstrap?path=/category/...&sort=price`
- [ ] Verify timing logs show all stages
- [ ] Verify no errors in console

---

## Phase 5: Cleanup & Documentation

### 5.1 Remove old inline logic from orchestrator

- [x] Delete helper methods now in stages
- [x] Remove unused imports
- [x] Run formatter: `npm run prettier`
- [x] Verify build passes

### 5.2 Update documentation

- [x] Update `docs/bff/page-data/README.md` with stage architecture
- [x] Create `docs/bff/page-data/stage-architecture.md` with detailed stage docs
- [x] Document each stage's responsibility
- [x] Add examples of adding new stages
- [x] Document testing strategies
- [x] Document cache boundaries

### 5.3 Add inline comments

- [x] Add JSDoc comments to `BootstrapContext` fields
- [x] Add JSDoc comments to `BootstrapStage` interface
- [x] Add comments explaining stage order in factory
- [x] Add TODO comments for future cache implementation (already in AssemblyCacheStage)
- [x] Add comments noting cache boundaries in README

---

## Completion Checklist

- [x] All Phase 1 tasks complete
- [x] All Phase 2 tasks complete
- [x] All Phase 3 tasks complete
- [x] All Phase 4 tasks complete (except manual testing 4.4)
- [x] All Phase 5 tasks complete
- [x] All tests passing (40/40 tests)
- [x] Code formatted with Prettier
- [x] Documentation updated
- [ ] Manual testing complete (Phase 4.4)
- [ ] Performance metrics baseline recorded
- [ ] Ready for code review

---

## Notes

**Current Status**: Phase 5 Complete - Documentation and cleanup finished

**Started**: 2025-01-XX

**Completed**:

- Phase 1 (Foundation) - 2025-01-26
- Phase 2 (Implementation) - 2025-01-26
- Phase 3 (Factory & Orchestrator) - 2025-01-26
- Phase 4 (Integration & Testing) - 2025-01-26
- Phase 5 (Cleanup & Documentation) - 2025-01-26

**Blockers**: None

**Questions**: None

**Phase 2 Notes**:

- All 7 stages created and building successfully
- Fixed type issues: stages use `SlotManifest[]` (not `ResolvedPageSlot[]`)
- Stages use WeakMap for temporary data sharing between stages
- Build passes: `npm run build:bff` ✓
- Next: Unit tests for all stages (deferred to later)
- Next: Proceed to Phase 3 (Factory & Orchestrator)

**Phase 3 Notes** (2025-01-26):

- Created `BootstrapStageFactory` with stage pipeline
- Created `BootstrapResponseBuilder` for final response assembly
- Refactored `BootstrapOrchestratorService` to use stage pipeline
- All stages execute successfully with timing metrics
- Build passes: `npm run build:bff` ✓
- Server starts and returns 200 responses ✓
- **Slot Planning Fix**: Resolved empty slots by removing `SlotManifest[]` assignment into the slot planner input (restored content-based slot generation).
- Verified: Slots render across home/product/category/search/content plus cart/checkout (with cart cookie).

**Phase 4 Notes** (2025-01-26):

- ✅ **4.1 Module Integration**: Complete
- ✅ **4.2 Unit Tests**: All 7 stage tests implemented (24 test cases, 100% pass)
- ✅ **4.3 Integration Tests**: Full pipeline test implemented (16 test cases, 100% pass)
- ✅ **Total Test Coverage**: 40 tests (24 unit + 16 integration)
- ✅ Test infrastructure: Added `tsx` for TypeScript test execution
- ✅ Test command: `cd apps/bff && npx tsx --test 'src/modules/page-data/**/*.spec.ts'`
- ✅ Tests use Node.js native test runner (no Jest/Vitest dependencies)
- ✅ Build passes: `npm run build:bff` ✓

**Integration Test Coverage**:

- ✓ Full pipeline execution (home, category-list, search routes)
- ✓ Early exit for 404 unknown routes
- ✓ Early exit for 301 redirects
- ✓ Cart route blocking when cartUxMode is drawer
- ✓ Merchandising default sort application
- ✓ Shell with experience and merchandising
- ✓ Cache hints, request ID, translation version
- ✓ Canonical URLs and matched rule IDs
- ✓ Query parameter handling

**Architecture Change**:

- Route recognition no longer calls `earlyReturn()` for 404/301
- Context resolution MUST run even for 404/301 to populate shell data
- Stages check `ctx.status !== 200` to skip assembly/slots/personalization
- Assembly failures call `earlyReturn()` to stop processing

**Phase 5 Notes** (2025-01-26):

- ✅ **5.1 Cleanup**: Orchestrator already clean, no helper methods to remove
- ✅ **5.2 Documentation**: Updated main README with stage architecture overview
- ✅ **5.3 Documentation**: Created comprehensive `stage-architecture.md` guide
- ✅ **5.4 JSDoc Comments**: Added detailed comments to context, interface, and factory
- ✅ Build passes: `npm run build:bff` ✓
- ✅ Tests pass: 40/40 tests ✓
- ✅ Prettier check: All files formatted ✓

**Remaining tasks**: Manual testing (Phase 4.4)

**Ready for**: Code review and production deployment (after manual testing)
