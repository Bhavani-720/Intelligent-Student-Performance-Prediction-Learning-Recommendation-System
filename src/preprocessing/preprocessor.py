"""
TREKVERSE AI Data Preprocessing Module
Handles data ingestion, validation, cleaning, feature scaling, and pipeline serialization.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler

class StudentDataPreprocessor(BaseEstimator, TransformerMixin):
    """Production preprocessor for student academic and behavioral metrics."""
    def __init__(self):
        self.feature_names = [
            "attendance",
            "study_hours",
            "internal_marks",
            "assignment_marks",
            "quiz_marks",
            "previous_cgpa",
            "backlogs"
        ]
        self.scaler = StandardScaler()
        self.feature_means = {}

    def fit(self, X: pd.DataFrame, y=None):
        X_clean = self._extract_features(X)
        self.feature_means = X_clean.mean().to_dict()
        self.scaler.fit(X_clean)
        return self

    def transform(self, X: pd.DataFrame) -> np.ndarray:
        X_clean = self._extract_features(X)
        return self.scaler.transform(X_clean)

    def _extract_features(self, X: pd.DataFrame) -> pd.DataFrame:
        df = pd.DataFrame()
        # Case-insensitive mapping
        col_map = {c.lower().replace("_", ""): c for c in X.columns}

        def get_col(canonical: str, default_val: float) -> pd.Series:
            norm = canonical.lower().replace("_", "")
            if norm in col_map:
                return pd.to_numeric(X[col_map[norm]], errors='coerce').fillna(default_val)
            # Alternative aliases
            aliases = {
                "attendance": ["attendancerate", "att", "attendancepct"],
                "study_hours": ["studytime", "studyhours", "studyhour", "studytimehours", "studytimeweeklyhours"],
                "internal_marks": ["internal", "internalmarks", "midterm1score", "internals"],
                "assignment_marks": ["assignment", "assignmentmarks", "assignments", "midterm2score"],
                "quiz_marks": ["quiz", "quizmarks", "quizzes", "testmarks"],
                "previous_cgpa": ["cgpa", "prevcgpa", "previouscgpa", "gpa"],
                "backlogs": ["backlog", "failures", "pastfailures", "arrears"]
            }
            if canonical in aliases:
                for alias in aliases[canonical]:
                    if alias in col_map:
                        return pd.to_numeric(X[col_map[alias]], errors='coerce').fillna(default_val)
            return pd.Series([default_val] * len(X))

        df["attendance"] = get_col("attendance", 75.0).clip(0, 100)
        df["study_hours"] = get_col("study_hours", 2.5).clip(0, 16)
        df["internal_marks"] = get_col("internal_marks", 12.0).clip(0, 20)
        df["assignment_marks"] = get_col("assignment_marks", 14.0).clip(0, 20)
        df["quiz_marks"] = get_col("quiz_marks", 13.0).clip(0, 20)
        df["previous_cgpa"] = get_col("previous_cgpa", 7.0).clip(0, 10)
        df["backlogs"] = get_col("backlogs", 0).clip(0, 10)

        return df

def save_preprocessor(preprocessor: StudentDataPreprocessor, filepath: str):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    joblib.dump(preprocessor, filepath)

def load_preprocessor(filepath: str) -> StudentDataPreprocessor:
    return joblib.load(filepath)

