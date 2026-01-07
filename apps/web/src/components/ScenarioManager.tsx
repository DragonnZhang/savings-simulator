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
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {t('title')}
        </h3>
        
        {/* Save Current Section */}
        <div className="bg-[#141416] p-5 rounded-2xl border border-[#2A2A2E] space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="flex-1 nebula-input px-4 py-3 text-sm font-medium"
              disabled={scenarios.length >= 3}
            />
            <button
              onClick={handleSave}
              disabled={!newName.trim() || scenarios.length >= 3}
              className="px-5 py-3 bg-[#F5C065] hover:bg-[#D4A017] disabled:bg-[#3F3F46] disabled:!text-[#E4E4E7] disabled:border disabled:border-[#52525B] disabled:cursor-not-allowed text-[#1A1A1D] hover:text-black text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-[--nebula-gold-dim] disabled:shadow-none whitespace-nowrap select-none"
            >
              {t('saveCurrent')}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[--nebula-text-muted] uppercase tracking-wider">{t('colorLabel')}:</span>
            <div className="flex gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-110 border-2 ${
                    selectedColor === color ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          {scenarios.length >= 3 && (
            <p className="text-xs text-amber-500 font-medium bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">{t('maxReached')}</p>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-[--nebula-text-muted] uppercase tracking-wider">
          {t('listTitle')}
        </h4>
        
        {scenarios.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-[#2A2A2E] bg-[#1A1A1D]/50 text-center">
            <p className="text-sm text-[--nebula-text-muted] italic">{t('noScenarios')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-4 bg-[#1A1A1D] rounded-xl border border-[#2A2A2E] group hover:border-[--nebula-text-muted] transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={activeIds.includes(scenario.id)}
                    onChange={() => onToggle(scenario.id)}
                    className="w-4 h-4 rounded appearance-none border border-[#71717A] bg-[#27272A] checked:bg-[#F5C065] checked:border-[#F5C065] focus:ring-1 focus:ring-[#F5C065] transition-all cursor-pointer relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[5px] after:top-[1px] after:w-[5px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-black after:rotate-45"
                  />
                  <div
                    className="w-3 h-3 rounded-full shadow-[0_0_8px] shadow-current"
                    style={{ backgroundColor: scenario.color }}
                  />
                  <span className="text-sm font-medium text-white">{scenario.name}</span>
                </div>
                
                <button
                  onClick={() => onDelete(scenario.id)}
                  className="p-2 text-[--nebula-text-muted] hover:text-white hover:bg-rose-500/20 hover:text-rose-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
