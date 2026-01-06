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
    currency: locale === 'zh' ? 'CNY' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function ResultsTable({ results, onRowClick }: ResultsTableProps) {
  const t = useTranslations('Table');
  const locale = useLocale();

  if (results.length === 0) {
    return (
      <div className="text-center py-20 relative">
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-pink-500/5 rounded-xl"></div>
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-300 text-lg font-medium">{t('emptyState')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-700/50 bg-linear-to-r from-gray-800/50 to-gray-900/50">
            <th className="px-5 py-4 text-left text-gray-300 font-bold uppercase tracking-wider text-xs">{t('year')}</th>
            <th className="px-5 py-4 text-right text-emerald-400 font-bold uppercase tracking-wider text-xs">{t('income')}</th>
            <th className="px-5 py-4 text-right text-rose-400 font-bold uppercase tracking-wider text-xs">{t('expenses')}</th>
            <th className="px-5 py-4 text-right text-amber-400 font-bold uppercase tracking-wider text-xs">{t('investmentReturn')}</th>
            <th className="px-5 py-4 text-right text-sky-400 font-bold uppercase tracking-wider text-xs">{t('netSavings')}</th>
            <th className="px-5 py-4 text-right text-purple-400 font-bold uppercase tracking-wider text-xs">{t('totalSavings')}</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr
              key={row.year}
              onClick={() => onRowClick?.(row.year - 1)}
              className={`
                border-b border-gray-800/50 
                transition-all duration-200
                ${onRowClick ? 'cursor-pointer hover:bg-linear-to-r hover:from-purple-500/10 hover:to-transparent hover:shadow-lg' : ''} 
                ${row.isOverridden ? 'bg-linear-to-r from-amber-900/20 to-amber-800/10' : ''}
              `}
            >
              <td className="px-5 py-4 text-gray-200 font-medium">
                <div className="flex items-center gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xs font-bold text-purple-300">
                    {row.year}
                  </span>
                  {row.isOverridden && (
                    <span className="px-2 py-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full">
                      {t('overridden')}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-emerald-300 font-semibold">{formatCurrency(row.income, locale)}</span>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-rose-300 font-semibold">{formatCurrency(row.expenses, locale)}</span>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-amber-300 font-semibold">{formatCurrency(row.investmentReturn, locale)}</span>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-sky-300 font-semibold">{formatCurrency(row.netSavings, locale)}</span>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-lg font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {formatCurrency(row.totalSavings, locale)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
