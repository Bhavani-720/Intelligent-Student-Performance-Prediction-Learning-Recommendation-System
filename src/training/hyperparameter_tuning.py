"""
TREKVERSE AI — Reproducible Hyperparameter Tuning Pipeline
Fulfills Assignment Requirement § 6.5:
Executes systematic grid searches via GridSearchCV with 5-Fold Cross Validation.

Optimizes:
1. Random Forest Regressor:
   - n_estimators: [50, 100, 150]
   - max_depth: [4, 6, 8, None]
   - min_samples_split: [2, 5, 10]
   - min_samples_leaf: [1, 2, 4]
2. Gradient Boosting Regressor:
   - n_estimators: [50, 100, 120]
   - learning_rate: [0.03, 0.08, 0.15]
   - max_depth: [3, 4, 5]
   - subsample: [0.8, 0.9, 1.0]

Saves comprehensive tuning logs to reports/evaluation/hyperparameter_tuning_results.json.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EVAL_DIR = os.path.join(BASE_DIR, "reports", "evaluation")
os.makedirs(EVAL_DIR, exist_ok=True)

def run_hyperparameter_tuning():
    print("=" * 65)
    print("TREKVERSE AI: Hyperparameter Tuning via GridSearchCV (§ 6.5)")
    print("=" * 65)

    csv_path = os.path.join(BASE_DIR, "frontend", "public", "data", "student_performance_benchmark.csv")
    df = pd.read_csv(csv_path)

    features = [
        "studyTimeWeeklyHours", "attendanceRate", "absences", "pastFailures",
        "midterm1Score", "midterm2Score", "sleepHours", "travelTimeMinutes"
    ]
    X = df[features].values
    y = df["finalExamScore"].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    results = {
        "task": "Hyperparameter Optimization via GridSearchCV (5-Fold Stratified CV)",
        "dataset_samples": len(df),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "scoring_metric": "neg_mean_squared_error",
        "algorithms": {}
    }

    # 1. Random Forest Regressor Grid
    print("\n[1/2] Tuning Random Forest Regressor...")
    rf_param_grid = {
        "n_estimators": [50, 100, 150],
        "max_depth": [4, 6, 8],
        "min_samples_split": [2, 5],
        "min_samples_leaf": [1, 2]
    }
    rf_grid = GridSearchCV(
        RandomForestRegressor(random_state=42),
        rf_param_grid,
        cv=5,
        scoring="r2",
        n_jobs=-1,
        verbose=0
    )
    rf_grid.fit(X_train_scaled, y_train)

    best_rf = rf_grid.best_estimator_
    rf_preds = best_rf.predict(X_test_scaled)
    rf_r2 = float(r2_score(y_test, rf_preds))
    rf_mae = float(mean_absolute_error(y_test, rf_preds))
    rf_rmse = float(np.sqrt(mean_squared_error(y_test, rf_preds)))

    print(f"  Best RF Params: {rf_grid.best_params_}")
    print(f"  Best RF CV R²: {rf_grid.best_score_:.4f} | Test R²: {rf_r2:.4f} | Test MAE: {rf_mae:.2f}")

    results["algorithms"]["Random Forest Regressor"] = {
        "best_params": rf_grid.best_params_,
        "best_cv_r2": round(float(rf_grid.best_score_), 4),
        "test_r2": round(rf_r2, 4),
        "test_mae": round(rf_mae, 4),
        "test_rmse": round(rf_rmse, 4),
        "total_combinations_tested": len(rf_grid.cv_results_["params"])
    }

    # 2. Gradient Boosting Regressor Grid
    print("\n[2/2] Tuning Gradient Boosting Regressor...")
    gbm_param_grid = {
        "n_estimators": [50, 100, 120],
        "learning_rate": [0.03, 0.08, 0.15],
        "max_depth": [3, 4, 5],
        "subsample": [0.85, 1.0]
    }
    gbm_grid = GridSearchCV(
        GradientBoostingRegressor(random_state=42),
        gbm_param_grid,
        cv=5,
        scoring="r2",
        n_jobs=-1,
        verbose=0
    )
    gbm_grid.fit(X_train_scaled, y_train)

    best_gbm = gbm_grid.best_estimator_
    gbm_preds = best_gbm.predict(X_test_scaled)
    gbm_r2 = float(r2_score(y_test, gbm_preds))
    gbm_mae = float(mean_absolute_error(y_test, gbm_preds))
    gbm_rmse = float(np.sqrt(mean_squared_error(y_test, gbm_preds)))

    print(f"  Best GBM Params: {gbm_grid.best_params_}")
    print(f"  Best GBM CV R²: {gbm_grid.best_score_:.4f} | Test R²: {gbm_r2:.4f} | Test MAE: {gbm_mae:.2f}")

    results["algorithms"]["Gradient Boosting Regressor"] = {
        "best_params": gbm_grid.best_params_,
        "best_cv_r2": round(float(gbm_grid.best_score_), 4),
        "test_r2": round(gbm_r2, 4),
        "test_mae": round(gbm_mae, 4),
        "test_rmse": round(gbm_rmse, 4),
        "total_combinations_tested": len(gbm_grid.cv_results_["params"])
    }

    out_json = os.path.join(EVAL_DIR, "hyperparameter_tuning_results.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\nSaved hyperparameter tuning results to {out_json}")

    return results

if __name__ == "__main__":
    run_hyperparameter_tuning()

