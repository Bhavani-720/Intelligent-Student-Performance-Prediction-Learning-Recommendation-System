import React, { useState } from 'react';
import {
  Network,
  Layers,
  Sparkles,
  Users,
  Compass,
  TrendingDown,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChartCard } from '../components/ui/ChartCard';
import { RadarChart } from '../components/charts/RadarChart';
import { INITIAL_CLUSTERS } from '../data/sampleDataset';

export const ClusteringPage: React.FC = () => {
  const { students } = useApp();
  const [selectedClusterId, setSelectedClusterId] = useState<number>(0);

  // Elbow Curve points: K from 1 to 7
  const elbowData = [
    { k: 1, inertia: 18400 },
    { k: 2, inertia: 9200 },
    { k: 3, inertia: 4100 }, // Elbow point!
    { k: 4, inertia: 3100 },
    { k: 5, inertia: 2400 },
    { k: 6, inertia: 1900 },
    { k: 7, inertia: 1600 }
  ];

  const maxInertia = 20000;
  const width = 360;
  const height = 180;
  const padding = 32;

  const scaleX = (k: number) => padding + ((k - 1) / 6) * (width - 2 * padding);
  const scaleY = (inertia: number) => height - padding - (inertia / maxInertia) * (height - 2 * padding);

  const elbowPath = elbowData.reduce((acc, pt, i) => {
    const x = scaleX(pt.k);
    const y = scaleY(pt.inertia);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const activeCluster = INITIAL_CLUSTERS.find((c) => c.clusterId === selectedClusterId) || INITIAL_CLUSTERS[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-500" />
            Unsupervised Student Clustering (K-Means Algorithm)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Segmenting students into cohesive behavioral archetypes without prior labels based on study habits, attendance, and exam consistency.
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono text-xs">
          K=3 Optimal Clusters · Silhouette = 0.582
        </div>
      </div>

      {/* Two Core Clustering Visuals: Radar Chart & Elbow Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Multi-Dimensional Cluster Centroid Profiles"
          subtitle="Radar comparison across 5 standardized competency vectors"
          footnote="Normalized dimensions: Attendance, Study Hours, Midterms, Retention, Consistency"
        >
          <RadarChart />
        </ChartCard>

        <ChartCard
          title="Elbow Method Curve (Inertia / WCSS vs K)"
          subtitle="Within-Cluster Sum of Squares identifies optimal cluster count at K=3"
          footnote="Sharp decrease in inertia bends at K=3; verified by peak Silhouette Score"
        >
          <div className="w-full flex flex-col items-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm h-auto">
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

              {/* Curve */}
              <path d={elbowPath} fill="none" stroke="#0066FF" strokeWidth="2.5" />

              {/* Points */}
              {elbowData.map((pt) => {
                const cx = scaleX(pt.k);
                const cy = scaleY(pt.inertia);
                const isElbow = pt.k === 3;
                return (
                  <g key={pt.k}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isElbow ? 6 : 4}
                      fill={isElbow ? '#EF4444' : '#0066FF'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={height - padding + 14}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-500 font-mono"
                    >
                      K={pt.k}
                    </text>
                  </g>
                );
              })}

              {/* Elbow Callout */}
              <text
                x={scaleX(3) + 10}
                y={scaleY(4100) - 10}
                className="text-[10px] font-bold fill-red-500 font-mono"
              >
                Optimal K=3 (Elbow)
              </text>
            </svg>

            <div className="w-full max-w-sm pt-2 flex justify-between text-xs text-slate-500 font-mono">
              <span>Metric: WCSS (Inertia)</span>
              <span className="text-blue-500 font-bold">K=3 chosen</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Cluster Persona Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_CLUSTERS.map((cl) => {
          const isSelected = selectedClusterId === cl.clusterId;
          return (
            <div
              key={cl.clusterId}
              onClick={() => setSelectedClusterId(cl.clusterId)}
              className={`rounded-xl border p-5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 ring-2 ring-blue-500/50 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Cluster {cl.clusterId}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white"
                  style={{ backgroundColor: cl.color }}
                >
                  {cl.percentage}% of cohort
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {cl.name}
              </h3>

              <div className="space-y-1.5 py-3 border-y border-slate-100 dark:border-slate-800 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mean Final Exam:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cl.averageGpa}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mean Attendance:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cl.averageAttendance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mean Study:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cl.averageStudyHours} hrs/wk</span>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Dominant Traits:
                </span>
                <ul className="text-[11px] text-slate-500 space-y-0.5">
                  {cl.characteristics.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-blue-500">Action Plan:</span> {cl.recommendedFocus}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
