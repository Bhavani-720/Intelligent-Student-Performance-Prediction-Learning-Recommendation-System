# Deliverable 9: Test Cases & Automated Test Results Document
## Trekverse AI — Quality Assurance, Robustness & Pipeline Validation

**Assignment Standard:** Fulfills Assignment Requirements § 4 (*"Testing: Unit tests for preprocessing, inference, and key application functions"*), § 8 (*"Robustness: missing or perturbed inputs"*), and § 11.9 (*"Test cases and test-results document"*).

---

## 1. Test Architecture & Scope
The automated verification suite executes via **PyTest** across two distinct test modules:
1. **Core Pipeline & Integration Suite** (`tests/test_pipeline.py`): 9 Unit & Integration Tests.
2. **Robustness & Input Perturbation Suite** (`tests/test_robustness.py`): 4 Non-Trivial Perturbation Tests.

Total Test Suite Coverage: **13 Automated Test Cases (100% Passing)**.

---

## 2. Test Case Specification Matrix

| Test ID | Test Function Name | Target Module | Test Category | Specification & Verification Criteria | Status |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **TC-01** | `test_database_initialization_and_kpis` | `database/database.py` | Database / Integration | Verifies SQLite seeding of $\ge 290$ students, table relational integrity, and plausible KPI metrics ($7.0 \le \text{CGPA} \le 9.0$, $75\% \le \text{Att} \le 95\%$). | **PASSED** |
| **TC-02** | `test_stu1024_benchmark_record` | `database/database.py` | Data Integrity | Asserts specific benchmark student `STU1024` attributes: Attendance = 68%, Moderate Risk, Weakness = Mathematics, Backlogs = 1. | **PASSED** |
| **TC-03** | `test_multi_model_predictions` | `src/prediction/predictor.py` | ML Inference | Asserts valid bounded inference ($4.0 \le \hat{y} \le 20.0$), confidence intervals, and 5-subject forecasts across Random Forest, XGBoost, CatBoost, and LightGBM. | **PASSED** |
| **TC-04** | `test_what_if_simulation` | `src/prediction/predictor.py` | Simulator | Verifies that increasing study hours and attendance produces positive score deltas and enforces mandatory simulation disclaimers. | **PASSED** |
| **TC-05** | `test_shap_explainer` | `src/explainability/shap_explainer.py` | Explainable AI | Verifies `TreeExplainer` generates $\ge 5$ feature attribution objects with correct impact signs and feature labels. | **PASSED** |
| **TC-06** | `test_study_plan_generation` | `src/recommendations/study_planner.py` | Logic / Rule Engine | Asserts that weekly study plan contains identified weak subject on priority revision days (Monday, Wednesday, Friday). | **PASSED** |
| **TC-07** | `test_student_segmentation` | `src/clustering/student_segments.py` | Unsupervised ML | Verifies K-Means assigns students into 4 distinct clusters and computes 2D PCA projection coordinates. | **PASSED** |
| **TC-08** | `test_pdf_report_compilation` | `reports/report_generator.py` | Export Engine | Verifies pure-Python vector PDF engine compiles valid binary starting with `%PDF-1.4` and terminating with `%%EOF`. | **PASSED** |
| **TC-09** | `test_college_dataset_upload_validation` | `database/database.py` | Admin Ingestion | Asserts college CSV/XLSX schema ingestion rejects malformed columns and accepts valid student uploads. | **PASSED** |
| **TC-10** | `test_missing_features_fallback` | `tests/test_robustness.py` | Robustness | Ingests incomplete feature dictionaries; asserts graceful fallback without unhandled exceptions. | **PASSED** |
| **TC-11** | `test_perturbed_input_stability` | `tests/test_robustness.py` | Robustness | Injects Gaussian perturbation ($\sigma = 0.5$ marks); asserts prediction standard deviation remains $< 2.0$. | **PASSED** |
| **TC-12** | `test_extreme_boundary_clipping` | `tests/test_robustness.py` | Robustness | Passes negative and $>100\%$ attendance values; asserts strict clamping within physical ranges ($4.0 \le y \le 20.0$). | **PASSED** |
| **TC-13** | `test_support_classifier_robustness` | `tests/test_robustness.py` | Classification | Verifies 3-class support classifier outputs valid probabilities summing to $1.0 \pm 0.05$ with tailored action texts. | **PASSED** |

---

## 3. Official Test Execution Transcript
```text
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-8.3.4, pluggy-1.6.0
rootdir: C:\Users\bhava\Downloads\trekverse-ai---student-success-intelligence-hub (1)
plugins: anyio-4.15.1
collected 13 items

tests/test_pipeline.py::test_database_initialization_and_kpis PASSED     [  7%]
tests/test_pipeline.py::test_stu1024_benchmark_record PASSED             [ 15%]
tests/test_pipeline.py::test_multi_model_predictions PASSED              [ 23%]
tests/test_pipeline.py::test_what_if_simulation PASSED                   [ 30%]
tests/test_pipeline.py::test_shap_explainer PASSED                       [ 38%]
tests/test_pipeline.py::test_study_plan_generation PASSED                [ 46%]
tests/test_pipeline.py::test_student_segmentation PASSED                 [ 53%]
tests/test_pipeline.py::test_pdf_report_compilation PASSED               [ 61%]
tests/test_pipeline.py::test_college_dataset_upload_validation PASSED    [ 69%]
tests/test_robustness.py::test_missing_features_fallback PASSED          [ 76%]
tests/test_robustness.py::test_perturbed_input_stability PASSED          [ 84%]
tests/test_robustness.py::test_extreme_boundary_clipping PASSED          [ 92%]
tests/test_robustness.py::test_support_classifier_robustness PASSED      [100%]

======================= 13 passed in 9.55s =======================
```

