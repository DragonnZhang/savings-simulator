# Research: Advanced Financial Planning Features

## Decision: Goal Seek Algorithm
**Rationale**: The calculation of savings over time is a monotonic function relative to initial income or monthly savings. 
**Method**: Use a **Binary Search (Bisection Method)** to find the required value.
- **Range**: $0 to $1,000,000 (monthly) or $0 to $1B (total).
- **Precision**: Stop when the result is within 0.01% of the target.

## Decision: Inflation & Growth Modeling
**Rationale**: Users often confuse "salary growth" with "inflation". We will separate them to provide more realistic modeling.
**Logic**:
- `Current Salary` grows by `salaryGrowthRate` annually.
- `Current Expenses` grow by `expenseGrowthRate` (lifestyle creep) + `inflationRate` (market inflation) annually.
- **Real vs Nominal**: The chart will display **Nominal** values by default but calculate based on these separate rates.

## Decision: Multi-Scenario Visualization
**Rationale**: `recharts` supports multiple `<Area />` components.
**Approach**: 
- Update `SavingsChart` to accept an array of `namedResults: { name: string, color: string, data: YearlyResult[] }`.
- Transform data into a single array where each object has keys like `scenario1_total`, `scenario2_total` to work with `rechart`'s data model.

## Alternatives Considered
- **Newton's Method for Goal Seek**: Rejected because the function might not be perfectly differentiable if we add discrete "overrides" later, and Bisection is robust and fast enough for this scale.
- **Context API for Scenarios**: Rejected. `useReducer` in the main page is sufficient for the current local-only persistence requirement.
