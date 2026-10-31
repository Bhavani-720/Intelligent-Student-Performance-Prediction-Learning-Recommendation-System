import React from 'react';

interface ConfusionMatrixProps {
  tp?: number;
  fp?: number;
  fn?: number;
  tn?: number;
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  tp = 58,
  fp = 4,
  fn = 3,
  tn = 14
}) => {
  const total = tp + fp + fn + tn;
  const accuracy = ((tp + tn) / total) * 100;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-3 gap-2 text-center text-xs w-full max-w-sm mb-2">
        <div />
        <div className="font-semibold text-slate-700 dark:text-slate-300">Pred: Pass</div>
        <div className="font-semibold text-slate-700 dark:text-slate-300">Pred: Risk / Fail</div>

        <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-end pr-2">
          Actual: Pass
        </div>
        <div className="p-4 rounded-xl bg-blue-600 text-white flex flex-col items-center justify-center shadow-sm">
          <span className="text-xl font-bold font-mono">{tp}</span>
          <span className="text-[10px] opacity-80 uppercase tracking-wider">True Pos (TP)</span>
        </div>
        <div className="p-4 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono">{fn}</span>
          <span className="text-[10px] opacity-80 uppercase tracking-wider">False Neg (FN)</span>
        </div>

        <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-end pr-2">
          Actual: Risk
        </div>
        <div className="p-4 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono">{fp}</span>
          <span className="text-[10px] opacity-80 uppercase tracking-wider">False Pos (FP)</span>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/30 text-blue-700 dark:text-blue-300 border border-blue-500/40 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono">{tn}</span>
          <span className="text-[10px] opacity-80 uppercase tracking-wider">True Neg (TN)</span>
        </div>
      </div>

      <div className="w-full max-w-sm pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500 font-mono">
        <span>Total Evaluated: {total}</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Accuracy: {accuracy.toFixed(1)}%</span>
      </div>
    </div>
  );
};
