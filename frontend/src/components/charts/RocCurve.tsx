import React from 'react';

export const RocCurve: React.FC<{ auc?: number; points?: number[][] }> = ({
  auc = 0.955,
  points = [
    [0.0, 0.0],
    [0.0, 0.6753],
    [0.0, 0.7403],
    [0.0, 0.8442],
    [0.0, 0.9091],
    [0.5, 0.9091],
    [0.5, 1.0],
    [1.0, 1.0]
  ]
}) => {
  const width = 300;
  const height = 220;
  const padding = 32;

  const validPoints = points && points.length > 1 ? points : [[0, 0], [0.1, 0.9], [1, 1]];

  const scaleX = (val: number) => padding + val * (width - 2 * padding);
  const scaleY = (val: number) => height - padding - val * (height - 2 * padding);

  const pathD = validPoints.reduce((acc, [fpr, tpr], i) => {
    const x = scaleX(fpr);
    const y = scaleY(tpr);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${scaleX(1.0)} ${scaleY(0.0)} L ${scaleX(0.0)} ${scaleY(0.0)} Z`;

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-xs h-auto">
        {/* Shaded Area under Curve */}
        <path d={areaD} fill="#0066FF" fillOpacity="0.12" />

        {/* Diagonal Random Guess Baseline */}
        <line
          x1={scaleX(0)}
          y1={scaleY(0)}
          x2={scaleX(1)}
          y2={scaleY(1)}
          stroke="currentColor"
          className="text-slate-300 dark:text-slate-700"
          strokeDasharray="4 4"
        />

        {/* ROC Curve */}
        <path d={pathD} fill="none" stroke="#0066FF" strokeWidth="2.5" />

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

        {/* Ticks and labels */}
        <text x={width / 2} y={height - 6} textAnchor="middle" className="text-[10px] fill-slate-500 font-sans">
          False Positive Rate (1 - Specificity)
        </text>
        <text
          x={-height / 2}
          y={12}
          transform="rotate(-90)"
          textAnchor="middle"
          className="text-[10px] fill-slate-500 font-sans"
        >
          True Positive Rate (Sensitivity)
        </text>
      </svg>
      <div className="w-full max-w-xs pt-2 flex justify-between text-xs text-slate-500 font-mono">
        <span>Classifier: Random Forest</span>
        <span className="text-blue-600 dark:text-blue-400 font-bold">AUC-ROC = {auc.toFixed(3)}</span>
      </div>
    </div>
  );
};
