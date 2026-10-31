import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_RECOMMENDATIONS } from '../data/sampleDataset';

export const RecommendationsPage: React.FC = () => {
  const { students, selectedStudentId } = useApp();
  const [activeStudentId, setActiveStudentId] = useState<string>(
    selectedStudentId || students[2]?.id || 'std-003'
  );

  const selectedStudent = students.find((s) => s.id === activeStudentId) || students[2];

  // Derive dynamic personalized intervention plan based on student metrics
  const isHighRisk = selectedStudent.riskLevel === 'Critical' || selectedStudent.riskLevel === 'High';
  const recStudyHours = Math.max(14, selectedStudent.studyTimeWeeklyHours + 6);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-500" />
            Personalized Learning & Academic Remediation Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prescriptive decision-support engine generating actionable weekly study plans, tutorial assignments, and advisor check-ins.
          </p>
        </div>

        {/* Student Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Select Student:</span>
          <select
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
          >
            {students.slice(0, 15).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.studentId}) - {s.riskLevel} Risk
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Profile Snapshot */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedStudent.name}
              </h3>
              <span className="text-xs font-mono text-slate-400">({selectedStudent.studentId})</span>
            </div>
            <p className="text-xs text-slate-500">
              Current Predicted Exam: <span className="font-mono font-bold text-blue-500">{selectedStudent.predictedScore || selectedStudent.finalExamScore}%</span> · Attendance: <span className="font-mono">{selectedStudent.attendanceRate}%</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Risk Status</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                selectedStudent.riskLevel === 'Critical'
                  ? 'bg-rose-500/20 text-rose-500'
                  : selectedStudent.riskLevel === 'High'
                  ? 'bg-amber-500/20 text-amber-500'
                  : selectedStudent.riskLevel === 'Moderate'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {selectedStudent.riskLevel} Risk
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Recommended Target</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {recStudyHours} hrs/wk study
            </span>
          </div>
        </div>
      </div>

      {/* 4 Targeted Intervention Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain 1: Academic Remediation */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              1. Academic Concept Remediation
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-500 font-bold">
              {isHighRisk ? 'PRIORITY: URGENT' : 'STANDARD'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isHighRisk
              ? 'Enroll in mandatory remedial tutorial batch for Midterm 2 weak concepts (Discrete Structures & Algorithm Design).'
              : 'Continue advanced problem-solving modules and participate as peer mentor in coding lab sessions.'}
          </p>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-[11px] font-mono text-slate-500">
            Suggested Resource: Departmental PAL (Peer Assisted Learning) Lab · Room 402
          </div>
        </div>

        {/* Domain 2: Attendance Recovery */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              2. Attendance Monitoring & Retention
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-500 font-bold">
              {selectedStudent.attendanceRate < 75 ? 'MANDATORY CHECK-IN' : 'ON TRACK'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedStudent.attendanceRate < 75
              ? 'Attendance is currently below the 75% university eligibility cutoff. Advisor check-in required every Monday at 9:00 AM.'
              : 'Attendance satisfies university exam eligibility criteria (>80%). Maintain regular lecture participation.'}
          </p>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-[11px] font-mono text-slate-500">
            Action: Bi-weekly SMS & Email attendance updates dispatched to academic counselor
          </div>
        </div>

        {/* Domain 3: Exam Prep Drills */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              3. Exam Preparation & Mock Drills
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 font-bold">
              TIMED DRILLS
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Complete 3 full-length end-semester simulated mock test papers with step-by-step marking rubrics before the exam week.
          </p>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-[11px] font-mono text-slate-500">
            Target Benchmark: Achieve min 65% on diagnostic mock 2 to remove probation flag
          </div>
        </div>

        {/* Domain 4: Wellbeing & Study-Life Balance */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              4. Wellness & Sleep Optimization
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-500 font-bold">
              WELLNESS
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Target 7.5 hours of consistent nightly sleep. Avoid all-night cramming sessions which reduce working memory retention by 38%.
          </p>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-[11px] font-mono text-slate-500">
            Habit: 50-minute Pomodoro focus blocks with 10-minute restorative breaks
          </div>
        </div>
      </div>
    </div>
  );
};
