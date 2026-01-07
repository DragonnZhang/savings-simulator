'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface OverrideModalProps {
  isOpen: boolean;
  yearIndex: number;
  currentIncome: number;
  currentExpenses: number;
  onSave: (yearIndex: number, income?: number, expenses?: number) => void;
  onClose: () => void;
}

export default function OverrideModal({
  isOpen,
  yearIndex,
  currentIncome,
  currentExpenses,
  onSave,
  onClose,
}: OverrideModalProps) {
  const t = useTranslations('Modal');
  const [income, setIncome] = useState(currentIncome.toString());
  const [expenses, setExpenses] = useState(currentExpenses.toString());

  if (!isOpen) return null;

  const handleSave = () => {
    const parsedIncome = parseFloat(income);
    const parsedExpenses = parseFloat(expenses);
    onSave(
      yearIndex,
      !isNaN(parsedIncome) ? parsedIncome : undefined,
      !isNaN(parsedExpenses) ? parsedExpenses : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#1A1A1D] rounded-2xl p-8 shadow-2xl border border-[#2A2A2E] w-full max-w-md mx-4 transform transition-all">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[--nebula-gold] to-[--nebula-gold-dim] rounded-t-2xl"></div>
        <h3 className="text-xl font-bold text-white mb-8 tracking-wide">
          {t('title', { year: yearIndex + 1 })}
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="modal-income" className="block text-xs font-bold text-[--nebula-text-muted] uppercase tracking-wider">
              {t('income')}
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[--nebula-text-muted] font-bold">¥</span>
                <input
                  type="number"
                  id="modal-income"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="nebula-input w-full px-4 py-3 pl-8 text-sm font-medium"
                />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="modal-expenses" className="block text-xs font-bold text-[--nebula-text-muted] uppercase tracking-wider">
              {t('expenses')}
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[--nebula-text-muted] font-bold">¥</span>
                <input
                  type="number"
                  id="modal-expenses"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="nebula-input w-full px-4 py-3 pl-8 text-sm font-medium"
                />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-[#3F3F46] text-white text-sm font-bold rounded-xl hover:bg-[#52525B] border border-[#52525B] hover:border-[#71717A] transition-all duration-200"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-[#F5C065] text-black text-sm font-bold rounded-xl hover:bg-[#D4A017] hover:shadow-lg hover:shadow-[rgba(245,192,101,0.1)] transition-all duration-200"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
