import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Bell,
  ArrowRight,
  Filter,
  Users,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RiskPage: React.FC = () => {
  const { students, setCurrentPage, setSelectedStudentId } = useApp();
  const [selectedTier, setSelectedTier] = useState<'All' | 'Critical' | 'High' | 'Moderate' | 'Low'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const riskCounts = {
    Critical: students.filter((s) => s.riskLevel === 'Critical').length,
    High: students.filter((s) => s.riskLevel === 'High').length,
    Moderate: students.filter((s) => s.riskLevel === 'Moderate').length,
    Low: students.filter((s) => s.riskLevel === 'Low').length
  };

  const filteredStudents = students.filter((s) => {
    const matchesTier = selectedTier === 'All' || s.riskLevel === selectedTier;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Academic Early Warning & Risk Stratification System
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time classification alerting faculty to students vulnerable to course failure, semester probation, or dropout before end-term exams.
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 font-mono text-xs font-bold">
          {riskCounts.Critical + riskCounts.High} Students Flagged for Intervention
        </div>
      </div>

      {/* Tier Filter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            tier: 'Critical',
            count: riskCounts.Critical,
            desc: 'Score < 50% or Att < 65%',
            action: 'Immediate Mentorship Mandated',
            color: 'rose',
            border: 'border-rose-500/40',
            bg: 'bg-rose-500/10'
          },
          {
            tier: 'High',
            count: riskCounts.High,
            desc: 'Score 50-59% with Past Failures',
            action: 'Remedial Tutorial Assigned',
            color: 'amber',
            border: 'border-amber-500/40',
            bg: 'bg-amber-500/10'
          },
          {
            tier: 'Moderate',
            count: riskCounts.Moderate,
            desc: 'Score 60-69% (Borderline)',
            action: 'Study Group Scheduled',
            color: 'blue',
            border: 'border-blue-500/40',
            bg: 'bg-blue-500/10'
          },
          {
            tier: 'Low',
            count: riskCounts.Low,
            desc: 'Score >= 70% (Satisfactory)',
            action: 'Standard Track / Peer Mentors',
            color: 'emerald',
            border: 'border-emerald-500/40',
            bg: 'bg-emerald-500/10'
          }
        ].map((t) => {
          const isSelected = selectedTier === t.tier;
          return (
            <div
              key={t.tier}
              onClick={() => setSelectedTier(isSelected ? 'All' : (t.tier as any))}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? `${t.border} ${t.bg} ring-2 ring-${t.color}-500 shadow-sm`
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.tier} Risk
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {t.count}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t.desc}</p>
              <span className="inline-block mt-3 text-[10px] font-mono font-medium text-slate-500">
                {t.action}
              </span>
            </div>
          );
        })}
      </div>

      {/* Filterable Student Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Risk Registry
            </h3>
            <span className="text-xs text-slate-400">
              Showing {filteredStudents.length} Students ({selectedTier} filter)
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or TV-ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-50 dark:bg-[#0B1120] text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Student ID</th>
                <th className="p-3">Name</th>
                <th className="p-3 text-right">Attendance</th>
                <th className="p-3 text-right">Backlogs</th>
                <th className="p-3 text-right">M1 Score</th>
                <th className="p-3 text-right">M2 Score</th>
                <th className="p-3 text-right">Predicted Score</th>
                <th className="p-3">Risk Tier</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">
                    {st.studentId}
                  </td>
                  <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">
                    {st.name}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={st.attendanceRate < 70 ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'}
                    >
                      {st.attendanceRate}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {st.pastFailures > 0 ? (
                      <span className="text-rose-500 font-bold">{st.pastFailures}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                    {st.midterm1Score}
                  </td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                    {st.midterm2Score}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                    {st.predictedScore || st.finalExamScore}%
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
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudentId(st.id);
                        setCurrentPage('recommendations');
                      }}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-sans"
                    >
                      <span>Intervene</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
