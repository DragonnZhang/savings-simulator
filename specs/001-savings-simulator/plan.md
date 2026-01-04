# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Approach**:
1.  **Core Library (`savings-core`)**: Implement strict compound interest algorithms in a pure TypeScript package.
2.  **CLI**: Expose the core library via a simple CLI for verification and debugging.
3.  **Web App**: Build a Next.js application using `recharts` for visualization.
4.  **Integration**: The Web App imports the Core Library to perform calculations client-side.
5.  **State**: React local state (or Context) to manage the Simulation parameters and overrides.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 14+, React 18+, Recharts (Visualization)
**Storage**: LocalStorage (for simple persistence), no backend DB required initially.
**Testing**: Vitest (Unit), Playwright (E2E)
**Target Platform**: Modern Web Browsers
**Project Type**: Web Application
**Performance Goals**: <200ms calculation time, <500ms chart update
**Constraints**: Zero-dependency for core logic (Library-First principle)
**Scale/Scope**: ~5 screens, core calculation logic, interactive charts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] **Library-First**: Core calculation logic must be in a standalone directory (e.g., `packages/savings-core` or `src/lib/core`) and be independently testable.
- [ ] **CLI Interface**: Core library must be exercisable via CLI (e.g., `npm run cli -- --income 100000`).
- [ ] **Test-First**: Unit tests for calculation logic must be written BEFORE implementation.
- [ ] **Integration Testing**: End-to-end tests for the Web UI.
- [ ] **Simplicity**: No complex state management (Redux/Zustand) unless clearly needed; React State/Context should suffice.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# Monorepo-style structure for separation of concerns
.
├── packages/
│   └── savings-core/       # Pure TS library for calculations
│       ├── src/
│       │   ├── index.ts
│       │   ├── calculator.ts
│       │   └── types.ts
│       ├── tests/          # Vitest unit tests
│       └── package.json
│
├── apps/
│   └── web/                # Next.js Web App
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── lib/        # Logic adapters
│       ├── public/
│       └── package.json
│
├── package.json            # Workspace root
└── tsconfig.json
```

**Structure Decision**: Monorepo-style (using npm workspaces) to strictly enforce "Library-First" by physically separating the Core Logic (`packages/savings-core`) from the UI (`apps/web`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
