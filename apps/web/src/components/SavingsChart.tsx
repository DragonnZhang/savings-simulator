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

import type { YearlyResult } from 'savings-core';

interface ChartScenario {
  id: string;
  name: string;
  color: string;
  results: YearlyResult[];
}

interface SavingsChartProps {
  scenarios: ChartScenario[];
}

function formatCurrency(value: number, locale: string): string {
  const symbol = locale === 'zh' ? '¥' : '$';
  return `${symbol}${value.toLocaleString()}`;
}

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export default function SavingsChart({ scenarios }: SavingsChartProps) {
  const t = useTranslations('Table');
  const tIndex = useTranslations('Index');
  const locale = useLocale();

  // If no scenarios or no results in first scenario
  if (scenarios.length === 0 || scenarios[0].results.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        {tIndex('emptyStateChart') || 'Run simulation to see chart'}
      </div>
    );
  }

  // Get all unique years across all scenarios
  const maxYears = Math.max(...scenarios.map(s => s.results.length));
  
  const chartData = Array.from({ length: maxYears }, (_, i) => {
    const dataPoint: ChartDataPoint = {
      name: t('yearLabel', { year: i + 1 }),
    };
    
    scenarios.forEach(s => {
      const yearResult = s.results[i];
      if (yearResult) {
        dataPoint[`totalSavings_${s.id}`] = yearResult.totalSavings;
        dataPoint[`investmentReturn_${s.id}`] = yearResult.investmentReturn;
      }
    });
    
    return dataPoint;
  });

  const currencyFormatter = (value: number) => formatCurrency(value, locale);

  const isMultiScenario = scenarios.length > 1;

  return (
    <div className="h-96 relative">
      <div className="absolute inset-0 bg-linear-to-br from-gray-900/50 to-transparent rounded-xl"></div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 40, left: 90, bottom: 20 }}
        >
          <defs>
            {scenarios.map(s => (
              <linearGradient key={`grad_${s.id}`} id={`color_${s.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.9} />
                <stop offset="50%" stopColor={s.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
            tickLine={{ stroke: '#4b5563' }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
            tickFormatter={currencyFormatter}
            tickLine={{ stroke: '#4b5563' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '2px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '12px',
              color: '#fff',
              padding: '12px 16px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
            formatter={(value: number | undefined) => value !== undefined ? currencyFormatter(value) : ''}
            labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#d1d5db' }}
          />
          <Legend
            wrapperStyle={{ 
              color: '#9ca3af', 
              paddingTop: '25px',
              fontSize: '14px',
              fontWeight: 500
            }}
            iconType="circle"
          />
          {scenarios.map(s => (
            <Area
              key={`area_total_${s.id}`}
              type="monotone"
              dataKey={`totalSavings_${s.id}`}
              name={isMultiScenario ? s.name : t('totalSavings')}
              stroke={s.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color_${s.id})`}
              activeDot={{ r: 8, strokeWidth: 2, stroke: s.color, fill: '#1f2937' }}
              dot={{ r: 0 }}
            />
          ))}
          {!isMultiScenario && (
            <Area
              type="monotone"
              dataKey={`investmentReturn_${scenarios[0].id}`}
              name={t('investmentReturn')}
              stroke="#fbbf24"
              strokeWidth={2}
              fillOpacity={1}
              fill="#fbbf2420"
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fbbf24', fill: '#1f2937' }}
              dot={{ r: 0 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
