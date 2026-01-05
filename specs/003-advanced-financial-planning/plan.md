# Implementation Plan: Advanced Financial Planning Features

**Branch**: `003-advanced-financial-planning` | **Date**: 2026-01-05 | **Spec**: [spec.md](file:///Users/dragonzhang/Documents/savings-simulator/specs/003-advanced-financial-planning/spec.md)
**Input**: Feature specification for multi-scenario, inflation/growth, and goal-seek.

## Summary

This feature enhances the Savings Simulator by evolving its core logic and UI to support complex financial planning. Key changes include:
1. **Core Logic**: Update `savings-core` to handle inflation (applied to expenses) and salary growth (applied to income).
2. **Goal-Oriented Simulation**: Implement a "Goal Seek" algorithm in `savings-core` to solve for monthly savings required to hit a target.
3. **Multi-Scenario Comparison**: Update the web application to support saving, loading, and comparing up to 3 scenarios visually on the chart.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 15+
**Primary Dependencies**: Tailwind CSS v4, `next-intl`, `savings-core` (local package), `recharts` (likely used for `SavingsChart`)
**Storage**: localStorage for scenario persistence.
**Testing**: `npm test` in `packages/savings-core` and `apps/web`.
**Target Platform**: Web (Modern Browsers)
**Project Type**: Monorepo with App Router.
**Performance Goals**: Instant calculation updates on input change (<50ms).
**Constraints**: Calculation precision of 0.01%.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Library-First**: All new calculation logic must reside in `packages/savings-core`.
- [ ] **Test-First**: New logic in `savings-core` MUST have unit tests before UI implementation.
- [x] **Simplicity**: Use native browser `localStorage` and React state for scenario management; avoid complex state libraries like Redux unless multi-page sync is needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-advanced-financial-planning/
├── spec.md              # Requirements
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # Data structures
├── quickstart.md        # How to run
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
packages/savings-core/
├── src/
│   ├── types.ts         # Update SimulationConfig, add Scenario
│   ├── calculator.ts    # Update calculate(), add goalSeek()
│   └── index.ts
└── tests/
    └── calculator.test.ts # Unit tests for new logic

apps/web/
├── src/
│   ├── components/
│   │   ├── SimulationForm.tsx # Add inflation/growth inputs
│   │   ├── SavingsChart.tsx   # Support multiple series
│   │   └── ScenarioManager.tsx # [NEW] Save/Load UI
│   └── app/[locale]/
│       └── page.tsx           # Update state management
```

**Structure Decision**: Monorepo approach. Logic is centralized in `savings-core` to ensure the "Library-First" principle. UI components in `apps/web` will be updated to expose the new variables.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multi-series Chart | Required for side-by-side comparison | Separate charts would take too much vertical space |
| Bisection Method | Robust way to solve for non-linear goals | Newton's method requires derivatives which are complex for discrete simulations |

## Verification Plan

### Automated Tests
- **Core Library Tests**:
  - Run `npm test` in `packages/savings-core`.
  - Add new test cases in `packages/savings-core/tests/calculator.test.ts` for:
    - Calculation with inflation and salary growth.
    - `goalSeek` utility accuracy.
- **Web App Linting**:
  - Run `npm run lint` in `apps/web`.

### Manual Verification
1. **Scenario Manager**:
   - Open the web app.
   - Enter values and click "Save as Scenario".
   - Verify that the scenario appears in the list and can be toggled.
2. **Inflation/Growth**:
   - Set inflation to 10% and verify that real savings decrease rapidly in the simulation results.
3. **Goal Seek**:
   - In "Goal Mode", enter a target of ¥1,000,000 in 10 years.
   - Verify that the "Suggested Monthly Savings" automatically updates.
   - Click "Apply Suggestion" and verify that the final savings in the results table matches the target.
