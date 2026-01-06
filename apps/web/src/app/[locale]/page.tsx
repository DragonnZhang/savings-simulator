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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles - Enhanced */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0F1419]"></div>
        {/* Large gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-emerald-400/20 via-teal-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
        <div className="absolute top-[40%] right-[30%] w-[35%] h-[35%] bg-gradient-to-br from-blue-400/15 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s', animationDuration: '10s'}}></div>
        {/* Grid overlay for depth */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>
      </div>
      
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4 opacity-0 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
        <LanguageSwitcher />
        <GitHubLink />
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header - Enhanced */}
        <header className="text-center mb-20 opacity-0 animate-[slideUp_0.6s_ease-out_0.1s_forwards]">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-4 leading-[1.1] tracking-tight">
              {t('title')}
            </h1>
            {/* Glow effect behind title */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-teal-400/20 to-cyan-400/30 blur-[60px] -z-10 scale-110"></div>
          </div>
          <p className="text-gray-300 text-lg md:text-xl font-normal tracking-wide max-w-2xl mx-auto mt-6 leading-relaxed">
            {t('subtitle')}
          </p>
          {/* Decorative line */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
          </div>
        </header>

        {/* Main Content */}
        {/* Chart Section */}
        {chartScenarios.length > 0 && (
          <div className="mb-12 glass rounded-3xl p-10 border border-blue-500/20 shadow-2xl card-hover glow-cyan opacity-0 animate-[slideUp_0.5s_ease-out_0.2s_forwards]">
            <div className="flex items-center gap-3 mb-10">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-cyan-400 block animate-ping absolute"></span>
                <span className="w-3 h-3 rounded-full bg-cyan-400 block relative shadow-lg shadow-cyan-400/50"></span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-tight">
                {t('chartTitle')}
              </h2>
            </div>
            <SavingsChart scenarios={chartScenarios} />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Column: Form & Scenario Management */}
          <div className="space-y-10">
            {/* Form Section */}
            <div className="glass rounded-3xl p-10 shadow-2xl card-hover glow-emerald opacity-0 animate-[slideUp_0.5s_ease-out_0.3s_forwards] border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-10">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 block animate-ping absolute"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 block relative shadow-lg shadow-emerald-400/50"></span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent tracking-tight">
                  {t('configTitle')}
                </h2>
              </div>
              <SimulationForm
                onSubmit={handleSimulate}
                onGoalChange={handleGoalChange}
                suggestedIncome={goalSuggest}
              />
            </div>
            
            {/* Scenario Manager Section */}
            <div className="glass rounded-3xl p-10 shadow-2xl card-hover glow-cyan opacity-0 animate-[slideUp_0.5s_ease-out_0.4s_forwards] border border-blue-500/20">
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
          <div className="glass rounded-3xl p-10 shadow-2xl card-hover glow-purple h-fit opacity-0 animate-[slideUp_0.5s_ease-out_0.5s_forwards] border border-purple-500/20">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-purple-400 block animate-ping absolute"></span>
                  <span className="w-3 h-3 rounded-full bg-purple-400 block relative shadow-lg shadow-purple-400/50"></span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                  {t('resultsTitle')}
                </h2>
              </div>
              {state.totalSavings > 0 && (
                <div className="text-right bg-gradient-to-br from-purple-500/15 to-pink-500/10 px-5 py-4 rounded-2xl border border-purple-400/30 backdrop-blur-sm">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{t('finalSavings')}</span>
                  <p className="text-4xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent metric-highlight mt-2 leading-none">
                    ¥{state.totalSavings.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-8 px-5 py-3 bg-gradient-to-r from-gray-800/60 to-gray-800/40 rounded-xl border border-gray-700/30 backdrop-blur-sm">
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
