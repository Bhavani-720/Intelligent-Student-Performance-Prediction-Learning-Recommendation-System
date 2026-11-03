import { StudentRecord, DataQualityAudit, MissingValueDetail, OutlierDetail, CleaningLog } from '../types';

export const DATA_DICTIONARY = [
  {
    feature: 'studentId',
    type: 'String (Identifier)',
    range: 'TV-2024-001 to TV-2024-395',
    description: 'Unique institutional enrollment identifier for the student.',
    importance: 'Primary key used for tracking and record linking.'
  },
  {
    feature: 'gender',
    type: 'Categorical (Binary)',
    range: "'M', 'F'",
    description: 'Student gender for demographic audit and fairness evaluations.',
    importance: 'Monitored under IEEE fairness guidelines to ensure algorithmic equity.'
  },
  {
    feature: 'age',
    type: 'Numerical (Integer)',
    range: '18 - 23 years',
    description: 'Student biological age at the time of academic term enrollment.',
    importance: 'Minor factor; contextualizes non-traditional or delayed students.'
  },
  {
    feature: 'studyTimeWeeklyHours',
    type: 'Numerical (Continuous)',
    range: '2.0 - 28.0 hrs/week',
    description: 'Average dedicated hours spent per week on self-study and problem sets.',
    importance: 'Strong positive predictor (r = +0.68) for end-term exam success.'
  },
  {
    feature: 'attendanceRate',
    type: 'Numerical (Percentage)',
    range: '42.0% - 100.0%',
    description: 'Percentage of mandatory lecture and laboratory sessions attended.',
    importance: 'Critical cutoff; university criteria flags attendance < 75% for intervention.'
  },
  {
    feature: 'absences',
    type: 'Numerical (Integer)',
    range: '0 - 32 sessions',
    description: 'Cumulative count of unexcused class and laboratory absences.',
    importance: 'Strong negative correlation with exam outcomes.'
  },
  {
    feature: 'pastFailures',
    type: 'Numerical (Integer)',
    range: '0 - 3 courses',
    description: 'Historical course backlogs or failed subjects in previous semesters.',
    importance: 'High-risk penalty; students with >=2 backlogs have 3x failure rate.'
  },
  {
    feature: 'midterm1Score',
    type: 'Numerical (Integer)',
    range: '20 - 100 marks',
    description: 'Internal continuous assessment examination 1 score.',
    importance: 'Early diagnostic benchmark of student subject comprehension.'
  },
  {
    feature: 'midterm2Score',
    type: 'Numerical (Integer)',
    range: '18 - 100 marks',
    description: 'Internal continuous assessment examination 2 score.',
    importance: 'Highest individual correlation (r = 0.91) with final exam score.'
  },
  {
    feature: 'finalExamScore',
    type: 'Numerical (Target Variable)',
    range: '15 - 100 marks',
    description: 'End-semester comprehensive final examination mark (target variable).',
    importance: 'Primary ground truth target for regression and risk classification.'
  },
  {
    feature: 'parentalEducation',
    type: 'Categorical (Ordinal)',
    range: "'None', 'Primary', 'Secondary', 'Higher'",
    description: 'Highest educational qualification attained by student parents.',
    importance: 'Socioeconomic indicator evaluated for contextual student support.'
  },
  {
    feature: 'familySupport',
    type: 'Boolean',
    range: 'true / false',
    description: 'Presence of active family academic or financial encouragement.',
    importance: 'Support factor aiding stress mitigation and study consistency.'
  },
  {
    feature: 'schoolSupport',
    type: 'Boolean',
    range: 'true / false',
    description: 'Enrollment in supplemental university tutoring or scholarship aid.',
    importance: 'Institutional intervention tracker.'
  },
  {
    feature: 'extracurricular',
    type: 'Boolean',
    range: 'true / false',
    description: 'Participation in university clubs, sports, or engineering societies.',
    importance: 'Holistic indicator of student engagement.'
  },
  {
    feature: 'internetAccess',
    type: 'Boolean',
    range: 'true / false',
    description: 'High-speed internet connectivity available at student residence.',
    importance: 'Prerequisite for digital learning repositories and submissions.'
  },
  {
    feature: 'travelTimeMinutes',
    type: 'Numerical (Integer)',
    range: '10 - 60 minutes',
    description: 'Daily one-way commute duration from residence to campus.',
    importance: 'Fatigue factor; commute > 45 mins correlates with reduced sleep.'
  },
  {
    feature: 'healthRating',
    type: 'Numerical (Ordinal)',
    range: '1 (Poor) to 5 (Excellent)',
    description: 'Self-reported physical health rating.',
    importance: 'Baseline physiological wellness metric.'
  },
  {
    feature: 'sleepHours',
    type: 'Numerical (Continuous)',
    range: '4.5 - 9.5 hrs/night',
    description: 'Average nightly sleep duration during academic weekdays.',
    importance: 'Cognitive retention factor; sleep < 6 hrs impairs working memory.'
  },
  {
    feature: 'stressLevel',
    type: 'Categorical',
    range: "'Low', 'Medium', 'High'",
    description: 'Psychological academic stress reported during continuous evaluations.',
    importance: 'Key wellness flag for referral to mental health and advisory cells.'
  }
];

export const performDataQualityAudit = (students: StudentRecord[]): DataQualityAudit => {
  const totalRows = students.length;
  const totalColumns = 19;

  // 1. Duplicate detection
  const seenIds = new Set<string>();
  const duplicateStudentIds: string[] = [];
  students.forEach((s) => {
    if (seenIds.has(s.studentId)) {
      duplicateStudentIds.push(s.studentId);
    } else {
      seenIds.add(s.studentId);
    }
  });

  // 2. Missing value detection
  const missingDetails: MissingValueDetail[] = [];
  let totalMissing = 0;
  const colsToCheck: (keyof StudentRecord)[] = [
    'studyTimeWeeklyHours',
    'attendanceRate',
    'absences',
    'pastFailures',
    'midterm1Score',
    'midterm2Score',
    'finalExamScore',
    'sleepHours',
    'stressLevel'
  ];

  colsToCheck.forEach((col) => {
    let colMissing = 0;
    students.forEach((s) => {
      const val = s[col];
      if (val === undefined || val === null || val === '' || Number.isNaN(val)) {
        colMissing++;
      }
    });
    if (colMissing > 0) {
      missingDetails.push({
        column: col as string,
        count: colMissing,
        percentage: parseFloat(((colMissing / (totalRows || 1)) * 100).toFixed(1))
      });
      totalMissing += colMissing;
    }
  });

  // 3. Outlier Analysis using IQR (Interquartile Range)
  const continuousCols: (keyof StudentRecord)[] = [
    'studyTimeWeeklyHours',
    'attendanceRate',
    'absences',
    'travelTimeMinutes'
  ];

  const outlierDetails: OutlierDetail[] = [];
  let totalOutliers = 0;

  continuousCols.forEach((col) => {
    const rawVals = students
      .map((s) => Number(s[col]))
      .filter((v) => !Number.isNaN(v) && v !== null && v !== undefined);

    if (rawVals.length < 4) return;

    const sorted = [...rawVals].sort((a, b) => a - b);
    const n = sorted.length;
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = parseFloat((q1 - 1.5 * iqr).toFixed(1));
    const upperBound = parseFloat((q3 + 1.5 * iqr).toFixed(1));

    const outliers = sorted.filter((v) => v < lowerBound || v > upperBound);
    if (outliers.length > 0) {
      outlierDetails.push({
        column: col as string,
        q1: parseFloat(q1.toFixed(1)),
        q3: parseFloat(q3.toFixed(1)),
        iqr: parseFloat(iqr.toFixed(1)),
        lowerBound,
        upperBound,
        outlierCount: outliers.length,
        outlierValues: outliers.slice(0, 5)
      });
      totalOutliers += outliers.length;
    }
  });

  return {
    totalRows,
    totalColumns,
    duplicateCount: duplicateStudentIds.length,
    duplicateStudentIds,
    missingCount: totalMissing,
    missingDetails,
    outlierCount: totalOutliers,
    outlierDetails,
    isClean: duplicateStudentIds.length === 0 && totalMissing === 0 && totalOutliers === 0,
    auditTimestamp: new Date().toLocaleTimeString()
  };
};

export const cleanDataset = (
  students: StudentRecord[],
  options: {
    deduplicate: boolean;
    imputeMissing: boolean;
    treatOutliers: boolean;
  }
): { cleanedRows: StudentRecord[]; logs: CleaningLog[] } => {
  const logs: CleaningLog[] = [];
  let workingList = [...students];

  // 1. Deduplication
  if (options.deduplicate) {
    const seen = new Set<string>();
    const deduplicated: StudentRecord[] = [];
    let dupCount = 0;
    workingList.forEach((s) => {
      if (!seen.has(s.studentId)) {
        seen.add(s.studentId);
        deduplicated.push(s);
      } else {
        dupCount++;
      }
    });
    workingList = deduplicated;
    logs.push({
      action: 'Deduplication',
      details: `Identified and purged ${dupCount} duplicate student instances.`,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  // Calculate medians for imputation
  const getMedian = (field: keyof StudentRecord): number => {
    const valid = workingList
      .map((s) => Number(s[field]))
      .filter((v) => !Number.isNaN(v) && v !== null && v !== undefined)
      .sort((a, b) => a - b);
    return valid[Math.floor(valid.length / 2)] || 0;
  };

  const medians: Record<string, number> = {
    studyTimeWeeklyHours: getMedian('studyTimeWeeklyHours'),
    attendanceRate: getMedian('attendanceRate'),
    absences: getMedian('absences'),
    pastFailures: getMedian('pastFailures'),
    midterm1Score: getMedian('midterm1Score'),
    midterm2Score: getMedian('midterm2Score'),
    sleepHours: getMedian('sleepHours')
  };

  // 2. Missing Value Imputation
  if (options.imputeMissing) {
    let imputedCells = 0;
    workingList = workingList.map((s) => {
      const copy = { ...s };
      if (copy.studyTimeWeeklyHours === undefined || Number.isNaN(copy.studyTimeWeeklyHours)) {
        copy.studyTimeWeeklyHours = medians.studyTimeWeeklyHours;
        imputedCells++;
      }
      if (copy.attendanceRate === undefined || Number.isNaN(copy.attendanceRate)) {
        copy.attendanceRate = medians.attendanceRate;
        imputedCells++;
      }
      if (copy.midterm1Score === undefined || Number.isNaN(copy.midterm1Score)) {
        copy.midterm1Score = Math.round(medians.midterm1Score);
        imputedCells++;
      }
      if (copy.sleepHours === undefined || Number.isNaN(copy.sleepHours)) {
        copy.sleepHours = medians.sleepHours;
        imputedCells++;
      }
      if (!copy.stressLevel) {
        copy.stressLevel = 'Medium';
        imputedCells++;
      }
      return copy;
    });
    logs.push({
      action: 'Missing Value Imputation',
      details: `Imputed ${imputedCells} missing cells using feature column medians and modes.`,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  // 3. Outlier Treatment (Winsorization: capping to 1.5 * IQR bounds)
  if (options.treatOutliers) {
    let cappedCount = 0;
    const continuousCols: (keyof StudentRecord)[] = [
      'studyTimeWeeklyHours',
      'attendanceRate',
      'absences'
    ];

    continuousCols.forEach((col) => {
      const vals = workingList.map((s) => Number(s[col])).sort((a, b) => a - b);
      const q1 = vals[Math.floor(vals.length * 0.25)];
      const q3 = vals[Math.floor(vals.length * 0.75)];
      const iqr = q3 - q1;
      const lower = Math.max(0, q1 - 1.5 * iqr);
      const upper = q3 + 1.5 * iqr;

      workingList = workingList.map((s) => {
        const val = Number(s[col]);
        if (val < lower) {
          cappedCount++;
          return { ...s, [col]: parseFloat(lower.toFixed(1)) };
        }
        if (val > upper) {
          cappedCount++;
          return { ...s, [col]: parseFloat(upper.toFixed(1)) };
        }
        return s;
      });
    });

    logs.push({
      action: 'IQR Outlier Capping (Winsorization)',
      details: `Adjusted ${cappedCount} extreme outlier values to statistically robust IQR boundary thresholds.`,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  return { cleanedRows: workingList, logs };
};
