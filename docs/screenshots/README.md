# Trekverse AI — Module Showcase & Visual Catalog

## Tagline: Predict. Understand. Improve. Succeed.

This document details all **13 core enterprise modules** of the **Trekverse AI — Student Academic Intelligence & Early-Warning System**.

---

## Navigation Directory & Module Matrix

| # | Module Name | Route / Path | Primary Audience | Key Functionality |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Executive Overview** | `/` (Overview) | Admin, Faculty | Live KPI cards, department filter, cohort distribution chart, urgent risk counter |
| **02** | **Dataset Architecture** | `/dataset` | All Roles | 395 UCI records audit, 19 feature dictionary, missing value verification, distribution graphs |
| **03** | **Multi-Model Benchmark** | `/models` | Admin, Faculty | 7-model + baseline evaluation table, R², MAE, RMSE, cross-validation variance comparison |
| **04** | **Performance Prediction** | `/predict` | All Roles | What-If Academic Simulator, confidence intervals, local SHAP drivers, subject disclaimers |
| **05** | **Explainable AI (XAI)** | `/explainability` | Admin, Faculty | TreeExplainer global feature hierarchy, dependence plots, individual waterfall attributions |
| **06** | **Academic Risk Classification** | `/risk` | Admin, Faculty | Deterministic 4-tier risk stratification, 155 urgent vs 176 elevated tracking, intervention modal |
| **07** | **Learning Recommendations** | `/recommendations` | All Roles | Personalized remediation roadmap, diagnostic tutorial assignment, habit coaching |
| **08** | **Clustering & Personas** | `/clustering` | Admin, Faculty | Unsupervised K-Means clustering ($K=3$), behavioral archetype profiles, centroid radar charts |
| **09** | **Model Testing & Validation** | `/testing` | Admin, Faculty | Real-time batch test runner, regression error distributions, residual scatter plots |
| **10** | **Institutional Reports** | `/reports` | Admin, Faculty | Executive summary generator, 4-page audit-ready PDF export via jsPDF, CSV data exports |
| **11** | **Admin User Management** | `/admin/users` | Admin Only | Enterprise user registry, BCrypt password enforcement, role elevation controls, audit log |
| **12** | **Faculty Management** | `/faculty` | Admin Only | Faculty departmental directory, mentor-student assignment ratios, active remediation loads |
| **13** | **Student Academic Portal** | `/student-portal` | Student, Faculty | FERPA-isolated personal academic dossier, continuous assessment history, intervention status |

---

## Module Architectural Highlights

### 1. Executive Overview (`src/pages/OverviewPage.tsx`)
- **Key Visual Elements**: 4 primary KPI stat cards with trend sparklines and top gradient accent borders.
- **Dynamic Controls**: Real-time multi-dimensional filter bar (Department, Course, Semester, Risk Status).
- **Security Guard**: Role-aware rendering showing aggregated institutional analytics for faculty/admin while redirecting student accounts to personal records.

### 2. Performance Prediction & What-If Simulator (`src/pages/PredictionPage.tsx`)
- **Interactive Scenarios**: Instant What-If parameter sliders with debounced real-time inference ($< 12\text{ms}$).
- **Compliance Badge**: Prominently displays *"Hypothetical Academic Simulation — Does not guarantee exam results"*.
- **Subject-Specific Disclaimer**: Automatically signals *"Subject-specific prediction unavailable. Additional subject-level training data is required."* when course contexts are selected.

### 3. Explainable AI & SHAP Transparency (`src/pages/ExplainabilityPage.tsx`)
- **Game-Theoretic Rigor**: Implements Lundberg's Shapley Additive Explanations.
- **Audit Findings**: Demonstrates Midterm 2 ($81.98\%$) and Midterm 1 ($10.13\%$) as primary academic trajectory drivers.

### 4. Institutional Risk Stratification (`src/pages/RiskPage.tsx`)
- **Strict Mutually Exclusive Partition**:
  - Low Risk: 219 students (55.4%)
  - Moderate Risk: 21 students (5.3%)
  - High Risk: 87 students (22.0%)
  - Critical Risk: 68 students (17.2%)
  - Total Verified: 395 students (100.0%)
- **Intervention Tracking**: Faculty tracking status strictly marked *"Awaiting Follow-up Assessment"* until empirical post-intervention continuous assessment tests are logged.

### 5. Institutional Reports & 4-Page PDF Engine (`src/pages/ReportsPage.tsx`)
- **Direct PDF Export**: Generates 4-page vector PDF via `jsPDF` containing benchmark audit specifications, confusion matrix, model selection rationale, and ethical AI governance.
- **Zero Hallucination Guarantee**: Fictional signatories and unverified legal compliance certifications are strictly omitted in favor of verifiable benchmark metadata.
