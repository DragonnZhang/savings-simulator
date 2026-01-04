# Data Model: Savings Simulator

## Entities

### `SimulationConfig`

Primary input for the simulation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| initialIncome | number | Yes | Starting annual income |
| incomeGrowthRate | number | Yes | Percentage (e.g., 0.05 for 5%) |
| initialExpenses | number | Yes | Starting annual expenses |
| expenseGrowthRate | number | Yes | Percentage (e.g., 0.03 for 3%) |
| investmentReturnRate | number | Yes | Percentage (e.g., 0.08 for 8%) |
| durationYears | number | Yes | How many years to project (e.g., 30) |

### `YearlyOverride`

User modifications for specific years.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| yearIndex | number | Yes | 0-based index of the year to modify |
| income | number | Optional | New income amount for this year |
| expenses | number | Optional | New expense amount for this year |

### `YearlyResult`

Calculated output for a single year.

| Field | Type | Description |
|-------|------|-------------|
| year | number | 1-based year number (or absolute year) |
| income | number | Annual income |
| expenses | number | Annual expenses |
| investmentReturn | number | Returns generated from previous total savings |
| netSavings | number | `Income - Expenses + Return` |
| totalSavings | number | Cumulative savings |
| isOverridden | boolean | True if this year had manual overrides |

## Relationships

- One `SimulationConfig` produces Many `YearlyResult`.
- Many `YearlyOverride` modify the calculation of `YearlyResult`.
