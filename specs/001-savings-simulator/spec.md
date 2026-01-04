# Feature Specification: Savings Simulator

**Feature Branch**: `001-savings-simulator`
**Created**: 2026-01-04
**Status**: Draft
**Input**: User description: "正如项目名称一样，我想做一个积蓄的模拟器，基本上就是根据我的年收入、年收入涨幅、年化收益率、年支出这些东西，然后能计算出来我 n 年以后的总的积蓄，然后我希望通过一个比较直观的可视化的方式来展示每年的积蓄变化，当然我还可以具体的调整某一年的一些属性，然后一切会变化，基本上就是这样"

## User Scenarios & Testing

### User Story 1 - Basic Savings Projection (Priority: P1)

As a user, I want to input my financial parameters and simulation duration so that I can see a year-by-year breakdown of my projected savings.

**Why this priority**: Core functionality. Without calculation, the simulator has no purpose.

**Independent Test**: Can be tested by inputting known values (e.g., 100k income, 0 growth, 10% return, 50k expense) and verifying the math for 1-2 years.

**Acceptance Scenarios**:

1. **Given** I enter Income: 100,000, Growth: 5%, Return: 8%, Expenses: 50,000, Years: 10. **When** I click "Simulate". **Then** I see a table with 10 rows showing correct calculated values for each year.
2. **Given** invalid inputs (e.g., negative years). **When** I submit. **Then** the system shows an error message.

---

### User Story 2 - Growth Visualization (Priority: P1)

As a user, I want to see a chart of my total savings accumulation so that I can intuitively understand the compounding effect over time.

**Why this priority**: User explicitly requested "intuitive visualization".

**Independent Test**: Verify that the chart renders and trends match the table data.

**Acceptance Scenarios**:

1. **Given** calculation results are available. **When** I view the dashboard. **Then** a line or bar chart displays the "Total Savings" metric over N years.
2. **Given** I update inputs and re-calculate. **When** the new data is ready. **Then** the chart updates immediately to reflect the new curve.

---

### User Story 3 - Interactive Year Adjustment (Priority: P2)

As a user, I want to adjust income or expenses for specific years (e.g., "Year 5") so that I can model life events like buying a house or a promotion.

**Why this priority**: Provides the "simulation" aspect, allowing "what-if" analysis requested by the user.

**Independent Test**: Modify a value in the middle of the timeline and verify that subsequent years' totals are affected.

**Acceptance Scenarios**:

1. **Given** a 10-year projection. **When** I change Year 5's Expense from 50k to 100k. **Then** Year 5's savings decrease, and Total Savings for Years 5-10 are reduced accordingly involving lost compound interest.
2. **Given** I change Year 3's Income. **When** the update triggers. **Then** the Chart updates to show the shift from Year 3 onwards.

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow user to input:
    - Current Annual Income
    - Annual Income Growth Rate (%)
    - Annualized Investment Return Rate (%)
    - Current Annual Expenses
    - Annual Expense Growth Rate (%) (Default: 3%)
    - Simulation Duration (Years) (Default: 30)
- **FR-002**: System MUST calculate for each year $n$:
    - `Income[n] = Income[n-1] * (1 + GrowthRate)`
    - `Expense[n] = Expense[n-1] * (1 + ExpenseGrowthRate)`
    - `InvestmentReturn[n] = TotalSavings[n-1] * ReturnRate`
    - `NetSavings[n] = Income[n] - Expense[n] + InvestmentReturn[n]`
    - `TotalSavings[n] = TotalSavings[n-1] + NetSavings[n]`
- **FR-003**: System MUST display the projection as a data table with columns: Year, Income, Expenses, Investment Return, Net Savings, Total Savings.
- **FR-004**: System MUST visualize "Total Savings" over time using a chart (Line or Bar).
- **FR-005**: System MUST allow users to override `Income` and `Expense` for any specific year $n$.
- **FR-006**: System MUST re-calculate all subsequent years ($n+1$...) immediately upon any modification.

### Key Entities

- **SimulationParams**: Stores base rates (Income, Growth%, Return%, Expense, Duration).
- **YearlyRecord**: Stores data for a specific year (Year #, Calculated Income, Overridden Income flag, Calculated Expense, Overridden Expense flag, etc.).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Calculating a 50-year projection takes under 200ms.
- **SC-002**: Chart renders/updates in under 500ms after data change.
- **SC-003**: 100% of arithmetic calculations match standard compound interest formulas (verified by unit tests).
