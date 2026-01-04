# Research & Decisions: Savings Simulator

**Feature**: `001-savings-simulator`
**Date**: 2026-01-04

## Technology Decisions

### 1. Repository Structure: Monorepo (npm workspaces)
- **Decision**: Use a lightweight monorepo with `packages/` and `apps/` directories.
- **Rationale**: Strictly enforcing the "Library-First" constitution principle. The calculation logic (`savings-core`) must be usable independent of the web UI.
- **Alternatives Considered**: 
    - *Single Next.js App*: Rejected because it entangles logic with UI, making it harder to test logic in isolation or port to other interfaces (CLI).
    - *Nx/Turborepo*: Rejected as overkill for this scale. `npm workspaces` is sufficient.

### 2. Visualization Library: Recharts
- **Decision**: Use `recharts` for the dashboard.
- **Rationale**: Built for React, declarative, lightweight, and supports the simple Line/Bar charts needed. Highly customizable for "premium" aesthetics.
- **Alternatives Considered**:
    - *Chart.js*: Good, but imperatively driven, less "React-native" feel.
    - *D3.js*: Too low-level and complex for standard saving projection charts.

### 3. State Management: React Context + Reducer
- **Decision**: Use `useReducer` wrapped in a Context provider.
- **Rationale**: The Simulation has complex state (global params + N yearly overrides). A reducer is perfect for handling actions like "UPDATE_YEAR_OVERRIDE" or "RECALCULATE".
- **Alternatives Considered**:
    - *Redux/Zustand*: Valid, but `useReducer` is built-in and sufficient for this level of complexity.

### 4. Implementation Details (Entity Constraints)
- **Precision**: Money calculations should use floating point carefully. For a simulator (projection), standard `number` (IEEE 754) is acceptable as we don't need ledger-perfect cent accuracy for 30-year projections, but we will round to 2 decimals for display.
- **Performance**: 30 years * 5-6 ops = ~200 ops. Trivial for JS. 50 years is also trivial. No WebAssembly needed.

## Open Questions Resolved

- **Setup**: Will use standard `npm init -w` flow to setup workspaces.
- **Validation**: Inputs will be validated using Zod (runtime) to ensure "Growth Rate" etc. are valid numbers before calculation.
