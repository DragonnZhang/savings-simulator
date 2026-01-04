/**
 * Savings Simulator Core Library Contract
 * 
 * This file defines the public API of the `savings-core` package.
 */

export interface SimulationConfig {
  initialIncome: number;
  incomeGrowthRate: number; // 0.05 = 5%
  initialExpenses: number;
  expenseGrowthRate: number; // 0.03 = 3%
  investmentReturnRate: number; // 0.08 = 8%
  durationYears: number;
}

export interface YearlyOverride {
  yearIndex: number; // 0 to durationYears - 1
  income?: number;
  expenses?: number;
}

export interface YearlyResult {
  year: number; // 1 to durationYears
  income: number;
  expenses: number;
  investmentReturn: number;
  netSavings: number;
  totalSavings: number;
  isOverridden: boolean;
}

export interface SimulationResult {
  results: YearlyResult[];
  totalSavings: number; // Final year total
}

export interface Simulator {
  /**
   * Calculates the savings projection based on config and optional overrides.
   */
  calculate(config: SimulationConfig, overrides?: YearlyOverride[]): SimulationResult;
}
