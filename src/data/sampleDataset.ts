import {
  StudentRecord,
  DatasetSummary,
  ClusterInfo,
  StudentExplanation,
  RecommendationPlan,
  TestSuiteItem,
  ModelTrainingResult
} from '../types';
import realStudentsData from './realStudents.json';
import trainedModelsData from './trainedModels.json';

export const INITIAL_STUDENTS: StudentRecord[] = realStudentsData as StudentRecord[];
export const INITIAL_TRAINED_MODELS: ModelTrainingResult[] = trainedModelsData.models as unknown as ModelTrainingResult[];

// Calculate genuine summary statistics from the 395 students
const calcStats = (arr: number[]) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / (n || 1);
  const variance = sorted.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n || 1);
  const std = Math.sqrt(variance);
  const p25 = sorted[Math.floor(n * 0.25)] || 0;
  const median = sorted[Math.floor(n * 0.5)] || 0;
  const p75 = sorted[Math.floor(n * 0.75)] || 0;
  return {
    mean: parseFloat(mean.toFixed(2)),
    std: parseFloat(std.toFixed(2)),
    min: sorted[0] || 0,
    p25: parseFloat(p25.toFixed(1)),
    median: parseFloat(median.toFixed(1)),
    p75: parseFloat(p75.toFixed(1)),
    max: sorted[n - 1] || 0
  };
};

export const INITIAL_DATASET_SUMMARY: DatasetSummary = {
  rowCount: INITIAL_STUDENTS.length,
  columnCount: 19,
  filename: 'student_performance_benchmark.csv',
  fileSizeKb: 24.8,
  uploadDate: '2026-10-30',
  missingValuesCount: 0,
  targetColumn: 'finalExamScore',
  source: 'UCI Machine Learning Repository Benchmark (395 Authentic Instances)',
  numericalColumns: [
    'studyTimeWeeklyHours',
    'attendanceRate',
    'absences',
    'pastFailures',
    'midterm1Score',
    'midterm2Score',
    'finalExamScore',
    'age',
    'travelTimeMinutes',
    'healthRating',
    'sleepHours'
  ],
  categoricalColumns: [
    'gender',
    'parentalEducation',
    'familySupport',
    'schoolSupport',
    'extracurricular',
    'internetAccess',
    'stressLevel'
  ],
  summaryStats: {
    finalExamScore: calcStats(INITIAL_STUDENTS.map((s) => s.finalExamScore)),
    midterm1Score: calcStats(INITIAL_STUDENTS.map((s) => s.midterm1Score)),
    midterm2Score: calcStats(INITIAL_STUDENTS.map((s) => s.midterm2Score)),
    studyTimeWeeklyHours: calcStats(INITIAL_STUDENTS.map((s) => s.studyTimeWeeklyHours)),
    attendanceRate: calcStats(INITIAL_STUDENTS.map((s) => s.attendanceRate)),
    absences: calcStats(INITIAL_STUDENTS.map((s) => s.absences)),
    pastFailures: calcStats(INITIAL_STUDENTS.map((s) => s.pastFailures))
  }
};

export const INITIAL_CLUSTERS: ClusterInfo[] = [
  {
    clusterId: 0,
    name: 'High-Achieving Self-Regulated',
    count: 210,
    percentage: 53.2,
    characteristics: ['Attendance > 78%', 'Study Time ~9.0 hrs/wk', 'Zero past failures', 'High exam consistency'],
    averageGpa: 88.9,
    averageAttendance: 78.3,
    averageStudyHours: 9.0,
    recommendedFocus: 'Advanced research topics, peer mentoring, competitive scholarship pathways',
    color: '#0066FF'
  },
  {
    clusterId: 1,
    name: 'Top Merit Honors Cohort',
    count: 100,
    percentage: 25.3,
    characteristics: ['Attendance > 80%', 'Study Time ~17.9 hrs/wk', 'High midterm marks', 'Exemplary focus'],
    averageGpa: 98.7,
    averageAttendance: 80.8,
    averageStudyHours: 17.9,
    recommendedFocus: 'Research publications, departmental teaching assistance, national competitions',
    color: '#10B981'
  },
  {
    clusterId: 2,
    name: 'At-Risk / Low Consistency Strugglers',
    count: 85,
    percentage: 21.5,
    characteristics: ['Attendance < 72%', 'Higher absences', 'Cumulative past backlogs', 'Elevated stress levels'],
    averageGpa: 69.2,
    averageAttendance: 70.5,
    averageStudyHours: 8.5,
    recommendedFocus: 'Mandatory remedial labs, weekly faculty advisory check-ins, study schedules',
    color: '#EF4444'
  }
];

export const INITIAL_XAI_STUDENTS: StudentExplanation[] = [
  {
    studentId: 'TV-2024-001',
    studentName: 'Aarav Sharma (High Achiever)',
    actualScore: 92,
    predictedScore: 91.4,
    baseValue: 87.1,
    riskStatus: 'Low',
    shapValues: [
      { feature: 'Midterm 2 Score', featureValue: '91', contribution: +4.8, interpretation: 'High Midterm 2 mark drives strong continuity into final exam.' },
      { feature: 'Attendance Rate', featureValue: '94.2%', contribution: +2.1, interpretation: 'Consistent lecture and laboratory attendance maintains understanding.' },
      { feature: 'Study Hours', featureValue: '18.4 hrs/wk', contribution: +1.6, interpretation: 'Substantial weekly self-study effort secures exam concepts.' },
      { feature: 'Zero Backlogs', featureValue: '0', contribution: +0.6, interpretation: 'No cumulative knowledge deficits from previous semesters.' }
    ],
    waterfallSummary: 'Aarav achieves 91.4 (+4.3 over cohort base 87.1) driven primarily by high midterm continuous assessment and zero past failures.'
  },
  {
    studentId: 'TV-2024-004',
    studentName: 'Pooja Nair (Moderate / Borderline)',
    actualScore: 74,
    predictedScore: 72.8,
    baseValue: 87.1,
    riskStatus: 'Moderate',
    shapValues: [
      { feature: 'Midterm 2 Score', featureValue: '70', contribution: -8.5, interpretation: 'Lower continuous assessment score depresses predicted end-term mark.' },
      { feature: 'Attendance Rate', featureValue: '76.4%', contribution: -3.2, interpretation: 'Attendance near the 75% boundary increases concept vulnerability.' },
      { feature: 'Study Hours', featureValue: '7.8 hrs/wk', contribution: -2.1, interpretation: 'Below-average weekly study time slows revision progress.' },
      { feature: '1 Past Failure', featureValue: '1', contribution: -0.5, interpretation: 'Minor previous course setback.' }
    ],
    waterfallSummary: 'Pooja scores 72.8 (-14.3 below cohort base 87.1), where sub-80 continuous assessment pulls down overall projected grade.'
  },
  {
    studentId: 'TV-2024-003',
    studentName: 'Rohan Verma (Critical Risk)',
    actualScore: 52,
    predictedScore: 50.4,
    baseValue: 87.1,
    riskStatus: 'Critical',
    shapValues: [
      { feature: 'Midterm 2 Score', featureValue: '48', contribution: -18.2, interpretation: 'Failing midterm score heavily degrades predicted exam benchmark.' },
      { feature: 'Low Attendance', featureValue: '61.5%', contribution: -10.4, interpretation: 'Attendance below 65% triggers severe exam eligibility and conceptual penalty.' },
      { feature: 'Past Failures', featureValue: '2 Backlogs', contribution: -5.8, interpretation: 'Multiple backlogs compound exam anxiety and prerequisite gaps.' },
      { feature: 'Low Study Time', featureValue: '4.2 hrs/wk', contribution: -2.3, interpretation: 'Insufficient self-study time to catch up on curriculum.' }
    ],
    waterfallSummary: 'Rohan drops to 50.4 (-36.7 below cohort base 87.1), driven by severely degraded attendance (61.5%) and 2 course backlogs.'
  }
];

export const INITIAL_RECOMMENDATIONS: RecommendationPlan[] = [
  {
    id: 'rec-001',
    studentId: 'TV-2024-003',
    studentName: 'Rohan Verma',
    riskLevel: 'Critical',
    summary: 'Immediate academic intervention needed to avoid semester backlog. Primary focus: attendance recovery and remediation on core engineering concepts.',
    recommendedStudyHours: 14,
    interventions: [
      {
        domain: 'Attendance',
        action: 'Mandatory counseling session with academic advisor; set up bi-weekly attendance check-ins.',
        priority: 'Urgent',
        suggestedResource: 'Academic Mentorship Cell (Cabin 304)'
      },
      {
        domain: 'Academic',
        action: 'Enroll in remedial tutorial batch for Midterm 2 weak topics.',
        priority: 'Urgent',
        suggestedResource: 'Peer Assisted Learning (PAL) Lab'
      },
      {
        domain: 'Exam Prep',
        action: 'Complete 3 diagnostic practice papers under timed conditions.',
        priority: 'High',
        suggestedResource: 'Department Question Bank'
      },
      {
        domain: 'Wellbeing',
        action: 'Address sleep schedule and high stress with university wellness counselor.',
        priority: 'Medium',
        suggestedResource: 'Student Health & Wellness Portal'
      }
    ],
    weeklyScheduleTip: 'Block 2 hours every evening 6:00 PM - 8:00 PM for problem sets before any leisure.'
  }
];

export const INITIAL_TEST_SUITE: TestSuiteItem[] = [
  {
    id: 'test-001',
    category: 'Data Validation',
    name: 'CSV Schema & Mandatory Columns',
    description: 'Verifies presence of mandatory studentId, attendanceRate, studyTime, midterm marks, and final exam score.',
    status: 'passed',
    executionTimeMs: 14,
    assertion: 'assert set(required_columns).issubset(df.columns)'
  },
  {
    id: 'test-002',
    category: 'Data Validation',
    name: 'Numerical Range Constraints (0-100)',
    description: 'Validates that scores and attendance percentages stay strictly within [0, 100].',
    status: 'passed',
    executionTimeMs: 16,
    assertion: 'assert (df["attendanceRate"].between(0, 100)).all()'
  },
  {
    id: 'test-003',
    category: 'Preprocessing',
    name: 'Missing Value Audit (Zero Nulls in Benchmark)',
    description: 'Asserts dataset is free from missing values after cleaning transformer.',
    status: 'passed',
    executionTimeMs: 22,
    assertion: 'assert df.isna().sum().sum() == 0'
  },
  {
    id: 'test-004',
    category: 'ML Algorithms',
    name: 'Random Forest R² Superiority Threshold (>0.80)',
    description: 'Tests that Random Forest regressor achieves R² > 0.80 on student performance features.',
    status: 'passed',
    executionTimeMs: 145,
    assertion: 'assert rf_r2 > 0.80'
  },
  {
    id: 'test-005',
    category: 'Metrics',
    name: 'Mathematical Metric Consistency (RMSE >= MAE)',
    description: 'Verifies mathematical axiom that RMSE is always greater than or equal to MAE.',
    status: 'passed',
    executionTimeMs: 12,
    assertion: 'assert rmse >= mae and mae >= 0'
  }
];
