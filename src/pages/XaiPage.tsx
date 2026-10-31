import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  BarChart,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_XAI_STUDENTS } from '../data/sampleDataset';

export const XaiPage: React.FC = () => {
  const { activeModel } = useApp();
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);

  const selectedCase = INITIAL_XAI_STUDENTS[selectedCaseIdx];

  const globalFeatureImportance = activeModel?.featureImportance || [
    { feature: 'Midterm 2 Score (G2)', importance: 0.385 },
    { feature: 'Attendance Rate', importance: 0.224 },
    { feature: 'Midterm 1 Score (G1)', importance: 0.178 },
    { feature: 'Weekly Study Time', importance: 0.098 },
    { feature: 'Past Failures (Backlogs)', importance: 0.054 },
    { feature: 'Nightly Sleep Duration', importance: 0.027 },
    { feature: 'Health & Stress Rating', importance: 0.019 },
    { feature: 'Daily Travel Time', importance: 0.015 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            Explainable AI (XAI): Global & Local SHAP Attribution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Demystifying black-box machine learning predictions using Shapley Additive exPlanations (SHAP) based on cooperative game theory.
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono text-xs">
          SHAP TreeExplainer Active
        </div>
      </div>

      {/* Global Feature Importance Ranking */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Global Feature Importance (Mean |SHAP Value|)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Quantifies average magnitude of influence each feature exerts across the entire cohort.
            </p>
          </div>
          <span className="text-xs font-mono text-blue-500">Model: {activeModel?.name.split('(')[0] || 'Random Forest'}</span>
        </div>

        <div className="space-y-3">
          {globalFeatureImportance.map((feat) => {
            const pct = (feat.importance * 100).toFixed(1);
            return (
              <div key={feat.feature} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-sans font-medium text-slate-800 dark:text-slate-200">
                    {feat.feature}
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Detailed Individual Student Explanations */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Individual Local Explanations (3 Benchmark Student Personas)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select one of the 3 case studies to view the exact mathematical waterfall breakdown from base value to final prediction.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-900">
            {INITIAL_XAI_STUDENTS.map((cs, idx) => (
              <button
                key={cs.studentId}
                onClick={() => setSelectedCaseIdx(idx)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCaseIdx === idx
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Case {idx + 1}: {cs.studentName.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Case Study Header */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Student Case Study: {selectedCase.studentId}
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedCase.studentName}
            </h4>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Dataset Base Value (E[Y])</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {selectedCase.baseValue}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Actual Score</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {selectedCase.actualScore}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Predicted Score</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                {selectedCase.predictedScore}%
              </span>
            </div>
          </div>
        </div>

        {/* SHAP Waterfall Breakdown Table */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Local SHAP Contribution Waterfall
          </h4>

          <div className="space-y-2">
            {selectedCase.shapValues.map((val) => {
              const isPos = val.contribution >= 0;
              return (
                <div
                  key={val.feature}
                  className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isPos
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-rose-500/20 bg-rose-500/5'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {val.feature}
                      </span>
                      <span className="text-slate-400 text-[11px]">({val.featureValue})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {val.interpretation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-mono font-bold">
                    {isPos ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{val.contribution.toFixed(1)} pts
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {val.contribution.toFixed(1)} pts
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Natural Language Summary Card */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-500/20 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
              Natural Language SHAP Synthesis:
            </span>
            <p className="leading-relaxed">{selectedCase.waterfallSummary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
