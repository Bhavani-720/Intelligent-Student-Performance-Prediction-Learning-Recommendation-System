# Trekverse AI — Additional Assignment Specifications & Deliverables Index

## Tagline: Predict. Understand. Improve. Succeed.

This document catalogs all additional empirical figures, models, evaluation benchmarks, and formal deliverables generated under the **Strict Add-Only Protocol** to fulfill 100% of the requirements in [**`AI_ML_Project_Assignment.pdf`**](file:///C:/Users/bhava/Downloads/AI_ML_Project_Assignment.pdf).

---

## 📸 Complete Empirical Figures Index (All 8 Figures)

| Figure # | Visual Output | Relative File Path | Metrics & Key Findings |
| :---: | :--- | :--- | :--- |
| **01** | **Multi-Model Benchmark Comparison** | [`reports/figures/01_model_comparison_benchmark.png`](../../reports/figures/01_model_comparison_benchmark.png) | 7-algorithm comparison (Gradient Boosting: $R^2 = 87.4\%$, Random Forest: $R^2 = 86.4\%$, Ridge: $85.9\%$, OLS: $85.8\%$, SVR: $84.1\%$, KNN: $81.5\%$, Decision Tree: $79.2\%$). |
| **02** | **Early-Warning Confusion Matrix** | [`reports/figures/02_early_warning_confusion_matrix.png`](../../reports/figures/02_early_warning_confusion_matrix.png) | Held-out test set ($N=79$): 77 TP, 1 FP, 0 FN, 1 TN (**98.73% Accuracy**, **100.00% Recall / Zero False Negatives**). |
| **03** | **Receiver Operating Characteristic (ROC)** | [`reports/figures/03_model_roc_auc_curve.png`](../../reports/figures/03_model_roc_auc_curve.png) | Early academic failure classification (**AUC = 0.955**). |
| **04** | **SHAP Global Feature Importance** | [`reports/figures/04_shap_global_feature_importance.png`](../../reports/figures/04_shap_global_feature_importance.png) | TreeExplainer exact attribution (Midterm 2: $81.98\%$, Midterm 1: $10.13\%$, Attendance: $2.65\%$, Study Hours: $1.85\%$). |
| **05** | **4-Tier Institutional Risk Stratification** | [`reports/figures/05_risk_stratification_distribution.png`](../../reports/figures/05_risk_stratification_distribution.png) | Low Risk: 219 (55.4%), Moderate: 21 (5.3%), High: 87 (22.0%), Critical: 68 (17.2%). |
| **06** | **Academic Metric Correlation Heatmap** | [`reports/figures/06_academic_correlation_matrix.png`](../../reports/figures/06_academic_correlation_matrix.png) | Empirical Pearson correlation coefficients across exams, attendance, study hours, absences, and backlogs. |
| **07** | **Student Behavioral Clustering (PCA)** | [`reports/figures/07_student_clustering_pca.png`](../../reports/figures/07_student_clustering_pca.png) | K-Means ($K=4$) cluster centroids and engagement profiles projected onto 2 principal components. |
| **08** | **Residual Error Distribution & Q-Q Plot** | [`reports/figures/08_residual_error_distribution.png`](../../reports/figures/08_residual_error_distribution.png) | **(8th Visualization)** Dual-panel residual error normality histogram ($\mu=0.08, \sigma=3.65$) & Predicted vs. Actual scatter plot. |

---

## 📑 Formal Assignment Deliverables (§ 11)

- 📄 **Deliverable 1: Project Proposal & Problem Definition**: [`docs/deliverables/01_project_proposal_and_problem_definition.md`](01_project_proposal_and_problem_definition.md)
- 📋 **Deliverable 2: Dataset Details & Data Dictionary**: [`docs/deliverables/02_dataset_details_and_data_dictionary.md`](02_dataset_details_and_data_dictionary.md)
- 🧹 **Deliverable 3: Cleaned Dataset & Audit Pipeline**: [`data/processed/student_performance_cleaned.csv`](../../data/processed/student_performance_cleaned.csv) & [`src/preprocessing/dataset_audit.py`](../../src/preprocessing/dataset_audit.py)
- 📓 **Deliverable 4: Exploratory Data Analysis Notebook**: [`notebooks/01_exploratory_data_analysis.ipynb`](../../notebooks/01_exploratory_data_analysis.ipynb)
- 🏋️ **Deliverable 5: Model Training Scripts**:
  - Regression: [`src/training/train_models.py`](../../src/training/train_models.py)
  - 3-Class Classification: [`src/training/train_classifiers.py`](../../src/training/train_classifiers.py)
  - Hyperparameter Tuning: [`src/training/hyperparameter_tuning.py`](../../src/training/hyperparameter_tuning.py)
  - Baseline Comparison: [`src/training/baseline_comparison.py`](../../src/training/baseline_comparison.py)
- 💾 **Deliverable 6: Saved Final Model & Scaler Artifacts**:
  - Regression Models: `models/*.pkl` and `ml/models/*.joblib`
  - Classification Model: [`models/support_classifier.pkl`](../../models/support_classifier.pkl)
  - Classification Scaler: [`models/classification_scaler.pkl`](../../models/classification_scaler.pkl)
- 🔍 **Deliverable 7: Explainable AI & SHAP Report**: [`docs/deliverables/07_explainability_report.md`](07_explainability_report.md)
  - Three Individual Case Studies: [`reports/evaluation/individual_explanations.md`](../../reports/evaluation/individual_explanations.md)
- 🌐 **Deliverable 8: Working Web Application**:
  - Streamlit Portal: [`app/app.py`](../../app/app.py) (`http://localhost:8501`)
  - FastAPI Engine: [`backend/main.py`](../../backend/main.py) (`http://localhost:8000/docs`)
  - React Dashboard: `frontend/`
- 🧪 **Deliverable 9: Automated Test Cases & Results**: [`docs/deliverables/09_test_cases_and_test_results.md`](09_test_cases_and_test_results.md)
  - Core Pipeline Tests: [`tests/test_pipeline.py`](../../tests/test_pipeline.py) (9/9 passed)
  - Robustness & Perturbation Tests: [`tests/test_robustness.py`](../../tests/test_robustness.py) (4/4 passed)
- 📽️ **Deliverable 10: Final Technical Report & Slide Deck**: [`docs/deliverables/10_final_technical_report_and_presentation.md`](10_final_technical_report_and_presentation.md)
- 📦 **Deliverable 11: Repository & Setup Instructions**: [`README.md`](../../README.md)
- ⚖️ **Ethics & Governance Charter**: [`docs/deliverables/ethics_and_governance.md`](ethics_and_governance.md)
- 🎓 **Viva & Review Preparation Guide (10 Questions)**: [`docs/viva/viva_preparation_guide.md`](../viva/viva_preparation_guide.md)

