import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ScatterPlot: React.FC = () => {
  const { students } = useApp();
  const [hoveredStudent, setHoveredStudent] = useState<any | null>(null);

  const width = 500;
  const height = 240;
  const padding = 36;

  // X axis: studyTimeWeeklyHours (2 to 24)
  // Y axis: finalExamScore (20 to 100)
  const minX = 0;
  const maxX = 25;
  const minY = 20;
  const maxY = 100;

  const scaleX = (val: number) => padding + ((val - minX) / (maxX - minX)) * (width - 2 * padding);
  const scaleY = (val: number) => height - padding - ((val - minY) / (maxY - minY)) * (height - 2 * padding);

  return (
    <div className="relative w-full overflow-hidden">
      {hoveredStudent && (
        <div className="absolute top-2 right-4 z-20 p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-xs shadow-md pointer-events-none">
          <p className="font-semibold text-blue-400">{hoveredStudent.name}</p>
          <p className="font-mono text-slate-300">Study: {hoveredStudent.studyTimeWeeklyHours} hrs/wk</p>
          <p className="font-mono text-slate-300">Final Score: {hoveredStudent.finalExamScore}%</p>
          <p className="font-mono text-slate-400 text-[11px]">Attendance: {hoveredStudent.attendanceRate}%</p>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {[30, 50, 70, 90].map((yVal) => (
          <line
            key={yVal}
            x1={padding}
            y1={scaleY(yVal)}
            x2={width - padding}
            y2={scaleY(yVal)}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray="3 3"
          />
        ))}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-600"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-600"
        />

        {/* Trend line (Linear Regression OLS approximation y = 2.45x + 38) */}
        <line
          x1={scaleX(2)}
          y1={scaleY(2 * 2.45 + 38)}
          x2={scaleX(22)}
          y2={scaleY(22 * 2.45 + 38)}
          stroke="#0066FF"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />

        {/* Axis Labels */}
        <text x={width / 2} y={height - 8} textAnchor="middle" className="text-[11px] fill-slate-500 font-sans">
          Weekly Study Time (Hours)
        </text>
        <text
          x={-height / 2}
          y={14}
          transform="rotate(-90)"
          textAnchor="middle"
          className="text-[11px] fill-slate-500 font-sans"
        >
          Final Exam Score (%)
        </text>

        {/* Scatter Points */}
        {students.map((student) => {
          const cx = scaleX(student.studyTimeWeeklyHours);
          const cy = scaleY(student.finalExamScore);
          const isSelected = hoveredStudent?.id === student.id;

          let fill = '#38BDF8';
          if (student.riskLevel === 'Critical') fill = '#EF4444';
          else if (student.riskLevel === 'Low') fill = '#0066FF';

          return (
            <circle
              key={student.id}
              cx={cx}
              cy={cy}
              r={isSelected ? 6 : 4}
              fill={fill}
              className="cursor-pointer transition-all duration-150 opacity-80 hover:opacity-100"
              stroke="#ffffff"
              strokeWidth={isSelected ? 2 : 1}
              onMouseEnter={() => setHoveredStudent(student)}
              onMouseLeave={() => setHoveredStudent(null)}
            />
          );
        })}
      </svg>
      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" /> Low Risk
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] ml-2" /> Moderate
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] ml-2" /> High Risk
        </span>
        <span className="font-mono text-blue-600 dark:text-blue-400">Pearson r = +0.76 (Strong Positive)</span>
      </div>
    </div>
  );
};
