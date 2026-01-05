'use client';

import { useReducer, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import SimulationForm from '@/components/SimulationForm';
import ResultsTable from '@/components/ResultsTable';
import SavingsChart from '@/components/SavingsChart';
import OverrideModal from '@/components/OverrideModal';
import GitHubLink from '@/components/GitHubLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { calculate } from 'savings-core';
import type { SimulationConfig, YearlyOverride, YearlyResult } from 'savings-core';

interface AppState {
  config: SimulationConfig | null;
  overrides: YearlyOverride[];
  results: YearlyResult[];
  totalSavings: number;
}

type Action =
  | { type: 'RUN_SIMULATION'; config: SimulationConfig }
  | { type: 'ADD_OVERRIDE'; override: YearlyOverride }
  | { type: 'CLEAR_OVERRIDES' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'RUN_SIMULATION': {
      const result = calculate(action.config, state.overrides);
      return {
        ...state,
        config: action.config,
        results: result.results,
        totalSavings: result.totalSavings,
      };
    }
    case 'ADD_OVERRIDE': {
      const newOverrides = [
        ...state.overrides.filter((o) => o.yearIndex !== action.override.yearIndex),
        action.override,
      ];
      if (state.config) {
        const result = calculate(state.config, newOverrides);
        return {
          ...state,
          overrides: newOverrides,
          results: result.results,
          totalSavings: result.totalSavings,
        };
      }
      return { ...state, overrides: newOverrides };
    }
    case 'CLEAR_OVERRIDES': {
      if (state.config) {
        const result = calculate(state.config, []);
        return {
          ...state,
          overrides: [],
          results: result.results,
          totalSavings: result.totalSavings,
        };
      }
      return { ...state, overrides: [] };
    }
    default:
      return state;
  }
}

const initialState: AppState = {
  config: null,
  overrides: [],
  results: [],
  totalSavings: 0,
};

export default function Home() {
  const t = useTranslations('Index');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    yearIndex: number;
    currentIncome: number;
    currentExpenses: number;
  }>({
    isOpen: false,
    yearIndex: 0,
    currentIncome: 0,
    currentExpenses: 0,
  });

  const handleSimulate = useCallback((config: SimulationConfig) => {
    dispatch({ type: 'RUN_SIMULATION', config });
  }, []);

  const handleRowClick = useCallback((yearIndex: number) => {
    const yearResult = state.results[yearIndex];
    if (yearResult) {
      setModalState({
        isOpen: true,
        yearIndex,
        currentIncome: yearResult.income,
        currentExpenses: yearResult.expenses,
      });
    }
  }, [state.results]);

  const handleModalSave = useCallback((yearIndex: number, income?: number, expenses?: number) => {
    if (income !== undefined || expenses !== undefined) {
      dispatch({
        type: 'ADD_OVERRIDE',
        override: { yearIndex, income, expenses },
      });
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <LanguageSwitcher />
        <GitHubLink />
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4 gradient-text-animated">
            {t('title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('subtitle')}
          </p>
        </header>

        {/* Main Content */}
        {/* Chart Section */}
        {state.results.length > 0 && (
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl card-hover">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {t('chartTitle')}
            </h2>
            <SavingsChart results={state.results} />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 opacity-0 animate-[slideUp_0.5s_ease-out_forwards]">
          {/* Form Section */}
          <div className="glass rounded-2xl p-6 shadow-xl card-hover glow-emerald">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {t('configTitle')}
            </h2>
            <SimulationForm onSubmit={handleSimulate} />
          </div>

          {/* Results Section */}
          <div className="glass rounded-2xl p-6 shadow-xl card-hover glow-purple">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                {t('resultsTitle')}
              </h2>
              {state.totalSavings > 0 && (
                <div className="text-right">
                  <span className="text-gray-400 text-sm">{t('finalSavings')}</span>
                  <p className="text-2xl font-bold text-purple-400 metric-highlight">
                    ¥{state.totalSavings.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {t('rowClickTip')}
            </p>
            <ResultsTable results={state.results} onRowClick={handleRowClick} />
          </div>
        </div>
      </div>

      {/* Override Modal */}
      <OverrideModal
        key={`${modalState.isOpen}-${modalState.yearIndex}`}
        isOpen={modalState.isOpen}
        yearIndex={modalState.yearIndex}
        currentIncome={modalState.currentIncome}
        currentExpenses={modalState.currentExpenses}
        onSave={handleModalSave}
        onClose={handleModalClose}
      />
    </div>
  );
}
