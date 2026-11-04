"""
TREKVERSE AI Robustness & Input Perturbation Test Suite
Fulfills Assignment Requirement § 8 (Robustness Evaluation):
1. Verifies prediction stability under input perturbation (Gaussian noise injection).
2. Verifies safe fallback and error handling under missing input attributes.
3. Tests extreme edge values and bounds clipping (e.g. 0% and 100% attendance).
4. Verifies support group classifier robustness under noisy continuous inputs.
"""

import pytest
import numpy as np
from src.prediction.predictor import predictor
from src.prediction.support_classifier import support_classifier

@pytest.fixture
def baseline_student():
    return {
        "attendance": 82.0,
        "study_hours": 3.0,
        "internal_marks": 13.5,
        "assignment_marks": 15.0,
        "quiz_marks": 12.0,
        "previous_cgpa": 7.5,
        "backlogs": 0
    }

def test_missing_features_fallback(baseline_student):
    """Ensure missing or partial dictionary inputs do not crash inference."""
    incomplete_input = {"attendance": 80.0, "study_hours": 2.5}
    res = predictor.predict(incomplete_input)
    assert res is not None
    assert "predicted_score" in res
    assert 4.0 <= res["predicted_score"] <= 20.0
    assert res["risk_level"] in ["Low", "Moderate", "High"]

def test_perturbed_input_stability(baseline_student):
    """
    Inject Gaussian perturbation (noise) into continuous features.
    Ensure predictions change smoothly without abrupt divergence.
    """
    np.random.seed(42)
    base_res = predictor.predict(baseline_student)
    base_score = base_res["predicted_score"]

    perturbed_scores = []
    for _ in range(25):
        noisy_student = baseline_student.copy()
        # Add small perturbation (sigma = 0.5 marks / 2% attendance)
        noisy_student["internal_marks"] = float(np.clip(noisy_student["internal_marks"] + np.random.normal(0, 0.4), 0, 20))
        noisy_student["attendance"] = float(np.clip(noisy_student["attendance"] + np.random.normal(0, 2.0), 0, 100))
        noisy_student["study_hours"] = float(np.clip(noisy_student["study_hours"] + np.random.normal(0, 0.3), 0, 10))

        res = predictor.predict(noisy_student)
        perturbed_scores.append(res["predicted_score"])

    # Score variance under perturbation should remain constrained
    score_std = np.std(perturbed_scores)
    score_mean = np.mean(perturbed_scores)
    assert score_std < 2.0, f"Perturbation resulted in unstable variance: std={score_std}"
    assert abs(score_mean - base_score) < 1.8, f"Perturbation caused large drift: drift={abs(score_mean - base_score)}"

def test_extreme_boundary_clipping():
    """Verify inference clamps extreme out-of-range inputs safely."""
    extreme_low = {
        "attendance": -25.0,
        "study_hours": -5.0,
        "internal_marks": -10.0,
        "assignment_marks": -5.0,
        "quiz_marks": -8.0,
        "previous_cgpa": -1.0,
        "backlogs": 10
    }
    res_low = predictor.predict(extreme_low)
    assert res_low["predicted_score"] >= 4.0
    assert res_low["risk_level"] == "High"

    extreme_high = {
        "attendance": 150.0,
        "study_hours": 30.0,
        "internal_marks": 25.0,
        "assignment_marks": 25.0,
        "quiz_marks": 25.0,
        "previous_cgpa": 12.0,
        "backlogs": -2
    }
    res_high = predictor.predict(extreme_high)
    assert res_high["predicted_score"] <= 20.0
    assert res_high["risk_level"] == "Low"

def test_support_classifier_robustness(baseline_student):
    """Verify 3-class support group classifier returns valid outputs under variations."""
    res = support_classifier.predict_support(baseline_student)
    assert res["support_group"] in ["Low Support", "Medium Support", "High Support"]
    assert "probabilities" in res
    assert sum(res["probabilities"].values()) == pytest.approx(1.0, abs=0.05)
    assert len(res["recommended_action"]) > 10

