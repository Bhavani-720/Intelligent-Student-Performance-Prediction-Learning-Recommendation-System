-- TREKVERSE AI: Student Academic Management & Early-Warning System Database Schema
-- Compatible with SQLite, PostgreSQL, and MySQL

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('ADMIN', 'FACULTY', 'STUDENT')) NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    student_id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    email TEXT,
    department TEXT NOT NULL,
    semester INTEGER NOT NULL DEFAULT 4,
    cgpa REAL NOT NULL,
    attendance REAL NOT NULL,
    backlogs INTEGER NOT NULL DEFAULT 0,
    study_hours REAL NOT NULL DEFAULT 2.5,
    risk_level TEXT CHECK(risk_level IN ('Low', 'Moderate', 'High')) NOT NULL DEFAULT 'Low',
    predicted_score REAL,
    weak_subject TEXT,
    strong_subject TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    semester INTEGER NOT NULL,
    credits INTEGER DEFAULT 3
);

CREATE TABLE IF NOT EXISTS marks (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    internal_marks REAL NOT NULL,
    assignment_marks REAL NOT NULL,
    quiz_marks REAL NOT NULL,
    midterm_marks REAL NOT NULL,
    final_marks REAL,
    predicted_marks REAL,
    grade TEXT,
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    recorded_date DATE NOT NULL,
    status TEXT CHECK(status IN ('Present', 'Absent', 'Late')) NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    title TEXT NOT NULL,
    score REAL NOT NULL,
    max_score REAL NOT NULL DEFAULT 100,
    submission_rate REAL DEFAULT 100.0,
    submitted_on_time INTEGER DEFAULT 1,
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS predictions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    model_name TEXT NOT NULL,
    predicted_score REAL NOT NULL,
    risk_category TEXT NOT NULL,
    confidence_low REAL,
    confidence_high REAL,
    subject_predictions_json TEXT,
    shap_factors_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    recommendation_type TEXT NOT NULL,
    study_plan_json TEXT,
    action_items_json TEXT,
    faculty_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_students_risk ON students(risk_level);
CREATE INDEX IF NOT EXISTS idx_students_dept ON students(department);
CREATE INDEX IF NOT EXISTS idx_marks_student ON marks(student_id);
CREATE INDEX IF NOT EXISTS idx_predictions_student ON predictions(student_id);

