import React from 'react';
import {
  LayoutDashboard,
  Database,
  BarChart3,
  Cpu,
  Target,
  UserCheck,
  AlertTriangle,
  Network,
  HelpCircle,
  Lightbulb,
  Users,
  FileDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Lock
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavGroup {
  title: string;
  items: {
    id: NavigationPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Core Analytics',
    items: [
      { id: 'overview', label: '1. Overview Dashboard', icon: LayoutDashboard },
      { id: 'dataset', label: '2. Dataset Management', icon: Database },
      { id: 'eda', label: '3. Exploratory Data Analysis', icon: BarChart3 }
    ]
  },
  {
    title: 'Machine Learning Pipeline',
    items: [
      { id: 'training', label: '4. Model Training', icon: Cpu },
      { id: 'evaluation', label: '5. Model Evaluation', icon: Target }
    ]
  },
  {
    title: 'Student Intelligence',
    items: [
      { id: 'prediction', label: '6. Student Prediction', icon: UserCheck },
      { id: 'risk', label: '7. Risk Classification', icon: AlertTriangle },
      { id: 'clustering', label: '8. Student Clustering', icon: Network },
      { id: 'xai', label: '9. Explainable AI (XAI)', icon: HelpCircle },
      { id: 'recommendations', label: '10. Learning Recommendations', icon: Lightbulb }
    ]
  },
  {
    title: 'Registry & Compliance',
    items: [
      { id: 'records', label: '11. Student Records', icon: Users },
      { id: 'reports', label: '12. Reports & Downloads', icon: FileDown },
      { id: 'testing', label: '13. Testing & Documentation', icon: CheckCircle2 }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { currentPage, setCurrentPage, students } = useApp();
  const { user, canAccessPage, setAuthModal } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen transition-all duration-300 flex flex-col border-r bg-[#070D18] border-slate-800 text-slate-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#091122]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold tracking-wider text-sm text-white font-mono flex items-center gap-1.5">
                TREKVERSE <span className="text-blue-400 font-sans">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 truncate tracking-tight">
                Student Success Hub
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Banner */}
      {!collapsed && user && (
        <div className="px-4 py-2 bg-blue-950/40 border-b border-blue-900/40 flex items-center justify-between text-[11px]">
          <span className="text-slate-300 font-medium">Active Account:</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              user.role === 'ADMIN'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                : user.role === 'FACULTY'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {user.role}
          </span>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const hasPermission = canAccessPage(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (hasPermission) {
                        setCurrentPage(item.id);
                      } else {
                        // Denied: Open login modal so user can authenticate with required role credentials
                        setAuthModal('login');
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group relative ${
                      !hasPermission
                        ? 'opacity-60 text-slate-400 hover:text-white hover:bg-slate-800/40 cursor-pointer'
                        : isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold cursor-pointer'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer'
                    }`}
                    title={
                      !hasPermission
                        ? `Restricted in RBAC (${item.label}) — Sign in as Admin or Faculty to access`
                        : collapsed
                        ? item.label
                        : undefined
                    }
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate text-left flex-1">{item.label}</span>
                    )}

                    {!hasPermission && !collapsed && (
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-900/40 px-1 rounded flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        Admin
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute right-1 w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      {!collapsed ? (
        <div className="p-4 border-t border-slate-800/80 bg-[#060A14] text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">Active Cohort:</span>
            <span className="font-mono text-white font-semibold">{students.length} Students</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full w-full" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">
            Pipeline: Scikit-Learn 1.2.1
          </p>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800 flex justify-center text-blue-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      )}
    </aside>
  );
};
