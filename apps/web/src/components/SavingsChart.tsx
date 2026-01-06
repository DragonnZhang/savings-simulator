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
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
        >
          <defs>
            {scenarios.map(s => (
              <linearGradient key={`grad_${s.id}`} id={`color_${s.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.8} />
                <stop offset="50%" stopColor={s.color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#525252"
            tick={{ fill: '#737373', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#525252"
            tick={{ fill: '#737373', fontSize: 11 }}
            tickFormatter={(value) => currencyFormatter(value)}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#141416',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number | undefined) => value !== undefined ? currencyFormatter(value) : ''}
            labelStyle={{ fontWeight: '600', marginBottom: '8px', color: '#A3A3A3' }}
            cursor={{ stroke: '#525252', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Legend
            wrapperStyle={{ 
              paddingTop: '20px',
              color: '#A3A3A3'
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
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color_${s.id})`}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
