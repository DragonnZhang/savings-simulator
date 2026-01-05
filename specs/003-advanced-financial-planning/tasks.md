# Tasks: Advanced Financial Planning Features

**Input**: Design documents from `/specs/003-advanced-financial-planning/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Ensure all dependencies (`zod`, `vitest`) are available in `packages/savings-core/package.json`
- [x] T002 [P] Configure `apps/web/package.json` with any new UI dependencies (e.g., `lucide-react` for icons if needed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update `SimulationConfigSchema` and `SimulationConfig` type in `packages/savings-core/src/types.ts` to include `inflationRate` and `salaryGrowthRate` (replaces `incomeGrowthRate`)
- [x] T004 [P] Update `index.ts` in `packages/savings-core/src/index.ts` to export any new types or utilities
- [x] T005 [P] Create initial test suite for new variables in `packages/savings-core/tests/calculator.test.ts` (should fail until US2 implementation)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 2 - Advanced Economic Variables (Priority: P1)

**Goal**: Account for inflation and salary growth separately for more realistic simulations.

**Independent Test**: Set inflation to 5% and salary growth to 5% in the UI, then verify that nominal savings grow while real-value purchasing power (manual check) is correctly modeled in calculations.

### Implementation for User Story 2

- [x] T006 [US2] Update `calculate` logic in `packages/savings-core/src/calculator.ts` to apply `inflationRate` to expenses and `salaryGrowthRate` to income
- [x] T007 [US2] Verify `calculate` with new variables via `npm test` in `packages/savings-core/`
- [x] T008 [US2] Update `SimulationForm.tsx` in `apps/web/src/components/SimulationForm.tsx` to include input fields for Inflation and Salary Growth
- [x] T009 [US2] Update `page.tsx` in `apps/web/src/app/[locale]/page.tsx` to handle the new config fields in the simulation action
- [x] T010 [US2] [P] Update translation files (e.g., `zh.json`, `en.json`) with labels for new input fields

**Checkpoint**: User Story 2 is functional. The simulator now accurately reflects economic conditions.

---

## Phase 4: User Story 1 - Multi-Scenario Comparison (Priority: P1) 🎯 MVP

**Goal**: Compare different financial paths side-by-side.

**Independent Test**: Save a "Baseline" scenario, then change income and save as "Increased Income". Verify both lines appear on the `SavingsChart`.

### Implementation for User Story 1

- [x] T011 [P] [US1] Define `Scenario` and `ScenarioResult` types in `packages/savings-core/src/types.ts`
- [x] T012 [P] [US1] Create `ScenarioManager.tsx` component in `apps/web/src/components/ScenarioManager.tsx` for saving/loading scenarios
- [x] T013 [US1] Update `SavingsChart.tsx` in `apps/web/src/components/SavingsChart.tsx` to support multiple data series and dynamic legend
- [x] T014 [US1] Refactor `page.tsx` state in `apps/web/src/app/[locale]/page.tsx` to manage an array of active scenarios instead of a single simulation result
- [x] T015 [US1] Implement `localStorage` persistence for scenarios in `apps/web/src/app/[locale]/page.tsx` or a custom hook
- [x] T016 [US1] Connect `ScenarioManager` to the main page and chart

**Checkpoint**: User Story 1 is functional. Users can save and compare scenarios.

---

## Phase 5: User Story 3 - Goal-Oriented Simulation (Priority: P2)

**Goal**: Reverse-calculate monthly savings needed to reach a target amount.

**Independent Test**: Enter a goal of ¥1,000,000 in 10 years, get the suggested monthly saving, apply it, and verify the final result is ¥1,000,000.

### Implementation for User Story 3

- [x] T017 [US3] Implement `goalSeek` utility in `packages/savings-core/src/calculator.ts` using the Bisection Method
- [x] T018 [US3] Add unit tests for `goalSeek` in `packages/savings-core/tests/calculator.test.ts`
- [x] T019 [US3] Create "Goal Mode" toggle and inputs in `SimulationForm.tsx` or a new subset component
- [x] T020 [US3] Implement the real-time goal calculation logic in `page.tsx` using the `goalSeek` utility
- [x] T021 [US3] Add "Apply Suggestion" button to update form state with the calculated monthly savings value

**Checkpoint**: User Story 3 is functional. Users can plan based on targets.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T022 [P] Ensure all new UI elements (ScenarioManager, Goal Mode) are fully responsive on mobile
- [x] T023 Code cleanup, ensuring types are shared correctly between lib and app (Fixed duplicate imports/lints)
- [x] T024 [P] Run `npm run lint` and `npm test` across the monorepo for final validation
- [x] T025 [P] Update `README.md` and feature docs with descriptions of new advanced features

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS all user stories because it changes the core `SimulationConfig`.
- **User Story 2 (P1)**: Should be done first as it provides the more accurate calculation engine that US1 and US3 will use.
- **User Story 1 (P1)**: Independent of US3, but depends on US2 for accurate data.
- **User Story 3 (P2)**: Independent of US1, but depends on US2 for the calculation engine.
- **Polish (Final Phase)**: Depends on all stories.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- Once Phase 2 is done, US1 and US2 implementation could technically start in parallel, but US2 is prioritized for calculation accuracy.
- T010 [P] (Translations) can be done anytime.
- T012 [P] (ScenarioManager UI) can be built while core logic is being updated.

---

## Parallel Example: User Story 2

```bash
# Update translations and build UI inputs in parallel:
Task: "Update translation files with labels for new input fields"
Task: "Update SimulationForm.tsx to include input fields for Inflation and Salary Growth"
```

---

## Implementation Strategy

### MVP First (US2 + US1)

1. Complete Foundational (T003-T005).
2. Complete US2 (T006-T010). This ensures the base "Simulator" is accurate.
3. Complete US1 (T011-T016). This delivers the "WOW" factor of comparison.
4. **VALIDATE**: Compare two scenarios with different inflation/growth rates.

### Incremental Delivery

1. Accurate engine (US2).
2. Comparison power (US1).
3. Goal planning (US3).
