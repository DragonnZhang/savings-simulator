/**
 * Core types for the savings simulation.
 */

import { z } from 'zod';

/**
 * Validation schema for SimulationConfig
 */
export const SimulationConfigSchema = z.object({
  initialIncome: z.number().positive('Initial income must be positive'),
  incomeGrowthRate: z.number().min(-1).max(1),
  initialExpenses: z.number().nonnegative('Initial expenses must be non-negative'),
  expenseGrowthRate: z.number().min(-1).max(1),
  investmentReturnRate: z.number().min(-1).max(1),
  durationYears: z.number().int().positive().max(100),
});

/**
 * Configuration for the savings simulation.
 */
export type SimulationConfig = z.infer<typeof SimulationConfigSchema>;

/**
 * Override for a specific year.
 */
export interface YearlyOverride {
  yearIndex: number; // 0-based index
  income?: number;
  expenses?: number;
}

/**
 * Result for a single year's calculation.
 */
export interface YearlyResult {
  year: number; // 1-based year number
  income: number;
  expenses: number;
  investmentReturn: number;
  netSavings: number;
  totalSavings: number;
  isOverridden: boolean;
}

/**
 * Complete simulation result.
 */
export interface SimulationResult {
  results: YearlyResult[];
  totalSavings: number; // Final year total
}
