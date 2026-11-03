"""
TREKVERSE AI Feature Engineering Module
Transforms raw academic telemetry into engineered educational indicators:
- Academic Engagement Index
- Subject Difficulty Index
- Failure Risk Penalty
- Continuous Study Effort Ratio
"""

import pandas as pd
import numpy as np

def compute_engagement_index(df: pd.DataFrame) -> pd.Series:
    """
    Computes a composite index (0-100) representing holistic student effort:
    40% Attendance + 30% Assignment Submissions + 30% Study Hours Normalized
    """
    att = df.get("attendance", 75.0)
    assignments = (df.get("assignment_marks", 14.0) / 20.0) * 100.0
    study_norm = (df.get("study_hours", 2.5) / 6.0).clip(0, 1.0) * 100.0

    engagement = (0.40 * att) + (0.35 * assignments) + (0.25 * study_norm)
    return engagement.clip(0, 100).round(1)

def compute_risk_score(df: pd.DataFrame) -> pd.Series:
    """
    Generates continuous risk score (0 to 100, where higher is more at-risk)
    combining attendance deficits, backlogs, and academic struggle.
    """
    att = df.get("attendance", 75.0)
    backlogs = df.get("backlogs", 0)
    cgpa = df.get("previous_cgpa", 7.0)

    # Base penalty
    att_penalty = np.maximum(0, (75.0 - att) * 1.5)
    backlog_penalty = backlogs * 18.0
    cgpa_penalty = np.maximum(0, (6.5 - cgpa) * 12.0)

    total_risk = att_penalty + backlog_penalty + cgpa_penalty
    return np.clip(total_risk, 0, 100).round(1)

def classify_risk_tier(risk_score: float) -> str:
    """Classify continuous risk score into 3 actionable tiers."""
    if risk_score >= 40.0:
        return "High"
    elif risk_score >= 18.0:
        return "Moderate"
    return "Low"

