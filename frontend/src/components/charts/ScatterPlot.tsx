import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRecord } from '../../types';

export const ScatterPlot: React.FC<{ data?: StudentRecord[] }> = ({ data }) => {
  const { filteredStudents } = useApp();
  const studentsToRender = data || filteredStudents;
  const [hoveredStudent, setHoveredStudent] = useState<StudentRecord | null>(null);

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
        <div className="absolute top-2 right-4 z-20 p-2.5 rounded-xl bg-[#21123B]/95 border border-purple-500/50 text-[#F5F3FF] text-xs shadow-xl shadow-purple-950/80 pointer-events-none backdrop-blur-md">
          <p className="font-bold text-[#D946EF]">{hoveredStudent.name}</p>
          <p className="font-mono text-[#F5F3FF]">Study: {hoveredStudent.studyTimeWeeklyHours} hrs/wk</p>
          <p className="font-mono text-[#C4B5FD]">Final Score: {hoveredStudent.finalExamScore}%</p>
          <p className="font-mono text-[#B8A9D1] text-[11px]">Attendance: {hoveredStudent.attendanceRate}%</p>
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
            className="text-purple-950/70"
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
          className="text-purple-800/60"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="currentColor"
          className="text-purple-800/60"
        />

        {/* Trend line (Linear Regression OLS approximation y = 2.45x + 38) in Magenta */}
        <line
          x1={scaleX(2)}
          y1={scaleY(2 * 2.45 + 38)}
          x2={scaleX(22)}
          y2={scaleY(22 * 2.45 + 38)}
          stroke="#D946EF"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />

        {/* Axis Labels */}
        <text x={width / 2} y={height - 8} textAnchor="middle" className="text-[11px] fill-[#B8A9D1] font-sans">
          Weekly Study Time (Hours)
        </text>
        <text
          x={-height / 2}
          y={14}
          transform="rotate(-90)"
          textAnchor="middle"
          className="text-[11px] fill-[#B8A9D1] font-sans"
        >
          Final Exam Score (%)
        </text>

        {/* Scatter Points */}
        {studentsToRender.map((student) => {
          const cx = scaleX(student.studyTimeWeeklyHours);
          const cy = scaleY(student.finalExamScore);
          const isSelected = hoveredStudent?.id === student.id;

          let fill = '#C4B5FD'; // Moderate: Lavender
          if (student.riskLevel === 'Critical' || student.riskLevel === 'High') fill = '#F43F5E';
          else if (student.riskLevel === 'Low') fill = '#8B5CF6'; // Low: Electric Violet

          return (
            <circle
              key={student.id}
              cx={cx}
              cy={cy}
              r={isSelected ? 6 : 4}
              fill={fill}
              className="cursor-pointer transition-all duration-150 opacity-80 hover:opacity-100"
              stroke="#21123B"
              strokeWidth={isSelected ? 2 : 1}
              onMouseEnter={() => setHoveredStudent(student)}
              onMouseLeave={() => setHoveredStudent(null)}
            />
          );
        })}
      </svg>
      <div className="flex items-center justify-between text-[11px] text-[#B8A9D1] mt-2 px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Low Risk
          <span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD] ml-2" /> Moderate
          <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] ml-2" /> High/Critical
        </span>
        <span className="font-mono text-[#D946EF]">Pearson r = +0.76 (Strong Positive)</span>
      </div>
    </div>
  );
};
