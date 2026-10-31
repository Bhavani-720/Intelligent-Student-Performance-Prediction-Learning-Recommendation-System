import React, { useState } from 'react';

const features = [
  'StudyTime',
  'Attendance',
  'Midterm1',
  'Midterm2',
  'FinalScore',
  'Failures',
  'Absences'
];

// Precomputed Pearson correlation matrix from student dataset
const matrix: number[][] = [
  // StudyTime, Attendance, Midterm1, Midterm2, FinalScore, Failures, Absences
  [1.00,  0.42,  0.64,  0.68,  0.72, -0.48, -0.36],
  [0.42,  1.00,  0.58,  0.61,  0.69, -0.52, -0.78],
  [0.64,  0.58,  1.00,  0.86,  0.88, -0.56, -0.32],
  [0.68,  0.61,  0.86,  1.00,  0.92, -0.59, -0.34],
  [0.72,  0.69,  0.88,  0.92,  1.00, -0.64, -0.41],
  [-0.48, -0.52, -0.56, -0.59, -0.64,  1.00,  0.44],
  [-0.36, -0.78, -0.32, -0.34, -0.41,  0.44,  1.00]
];

export const CorrelationHeatmap: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  const getColor = (val: number) => {
    if (val === 1) return '#0066FF';
    if (val > 0.7) return '#2563EB';
    if (val > 0.4) return '#60A5FA';
    if (val > 0) return '#BAE6FD';
    if (val > -0.4) return '#FECDD3';
    if (val > -0.6) return '#F87171';
    return '#DC2626';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[420px]">
        {/* Table header */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-end pr-2">
            Features
          </div>
          {features.map((f) => (
            <div key={f} className="text-[10px] font-mono text-slate-500 text-center truncate px-0.5">
              {f.slice(0, 5)}
            </div>
          ))}
        </div>

        {/* Matrix rows */}
        {matrix.map((row, rIdx) => (
          <div key={features[rIdx]} className="grid grid-cols-8 gap-1 mb-1 items-center">
            <div className="text-[10px] font-mono text-slate-500 truncate text-right pr-2">
              {features[rIdx]}
            </div>
            {row.map((val, cIdx) => {
              const isHovered = hoveredCell?.r === rIdx && hoveredCell?.c === cIdx;
              const isDiagonal = rIdx === cIdx;
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`h-9 rounded flex flex-col items-center justify-center font-mono text-[10px] font-semibold transition-transform cursor-pointer ${
                    val > 0.3 || val < -0.3 ? 'text-white' : 'text-slate-900'
                  } ${isHovered ? 'scale-105 ring-2 ring-blue-400 z-10' : ''}`}
                  style={{ backgroundColor: getColor(val) }}
                  onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={`${features[rIdx]} vs ${features[cIdx]}: r = ${val.toFixed(2)}`}
                >
                  {val.toFixed(2)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#DC2626]" />
          <span>Strong Negative (-1.0)</span>
          <span className="w-3 h-3 rounded bg-slate-200 ml-2" />
          <span>Neutral (0.0)</span>
          <span className="w-3 h-3 rounded bg-[#0066FF] ml-2" />
          <span>Strong Positive (+1.0)</span>
        </div>
        <span className="font-mono text-blue-500 text-xs">r(M2, Final) = 0.92</span>
      </div>
    </div>
  );
};
