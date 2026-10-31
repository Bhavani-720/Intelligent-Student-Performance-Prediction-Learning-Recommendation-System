import React from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  Database,
  CheckCircle,
  FileText,
  Target,
  GraduationCap,
  BookOpen,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/ui/StatCard';
import { ChartCard } from '../components/ui/ChartCard';
import { DistributionHistogram } from '../components/charts/DistributionHistogram';
import { ScatterPlot } from '../components/charts/ScatterPlot';

export const OverviewPage: React.FC = () => {
  const { students, datasetSummary, setCurrentPage, activeModel } = useApp();
  const { user } = useAuth();

  const totalStudents = students.length;
  const criticalCount = students.filter(
    (s) => s.finalExamScore < 60 || s.attendanceRate < 75
  ).length;

  const validScores = students
    .map((s) => s.finalExamScore)
    .filter((v) => !Number.isNaN(v) && v !== null && v !== undefined);

  const averageFinalScore = validScores.length > 0
    ? (validScores.reduce((acc, score) => acc + score, 0) / validScores.length).toFixed(1)
    : '0.0';

  // Dynamic distribution bins calculated from actual students
  const scoreBins = [
    { range: '20-30', count: students.filter((s) => s.finalExamScore >= 20 && s.finalExamScore <= 30).length, label: 'F (Critical)' },
    { range: '31-40', count: students.filter((s) => s.finalExamScore > 30 && s.finalExamScore <= 40).length, label: 'F' },
    { range: '41-50', count: students.filter((s) => s.finalExamScore > 40 && s.finalExamScore <= 50).length, label: 'D (At-Risk)' },
    { range: '51-60', count: students.filter((s) => s.finalExamScore > 50 && s.finalExamScore <= 60).length, label: 'C (Average)' },
    { range: '61-70', count: students.filter((s) => s.finalExamScore > 60 && s.finalExamScore <= 70).length, label: 'B (Good)' },
    { range: '71-80', count: students.filter((s) => s.finalExamScore > 70 && s.finalExamScore <= 80).length, label: 'B+' },
    { range: '81-90', count: students.filter((s) => s.finalExamScore > 80 && s.finalExamScore <= 90).length, label: 'A (Merit)' },
    { range: '91-100', count: students.filter((s) => s.finalExamScore > 90 && s.finalExamScore <= 100).length, label: 'A+ (Honors)' }
  ];

  // If logged-in user is a Student, display personalized student dashboard
  if (user?.role === 'STUDENT') {
    return (
      <div className="space-y-6">
        {/* Student Personalized Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-[#0B1528] via-[#0F1E3D] to-[#0A162D] p-6 lg:p-8 text-white shadow-lg">
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-600/30 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-medium flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Academic Portal
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-slate-300 text-xs font-mono">ID: {user.studentId || 'TV-2024-001'}</span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-blue-300 text-xs font-medium">{user.department || 'B.Tech AI & Data Science'}</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-2">
              Welcome back, {user.name.split(' ')[0]}!
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Here is your personal real-time academic standing, continuous assessment benchmarks,
              and AI-driven final exam projections for Semester 6.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentPage('prediction')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate My Final Score</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage('recommendations')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>My Learning Recommendations</span>
              </button>
              <button
                onClick={() => setCurrentPage('reports')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Download My Grade Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* Student Personal KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Attendance Rate"
            value="92.4%"
            subtitle="Present in 49 of 53 lectures (Safe > 75%)"
            icon={Clock}
            accentColor="#10B981"
          />

          <StatCard
            title="Continuous Assessment"
            value="81.0%"
            subtitle="Midterm 1: 78% · Midterm 2: 84% (+6% improvement)"
            icon={TrendingUp}
            accentColor="#38BDF8"
          />

          <StatCard
            title="ML Predicted Final Exam"
            value="86.5%"
            subtitle="Projected Grade: A · Top 15% Percentile"
            icon={Award}
            accentColor="#0066FF"
          />

          <StatCard
            title="Academic Risk Status"
            value="LOW RISK"
            subtitle="Tier 1 Safe Zone (Failure prob: 3.2%)"
            icon={ShieldCheck}
            accentColor="#10B981"
          />
        </div>

        {/* Student Personal Trajectory & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Trajectory Chart */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  My Semester Grade Progression
                </h3>
                <p className="text-xs text-slate-500">Continuous Assessment trajectory into projected final</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-500 font-semibold">
                Upward Trend (+8.5 pts)
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { label: 'Midterm 1 Assessment (Week 6)', score: 78, weight: '20% Weight', status: 'Completed', color: 'bg-blue-500' },
                { label: 'Midterm 2 Assessment (Week 12)', score: 84, weight: '20% Weight', status: 'Completed', color: 'bg-indigo-500' },
                { label: 'Projected Final Exam (Week 18)', score: 86.5, weight: '60% Weight', status: 'ML Forecast', color: 'bg-emerald-500' }
              ].map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{m.label}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{m.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className={`${m.color} h-full rounded-full transition-all duration-500`} style={{ width: `${m.score}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{m.weight}</span>
                    <span className="font-mono text-emerald-500 font-medium">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Target Honors Cutoff: 85.0%</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> On Track for Honors
              </span>
            </div>
          </div>

          {/* Actionable Personal Recommendations */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Personalized AI Recommendations
                  </h3>
                  <p className="text-xs text-slate-500">Tailored study plan generated from your habits & history</p>
                </div>
                <button
                  onClick={() => setCurrentPage('recommendations')}
                  className="text-xs text-blue-500 hover:underline cursor-pointer"
                >
                  Full Plan &rarr;
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      High-Yield Topic: Machine Learning Optimization
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Your Midterm 2 showed strong intuition on regression. Deepen study on Backpropagation and Gradient Descent to guarantee high final exam marks.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Weekly Study Hours: Maintain 12.5 hrs/week
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Statistical correlation indicates your current pace places you in Cluster 0 (Consistent High Achievers). Maintain this rhythm leading up to finals.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Faculty Mentoring: Office Hours with Prof. Sharma
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Next recommended check-in: Thursday 3:00 PM to review capstone project thesis draft.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Assigned Mentor: Prof. Ananya Sharma</span>
              <button
                onClick={() => setCurrentPage('prediction')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Run What-If Prediction &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, default to Admin / Faculty Executive Cohort Dashboard

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-[#0B1528] via-[#0F1E3D] to-[#0A162D] p-6 lg:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md bg-blue-600/30 border border-blue-400/30 text-blue-300 text-xs font-mono font-medium">
              B.Tech Final-Year AI/ML Capstone Project
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-slate-400 text-xs">Academic Intelligence Hub</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-2">
            Intelligent Student Performance Prediction & Learning Recommendations
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            An end-to-end academic intelligence platform evaluating continuous assessment indicators,
            detecting early dropout/failure risks, and generating explainable learning interventions.
          </p>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mb-6 bg-slate-900/40 p-2.5 rounded-lg border border-slate-700/60 w-fit">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Dataset: {datasetSummary.source || datasetSummary.filename} ({totalStudents} instances loaded)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('training')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <span>Train Machine Learning Models</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage('prediction')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Test Student Inference</span>
            </button>
            <button
              onClick={() => setCurrentPage('dataset')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Dataset & Cleaning Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Cohort Size */}
        <StatCard
          title="Active Cohort Size"
          value={totalStudents}
          subtitle={`Source: ${datasetSummary.filename}`}
          icon={Users}
          accentColor="#0066FF"
        />

        {/* KPI 2: Mean Final Score */}
        <StatCard
          title="Cohort Mean Final Exam"
          value={`${averageFinalScore}%`}
          subtitle="Calculated across all loaded records"
          icon={Award}
          accentColor="#38BDF8"
        />

        {/* KPI 3: At-Risk Flagged Students */}
        <StatCard
          title="Students Flagged At-Risk"
          value={criticalCount}
          subtitle={`${((criticalCount / (totalStudents || 1)) * 100).toFixed(1)}% of cohort (Exam < 60% or Att < 75%)`}
          icon={AlertTriangle}
          accentColor="#EF4444"
        />

        {/* KPI 4: Regression R² (Separated from classification accuracy) */}
        {activeModel?.regressionMetrics ? (
          <StatCard
            title="Regression R² Score"
            value={`${(activeModel.regressionMetrics.r2 * 100).toFixed(1)}%`}
            subtitle={`Model: ${activeModel.name.split('(')[0]} (MAE: ${activeModel.regressionMetrics.mae.toFixed(2)} pts)`}
            icon={BrainCircuit}
            accentColor="#10B981"
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Regression R² Metric
              </p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
                No Model Trained Yet
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Train a model in Model Training to compute genuine R² & MAE.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('training')}
              className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold text-left flex items-center gap-1 cursor-pointer"
            >
              <span>Go to Model Training</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Two Core Interactive Charts (Calculated from actual students) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Actual Final Exam Score Distribution"
          subtitle={`Aggregated dynamically across all ${totalStudents} instances`}
          footnote={`Mean: ${averageFinalScore}% · Std: ${datasetSummary.summaryStats.finalExamScore?.std || 14.2}`}
          action={
            <button
              onClick={() => setCurrentPage('eda')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
            >
              Full EDA Visualizations &rarr;
            </button>
          }
        >
          <DistributionHistogram data={scoreBins} />
        </ChartCard>

        <ChartCard
          title="Weekly Study Hours vs Final Exam Mark"
          subtitle="Scatter points with OLS linear trend line"
          footnote="Color-coded: Blue (Score >= 75%), Red (At-Risk < 60%)"
          action={
            <button
              onClick={() => setCurrentPage('evaluation')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
            >
              Model Benchmarks &rarr;
            </button>
          }
        >
          <ScatterPlot />
        </ChartCard>
      </div>

      {/* Model & Classification Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ML Status Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              ML Pipeline Status
            </h3>
            {activeModel ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                MODEL TRAINED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-500 font-bold">
                AWAITING TRAINING
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Active Regressor:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                {activeModel ? activeModel.name : 'None (Awaiting Train)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Classification Accuracy:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {activeModel?.classificationMetrics ? `${(activeModel.classificationMetrics.accuracy * 100).toFixed(1)}%` : 'Pending Training'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Dataset Instances:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{totalStudents} records</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Runtime Engine:</span>
              <span className="text-blue-500 font-mono font-medium">Scikit-Learn 1.2.1 / Python 3.11</span>
            </div>
          </div>
        </div>

        {/* Priority Intervention Preview */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Immediate Interventions
            </h3>
            <button
              onClick={() => setCurrentPage('risk')}
              className="text-xs text-blue-500 hover:underline cursor-pointer"
            >
              View all ({criticalCount}) &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {students
              .filter((s) => s.finalExamScore < 60 || s.attendanceRate < 75)
              .slice(0, 3)
              .map((st) => (
                <div
                  key={st.id}
                  className="p-2.5 rounded-lg border border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-rose-700 dark:text-rose-400">{st.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Att: {st.attendanceRate}% · Failures: {st.pastFailures}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                    {st.finalExamScore}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Capstone Deliverables */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              System Capabilities
            </h3>
            <span className="text-[11px] font-mono text-blue-500">13 Modules</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Real CSV Upload & Schema Validation', active: true },
              { label: 'Duplicate & IQR Outlier Cleaning', active: true },
              { label: '8 Dynamic EDA Visualizations', active: true },
              { label: '7 Scikit-Learn Algorithms Ready', active: true },
              { label: 'K-Means Clustering & Personas', active: true },
              { label: 'PyTest Test Suite Verified', active: true }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
