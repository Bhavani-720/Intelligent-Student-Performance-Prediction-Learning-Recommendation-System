import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  X,
  GraduationCap,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentRecord } from '../types';

export const RecordsPage: React.FC = () => {
  const { students, setSelectedStudentId, setCurrentPage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [inspectingStudent, setInspectingStudent] = useState<StudentRecord | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || s.riskLevel === riskFilter;
    const matchesGender = genderFilter === 'All' || s.gender === genderFilter;
    return matchesSearch && matchesRisk && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            Comprehensive Student Records Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and inspect detailed academic profiles, demographic vectors, and historical assessment marks for all enrolled students.
          </p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono text-xs">
          {students.length} Total Enrolled
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name or TV-ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="All">All Tiers</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="All">All Genders</option>
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Main Student Records Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-50 dark:bg-[#0B1120] text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Student ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Gender / Age</th>
                <th className="p-3 text-right">Study Time</th>
                <th className="p-3 text-right">Attendance</th>
                <th className="p-3 text-right">Failures</th>
                <th className="p-3 text-right">Midterm 1</th>
                <th className="p-3 text-right">Midterm 2</th>
                <th className="p-3 text-right">Final Score</th>
                <th className="p-3">Risk Tier</th>
                <th className="p-3 text-center">Inspect</th>
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
                  <td className="p-3 text-slate-500">
                    {st.gender} · {st.age} yrs
                  </td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                    {st.studyTimeWeeklyHours} h/wk
                  </td>
                  <td className="p-3 text-right font-medium">
                    <span className={st.attendanceRate < 70 ? 'text-rose-500 font-bold' : ''}>
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
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setInspectingStudent(st)}
                      className="p-1 rounded text-slate-400 hover:text-blue-500 transition-colors"
                      title="Inspect student dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Student Modal */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setInspectingStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold font-mono">
                {inspectingStudent.gender}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {inspectingStudent.name}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {inspectingStudent.studentId} · Age {inspectingStudent.age}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">Attendance</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingStudent.attendanceRate}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Study Hours</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingStudent.studyTimeWeeklyHours} hrs/wk</span>
              </div>
              <div>
                <span className="text-slate-400 block">Midterm 1 / Midterm 2</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingStudent.midterm1Score} / {inspectingStudent.midterm2Score}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Past Backlogs</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingStudent.pastFailures}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Parental Education</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingStudent.parentalEducation}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Stress Level</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingStudent.stressLevel}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedStudentId(inspectingStudent.id);
                  setInspectingStudent(null);
                  setCurrentPage('recommendations');
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
              >
                View Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
