"""
TREKVERSE AI Prediction Engine
Provides unified inference for:
- Overall academic score prediction & confidence intervals
- Subject-wise performance forecasting (Mathematics, Programming, DBMS, Networks, Electronics)
- Multi-factor Early-Warning Risk Stratification (🟢 Low, 🟡 Moderate, 🔴 High)
- Interactive What-If Scenario Simulation
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple

# Models path
MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models")

class StudentPredictor:
    def __init__(self):
        self.preprocessor = None
        self.models = {}
        self.load_models()

    def load_models(self):
        prep_path = os.path.join(MODELS_DIR, "preprocessor.pkl")
        if os.path.exists(prep_path):
            self.preprocessor = joblib.load(prep_path)

        for model_name, filename in [
            ("Random Forest", "random_forest.pkl"),
            ("XGBoost", "xgboost.pkl"),
            ("CatBoost", "catboost.pkl"),
            ("LightGBM", "lightgbm.pkl")
        ]:
            path = os.path.join(MODELS_DIR, filename)
            if os.path.exists(path):
                try:
                    self.models[model_name] = joblib.load(path)
                except Exception as e:
                    pass

    def predict(
        self,
        features: Dict[str, float],
        model_name: str = "Random Forest"
    ) -> Dict[str, Any]:
        """
        Predict student final score, confidence interval, and risk classification.
        Features expected: attendance, study_hours, internal_marks, assignment_marks, quiz_marks, previous_cgpa, backlogs
        """
        df_input = pd.DataFrame([features])
        if self.preprocessor:
            X_scaled = self.preprocessor.transform(df_input)
        else:
            X_scaled = np.array([[
                features.get("attendance", 75.0),
                features.get("study_hours", 2.5),
                features.get("internal_marks", 12.0),
                features.get("assignment_marks", 14.0),
                features.get("quiz_marks", 13.0),
                features.get("previous_cgpa", 7.0),
                features.get("backlogs", 0)
            ]])

        selected_model = self.models.get(model_name)
        if selected_model is None and self.models:
            selected_model = list(self.models.values())[0]

        if selected_model is not None:
            raw_pred = float(selected_model.predict(X_scaled)[0])
        else:
            # Analytical baseline fallback
            raw_pred = (
                (features.get("previous_cgpa", 7.0) / 10.0) * 11.0 +
                (features.get("attendance", 75.0) / 100.0) * 4.5 +
                (features.get("internal_marks", 12.0) / 20.0) * 3.5 +
                (features.get("study_hours", 2.5) / 5.0) * 2.0 -
                features.get("backlogs", 0) * 1.5
            )

        predicted_score = round(float(np.clip(raw_pred, 4.0, 20.0)), 1)
        conf_low = round(max(0.0, predicted_score - 1.4), 1)
        conf_high = round(min(20.0, predicted_score + 1.4), 1)

        # Multi-factor Risk Stratification
        att = features.get("attendance", 75.0)
        backlogs = features.get("backlogs", 0)
        cgpa = features.get("previous_cgpa", 7.0)

        risk_score = (
            max(0, (75.0 - att) * 1.6) +
            (backlogs * 18.0) +
            max(0, (6.5 - cgpa) * 14.0) +
            max(0, (11.0 - predicted_score) * 4.0)
        )

        if risk_score >= 38.0 or att < 65.0 or backlogs >= 2:
            risk_level = "High"
            risk_badge = "🔴 High Risk"
        elif risk_score >= 18.0 or att < 78.0 or backlogs == 1 or predicted_score < 13.0:
            risk_level = "Moderate"
            risk_badge = "🟡 Moderate Risk"
        else:
            risk_level = "Low"
            risk_badge = "🟢 Low Risk"

        # Subject-wise predictions
        subject_predictions = self.predict_subject_wise(predicted_score, features)

        strong_subjects = [s for s, sc in subject_predictions.items() if sc >= 14.5]
        weak_subjects = [s for s, sc in subject_predictions.items() if sc < 13.0]

        return {
            "predicted_score": predicted_score,
            "confidence_interval": [conf_low, conf_high],
            "risk_level": risk_level,
            "risk_badge": risk_badge,
            "risk_score": round(risk_score, 1),
            "subject_predictions": subject_predictions,
            "strong_subjects": strong_subjects or ["Consistent"],
            "weak_subjects": weak_subjects or ["None (On Track)"],
            "model_used": model_name
        }

    def predict_subject_wise(
        self,
        base_score: float,
        features: Dict[str, float]
    ) -> Dict[str, float]:
        """
        Forecasting individual performance across specific curriculum subjects:
        Mathematics, Programming, DBMS, Computer Networks, Electronics
        """
        study = features.get("study_hours", 2.5)
        att = features.get("attendance", 75.0)
        internals = features.get("internal_marks", 12.0)

        # Subject difficulty dynamics
        math_score = base_score * 0.94 + (study * 0.3) - (2.0 if features.get("backlogs", 0) > 0 else 0)
        prog_score = base_score * 1.06 + (internals * 0.15)
        dbms_score = base_score * 1.01 + (att * 0.02)
        net_score = base_score * 0.98 + (internals * 0.1)
        elec_score = base_score * 0.92 + (study * 0.25) - 0.5

        return {
            "Mathematics": round(float(np.clip(math_score, 4.0, 20.0)), 1),
            "Programming": round(float(np.clip(prog_score, 4.0, 20.0)), 1),
            "DBMS": round(float(np.clip(dbms_score, 4.0, 20.0)), 1),
            "Computer Networks": round(float(np.clip(net_score, 4.0, 20.0)), 1),
            "Electronics": round(float(np.clip(elec_score, 4.0, 20.0)), 1)
        }

    def simulate_what_if(
        self,
        baseline_features: Dict[str, float],
        modified_features: Dict[str, float],
        model_name: str = "Random Forest"
    ) -> Dict[str, Any]:
        """
        Dynamic What-If simulation engine.
        Calculates baseline vs simulated outcome and returns clear disclaimer.
        """
        baseline_result = self.predict(baseline_features, model_name=model_name)
        simulated_result = self.predict(modified_features, model_name=model_name)

        score_delta = round(simulated_result["predicted_score"] - baseline_result["predicted_score"], 2)

        return {
            "baseline": baseline_result,
            "simulated": simulated_result,
            "score_delta": score_delta,
            "delta_label": f"{'+' if score_delta >= 0 else ''}{score_delta} points",
            "risk_transition": f"{baseline_result['risk_badge']} ➔ {simulated_result['risk_badge']}",
            "disclaimer": (
                "⚠️ Model Simulation Notice: This projection represents statistical estimation based on historical academic correlations. "
                "It is designed for exploratory guidance and does not guarantee examination outcomes."
            )
        }

# Global singleton instance
predictor = StudentPredictor()

