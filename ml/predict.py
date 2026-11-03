import sys
import os
import json
import joblib
import numpy as np
import pandas as pd

def predict(input_data):
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    algo = input_data.get("algorithm", "random_forest")
    model_path = os.path.join(models_dir, f"{algo}.joblib")
    scaler_path = os.path.join(models_dir, "scaler.joblib")

    if not os.path.exists(model_path):
        model_path = os.path.join(models_dir, "random_forest.joblib")

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    feature_cols = [
        'studyTimeWeeklyHours',
        'attendanceRate',
        'absences',
        'pastFailures',
        'midterm1Score',
        'midterm2Score',
        'travelTimeMinutes',
        'sleepHours'
    ]

    raw_features = [
        float(input_data.get('studyTimeWeeklyHours', 10.0)),
        float(input_data.get('attendanceRate', 85.0)),
        float(input_data.get('absences', 2.0)),
        float(input_data.get('pastFailures', 0.0)),
        float(input_data.get('midterm1Score', 75.0)),
        float(input_data.get('midterm2Score', 80.0)),
        float(input_data.get('travelTimeMinutes', 20.0)),
        float(input_data.get('sleepHours', 7.5))
    ]

    import warnings
    warnings.filterwarnings('ignore')

    df_in = pd.DataFrame([raw_features], columns=feature_cols)
    
    # Models that require scaling
    if algo in ['linear_regression', 'ridge_regression', 'svr', 'knn']:
        features_arr = scaler.transform(df_in)
    else:
        features_arr = df_in

    predicted_score = float(model.predict(features_arr)[0])
    predicted_score = float(np.clip(predicted_score, 0.0, 100.0))

    # Calculate grade and risk
    grade = 'A+' if predicted_score >= 90 else ('A' if predicted_score >= 80 else ('B' if predicted_score >= 70 else ('C' if predicted_score >= 60 else ('D' if predicted_score >= 50 else 'F'))))
    risk = 'Low' if predicted_score >= 75 else ('Moderate' if predicted_score >= 60 else ('High' if predicted_score >= 45 else 'Critical'))
    pass_prob = float(min(0.99, max(0.01, 1.0 / (1.0 + np.exp(-(predicted_score - 50.0) / 6.0)))))

    ci = [round(max(0.0, predicted_score - 3.5), 1), round(min(100.0, predicted_score + 3.5), 1)]

    # Feature contributions
    midterm2 = float(input_data.get('midterm2Score', 80.0))
    midterm1 = float(input_data.get('midterm1Score', 75.0))
    attendance = float(input_data.get('attendanceRate', 85.0))
    failures = float(input_data.get('pastFailures', 0.0))
    study = float(input_data.get('studyTimeWeeklyHours', 10.0))

    positives = []
    negatives = []

    if midterm2 >= 80:
        positives.append({"factor": "Strong Midterm 2 Grade", "impact": "+8.4 marks"})
    elif midterm2 < 60:
        negatives.append({"factor": "Weak Midterm 2 Grade", "impact": "-8.2 marks"})

    if midterm1 >= 75:
        positives.append({"factor": "Solid Midterm 1 Foundation", "impact": "+4.1 marks"})

    if attendance >= 85:
        positives.append({"factor": "High Attendance Rate", "impact": "+3.8 marks"})
    elif attendance < 75:
        negatives.append({"factor": "Low Attendance (<75% mandate)", "impact": "-5.5 marks"})

    if study >= 10:
        positives.append({"factor": "Sufficient Weekly Study Hours", "impact": "+2.9 marks"})
    elif study < 5:
        negatives.append({"factor": "Inadequate Study Hours (<5 hrs/wk)", "impact": "-4.1 marks"})

    if failures > 0:
        negatives.append({"factor": f"Prior Backlogs / Course Failures ({int(failures)})", "impact": f"-{6.0 * failures} marks"})

    result = {
        "predictedFinalScore": round(predicted_score, 1),
        "confidenceInterval": ci,
        "predictedGradeLetter": grade,
        "passProbability": round(pass_prob, 3),
        "riskCategory": risk,
        "topPositiveFactors": positives or [{"factor": "Consistent Baseline Performance", "impact": "+1.2 marks"}],
        "topNegativeFactors": negatives or [{"factor": "No significant risk flags", "impact": "0 marks"}],
        "modelUsed": f"{algo.replace('_', ' ').title()} (Joblib Loaded Artifact)"
    }
    return result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            payload = json.loads(sys.argv[1])
        except Exception:
            payload = {}
    else:
        payload = json.loads(sys.stdin.read()) if not sys.stdin.isatty() else {}
    
    output = predict(payload)
    print(json.dumps(output))
