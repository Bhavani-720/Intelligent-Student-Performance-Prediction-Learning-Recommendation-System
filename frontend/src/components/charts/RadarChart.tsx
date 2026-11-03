import React from 'react';

interface RadarAxis {
  label: string;
  max: number;
}

const axes: RadarAxis[] = [
  { label: 'Attendance', max: 100 },
  { label: 'Study Hours', max: 20 },
  { label: 'Midterm Avg', max: 100 },
  { label: 'Retention', max: 100 },
  { label: 'Consistency', max: 100 }
];

// Normalized 0 to 1 for 3 clusters
const clusterValues = [
  // Cluster 0: High Achievers
  { name: 'Cluster 0 (Achievers)', vals: [0.94, 0.88, 0.92, 0.95, 0.90], stroke: '#0066FF', fill: '#0066FF22' },
  // Cluster 1: Moderate
  { name: 'Cluster 1 (Moderate)', vals: [0.80, 0.56, 0.72, 0.75, 0.70], stroke: '#38BDF8', fill: '#38BDF822' },
  // Cluster 2: At-Risk
  { name: 'Cluster 2 (At-Risk)', vals: [0.58, 0.28, 0.44, 0.40, 0.35], stroke: '#EF4444', fill: '#EF444422' }
];

export const RadarChart: React.FC = () => {
  const size = 260;
  const center = size / 2;
  const radius = 85;
  const count = axes.length;

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 / count) * index - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs h-auto">
        {/* Concentric rings */}
        {[0.25, 0.5, 0.75, 1.0].map((ring) => {
          const ringPoints = axes.map((_, i) => {
            const { x, y } = getCoordinates(i, ring);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={ring}
              points={ringPoints}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Spokes */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, 1.0);
          const labelCoord = getCoordinates(i, 1.22);
          return (
            <g key={axis.label}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
              />
              <text
                x={labelCoord.x}
                y={labelCoord.y + 3}
                textAnchor="middle"
                className="text-[9px] fill-slate-500 font-sans"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Cluster Polygons */}
        {clusterValues.map((c) => {
          const points = c.vals.map((v, i) => {
            const { x, y } = getCoordinates(i, v);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={c.name}>
              <polygon points={points} fill={c.fill} stroke={c.stroke} strokeWidth="2" />
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-2">
        {clusterValues.map((c) => (
          <div key={c.name} className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.stroke }} />
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
