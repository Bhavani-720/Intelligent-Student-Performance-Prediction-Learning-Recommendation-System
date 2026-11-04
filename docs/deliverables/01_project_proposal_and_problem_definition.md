# Deliverable 1: Project Proposal & Problem Definition Document
## Trekverse AI — Intelligent Student Performance Prediction & Early-Warning System

**Project Title:** Intelligent Student Performance Prediction and Personalized Learning Recommendation System  
**Project Level:** Advanced / Final-Year / Industry-Oriented  
**Organization / Role:** Project Manager – Trekverse Edutech  
**Framework:** Python 3.11, Scikit-Learn 1.2+, Streamlit, FastAPI, SHAP, SQLite  

---

## 1. Executive Summary & Problem Formulation
Higher education institutions routinely collect continuous student engagement metrics (attendance records, internal examination scores, LMS quiz submissions, lab assignments, and behavioral indicators). However, educational institutions often fail to convert these disparate data streams into timely, personalized academic support. By the time final semester examination marks are declared, it is too late to execute meaningful instructional interventions.

**The Core Challenge:**
Can an end-to-end AI/ML architecture estimate student academic outcomes early in the semester, stratify student cohorts into objective support groups, explain the precise empirical drivers behind each prediction using game-theoretic interpretability, and deliver actionable personalized learning plans—all while upholding privacy and avoiding unfair, unsupported conclusions?

---

## 2. Project Objectives
1. **Reproducible Data Pipeline:** Clean, audit, and preprocess educational telemetry from the UCI Machine Learning Student Performance Benchmark ($N = 395$) and real-world college datasets.
2. **Supervised Regression & Classification:**
   - Predict continuous final academic marks ($0 - 20$ scale and $0 - 100\%$).
   - Classify students into 3 actionable support tiers: **Low Support**, **Medium Support**, and **High Support**.
3. **Unsupervised Behavioral Archetyping:** Segment students into 4 engagement clusters via K-Means without utilizing final exam labels to identify distinct learning personas.
4. **Transparent Explainable AI (XAI):** Deploy Lundberg's `shap.TreeExplainer` to compute exact Shapley attributions, providing both global curriculum insights and individual student diagnostic waterfalls.
5. **Personalized Study Remediation:** Automatically map identified subject deficits and behavioral bottlenecks into targeted weekly study plans and clinical faculty directives.
6. **Multi-Role Web Application:** Deploy an intuitive web portal for Administrators (data upload, user governance), Faculty (cohort triage, clinical remarks logging), and Students (personal academic dossier, what-if simulation, and vector PDF download).
7. **Ethical AI & Governance:** Enforce decision-support framing, zero hallucination guarantees, strict PII privacy, and model limitation disclosures.

---

## 3. System Architecture & Component Mapping
```
Raw Academic Telemetry (CSV / XLSX / SQLite)
   │
   ▼
[Data Preprocessing & Validation Pipeline]
   ├── Missing Value & Duplicate Auditing
   ├── Outlier Detection & Range Bounds Clipping
   └── StandardScaler & Categorical Encoders (Fitted on Train Split Only)
   │
   ├──► [Supervised Regression Engine] ──► Final Exam Score (R² = 86.4%, MAE = 3.55)
   ├──► [3-Class Support Classifier]   ──► Low / Medium / High Support (F1 = 0.955)
   ├──► [K-Means Unsupervised Cluster] ──► 4 Behavioral Personas (PCA Projection)
   └──► [SHAP TreeExplainer XAI]       ──► Local & Global Feature Attributions
   │
   ▼
[Presentation & Delivery Layer]
   ├── Streamlit Web Platform (Port 8501)
   ├── FastAPI Inference Engine (Port 8000)
   ├── Pure-Python Vector PDF Generator (Adobe/Chrome Compliant)
   └── Relational SQLite Database (trekverse.db)
```

---

## 4. Hardware & Software Requirements
- **Operating Environment:** Windows 10/11, Linux (Ubuntu 20.04+), or macOS
- **Runtime:** Python 3.10+ (Tested on Python 3.11.9)
- **Primary Dependencies:** `streamlit`, `scikit-learn`, `pandas`, `numpy`, `plotly`, `matplotlib`, `shap`, `joblib`, `pytest`, `fastapi`, `uvicorn`
- **Memory & Storage:** 4 GB RAM minimum (8 GB recommended); 500 MB disk space

