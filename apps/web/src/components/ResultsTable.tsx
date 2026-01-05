'use client';

import { useTranslations, useLocale } from 'next-intl';

interface YearlyResult {
  year: number;
  income: number;
  expenses: number;
  investmentReturn: number;
  netSavings: number;
  totalSavings: number;
  isOverridden: boolean;
}

interface ResultsTableProps {
  results: YearlyResult[];
  onRowClick?: (yearIndex: number) => void;
}

function formatCurrency(value: number, locale: string): string {
  return value.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function ResultsTable({ results, onRowClick }: ResultsTableProps) {
  const t = useTranslations('Table');
  const locale = useLocale();

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        {t('emptyState')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-3 text-left text-gray-400 font-medium">{t('year')}</th>
            <th className="px-4 py-3 text-right text-emerald-400 font-medium">{t('income')}</th>
            <th className="px-4 py-3 text-right text-rose-400 font-medium">{t('expenses')}</th>
            <th className="px-4 py-3 text-right text-amber-400 font-medium">{t('investmentReturn')}</th>
            <th className="px-4 py-3 text-right text-sky-400 font-medium">{t('netSavings')}</th>
            <th className="px-4 py-3 text-right text-purple-400 font-medium">{t('totalSavings')}</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr
              key={row.year}
              onClick={() => onRowClick?.(row.year - 1)}
              className={`border-b border-gray-800 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-gray-800/50' : ''
              } ${row.isOverridden ? 'bg-amber-900/20' : ''}`}
            >
              <td className="px-4 py-3 text-gray-300">
                {t('yearLabel', { year: row.year })}
                {row.isOverridden && (
                  <span className="ml-2 text-xs text-amber-400">{t('overridden')}</span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-emerald-300 font-mono">
                {formatCurrency(row.income, locale)}
              </td>
              <td className="px-4 py-3 text-right text-rose-300 font-mono">
                {formatCurrency(row.expenses, locale)}
              </td>
              <td className="px-4 py-3 text-right text-amber-300 font-mono">
                {formatCurrency(row.investmentReturn, locale)}
              </td>
              <td className="px-4 py-3 text-right text-sky-300 font-mono">
                {formatCurrency(row.netSavings, locale)}
              </td>
              <td className="px-4 py-3 text-right text-purple-300 font-mono font-semibold">
                {formatCurrency(row.totalSavings, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
