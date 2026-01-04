'use client';

import { useState, useEffect } from 'react';

interface FormData {
  initialIncome: number;
  incomeGrowthRate: number;
  initialExpenses: number;
  expenseGrowthRate: number;
  investmentReturnRate: number;
  durationYears: number;
}

interface SimulationFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

const defaultValues: FormData = {
  initialIncome: 100000,
  incomeGrowthRate: 5,
  initialExpenses: 50000,
  expenseGrowthRate: 3,
  investmentReturnRate: 8,
  durationYears: 30,
};

export default function SimulationForm({ onSubmit, initialData }: SimulationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    ...defaultValues,
    ...initialData,
  });

  // Calculate whenever formData changes
  useEffect(() => {
    onSubmit({
      ...formData,
      incomeGrowthRate: formData.incomeGrowthRate / 100,
      expenseGrowthRate: formData.expenseGrowthRate / 100,
      investmentReturnRate: formData.investmentReturnRate / 100,
    });
  }, [formData, onSubmit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-emerald-400">收入 Income</h3>
          <div>
            <label htmlFor="initialIncome" className="block text-sm text-gray-300 mb-1">
              年收入 (Annual Income)
            </label>
            <input
              type="number"
              id="initialIncome"
              name="initialIncome"
              value={formData.initialIncome}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow hover:shadow-lg"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="incomeGrowthRate" className="block text-sm text-gray-300 mb-1">
              年涨幅 (Annual Growth %)
            </label>
            <input
              type="number"
              id="incomeGrowthRate"
              name="incomeGrowthRate"
              value={formData.incomeGrowthRate}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow hover:shadow-lg"
            />
          </div>
        </div>

        {/* Expenses Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-rose-400">支出 Expenses</h3>
          <div>
            <label htmlFor="initialExpenses" className="block text-sm text-gray-300 mb-1">
              年支出 (Annual Expenses)
            </label>
            <input
              type="number"
              id="initialExpenses"
              name="initialExpenses"
              value={formData.initialExpenses}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow hover:shadow-lg"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="expenseGrowthRate" className="block text-sm text-gray-300 mb-1">
              年涨幅 (Annual Growth %)
            </label>
            <input
              type="number"
              id="expenseGrowthRate"
              name="expenseGrowthRate"
              value={formData.expenseGrowthRate}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow hover:shadow-lg"
            />
          </div>
        </div>

        {/* Investment Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-400">投资 Investment</h3>
          <div>
            <label htmlFor="investmentReturnRate" className="block text-sm text-gray-300 mb-1">
              年化收益率 (Annual Return %)
            </label>
            <input
              type="number"
              id="investmentReturnRate"
              name="investmentReturnRate"
              value={formData.investmentReturnRate}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow hover:shadow-lg"
            />
          </div>
        </div>

        {/* Duration Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-sky-400">时长 Duration</h3>
          <div>
            <label htmlFor="durationYears" className="block text-sm text-gray-300 mb-1">
              模拟年数 (Years)
            </label>
            <input
              type="number"
              id="durationYears"
              name="durationYears"
              value={formData.durationYears}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow hover:shadow-lg"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
