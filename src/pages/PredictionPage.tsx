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
  HelpCircle
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
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-500" />
            Individual Student Performance Prediction & Simulation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate academic outcomes under various study habits, internal marks, and attendance levels with 95% confidence intervals.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Load Preset:</span>
          <button
            onClick={() => loadPreset('high')}
            className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition-colors"
          >
            Achiever
          </button>
          <button
            onClick={() => loadPreset('borderline')}
            className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 text-xs font-medium transition-colors"
          >
            Borderline
          </button>
          <button
            onClick={() => loadPreset('critical')}
            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
          >
            At-Risk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Student Input Parameters (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-500" />
            Student Academic & Behavioral Profile
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Midterm 1 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Midterm 1 Score (G1): <span className="font-mono text-blue-500">{predictionInput.midterm1Score} / 100</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={predictionInput.midterm1Score}
                  onChange={(e) => handleInputChange('midterm1Score', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Midterm 2 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Midterm 2 Score (G2): <span className="font-mono text-blue-500">{predictionInput.midterm2Score} / 100</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={predictionInput.midterm2Score}
                  onChange={(e) => handleInputChange('midterm2Score', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Attendance Rate */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Attendance Rate: <span className="font-mono text-blue-500">{predictionInput.attendanceRate}%</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={predictionInput.attendanceRate}
                  onChange={(e) => handleInputChange('attendanceRate', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Study Time Weekly Hours */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Weekly Study Hours: <span className="font-mono text-blue-500">{predictionInput.studyTimeWeeklyHours} hrs/wk</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={predictionInput.studyTimeWeeklyHours}
                  onChange={(e) => handleInputChange('studyTimeWeeklyHours', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Past Failures */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Past Course Failures (Backlogs)
                </label>
                <select
                  value={predictionInput.pastFailures}
                  onChange={(e) => handleInputChange('pastFailures', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                >
                  <option value={0}>0 Failures (Clean Record)</option>
                  <option value={1}>1 Past Backlog</option>
                  <option value={2}>2 Past Backlogs</option>
                  <option value={3}>3+ Past Backlogs</option>
                </select>
              </div>

              {/* Sleep Hours */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Average Nightly Sleep: <span className="font-mono text-blue-500">{predictionInput.sleepHours} hrs</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={predictionInput.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Stress Level */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Perceived Stress Level
                </label>
                <select
                  value={predictionInput.stressLevel}
                  onChange={(e) => handleInputChange('stressLevel', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Low">Low Stress (Balanced)</option>
                  <option value="Medium">Medium Stress (Manageable)</option>
                  <option value="High">High Stress (Burnout Risk)</option>
                </select>
              </div>

              {/* Parental Education */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Parental Education Background
                </label>
                <select
                  value={predictionInput.parentalEducation}
                  onChange={(e) => handleInputChange('parentalEducation', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="None">None</option>
                  <option value="Primary">Primary Education</option>
                  <option value="Secondary">Secondary / High School</option>
                  <option value="Higher">Higher Education (Degree)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
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
            <div className="rounded-xl border border-blue-500/30 bg-gradient-to-b from-white to-blue-50/20 dark:from-[#0F172A] dark:to-[#081226] p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                  Prediction Inference Result
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    predictionResult.riskCategory === 'Critical'
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                      : predictionResult.riskCategory === 'High'
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                      : predictionResult.riskCategory === 'Moderate'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {predictionResult.riskCategory.toUpperCase()} RISK
                </span>
              </div>

              {/* Big Score Card */}
              <div className="text-center py-4 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs text-slate-500">Predicted Final Exam Score</span>
                <div className="text-5xl font-extrabold font-mono text-blue-600 dark:text-blue-400 my-1">
                  {predictionResult.predictedFinalScore}%
                </div>
                <div className="flex items-center justify-center gap-3 text-xs mt-2">
                  <span className="font-mono text-slate-500">
                    95% CI: [{predictionResult.confidenceInterval[0]}% - {predictionResult.confidenceInterval[1]}%]
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Grade: Band {predictionResult.predictedGradeLetter}
                  </span>
                </div>
              </div>

              {/* Probability Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Pass Probability (&ge; 50%)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {predictionResult.passProbability}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${predictionResult.passProbability}%` }}
                  />
                </div>
              </div>

              {/* Top Factors Contribution Breakdown */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Key Feature Drivers
                </p>

                <div className="space-y-1.5 text-xs">
                  {predictionResult.topPositiveFactors.map((f) => (
                    <div key={f.factor} className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                      <span>• {f.factor}</span>
                      <span className="font-mono font-bold">{f.impact}</span>
                    </div>
                  ))}
                  {predictionResult.topNegativeFactors.map((f) => (
                    <div key={f.factor} className="flex justify-between items-center text-rose-500">
                      <span>• {f.factor}</span>
                      <span className="font-mono font-bold">{f.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 font-mono text-center">
                Model: {predictionResult.modelUsed}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 text-center text-xs text-slate-400">
              Submit form to calculate prediction.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
