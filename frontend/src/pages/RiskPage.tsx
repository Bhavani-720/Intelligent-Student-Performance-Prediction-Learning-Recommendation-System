import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Search,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CohortFilterBar } from '../components/analytics/CohortFilterBar';

export const RiskPage: React.FC = () => {
  const {
    students,
    filteredStudents: appFilteredStudents,
    riskSummary,
    setCurrentPage,
    setSelectedStudentId,
    updateStudentIntervention
  } = useApp();

  const [selectedTier, setSelectedTier] = useState<'All' | 'Critical' | 'High' | 'Moderate' | 'Low'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('In Progress');
  const [editMentor, setEditMentor] = useState('Prof. Ananya Sharma');
  const [editNotes, setEditNotes] = useState('');

  const displayList = appFilteredStudents.filter((s) => {
    const matchesTier = selectedTier === 'All' || s.riskLevel === selectedTier;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleOpenEdit = (student: typeof students[0]) => {
    setEditingStudentId(student.studentId);
    setEditStatus(student.interventionStatus || 'In Progress');
    setEditMentor(student.assignedMentor || 'Prof. Ananya Sharma');
    setEditNotes(student.interventionNotes || '');
  };

  const handleSaveEdit = () => {
    if (!editingStudentId) return;
    updateStudentIntervention(editingStudentId, editStatus, editMentor, editNotes);
    setEditingStudentId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-purple-800/40 bg-gradient-to-r from-[#190D30] via-[#21123B] to-[#2D1452] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-base font-bold text-[#F5F3FF] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Academic Early Warning & Risk Stratification System
          </h2>
          <p className="text-xs text-[#B8A9D1] mt-1">
            Real-time classification alerting faculty to students vulnerable to course failure, semester probation, or dropout before end-term exams.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold text-center">
            {riskSummary.urgentTotal} Urgent Remediation Mandates (High + Critical)
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs text-center">
            {riskSummary.elevatedTotal} Total Elevated (Mod+High+Crit)
          </div>
        </div>
      </div>

      {/* Interactive Cohort Filter Bar */}
      <CohortFilterBar compact />

      {/* Tier Filter Cards with Mathematical Partitioning Note */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            tier: 'Critical',
            count: riskSummary.critical,
            pct: `${((riskSummary.critical / riskSummary.total) * 100).toFixed(1)}%`,
            desc: 'Score < 50% or Att < 65%',
            action: 'Immediate Mentorship Mandated',
            color: 'rose',
            border: 'border-rose-500/40',
            bg: 'bg-rose-500/10'
          },
          {
            tier: 'High',
            count: riskSummary.high,
            pct: `${((riskSummary.high / riskSummary.total) * 100).toFixed(1)}%`,
            desc: 'Score 50-59% with Past Failures',
            action: 'Remedial Tutorial Assigned',
            color: 'amber',
            border: 'border-amber-500/40',
            bg: 'bg-amber-500/10'
          },
          {
            tier: 'Moderate',
            count: riskSummary.moderate,
            pct: `${((riskSummary.moderate / riskSummary.total) * 100).toFixed(1)}%`,
            desc: 'Score 60-69% (Borderline)',
            action: 'Study Group Scheduled',
            color: 'purple',
            border: 'border-purple-500/40',
            bg: 'bg-[#8B5CF6]/10'
          },
          {
            tier: 'Low',
            count: riskSummary.low,
            pct: `${((riskSummary.low / riskSummary.total) * 100).toFixed(1)}%`,
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
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? `${t.border} ${t.bg} ring-2 ring-[#8B5CF6] shadow-lg shadow-purple-950/50`
                  : 'border-purple-800/40 bg-[#21123B]/85 hover:border-purple-600/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C4B5FD]">
                  {t.tier} Risk
                </span>
                <span className="text-xl font-bold font-mono text-[#F5F3FF]">
                  {t.count}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#B8A9D1] mt-1">
                <span>{t.desc}</span>
                <span className="font-mono font-bold text-[#D946EF]">{t.pct}</span>
              </div>
              <span className="inline-block mt-3 text-[10px] font-mono font-medium text-[#C4B5FD]">
                {t.action}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal / Overlay for Updating Faculty Intervention */}
      {editingStudentId && (
        <div className="p-5 rounded-2xl border border-purple-700/50 bg-[#21123B] shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#F5F3FF] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#8B5CF6]" />
              Update Faculty Intervention Tracking — Student ID: {editingStudentId}
            </h4>
            <span className="text-[10px] font-mono text-[#C4B5FD]">
              Tracking Status: Awaiting Follow-up Assessment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-mono text-[#B8A9D1] block mb-1">
                Intervention Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-purple-700/50 bg-[#190D30] text-[#F5F3FF] font-medium text-xs"
              >
                <option value="Pending">Pending (Scheduled)</option>
                <option value="In Progress">In Progress (Active Sessions)</option>
                <option value="Completed">Completed (Tutorial Cycle Finished)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[#B8A9D1] block mb-1">
                Assigned Mentor
              </label>
              <input
                type="text"
                value={editMentor}
                onChange={(e) => setEditMentor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-purple-700/50 bg-[#190D30] text-[#F5F3FF] text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[#B8A9D1] block mb-1">
                Faculty Advisory Notes
              </label>
              <input
                type="text"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="e.g. Completed Midterm 2 concept review..."
                className="w-full px-2.5 py-1.5 rounded-xl border border-purple-700/50 bg-[#190D30] text-[#F5F3FF] text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingStudentId(null)}
              className="px-3 py-1.5 rounded-xl border border-purple-700/50 text-[#C4B5FD] text-xs hover:bg-[#190D30]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] text-white text-xs font-bold shadow-md shadow-purple-900/40 hover:opacity-95"
            >
              Save Intervention Record
            </button>
          </div>
        </div>
      )}

      {/* Filterable Student Table */}
      <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 overflow-hidden shadow-lg backdrop-blur-xl">
        <div className="p-4 border-b border-purple-800/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#F5F3FF]">
              Student Risk & Intervention Registry
            </h3>
            <span className="text-xs text-[#B8A9D1]">
              Showing {displayList.length} of {students.length} Students ({selectedTier} tier filter)
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#B8A9D1] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-purple-800/40 bg-[#190D30] text-xs text-[#F5F3FF] placeholder-[#B8A9D1]/60 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-[#190D30] text-[#C4B5FD] border-b border-purple-800/40">
              <tr>
                <th className="p-3">Student ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Department</th>
                <th className="p-3 text-right">Attendance</th>
                <th className="p-3 text-right">Backlogs</th>
                <th className="p-3 text-right">M1 / M2</th>
                <th className="p-3 text-right">Predicted</th>
                <th className="p-3">Risk Tier</th>
                <th className="p-3">Intervention Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-800/20 text-[#F5F3FF]">
              {displayList.map((st) => (
                <tr key={st.id} className="hover:bg-[#190D30]/60 transition-colors">
                  <td className="p-3 font-semibold text-[#8B5CF6]">
                    {st.studentId}
                  </td>
                  <td className="p-3 font-sans font-medium text-[#F5F3FF]">
                    {st.name}
                  </td>
                  <td className="p-3 font-sans text-[#B8A9D1] text-[11px] truncate max-w-[140px]">
                    {st.department || 'AI & Data Science'}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={
                        st.attendanceRate < 70
                          ? 'text-rose-400 font-bold'
                          : 'text-[#C4B5FD]'
                      }
                    >
                      {st.attendanceRate}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {st.pastFailures > 0 ? (
                      <span className="text-rose-400 font-bold">{st.pastFailures}</span>
                    ) : (
                      <span className="text-[#B8A9D1]">0</span>
                    )}
                  </td>
                  <td className="p-3 text-right text-[#C4B5FD]">
                    {st.midterm1Score} / {st.midterm2Score}
                  </td>
                  <td className="p-3 text-right font-bold text-[#D946EF]">
                    {st.predictedScore || st.finalExamScore}%
                  </td>
                  <td className="p-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        st.riskLevel === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : st.riskLevel === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : st.riskLevel === 'Moderate'
                          ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {st.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        st.interventionStatus === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : st.interventionStatus === 'In Progress'
                          ? 'bg-[#8B5CF6]/20 text-[#C4B5FD]'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {st.interventionStatus || 'Pending'}
                    </span>
                    <span className="block text-[9px] text-[#B8A9D1] font-mono mt-0.5">
                      {st.trackingStatus || 'Awaiting Follow-up'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(st)}
                      className="text-xs text-[#C4B5FD] hover:text-white font-sans underline cursor-pointer"
                    >
                      Track
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStudentId(st.id);
                        setCurrentPage('recommendations');
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#D946EF] hover:underline font-sans cursor-pointer"
                    >
                      <span>Prescribe</span>
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
