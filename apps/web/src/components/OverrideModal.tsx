'use client';

import { useState, useEffect } from 'react';

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
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIncome(currentIncome.toString());
      setExpenses(currentExpenses.toString());
    }
  }, [isOpen, currentIncome, currentExpenses]);

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-backdrop"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 w-full max-w-md mx-4 modal-content">
        <h3 className="text-xl font-semibold text-white mb-6">
          调整第 {yearIndex + 1} 年参数
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="modal-income" className="block text-sm text-gray-300 mb-1">
              年收入 (Income)
            </label>
            <input
              type="number"
              id="modal-income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="modal-expenses" className="block text-sm text-gray-300 mb-1">
              年支出 (Expenses)
            </label>
            <input
              type="number"
              id="modal-expenses"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
