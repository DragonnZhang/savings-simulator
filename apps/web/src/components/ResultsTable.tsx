'use client';

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

function formatCurrency(value: number): string {
  return value.toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function ResultsTable({ results, onRowClick }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        请输入参数并点击「开始模拟」查看结果
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-3 text-left text-gray-400 font-medium">年份</th>
            <th className="px-4 py-3 text-right text-emerald-400 font-medium">收入</th>
            <th className="px-4 py-3 text-right text-rose-400 font-medium">支出</th>
            <th className="px-4 py-3 text-right text-amber-400 font-medium">投资收益</th>
            <th className="px-4 py-3 text-right text-sky-400 font-medium">净储蓄</th>
            <th className="px-4 py-3 text-right text-purple-400 font-medium">总积蓄</th>
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
                第 {row.year} 年
                {row.isOverridden && (
                  <span className="ml-2 text-xs text-amber-400">已调整</span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-emerald-300 font-mono">
                {formatCurrency(row.income)}
              </td>
              <td className="px-4 py-3 text-right text-rose-300 font-mono">
                {formatCurrency(row.expenses)}
              </td>
              <td className="px-4 py-3 text-right text-amber-300 font-mono">
                {formatCurrency(row.investmentReturn)}
              </td>
              <td className="px-4 py-3 text-right text-sky-300 font-mono">
                {formatCurrency(row.netSavings)}
              </td>
              <td className="px-4 py-3 text-right text-purple-300 font-mono font-semibold">
                {formatCurrency(row.totalSavings)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
