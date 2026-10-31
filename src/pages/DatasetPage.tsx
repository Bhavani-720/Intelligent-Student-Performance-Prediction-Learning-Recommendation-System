import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  RefreshCw,
  Table,
  Sparkles,
  ShieldCheck,
  Trash2,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DATA_DICTIONARY } from '../utils/dataQuality';

export const DatasetPage: React.FC = () => {
  const {
    students,
    datasetSummary,
    dataAudit,
    cleaningLogs,
    updateDatasetFromCsv,
    applyCleaning,
    loadUncleanedDatasetSample,
    resetToSampleData
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'audit' | 'cleaning' | 'dictionary' | 'stats'>('preview');

  // Cleaning options
  const [deduplicate, setDeduplicate] = useState(true);
  const [imputeMissing, setImputeMissing] = useState(true);
  const [treatOutliers, setTreatOutliers] = useState(true);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const success = updateDatasetFromCsv(text, file.name);
        if (success) {
          setUploadStatus(`Successfully parsed and loaded "${file.name}"`);
        } else {
          setUploadStatus('Failed to parse CSV. Please verify required columns.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleRunCleaning = () => {
    applyCleaning({
      deduplicate,
      imputeMissing,
      treatOutliers
    });
  };

  const downloadCleanedCsv = () => {
    const headers = [
      'studentId',
      'name',
      'gender',
      'age',
      'studyTimeWeeklyHours',
      'attendanceRate',
      'absences',
      'pastFailures',
      'midterm1Score',
      'midterm2Score',
      'finalExamScore',
      'parentalEducation',
      'familySupport',
      'schoolSupport',
      'extracurricular',
      'internetAccess',
      'travelTimeMinutes',
      'healthRating',
      'sleepHours',
      'stressLevel'
    ];

    const rows = students.map((s) => [
      s.studentId,
      `"${s.name}"`,
      s.gender,
      s.age,
      s.studyTimeWeeklyHours,
      s.attendanceRate,
      s.absences,
      s.pastFailures,
      s.midterm1Score,
      s.midterm2Score,
      s.finalExamScore,
      s.parentalEducation,
      s.familySupport,
      s.schoolSupport,
      s.extracurricular,
      s.internetAccess,
      s.travelTimeMinutes,
      s.healthRating,
      s.sleepHours,
      s.stressLevel
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cleaned_student_dataset_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone & Quick Sample Loaders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border-2 border-dashed border-blue-400/40 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Upload Student Academic Performance CSV
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-4">
            Validates mandatory columns: <span className="font-mono text-blue-500">studentId, studyTime, attendanceRate, midterm1Score, midterm2Score, finalExamScore</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Select CSV File</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={loadUncleanedDatasetSample}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-colors cursor-pointer"
              title="Loads dataset containing missing values, duplicates, and outliers to test cleaning"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Load Uncleaned Test CSV (with nulls & duplicates)</span>
            </button>
          </div>

          {uploadStatus && (
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-3">
              {uploadStatus}
            </p>
          )}
        </div>

        {/* Dataset Quick Summary Actions */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Active Dataset Source
            </h3>
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400 truncate mb-1">
              {datasetSummary.filename}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {datasetSummary.source} · {students.length} instances loaded.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={downloadCleanedCsv}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Cleaned CSV</span>
            </button>
            <button
              onClick={resetToSampleData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Clean Benchmark</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Data Audit Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Rows */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <p className="text-xs text-slate-500">Total Instances</p>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {students.length}
          </p>
          <span className="text-[11px] text-blue-500 font-medium">19 Attributes</span>
        </div>

        {/* Card 2: Duplicates */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <p className="text-xs text-slate-500">Duplicate Rows</p>
          <p className={`text-xl font-bold font-mono mt-1 ${dataAudit.duplicateCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {dataAudit.duplicateCount}
          </p>
          <span className="text-[11px] text-slate-400">
            {dataAudit.duplicateCount > 0 ? 'Action: Needs purging' : 'Zero duplicates'}
          </span>
        </div>

        {/* Card 3: Missing Values */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <p className="text-xs text-slate-500">Missing Values (Nulls)</p>
          <p className={`text-xl font-bold font-mono mt-1 ${dataAudit.missingCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {dataAudit.missingCount}
          </p>
          <span className="text-[11px] text-slate-400">
            {dataAudit.missingCount > 0 ? 'Action: Median/Mode Impute' : 'Complete (0 missing)'}
          </span>
        </div>

        {/* Card 4: IQR Outliers */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <p className="text-xs text-slate-500">IQR Outliers Detected</p>
          <p className={`text-xl font-bold font-mono mt-1 ${dataAudit.outlierCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {dataAudit.outlierCount}
          </p>
          <span className="text-[11px] text-slate-400">
            {dataAudit.outlierCount > 0 ? 'Action: Winsorization cap' : 'Within normal IQR'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
          <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 flex-wrap">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              Data Preview ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              Quality Audit & Outliers ({dataAudit.missingCount + dataAudit.duplicateCount + dataAudit.outlierCount} Issues)
            </button>
            <button
              onClick={() => setActiveTab('cleaning')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'cleaning'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              Data Cleaning Pipeline
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'dictionary'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              Data Dictionary (19 Features)
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              Summary Statistics
            </button>
          </div>

          {activeTab === 'preview' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Preview Table */}
        {activeTab === 'preview' && (
          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 dark:bg-[#0B1120] text-slate-500 font-mono border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3 text-right">Study Time (h)</th>
                  <th className="p-3 text-right">Attendance (%)</th>
                  <th className="p-3 text-right">Failures</th>
                  <th className="p-3 text-right">Midterm 1</th>
                  <th className="p-3 text-right">Midterm 2</th>
                  <th className="p-3 text-right">Final Exam</th>
                  <th className="p-3">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {filteredStudents.slice(0, 100).map((st) => (
                  <tr
                    key={`${st.id}-${st.studentId}`}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors"
                  >
                    <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">
                      {st.studentId}
                    </td>
                    <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">
                      {st.name}
                    </td>
                    <td className="p-3 text-slate-500">{st.gender}</td>
                    <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                      {Number.isNaN(st.studyTimeWeeklyHours) ? (
                        <span className="text-rose-500 font-bold bg-rose-500/10 px-1 py-0.5 rounded">NULL</span>
                      ) : (
                        st.studyTimeWeeklyHours
                      )}
                    </td>
                    <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                      {Number.isNaN(st.attendanceRate) ? (
                        <span className="text-rose-500 font-bold bg-rose-500/10 px-1 py-0.5 rounded">NULL</span>
                      ) : (
                        `${st.attendanceRate}%`
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {st.pastFailures > 0 ? (
                        <span className="text-rose-500 font-bold">{st.pastFailures}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                      {Number.isNaN(st.midterm1Score) ? (
                        <span className="text-rose-500 font-bold bg-rose-500/10 px-1 py-0.5 rounded">NULL</span>
                      ) : (
                        st.midterm1Score
                      )}
                    </td>
                    <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                      {st.midterm2Score}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                      {st.finalExamScore}
                    </td>
                    <td className="p-3 font-sans">
                      <span
                        className={`text-xs font-semibold ${
                          st.riskLevel === 'Critical'
                            ? 'text-rose-600 dark:text-rose-400'
                            : st.riskLevel === 'High'
                            ? 'text-amber-600 dark:text-amber-400'
                            : st.riskLevel === 'Moderate'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {st.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Quality Audit & Outliers */}
        {activeTab === 'audit' && (
          <div className="p-6 space-y-6">
            {/* Duplicates Section */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${dataAudit.duplicateCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
                  1. Duplicate Record Detection
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${dataAudit.duplicateCount > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {dataAudit.duplicateCount > 0 ? `${dataAudit.duplicateCount} DUPLICATES FOUND` : 'NO DUPLICATES'}
                </span>
              </div>
              {dataAudit.duplicateCount > 0 ? (
                <div className="text-xs font-mono space-y-1">
                  <p className="text-slate-600 dark:text-slate-400">
                    The following student identifiers appear more than once in the dataset:
                  </p>
                  <p className="text-amber-600 dark:text-amber-400 font-bold">
                    {dataAudit.duplicateStudentIds.join(', ')}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Every instance has a unique primary student key.</p>
              )}
            </div>

            {/* Missing Values Section */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${dataAudit.missingCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
                  2. Missing Value Analysis (NaN / Null)
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${dataAudit.missingCount > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {dataAudit.missingCount > 0 ? `${dataAudit.missingCount} NULL CELLS DETECTED` : '0 MISSING VALUES'}
                </span>
              </div>
              {dataAudit.missingDetails.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2">Column Feature</th>
                        <th className="py-2 text-right">Missing Cells</th>
                        <th className="py-2 text-right">Percentage</th>
                        <th className="py-2 text-right">Proposed Remediation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {dataAudit.missingDetails.map((m) => (
                        <tr key={m.column}>
                          <td className="py-2 font-bold text-blue-500">{m.column}</td>
                          <td className="py-2 text-right text-rose-500 font-bold">{m.count}</td>
                          <td className="py-2 text-right">{m.percentage}%</td>
                          <td className="py-2 text-right text-slate-400">Impute Column Median</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500">100% of cells contain valid non-empty data.</p>
              )}
            </div>

            {/* Outliers Section (IQR Method) */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${dataAudit.outlierCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
                  3. Outlier Analysis (Interquartile Range - IQR Formulation)
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${dataAudit.outlierCount > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {dataAudit.outlierCount > 0 ? `${dataAudit.outlierCount} OUTLIERS DETECTED` : 'ZERO OUTLIERS'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Statistical threshold: [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR]
              </p>
              {dataAudit.outlierDetails.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2">Feature</th>
                        <th className="py-2 text-right">Q1 (25%)</th>
                        <th className="py-2 text-right">Q3 (75%)</th>
                        <th className="py-2 text-right">IQR</th>
                        <th className="py-2 text-right">Valid Range</th>
                        <th className="py-2 text-right">Outliers Count</th>
                        <th className="py-2 text-right">Extreme Values</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {dataAudit.outlierDetails.map((o) => (
                        <tr key={o.column}>
                          <td className="py-2 font-bold text-blue-500">{o.column}</td>
                          <td className="py-2 text-right">{o.q1}</td>
                          <td className="py-2 text-right">{o.q3}</td>
                          <td className="py-2 text-right">{o.iqr}</td>
                          <td className="py-2 text-right">[{o.lowerBound}, {o.upperBound}]</td>
                          <td className="py-2 text-right font-bold text-amber-500">{o.outlierCount}</td>
                          <td className="py-2 text-right text-rose-500 font-bold">{o.outlierValues.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500">All continuous continuous variables satisfy normal IQR distributions.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Data Cleaning Pipeline */}
        {activeTab === 'cleaning' && (
          <div className="p-6 space-y-6">
            <div className="max-w-2xl space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Automated Data Cleaning Pipeline Controls
              </h4>
              <p className="text-xs text-slate-500">
                Select preprocessing transformations to execute against the current dataset before machine learning training.
              </p>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <input
                    type="checkbox"
                    checked={deduplicate}
                    onChange={(e) => setDeduplicate(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      1. Purge Duplicates
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Detects and deletes repeated student instances, retaining first occurrence.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <input
                    type="checkbox"
                    checked={imputeMissing}
                    onChange={(e) => setImputeMissing(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      2. Impute Missing Values
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Imputes numerical nulls with column median, and categorical features with column mode.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <input
                    type="checkbox"
                    checked={treatOutliers}
                    onChange={(e) => setTreatOutliers(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      3. Outlier Winsorization
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Caps values exceeding 1.5 * IQR boundaries to statistically robust boundary caps.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleRunCleaning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Data Cleaning Pipeline</span>
                </button>

                <button
                  onClick={downloadCleanedCsv}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>Download Cleaned CSV</span>
                </button>
              </div>
            </div>

            {/* Cleaning Audit Log */}
            {cleaningLogs.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Data Cleaning Execution Audit Log
                </h5>
                <div className="space-y-1.5 font-mono text-xs">
                  {cleaningLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        [{log.timestamp}] <strong className="text-blue-500">{log.action}:</strong> {log.details}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Data Dictionary */}
        {activeTab === 'dictionary' && (
          <div className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-4">
              Dataset Feature Dictionary (19 Academic Attributes)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
                    <th className="py-2.5 px-3">Feature Name</th>
                    <th className="py-2.5 px-3">Data Type</th>
                    <th className="py-2.5 px-3">Valid Domain Range</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Academic Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {DATA_DICTIONARY.map((d) => (
                    <tr key={d.feature} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {d.feature}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{d.type}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">{d.range}</td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 max-w-xs">{d.description}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs">{d.importance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Summary Statistics */}
        {activeTab === 'stats' && (
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="p-2">Feature</th>
                  <th className="p-2 text-right">Mean</th>
                  <th className="p-2 text-right">Std Dev</th>
                  <th className="p-2 text-right">Min</th>
                  <th className="p-2 text-right">25% (Q1)</th>
                  <th className="p-2 text-right">50% (Median)</th>
                  <th className="p-2 text-right">75% (Q3)</th>
                  <th className="p-2 text-right">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {Object.entries(datasetSummary.summaryStats).map(([feat, stat]) => (
                  <tr key={feat} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-2 font-semibold text-blue-600 dark:text-blue-400">{feat}</td>
                    <td className="p-2 text-right">{stat.mean.toFixed(2)}</td>
                    <td className="p-2 text-right text-slate-500">{stat.std.toFixed(2)}</td>
                    <td className="p-2 text-right">{stat.min.toFixed(1)}</td>
                    <td className="p-2 text-right">{stat.p25.toFixed(1)}</td>
                    <td className="p-2 text-right font-bold text-slate-900 dark:text-white">
                      {stat.median.toFixed(1)}
                    </td>
                    <td className="p-2 text-right">{stat.p75.toFixed(1)}</td>
                    <td className="p-2 text-right">{stat.max.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
