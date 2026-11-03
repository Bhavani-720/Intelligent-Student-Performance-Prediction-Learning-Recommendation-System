"""
TREKVERSE AI Student Behavioral Segmentation Module
Applies K-Means Clustering on multi-dimensional academic & engagement telemetry
to discover distinct student behavioral profiles and cohort personas.
"""

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from typing import Dict, List, Any, Tuple

CLUSTER_PERSONAS = {
    0: {
        "name": "High Achievers & Self-Directed",
        "badge": "🌟 Vanguard",
        "description": "Exemplary attendance, high study discipline, top exam scores, zero backlogs.",
        "action": "Offer advanced research projects, teaching assistantships, and competitive hackathons."
    },
    1: {
        "name": "Inconsistent High-Potential",
        "badge": "⚡ High Latent",
        "description": "Strong raw comprehension but irregular attendance and erratic assignment submissions.",
        "action": "Enforce attendance accountability contracts, structured deadlines, and motivation coaching."
    },
    2: {
        "name": "Diligent Steady Performers",
        "badge": "🌱 Solid Baseline",
        "description": "High attendance and solid work ethic, achieving consistent passing to B-grade scores.",
        "action": "Targeted problem-solving workshops and question bank drills to elevate to A-grades."
    },
    3: {
        "name": "Critical Intervention Needed",
        "badge": "🚨 High Priority",
        "description": "Low attendance, backlog accumulation, minimal study time, acute risk.",
        "action": "Immediate 1-on-1 academic counseling, remedial tutoring, and mandatory attendance clinic."
    }
}

class StudentSegmenter:
    def __init__(self, n_clusters: int = 4):
        self.n_clusters = n_clusters
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=2, random_state=42)
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        self.feature_cols = [
            "attendance", "study_hours", "previous_cgpa",
            "internal_marks", "assignment_marks", "backlogs"
        ]

    def fit_predict(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Fit K-Means clustering and PCA projections onto input student cohort.
        Returns copy of dataframe with cluster IDs, persona names, and 2D coordinates.
        """
        X = pd.DataFrame()
        for col in self.feature_cols:
            if col in df.columns:
                X[col] = df[col].astype(float)
            elif col == "previous_cgpa" and "cgpa" in df.columns:
                X[col] = df["cgpa"].astype(float)
            else:
                X[col] = 0.0

        X_scaled = self.scaler.fit_transform(X)
        clusters = self.kmeans.fit_predict(X_scaled)
        pca_coords = self.pca.fit_transform(X_scaled)

        df_result = df.copy()
        df_result["cluster_id"] = clusters
        df_result["cluster_persona"] = [CLUSTER_PERSONAS.get(c, {}).get("name", f"Cluster {c}") for c in clusters]
        df_result["cluster_badge"] = [CLUSTER_PERSONAS.get(c, {}).get("badge", f"C{c}") for c in clusters]
        df_result["pca_x"] = np.round(pca_coords[:, 0], 2)
        df_result["pca_y"] = np.round(pca_coords[:, 1], 2)

        return df_result

    def get_cluster_profiles(self, df_clustered: pd.DataFrame) -> List[Dict[str, Any]]:
        """Compute aggregated cluster metrics for radar/bar comparison."""
        profiles = []
        for c in range(self.n_clusters):
            sub = df_clustered[df_clustered["cluster_id"] == c]
            if len(sub) == 0:
                continue
            meta = CLUSTER_PERSONAS.get(c, {
                "name": f"Cohort {c}",
                "badge": f"C{c}",
                "description": "",
                "action": ""
            })
            cgpa_col = "previous_cgpa" if "previous_cgpa" in sub.columns else ("cgpa" if "cgpa" in sub.columns else None)
            avg_cgpa = round(float(sub[cgpa_col].mean()), 2) if cgpa_col else 7.5
            score_col = "predicted_score" if "predicted_score" in sub.columns else ("final_score" if "final_score" in sub.columns else None)
            avg_score = round(float(sub[score_col].mean()), 1) if score_col else 14.0

            profiles.append({
                "cluster_id": c,
                "name": meta["name"],
                "badge": meta["badge"],
                "count": len(sub),
                "pct_cohort": round(len(sub) / len(df_clustered) * 100, 1),
                "avg_attendance": round(float(sub["attendance"].mean()), 1) if "attendance" in sub.columns else 75.0,
                "avg_study_hours": round(float(sub["study_hours"].mean()), 1) if "study_hours" in sub.columns else 2.5,
                "avg_cgpa": avg_cgpa,
                "avg_score": avg_score,
                "description": meta["description"],
                "action": meta["action"]
            })
        return profiles
