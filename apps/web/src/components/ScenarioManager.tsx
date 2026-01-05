'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Scenario } from 'savings-core';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  onSave: (name: string, color: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  activeIds: string[];
}

const PRESET_COLORS = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
];

export default function ScenarioManager({
  scenarios,
  onSave,
  onDelete,
  onToggle,
  activeIds,
}: ScenarioManagerProps) {
  const t = useTranslations('Scenario');
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName, selectedColor);
      setNewName('');
      // Cycle color for next one
      const currentIndex = PRESET_COLORS.indexOf(selectedColor);
      setSelectedColor(PRESET_COLORS[(currentIndex + 1) % PRESET_COLORS.length]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {t('title')}
        </h3>
        
        {/* Save Current Section */}
        <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              disabled={scenarios.length >= 3}
            />
            <button
              onClick={handleSave}
              disabled={!newName.trim() || scenarios.length >= 3}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {t('saveCurrent')}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{t('colorLabel')}:</span>
            <div className="flex gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                    selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          {scenarios.length >= 3 && (
            <p className="text-xs text-amber-400">{t('maxReached')}</p>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          {t('listTitle')}
        </h4>
        
        {scenarios.length === 0 ? (
          <p className="text-sm text-gray-500 italic">{t('noScenarios')}</p>
        ) : (
          <div className="space-y-2">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 group hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={activeIds.includes(scenario.id)}
                    onChange={() => onToggle(scenario.id)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-gray-900 border-gray-700"
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: scenario.color }}
                  />
                  <span className="text-sm font-medium text-white">{scenario.name}</span>
                </div>
                
                <button
                  onClick={() => onDelete(scenario.id)}
                  className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
