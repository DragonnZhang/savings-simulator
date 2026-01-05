/**
 * Core types for the savings simulation.
 */

import { z } from 'zod';

/**
 * Validation schema for SimulationConfig
 */
export const SimulationConfigSchema = z.object({
  initialIncome: z.number().positive('Initial income must be positive'),
  salaryGrowthRate: z.number().min(-1).max(1), // Replaces incomeGrowthRate
  initialExpenses: z.number().nonnegative('Initial expenses must be non-negative'),
  expenseGrowthRate: z.number().min(-1).max(1),
  inflationRate: z.number().min(-1).max(1), // New field
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

/**
 * A saved state of a simulation with metadata.
 */
export interface Scenario {
  id: string;
  name: string;
  config: SimulationConfig;
  overrides: YearlyOverride[];
  color: string;
}

/**
 * Goal seeking request.
 */
export interface GoalSeekRequest {
  targetAmount: number;
  targetYear: number;
  fixedVariable: 'monthlySavings' | 'returnRate';
}

/**
 * Supported locales
 */
export type Locale = 'en' | 'zh';

/**
 * List of supported locales
 */
export const LOCALES: Locale[] = ['en', 'zh'];

/**
 * Default locale
 */
export const DEFAULT_LOCALE: Locale = 'zh';
