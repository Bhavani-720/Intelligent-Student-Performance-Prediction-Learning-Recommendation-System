import React, { useState } from 'react';
import {
  UserCheck,
  Sparkles,
  Calculator,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  CheckCircle,
  HelpCircle,
  Zap,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PredictionPayload } from '../types';

export const PredictionPage: React.FC = () => {
  const {
    predictionInput,
    setPredictionInput,
    predictionResult,
    predictStudent,
    activeModel
  } = useApp();

  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const handleInputChange = (field: keyof PredictionPayload, val: any) => {
    setPredictionInput((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predictStudent(predictionInput);
  };

  // Quick Preset Profiles
  const loadPreset = (preset: 'high' | 'borderline' | 'critical') => {
    if (preset === 'high') {
      const p: PredictionPayload = {
        studyTimeWeeklyHours: 18,
        attendanceRate: 94,
        pastFailures: 0,
        midterm1Score: 88,
        midterm2Score: 92,
        parentalEducation: 'Higher',
        extracurricular: true,
        internetAccess: true,
        sleepHours: 8,
        stressLevel: 'Low',
        travelTimeMinutes: 15
      };
      setPredictionInput(p);
      predictStudent(p);
    } else if (preset === 'borderline') {
      const p: PredictionPayload = {
        studyTimeWeeklyHours: 11,
        attendanceRate: 78,
        pastFailures: 1,
        midterm1Score: 64,
        midterm2Score: 66,
        parentalEducation: 'Secondary',
        extracurricular: false,
        internetAccess: true,
        sleepHours: 6.5,
        stressLevel: 'Medium',
        travelTimeMinutes: 30
      };
      setPredictionInput(p);
      predictStudent(p);
    } else {
      const p: PredictionPayload = {
        studyTimeWeeklyHours: 5,
        attendanceRate: 58,
        pastFailures: 2,
        midterm1Score: 42,
        midterm2Score: 40,
        parentalEducation: 'Primary',
        extracurricular: false,
        internetAccess: true,
        sleepHours: 5,
        stressLevel: 'High',
        travelTimeMinutes: 50
      };
      setPredictionInput(p);
      predictStudent(p);
    }
  };

  return (
    <div className="space-y-6">
      {/* What-If Academic Simulator Disclaimer Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="font-semibold text-[#F5F3FF]">
            Hypothetical Academic Simulation — Does not guarantee exam results
          </span>
        </div>
        <span className="text-[11px] text-amber-300 font-mono">
          Interactive Scenario Simulator
        </span>
      </div>

      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-purple-800/40 bg-gradient-to-r from-[#190D30] via-[#21123B] to-[#2D1452] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-base font-bold text-[#F5F3FF] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#8B5CF6]" />
            Individual Student Performance Prediction & Simulation
          </h2>
          <p className="text-xs text-[#B8A9D1] mt-1">
            Simulate academic outcomes under various study habits, internal marks, and attendance levels with 95% confidence intervals.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#B8A9D1] font-mono">Quick Preset:</span>
          <button
            onClick={() => loadPreset('high')}
            className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            Achiever
          </button>
          <button
            onClick={() => loadPreset('borderline')}
            className="px-3 py-1 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#C4B5FD] border border-[#8B5CF6]/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            Borderline
          </button>
          <button
            onClick={() => loadPreset('critical')}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            At-Risk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Student Input Parameters (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 shadow-lg backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#F5F3FF] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#8B5CF6]" />
              Student Academic & Behavioral Profile
            </h3>

            {/* Subject Selector */}
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-[#B8A9D1] font-mono">Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-purple-700/50 bg-[#190D30] text-xs text-[#F5F3FF]"
              >
                <option value="all">Cohort Baseline (All Subjects)</option>
                <option value="math">Mathematics (MATH-201)</option>
                <option value="cs">Computer Science (CS-101)</option>
                <option value="ds">Data Structures (CS-202)</option>
              </select>
            </div>
          </div>

          {/* Subject-specific prediction disclaimer */}
          {selectedSubject !== 'all' && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Subject-specific prediction unavailable.</strong> Additional subject-level training data is required. Showing cohort-wide baseline model prediction.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Midterm 1 */}
              <div>
                <label className="block text-xs font-medium text-[#F5F3FF] mb-1">
                  Midterm 1 Score (G1): <span className="font-mono text-[#D946EF] font-bold">{predictionInput.midterm1Score} / 100</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={predictionInput.midterm1Score}
                  onChange={(e) => handleInputChange('midterm1Score', Number(e.target.value))}
                  className="w-full accent-[#8B5CF6]"
                />
              </div>

              {/* Midterm 2 */}
              <div>
                <label className="block text-xs font-medium text-[#F5F3FF] mb-1">
                  Midterm 2 Score (G2): <span className="font-mono text-[#D946EF] font-bold">{predictionInput.midterm2Score} / 100</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={predictionInput.midterm2Score}
                  onChange={(e) => handleInputChange('midterm2Score', Number(e.target.value))}
                  className="w-full accent-[#8B5CF6]"
                />
              </div>

              {/* Attendance Rate */}
              <div>
                <label className="block text-xs font-medium text-[#F5F3FF] mb-1">
                  Attendance Rate: <span className="font-mono text-[#8B5CF6] font-bold">{predictionInput.attendanceRate}%</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={predictionInput.attendanceRate}
                  onChange={(e) => handleInputChange('attendanceRate', Number(e.target.value))}
                  className="w-full accent-[#8B5CF6]"
                />
              </div>

              {/* Study Time Weekly Hours */}
              <div>
                <label className="block text-xs font-medium text-[#F5F3FF] mb-1">
                  Weekly Study Hours: <span className="font-mono text-[#8B5CF6] font-bold">{predictionInput.studyTimeWeeklyHours} hrs/wk</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={predictionInput.studyTimeWeeklyHours}
                  onChange={(e) => handleInputChange('studyTimeWeeklyHours', Number(e.target.value))}
                  className="w-full accent-[#8B5CF6]"
                />
              </div>

              {/* Past Failures */}
              <div>
                <label className="block text-xs font-medium text-[#F5F3FF] mb-1">
                  Past Course Failures (Backlogs)
                </label>
                <select
                  value={predictionInput.pastFailures}
                  onChange={(e) => handleInputChange('pastFailures', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-purple-700/50 bg-[#190D30] text-xs font-mono text-[#F5F3FF]"
                >
                  <option value={0}>0 Failures (Clean Record)</option>
                  <option value={1}>1 Past Backlog</option>
                  <option value={2}>2 Past Backlogs</option>
                  <option value={3}>3+ Past Backlogs</option>
                </select>
              </div>

              {/* Sleep Hours */}
              <div>
                <label className="block text-xs font-medium text-[#F5F3FF] mb-1">
                  Average Nightly Sleep: <span className="font-mono text-[#C4B5FD] font-bold">{predictionInput.sleepHours} hrs</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={predictionInput.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', Number(e.target.value))}
                  className="w-full accent-[#8B5CF6]"
                />
              </div>

              {/* Stress Level */}
              <div>
                <label className="block text-xs font-medium text-[#F5F3FF] mb-1">
                  Perceived Stress Level
                </label>
                <select
                  value={predictionInput.stressLevel}
                  onChange={(e) => handleInputChange('stressLevel', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-700/50 bg-[#190D30] text-xs text-[#F5F3FF]"
                >
                  <option value="Low">Low Stress (Balanced)</option>
                  <option value="Medium">Medium Stress (Manageable)</option>
                  <option value="High">High Stress (Burnout Risk)</option>
                </select>
              </div>

              {/* Parental Education */}
              <div>
                <label className="block text-xs font-medium text-[#F5F3FF] mb-1">
                  Parental Education Background
                </label>
                <select
                  value={predictionInput.parentalEducation}
                  onChange={(e) => handleInputChange('parentalEducation', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-700/50 bg-[#190D30] text-xs text-[#F5F3FF]"
                >
                  <option value="None">None</option>
                  <option value="Primary">Primary Education</option>
                  <option value="Secondary">Secondary / High School</option>
                  <option value="Higher">Higher Education (Degree)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-800/40 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] hover:opacity-95 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Compute Final Performance Prediction</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Output: Real-time Prediction Intelligence (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {predictionResult ? (
            <div className="rounded-2xl border border-purple-700/50 bg-gradient-to-b from-[#21123B] to-[#190D30] p-6 shadow-xl backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C4B5FD] font-bold">
                  Prediction Inference Result
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    predictionResult.riskCategory === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : predictionResult.riskCategory === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : predictionResult.riskCategory === 'Moderate'
                      ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {predictionResult.riskCategory.toUpperCase()} RISK
                </span>
              </div>

              {/* Big Score Card */}
              <div className="text-center py-5 bg-[#190D30]/80 rounded-2xl border border-purple-800/40 shadow-inner">
                <span className="text-xs text-[#B8A9D1]">Predicted Final Exam Score</span>
                <div className="text-5xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] my-1">
                  {predictionResult.predictedFinalScore}%
                </div>
                <div className="flex items-center justify-center gap-3 text-xs mt-2">
                  <span className="font-mono text-[#C4B5FD]">
                    95% CI: [{predictionResult.confidenceInterval[0]}% - {predictionResult.confidenceInterval[1]}%]
                  </span>
                  <span className="text-purple-600">·</span>
                  <span className="font-bold text-[#F5F3FF]">
                    Grade: Band {predictionResult.predictedGradeLetter}
                  </span>
                </div>
              </div>

              {/* Probability Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#B8A9D1]">Pass Probability (&ge; 50%)</span>
                  <span className="font-bold text-emerald-400">
                    {predictionResult.passProbability}%
                  </span>
                </div>
                <div className="w-full bg-[#10091F] rounded-full h-2.5 overflow-hidden border border-purple-900/40">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${predictionResult.passProbability}%` }}
                  />
                </div>
              </div>

              {/* Top Factors Contribution Breakdown */}
              <div className="space-y-3 pt-2 border-t border-purple-800/40">
                <p className="text-xs font-bold text-[#F5F3FF]">
                  Key Feature Drivers (SHAP Point Contributions)
                </p>

                <div className="space-y-2 text-xs">
                  {predictionResult.topPositiveFactors.map((f) => (
                    <div key={f.factor} className="flex justify-between items-center text-emerald-400 bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                      <span>+ {f.factor}</span>
                      <span className="font-mono font-bold">{f.impact}</span>
                    </div>
                  ))}
                  {predictionResult.topNegativeFactors.map((f) => (
                    <div key={f.factor} className="flex justify-between items-center text-rose-400 bg-rose-950/20 px-2.5 py-1.5 rounded-lg border border-rose-500/20">
                      <span>- {f.factor}</span>
                      <span className="font-mono font-bold">{f.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[10px] text-[#B8A9D1] font-mono text-center">
                Model: {predictionResult.modelUsed}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 text-center text-xs text-[#B8A9D1] backdrop-blur-xl">
              Submit form to calculate prediction.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
