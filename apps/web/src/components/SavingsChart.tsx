'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
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

interface SavingsChartProps {
  results: YearlyResult[];
}

function formatCurrency(value: number, locale: string): string {
  return locale === 'zh' ? `¥${value.toLocaleString()}` : `$${value.toLocaleString()}`;
}

export default function SavingsChart({ results }: SavingsChartProps) {
  const t = useTranslations('Table');
  const tIndex = useTranslations('Index');
  const locale = useLocale();

  if (results.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        {tIndex('emptyStateChart') || 'Run simulation to see chart'}
      </div>
    );
  }

  const chartData = results.map((r) => ({
    name: t('yearLabel', { year: r.year }),
    totalSavings: r.totalSavings,
    netSavings: r.netSavings,
    investmentReturn: r.investmentReturn,
  }));

  const currencyFormatter = (value: number) => formatCurrency(value, locale);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={currencyFormatter}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number | undefined) => value !== undefined ? currencyFormatter(value) : ''}
          />
          <Legend
            wrapperStyle={{ color: '#9ca3af' }}
          />
          <Area
            type="monotone"
            dataKey="totalSavings"
            name={t('totalSavings')}
            stroke="#a855f7"
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
          <Area
            type="monotone"
            dataKey="investmentReturn"
            name={t('investmentReturn')}
            stroke="#fbbf24"
            fillOpacity={1}
            fill="url(#colorReturn)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
