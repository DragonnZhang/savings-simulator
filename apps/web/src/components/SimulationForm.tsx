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
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Income Section */}
        <div className="space-y-5 group">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-emerald-400 tracking-wide">{t('income')}</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="initialIncome" className="block text-sm font-medium text-gray-200 tracking-wide">
              {t('annualIncome')}
            </label>
            <div className="relative group">
              <input
                type="number"
                id="initialIncome"
                name="initialIncome"
                value={formData.initialIncome}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-linear-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-600/50 hover:shadow-lg hover:shadow-emerald-500/10"
                min="0"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-500/0 to-emerald-500/0 group-focus-within:from-emerald-500/5 group-focus-within:to-teal-500/5 pointer-events-none transition-all duration-300"></div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="salaryGrowthRate" className="block text-sm font-medium text-gray-200 tracking-wide">
              {t('annualSalaryGrowth')}
            </label>
            <div className="relative group">
              <input
                type="number"
                id="salaryGrowthRate"
                name="salaryGrowthRate"
                value={formData.salaryGrowthRate}
                onChange={handleChange}
                step="0.1"
                className="w-full px-5 py-3 bg-linear-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-600/50 hover:shadow-lg hover:shadow-emerald-500/10"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-500/0 to-emerald-500/0 group-focus-within:from-emerald-500/5 group-focus-within:to-teal-500/5 pointer-events-none transition-all duration-300"></div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="space-y-5 group">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-rose-400 to-rose-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-rose-400 tracking-wide">{t('expenses')}</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="initialExpenses" className="block text-sm font-medium text-gray-200 tracking-wide">
              {t('annualExpenses')}
            </label>
            <div className="relative group">
              <input
                type="number"
                id="initialExpenses"
                name="initialExpenses"
                value={formData.initialExpenses}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-linear-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all duration-300 hover:border-rose-600/50 hover:shadow-lg hover:shadow-rose-500/10"
                min="0"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-rose-500/0 to-rose-500/0 group-focus-within:from-rose-500/5 group-focus-within:to-pink-500/5 pointer-events-none transition-all duration-300"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="expenseGrowthRate" className="block text-sm font-medium text-gray-200 tracking-wide">
                {t('annualExpenseGrowth')}
              </label>
              <div className="relative group">
                <input
                  type="number"
                  id="expenseGrowthRate"
                  name="expenseGrowthRate"
                  value={formData.expenseGrowthRate}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 bg-linear-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all duration-300 hover:border-rose-600/50"
                />
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-rose-500/0 to-rose-500/0 group-focus-within:from-rose-500/5 group-focus-within:to-pink-500/5 pointer-events-none transition-all duration-300"></div>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-200 tracking-wide">
                {t('annualInflation')}
              </label>
              <div className="relative group">
                <input
                  type="number"
                  id="inflationRate"
                  name="inflationRate"
                  value={formData.inflationRate}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 bg-linear-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all duration-300 hover:border-rose-600/50"
                />
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-rose-500/0 to-rose-500/0 group-focus-within:from-rose-500/5 group-focus-within:to-pink-500/5 pointer-events-none transition-all duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Section */}
        <div className="space-y-5 group">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-amber-400 to-amber-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-amber-400 tracking-wide">{t('investment')}</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="investmentReturnRate" className="block text-sm font-medium text-gray-200 tracking-wide">
              {t('annualReturn')}
            </label>
            <div className="relative group">
              <input
                type="number"
                id="investmentReturnRate"
                name="investmentReturnRate"
                value={formData.investmentReturnRate}
                onChange={handleChange}
                step="0.1"
                className="w-full px-5 py-3 bg-linear-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 hover:border-amber-600/50 hover:shadow-lg hover:shadow-amber-500/10"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-amber-500/0 to-amber-500/0 group-focus-within:from-amber-500/5 group-focus-within:to-yellow-500/5 pointer-events-none transition-all duration-300"></div>
            </div>
          </div>
        </div>

        {/* Duration Section */}
        <div className="space-y-5 group">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-sky-400 to-sky-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-sky-400 tracking-wide">{t('duration')}</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="durationYears" className="block text-sm font-medium text-gray-200 tracking-wide">
              {t('years')}
            </label>
            <div className="relative group">
              <input
                type="number"
                id="durationYears"
                name="durationYears"
                value={formData.durationYears}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-5 py-3 bg-linear-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-300 hover:border-sky-600/50 hover:shadow-lg hover:shadow-sky-500/10"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-sky-500/0 to-sky-500/0 group-focus-within:from-sky-500/5 group-focus-within:to-blue-500/5 pointer-events-none transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Mode Section */}
      <div className="pt-8 border-t border-gray-700/30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-linear-to-b from-sky-400 to-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">{gt('title')}</h3>
          </div>
          <button
            type="button"
            onClick={() => setGoalMode(!goalMode)}
            className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden group ${
              goalMode 
                ? 'bg-linear-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/30' 
                : 'bg-gray-800/80 text-gray-400 border-2 border-gray-700 hover:border-sky-500/50 hover:text-sky-400'
            }`}
          >
            <span className="relative z-10">{gt('enable')}</span>
            {!goalMode && (
              <div className="absolute inset-0 bg-linear-to-r from-sky-500/0 to-blue-500/0 group-hover:from-sky-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
            )}
          </button>
        </div>

        {goalMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-linear-to-br from-sky-500/10 to-blue-500/10 border-2 border-sky-500/30 rounded-2xl backdrop-blur-sm">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200 tracking-wide">{gt('targetAmount')}</label>
                <div className="relative group">
                  <input
                    type="number"
                    name="targetAmount"
                    value={goalData.targetAmount}
                    onChange={handleGoalChange}
                    className="w-full px-5 py-3 bg-linear-to-br from-gray-900 to-gray-800 border-2 border-sky-600/50 rounded-xl text-white font-medium focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all duration-300 hover:border-sky-500"
                  />
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-sky-500/0 to-sky-500/0 group-focus-within:from-sky-500/10 group-focus-within:to-blue-500/10 pointer-events-none transition-all duration-300"></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200 tracking-wide">{gt('targetYear')}</label>
                <div className="relative group">
                  <input
                    type="number"
                    name="targetYear"
                    value={goalData.targetYear}
                    onChange={handleGoalChange}
                    min="1"
                    max={formData.durationYears}
                    className="w-full px-5 py-3 bg-linear-to-br from-gray-900 to-gray-800 border-2 border-sky-600/50 rounded-xl text-white font-medium focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all duration-300 hover:border-sky-500"
                  />
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-sky-500/0 to-sky-500/0 group-focus-within:from-sky-500/10 group-focus-within:to-blue-500/10 pointer-events-none transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div className="space-y-5 flex flex-col justify-center">
              {suggestedIncome !== undefined && (
                <div className="relative bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border-2 border-sky-500/40 shadow-lg shadow-sky-500/20 overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">{gt('suggestedAnnual')}</p>
                    <p className="text-4xl font-extrabold bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent mb-2">¥{suggestedIncome.toLocaleString()}</p>
                    <p className="text-sm text-gray-400 mb-4">
                      {gt('suggestedMonthly')}: <span className="text-sky-300 font-semibold">¥{Math.round(suggestedIncome / 12).toLocaleString()}</span>
                    </p>
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="w-full relative py-3 bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-sky-500/30 overflow-hidden group"
                    >
                      <span className="relative z-10">{gt('apply')}</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
