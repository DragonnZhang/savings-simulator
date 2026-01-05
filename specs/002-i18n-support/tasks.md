# Tasks: Bilingual Support (i18n)

**Input**: Design documents from `/specs/002-i18n-support/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install `next-intl` dependency in `apps/web/package.json`
- [x] T002 Configure `next-intl` in `apps/web/next.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for Next.js Internationalization

- [x] T003 Create directory `apps/web/src/i18n/messages/` and initialize `zh.json` and `en.json` with keys from `data-model.md`
- [x] T004 Implement i18n request configuration in `apps/web/src/i18n/request.ts`
- [x] T005 Implement i18n routing configuration in `apps/web/src/i18n/routing.ts`
- [x] T006 Define `Locale` type and supported locales in `packages/savings-core/src/types.ts`

**Checkpoint**: Foundation ready - Next.js i18n routing should be functional.

---

## Phase 3: User Story 1 - Switch Language (Priority: P1) 🎯 MVP

**Goal**: Implement the core language switching capability and translate main UI components.

**Independent Test**: Navigate to `/en` and `/zh`, verify that text changes, and use the switcher component to toggle between them.

### Implementation for User Story 1

- [x] T007 Move existing app files into `apps/web/src/app/[locale]/` and wrap layout with `NextIntlClientProvider`
- [x] T008 [US1] Implement `LanguageSwitcher` component in `apps/web/src/components/LanguageSwitcher.tsx`
- [x] T009 [US1] Integrate `LanguageSwitcher` into the header in `apps/web/src/app/[locale]/page.tsx`
- [x] T010 [US1] Replace static Chinese strings with `t()` calls in `apps/web/src/app/[locale]/page.tsx`
- [x] T011 [P] [US1] Externalize strings and implement translations in `apps/web/src/components/SimulationForm.tsx`
- [x] T012 [P] [US1] Externalize strings and implement translations in `apps/web/src/components/ResultsTable.tsx`
- [x] T013 [P] [US1] Externalize strings and implement translations in `apps/web/src/components/OverrideModal.tsx`
- [x] T014 [US1] Implement dynamic chart labels in `apps/web/src/components/SavingsChart.tsx`

**Checkpoint**: User Story 1 functional - full bilingual support achieved.

---

## Phase 4: User Story 2 - Language Persistence (Priority: P2)

**Goal**: Ensure the selected language is remembered across sessions.

**Independent Test**: Switch to English, refresh the page, and ensure the UI remains in English.

### Implementation for User Story 2

- [x] T015 [US2] Implement root redirection and persistence logic in `apps/web/src/app/page.tsx`

---

## Phase 5: User Story 3 - Default Language Detection (Priority: P3)

**Goal**: Automatically detect and set the language based on browser settings.

**Independent Test**: Access the root URL `/` with a browser set to English and verify redirection to `/en`.

### Implementation for User Story 3

- [x] T016 [US3] Implement browser language detection in `apps/web/src/app/page.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T017 [P] Update `README.md` with i18n instructions
- [x] T018 Run final verification against `specs/002-i18n-support/quickstart.md`
- [x] T019 [P] Fix UI overlap between LanguageSwitcher and GitHubLink

---

## Dependencies & Execution Order

- **Phase 1 & 2** are strictly sequential and block all further work.
- **Phase 3 (US1)** is the primary feature implementation.
- **Phase 4 & 5** are refinements to the i18n experience.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Complete US1 (T007-T014).
3. Validate that the app supports both languages and can switch between them.
