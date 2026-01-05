# Quickstart: Advanced Financial Planning Features

## Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Tests (Core)**:
   Ensure the calculation logic is working:
   ```bash
   cd packages/savings-core
   npm test
   ```

3. **Run Web App**:
   ```bash
   cd apps/web
   npm run dev
   ```

## Key Workflows

### 1. Adding a New Scenario
- Fill out the form in the UI.
- Click "Save as Scenario" in the `ScenarioManager` (new component).
- Choose a name and color.

### 2. Goal Seeking
- Toggle to "Goal Mode".
- Enter target amount and year.
- See the suggested monthly savings calculated by the bisection algorithm.

### 3. Comparing Scenarios
- Save multiple scenarios.
- Use the checkboxes in the `ScenarioManager` to toggle visibility on the `SavingsChart`.
