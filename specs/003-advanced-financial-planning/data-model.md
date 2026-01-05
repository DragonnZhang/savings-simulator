# Data Model: Advanced Financial Planning

## SimulationConfig (Updated)
Extends the existing config to include economic variables.

| Field | Type | Description |
|-------|------|-------------|
| `inflationRate` | `number` | Annual inflation rate (0.02 = 2%) |
| `salaryGrowthRate` | `number` | Annual salary growth (replaces `incomeGrowthRate`) |

## Scenario
A saved state of a simulation.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (UUID or timestamp) |
| `name` | `string` | User-defined name (e.g., "Retire Early") |
| `config` | `SimulationConfig` | The specific inputs used |
| `overrides` | `YearlyOverride[]` | Any manual year adjustments |
| `color` | `string` | Hex code for chart display |

## GoalSeekRequest
Input for the goal seeking utility.

| Field | Type | Description |
|-------|------|-------------|
| `targetAmount` | `number` | The total savings desired |
| `targetYear` | `number` | The year to reach the goal |
| `fixedVariable` | `'monthlySavings' \| 'returnRate'` | Which variable should the system solve for? |
