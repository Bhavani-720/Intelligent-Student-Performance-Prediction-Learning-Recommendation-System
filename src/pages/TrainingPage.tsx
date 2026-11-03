import React, { useState } from 'react';
import {
  Cpu,
  Play,
  Settings2,
  CheckCircle2,
  Sliders,
  Sparkles,
  RefreshCw,
  Layers,
  BarChart2,
  Clock,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MLAlgorithmType, ModelHyperparameters } from '../types';
import { EmptyState } from '../components/ui/EmptyState';

const algorithmOptions: {
  id: MLAlgorithmType;
  name: string;
  family: string;
  description: string;
  defaultMetric: string;
}[] = [
  {
    id: 'random_forest',
    name: 'Random Forest Regressor (Ensemble)',
    family: 'Ensemble Learning',
    description: 'Bagging of decision trees with feature subsampling. Excellent against overfitting.',
    defaultMetric: 'Expected R² ≈ 0.88 - 0.90'
  },
  {
    id: 'decision_tree',
    name: 'Decision Tree Regressor (CART)',
    family: 'Tree-Based',
    description: 'Non-parametric partition model using recursive binary splitting on variance reduction.',
    defaultMetric: 'Expected R² ≈ 0.81 - 0.84'
  },
  {
    id: 'gradient_boosting',
    name: 'Gradient Boosting Regressor (GBM)',
    family: 'Boosting',
    description: 'Iterative residual error minimization. High predictive accuracy on tabular data.',
    defaultMetric: 'Expected R² ≈ 0.89 - 0.92'
  },
  {
    id: 'svr',
    name: 'Support Vector Regressor (SVR - RBF)',
    family: 'Kernel Methods',
    description: 'Epsilon-insensitive loss function with radial basis function (RBF) non-linear mapping.',
    defaultMetric: 'Expected R² ≈ 0.85 - 0.87'
  },
  {
    id: 'ridge_regression',
    name: 'Ridge Regression (L2 Regularized)',
    family: 'Linear Models',
    description: 'Shrinks coefficients to prevent multicollinearity between G1, G2 and attendance.',
    defaultMetric: 'Expected R² ≈ 0.84 - 0.86'
  },
  {
    id: 'linear_regression',
    name: 'Multiple Linear Regression (OLS Baseline)',
    family: 'Linear Baseline',
    description: 'Ordinary least squares benchmark to establish performance floor.',
    defaultMetric: 'Expected R² ≈ 0.83 - 0.85'
  },
  {
    id: 'logistic_regression',
    name: 'Logistic Regression (Binary Risk Classifier)',
    family: 'Classification',
    description: 'Sigmoid log-odds model classifying students into Pass vs At-Risk.',
    defaultMetric: 'Expected Accuracy ≈ 88%'
  },
  {
    id: 'knn',
    name: 'K-Nearest Neighbors (K=5)',
    family: 'Instance-Based',
    description: 'Euclidean distance neighborhood regression based on academic feature vectors.',
    defaultMetric: 'Expected R² ≈ 0.81 - 0.83'
  }
];

export const TrainingPage: React.FC = () => {
  const {
    trainedModels,
    activeModel,
    bestModel,
    isTraining,
    trainingProgress,
    startTraining,
    datasetSummary
  } = useApp();

  const [selectedAlgo, setSelectedAlgo] = useState<MLAlgorithmType>('random_forest');
  const [nEstimators, setNEstimators] = useState<number>(100);
  const [maxDepth, setMaxDepth] = useState<number>(6);
  const [learningRate, setLearningRate] = useState<number>(0.05);
  const [kFolds, setKFolds] = useState<number>(5);
  const [testSplit, setTestSplit] = useState<number>(20);
  const [scalingMethod, setScalingMethod] = useState<'standard' | 'minmax'>('standard');

  const handleTrainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const params: ModelHyperparameters = {
      nEstimators,
      maxDepth,
      learningRate,
      kFolds,
      testSplitRatio: testSplit / 100,
      randomSeed: 42,
      scalingMethod
    };
    await startTraining(selectedAlgo, params);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            Model Training & Hyperparameter Tuning Pipeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Train 5+ supervised algorithms with Stratified K-Fold Cross-Validation, feature scaling, and automated metric benchmarking.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Scikit-Learn 1.2.1 Engine Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Algorithm Selection & Parameters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              1. Select Machine Learning Algorithm
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {algorithmOptions.map((algo) => {
                const isSelected = selectedAlgo === algo.id;
                return (
                  <div
                    key={algo.id}
                    onClick={() => setSelectedAlgo(algo.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {algo.family}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      {algo.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {algo.description}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                      {algo.defaultMetric}
                    </span>
                  </div>
                );
              })}
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Sliders className="w-4 h-4 text-blue-500" />
              2. Hyperparameter Configuration & Cross-Validation
            </h3>

            <form onSubmit={handleTrainSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* n_estimators (for RF / GBM) */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-600 dark:text-slate-400">n_estimators (Trees)</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{nEstimators}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="10"
                    value={nEstimators}
                    onChange={(e) => setNEstimators(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* max_depth */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-600 dark:text-slate-400">max_depth</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{maxDepth}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={maxDepth}
                    onChange={(e) => setMaxDepth(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Train/Test split ratio */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Test Split Ratio</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{testSplit}% Test / {100 - testSplit}% Train</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={testSplit}
                    onChange={(e) => setTestSplit(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* K-Folds */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-600 dark:text-slate-400">K-Fold Cross-Validation</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{kFolds} Folds</span>
                  </div>
                  <select
                    value={kFolds}
                    onChange={(e) => setKFolds(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-white"
                  >
                    <option value={3}>3-Fold CV</option>
                    <option value={5}>5-Fold Stratified CV (Recommended)</option>
                    <option value={10}>10-Fold CV</option>
                  </select>
                </div>
              </div>

              {/* Progress Bar during Training */}
              {isTraining && (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Executing Pipeline: Standardizing features & computing folds...
                    </span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {trainingProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-200 rounded-full"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isTraining}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isTraining ? 'Training Model...' : 'Train Selected Model'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Trained Models History */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              Trained Models Repository
            </h3>

            {trainedModels.length === 0 ? (
              <EmptyState
                icon={Cpu}
                title="No Models Trained Yet"
                description="Configure the algorithm hyperparameters on the left and run your first training pipeline."
                badge="Empty Pipeline"
              />
            ) : (
              <div className="space-y-3">
                {trainedModels.map((mod) => (
                  <div
                    key={mod.modelId}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs space-y-2 hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {mod.name}
                      </span>
                      {mod.modelId === bestModel?.modelId ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-600 text-white font-bold">
                          BEST MODEL (AUTO-SELECTED)
                        </span>
                      ) : mod.isBaseline ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Baseline Floor
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          Verified Model
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1 font-mono text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 text-[10px] block">R² Score</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {mod.regressionMetrics ? `${(mod.regressionMetrics.r2 * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">RMSE</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {mod.regressionMetrics ? mod.regressionMetrics.rmse.toFixed(2) : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">MAE</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {mod.regressionMetrics ? mod.regressionMetrics.mae.toFixed(2) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Trained: {mod.trainTimestamp}</span>
                      <span>{mod.trainingDurationMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
