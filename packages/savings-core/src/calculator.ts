/**
 * Core calculation logic for savings simulation.
 */

import type { SimulationConfig, YearlyOverride, YearlyResult, SimulationResult } from './types.js';

/**
 * Round a number to 2 decimal places for display.
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate the savings projection based on config and optional overrides.
 *
 * @param config - The simulation configuration
 * @param overrides - Optional array of year-specific overrides
 * @returns The simulation result with yearly breakdowns
 */
export function calculate(
  config: SimulationConfig,
  overrides: YearlyOverride[] = []
): SimulationResult {
  const results: YearlyResult[] = [];
  const overrideMap = new Map<number, YearlyOverride>();

  // Build override lookup map
  for (const override of overrides) {
    overrideMap.set(override.yearIndex, override);
  }

  let previousIncome = config.initialIncome;
  let previousExpenses = config.initialExpenses;
  let previousTotalSavings = 0;

  for (let i = 0; i < config.durationYears; i++) {
    const override = overrideMap.get(i);
    const isOverridden = override !== undefined;

    // Calculate income for this year
    let income: number;
    if (i === 0) {
      income = override?.income ?? config.initialIncome;
    } else {
      income = override?.income ?? round2(previousIncome * (1 + config.incomeGrowthRate));
    }

    // Calculate expenses for this year
    let expenses: number;
    if (i === 0) {
      expenses = override?.expenses ?? config.initialExpenses;
    } else {
      expenses = override?.expenses ?? round2(previousExpenses * (1 + config.expenseGrowthRate));
    }

    // Calculate investment return (from previous total savings)
    const investmentReturn = round2(previousTotalSavings * config.investmentReturnRate);

    // Calculate net savings for this year
    const netSavings = round2(income - expenses + investmentReturn);

    // Calculate total savings
    const totalSavings = round2(previousTotalSavings + netSavings);

    results.push({
      year: i + 1,
      income: round2(income),
      expenses: round2(expenses),
      investmentReturn,
      netSavings,
      totalSavings,
      isOverridden,
    });

    // Update for next iteration
    previousIncome = income;
    previousExpenses = expenses;
    previousTotalSavings = totalSavings;
  }

  return {
    results,
    totalSavings: results.length > 0 ? results[results.length - 1].totalSavings : 0,
  };
}
