import React, { ReactNode } from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  footnote?: string;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  action,
  footnote,
  className = ''
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0F172A]/90 p-5 shadow-sm flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action}
        </div>
      </div>

      <div className="w-full flex-1 overflow-x-auto">
        {children}
      </div>

      {footnote && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
          <span>{footnote}</span>
          <span className="text-slate-400 font-mono text-[11px]">N=395 students</span>
        </div>
      )}
    </div>
  );
};
