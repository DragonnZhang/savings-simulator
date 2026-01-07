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
      <div className="text-center py-24 relative overflow-hidden rounded-2xl border border-[#2A2A2E] bg-[#141416]">
        <div className="absolute inset-0 bg-gradient-radial from-[--nebula-gold-dim] to-transparent opacity-10"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1A1A1D] border border-[#2A2A2E] flex items-center justify-center shadow-lg shadow-black/50">
            <svg className="w-8 h-8 text-[--nebula-text-muted]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-[--nebula-text-muted] text-lg font-medium tracking-wide">{t('emptyState')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#2A2A2E]">
      <table className="w-full text-sm">
        <thead className="bg-[#1A1A1D]">
          <tr className="border-b border-[#2A2A2E]">
            <th className="px-5 py-5 text-left text-[--nebula-text-muted] font-bold uppercase tracking-wider text-[10px]">{t('year')}</th>
            <th className="px-5 py-5 text-right text-[--nebula-text-muted] font-bold uppercase tracking-wider text-[10px]">{t('income')}</th>
            <th className="px-5 py-5 text-right text-[--nebula-text-muted] font-bold uppercase tracking-wider text-[10px]">{t('expenses')}</th>
            <th className="px-5 py-5 text-right text-[--nebula-text-muted] font-bold uppercase tracking-wider text-[10px]">{t('investmentReturn')}</th>
            <th className="px-5 py-5 text-right text-[--nebula-text-muted] font-bold uppercase tracking-wider text-[10px]">{t('netSavings')}</th>
            <th className="px-5 py-5 text-right text-[--nebula-gold] font-bold uppercase tracking-wider text-[10px]">{t('totalSavings')}</th>
          </tr>
        </thead>
        <tbody className="bg-[#141416]">
          {results.map((row, index) => (
            <tr
              key={row.year}
              onClick={() => onRowClick?.(row.year - 1)}
              className={`
                border-b border-[#2A2A2E] 
                transition-all duration-200
                ${onRowClick ? 'cursor-pointer hover:bg-[#1A1A1D]' : ''} 
                ${row.isOverridden ? 'bg-[--nebula-gold-dim] bg-opacity-5' : ''}
                last:border-0
              `}
            >
              <td className="px-5 py-4 text-white font-medium">
                <div className="flex items-center gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#1A1A1D] border border-[#2A2A2E] flex items-center justify-center text-xs font-bold text-[--nebula-text-muted]">
                    {row.year}
                  </span>
                  {row.isOverridden && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5C065]" title={t('overridden')}></span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-[--nebula-text-muted] font-medium">{formatCurrency(row.income, locale)}</span>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-[--nebula-text-muted] font-medium opacity-60">{formatCurrency(row.expenses, locale)}</span>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-[--nebula-gold] font-medium opacity-80">{formatCurrency(row.investmentReturn, locale)}</span>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-white font-semibold">{formatCurrency(row.netSavings, locale)}</span>
              </td>
              <td className="px-5 py-4 text-right font-mono">
                <span className="text-lg font-bold text-[--nebula-gold]">
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
