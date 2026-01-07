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
      color: '#F5C065', // Nebula Gold for current
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

  const formattedNull = () => <span className="text-gray-600">---</span>;

  return (
    <div className="min-h-screen p-4 lg:p-8 font-sans selection:bg-[--nebula-gold] selection:text-black">
       {/* Top Navigation Bar */}
       <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-linear-to-br from-[--nebula-gold] to-orange-500 flex items-center justify-center shadow-lg shadow-[--nebula-gold-dim]">
               <span className="text-black font-bold text-xl">S</span>
             </div>
             <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Financial Simulator</p>
             </div>
          </div>
          
          <nav className="hidden md:flex bg-[#141416] p-1.5 rounded-full border border-[#2A2A2E]">
            <button className="px-6 py-2 rounded-full bg-[--nebula-bg] text-white shadow-md font-medium text-sm border border-[#27272A]">Dashboard</button>
            <button className="px-6 py-2 rounded-full text-gray-500 hover:text-white font-medium text-sm transition-colors">Reports</button>
             <button className="px-6 py-2 rounded-full text-gray-500 hover:text-white font-medium text-sm transition-colors">Settings</button>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <GitHubLink />
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Configuration */}
          <div className="lg:col-span-4 space-y-6 animate-[slideUp_0.5s_ease-out_0.2s_backwards]">
             <div className="nebula-card p-6 border-t-4 border-t-[--nebula-gold]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F5C065]"></span>
                    {t('configTitle')}
                  </h2>
                </div>
                <SimulationForm
                  onSubmit={handleSimulate}
                  onGoalChange={handleGoalChange}
                  suggestedIncome={goalSuggest}
                />
             </div>
             
             <div className="nebula-card p-6 border-t-4 border-t-purple-500">
                 <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Scenarios
                 </h2>
                 <ScenarioManager
                    scenarios={state.scenarios}
                    onSave={handleSaveScenario}
                    onDelete={handleDeleteScenario}
                    onToggle={handleToggleScenario}
                    activeIds={state.activeScenarioIds}
                  />
             </div>
          </div>

          {/* Right Column: Analytics & Results */}
          <div className="lg:col-span-8 space-y-6 animate-[slideUp_0.5s_ease-out_0.3s_backwards]">
              {/* Highlight Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="nebula-card p-8 flex flex-col justify-between relative overflow-hidden group border-l-4 border-l-[--nebula-green]">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <svg className="w-24 h-24 text-[--nebula-green]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                      </div>
                      <div>
                          <p className="text-gray-400 font-medium mb-2 uppercase text-xs tracking-wider">{t('finalSavings')}</p>
                          <div className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                             {state.totalSavings > 0 ? `¥${state.totalSavings.toLocaleString()}` : formattedNull()}
                          </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                           {state.config && <span className="text-sm text-gray-500">After {state.config.durationYears} years</span>}
                      </div>
                  </div>

                  <div className="nebula-card p-8 flex flex-col justify-between relative overflow-hidden border-l-4 border-l-[--nebula-gold]">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                         <svg className="w-24 h-24 text-[--nebula-gold]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
                       </div>
                       <p className="text-gray-400 font-medium mb-2 uppercase text-xs tracking-wider">Simulated Duration</p>
                       <div className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                           {state.config ? `${state.config.durationYears} Years` : '--'}
                       </div>
                       <div className="mt-4 text-sm text-gray-500">
                          {isMounted && state.scenarios.length > 0 ? `${state.scenarios.length} scenarios saved` : 'Start by running a simulation'}
                       </div>
                  </div>
              </div>

              {/* Chart Card */}
              {chartScenarios.length > 0 && (
                <div className="nebula-card p-6 border border-[#27272A]">
                   <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">{t('chartTitle')}</h2>
                   </div>
                   <SavingsChart scenarios={chartScenarios} />
                </div>
              )}

              {/* Results Table Card */}
              <div className="nebula-card p-6 border border-[#27272A]">
                  <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">{t('resultsTitle')}</h2>
                      <p className="text-xs text-gray-500">{t('rowClickTip')}</p>
                   </div>
                   <ResultsTable results={state.results} onRowClick={handleRowClick} />
              </div>
          </div>
       </div>

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
