'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { calculate } from 'savings-core';
import type { Scenario } from 'savings-core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import GitHubLink from '@/components/GitHubLink';

interface ReportData {
  scenarios: Scenario[];
  hasData: boolean;
}

export default function ReportsPage() {
  const t = useTranslations('Reports');
  const nav = useTranslations('Navigation');
  const [reportData, setReportData] = useState<ReportData>({ scenarios: [], hasData: false });
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  // Currency symbol based on locale
  const currencySymbol = locale === 'zh' ? '¥' : '$';

  useEffect(() => {
    // Use a small timeout to avoid synchronous setState during render
    const timer = setTimeout(() => {
      setIsMounted(true);
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('scenarios_v1');
        if (saved) {
          try {
            const scenarios = JSON.parse(saved);
            setReportData({ scenarios, hasData: scenarios.length > 0 });
          } catch (e) {
            console.error('Failed to load scenarios for reports', e);
          }
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Calculate analysis data
  const analysisData = reportData.scenarios.map(scenario => {
    const results = calculate(scenario.config, scenario.overrides);
    const finalAmount = results.totalSavings;
    const years = scenario.config.durationYears;
    const totalContributions = results.results.reduce((sum, year) => sum + (year.income - year.expenses), 0);
    const totalReturns = finalAmount - totalContributions;
    const averageGrowthRate = years > 1 ? (Math.pow(finalAmount / (totalContributions || 1), 1 / years) - 1) * 100 : 0;

    return {
      ...scenario,
      results: results.results,
      finalAmount,
      totalContributions,
      totalReturns,
      averageGrowthRate,
      monthlyContribution: totalContributions / (years * 12)
    };
  });

  // Best scenario (highest final amount)
  const bestScenario = analysisData.reduce((best, current) =>
    current.finalAmount > best.finalAmount ? current : best
  , analysisData[0]);

  // Key metrics
  const totalScenarios = analysisData.length;
  const averageGrowthRate = analysisData.length > 0
    ? analysisData.reduce((sum, s) => sum + s.averageGrowthRate, 0) / analysisData.length
    : 0;

  // Risk assessment
  const getRiskLevel = (returnRate: number) => {
    if (returnRate < 5) return t('lowRisk');
    if (returnRate < 10) return t('mediumRisk');
    return t('highRisk');
  };

  // Chart data for scenario comparison
  const comparisonData = analysisData.map(scenario => ({
    name: scenario.name,
    finalAmount: scenario.finalAmount,
    contributions: scenario.totalContributions,
    returns: scenario.totalReturns,
    color: scenario.color
  }));

  // Growth analysis data (showing year-by-year for best scenario)
  const growthData = bestScenario?.results.map((year, index) => ({
    year: index + 1,
    totalSavings: year.totalSavings,
    yearlyGrowth: index > 0 ? year.totalSavings - bestScenario.results[index - 1].totalSavings : year.netSavings
  })) || [];

  if (!isMounted) {
    return <div className="min-h-screen bg-[--nebula-bg] animate-pulse"></div>;
  }

  if (!reportData.hasData) {
    return (
      <div className="min-h-screen p-4 lg:p-8 font-sans selection:bg-[--nebula-gold] selection:text-black">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[--nebula-gold] to-orange-500 flex items-center justify-center shadow-[--nebula-gold-dim]">
              <span className="text-black font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Financial Analysis</p>
            </div>
          </div>

          <nav className="hidden md:flex bg-[#141416] p-1.5 rounded-full border border-[#2A2A2E]">
            <Link href={`/${locale}`} className="px-6 py-2 rounded-full text-gray-500 hover:text-white font-medium text-sm transition-colors">{nav('dashboard')}</Link>
            <button className="px-6 py-2 rounded-full bg-[--nebula-bg] text-white shadow-md font-medium text-sm border border-[#27272A]">{nav('reports')}</button>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <GitHubLink />
          </div>
        </header>

        {/* No data state */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-linear-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{t('noData')}</h2>
            <p className="text-gray-400 mb-8">{t('noDataDescription')}</p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {t('goToDashboard')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 font-sans selection:bg-[--nebula-gold] selection:text-black">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[--nebula-gold] to-orange-500 flex items-center justify-center shadow-lg shadow-[--nebula-gold-dim]">
            <span className="text-black font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Financial Analysis</p>
          </div>
        </div>

        <nav className="hidden md:flex bg-[#141416] p-1.5 rounded-full border border-[#2A2A2E]">
          <Link href={`/${locale}`} className="px-6 py-2 rounded-full text-gray-500 hover:text-white font-medium text-sm transition-colors">{nav('dashboard')}</Link>
          <button className="px-6 py-2 rounded-full bg-[--nebula-bg] text-white shadow-md font-medium text-sm border border-[#27272A]">{nav('reports')}</button>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <GitHubLink />
        </div>
      </header>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-[slideUp_0.5s_ease-out_0.2s_backwards]">
        <div className="nebula-card p-6 border-l-4 border-l-[--nebula-green]">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">{t('totalScenarios')}</h3>
          <div className="text-3xl font-bold text-white">{totalScenarios}</div>
        </div>

        <div className="nebula-card p-6 border-l-4 border-l-[--nebula-gold]">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">{t('bestScenario')}</h3>
          <div className="text-xl font-bold text-white truncate">{bestScenario?.name || '--'}</div>
          <div className="text-sm text-gray-400">{currencySymbol}{bestScenario?.finalAmount?.toLocaleString() || '--'}</div>
        </div>

        <div className="nebula-card p-6 border-l-4 border-l-purple-500">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">{t('averageGrowth')}</h3>
          <div className="text-3xl font-bold text-white">{averageGrowthRate.toFixed(1)}%</div>
        </div>

        <div className="nebula-card p-6 border-l-4 border-l-blue-500">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">{t('monthlyContribution')}</h3>
          <div className="text-2xl font-bold text-white">
            {currencySymbol}{bestScenario?.monthlyContribution?.toLocaleString() || '--'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Scenario Comparison Chart */}
        <div className="nebula-card p-6 border-t-4 border-t-[--nebula-gold] animate-[slideUp_0.5s_ease-out_0.3s_backwards]">
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[--nebula-gold]"></span>
            {t('scenarioComparison')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `${currencySymbol}${(value / 10000).toFixed(0)}${locale === 'zh' ? '万' : 'K'}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number | undefined) => [`${currencySymbol}${value?.toLocaleString() || '0'}`, '']}
                />
                <Bar dataKey="finalAmount" fill="#F5C065" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Analysis */}
        <div className="nebula-card p-6 border-t-4 border-t-[--nebula-green] animate-[slideUp_0.5s_ease-out_0.4s_backwards]">
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[--nebula-green]"></span>
            {t('growthAnalysis')} - {bestScenario?.name}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="year"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `${currencySymbol}${(value / 10000).toFixed(0)}${locale === 'zh' ? '万' : 'K'}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number | undefined) => [`${currencySymbol}${value?.toLocaleString() || '0'}`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="totalSavings"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Scenario Analysis */}
      <div className="nebula-card p-6 border border-[#27272A] animate-[slideUp_0.5s_ease-out_0.5s_backwards]">
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          {t('scenarioDetails')}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#374151]">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('bestScenario')}</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('finalAmount')}</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('duration')}</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('avgReturn')}</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('totalReturn')}</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('riskLevel')}</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.map((scenario) => (
                <tr key={scenario.id} className="border-b border-[#2A2A2E] hover:bg-[#1a1a1c] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: scenario.color }}
                      ></div>
                      <span className="text-white font-medium">{scenario.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 text-white font-semibold">
                    {currencySymbol}{scenario.finalAmount.toLocaleString()}
                  </td>
                  <td className="text-right py-4 px-4 text-gray-300">
                    {scenario.config.durationYears} {t('years')}
                  </td>
                  <td className="text-right py-4 px-4 text-gray-300">
                    {scenario.averageGrowthRate.toFixed(1)}%
                  </td>
                  <td className="text-right py-4 px-4 text-[--nebula-green] font-semibold">
                    {currencySymbol}{scenario.totalReturns.toLocaleString()}
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scenario.config.investmentReturnRate * 100 < 5
                        ? 'bg-green-900 text-green-300'
                        : scenario.config.investmentReturnRate * 100 < 10
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-red-900 text-red-300'
                    }`}>
                      {getRiskLevel(scenario.config.investmentReturnRate * 100)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8 animate-[fadeIn_0.5s_ease-out_0.6s_backwards]">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
          </svg>
          {t('printReport')}
        </button>

        <button
          onClick={() => {
            const dataStr = JSON.stringify(analysisData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'savings-analysis.json';
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          {t('exportData')}
        </button>
      </div>
    </div>
  );
}