"""
TREKVERSE AI — Support Group Prediction Service
Inference service for 3-class academic support group classification:
Low Support | Medium Support | High Support
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODELS_DIR = os.path.join(BASE_DIR, "models")

class StudentSupportClassifier:
    def __init__(self):
        self.model = None
        self.scaler = None
        self._load_artifacts()

    def _load_artifacts(self):
        model_path = os.path.join(MODELS_DIR, "support_classifier.pkl")
        scaler_path = os.path.join(MODELS_DIR, "classification_scaler.pkl")
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            try:
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path)
            except Exception:
                pass

    def predict_support(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Classifies student input into Low, Medium, or High Support.
        Returns predicted class, probabilities, and intervention recommendation.
        """
        study = float(student_data.get("studyTimeWeeklyHours", student_data.get("study_hours", 2.5)))
        att = float(student_data.get("attendanceRate", student_data.get("attendance", 80.0)))
        absences = float(student_data.get("absences", 3))
        failures = int(student_data.get("pastFailures", student_data.get("backlogs", 0)))
        m1 = float(student_data.get("midterm1Score", student_data.get("internal_marks", 13.0)))
        m2 = float(student_data.get("midterm2Score", student_data.get("internal_marks", 13.5)))
        sleep = float(student_data.get("sleepHours", 7.0))
        travel = float(student_data.get("travelTimeMinutes", 20.0))

        trend = m2 - m1
        consistency = (att * 0.6) + ((100.0 - absences * 5.0).clip(0, 100.0) if hasattr((100.0 - absences * 5.0), 'clip') else max(0, min(100, 100 - absences * 5))) * 0.4

        features = [study, att, absences, failures, m1, m2, sleep, travel, trend, consistency]

        if self.model and self.scaler:
            try:
                X_scaled = self.scaler.transform([features])
                pred = self.model.predict(X_scaled)[0]
                probs = self.model.predict_proba(X_scaled)[0] if hasattr(self.model, "predict_proba") else [0.33, 0.33, 0.33]
                classes = list(self.model.classes_)
                prob_dict = {cls: round(float(prob), 3) for cls, prob in zip(classes, probs)}
            except Exception:
                pred = "Medium Support"
                prob_dict = {"Low Support": 0.25, "Medium Support": 0.50, "High Support": 0.25}
        else:
            # Deterministic heuristic fallback
            if m2 < 11.0 or att < 70.0 or failures >= 1:
                pred = "High Support"
            elif m2 >= 14.5 and att >= 80.0:
                pred = "Low Support"
            else:
                pred = "Medium Support"
            prob_dict = {"Low Support": 0.20, "Medium Support": 0.50, "High Support": 0.30}

        actions = {
            "Low Support": "Self-directed advanced modules; peer-mentorship leadership role; elective research tracks.",
            "Medium Support": "Bi-weekly subject clinics; targeted continuous assessment drill-down; study habit coach check-in.",
            "High Support": "Mandatory faculty mentoring; attendance probation monitoring; immediate remedial tutorial assignment."
        }

        return {
            "support_group": pred,
            "probabilities": prob_dict,
            "recommended_action": actions.get(pred, "Standard institutional advising."),
            "assessment_trend": round(trend, 2),
            "engagement_consistency": round(consistency, 1)
        }

support_classifier = StudentSupportClassifier()

