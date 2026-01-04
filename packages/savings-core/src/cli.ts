#!/usr/bin/env node

/**
 * CLI for savings-core library.
 *
 * Usage:
 *   npx tsx src/cli.ts --income 100000 --expense 50000 --years 10
 */

import { calculate } from './calculator.js';
import { SimulationConfigSchema } from './types.js';

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        result[key] = value;
        i++;
      }
    }
  }
  return result;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help !== undefined || Object.keys(args).length === 0) {
    console.log(`
Savings Simulator CLI

Usage:
  npx tsx src/cli.ts [options]

Options:
  --income <number>         Initial annual income (required)
  --incomeGrowth <number>   Income growth rate (default: 0.05)
  --expense <number>        Initial annual expenses (required)
  --expenseGrowth <number>  Expense growth rate (default: 0.03)
  --return <number>         Investment return rate (default: 0.08)
  --years <number>          Simulation duration (default: 30)
  --help                    Show this help message

Example:
  npx tsx src/cli.ts --income 100000 --expense 50000 --years 10
    `);
    return;
  }

  const rawConfig = {
    initialIncome: parseFloat(args.income || '0'),
    incomeGrowthRate: parseFloat(args.incomeGrowth || '0.05'),
    initialExpenses: parseFloat(args.expense || '0'),
    expenseGrowthRate: parseFloat(args.expenseGrowth || '0.03'),
    investmentReturnRate: parseFloat(args.return || '0.08'),
    durationYears: parseInt(args.years || '30', 10),
  };

  const parseResult = SimulationConfigSchema.safeParse(rawConfig);
  if (!parseResult.success) {
    console.error('Invalid configuration:');
    for (const issue of parseResult.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  const config = parseResult.data;
  const result = calculate(config);

  console.log('\nSavings Projection:\n');
  console.log('Year | Income | Expenses | Return | Net Savings | Total Savings');
  console.log('-----|--------|----------|--------|-------------|-------------');

  for (const year of result.results) {
    console.log(
      `${year.year.toString().padStart(4)} | ` +
      `${year.income.toLocaleString().padStart(6)} | ` +
      `${year.expenses.toLocaleString().padStart(8)} | ` +
      `${year.investmentReturn.toLocaleString().padStart(6)} | ` +
      `${year.netSavings.toLocaleString().padStart(11)} | ` +
      `${year.totalSavings.toLocaleString().padStart(12)}`
    );
  }

  console.log(`\nFinal Total Savings: ${result.totalSavings.toLocaleString()}`);
}

main();
