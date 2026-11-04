# Trekverse AI — Module Showcase & Visual Catalog

## Tagline: Predict. Understand. Improve. Succeed.

This catalog details all core visual modules and empirical outputs of the **Trekverse AI — Student Academic Intelligence & Early-Warning System**.

---

## 📸 Empirical Model Evaluation Figures (Generated & Verified)

The following publication-grade evaluation figures were computed and rendered directly from the production machine learning models and verified benchmark dataset ($N = 395$):

| Figure # | Visual Output | Relative File Path | Metric / Finding |
| :---: | :--- | :--- | :--- |
| **01** | **Multi-Model Benchmark Comparison** | [`reports/figures/01_model_comparison_benchmark.png`](../../reports/figures/01_model_comparison_benchmark.png) | 7-Model Comparison (Gradient Boosting $R^2 = 87.4\%$, Random Forest $R^2 = 86.4\%$, Ridge $85.9\%$, OLS $85.8\%$, SVR $84.1\%$, KNN $81.5\%$, Decision Tree $79.2\%$) |
| **02** | **Early-Warning Confusion Matrix** | [`reports/figures/02_early_warning_confusion_matrix.png`](../../reports/figures/02_early_warning_confusion_matrix.png) | Held-Out Test Set ($N = 79$): 77 TP, 1 FP, 0 FN, 1 TN (**98.73% Accuracy**, **100.00% Recall**) |
| **03** | **Receiver Operating Characteristic (ROC)** | [`reports/figures/03_model_roc_auc_curve.png`](../../reports/figures/03_model_roc_auc_curve.png) | Early Academic Failure Classification (**AUC = 0.955**) |
| **04** | **SHAP Global Feature Importance** | [`reports/figures/04_shap_global_feature_importance.png`](../../reports/figures/04_shap_global_feature_importance.png) | TreeExplainer Exact Attribution (Midterm 2: $81.98\%$, Midterm 1: $10.13\%$, Attendance: $2.65\%$) |
| **05** | **4-Tier Institutional Risk Stratification** | [`reports/figures/05_risk_stratification_distribution.png`](../../reports/figures/05_risk_stratification_distribution.png) | Low Risk: 219 (55.4%), Moderate: 21 (5.3%), High: 87 (22.0%), Critical: 68 (17.2%) |
| **06** | **Academic Metric Correlation Heatmap** | [`reports/figures/06_academic_correlation_matrix.png`](../../reports/figures/06_academic_correlation_matrix.png) | Empirical Pearson correlation coefficients across grades, attendance, study time, and failures |
| **07** | **Student Behavioral Clustering (PCA)** | [`reports/figures/07_student_clustering_pca.png`](../../reports/figures/07_student_clustering_pca.png) | K-Means ($K=4$) cluster centroids and engagement profiles projected onto 2 principal components |

---

## 🖥️ Manual Screen Capture Guide (For Live Running App)

To capture screenshots of the active running application without fabrication, run either the Streamlit web application or the React TypeScript dashboard and capture the following screens:

### Step 1: Start the Local Application
```bash
# Option A: Full Multi-Role Streamlit Platform
streamlit run app/app.py
# (Runs on http://localhost:8501)

# Option B: React + Vite Interactive Client
cd frontend
npm install
npm run dev
# (Runs on http://localhost:5173)
```

### Step 2: Capture Target Screens

| # | Screen Name | Suggested Path | Route / Login Role | Key Elements to Include |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Main Executive Dashboard** | `docs/screenshots/01_main_dashboard.png` | Overview (`/`) / Admin or Faculty | 4 KPI stat cards, department filters, live cohort breakdown |
| **02** | **Admin Governance Console** | `docs/screenshots/02_admin_dashboard.png` | Admin (`app/pages/admin.py` or `/admin/users`) | College CSV/XLSX file upload widget, schema validation summary |
| **03** | **Faculty Triage Dashboard** | `docs/screenshots/03_faculty_dashboard.png` | Faculty (`app/pages/faculty.py` or `/risk`) | Student risk matrix, clinical directives log, high-risk triage list |
| **04** | **Student Academic Dossier** | `docs/screenshots/04_student_dashboard.png` | Student (`app/pages/student.py` or `/student-portal`) | STU1024 profile, 5-subject academic radar chart, CGPA trend |
| **05** | **Performance Prediction Simulator** | `docs/screenshots/05_performance_predictions.png` | Predict (`app/pages/prediction.py` or `/predict`) | What-If parameter sliders, confidence interval bar, simulation disclaimer |
| **06** | **Personalized Study Recommendations**| `docs/screenshots/06_learning_recommendations.png` | Recommendations (`/recommendations`) | Weekly study timetable, diagnostic assignments, habit coaching |
| **07** | **Exploratory Data Analytics (EDA)** | `docs/screenshots/07_data_visualizations.png` | Analytics (`app/pages/analytics.py` or `/dataset`) | Feature distributions, missing value audit, correlation charts |
| **08** | **Model Benchmark & Cross-Validation**| `docs/screenshots/08_model_evaluation.png` | Testing (`app/pages/analytics.py` or `/models`) | 7-model benchmark leaderboard, test error residuals |
| **09** | **Explainability & SHAP Waterfall** | `docs/screenshots/09_explainability_shap.png` | XAI (`app/pages/analytics.py` or `/explainability`) | Individual student SHAP attribution waterfall, feature drivers |

---

## 📑 Generated PDF Reports & Outputs

All report artifacts are pre-compiled and available in the repository:
- **Sample Benchmark Student PDF Report**: [`outputs/STU1024_sample_academic_report.pdf`](../../outputs/STU1024_sample_academic_report.pdf) (Pure Python vector PDF with digital verification token)
- **Executive Analytics PDF Report**: [`outputs/trekverse_executive_analytics_report_sample.pdf`](../../outputs/trekverse_executive_analytics_report_sample.pdf)
- **Benchmark Evaluation Report**: [`reports/evaluation/model_evaluation_report.md`](../../reports/evaluation/model_evaluation_report.md)
- **Dataset Analysis Report**: [`reports/evaluation/dataset_analysis_report.md`](../../reports/evaluation/dataset_analysis_report.md)
- **Risk Stratification Report**: [`reports/evaluation/risk_analysis_report.md`](../../reports/evaluation/risk_analysis_report.md)
