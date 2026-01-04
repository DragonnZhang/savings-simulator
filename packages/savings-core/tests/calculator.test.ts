import { describe, it, expect } from 'vitest';
import { calculate } from '../src/calculator.js';
import type { SimulationConfig, YearlyOverride } from '../src/types.js';

describe('calculate', () => {
  const baseConfig: SimulationConfig = {
    initialIncome: 100000,
    incomeGrowthRate: 0.05, // 5%
    initialExpenses: 50000,
    expenseGrowthRate: 0.03, // 3%
    investmentReturnRate: 0.08, // 8%
    durationYears: 3,
  };

  it('should return correct number of yearly results', () => {
    const result = calculate(baseConfig);
    expect(result.results).toHaveLength(3);
    expect(result.results[0].year).toBe(1);
    expect(result.results[2].year).toBe(3);
  });

  it('should calculate year 1 correctly (no growth applied)', () => {
    const result = calculate(baseConfig);
    const year1 = result.results[0];

    expect(year1.income).toBe(100000);
    expect(year1.expenses).toBe(50000);
    expect(year1.investmentReturn).toBe(0); // No prior savings
    expect(year1.netSavings).toBe(50000);
    expect(year1.totalSavings).toBe(50000);
    expect(year1.isOverridden).toBe(false);
  });

  it('should apply income and expense growth in year 2', () => {
    const result = calculate(baseConfig);
    const year2 = result.results[1];

    // Income: 100000 * 1.05 = 105000
    expect(year2.income).toBe(105000);
    // Expenses: 50000 * 1.03 = 51500
    expect(year2.expenses).toBe(51500);
    // Investment return: 50000 * 0.08 = 4000
    expect(year2.investmentReturn).toBe(4000);
    // Net: 105000 - 51500 + 4000 = 57500
    expect(year2.netSavings).toBe(57500);
    // Total: 50000 + 57500 = 107500
    expect(year2.totalSavings).toBe(107500);
  });

  it('should handle overrides for specific years', () => {
    const overrides: YearlyOverride[] = [
      { yearIndex: 1, income: 120000, expenses: 80000 },
    ];
    const result = calculate(baseConfig, overrides);
    const year2 = result.results[1];

    expect(year2.income).toBe(120000);
    expect(year2.expenses).toBe(80000);
    expect(year2.isOverridden).toBe(true);
    // Net: 120000 - 80000 + 4000 (return) = 44000
    expect(year2.netSavings).toBe(44000);
  });

  it('should calculate total savings correctly at the end', () => {
    const result = calculate(baseConfig);
    expect(result.totalSavings).toBe(result.results[2].totalSavings);
  });

  it('should handle zero duration gracefully', () => {
    const config = { ...baseConfig, durationYears: 0 };
    const result = calculate(config);
    expect(result.results).toHaveLength(0);
    expect(result.totalSavings).toBe(0);
  });

  it('should handle negative growth rates', () => {
    const config: SimulationConfig = {
      ...baseConfig,
      incomeGrowthRate: -0.05,
      expenseGrowthRate: -0.02,
    };
    const result = calculate(config);
    const year2 = result.results[1];

    // Income: 100000 * 0.95 = 95000
    expect(year2.income).toBe(95000);
    // Expenses: 50000 * 0.98 = 49000
    expect(year2.expenses).toBe(49000);
  });
});
