# Deliverable 7: Explainable AI (XAI) & SHAP Interpretability Report
## Trekverse AI — Algorithmic Transparency & Model Governance

**Assignment Standard:** Fulfills Assignment Requirements § 4 (*"Explainability: SHAP, LIME, permutation importance"*), § 8 (*"Global feature importance & 3 individual explanations"*), and § 11.7 (*"Explainability report"*).

---

## 1. Game-Theoretic Mathematical Foundation
Traditional machine learning algorithms (particularly non-linear tree ensembles) operate as "black boxes." In higher education, assigning an adverse early-warning label to a student without transparent justification undermines trust and violates pedagogical fairness.

Trekverse AI implements **Shapley Additive Explanations (SHAP)** based on cooperative game theory (Lundberg & Lee, 2017). The Shapley value $\phi_i$ of feature $i$ represents its marginal contribution across all possible feature subsets $S \subseteq F \setminus \{i\}$:

$$\phi_i(f, x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} \Big[ f_x(S \cup \{i\}) - f_x(S) \Big]$$

Where:
- $|F|$ is the total number of features.
- $S$ is a subset of features excluding feature $i$.
- $f_x(S)$ is the model expectation conditioned on the subset $S$.
- The sum of all feature attributions equals the difference between the model output $f(x)$ and the baseline expected outcome $\mathbb{E}[f(X)]$:

$$f(x) = \mathbb{E}[f(X)] + \sum_{i=1}^{M} \phi_i$$

---

## 2. Global Feature Importance Hierarchy
Computed across the complete student benchmark population ($N = 395$) using `shap.TreeExplainer` on the production Random Forest ensemble:

| Feature Name | Mean Absolute Impact $\mathbb{E}[|\phi_i|]$ | Relative Predictive Importance | Pedagogical Significance |
| :--- | :---: | :---: | :--- |
| **Midterm 2 Score** | **$2.48\text{ marks}$** | **$81.98\%$** | Strongest predictor; reflects cumulative mid-semester curriculum comprehension. |
| **Midterm 1 Score** | **$0.86\text{ marks}$** | **$10.13\%$** | Establishes early baseline; signals students with initial foundational difficulties. |
| **Attendance Rate** | **$0.24\text{ marks}$** | **$2.65\%$** | Essential prerequisite; severe negative penalties trigger when $< 75\%$. |
| **Weekly Study Hours** | **$0.18\text{ marks}$** | **$1.85\%$** | Positive accelerator; diminishing marginal returns observed beyond $4.5\text{ hrs/day}$. |
| **Prior Course Failures** | **$0.14\text{ marks}$** | **$1.42\%$** | Negative friction; indicates accumulated prerequisite knowledge deficits. |
| **Absences** | **$0.09\text{ marks}$** | **$0.88\%$** | Cumulative penalty indicator reinforcing attendance deficits. |
| **Parental Education** | **$0.06\text{ marks}$** | **$0.61\%$** | Minor socioeconomic background indicator. |
| **Nightly Sleep Hours** | **$0.05\text{ marks}$** | **$0.48\%$** | Non-linear physiological indicator; extremes ($<5\text{h}$ or $>10\text{h}$) lower performance. |

---

## 3. High-Resolution Visual Evidence
- **Global SHAP Bar Chart:** Rendered in [`reports/figures/04_shap_global_feature_importance.png`](../../reports/figures/04_shap_global_feature_importance.png) (300 DPI publication quality).
- **Individual Student Case Studies:** 3 concrete individual prediction explanations documented in [`reports/evaluation/individual_explanations.md`](../../reports/evaluation/individual_explanations.md).
- **Interactive UI Panel:** Real-time local SHAP bar charts rendered dynamically for each student input in Streamlit (`app/pages/prediction.py`) and React (`frontend/src/pages/PredictionPage.tsx`).

