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

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `¥${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `¥${(value / 1000).toFixed(0)}K`;
  }
  return `¥${value}`;
}

export default function SavingsChart({ results }: SavingsChartProps) {
  if (results.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        请先运行模拟查看图表
      </div>
    );
  }

  const chartData = results.map((r) => ({
    name: `第${r.year}年`,
    总积蓄: r.totalSavings,
    净储蓄: r.netSavings,
    投资收益: r.investmentReturn,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
          />
          <Legend
            wrapperStyle={{ color: '#9ca3af' }}
          />
          <Area
            type="monotone"
            dataKey="总积蓄"
            stroke="#a855f7"
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
          <Area
            type="monotone"
            dataKey="投资收益"
            stroke="#fbbf24"
            fillOpacity={1}
            fill="url(#colorReturn)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
