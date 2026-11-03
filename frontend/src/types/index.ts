export type NavigationPage =
  | 'overview'
  | 'dataset'
  | 'eda'
  | 'training'
  | 'evaluation'
  | 'prediction'
  | 'risk'
  | 'clustering'
  | 'xai'
  | 'recommendations'
  | 'records'
  | 'reports'
  | 'testing';

export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  studentId?: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  semester?: string;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface StudentRecord {
  id: string;
  studentId: string;
  name: string;
  gender: 'M' | 'F' | 'Other';
  age: number;
  studyTimeWeeklyHours: number; // e.g. 2 to 25
  attendanceRate: number; // 0 to 100%
  absences: number; // count
  pastFailures: number; // 0 to 4
  midterm1Score: number; // 0 to 100
  midterm2Score: number; // 0 to 100
  finalExamScore: number; // 0 to 100 (target for regression)
  parentalEducation: 'None' | 'Primary' | 'Secondary' | 'Higher';
  familySupport: boolean;
  schoolSupport: boolean;
  extracurricular: boolean;
  internetAccess: boolean;
  travelTimeMinutes: number;
  healthRating: number; // 1 to 5
  sleepHours: number; // 4 to 10
  stressLevel: 'Low' | 'Medium' | 'High';
  riskLevel?: 'Low' | 'Moderate' | 'High' | 'Critical';
  cluster?: number;
  predictedScore?: number | null;
  department?: string;
  course?: string;
  semester?: string;
  school?: string;
  interventionStatus?: 'Pending' | 'In Progress' | 'Completed';
  assignedMentor?: string;
  interventionNotes?: string;
  trackingStatus?: string;
}

export interface CohortFilterState {
  department: string;
  course: string;
  semester: string;
  gender: string;
  school: string;
  riskTier: string;
  minAttendance: number;
}

export interface DatasetSummary {
  rowCount: number;
  columnCount: number;
  filename: string;
  fileSizeKb: number;
  uploadDate: string;
  missingValuesCount: number;
  numericalColumns: string[];
  categoricalColumns: string[];
  targetColumn: string;
  source: string;
  summaryStats: Record<string, {
    mean: number;
    std: number;
    min: number;
    p25: number;
    median: number;
    p75: number;
    max: number;
  }>;
}

export interface MissingValueDetail {
  column: string;
  count: number;
  percentage: number;
}

export interface OutlierDetail {
  column: string;
  q1: number;
  q3: number;
  iqr: number;
  lowerBound: number;
  upperBound: number;
  outlierCount: number;
  outlierValues: number[];
}

export interface DataQualityAudit {
  totalRows: number;
  totalColumns: number;
  duplicateCount: number;
  duplicateStudentIds: string[];
  missingCount: number;
  missingDetails: MissingValueDetail[];
  outlierCount: number;
  outlierDetails: OutlierDetail[];
  isClean: boolean;
  auditTimestamp: string;
}

export interface CleaningLog {
  action: string;
  details: string;
  timestamp: string;
}

export type MLAlgorithmType =
  | 'linear_regression'
  | 'ridge_regression'
  | 'decision_tree'
  | 'random_forest'
  | 'gradient_boosting'
  | 'svr'
  | 'logistic_regression'
  | 'knn';

export interface ModelHyperparameters {
  learningRate?: number;
  nEstimators?: number;
  maxDepth?: number;
  alpha?: number;
  cValue?: number;
  nNeighbors?: number;
  testSplitRatio: number;
  kFolds: number;
  randomSeed: number;
  scalingMethod: 'standard' | 'minmax' | 'robust' | 'none';
}

export interface RegressionMetrics {
  mae: number;
  rmse: number;
  r2: number;
  mse: number;
  cvMeanR2: number;
  cvStdR2: number;
}

export interface ClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix?: { tp: number; fp: number; fn: number; tn: number };
  rocPoints?: number[][];
}

export interface ModelTrainingResult {
  modelId: string;
  name: string;
  algorithm: MLAlgorithmType;
  type: 'regression' | 'classification';
  trainTimestamp: string;
  hyperparameters?: ModelHyperparameters;
  regressionMetrics?: RegressionMetrics;
  classificationMetrics?: ClassificationMetrics;
  featureImportance?: { feature: string; importance: number }[];
  trainingDurationMs?: number;
  isBaseline?: boolean;
}

export interface PredictionPayload {
  studyTimeWeeklyHours: number;
  attendanceRate: number;
  pastFailures: number;
  midterm1Score: number;
  midterm2Score: number;
  parentalEducation: string;
  extracurricular: boolean;
  internetAccess: boolean;
  sleepHours: number;
  stressLevel: string;
  travelTimeMinutes: number;
}

export interface PredictionOutput {
  predictedFinalScore: number;
  confidenceInterval: [number, number];
  predictedGradeLetter: 'A' | 'B' | 'C' | 'D' | 'F';
  passProbability: number;
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Critical';
  topPositiveFactors: { factor: string; impact: string }[];
  topNegativeFactors: { factor: string; impact: string }[];
  modelUsed: string;
}

export interface ClusterInfo {
  clusterId: number;
  name: string;
  count: number;
  percentage: number;
  characteristics: string[];
  averageGpa: number;
  averageAttendance: number;
  averageStudyHours: number;
  recommendedFocus: string;
  color: string;
}

export interface StudentExplanation {
  studentId: string;
  studentName: string;
  actualScore: number;
  predictedScore: number;
  baseValue: number;
  riskStatus: 'Low' | 'Moderate' | 'High' | 'Critical';
  shapValues: {
    feature: string;
    featureValue: string | number;
    contribution: number; // positive or negative
    interpretation: string;
  }[];
  waterfallSummary: string;
}

export interface RecommendationPlan {
  id: string;
  studentId: string;
  studentName: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  summary: string;
  recommendedStudyHours: number;
  interventions: {
    domain: 'Academic' | 'Attendance' | 'Wellbeing' | 'Exam Prep';
    action: string;
    priority: 'Urgent' | 'High' | 'Medium' | 'Routine';
    suggestedResource: string;
  }[];
  weeklyScheduleTip: string;
}

export interface TestSuiteItem {
  id: string;
  category: 'Data Validation' | 'Preprocessing' | 'ML Algorithms' | 'Metrics' | 'Inference & XAI';
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'pending' | 'running';
  executionTimeMs?: number;
  errorMessage?: string;
  assertion: string;
}
