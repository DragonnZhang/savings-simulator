# Implementation Plan: [FEATURE]

**Branch**: `002-i18n-support` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement Chinese and English bilingual support for the Savings Simulator. This involves externalizing all UI strings, implementing a language switcher, and ensuring persistence of user preference. The technical approach leverages standard Next.js internationalization patterns, likely using `next-intl` for App Router compatibility.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5, React 19, Next.js 15+ (App Router)
**Primary Dependencies**: Tailwind CSS v4, `next-intl`, `savings-core`
**Storage**: localStorage (for language preference)
**Testing**: npm test (jest/vitest assumed)
**Target Platform**: Web (Next.js)
**Project Type**: Monorepo (apps/web, packages/savings-core)
**Performance Goals**: <200ms language switch, no CLS during hydration
**Constraints**: Must work with Next.js App Router and Server Components
**Scale/Scope**: 2 languages (zh, en), ~20-30 strings

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate 1: Library-First**: Translation logic/types should reside in `packages/savings-core` if they are shared or core logic.
- **Gate 2: CLI Interface**: Any extraction or validation scripts must be runnable via CLI.
- **Gate 3: Test-First**: Tests for the i18n switcher and locale detection must be defined before implementation.
- **Gate 4: Simplicity**: Avoid over-engineering; use standard Next.js i18n patterns.

## Project Structure

### Documentation (this feature)

```text
specs/002-i18n-support/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output ([research.md](./research.md))
├── data-model.md        # Phase 1 output ([data-model.md](./data-model.md))
├── quickstart.md        # Phase 1 output ([quickstart.md](./quickstart.md))
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
apps/web/
├── src/
│   ├── app/
│   │   └── [locale]/    # If using directory-based routing
│   ├── components/
│   └── i18n/            # Configuration and messages
package.json
packages/
└── savings-core/        # Shared i18n types/logic
```

**Structure Decision**: Monorepo approach. UI-specific translations in `apps/web`. Shared core translations or types in `packages/savings-core`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
