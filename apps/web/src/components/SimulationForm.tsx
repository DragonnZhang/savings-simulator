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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Income Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[--nebula-gold] pb-1">{t('income')}</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="initialIncome" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t('annualIncome')}
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">¥</span>
                <input
                  type="number"
                  id="initialIncome"
                  name="initialIncome"
                  value={formData.initialIncome}
                  onChange={handleChange}
                  className="nebula-input w-full px-4 py-3 pl-8 text-sm font-medium"
                  min="0"
                />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="salaryGrowthRate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t('annualSalaryGrowth')} (%)
            </label>
            <input
              type="number"
              id="salaryGrowthRate"
              name="salaryGrowthRate"
              value={formData.salaryGrowthRate}
              onChange={handleChange}
              step="0.1"
              className="nebula-input w-full px-4 py-3 text-sm font-medium"
            />
          </div>
        </div>

        {/* Expenses Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-rose-500 pb-1">{t('expenses')}</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="initialExpenses" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t('annualExpenses')}
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">¥</span>
                <input
                  type="number"
                  id="initialExpenses"
                  name="initialExpenses"
                  value={formData.initialExpenses}
                  onChange={handleChange}
                  className="nebula-input w-full px-4 py-3 pl-8 text-sm font-medium"
                  min="0"
                />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="expenseGrowthRate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('annualExpenseGrowth')} (%)
              </label>
              <input
                type="number"
                id="expenseGrowthRate"
                name="expenseGrowthRate"
                value={formData.expenseGrowthRate}
                onChange={handleChange}
                step="0.1"
                className="nebula-input w-full px-4 py-3 text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="inflationRate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('annualInflation')} (%)
              </label>
              <input
                type="number"
                id="inflationRate"
                name="inflationRate"
                value={formData.inflationRate}
                onChange={handleChange}
                step="0.1"
                className="nebula-input w-full px-4 py-3 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Investment Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-amber-500 pb-1">{t('investment')}</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="investmentReturnRate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t('annualReturn')} (%)
            </label>
            <input
              type="number"
              id="investmentReturnRate"
              name="investmentReturnRate"
              value={formData.investmentReturnRate}
              onChange={handleChange}
              step="0.1"
              className="nebula-input w-full px-4 py-3 text-sm font-medium"
            />
          </div>
        </div>

        {/* Duration Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-sky-500 pb-1">{t('duration')}</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="durationYears" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
              className="nebula-input w-full px-4 py-3 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Goal Mode Section */}
      <div className="pt-6 border-t border-[#2A2A2E] space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-[--nebula-gold] rounded-full"></div>
            <h3 className="text-lg font-bold text-white">{gt('title')}</h3>
          </div>
          <button
            type="button"
            onClick={() => setGoalMode(!goalMode)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${goalMode 
              ? 'bg-[--nebula-gold] text-black shadow-lg shadow-[--nebula-gold-dim]' 
              : 'bg-[#1A1A1D] text-gray-400 border border-[#2A2A2E] hover:text-white'
            }`}
          >
            {gt('enable')}
          </button>
        </div>

        {goalMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#141416] border border-[#2A2A2E] rounded-2xl">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400 tracking-wide">{gt('targetAmount')}</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">¥</span>
                    <input
                        type="number"
                        name="targetAmount"
                        value={goalData.targetAmount}
                        onChange={handleGoalChange}
                        className="nebula-input w-full px-4 py-3 pl-8 text-sm font-medium"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400 tracking-wide">{gt('targetYear')}</label>
                <input
                    type="number"
                    name="targetYear"
                    value={goalData.targetYear}
                    onChange={handleGoalChange}
                    min="1"
                    max={formData.durationYears}
                    className="nebula-input w-full px-4 py-3 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-5 flex flex-col justify-center">
              {suggestedIncome !== undefined && (
                <div className="relative bg-[#0F0F11] p-6 rounded-2xl border border-[--nebula-gold] shadow-[--nebula-gold-dim]">
                  <div className="relative z-10">
                    <p className="text-xs font-medium text-[--nebula-gold] uppercase tracking-wider mb-2">{gt('suggestedAnnual')}</p>
                    <p className="text-3xl font-extrabold text-white mb-2">¥{suggestedIncome.toLocaleString()}</p>
                    <p className="text-sm text-gray-400 mb-4">
                      {gt('suggestedMonthly')}: <span className="text-white font-semibold">¥{Math.round(suggestedIncome / 12).toLocaleString()}</span>
                    </p>
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="w-full py-3 bg-[#27272A] hover:bg-[#3F3F46] text-white text-sm font-bold rounded-xl transition-all duration-300"
                    >
                      {gt('apply')}
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
