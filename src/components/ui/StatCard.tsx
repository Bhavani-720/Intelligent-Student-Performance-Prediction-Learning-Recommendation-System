import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: string;
  sparklineData?: number[];
  badge?: string;
  tooltip?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = '#8B5CF6',
  sparklineData,
  badge,
  tooltip
}) => {
  // Generate SVG path for sparkline if data exists
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 110;
    const height = 28;

    const points = sparklineData.map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

    return (
      <div className="shrink-0 flex flex-col items-end">
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          aria-label="Trend sparkline"
        >
          <defs>
            <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#grad-${title.replace(/\s+/g, '')})`} />
          <path
            d={pathD}
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[9px] font-mono text-[#B8A9D1]/70 mt-0.5">Historical trend</span>
      </div>
    );
  };

  return (
    <div
      title={tooltip}
      className="relative overflow-hidden rounded-2xl border border-purple-800/40 bg-[#21123B]/85 backdrop-blur-xl p-5 shadow-lg shadow-purple-950/40 hover:shadow-2xl hover:shadow-purple-900/30 hover:border-[#A855F7]/60 transition-all duration-300 group"
    >
      {/* Top subtle highlight line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`
        }}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#C4B5FD] break-words line-clamp-1">
              {title}
            </p>
            {badge && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-[#D946EF] border border-[#D946EF]/30 shrink-0">
                {badge}
              </span>
            )}
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#F5F3FF] font-mono">
            {value}
          </div>
        </div>

        <div
          className="p-3 rounded-xl border shrink-0 transition-transform group-hover:scale-105 duration-200 shadow-sm"
          style={{
            borderColor: `${accentColor}50`,
            backgroundColor: `${accentColor}20`,
            color: accentColor
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-purple-900/50 flex items-center justify-between gap-3 text-xs">
        <div className="min-w-0 flex-1">
          {subtitle && (
            <p className="text-[11px] text-[#B8A9D1] line-clamp-2 break-words">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`font-semibold font-mono text-xs ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.value}
              </span>
              <span className="text-[10px] text-[#B8A9D1]/70">vs historical baseline</span>
            </div>
          )}
        </div>

        {renderSparkline()}
      </div>
    </div>
  );
};
