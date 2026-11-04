"""
TREKVERSE AI — Dedicated Academic Support Group Classification Pipeline
Fulfills Assignment Requirement § 6.2:
Categorizes students into:
1. Low Support     (Score >= 70 | High engagement, self-directed learning)
2. Medium Support  (Score 55 - 69 | Targeted skill clinics & tutoring)
3. High Support    (Score < 55  | Intensive triage, mandatory advising & mentor pairing)

Trains and evaluates:
- Baseline: DummyClassifier (most_frequent)
- Logistic Regression
- Decision Tree Classifier
- Random Forest Classifier (Ensemble)
- Gradient Boosting Classifier (Ensemble)

Computes Accuracy, Precision, Recall, F1-Score (Macro & Weighted), and Confusion Matrix.
Saves model to models/support_classifier.pkl and metrics to reports/evaluation/classification_benchmark.json.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODELS_DIR = os.path.join(BASE_DIR, "models")
EVAL_DIR = os.path.join(BASE_DIR, "reports", "evaluation")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(EVAL_DIR, exist_ok=True)

def define_support_category(row) -> str:
    """
    Justified Target Definition:
    - High Support: Final exam < 55 OR attendance < 70 OR pastFailures >= 2
    - Medium Support: Final exam between 55 and 69
    - Low Support: Final exam >= 70 AND attendance >= 75
    """
    score = row.get("finalExamScore", 65.0)
    attendance = row.get("attendanceRate", 80.0)
    failures = row.get("pastFailures", 0)

    if score < 55.0 or attendance < 70.0 or failures >= 2:
        return "High Support"
    elif score >= 70.0 and attendance >= 75.0:
        return "Low Support"
    else:
        return "Medium Support"

def load_and_prepare_data():
    """Load benchmark dataset and compute engineered features."""
    csv_path = os.path.join(BASE_DIR, "frontend", "public", "data", "student_performance_benchmark.csv")
    df = pd.read_csv(csv_path)

    # Derived Features (Assignment § 6.4)
    df["assessment_trend"] = df["midterm2Score"] - df["midterm1Score"]
    df["engagement_consistency"] = (df["attendanceRate"] * 0.6) + ((100 - df["absences"] * 5).clip(0, 100) * 0.4)

    # Target support class
    df["support_group"] = df.apply(define_support_category, axis=1)

    feature_cols = [
        "studyTimeWeeklyHours", "attendanceRate", "absences", "pastFailures",
        "midterm1Score", "midterm2Score", "sleepHours", "travelTimeMinutes",
        "assessment_trend", "engagement_consistency"
    ]

    X = df[feature_cols].copy()
    y = df["support_group"].copy()
    return X, y, feature_cols

def run_classification_pipeline():
    print("=" * 65)
    print("TREKVERSE AI: Support Group Classification Benchmark (§ 6.2)")
    print("=" * 65)

    X, y, feature_cols = load_and_prepare_data()
    class_labels = ["Low Support", "Medium Support", "High Support"]
    class_distribution = y.value_counts().to_dict()
    print("Class Distribution:", class_distribution)

    # 80/20 train/test split with stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Save preprocessing scaler
    joblib.dump(scaler, os.path.join(MODELS_DIR, "classification_scaler.pkl"))

    models = {
        "Dummy (Majority Class Baseline)": DummyClassifier(strategy="most_frequent"),
        "Logistic Regression": LogisticRegression(max_iter=500, random_state=42, class_weight="balanced"),
        "Decision Tree Classifier": DecisionTreeClassifier(max_depth=5, min_samples_split=6, random_state=42),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42, class_weight="balanced"),
        "Gradient Boosting Classifier": GradientBoostingClassifier(n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42)
    }

    benchmark_results = {
        "task": "Student Support Group Classification (3-Class: Low, Medium, High Support)",
        "dataset_total": len(X),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "class_labels": class_labels,
        "class_distribution": class_distribution,
        "features_used": feature_cols,
        "models": {}
    }

    best_f1 = -1.0
    best_model_name = None
    best_model_obj = None

    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)

        acc = float(accuracy_score(y_test, y_pred))
        p_macro, r_macro, f1_macro, _ = precision_recall_fscore_support(y_test, y_pred, average="macro", zero_division=0)
        p_weighted, r_weighted, f1_weighted, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)
        cm = confusion_matrix(y_test, y_pred, labels=class_labels).tolist()

        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring="f1_macro")
        cv_mean = float(cv_scores.mean())
        cv_std = float(cv_scores.std())

        benchmark_results["models"][name] = {
            "accuracy": round(acc, 4),
            "macro_precision": round(float(p_macro), 4),
            "macro_recall": round(float(r_macro), 4),
            "macro_f1": round(float(f1_macro), 4),
            "weighted_f1": round(float(f1_weighted), 4),
            "cv_f1_macro_mean": round(cv_mean, 4),
            "cv_f1_macro_std": round(cv_std, 4),
            "confusion_matrix": cm
        }

        print(f"[{name}] Acc: {acc:.4f} | Macro F1: {f1_macro:.4f} | 5-Fold CV: {cv_mean:.4f} ± {cv_std:.4f}")

        if f1_macro > best_f1 and "Dummy" not in name:
            best_f1 = f1_macro
            best_model_name = name
            best_model_obj = model

    benchmark_results["best_model"] = best_model_name
    benchmark_results["best_macro_f1"] = round(best_f1, 4)

    # Save primary classification model
    joblib.dump(best_model_obj, os.path.join(MODELS_DIR, "support_classifier.pkl"))
    print(f"\nSaved Best Classifier ({best_model_name}) to models/support_classifier.pkl")

    # Save metrics JSON
    out_json = os.path.join(EVAL_DIR, "classification_benchmark.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(benchmark_results, f, indent=2)
    print(f"Saved benchmark results to {out_json}")

    return benchmark_results

if __name__ == "__main__":
    run_classification_pipeline()

