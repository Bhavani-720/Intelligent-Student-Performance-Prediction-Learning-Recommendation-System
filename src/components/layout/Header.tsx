import React from 'react';
import {
  Moon,
  Sun,
  Database,
  RefreshCw,
  Bell,
  Search,
  Sparkles,
  ShieldCheck,
  User,
  LogIn,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NavigationPage } from '../../types';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const pageTitles: Record<NavigationPage, { title: string; subtitle: string }> = {
  overview: {
    title: 'Overview Dashboard',
    subtitle: 'High-level academic KPIs, cohort performance benchmarks, and predictive health summaries.'
  },
  dataset: {
    title: 'Dataset Management',
    subtitle: 'Dataset upload, Pandas data validation, missing value auditing, and summary statistics.'
  },
  eda: {
    title: 'Exploratory Data Analysis (EDA)',
    subtitle: 'Comprehensive distribution analysis, correlation matrices, and socioeconomic factor correlations.'
  },
  training: {
    title: 'Model Training Pipeline',
    subtitle: 'Train 5+ supervised regression and classification models with hyperparameter cross-validation.'
  },
  evaluation: {
    title: 'Model Evaluation & Benchmarking',
    subtitle: 'Comprehensive regression (MAE, RMSE, R²) and classification metrics with baseline comparisons.'
  },
  prediction: {
    title: 'Student Performance Prediction',
    subtitle: 'Interactive single-student and batch GPA inference with confidence bounds.'
  },
  risk: {
    title: 'Risk Classification & Early Warning',
    subtitle: 'Multi-tier risk stratifications (Low, Moderate, High, Critical) with early intervention flags.'
  },
  clustering: {
    title: 'Unsupervised Student Clustering',
    subtitle: 'K-Means clustering with Elbow Method validation and distinct student cohort personas.'
  },
  xai: {
    title: 'Explainable AI (SHAP & Feature Attribution)',
    subtitle: 'Global feature importance rankings and 3 detailed individual student local explanations.'
  },
  recommendations: {
    title: 'Personalized Learning Recommendations',
    subtitle: 'Actionable intervention playbooks, study schedules, and targeted remedial modules.'
  },
  records: {
    title: 'Student Records Registry',
    subtitle: 'Comprehensive student registry with filtering, search, and student historical drill-down.'
  },
  reports: {
    title: 'Reports & Downloads',
    subtitle: 'Generate and export academic project reports, audit summaries, and CSV data exports.'
  },
  testing: {
    title: 'Automated Testing & Documentation',
    subtitle: 'Unit tests, mathematical pipeline verifications, and project thesis specifications.'
  }
};

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  const {
    currentPage,
    theme,
    toggleTheme,
    students,
    datasetSummary,
    resetToSampleData
  } = useApp();

  const { user, isAuthenticated, setAuthModal } = useAuth();

  const currentInfo = pageTitles[currentPage] || {
    title: 'Trekverse AI Hub',
    subtitle: 'Student Performance Intelligence System'
  };

  return (
    <header
      className={`sticky top-0 z-20 h-16 border-b transition-all duration-300 bg-white/90 dark:bg-[#091122]/90 backdrop-blur-md border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between ${
        sidebarCollapsed ? 'ml-20' : 'ml-72'
      }`}
    >
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col min-w-0 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400">
            TREKVERSE
          </span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">
            {currentInfo.title}
          </h1>
        </div>
        <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Authenticated Role Status Badge */}
        {isAuthenticated && user && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-[11px] font-mono">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Role:</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                user.role === 'ADMIN'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : user.role === 'FACULTY'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {user.role}
            </span>
            <button
              onClick={() => setAuthModal('login')}
              className="ml-1 text-[10px] text-slate-400 hover:text-blue-400 underline cursor-pointer"
              title="Authenticate as different role"
            >
              Switch
            </button>
          </div>
        )}

        {/* Active Dataset Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
          <Database className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
            {datasetSummary.filename}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
            {students.length} rows
          </span>
        </div>

        {/* Reset / Reload dataset */}
        <button
          onClick={resetToSampleData}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          title="Reset dataset to benchmark sample"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* User Account / Auth Section */}
        {isAuthenticated && user ? (
          <button
            onClick={() => setAuthModal('profile')}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/80 dark:bg-slate-900/80 transition-all cursor-pointer text-left"
            title="Manage account profile and permissions"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px] block leading-tight">
                {user.name.split(' ')[0]}
              </span>
              <span
                className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                  user.role === 'ADMIN'
                    ? 'text-purple-500'
                    : user.role === 'FACULTY'
                    ? 'text-blue-500'
                    : 'text-emerald-500'
                }`}
              >
                {user.role}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => setAuthModal('login')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
