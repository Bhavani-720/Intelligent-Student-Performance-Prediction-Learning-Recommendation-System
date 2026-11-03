import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown, ChevronUp, Users, Check, School, BookOpen, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CohortFilterBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { students, filteredStudents, cohortFilters, setCohortFilters, resetCohortFilters } = useApp();
  const [isExpanded, setIsExpanded] = useState(!compact);

  const departments = [
    'All',
    'Artificial Intelligence & Data Science',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication'
  ];

  const courses = [
    'All',
    'Machine Learning & Neural Networks',
    'Advanced Algorithms & Data Structures',
    'Cloud Computing & Distributed Systems',
    'Database Systems & Data Warehousing'
  ];

  const semesters = ['All', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const genders = [
    { value: 'All', label: 'All Genders' },
    { value: 'F', label: 'Female (F)' },
    { value: 'M', label: 'Male (M)' }
  ];
  const riskTiers = ['All', 'Critical', 'High', 'Moderate', 'Low'];

  const hasActiveFilters =
    cohortFilters.department !== 'All' ||
    cohortFilters.course !== 'All' ||
    cohortFilters.semester !== 'All' ||
    cohortFilters.gender !== 'All' ||
    cohortFilters.school !== 'All' ||
    cohortFilters.riskTier !== 'All' ||
    cohortFilters.minAttendance > 0;

  return (
    <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 backdrop-blur-xl p-4 shadow-lg shadow-purple-950/40 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#D946EF] text-white flex items-center justify-center shadow-md shadow-purple-900/30">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F3FF] font-mono">
                Interactive Cohort Segmentation
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-[#D946EF] font-mono text-[10px] font-bold border border-[#D946EF]/30">
                {filteredStudents.length} / {students.length} Students Active
              </span>
            </div>
            <p className="text-[11px] text-[#B8A9D1]">
              Filter student analytics, risk metrics, and visualizations by institutional taxonomy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetCohortFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-600/40 bg-[#2D1452] text-[#F5F3FF] text-xs font-medium hover:bg-[#6D28D9] transition-colors cursor-pointer"
              title="Reset all cohort filters to cohort-wide defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-xl border border-purple-800/40 hover:bg-[#2D1452] text-[#C4B5FD] cursor-pointer transition-colors"
            aria-label="Toggle filter controls"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-purple-900/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Department Filter */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#C4B5FD] block mb-1">
              Department
            </label>
            <select
              value={cohortFilters.department}
              onChange={(e) => setCohortFilters((prev) => ({ ...prev, department: e.target.value }))}
              className="w-full px-2.5 py-1.5 rounded-xl border border-purple-800/50 bg-[#190D30] text-xs text-[#F5F3FF] font-medium focus:ring-1 focus:ring-[#8B5CF6] focus:outline-none"
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-[#190D30] text-[#F5F3FF]">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#C4B5FD] block mb-1">
              Course / Subject
            </label>
            <select
              value={cohortFilters.course}
              onChange={(e) => setCohortFilters((prev) => ({ ...prev, course: e.target.value }))}
              className="w-full px-2.5 py-1.5 rounded-xl border border-purple-800/50 bg-[#190D30] text-xs text-[#F5F3FF] font-medium focus:ring-1 focus:ring-[#8B5CF6] focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c} value={c} className="bg-[#190D30] text-[#F5F3FF]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#C4B5FD] block mb-1">
              Semester
            </label>
            <select
              value={cohortFilters.semester}
              onChange={(e) => setCohortFilters((prev) => ({ ...prev, semester: e.target.value }))}
              className="w-full px-2.5 py-1.5 rounded-xl border border-purple-800/50 bg-[#190D30] text-xs text-[#F5F3FF] font-medium focus:ring-1 focus:ring-[#8B5CF6] focus:outline-none"
            >
              {semesters.map((s) => (
                <option key={s} value={s} className="bg-[#190D30] text-[#F5F3FF]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#C4B5FD] block mb-1">
              Demographics
            </label>
            <select
              value={cohortFilters.gender}
              onChange={(e) => setCohortFilters((prev) => ({ ...prev, gender: e.target.value }))}
              className="w-full px-2.5 py-1.5 rounded-xl border border-purple-800/50 bg-[#190D30] text-xs text-[#F5F3FF] font-medium focus:ring-1 focus:ring-[#8B5CF6] focus:outline-none"
            >
              {genders.map((g) => (
                <option key={g.value} value={g.value} className="bg-[#190D30] text-[#F5F3FF]">
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Tier Filter */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#C4B5FD] block mb-1">
              Risk Classification
            </label>
            <select
              value={cohortFilters.riskTier}
              onChange={(e) => setCohortFilters((prev) => ({ ...prev, riskTier: e.target.value }))}
              className="w-full px-2.5 py-1.5 rounded-xl border border-purple-800/50 bg-[#190D30] text-xs text-[#F5F3FF] font-medium focus:ring-1 focus:ring-[#8B5CF6] focus:outline-none"
            >
              {riskTiers.map((r) => (
                <option key={r} value={r} className="bg-[#190D30] text-[#F5F3FF]">
                  {r === 'All' ? 'All Risk Levels' : `${r} Risk`}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Attendance Threshold */}
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#C4B5FD] block mb-1">
              Attendance Cutoff
            </label>
            <select
              value={cohortFilters.minAttendance}
              onChange={(e) =>
                setCohortFilters((prev) => ({ ...prev, minAttendance: Number(e.target.value) }))
              }
              className="w-full px-2.5 py-1.5 rounded-xl border border-purple-800/50 bg-[#190D30] text-xs text-[#F5F3FF] font-medium focus:ring-1 focus:ring-[#8B5CF6] focus:outline-none"
            >
              <option value={0} className="bg-[#190D30] text-[#F5F3FF]">All Attendance Rates</option>
              <option value={65} className="bg-[#190D30] text-[#F5F3FF]">Min 65% (Warning Cutoff)</option>
              <option value={75} className="bg-[#190D30] text-[#F5F3FF]">Min 75% (University Mandate)</option>
              <option value={85} className="bg-[#190D30] text-[#F5F3FF]">Min 85% (High Attendance)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
