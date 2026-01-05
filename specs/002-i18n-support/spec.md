# Feature Specification: Bilingual Support (i18n)

**Feature Branch**: `002-i18n-support`  
**Created**: 2026-01-05  
**Status**: Draft  
**Input**: User description: "帮我实现中英双语言"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Language (Priority: P1)

As a user, I want to switch between Chinese and English so that I can use the application in my preferred language.

**Why this priority**: Essential for multi-language support. Without this, the second language is inaccessible.

**Independent Test**: Can be fully tested by clicking a language toggle and verifying that all UI text changes to the selected language.

**Acceptance Scenarios**:

1. **Given** the application is in Chinese, **When** I click the English option, **Then** all UI text (headings, labels, buttons, chart labels) should change to English.
2. **Given** the application is in English, **When** I click the Chinese option, **Then** all UI text should change to Chinese.

---

### User Story 2 - Language Persistence (Priority: P2)

As a user, I want the application to remember my language choice so that I don't have to switch it every time I visit.

**Why this priority**: Improves user experience by maintaining preference across sessions.

**Independent Test**: Change language, refresh the page, and verify the language remains.

**Acceptance Scenarios**:

1. **Given** I have selected "English", **When** I refresh the page or return later, **Then** the UI should still be in English.

---

### User Story 3 - Default Language Detection (Priority: P3)

As a new user, I want the application to default to my browser's language so that it feels localized out of the box.

**Why this priority**: Enhances first-time experience.

**Independent Test**: Set browser language to English/Chinese and visit the site for the first time.

**Acceptance Scenarios**:

1. **Given** my browser is set to English and I have no saved preference, **When** I visit the site, **Then** the UI should default to English.

---

### Edge Cases

- What happens if a translation key is missing? The system should fall back to the default language (Chinese or English) or the key itself.
- How does the system handle currency symbols? Currency symbols (¥) should remain or change based on locale if appropriate (though ¥ is used for both CNY and JPY, typically ¥ for CNY in this context).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a language switcher in the UI (e.g., in the header).
- **FR-002**: System MUST support Chinese (Simplified) and English.
- **FR-003**: All static UI text MUST be externalized into translation files.
- **FR-004**: Chart labels and tooltips MUST be translated based on the active language.
- **FR-005**: Error messages and tooltips MUST be translated.
- **FR-006**: System MUST persist the user's language preference in local storage or a cookie.
- **FR-007**: System MUST detect the user's preferred language from the browser's `Accept-Language` header or `navigator.language`.

### Key Entities *(include if feature involves data)*

- **Translation**: A mapping of keys to localized strings for each supported language.
- **Locale**: The active language identifier (e.g., 'zh', 'en').

## Assumptions & Scope

- Initial support is limited to Chinese (Simplified) and English.
- No immediate need for date/time localization beyond what standard JS provides.
- Layout remains largely the same for both languages (no RTL support needed for now).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of UI text is translated into both Chinese and English.
- **SC-002**: Language switch happens in under 200ms without a full page reload (if possible).
- **SC-003**: 100% of users see their preferred language on return visits.
