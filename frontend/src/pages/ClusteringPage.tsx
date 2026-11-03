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
      <div className="p-6 rounded-2xl border border-purple-800/40 bg-gradient-to-r from-[#190D30] via-[#21123B] to-[#2D1452] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-base font-bold text-[#F5F3FF] flex items-center gap-2">
            <Network className="w-4 h-4 text-[#8B5CF6]" />
            Unsupervised Student Clustering (K-Means Algorithm)
          </h2>
          <p className="text-xs text-[#B8A9D1] mt-1">
            Segmenting students into cohesive behavioral archetypes without prior labels based on study habits, attendance, and exam consistency.
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C4B5FD] font-mono text-xs">
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
                className="text-purple-800"
              />
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={height - padding}
                stroke="currentColor"
                className="text-purple-800"
              />

              {/* Curve */}
              <path d={elbowPath} fill="none" stroke="#8B5CF6" strokeWidth="2.5" />

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
                      fill={isElbow ? '#D946EF' : '#8B5CF6'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={height - padding + 14}
                      textAnchor="middle"
                      className="text-[10px] fill-[#B8A9D1] font-mono"
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
                className="text-[10px] font-bold fill-[#D946EF] font-mono"
              >
                Optimal K=3 (Elbow)
              </text>
            </svg>

            <div className="w-full max-w-sm pt-2 flex justify-between text-xs text-[#B8A9D1] font-mono">
              <span>Metric: WCSS (Inertia)</span>
              <span className="text-[#8B5CF6] font-bold">K=3 chosen</span>
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
              className={`rounded-2xl border p-6 cursor-pointer transition-all backdrop-blur-xl ${
                isSelected
                  ? 'border-[#8B5CF6] bg-[#21123B] ring-2 ring-[#8B5CF6]/50 shadow-xl shadow-purple-950/50'
                  : 'border-purple-800/40 bg-[#21123B]/80 hover:border-purple-600/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B5FD]">
                  Cluster {cl.clusterId}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow-sm"
                  style={{ backgroundColor: cl.color }}
                >
                  {cl.percentage}% of cohort
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#F5F3FF] mb-2">
                {cl.name}
              </h3>

              <div className="space-y-1.5 py-3 border-y border-purple-800/30 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#B8A9D1]">Mean Final Exam:</span>
                  <span className="font-bold text-[#F5F3FF]">{cl.averageGpa}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B8A9D1]">Mean Attendance:</span>
                  <span className="font-bold text-[#F5F3FF]">{cl.averageAttendance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B8A9D1]">Mean Study:</span>
                  <span className="font-bold text-[#F5F3FF]">{cl.averageStudyHours} hrs/wk</span>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <span className="text-[11px] font-semibold text-[#C4B5FD]">
                  Dominant Traits:
                </span>
                <ul className="text-[11px] text-[#B8A9D1] space-y-0.5">
                  {cl.characteristics.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 pt-3 border-t border-purple-800/30 text-[11px] text-[#B8A9D1]">
                <span className="font-semibold text-[#8B5CF6]">Action Plan:</span> {cl.recommendedFocus}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
