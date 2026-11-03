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
      className={`fixed top-0 left-0 z-30 h-screen transition-all duration-300 flex flex-col border-r bg-[#190D30]/95 backdrop-blur-xl border-purple-900/40 text-[#B8A9D1] shadow-2xl shadow-purple-950/50 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-purple-900/50 bg-[#21123B]/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold tracking-wider text-sm text-[#F5F3FF] font-mono flex items-center gap-1.5">
                TREKVERSE <span className="text-[#A855F7] font-sans">AI</span>
              </span>
              <span className="text-[10px] text-[#C4B5FD] truncate tracking-tight">
                Academic Intelligence Hub
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#B8A9D1] hover:text-white hover:bg-[#2D1452] transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Banner */}
      {!collapsed && user && (
        <div className="px-4 py-2 bg-[#21123B]/60 border-b border-purple-800/40 flex items-center justify-between text-[11px]">
          <span className="text-[#C4B5FD] font-medium">Active Account:</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              user.role === 'ADMIN'
                ? 'bg-[#D946EF]/25 text-[#F5F3FF] border border-[#D946EF]/50 shadow-sm shadow-fuchsia-500/20'
                : user.role === 'FACULTY'
                ? 'bg-[#8B5CF6]/25 text-[#C4B5FD] border border-[#8B5CF6]/50 shadow-sm shadow-violet-500/20'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {user.role}
          </span>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin scrollbar-thumb-purple-900">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#A855F7]/80 font-mono">
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                      !hasPermission
                        ? 'opacity-50 text-[#B8A9D1] hover:text-white hover:bg-[#21123B]/40 cursor-pointer'
                        : isActive
                        ? 'bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white shadow-lg shadow-purple-900/40 font-semibold border border-purple-400/30 cursor-pointer'
                        : 'text-[#B8A9D1] hover:text-[#F5F3FF] hover:bg-[#21123B]/80 hover:border hover:border-purple-500/20 cursor-pointer'
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
                        isActive ? 'text-white' : 'text-[#C4B5FD] group-hover:text-[#A855F7]'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate text-left flex-1">{item.label}</span>
                    )}

                    {!hasPermission && !collapsed && (
                      <span className="text-[10px] font-mono text-[#D946EF] bg-[#2D1452] px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-[#D946EF]/30">
                        <Lock className="w-2.5 h-2.5" />
                        Admin
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-[#D946EF] shadow-[0_0_8px_#D946EF]" />
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
        <div className="p-4 border-t border-purple-900/50 bg-[#10091F]/90 text-xs">
          <div className="flex items-center justify-between text-[#B8A9D1] mb-1">
            <span className="text-[11px]">Active Cohort:</span>
            <span className="font-mono text-[#F5F3FF] font-semibold">{students.length} Students</span>
          </div>
          <div className="w-full bg-[#2D1452] rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#6D28D9] via-[#A855F7] to-[#D946EF] h-full w-full" />
          </div>
          <p className="text-[10px] text-[#A855F7]/70 mt-2 font-mono flex items-center justify-between">
            <span>Pipeline: Scikit-Learn</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </p>
        </div>
      ) : (
        <div className="p-3 border-t border-purple-900/50 bg-[#10091F] flex justify-center text-[#A855F7]">
          <div className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse shadow-[0_0_8px_#A855F7]" />
        </div>
      )}
    </aside>
  );
};
