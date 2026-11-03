"""
TREKVERSE AI Database Management Layer
Supports SQLite (built-in zero configuration) and extensible to PostgreSQL / MySQL.
Provides ORM-like access, schema migrations, and sample dataset seeding.
"""

import os
import sqlite3
import hashlib
import json
from typing import Dict, List, Optional, Any, Tuple
import pandas as pd
import numpy as np

DB_PATH = os.path.join(os.path.dirname(__file__), "trekverse.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")

def hash_password(password: str) -> str:
    """Hash password with sha256 + salt for consistent demo support."""
    salt = "trekverse_secure_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def get_connection() -> sqlite3.Connection:
    """Return a connection to the SQLite database with dictionary rows."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force_reseed: bool = False):
    """Initialize database tables and seed if empty or forced."""
    conn = get_connection()
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    conn.commit()

    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]

    if user_count == 0 or force_reseed:
        _seed_demo_data(conn)
    conn.close()

def _seed_demo_data(conn: sqlite3.Connection):
    """Seed comprehensive realistic academic dataset."""
    cursor = conn.cursor()
    cursor.execute("DELETE FROM recommendations")
    cursor.execute("DELETE FROM predictions")
    cursor.execute("DELETE FROM assignments")
    cursor.execute("DELETE FROM marks")
    cursor.execute("DELETE FROM attendance")
    cursor.execute("DELETE FROM students")
    cursor.execute("DELETE FROM subjects")
    cursor.execute("DELETE FROM users")

    # 1. Insert Users
    users = [
        ("usr-admin", "admin", hash_password("admin123"), "ADMIN", "Dr. Suresh Kumar", "admin@trekverse.ai", "Administration"),
        ("usr-faculty", "faculty", hash_password("faculty123"), "FACULTY", "Prof. Ananya Sharma", "faculty@trekverse.ai", "Computer Science & AI"),
        ("usr-student", "student", hash_password("student123"), "STUDENT", "Aarav Sharma", "aarav@trekverse.ai", "Computer Science & AI"),
        ("usr-student-2", "stu1024", hash_password("student123"), "STUDENT", "Rohan Mehta", "rohan.mehta@trekverse.ai", "Information Technology"),
    ]
    cursor.executemany(
        "INSERT INTO users (id, username, password_hash, role, name, email, department) VALUES (?, ?, ?, ?, ?, ?, ?)",
        users
    )

    # 2. Insert Standard Curriculum Subjects
    subjects = [
        ("SUB-MATH", "MATH101", "Mathematics", "Computer Science & AI", 4, 4),
        ("SUB-PROG", "CS102", "Programming & Data Structures", "Computer Science & AI", 4, 4),
        ("SUB-DBMS", "CS201", "Database Management Systems (DBMS)", "Computer Science & AI", 4, 3),
        ("SUB-CN", "CS202", "Computer Networks", "Computer Science & AI", 4, 3),
        ("SUB-ELEC", "EC103", "Digital Electronics & Systems", "Computer Science & AI", 4, 3),
    ]
    cursor.executemany(
        "INSERT INTO subjects (id, code, name, department, semester, credits) VALUES (?, ?, ?, ?, ?, ?)",
        subjects
    )

    # 3. Insert Specific Benchmark Student STU1024
    # Requirement 4: STU1024 -> Predicted 13.6/20, Risk: Moderate, Attendance: 68%, Weak: Mathematics, Failures: 1
    cursor.execute("""
        INSERT INTO students (student_id, user_id, name, email, department, semester, cgpa, attendance, backlogs, study_hours, risk_level, predicted_score, weak_subject, strong_subject)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "STU1024", "usr-student-2", "Rohan Mehta", "rohan.mehta@trekverse.ai",
        "Computer Science & AI", 4, 6.8, 68.0, 1, 2.0, "Moderate", 13.6, "Mathematics", "Programming"
    ))

    # STU1024 subject marks
    stu1024_marks = [
        ("MRK-1024-MATH", "STU1024", "SUB-MATH", 11.2, 12.0, 11.5, 12.0, 12.5, 12.8, "C"),
        ("MRK-1024-PROG", "STU1024", "SUB-PROG", 17.5, 18.0, 16.5, 17.0, 17.2, 17.1, "A"),
        ("MRK-1024-DBMS", "STU1024", "SUB-DBMS", 13.2, 14.0, 13.0, 13.5, 14.0, 13.8, "B"),
        ("MRK-1024-CN", "STU1024", "SUB-CN", 14.5, 15.0, 14.0, 14.2, 14.8, 14.6, "B"),
        ("MRK-1024-ELEC", "STU1024", "SUB-ELEC", 12.4, 13.0, 12.0, 12.5, 13.0, 12.9, "C"),
    ]
    cursor.executemany(
        "INSERT INTO marks (id, student_id, subject_id, internal_marks, assignment_marks, quiz_marks, midterm_marks, final_marks, predicted_marks, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        stu1024_marks
    )

    # STU1024 Prediction record
    cursor.execute("""
        INSERT INTO predictions (id, student_id, model_name, predicted_score, risk_category, confidence_low, confidence_high, subject_predictions_json, shap_factors_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "PRED-STU1024", "STU1024", "Random Forest + LightGBM Ensemble", 13.6, "Moderate", 12.4, 14.8,
        json.dumps({
            "Mathematics": 12.8,
            "Programming": 17.1,
            "DBMS": 13.8,
            "Computer Networks": 14.6,
            "Electronics": 12.9
        }),
        json.dumps([
            {"factor": "Attendance Rate (68%)", "impact": -2.4, "status": "Negative"},
            {"factor": "Past Backlogs (1)", "impact": -1.8, "status": "Negative"},
            {"factor": "Daily Study Hours (2.0 hrs)", "impact": -1.1, "status": "Negative"},
            {"factor": "Strong Programming Score (17.5)", "impact": +2.1, "status": "Positive"},
            {"factor": "Quiz Performance (72%)", "impact": +0.8, "status": "Positive"}
        ])
    ))

    # STU1024 Recommendation
    cursor.execute("""
        INSERT INTO recommendations (id, student_id, recommendation_type, study_plan_json, action_items_json, faculty_remarks)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        "REC-STU1024", "STU1024", "Academic Improvement Plan",
        json.dumps({
            "Monday": "Mathematics: 1.5 hours (Differential Equations & Linear Algebra)",
            "Tuesday": "Programming: 1.0 hour (Dynamic Programming Practice)",
            "Wednesday": "DBMS: 1.0 hour (SQL Joins & Indexing Practice)",
            "Thursday": "Mathematics Revision: 1.5 hours (Previous Year Question Bank)",
            "Friday": "Electronics: 1.0 hour (Logic Gates & K-Maps)",
            "Saturday": "Mock Assessment: 45 minutes (Maths + Electronics Practice Test)",
            "Sunday": "Weekly Self-Review & Faculty Doubt Log: 30 minutes"
        }),
        json.dumps([
            "Mandatory 2-week attendance recovery plan to cross 75% threshold",
            "Enroll in Department Mathematics peer-mentoring clinic every Wednesday",
            "Submit 3 backlog revision assignments before Midterm 2"
        ]),
        "Student shows great programming aptitude but struggles with calculus fundamentals. Recommended additional practice + attendance improvement."
    ))

    # 4. Generate Cohort: Exactly 295 students matching Requested Distribution:
    # 24 High Risk, 57 Moderate Risk, 214 Low Risk
    first_names = [
        "Aarav", "Aditi", "Akhil", "Ananya", "Arjun", "Bhavya", "Chirag", "Deepika",
        "Divya", "Gaurav", "Harsh", "Ishaan", "Kavya", "Manish", "Meera", "Neha",
        "Nikhil", "Pooja", "Pranav", "Priya", "Rahul", "Riya", "Rohan", "Sakshi",
        "Sanjay", "Shreya", "Siddharth", "Sneha", "Tarun", "Varun", "Vikas", "Yash"
    ]
    last_names = [
        "Sharma", "Verma", "Patel", "Reddy", "Nair", "Rao", "Iyer", "Mehta",
        "Joshi", "Bhat", "Gupta", "Malhotra", "Kapoor", "Chopra", "Das", "Singh"
    ]
    departments = [
        "Computer Science & AI",
        "Information Technology",
        "Electronics & Communication",
        "Data Science & Analytics"
    ]

    np.random.seed(42)
    cohort_specs = [
        ("High", 24, (5.0, 6.4), (52.0, 71.0), (1, 3), (1.0, 2.2), (8.5, 11.5)),
        ("Moderate", 57, (6.5, 7.6), (71.0, 81.0), (0, 1), (2.0, 3.5), (12.0, 14.8)),
        ("Low", 214, (7.7, 9.8), (82.0, 98.0), (0, 0), (3.5, 6.0), (15.0, 19.4)),
    ]

    student_counter = 1001
    for risk_cat, count, cgpa_range, att_range, backlog_range, study_range, score_range in cohort_specs:
        for _ in range(count):
            if student_counter == 1024:
                # already inserted STU1024 above
                student_counter += 1
                continue

            stu_id = f"STU{student_counter}"
            fname = np.random.choice(first_names)
            lname = np.random.choice(last_names)
            name = f"{fname} {lname}"
            email = f"{fname.lower()}.{lname.lower()}{student_counter}@trekverse.edu"
            dept = np.random.choice(departments)
            semester = int(np.random.choice([3, 4, 5, 6]))
            cgpa = round(float(np.random.uniform(*cgpa_range)), 2)
            att = round(float(np.random.uniform(*att_range)), 1)
            backlogs = int(np.random.randint(backlog_range[0], backlog_range[1] + 1))
            study_hrs = round(float(np.random.uniform(*study_range)), 1)
            pred_score = round(float(np.random.uniform(*score_range)), 1)

            sub_names = ["Mathematics", "Programming", "DBMS", "Computer Networks", "Electronics"]
            if risk_cat == "High":
                weak = np.random.choice(["Mathematics", "Electronics", "DBMS"])
                strong = np.random.choice(["Programming", "Computer Networks"])
            elif risk_cat == "Moderate":
                weak = np.random.choice(["Mathematics", "DBMS", "Electronics"])
                strong = np.random.choice(["Programming", "Computer Networks", "Mathematics"])
            else:
                weak = "None (Consistent)"
                strong = np.random.choice(["Programming", "Mathematics", "DBMS"])

            cursor.execute("""
                INSERT INTO students (student_id, user_id, name, email, department, semester, cgpa, attendance, backlogs, study_hours, risk_level, predicted_score, weak_subject, strong_subject)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (stu_id, None, name, email, dept, semester, cgpa, att, backlogs, study_hrs, risk_cat, pred_score, weak, strong))

            # Insert Marks for each subject
            for s_id, s_code, s_name, _, _, _ in subjects:
                sub_score = pred_score + float(np.random.normal(0, 1.2))
                sub_score = max(5.0, min(20.0, sub_score))
                internal = round(sub_score * 0.95 + float(np.random.normal(0, 0.5)), 1)
                assignment = round(min(20.0, sub_score + float(np.random.uniform(0.5, 2.0))), 1)
                quiz = round(min(20.0, sub_score + float(np.random.uniform(-1.0, 1.5))), 1)
                midterm = round(sub_score, 1)
                final_m = round(sub_score, 1)

                grade = "O" if sub_score >= 18 else ("A+" if sub_score >= 16 else ("A" if sub_score >= 14 else ("B" if sub_score >= 12 else ("C" if sub_score >= 10 else "F"))))
                cursor.execute("""
                    INSERT INTO marks (id, student_id, subject_id, internal_marks, assignment_marks, quiz_marks, midterm_marks, final_marks, predicted_marks, grade)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (f"MRK-{stu_id}-{s_code}", stu_id, s_id, internal, assignment, quiz, midterm, final_m, sub_score, grade))

            # Insert Prediction
            cursor.execute("""
                INSERT INTO predictions (id, student_id, model_name, predicted_score, risk_category, confidence_low, confidence_high, subject_predictions_json, shap_factors_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f"PRED-{stu_id}", stu_id, "Ensemble (CatBoost + RF)", pred_score, risk_cat,
                round(max(0, pred_score - 1.4), 1), round(min(20, pred_score + 1.4), 1),
                json.dumps({
                    "Mathematics": round(max(5.0, min(20.0, pred_score + np.random.uniform(-1.5, 1.5))), 1),
                    "Programming": round(max(5.0, min(20.0, pred_score + np.random.uniform(-0.5, 2.0))), 1),
                    "DBMS": round(max(5.0, min(20.0, pred_score + np.random.uniform(-1.0, 1.0))), 1),
                    "Computer Networks": round(max(5.0, min(20.0, pred_score + np.random.uniform(-1.0, 1.2))), 1),
                    "Electronics": round(max(5.0, min(20.0, pred_score + np.random.uniform(-2.0, 0.5))), 1)
                }),
                json.dumps([
                    {"factor": f"Attendance ({att}%)", "impact": 1.8 if att >= 75 else -2.2, "status": "Positive" if att >= 75 else "Negative"},
                    {"factor": f"Study Hours ({study_hrs}h/d)", "impact": 1.2 if study_hrs >= 3.0 else -1.4, "status": "Positive" if study_hrs >= 3.0 else "Negative"},
                    {"factor": f"Past Failures ({backlogs})", "impact": 0.0 if backlogs == 0 else -2.5, "status": "Neutral" if backlogs == 0 else "Negative"},
                ])
            ))

            student_counter += 1

    conn.commit()
    print(f"Database successfully seeded: {student_counter - 1001} students registered.")

# Query Helpers
def get_kpis() -> Dict[str, Any]:
    """Retrieve aggregate key performance indicators."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*), AVG(cgpa), AVG(attendance), AVG(predicted_score) FROM students")
    tot, avg_cgpa, avg_att, avg_pred = c.fetchone()

    c.execute("SELECT COUNT(*) FROM students WHERE risk_level = 'High'")
    high_risk = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM students WHERE risk_level = 'Moderate'")
    mod_risk = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM students WHERE risk_level = 'Low'")
    low_risk = c.fetchone()[0]

    conn.close()
    return {
        "total_students": tot or 0,
        "avg_cgpa": round(avg_cgpa or 0, 2),
        "avg_attendance": round(avg_att or 0, 1),
        "avg_predicted_score": round(avg_pred or 0, 1),
        "high_risk": high_risk or 0,
        "moderate_risk": mod_risk or 0,
        "low_risk": low_risk or 0
    }

def get_all_students(
    risk_filter: Optional[str] = None,
    dept_filter: Optional[str] = None,
    search_query: Optional[str] = None
) -> pd.DataFrame:
    """Retrieve students dataframe with optional filters."""
    conn = get_connection()
    query = "SELECT * FROM students WHERE 1=1"
    params = []

    if risk_filter and risk_filter != "All":
        query += " AND risk_level = ?"
        params.append(risk_filter)
    if dept_filter and dept_filter != "All":
        query += " AND department = ?"
        params.append(dept_filter)
    if search_query:
        query += " AND (name LIKE ? OR student_id LIKE ?)"
        params.extend([f"%{search_query}%", f"%{search_query}%"])

    query += " ORDER BY student_id ASC"
    df = pd.read_sql_query(query, conn, params=params)
    conn.close()
    return df

def get_student_detail(student_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve comprehensive profile for a single student."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM students WHERE student_id = ?", (student_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        return None
    student = dict(row)

    # Marks
    c.execute("""
        SELECT m.*, s.name as subject_name, s.code as subject_code
        FROM marks m
        JOIN subjects s ON m.subject_id = s.id
        WHERE m.student_id = ?
    """, (student_id,))
    student['marks'] = [dict(m) for m in c.fetchall()]

    # Prediction
    c.execute("SELECT * FROM predictions WHERE student_id = ? ORDER BY created_at DESC LIMIT 1", (student_id,))
    pred_row = c.fetchone()
    if pred_row:
        pred_dict = dict(pred_row)
        pred_dict['subject_predictions'] = json.loads(pred_dict.get('subject_predictions_json') or '{}')
        pred_dict['shap_factors'] = json.loads(pred_dict.get('shap_factors_json') or '[]')
        student['prediction'] = pred_dict
    else:
        student['prediction'] = None

    # Recommendations
    c.execute("SELECT * FROM recommendations WHERE student_id = ? ORDER BY created_at DESC LIMIT 1", (student_id,))
    rec_row = c.fetchone()
    if rec_row:
        rec_dict = dict(rec_row)
        rec_dict['study_plan'] = json.loads(rec_dict.get('study_plan_json') or '{}')
        rec_dict['action_items'] = json.loads(rec_dict.get('action_items_json') or '[]')
        student['recommendations'] = rec_dict
    else:
        student['recommendations'] = None

    conn.close()
    return student

def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate a user and return their profile with role."""
    conn = get_connection()
    c = conn.cursor()
    pw_hash = hash_password(password)
    c.execute("SELECT * FROM users WHERE LOWER(username) = LOWER(?) AND password_hash = ?", (username, pw_hash))
    user = c.fetchone()
    conn.close()
    if user:
        return dict(user)
    return None

def import_uploaded_dataset(df: pd.DataFrame) -> Tuple[bool, str, int]:
    """
    Validate and ingest uploaded college CSV or Excel file.
    Expected schema: Student_ID, Name, Department, Semester, Attendance, Internal_Marks, Assignment_Marks, Quiz_Marks, Study_Hours, Previous_CGPA, Backlogs, Final_Marks
    """
    required_cols = [
        "Student_ID", "Name", "Department", "Semester",
        "Attendance", "Internal_Marks", "Assignment_Marks",
        "Quiz_Marks", "Study_Hours", "Previous_CGPA", "Backlogs"
    ]
    # Normalize column names
    col_map = {c.strip().lower(): c for c in df.columns}
    missing = []
    for req in required_cols:
        matched = False
        for k in col_map:
            if k == req.lower() or k.replace("_", "") == req.lower().replace("_", ""):
                matched = True
                break
        if not matched:
            missing.append(req)

    if missing:
        return False, f"Missing required columns: {', '.join(missing)}", 0

    conn = get_connection()
    c = conn.cursor()
    inserted_count = 0

    for _, row in df.iterrows():
        try:
            # Handle possible slight column name variations
            def get_val(name, default=None):
                for col in df.columns:
                    if col.lower().replace("_", "") == name.lower().replace("_", ""):
                        return row[col]
                return default

            stu_id = str(get_val("Student_ID", f"STU-UP-{inserted_count+1}")).strip()
            name = str(get_val("Name", "Student")).strip()
            dept = str(get_val("Department", "General Engineering")).strip()
            sem = int(float(get_val("Semester", 4)))
            att = float(get_val("Attendance", 75.0))
            study_hrs = float(get_val("Study_Hours", 2.5))
            cgpa = float(get_val("Previous_CGPA", 7.0))
            backlogs = int(float(get_val("Backlogs", 0)))
            internal = float(get_val("Internal_Marks", 12.0))
            assignment = float(get_val("Assignment_Marks", 14.0))
            quiz = float(get_val("Quiz_Marks", 13.0))

            # Risk computation
            if att < 70 or backlogs >= 2 or cgpa < 6.0:
                risk = "High"
            elif att < 80 or backlogs == 1 or cgpa < 7.5:
                risk = "Moderate"
            else:
                risk = "Low"

            # Predicted score on 20 scale
            pred = round(min(20.0, max(4.0, (cgpa / 10.0) * 12.0 + (att / 100.0) * 4.0 + (study_hrs / 5.0) * 2.0 + (internal / 20.0) * 2.0 - backlogs * 1.5)), 1)

            c.execute("""
                INSERT OR REPLACE INTO students (student_id, user_id, name, email, department, semester, cgpa, attendance, backlogs, study_hours, risk_level, predicted_score, weak_subject, strong_subject)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                stu_id, None, name, f"{stu_id.lower()}@college.edu",
                dept, sem, cgpa, att, backlogs, study_hrs, risk, pred,
                "Mathematics" if risk == "High" else ("DBMS" if risk == "Moderate" else "None"),
                "Programming"
            ))
            inserted_count += 1
        except Exception as e:
            continue

    conn.commit()
    conn.close()
    return True, f"Successfully imported {inserted_count} student records into database.", inserted_count

if __name__ == "__main__":
    init_db(force_reseed=True)
    kpis = get_kpis()
    print("KPIs:", kpis)

