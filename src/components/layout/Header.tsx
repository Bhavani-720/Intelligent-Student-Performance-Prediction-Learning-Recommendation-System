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
      className={`sticky top-0 z-20 h-16 border-b transition-all duration-300 bg-[#190D30]/90 backdrop-blur-xl border-purple-900/40 px-6 flex items-center justify-between ${
        sidebarCollapsed ? 'ml-20' : 'ml-72'
      }`}
    >
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col min-w-0 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#A855F7] tracking-wider">
            TREKVERSE
          </span>
          <span className="text-purple-700">/</span>
          <h1 className="text-sm md:text-base font-bold text-[#F5F3FF] truncate">
            {currentInfo.title}
          </h1>
        </div>
        <p className="hidden md:block text-[11px] text-[#B8A9D1] truncate">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Authenticated Role Status Badge */}
        {isAuthenticated && user && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-purple-800/50 bg-[#21123B]/80 text-[11px] font-mono shadow-sm">
            <span className="text-[#C4B5FD] text-[10px] uppercase font-bold">Role:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                user.role === 'ADMIN'
                  ? 'bg-[#D946EF]/25 text-[#F5F3FF] border border-[#D946EF]/50'
                  : user.role === 'FACULTY'
                  ? 'bg-[#8B5CF6]/25 text-[#C4B5FD] border border-[#8B5CF6]/50'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {user.role}
            </span>
            <button
              onClick={() => setAuthModal('login')}
              className="ml-1 text-[10px] text-[#C4B5FD] hover:text-[#D946EF] underline cursor-pointer"
              title="Authenticate as different role"
            >
              Switch
            </button>
          </div>
        )}

        {/* Active Dataset Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-800/40 bg-[#21123B]/60 text-xs text-[#B8A9D1]">
          <Database className="w-3.5 h-3.5 text-[#A855F7]" />
          <span className="font-mono text-[#F5F3FF] truncate max-w-[130px]">
            {datasetSummary.filename}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[#C4B5FD] font-mono text-[10px] font-bold border border-purple-500/30">
            {students.length} rows
          </span>
        </div>

        {/* Reset / Reload dataset */}
        <button
          onClick={resetToSampleData}
          className="p-2 rounded-xl border border-purple-800/40 text-[#B8A9D1] hover:text-[#F5F3FF] hover:bg-[#2D1452] transition-colors cursor-pointer"
          title="Reset dataset to benchmark sample"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-purple-800/40 text-[#B8A9D1] hover:text-[#F5F3FF] hover:bg-[#2D1452] transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#D946EF]" />
          ) : (
            <Moon className="w-4 h-4 text-[#C4B5FD]" />
          )}
        </button>

        {/* User Account / Auth Section */}
        {isAuthenticated && user ? (
          <button
            onClick={() => setAuthModal('profile')}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-purple-800/50 hover:border-[#A855F7] bg-[#21123B]/80 hover:bg-[#2D1452] transition-all cursor-pointer text-left shadow-sm"
            title="Manage account profile and permissions"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6D28D9] to-[#D946EF] text-white flex items-center justify-center font-bold text-xs font-mono shadow-md shadow-purple-900/30">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-[#F5F3FF] truncate max-w-[120px] block leading-tight">
                {user.name.split(' ')[0]}
              </span>
              <span
                className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                  user.role === 'ADMIN'
                    ? 'text-[#D946EF]'
                    : user.role === 'FACULTY'
                    ? 'text-[#8B5CF6]'
                    : 'text-emerald-400'
                }`}
              >
                {user.role}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => setAuthModal('login')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#7C3AED] hover:to-[#A855F7] text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
