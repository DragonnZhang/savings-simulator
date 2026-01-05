'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface FormData {
  initialIncome: number;
  salaryGrowthRate: number;
  initialExpenses: number;
  expenseGrowthRate: number;
  inflationRate: number;
  investmentReturnRate: number;
  durationYears: number;
}

interface SimulationFormProps {
  onSubmit: (data: FormData) => void;
  onGoalChange?: (targetAmount: number, targetYear: number) => void;
  suggestedIncome?: number;
  initialData?: Partial<FormData>;
}

const defaultValues: FormData = {
  initialIncome: 100000,
  salaryGrowthRate: 5,
  initialExpenses: 50000,
  expenseGrowthRate: 3,
  inflationRate: 2,
  investmentReturnRate: 8,
  durationYears: 30,
};

export default function SimulationForm({ onSubmit, onGoalChange, suggestedIncome, initialData }: SimulationFormProps) {
  const t = useTranslations('Form');
  const gt = useTranslations('Goal');

  const [formData, setFormData] = useState<FormData>({
    ...defaultValues,
    ...initialData,
  });

  const [goalMode, setGoalMode] = useState(false);
  const [goalData, setGoalData] = useState({
    targetAmount: 1000000,
    targetYear: 10,
  });

  // Calculate whenever formData changes
  useEffect(() => {
    onSubmit({
      ...formData,
      salaryGrowthRate: formData.salaryGrowthRate / 100,
      expenseGrowthRate: formData.expenseGrowthRate / 100,
      inflationRate: formData.inflationRate / 100,
      investmentReturnRate: formData.investmentReturnRate / 100,
    });
  }, [formData, onSubmit]);

  // Notify of goal changes
  useEffect(() => {
    if (goalMode && onGoalChange) {
      onGoalChange(goalData.targetAmount, goalData.targetYear);
    }
  }, [goalMode, goalData, onGoalChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGoalData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const applySuggestion = () => {
    if (suggestedIncome !== undefined) {
      setFormData(prev => ({ ...prev, initialIncome: suggestedIncome }));
    }
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-emerald-400">{t('income')}</h3>
          <div>
            <label htmlFor="initialIncome" className="block text-sm text-gray-300 mb-1">
              {t('annualIncome')}
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
            <label htmlFor="salaryGrowthRate" className="block text-sm text-gray-300 mb-1">
              {t('annualSalaryGrowth')}
            </label>
            <input
              type="number"
              id="salaryGrowthRate"
              name="salaryGrowthRate"
              value={formData.salaryGrowthRate}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow hover:shadow-lg"
            />
          </div>
        </div>

        {/* Expenses Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-rose-400">{t('expenses')}</h3>
          <div>
            <label htmlFor="initialExpenses" className="block text-sm text-gray-300 mb-1">
              {t('annualExpenses')}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expenseGrowthRate" className="block text-sm text-gray-300 mb-1">
                {t('annualExpenseGrowth')}
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
            <div>
              <label htmlFor="inflationRate" className="block text-sm text-gray-300 mb-1">
                {t('annualInflation')}
              </label>
              <input
                type="number"
                id="inflationRate"
                name="inflationRate"
                value={formData.inflationRate}
                onChange={handleChange}
                step="0.1"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow hover:shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Investment Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-400">{t('investment')}</h3>
          <div>
            <label htmlFor="investmentReturnRate" className="block text-sm text-gray-300 mb-1">
              {t('annualReturn')}
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
          <h3 className="text-lg font-semibold text-sky-400">{t('duration')}</h3>
          <div>
            <label htmlFor="durationYears" className="block text-sm text-gray-300 mb-1">
              {t('years')}
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

      {/* Goal Mode Section */}
      <div className="pt-6 border-t border-gray-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-sky-400">{gt('title')}</h3>
          <button
            type="button"
            onClick={() => setGoalMode(!goalMode)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              goalMode ? 'bg-sky-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {gt('enable')}
          </button>
        </div>

        {goalMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">{gt('targetAmount')}</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={goalData.targetAmount}
                  onChange={handleGoalChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">{gt('targetYear')}</label>
                <input
                  type="number"
                  name="targetYear"
                  value={goalData.targetYear}
                  onChange={handleGoalChange}
                  min="1"
                  max={formData.durationYears}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-end">
              {suggestedIncome !== undefined && (
                <div className="bg-gray-900/50 p-4 rounded-lg border border-sky-500/30">
                  <p className="text-xs text-gray-400 mb-1">{gt('suggestedAnnual')}</p>
                  <p className="text-2xl font-bold text-sky-400">¥{suggestedIncome.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({gt('suggestedMonthly')}: ¥{Math.round(suggestedIncome / 12).toLocaleString()})
                  </p>
                  <button
                    type="button"
                    onClick={applySuggestion}
                    className="mt-3 w-full py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {gt('apply')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
