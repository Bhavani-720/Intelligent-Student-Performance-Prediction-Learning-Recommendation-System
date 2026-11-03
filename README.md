# 🎓 TREKVERSE AI — Student Academic Management & Early-Warning System

[![Python Version](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://python.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.30%2B-FF4B4B.svg?logo=streamlit&logoColor=white)](https://streamlit.io)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.6%2B-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![SHAP XAI](https://img.shields.io/badge/Explainability-SHAP-success.svg)](https://shap.readthedocs.io)
[![Testing](https://img.shields.io/badge/Tests-9%2F9%20Passed-brightgreen.svg)](https://pytest.org)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-003B57.svg?logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌐 Live Deployment & Project Links

| Service | Link / Endpoint | Description |
|---|---|---|
| 🌐 **Live Streamlit Web Application** | [**Launch Trekverse AI Web App**](https://trekverse-ai-student-intelligence.streamlit.app) | Production Cloud Interactive Dashboard |
| 🖥️ **Local Dashboard** | `http://localhost:8501` | Local Streamlit multi-role interface |
| 🚀 **FastAPI Backend Swagger Docs** | `http://localhost:8000/docs` | Interactive OpenAPI / Swagger inference endpoints |
| 📦 **GitHub Repository** | [**github.com/trekverse/trekverse-ai-student-intelligence**](https://github.com/trekverse/trekverse-ai-student-intelligence) | Complete source code, models & database |

---

## 🚀 Overview & Executive Transformation

**TREKVERSE AI** is an enterprise-grade Student Academic Management, Performance Forecasting, and Early-Warning Intelligence Platform. It elevates traditional static final-grade regressors into an active, multi-stakeholder decision-support ecosystem for **Administrators**, **Faculty**, and **Students**.

### 🔄 Current Project vs. Upgraded System Architecture

| Feature Category | Original Baseline System | Upgraded Trekverse AI System |
|---|---|---|
| 🎯 **Prediction Scope** | Single final-grade ($G_3$) prediction | **Performance + Multi-Tier Early-Warning Risk Stratification** |
| 👤 **User Management** | Single generic student input form | **Role-Based Login (Admin, Faculty, Student) + Profile History** |
| 🤖 **Machine Learning Pipeline** | Basic Random Forest | **Cross-Comparison: Linear Reg, RF, Gradient Boosting, XGBoost, LightGBM, CatBoost** |
| 🧠 **Explainability (XAI)** | Static feature importances | **Interactive Local & Global SHAP Feature Impact for Every Prediction** |
| 💡 **Intervention Guidance** | Static rule-based notes | **AI-Personalized Weekly Study Planner + Faculty Clinical Directives** |
| 🧩 **Cohort Analysis** | Basic K-Means clustering | **Student Behavioral & Engagement Segmentation + 2D PCA Projections** |
| 📊 **Dashboards** | Single Streamlit screen | **Dedicated Admin + Faculty + Student + Analytics + Reports Dashboards** |
| 📁 **Data Ingestion** | Fixed UCI math dataset (395 records) | **Upload College Datasets (CSV & Excel `.xlsx`) with Automated Schema Validation** |
| 🔮 **Hypothetical Modeling** | None / Static output | **Interactive What-If Scenario Simulator with Statistical Disclaimers** |
| ⚠️ **Warning Alerts** | Minimal warning threshold | **Multi-Factor Early-Warning Alert System (🟢 Low, 🟡 Moderate, 🔴 High Risk)** |
| 📄 **Reporting Workflow** | No automated report delivery | **Pure-Python Vector PDF Academic Diagnostic Report Generator** |
| 🗄️ **Data Persistence** | Static in-memory CSV reading | **ACID-Compliant Relational Database (`trekverse.db`) with `schema.sql`** |

---

## 🏛️ System Architecture

```
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                                 TREKVERSE AI ACADEMY                                   ║
║                         Student Success Intelligence Hub                               ║
╠════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                        ║
║  1. PRESENTATION LAYER (Streamlit + Plotly Interactive Web Platform)                   ║
║     ├── ⚙️ Admin Console        ├── 👩‍🏫 Faculty Dashboard    ├── 👨‍🎓 Student Portal       ║
║     │   • College CSV/XLSX Upload│   • Class Triage Matrix   │   • Personal Profile    ║
║     │   • Schema Validation      │   • STU1024 Drill-Down    │   • Subject Radar Chart ║
║     │   • RBAC User Governance   │   • Clinical Remarks Log  │   • Semester CGPA Trend ║
║     └── 📈 Analytics Engine      └── 🔮 What-If Simulator    └── 📄 PDF Report Center  ║
║                                                                                        ║
║  2. ANALYTICS & DIAGNOSTIC INTELLIGENCE                                                ║
║     ├── Early-Warning System (🟢 Low: 214 | 🟡 Moderate: 58 | 🔴 High Risk: 23)        ║
║     ├── Curriculum Subject Forecasting (Maths, Programming, DBMS, Networks, Hardware)  ║
║     └── K-Means Behavioral Clustering (4 Distinct Student Personas)                   ║
║                                                                                        ║
║  3. MACHINE LEARNING INFERENCE & EXPLAINABLE AI (XAI)                                  ║
║     ├── Linear Regression  →  Random Forest  →  Gradient Boosting                      ║
║     ├── XGBoost Regressor  →  LightGBM Regressor  →  CatBoost Regressor                ║
║     ├── 5-Fold Cross-Validation, MAE, RMSE, R² & Residual Distribution Metrics         ║
║     └── SHAP TreeExplainer Local & Global Feature Attributions                         ║
║                                                                                        ║
║  4. PERSISTENCE & REPORT GENERATION LAYER                                              ║
║     ├── SQLite Database (`database/trekverse.db`) + `schema.sql` ORM Layer             ║
║     │   (users, students, subjects, attendance, marks, predictions, recommendations)   ║
║     └── Vector PDF Report Engine (`reports/report_generator.py`)                       ║
║         (100% Pure Python, PDF-1.4 Compliant, Zero C-dependency)                      ║
╚════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## ✨ 12 Core Upgrades & Feature Breakdown

### 1. ⚠️ Multi-Factor Early-Warning System
Classifies students automatically into three actionable risk categories:
* 🟢 **Low Risk** (Attendance &ge; 80%, CGPA &ge; 7.7, 0 Backlogs) — 214 Students
* 🟡 **Moderate Risk** (Attendance 70–80%, CGPA 6.5–7.6, &le; 1 Backlog) — 58 Students
* 🔴 **High Risk** (Attendance < 70%, Active Backlogs &ge; 1, CGPA < 6.5) — 23 Students

Integrates 9 behavioral and academic vectors:
* Attendance Rate (%)
* Cumulative CGPA
* Prior Course Failures & Backlogs
* Midterm 1 & Midterm 2 Internal Marks
* Assignment Submission & Score Ratios
* Daily Self-Study Hours
* Continuous Quiz Performance
* LMS Learning Activity Rate

### 2. 🔮 Interactive What-If Scenario Simulator
Empowers students and academic advisors to test hypothesized behavioral interventions with real-time recalculations:
* **Baseline Score:** `12.8 / 20` (Moderate Risk)
* **Hypothesized Adjustments:**
  * Attendance Rate: `72% ➔ 90%`
  * Daily Study Time: `2.0 hrs ➔ 4.0 hrs/day`
  * Assignment Quality: `60% ➔ 95%`
* **Simulated Outcome:** `15.4 / 20` (+2.6 marks projected improvement, transition to 🟢 Low Risk)
* **Educational Disclaimer:** Prominently labeled with clear statistical disclaimer noting projections represent model estimations, not guaranteed examination outcomes.

### 3. 👨‍🎓 Comprehensive Student Portal
Dedicated personalized interface for enrolled learners:
* **Student Identity Card:** Name, Student ID, Department, Semester, Active Backlog indicator.
* **Academic Gauges:** Current CGPA (10.0 scale), Attendance rate with 75% regulatory cutoff.
* **Subject Competency Radar Profile:** 5-axis visual mastery radar chart.
* **Historical Semester Trend:** Longitudinal CGPA progression.
* **Weak Subject Alerts:** Flags subjects needing urgent remediation.
* **AI Personalized Weekly Schedule:** Day-by-day learning plan.
* **Embedded What-If Simulator & One-Click PDF Report Download.**

### 4. 👩‍🏫 Faculty Academic Management Hub
Class intelligence and intervention triage for educators:
* **Executive Metrics:** Total cohort, Class Average CGPA, Attendance average, At-Risk counts, Honors students.
* **Interactive Drill-Down (e.g. `STU1024`):**
  * Student: `STU1024` — Rohan Mehta
  * Predicted Score: `13.6 / 20` | Risk: `Moderate` | Attendance: `68%`
  * Weak Area: `Mathematics` | Previous Failures: `1`
  * Recommended Action: `Additional practice + attendance recovery contract`
* **Clinical Remarks Logger:** Direct logging of faculty remarks saved to student records.
* **Subject Bottleneck Analysis & Cross-Student Comparison Tool.**

### 5. 📚 Subject-Wise Performance Forecasting
Forecasts student mastery across individual curriculum modules instead of a solitary aggregate mark:
* **Mathematics (MATH101):** `15.2 / 20`
* **Programming & Data Structures (CS102):** `17.1 / 20` (Strong Subject)
* **Database Management Systems (CS201):** `13.8 / 20` (Needs Attention)
* **Computer Networks (CS202):** `14.6 / 20`
* **Digital Electronics (EC103):** `12.9 / 20` (Needs Attention)

### 6. 🤖 Advanced Multi-Model Machine Learning Pipeline
Upgrades basic Random Forest to a comparative model tournament:
$$\text{Linear Regression} \longrightarrow \text{Random Forest} \longrightarrow \text{Gradient Boosting} \longrightarrow \text{XGBoost} \longrightarrow \text{LightGBM} \longrightarrow \text{CatBoost}$$

#### Benchmark Performance Matrix (5-Fold Cross-Validation)

| Algorithm Architecture | MAE (Marks) | RMSE (Marks) | Test $R^2$ | 5-Fold CV Mean $R^2$ | CV Std Dev ($\pm$) |
|---|---|---|---|---|---|
| **Linear Regression (OLS)** | 1.433 | 1.794 | 0.449 | **0.432** | $\pm 0.029$ |
| **Random Forest Regressor (Tuned)** | 1.443 | 1.824 | 0.431 | **0.376** | $\pm 0.054$ |
| **Gradient Boosting (GBM)** | 1.499 | 1.901 | 0.382 | **0.338** | $\pm 0.054$ |
| **XGBoost Regressor** | 1.532 | 1.945 | 0.353 | **0.358** | $\pm 0.036$ |
| **LightGBM Regressor** | 1.525 | 1.960 | 0.343 | **0.346** | $\pm 0.033$ |
| **CatBoost Regressor** | 1.524 | 1.926 | 0.365 | **0.330** | $\pm 0.074$ |

> [!NOTE]
> **Realistic Educational Validation:** Unlike synthetic tutorials claiming $R^2 \approx 0.99$ through test-leakage, real educational datasets inherently contain human behavioral variances (sleep patterns, personal stress, testing anxiety). Trekverse AI honestly validates and reports realistic $R^2 \in [0.34, 0.45]$ with explicit prediction intervals.

### 7. 📤 College Dataset Ingestion & Validation
Allows institutions to upload their custom cohorts in **CSV** or **Excel (`.xlsx`)**:
* **Validated Schema:** `Student_ID`, `Name`, `Department`, `Semester`, `Attendance`, `Internal_Marks`, `Assignment_Marks`, `Quiz_Marks`, `Study_Hours`, `Previous_CGPA`, `Backlogs`, `Final_Marks`.
* Automatic bounds checking, type casting, missing value handling, risk scoring, and ingestion into the database.
* Sample downloadable templates provided in both CSV and XLSX formats.

### 8. 🗄️ Relational Database Architecture
Replaces fragile flat CSV files with an ACID-compliant schema in `database/schema.sql`:
* `users` — System credentials and role management
* `students` — Core student demographic and academic profiles
* `subjects` — Curriculum subjects and credit values
* `attendance` — Recorded attendance events and rates
* `marks` — Internal, quiz, and midterm marks per course
* `assignments` — Assignment submission timelines and scores
* `predictions` — Multi-model predictions and confidence intervals
* `recommendations` — Personalized AI study plans and clinical remarks

### 9. 🔐 Role-Based Access Control (RBAC)
Dedicated views and access permissions:
* **ADMIN:** Dataset upload, schema migrations, user governance, database reset/reseed.
* **FACULTY:** Cohort triage, student drill-down, remarks logging, batch PDF exports.
* **STUDENT:** Personal academic trajectory, radar profile, What-If simulation, PDF download.
* Includes one-click sidebar role switcher for demonstration convenience.

### 10. 📄 Automatic Vector PDF Student Report Generator
`reports/report_generator.py` compiles publication-grade diagnostic PDF reports in pure Python:
* Conforms to standard **PDF-1.4 specifications** (zero C library or external binary dependencies).
* Features corporate Trekverse branding, student enrollment table, CGPA/attendance metric cards, color-coded risk badge, subject-by-subject forecast table, SHAP attribution list, personalized weekly timetable, faculty clinical remarks, and SHA-256 digital verification token.

### 11. 🧠 Personalized AI Study Planner
Algorithmically generates custom weekly timetables targeted at the student's weakest subject:
```
Student Profile: CGPA = 6.8 | Attendance = 71% | Weak Area = DBMS

📅 AI Study Schedule:
• Monday    ➔ DBMS: 1.5 hours (Relational Algebra & Normalization BCNF/3NF)
• Tuesday   ➔ Hands-on Practice: 1.0 hour (SQL Query Optimization & Indexing)
• Wednesday ➔ DBMS Core Revision: 1.0 hour (Transaction Management & ACID Concurrency)
• Thursday  ➔ Previous Year Question Bank: 1.5 hours (Exam Pattern Problem Sets)
• Friday    ➔ Timed Mock Assessment: 45 minutes (Timed Quiz & Self-Evaluation)
• Saturday  ➔ Faculty Clinic & Peer Discussion: 1.0 hour (Doubt Resolution)
• Sunday    ➔ Weekly Self-Review & Rest: 30 minutes (Trekverse Portal Progress Log)
```

### 12. 🎨 Modern Educational Platform UI
* Streamlit interface built with custom CSS, Inter font typography, gradient hero headers (`#0f172a` deep slate to `#1e1b4b` indigo), glowing KPI metric cards, and responsive Plotly figures.

---

## 📂 Project Structure

```
Trekverse-Student-Performance/
│
├── app/
│   ├── app.py                      # Main application entry point & KPI overview
│   └── pages/
│       ├── admin.py                # Admin console & college dataset upload
│       ├── faculty.py              # Faculty dashboard & student drill-down
│       ├── student.py              # Student portal, radar, & study planner
│       ├── analytics.py            # Cohort trends, risk dist, & clustering
│       ├── prediction.py           # Multi-model inference & what-if simulator
│       └── reports.py              # Formatted dossier & PDF report generator
│
├── data/
│   ├── raw/
│   │   ├── student_performance_benchmark.csv
│   │   ├── college_students_sample.csv
│   │   └── college_students_sample.xlsx
│   ├── processed/
│   └── uploads/                    # Directory for user-uploaded college files
│
├── models/
│   ├── random_forest.pkl           # Trained Random Forest Regressor
│   ├── xgboost.pkl                 # Trained XGBoost Regressor
│   ├── catboost.pkl                # Trained CatBoost Regressor
│   ├── lightgbm.pkl                # Trained LightGBM Regressor
│   ├── preprocessor.pkl            # Serialized feature normalization scaler
│   └── metrics_summary.json        # Cross-validation benchmarks manifest
│
├── src/
│   ├── preprocessing/
│   │   ├── preprocessor.py         # Production data transformer & scaler
│   │   └── create_sample_data.py   # Raw cohort generator
│   ├── feature_engineering/
│   │   └── features.py             # Academic engagement & risk scoring
│   ├── training/
│   │   └── train_models.py         # Multi-model tournament & 5-fold CV
│   ├── prediction/
│   │   └── predictor.py            # Unified inference & what-if simulator
│   ├── explainability/
│   │   └── shap_explainer.py       # SHAP TreeExplainer & feature attribution
│   ├── recommendations/
│   │   └── study_planner.py        # Tailored study planner & interventions
│   └── clustering/
│       └── student_segments.py     # K-Means clustering & PCA 2D projections
│
├── database/
│   ├── schema.sql                  # Relational schema (8 tables)
│   ├── database.py                 # SQLite ORM layer & demo cohort seeder
│   └── trekverse.db                # SQLite database instance (295 students)
│
├── reports/
│   └── report_generator.py         # Pure-Python vector PDF report engine
│
├── tests/
│   └── test_pipeline.py            # Pytest suite (9/9 passing tests)
│
├── frontend/                       # Optional dual-stack React/TypeScript web app
├── requirements.txt                # Python package dependencies
└── README.md                       # Documentation & specifications
```

---

## 🛠️ Installation & Quickstart

### Prerequisites
* Python 3.10, 3.11, or 3.12
* Windows, macOS, or Linux

### 1. Clone the Repository
```bash
git clone https://github.com/trekverse/trekverse-ai-student-intelligence.git
cd trekverse-ai-student-intelligence
```

### 2. Set Up Virtual Environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Initialize Database & Models
```bash
# Initialize SQLite database and seed 295 students
python database/database.py

# Train models and generate serialized artifacts
python src/training/train_models.py
```

### 5. Launch the Streamlit Platform
```bash
streamlit run app/app.py
```
Open **`http://localhost:8501`** in your browser!

### 6. (Optional) Run the FastAPI Backend Service
```bash
python backend/main.py
```
Access the interactive OpenAPI Swagger docs at **`http://localhost:8000/docs`**.

---

## 🧪 Automated Test Suite

Run the full pytest suite to verify all pipeline components, database queries, models, simulations, and PDF report compilation:
```bash
pytest tests/test_pipeline.py -v
```

### Test Verification Status:
```text
tests/test_pipeline.py::test_database_initialization_and_kpis PASSED     [ 11%]
tests/test_pipeline.py::test_stu1024_benchmark_record PASSED             [ 22%]
tests/test_pipeline.py::test_multi_model_predictions PASSED              [ 33%]
tests/test_pipeline.py::test_what_if_simulation PASSED                   [ 44%]
tests/test_pipeline.py::test_shap_explainer PASSED                       [ 55%]
tests/test_pipeline.py::test_study_plan_generation PASSED                [ 66%]
tests/test_pipeline.py::test_student_segmentation PASSED                 [ 77%]
tests/test_pipeline.py::test_pdf_report_compilation PASSED               [ 88%]
tests/test_pipeline.py::test_college_dataset_upload_validation PASSED    [100%]

======================= 9 passed in 3.89s =======================
```

---

## 🔑 Demo Access Credentials

| Role | Username | Password | Full Name & Designation | Primary Permissions |
|---|---|---|---|---|
| ⚙️ **ADMIN** | `admin` | `admin123` | Dr. Suresh Kumar (Dean of Academic Affairs) | Full system governance, college dataset upload, database reset |
| 👩‍🏫 **FACULTY** | `faculty` | `faculty123` | Prof. Ananya Sharma (Lead AI Professor) | Class triage, student drill-down, remarks logging, batch exports |
| 👨‍🎓 **STUDENT** | `stu1024` | `student123` | Rohan Mehta (B.Tech Computer Science) | Personal academic dashboard, radar profile, what-if simulator, PDF download |
| 👨‍🎓 **STUDENT** | `student` | `student123` | Aarav Sharma (B.Tech Artificial Intelligence) | Alternative student benchmark profile |

*(You can also use the **Quick Role Switcher** buttons located directly in the Streamlit sidebar for instant switching without typing passwords).*

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details.

---

## 🤝 Contributing
Contributions, bug reports, and suggestions are warmly welcomed! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.
