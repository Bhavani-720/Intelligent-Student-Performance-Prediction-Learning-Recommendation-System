import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  UserCheck,
  Save,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RecommendationsPage: React.FC = () => {
  const { students, selectedStudentId, updateStudentIntervention } = useApp();
  const [activeStudentId, setActiveStudentId] = useState<string>(
    selectedStudentId || students[2]?.id || 'std-003'
  );

  const selectedStudent =
    students.find((s) => s.id === activeStudentId || s.studentId === activeStudentId) || students[2];

  const [interventionStatus, setInterventionStatus] = useState<'Pending' | 'In Progress' | 'Completed'>(
    selectedStudent.interventionStatus || 'In Progress'
  );
  const [assignedMentor, setAssignedMentor] = useState(
    selectedStudent.assignedMentor || 'Prof. Ananya Sharma'
  );
  const [interventionNotes, setInterventionNotes] = useState(
    selectedStudent.interventionNotes || 'Remedial tutorial batch assigned for Midterm 2 weak areas.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when activeStudent changes
  const handleStudentSelect = (id: string) => {
    setActiveStudentId(id);
    const s = students.find((st) => st.id === id || st.studentId === id);
    if (s) {
      setInterventionStatus(s.interventionStatus || 'In Progress');
      setAssignedMentor(s.assignedMentor || 'Prof. Ananya Sharma');
      setInterventionNotes(s.interventionNotes || 'Remedial tutorial batch assigned for Midterm 2 weak areas.');
    }
  };

  const handleSaveIntervention = () => {
    updateStudentIntervention(
      selectedStudent.studentId,
      interventionStatus,
      assignedMentor,
      interventionNotes
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isHighRisk = selectedStudent.riskLevel === 'Critical' || selectedStudent.riskLevel === 'High';
  const recStudyHours = Math.max(14, selectedStudent.studyTimeWeeklyHours + 6);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-purple-800/40 bg-gradient-to-r from-[#190D30] via-[#21123B] to-[#2D1452] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-base font-bold text-[#F5F3FF] flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#8B5CF6]" />
            Personalized Learning & Academic Remediation Hub
          </h2>
          <p className="text-xs text-[#B8A9D1] mt-1">
            Prescriptive decision-support engine generating actionable weekly study plans, tutorial assignments, and faculty intervention tracking.
          </p>
        </div>

        {/* Student Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#B8A9D1] font-mono">Select Student:</span>
          <select
            value={activeStudentId}
            onChange={(e) => handleStudentSelect(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-purple-700/50 bg-[#190D30] text-xs text-[#F5F3FF] font-medium focus:ring-1 focus:ring-[#8B5CF6]"
          >
            {students.slice(0, 20).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.studentId}) — {s.riskLevel} Risk
              </option>
            ))}
          </select>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Intervention record updated and logged to institutional tracker.</span>
        </div>
      )}

      {/* Student Profile Snapshot */}
      <div className="p-5 rounded-2xl border border-purple-800/40 bg-[#21123B]/85 shadow-lg backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D28D9] to-[#D946EF] text-white flex items-center justify-center font-bold shadow-md shadow-purple-900/40">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#F5F3FF]">
                {selectedStudent.name}
              </h3>
              <span className="text-xs font-mono text-[#B8A9D1]">({selectedStudent.studentId})</span>
              <span className="text-xs text-[#B8A9D1]">·</span>
              <span className="text-xs text-[#C4B5FD]">{selectedStudent.department || 'AI & Data Science'}</span>
            </div>
            <p className="text-xs text-[#B8A9D1]">
              Current Predicted Exam:{' '}
              <span className="font-mono font-bold text-[#D946EF]">
                {selectedStudent.predictedScore || selectedStudent.finalExamScore}%
              </span>{' '}
              · Attendance: <span className="font-mono text-[#F5F3FF]">{selectedStudent.attendanceRate}%</span> · Backlogs:{' '}
              <span className="font-mono text-[#F5F3FF]">{selectedStudent.pastFailures}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-[#B8A9D1] block font-mono">Risk Status</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                selectedStudent.riskLevel === 'Critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : selectedStudent.riskLevel === 'High'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : selectedStudent.riskLevel === 'Moderate'
                  ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {selectedStudent.riskLevel} Risk
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#B8A9D1] block font-mono">Prescribed Target</span>
            <span className="text-sm font-bold text-[#F5F3FF] font-mono">
              {recStudyHours} hrs/wk study
            </span>
          </div>
        </div>
      </div>

      {/* Faculty Intervention Tracker Component */}
      <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 shadow-lg backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/30 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#8B5CF6]" />
            <div>
              <h3 className="text-sm font-bold text-[#F5F3FF]">
                Faculty Academic Intervention Tracker
              </h3>
              <p className="text-xs text-[#B8A9D1]">
                Manage remedial workflows, assign departmental mentors, and track post-advisory milestones
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold">
            Status: {selectedStudent.trackingStatus || 'Awaiting Follow-up Assessment'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#B8A9D1] block mb-1">
              Workflow Status
            </label>
            <select
              value={interventionStatus}
              onChange={(e) => setInterventionStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-purple-700/50 bg-[#190D30] text-[#F5F3FF] font-medium"
            >
              <option value="Pending">Pending (Scheduled)</option>
              <option value="In Progress">In Progress (Active Sessions)</option>
              <option value="Completed">Completed (Remedial Cycle Finished)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#B8A9D1] block mb-1">
              Assigned Faculty Mentor
            </label>
            <input
              type="text"
              value={assignedMentor}
              onChange={(e) => setAssignedMentor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-purple-700/50 bg-[#190D30] text-[#F5F3FF]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono font-bold text-[#B8A9D1] block mb-1">
              Faculty Log & Notes
            </label>
            <input
              type="text"
              value={interventionNotes}
              onChange={(e) => setInterventionNotes(e.target.value)}
              placeholder="e.g. Completed Midterm 2 concept review..."
              className="w-full px-3 py-2 rounded-xl border border-purple-700/50 bg-[#190D30] text-[#F5F3FF]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-[#B8A9D1] italic">
            * Tracking status is maintained as &quot;Awaiting Follow-up Assessment&quot; until subsequent continuous assessment examination scores are recorded.
          </p>
          <button
            onClick={handleSaveIntervention}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Intervention Status</span>
          </button>
        </div>
      </div>

      {/* 4 Targeted Intervention Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain 1: Academic Remediation */}
        <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 shadow-md backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4B5FD] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              1. Academic Concept Remediation
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8B5CF6]/20 text-[#C4B5FD] font-bold border border-[#8B5CF6]/30">
              {isHighRisk ? 'PRIORITY: URGENT' : 'STANDARD'}
            </span>
          </div>
          <p className="text-xs text-[#B8A9D1] leading-relaxed">
            {isHighRisk
              ? 'Enroll in mandatory remedial tutorial batch for Midterm 2 weak concepts (Optimization & Algorithmic Complexities).'
              : 'Continue advanced problem-solving modules and participate as peer mentor in departmental lab sessions.'}
          </p>
          <div className="p-3 rounded-xl bg-[#190D30] border border-purple-800/40 text-[11px] font-mono text-[#C4B5FD]">
            Suggested Resource: Departmental PAL (Peer Assisted Learning) Lab · Room 402
          </div>
        </div>

        {/* Domain 2: Attendance Recovery */}
        <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 shadow-md backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4B5FD] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              2. Attendance Monitoring & Retention
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
              {selectedStudent.attendanceRate < 75 ? 'MANDATORY CHECK-IN' : 'ON TRACK'}
            </span>
          </div>
          <p className="text-xs text-[#B8A9D1] leading-relaxed">
            {selectedStudent.attendanceRate < 75
              ? 'Attendance is currently below the 75% institutional eligibility cutoff. Advisor check-in required every Monday at 9:00 AM.'
              : 'Attendance satisfies university exam eligibility criteria (>80%). Maintain regular lecture participation.'}
          </p>
          <div className="p-3 rounded-xl bg-[#190D30] border border-purple-800/40 text-[11px] font-mono text-[#C4B5FD]">
            Action: Bi-weekly attendance notifications dispatched to academic counselor
          </div>
        </div>

        {/* Domain 3: Exam Prep Drills */}
        <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 shadow-md backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4B5FD] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Exam Preparation & Mock Drills
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              TIMED DRILLS
            </span>
          </div>
          <p className="text-xs text-[#B8A9D1] leading-relaxed">
            Complete 3 full-length end-semester simulated mock test papers with step-by-step marking rubrics before the exam week.
          </p>
          <div className="p-3 rounded-xl bg-[#190D30] border border-purple-800/40 text-[11px] font-mono text-[#C4B5FD]">
            Target Benchmark: Achieve min 65% on diagnostic mock 2 to remove probation flag
          </div>
        </div>

        {/* Domain 4: Wellbeing & Study-Life Balance */}
        <div className="rounded-2xl border border-purple-800/40 bg-[#21123B]/85 p-6 shadow-md backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4B5FD] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D946EF]" />
              4. Wellness & Sleep Optimization
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D946EF]/20 text-[#F5F3FF] font-bold border border-[#D946EF]/30">
              WELLNESS
            </span>
          </div>
          <p className="text-xs text-[#B8A9D1] leading-relaxed">
            Target 7.5 hours of consistent nightly sleep. Avoid all-night cramming sessions which reduce working memory retention by 38%.
          </p>
          <div className="p-3 rounded-xl bg-[#190D30] border border-purple-800/40 text-[11px] font-mono text-[#C4B5FD]">
            Habit: 50-minute Pomodoro focus blocks with 10-minute restorative breaks
          </div>
        </div>
      </div>
    </div>
  );
};
