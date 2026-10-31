import React, { useState } from 'react';

export interface BinData {
  range: string;
  count: number;
  label: string;
}

interface DistributionHistogramProps {
  data?: BinData[];
  mean?: number;
  std?: number;
  accentColor?: string;
}

const defaultBins: BinData[] = [
  { range: '20-30', count: 2, label: 'F (Critical)' },
  { range: '31-40', count: 4, label: 'F' },
  { range: '41-50', count: 12, label: 'D (At-Risk)' },
  { range: '51-60', count: 24, label: 'C (Average)' },
  { range: '61-70', count: 45, label: 'B (Good)' },
  { range: '71-80', count: 88, label: 'B+' },
  { range: '81-90', count: 135, label: 'A (Merit)' },
  { range: '91-100', count: 85, label: 'A+ (Honors)' }
];

export const DistributionHistogram: React.FC<DistributionHistogramProps> = ({
  data = defaultBins,
  mean = 87.1,
  std = 14.2,
  accentColor = '#0066FF'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const totalStudents = data.reduce((acc, b) => acc + b.count, 0);
  const height = 180;

  return (
    <div className="w-full">
      <div className="h-48 flex items-end gap-2 pt-6 pb-2 px-1">
        {data.map((bin, idx) => {
          const barHeight = (bin.count / maxCount) * height;
          const isHovered = hoveredIdx === idx;
          const pct = totalStudents > 0 ? ((bin.count / totalStudents) * 100).toFixed(1) : '0';
          return (
            <div
              key={bin.range}
              className="flex-1 flex flex-col items-center group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 z-20 px-2 py-1 rounded bg-slate-900 text-white text-[11px] font-mono shadow whitespace-nowrap">
                  {bin.range}: {bin.count} students ({pct}%) · {bin.label}
                </div>
              )}

              {/* Bar */}
              <div
                className="w-full rounded-t transition-all duration-200"
                style={{
                  height: `${Math.max(barHeight, 4)}px`,
                  backgroundColor: isHovered ? '#38BDF8' : accentColor,
                  opacity: hoveredIdx !== null && !isHovered ? 0.6 : 1
                }}
              />

              {/* X Axis Label */}
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono truncate w-full text-center">
                {bin.range}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center text-xs text-slate-400 mt-1 px-1 font-mono">
        <span>Lower Score Quartiles</span>
        <span className="text-blue-500 font-semibold">
          Mean: {mean.toFixed(1)}% | Std: {std.toFixed(1)}
        </span>
        <span>Upper Honors Quartiles</span>
      </div>
    </div>
  );
};
