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
      <div className="p-6 rounded-2xl border border-purple-800/40 bg-gradient-to-r from-[#190D30] via-[#21123B] to-[#2D1452] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-base font-bold text-[#F5F3FF] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#8B5CF6]" />
            Explainable AI (XAI): Global & Local SHAP Attribution
          </h2>
          <p className="text-xs text-[#B8A9D1] mt-1">
            Demystifying black-box machine learning predictions using Shapley Additive exPlanations (SHAP) based on cooperative game theory.
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C4B5FD] font-mono text-xs">
          SHAP TreeExplainer Active
        </div>
      </div>

      {/* Global Feature Importance Ranking */}
      <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#F5F3FF]">
              Global Feature Importance (Mean |SHAP Value|)
            </h3>
            <p className="text-xs text-[#B8A9D1] mt-0.5">
              Quantifies average magnitude of influence each feature exerts across the entire cohort.
            </p>
          </div>
          <span className="text-xs font-mono text-[#D946EF]">Model: {activeModel?.name.split('(')[0] || 'Random Forest'}</span>
        </div>

        <div className="space-y-3">
          {globalFeatureImportance.map((feat) => {
            const pct = (feat.importance * 100).toFixed(1);
            return (
              <div key={feat.feature} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-sans font-medium text-[#F5F3FF]">
                    {feat.feature}
                  </span>
                  <span className="font-bold text-[#D946EF]">{pct}%</span>
                </div>
                <div className="w-full bg-[#10091F] rounded-full h-2.5 overflow-hidden border border-purple-900/40">
                  <div
                    className="bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Detailed Individual Student Explanations */}
      <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#F5F3FF]">
              Individual Local Explanations (3 Benchmark Student Personas)
            </h3>
            <p className="text-xs text-[#B8A9D1] mt-0.5">
              Select one of the 3 case studies to view the exact mathematical waterfall breakdown from base value to final prediction.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#10091F] border border-purple-900/40">
            {INITIAL_XAI_STUDENTS.map((cs, idx) => (
              <button
                key={cs.studentId}
                onClick={() => setSelectedCaseIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCaseIdx === idx
                    ? 'bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white shadow-sm font-semibold'
                    : 'text-[#B8A9D1] hover:text-white'
                }`}
              >
                Case {idx + 1}: {cs.studentName.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Case Study Header */}
        <div className="p-4 rounded-xl border border-purple-800/40 bg-[#190D30]/80 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#B8A9D1]">
              Student Case Study: {selectedCase.studentId}
            </span>
            <h4 className="text-base font-bold text-[#F5F3FF]">
              {selectedCase.studentName}
            </h4>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-[#B8A9D1] text-[10px] block">Dataset Base Value (E[Y])</span>
              <span className="font-bold text-[#C4B5FD]">
                {selectedCase.baseValue}%
              </span>
            </div>
            <div>
              <span className="text-[#B8A9D1] text-[10px] block">Actual Score</span>
              <span className="font-bold text-[#C4B5FD]">
                {selectedCase.actualScore}%
              </span>
            </div>
            <div>
              <span className="text-[#B8A9D1] text-[10px] block">Predicted Score</span>
              <span className="font-extrabold text-[#D946EF] text-sm">
                {selectedCase.predictedScore}%
              </span>
            </div>
          </div>
        </div>

        {/* SHAP Waterfall Breakdown Table */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4B5FD] font-mono">
            Local SHAP Contribution Waterfall
          </h4>

          <div className="space-y-2">
            {selectedCase.shapValues.map((val) => {
              const isPos = val.contribution >= 0;
              return (
                <div
                  key={val.feature}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isPos
                      ? 'border-emerald-500/30 bg-emerald-950/20'
                      : 'border-rose-500/30 bg-rose-950/20'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#F5F3FF]">
                        {val.feature}
                      </span>
                      <span className="text-[#C4B5FD] text-[11px]">({val.featureValue})</span>
                    </div>
                    <p className="text-[11px] text-[#B8A9D1] mt-0.5">
                      {val.interpretation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-mono font-bold">
                    {isPos ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{val.contribution.toFixed(1)} pts
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
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
          <div className="p-4 rounded-xl bg-[#190D30] border border-purple-800/40 text-xs text-[#F5F3FF]">
            <span className="font-bold text-[#8B5CF6] block mb-1">
              Natural Language SHAP Synthesis:
            </span>
            <p className="leading-relaxed text-[#B8A9D1]">{selectedCase.waterfallSummary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
