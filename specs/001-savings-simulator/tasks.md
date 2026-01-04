# Tasks: 001-savings-simulator

**Feature**: Savings Simulator (Branch: `001-savings-simulator`)
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Status

- [ ] **Phase 1: Setup**
- [ ] **Phase 2: Foundational (Core Library)**
- [ ] **Phase 3: Basic Projection (US1)**
- [ ] **Phase 4: Visualization (US2)**
- [ ] **Phase 5: Interactive Overrides (US3)**
- [ ] **Phase 6: Polish**

## Dependencies

- **US1** (Basic Projection) blocks **US2** (Visualization) and **US3** (Overrides).
- Core Library must be implemented before Web integration.

## Tasks

### Phase 1: Setup

*Goal: Initialize the monorepo structure and generic requirements.*

- [ ] T001 Initialize npm workspaces (monorepo structure) in project root <!-- id: 0 -->
- [ ] T002 Create `packages/savings-core` with TypeScript and Vitest setup <!-- id: 1 -->
- [ ] T003 Create `apps/web` with Next.js (clean install) <!-- id: 2 -->
- [ ] T004 Install `zod` in `savings-core` and shared dev dependencies <!-- id: 3 -->

### Phase 2: Foundational (Core Library)

*Goal: Implement the pure logic for savings calculation (US1 & US3 Support).*

- [ ] T005 [P] Define `SimulationConfig`, `YearlyOverride`, `YearlyResult` interfaces in `packages/savings-core/src/types.ts` <!-- id: 4 -->
- [ ] T006 [P] Create `packages/savings-core/src/calculator.ts` with empty `calculate` function <!-- id: 5 -->
- [ ] T007 Create unit tests for `calculate` in `packages/savings-core/tests/calculator.test.ts` (Red-Green) <!-- id: 6 -->
- [ ] T008 Implement compound interest logic in `calculate` function (handling US1 inputs) <!-- id: 7 -->
- [ ] T009 Implement override logic in `calculate` function (handling US3 overrides) <!-- id: 8 -->
- [ ] T010 Create simple CLI entry point in `packages/savings-core/src/cli.ts` <!-- id: 9 -->
- [ ] T011 Verify core library build and tests pass <!-- id: 10 -->

### Phase 3: Basic Projection (US1)

*Goal: User can input parameters and see a data table.*
*Story: [US1] Basic Savings Projection*

- [ ] T012 [P] [US1] Create `SimulationForm` component in `apps/web/src/components/SimulationForm.tsx` <!-- id: 11 -->
- [ ] T013 [P] [US1] Create `ResultsTable` component in `apps/web/src/components/ResultsTable.tsx` <!-- id: 12 -->
- [ ] T014 [US1] Implement Main Page state management (reducer) in `apps/web/src/app/page.tsx` <!-- id: 13 -->
- [ ] T015 [US1] Integrate `savings-core` into Main Page and wire up Form/Table <!-- id: 14 -->

### Phase 4: Visualization (US2)

*Goal: User can see a chart of their savings.*
*Story: [US2] Growth Visualization*

- [ ] T016 [US2] Install `recharts` in `apps/web` <!-- id: 15 -->
- [ ] T017 [US2] Create `SavingsChart` component in `apps/web/src/components/SavingsChart.tsx` <!-- id: 16 -->
- [ ] T018 [US2] Add `SavingsChart` to Main Page layout <!-- id: 17 -->

### Phase 5: Interactive Overrides (US3)

*Goal: User can adjust specific years.*
*Story: [US3] Interactive Year Adjustment*

- [ ] T019 [US3] Update `ResultsTable` to allow selecting/editing a row <!-- id: 18 -->
- [ ] T020 [US3] Create `OverrideModal` (or inline edit) component in `apps/web/src/components/OverrideModal.tsx` <!-- id: 19 -->
- [ ] T021 [US3] Connect Override UI to Main Page state reducer to trigger recalculation <!-- id: 20 -->

### Phase 6: Polish

*Goal: Styling and final verification.*

- [ ] T022 Apply premium styling/theming (CSS modules or global CSS) to all components <!-- id: 21 -->
- [ ] T023 Run full manual verification of all User Stories <!-- id: 22 -->

## Parallel Execution Candidates

- **Phase 2**: T005 and T006 can be done in parallel.
- **Phase 3**: T012 (Form) and T013 (Table) are independent UI components.
