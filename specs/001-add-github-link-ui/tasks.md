# Tasks: Add GitHub Link and Beautify UI

**Feature Branch**: `001-add-github-link-ui` (run `git checkout 001-add-github-link-ui` before starting)
**Spec**: [spec.md](spec.md)

## Phase 1: Setup

Prerequisites and project initialization.

- [ ] T001 Verify project running locally `npm run dev` <!-- id: 5 -->

## Phase 2: Foundational

Core blocking tasks.

- [ ] T002 Verify global styles and Font configuration in `apps/web/src/app/globals.css` and `apps/web/src/app/layout.tsx` <!-- id: 6 -->

## Phase 3: User Story 1 - Access Source Code (P1)

**Goal**: Visitors can easily find and visit the source code repository.
**Independent Test**: GitHub logo is visible in top-right and opens correct URL in new tab.

- [ ] T003 [US1] Create GitHub Icon SVG component (or inline) in `apps/web/src/components/icons/GitHubIcon.tsx` <!-- id: 7 -->
- [ ] T004 [US1] Create `GitHubLink` component in `apps/web/src/components/GitHubLink.tsx` with premium styling (glass effect) <!-- id: 8 -->
- [ ] T005 [P] [US1] Add `GitHubLink` to `apps/web/src/app/page.tsx` (absolute positioned top-right) <!-- id: 9 -->
- [ ] T006 [US1] Verify responsive positioning (mobile check) <!-- id: 10 -->

## Phase 4: User Story 2 - Premium Visual Experience (P1)

**Goal**: Application feels high-quality and trustworthy with modern aesthetics.
**Independent Test**: UI elements react to hover, typography is modern, gradients are used.

- [ ] T007 [P] [US2] Audit and update `apps/web/src/app/page.tsx` to ensure all major sections use `card-hover` and `glass` effects <!-- id: 11 -->
- [ ] T008 [US2] Enhance typography in `apps/web/src/app/globals.css` if needed to strict match "modern sans-serif" (verify Inter/Geist usage) <!-- id: 12 -->
- [ ] T009 [US2] Add subtle appearance animations to main container in `apps/web/src/app/page.tsx` <!-- id: 13 -->

## Final Phase: Polish

- [ ] T010 Validate Accessibility (WCAG contrast) for new elements <!-- id: 14 -->
- [ ] T011 Final visual inspection against spec requirements <!-- id: 15 -->

## Dependencies

- **US1** (GitHub Link) is independent.
- **US2** (Premium UI) can be done in parallel, but modifies same `page.tsx`, so merge conflicts possible if not coordinated. Recommended: Finish US1 (small), then US2.

## Implementation Strategy

1. **MVP**: Implement the GitHub Link (US1) first as it's a discrete addition.
2. **Enhancement**: Polish the UI (US2) by applying the design system classes more broadly.
