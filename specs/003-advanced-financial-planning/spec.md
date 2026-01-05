# Feature Specification: Advanced Financial Planning Features

**Feature Branch**: `003-advanced-financial-planning`  
**Created**: 2026-01-05  
**Status**: Draft  
**Input**: User description: "Enhance the savings simulator with multi-scenario comparison, inflation/salary growth variables, and goal-oriented simulation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multi-Scenario Comparison (Priority: P1)

Users want to compare different financial life paths (e.g., "Rent vs. Buy" or "Current Career vs. Side Hustle") side-by-side to make informed decisions.

**Why this priority**: Focus on the core value of a "simulator" — exploring alternatives.

**Independent Test**: Can be tested by creating two scenarios with different income levels and observing both trend lines on the chart.

**Acceptance Scenarios**:

1. **Given** a default simulation, **When** the user clicks "Save Scenario" and gives it a name, **Then** the current configuration is stored.
2. **Given** one saved scenario, **When** the user modifies inputs and saves as a second scenario, **Then** both scenarios are displayed on the comparison chart.

---

### User Story 2 - Advanced Economic Variables (Priority: P1)

Users want more realistic simulations by accounting for the eroding power of inflation and the potential for career growth.

**Why this priority**: A 30-year simulation without inflation or salary growth is inaccurate and misleading.

**Independent Test**: Can be tested by setting inflation to 3% and salary growth to 5% and verifying that real-value savings differ from nominal-value savings.

**Acceptance Scenarios**:

1. **Given** the configuration form, **When** the user inputs "Inflation Rate (%)" and "Salary Growth (%)", **Then** the yearly calculations reflect these dynamic changes.
2. **Given** a multi-year simulation, **When** salary growth is applied, **Then** monthly income increases compounding yearly.

---

### User Story 3 - Goal-Oriented Simulation (Priority: P2)

Users have a specific target (e.g., "I want $1M by age 50") and want the system to tell them how to get there.

**Why this priority**: Many users start with a goal and need a plan, rather than having a plan and wanting to see the outcome.

**Independent Test**: Can be tested by entering a target amount and target date, and having the system calculate the required monthly savings.

**Acceptance Scenarios**:

1. **Given** "Goal Mode", **When** the user enters a target amount and target year, **Then** the system suggests the required monthly savings amount based on current interest rates.

---

### Edge Cases

- What happens when inflation rate exceeds investment return? (Purchasing power decreases over time)
- How does system handle negative salary growth? (e.g., expected pay cut or career break)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create and name multiple "Scenarios".
- **FR-002**: System MUST persist scenarios for the session.
- **FR-003**: System MUST include input fields for "Inflation Rate (%)" and "Annual Salary Growth (%)".
- **FR-004**: The calculation engine MUST apply inflation to expenses and salary growth to income.
- **FR-005**: The `SavingsChart` MUST be capable of rendering multiple data series (one for each active scenario).
- **FR-006**: System MUST provide a "Goal Seek" utility that solves for one unknown variable (e.g., monthly savings) given a target outcome.

### Key Entities *(include if feature involves data)*

- **Scenario**: Represents a complete set of simulation inputs (initial savings, income, expenses, growth rates, etc.) and its metadata (name).
- **Simulation Result**: The time-series data generated from a Scenario.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and compare two distinct scenarios in under 60 seconds.
- **SC-002**: Simulation calculations are verified to be mathematically accurate for compound growth/inflation within 0.01% precision.
- **SC-003**: 100% of saved scenarios are correctly reloaded upon page refresh during the same session.
