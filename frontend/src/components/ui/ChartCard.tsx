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
      className={`rounded-2xl border border-purple-800/40 bg-[#21123B]/85 backdrop-blur-xl p-5 shadow-lg shadow-purple-950/40 flex flex-col justify-between hover:border-purple-600/50 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#F5F3FF]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#B8A9D1] mt-0.5">
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
        <div className="mt-4 pt-3 border-t border-purple-900/50 text-xs text-[#C4B5FD]/70 flex items-center justify-between">
          <span>{footnote}</span>
          <span className="text-[#A855F7]/80 font-mono text-[11px]">N=395 students</span>
        </div>
      )}
    </div>
  );
};
