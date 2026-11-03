"""
TREKVERSE AI Comprehensive Test Suite
Tests:
1. Benchmark Dataset Schema & Bounds
2. Database Schema, Seeding & Query Helpers
3. Multi-Model Inference & Subject-Wise Forecasting
4. What-If Simulator Reactivity & Simulation Disclaimers
5. Explainable AI (SHAP) Factor Attribution
6. Pure-Python Vector PDF Report Generator
7. College CSV / Excel Data Ingestion Validation
"""

import os
import pytest
import pandas as pd
import numpy as np

from database.database import init_db, get_kpis, get_all_students, get_student_detail, import_uploaded_dataset
from src.prediction.predictor import predictor
from src.explainability.shap_explainer import explainer
from src.recommendations.study_planner import generate_weekly_study_plan, generate_intervention_actions
from src.clustering.student_segments import StudentSegmenter
from reports.report_generator import generate_student_pdf_report

@pytest.fixture(scope="module")
def setup_db():
    init_db(force_reseed=True)
    return True

def test_database_initialization_and_kpis(setup_db):
    kpis = get_kpis()
    assert kpis["total_students"] >= 290
    assert 7.0 <= kpis["avg_cgpa"] <= 9.0
    assert 75.0 <= kpis["avg_attendance"] <= 95.0
    assert kpis["high_risk"] > 0
    assert kpis["moderate_risk"] > 0
    assert kpis["low_risk"] > 0

def test_stu1024_benchmark_record(setup_db):
    stu = get_student_detail("STU1024")
    assert stu is not None
    assert stu["student_id"] == "STU1024"
    assert stu["attendance"] == 68.0
    assert stu["risk_level"] == "Moderate"
    assert stu["weak_subject"] == "Mathematics"
    assert stu["backlogs"] == 1
    assert 12.0 <= stu["predicted_score"] <= 15.0

def test_multi_model_predictions():
    sample_input = {
        "attendance": 68.0,
        "study_hours": 2.0,
        "internal_marks": 12.0,
        "assignment_marks": 14.0,
        "quiz_marks": 11.5,
        "previous_cgpa": 6.8,
        "backlogs": 1
    }
    for model_name in ["Random Forest", "XGBoost", "CatBoost", "LightGBM"]:
        res = predictor.predict(sample_input, model_name=model_name)
        assert "predicted_score" in res
        assert 4.0 <= res["predicted_score"] <= 20.0
        assert len(res["confidence_interval"]) == 2
        assert res["confidence_interval"][0] <= res["predicted_score"] <= res["confidence_interval"][1]
        assert res["risk_level"] in ["High", "Moderate", "Low"]
        assert len(res["subject_predictions"]) == 5
        assert "Mathematics" in res["subject_predictions"]
        assert "Programming" in res["subject_predictions"]

def test_what_if_simulation():
    baseline = {
        "attendance": 72.0,
        "study_hours": 2.0,
        "internal_marks": 12.0,
        "assignment_marks": 12.0,
        "quiz_marks": 12.0,
        "previous_cgpa": 6.8,
        "backlogs": 1
    }
    improved = {
        "attendance": 90.0,
        "study_hours": 4.0,
        "internal_marks": 14.0,
        "assignment_marks": 19.0,
        "quiz_marks": 15.0,
        "previous_cgpa": 6.8,
        "backlogs": 1
    }
    sim = predictor.simulate_what_if(baseline, improved)
    assert sim["score_delta"] > 0
    assert "Model Simulation" in sim["disclaimer"]
    assert sim["simulated"]["predicted_score"] > sim["baseline"]["predicted_score"]

def test_shap_explainer():
    sample_input = {
        "attendance": 70.0,
        "study_hours": 2.0,
        "internal_marks": 11.0,
        "assignment_marks": 13.0,
        "quiz_marks": 12.0,
        "previous_cgpa": 6.5,
        "backlogs": 2
    }
    factors = explainer.explain_instance(sample_input)
    assert len(factors) >= 5
    for f in factors:
        assert "feature" in f or "factor" in f
        assert "impact" in f

def test_study_plan_generation():
    plan = generate_weekly_study_plan(weak_subject="DBMS", cgpa=6.8, attendance=71.0)
    assert "Monday" in plan
    assert "DBMS" in plan["Monday"] or "DBMS" in plan["Wednesday"]
    assert "Friday" in plan

def test_student_segmentation():
    df_stus = get_all_students()
    segmenter = StudentSegmenter(n_clusters=4)
    df_clustered = segmenter.fit_predict(df_stus)
    assert "cluster_id" in df_clustered.columns
    assert "pca_x" in df_clustered.columns
    assert "pca_y" in df_clustered.columns
    profiles = segmenter.get_cluster_profiles(df_clustered)
    assert len(profiles) == 4

def test_pdf_report_compilation():
    stu = get_student_detail("STU1024")
    pdf_bytes = generate_student_pdf_report(stu)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 2000
    assert pdf_bytes.startswith(b"%PDF-1.4")
    assert pdf_bytes.strip().endswith(b"%%EOF")

def test_college_dataset_upload_validation():
    valid_data = pd.DataFrame([{
        "Student_ID": "COL-TEST-01",
        "Name": "Test Student",
        "Department": "Computer Science & AI",
        "Semester": 4,
        "Attendance": 88.0,
        "Internal_Marks": 15.0,
        "Assignment_Marks": 16.5,
        "Quiz_Marks": 14.0,
        "Study_Hours": 3.5,
        "Previous_CGPA": 8.2,
        "Backlogs": 0,
        "Final_Marks": 16.0
    }])
    success, msg, count = import_uploaded_dataset(valid_data)
    assert success is True
    assert count == 1
    
    # Missing columns check
    invalid_data = pd.DataFrame([{"Student_ID": "ERR-01"}])
    success_err, msg_err, count_err = import_uploaded_dataset(invalid_data)
    assert success_err is False
    assert "Missing required columns" in msg_err
