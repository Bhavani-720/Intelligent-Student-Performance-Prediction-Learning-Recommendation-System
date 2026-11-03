import os
import shutil
import pandas as pd
import numpy as np

raw_dir = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
processed_dir = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
os.makedirs(raw_dir, exist_ok=True)
os.makedirs(processed_dir, exist_ok=True)

# 1. Copy benchmark dataset if exists in frontend
src_bench = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data", "student_performance_benchmark.csv")
dst_bench = os.path.join(raw_dir, "student_performance_benchmark.csv")
if os.path.exists(src_bench):
    shutil.copyfile(src_bench, dst_bench)
    print("Copied benchmark dataset to data/raw/")

# 2. Create sample college dataset with schema:
# Student_ID, Name, Department, Semester, Attendance, Internal_Marks, Assignment_Marks, Quiz_Marks, Study_Hours, Previous_CGPA, Backlogs, Final_Marks
names = [
    ("Rohan Mehta", "Information Technology"),
    ("Aarav Sharma", "Computer Science & AI"),
    ("Priya Nair", "Electronics & Communication"),
    ("Sneha Patel", "Data Science & Analytics"),
    ("Vikram Verma", "Computer Science & AI"),
    ("Ananya Iyer", "Information Technology"),
    ("Kavya Joshi", "Electronics & Communication"),
    ("Arjun Reddy", "Computer Science & AI"),
    ("Divya Rao", "Data Science & Analytics"),
    ("Harsh Chopra", "Information Technology"),
    ("Meera Kapoor", "Computer Science & AI"),
    ("Sanjay Gupta", "Electronics & Communication"),
    ("Ishaan Das", "Computer Science & AI"),
    ("Bhavya Bhat", "Data Science & Analytics"),
    ("Pooja Malhotra", "Information Technology")
]

college_rows = []
for i, (name, dept) in enumerate(names, start=101):
    stu_id = f"COL-{i}"
    sem = 4
    if i == 101:  # STU1024-like profile
        att = 68.0
        internal = 12.0
        assignment = 14.0
        quiz = 11.5
        study_hrs = 2.0
        cgpa = 6.8
        backlogs = 1
        final_marks = 13.5
    elif i < 105: # High risk profile
        att = float(np.random.uniform(55, 68))
        internal = float(np.random.uniform(8, 11))
        assignment = float(np.random.uniform(10, 13))
        quiz = float(np.random.uniform(7, 10))
        study_hrs = float(np.random.uniform(1.0, 2.0))
        cgpa = float(np.random.uniform(5.2, 6.2))
        backlogs = int(np.random.choice([1, 2, 3]))
        final_marks = float(np.random.uniform(9.0, 11.5))
    elif i < 110: # Moderate risk profile
        att = float(np.random.uniform(72, 79))
        internal = float(np.random.uniform(12, 14.5))
        assignment = float(np.random.uniform(13, 16))
        quiz = float(np.random.uniform(11, 14))
        study_hrs = float(np.random.uniform(2.0, 3.5))
        cgpa = float(np.random.uniform(6.8, 7.6))
        backlogs = int(np.random.choice([0, 1]))
        final_marks = float(np.random.uniform(12.5, 14.8))
    else: # Low risk
        att = float(np.random.uniform(83, 96))
        internal = float(np.random.uniform(15, 19))
        assignment = float(np.random.uniform(16, 20))
        quiz = float(np.random.uniform(15, 19))
        study_hrs = float(np.random.uniform(3.5, 5.5))
        cgpa = float(np.random.uniform(8.0, 9.6))
        backlogs = 0
        final_marks = float(np.random.uniform(15.5, 19.5))

    college_rows.append({
        "Student_ID": stu_id,
        "Name": name,
        "Department": dept,
        "Semester": sem,
        "Attendance": round(att, 1),
        "Internal_Marks": round(internal, 1),
        "Assignment_Marks": round(assignment, 1),
        "Quiz_Marks": round(quiz, 1),
        "Study_Hours": round(study_hrs, 1),
        "Previous_CGPA": round(cgpa, 2),
        "Backlogs": backlogs,
        "Final_Marks": round(final_marks, 1)
    })

college_df = pd.DataFrame(college_rows)
college_csv = os.path.join(raw_dir, "college_students_sample.csv")
college_xlsx = os.path.join(raw_dir, "college_students_sample.xlsx")
college_df.to_csv(college_csv, index=False)
college_df.to_excel(college_xlsx, index=False)
print(f"Created {college_csv} and {college_xlsx}")

