'use client';

import { useReducer, useCallback, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SimulationForm from '@/components/SimulationForm';
import ResultsTable from '@/components/ResultsTable';
import SavingsChart from '@/components/SavingsChart';
import OverrideModal from '@/components/OverrideModal';
import GitHubLink from '@/components/GitHubLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { calculate, goalSeek } from 'savings-core';
import type { SimulationConfig, YearlyOverride, YearlyResult, Scenario } from 'savings-core';
import ScenarioManager from '@/components/ScenarioManager';

interface AppState {
  config: SimulationConfig | null;
  overrides: YearlyOverride[];
  results: YearlyResult[];
  totalSavings: number;
  scenarios: Scenario[];
  activeScenarioIds: string[];
}

type Action =
  | { type: 'RUN_SIMULATION'; config: SimulationConfig }
  | { type: 'ADD_OVERRIDE'; override: YearlyOverride }
  | { type: 'CLEAR_OVERRIDES' }
  | { type: 'SAVE_SCENARIO'; name: string; color: string }
  | { type: 'DELETE_SCENARIO'; id: string }
  | { type: 'TOGGLE_SCENARIO'; id: string }
  | { type: 'LOAD_SCENARIOS'; scenarios: Scenario[] };

function reducer(state: AppState, action: Action): AppState {
  let newState: AppState;
  
  switch (action.type) {
    case 'RUN_SIMULATION': {
      const result = calculate(action.config, state.overrides);
      newState = {
        ...state,
        config: action.config,
        results: result.results,
        totalSavings: result.totalSavings,
      };
      break;
    }
    case 'ADD_OVERRIDE': {
      const newOverrides = [
        ...state.overrides.filter((o) => o.yearIndex !== action.override.yearIndex),
        action.override,
      ];
      if (state.config) {
        const result = calculate(state.config, newOverrides);
        newState = {
          ...state,
          overrides: newOverrides,
          results: result.results,
          totalSavings: result.totalSavings,
        };
      } else {
        newState = { ...state, overrides: newOverrides };
      }
      break;
    }
    case 'CLEAR_OVERRIDES': {
      if (state.config) {
        const result = calculate(state.config, []);
        newState = {
          ...state,
          overrides: [],
          results: result.results,
          totalSavings: result.totalSavings,
        };
      } else {
        newState = { ...state, overrides: [] };
      }
      break;
    }
    case 'SAVE_SCENARIO': {
      if (!state.config) return state;
      const newScenario: Scenario = {
        id: crypto.randomUUID(),
        name: action.name,
        config: { ...state.config },
        overrides: [...state.overrides],
        color: action.color,
      };
      newState = {
        ...state,
        scenarios: [...state.scenarios, newScenario],
        activeScenarioIds: [...state.activeScenarioIds, newScenario.id],
      };
      break;
    }
    case 'DELETE_SCENARIO': {
      newState = {
        ...state,
        scenarios: state.scenarios.filter((s) => s.id !== action.id),
        activeScenarioIds: state.activeScenarioIds.filter((id) => id !== action.id),
      };
      break;
    }
    case 'TOGGLE_SCENARIO': {
      const isActive = state.activeScenarioIds.includes(action.id);
      newState = {
        ...state,
        activeScenarioIds: isActive
          ? state.activeScenarioIds.filter((id) => id !== action.id)
          : [...state.activeScenarioIds, action.id],
      };
      break;
    }
    case 'LOAD_SCENARIOS': {
      newState = {
        ...state,
        scenarios: action.scenarios,
        activeScenarioIds: action.scenarios.map(s => s.id),
      };
      break;
    }
    default:
      return state;
  }

  // Persist scenarios on change
  if (['SAVE_SCENARIO', 'DELETE_SCENARIO', 'LOAD_SCENARIOS'].includes(action.type)) {
    localStorage.setItem('scenarios_v1', JSON.stringify(newState.scenarios));
  }
  
  return newState;
}

const initialState: AppState = {
  config: null,
  overrides: [],
  results: [],
  totalSavings: 0,
  scenarios: [],
  activeScenarioIds: [],
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

  const [isMounted, setIsMounted] = useState(false);
  const [goalSuggest, setGoalSuggest] = useState<number | undefined>(undefined);

  // Load scenarios on mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scenarios_v1');
      if (saved) {
        try {
          const scenarios = JSON.parse(saved);
          dispatch({ type: 'LOAD_SCENARIOS', scenarios });
        } catch (e) {
          console.error('Failed to load scenarios', e);
        }
      }
    }
  }, []);

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

  const handleGoalChange = useCallback((targetAmount: number, targetYear: number) => {
    if (state.config) {
      const suggest = goalSeek(state.config, state.overrides, targetAmount, targetYear);
      setGoalSuggest(suggest);
    }
  }, [state.config, state.overrides]);

  const handleSaveScenario = useCallback((name: string, color: string) => {
    dispatch({ type: 'SAVE_SCENARIO', name, color });
  }, []);

  const handleDeleteScenario = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SCENARIO', id });
  }, []);

  const handleToggleScenario = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_SCENARIO', id });
  }, []);

  // Prepare chart data: Active scenarios + Current simulation
  const chartScenarios = [
    // Current simulation (always shown if results exist)
    ...(state.results.length > 0 ? [{
      id: 'current',
      name: 'Current',
      color: '#a855f7', // purple-500
      results: state.results
    }] : []),
    // Saved active scenarios (only shown after mounting to avoid hydration mismatch)
    ...(isMounted ? state.scenarios
      .filter(s => state.activeScenarioIds.includes(s.id))
      .map(s => ({
        id: s.id,
        name: s.name,
        color: s.color,
        results: calculate(s.config, s.overrides).results
      })) : [])
  ];

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
        {chartScenarios.length > 0 && (
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl card-hover">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {t('chartTitle')}
            </h2>
            <SavingsChart scenarios={chartScenarios} />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 opacity-0 animate-[slideUp_0.5s_ease-out_forwards]">
          {/* Left Column: Form & Scenario Management */}
          <div className="space-y-8">
            {/* Form Section */}
            <div className="glass rounded-2xl p-6 shadow-xl card-hover glow-emerald">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {t('configTitle')}
              </h2>
              <SimulationForm
                onSubmit={handleSimulate}
                onGoalChange={handleGoalChange}
                suggestedIncome={goalSuggest}
              />
            </div>
            
            {/* Scenario Manager Section */}
            <div className="glass rounded-2xl p-6 shadow-xl card-hover glow-cyan">
              <ScenarioManager
                scenarios={state.scenarios}
                onSave={handleSaveScenario}
                onDelete={handleDeleteScenario}
                onToggle={handleToggleScenario}
                activeIds={state.activeScenarioIds}
              />
            </div>
          </div>

          {/* Right Column: Results Table */}
          <div className="glass rounded-2xl p-6 shadow-xl card-hover glow-purple h-fit">
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
