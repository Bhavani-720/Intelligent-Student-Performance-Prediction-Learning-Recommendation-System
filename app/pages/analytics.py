"""
TREKVERSE AI — Cohort Performance Analytics & Behavioral Insights
Comprehensive exploratory intelligence:
- Longitudinal Semester Trajectories & Departmental Benchmarks
- Cross-Subject Mastery Heatmaps
- Multi-Factor Early-Warning Risk Distribution Analysis
- K-Means Clustering & PCA 2D Behavioral Segment Visualizations
"""

import os
import sys
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from database.database import get_all_students, get_kpis
from src.clustering.student_segments import StudentSegmenter

st.set_page_config(page_title="Cohort Analytics | Trekverse AI", page_icon="📈", layout="wide")

st.title("📈 Cohort Analytics & Educational Intelligence")
st.caption("Longitudinal Semester Trends, Departmental Disparities, and Behavioral Engagement Clustering")

df_students = get_all_students()
kpis = get_kpis()

an_tabs = st.tabs([
    "📊 Departmental Performance & Trends",
    "⚠️ Risk Distribution & Demographics",
    "📚 Subject Mastery & Bottlenecks",
    "🧩 Behavioral Clustering (K-Means)"
])

with an_tabs[0]:
    st.subheader("Departmental Academic Trajectory")
    
    col_d1, col_d2 = st.columns([1, 1])
    with col_d1:
        fig_box = px.box(
            df_students,
            x="department",
            y="cgpa",
            color="department",
            title="CGPA Distribution by Department (10.0 Scale)",
            points="outliers"
        )
        fig_box.update_layout(showlegend=False, height=380, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_box, use_container_width=True)

    with col_d2:
        dept_summary = df_students.groupby("department").agg(
            Avg_CGPA=("cgpa", "mean"),
            Avg_Attendance=("attendance", "mean"),
            Avg_Predicted=("predicted_score", "mean"),
            High_Risk_Count=("risk_level", lambda x: (x == "High").sum()),
            Total_Students=("student_id", "count")
        ).reset_index()
        dept_summary["High_Risk_Pct"] = (dept_summary["High_Risk_Count"] / dept_summary["Total_Students"] * 100).round(1)
        dept_summary["Avg_CGPA"] = dept_summary["Avg_CGPA"].round(2)
        dept_summary["Avg_Attendance"] = dept_summary["Avg_Attendance"].round(1)
        dept_summary["Avg_Predicted"] = dept_summary["Avg_Predicted"].round(1)

        fig_bar = px.bar(
            dept_summary,
            x="department",
            y="Avg_Attendance",
            title="Departmental Average Attendance Rate (%)",
            color="Avg_Attendance",
            color_continuous_scale="Teal",
            text="Avg_Attendance"
        )
        fig_bar.add_hline(y=75, line_dash="dash", line_color="#ef4444", annotation_text="75% Mandatory")
        fig_bar.update_layout(height=380, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_bar, use_container_width=True)

    st.markdown("##### Departmental Summary Metrics:")
    st.dataframe(dept_summary, use_container_width=True, hide_index=True)

with an_tabs[1]:
    st.subheader("Early-Warning Risk Distribution Analysis")
    col_r1, col_r2 = st.columns(2)
    with col_r1:
        fig_risk_dept = px.histogram(
            df_students,
            x="department",
            color="risk_level",
            barmode="group",
            title="Risk Tier Composition by Department",
            color_discrete_map={"High": "#ef4444", "Moderate": "#f59e0b", "Low": "#10b981"}
        )
        fig_risk_dept.update_layout(height=380, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_risk_dept, use_container_width=True)

    with col_r2:
        fig_sem_risk = px.histogram(
            df_students,
            x="semester",
            color="risk_level",
            barmode="group",
            title="Risk Tier Progression by Semester",
            color_discrete_map={"High": "#ef4444", "Moderate": "#f59e0b", "Low": "#10b981"}
        )
        fig_sem_risk.update_layout(height=380, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_sem_risk, use_container_width=True)

with an_tabs[2]:
    st.subheader("Curriculum Subject Mastery & Failure Bottlenecks")
    sub_data = [
        {"Subject": "Mathematics (MATH101)", "Average": 13.4, "Weak Students": 64, "Pass Rate": "78%"},
        {"Subject": "Programming & DS (CS102)", "Average": 16.8, "Weak Students": 18, "Pass Rate": "94%"},
        {"Subject": "Database Systems (CS201)", "Average": 14.7, "Weak Students": 42, "Pass Rate": "86%"},
        {"Subject": "Computer Networks (CS202)", "Average": 15.2, "Weak Students": 31, "Pass Rate": "90%"},
        {"Subject": "Digital Electronics (EC103)", "Average": 13.1, "Weak Students": 68, "Pass Rate": "77%"}
    ]
    df_subs = pd.DataFrame(sub_data)
    
    col_s1, col_s2 = st.columns([3, 2])
    with col_s1:
        fig_sub_bars = px.bar(
            df_subs,
            x="Subject",
            y="Weak Students",
            color="Weak Students",
            color_continuous_scale="Reds",
            title="Number of Students Flagged as Needing Intervention (< 13.0 / 20)",
            text="Weak Students"
        )
        fig_sub_bars.update_layout(height=360, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_sub_bars, use_container_width=True)
    with col_s2:
        st.markdown("#### Academic Remediation Directives")
        st.error("🔴 **Priority 1: Mathematics Clinics** — 64 students require foundational tutorial sessions on Multivariable Calculus and Linear Algebra.")
        st.error("🔴 **Priority 2: Electronics Hardware Labs** — 68 students require additional lab hours to improve practical circuit debugging.")
        st.success("🟢 **Programming & Networks** — Performing satisfactorily across all batches.")

with an_tabs[3]:
    st.subheader("Behavioral & Engagement Segmentation (K-Means)")
    segmenter = StudentSegmenter(n_clusters=4)
    df_clustered = segmenter.fit_predict(df_students)
    profiles = segmenter.get_cluster_profiles(df_clustered)
    
    fig_pca = px.scatter(
        df_clustered,
        x="pca_x",
        y="pca_y",
        color="cluster_persona",
        hover_name="name",
        hover_data=["student_id", "attendance", "study_hours", "cgpa", "backlogs"],
        title="2D PCA Space of Student Behavioral Clusters",
        labels={"pca_x": "Principal Component 1 (Effort & Attendance)", "pca_y": "Principal Component 2 (Exam Score & Backlog Latency)"},
        template="plotly_white"
    )
    fig_pca.update_layout(height=420, margin=dict(l=20, r=20, t=40, b=20))
    st.plotly_chart(fig_pca, use_container_width=True)
    
    col_cl1, col_cl2 = st.columns(2)
    for i, p in enumerate(profiles):
        with (col_cl1 if i % 2 == 0 else col_cl2):
            st.markdown(f"""
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 0.8rem;">
                <h4 style="margin: 0 0 0.4rem 0;">{p['badge']} {p['name']}</h4>
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.4rem;"><b>{p['count']} students</b> ({p['pct_cohort']}% of cohort)</div>
                <div style="font-size: 0.9rem; margin-bottom: 0.4rem;">{p['description']}</div>
                <div style="font-size: 0.85rem; color: #4338ca;"><b>Strategy:</b> {p['action']}</div>
            </div>
            """, unsafe_allow_html=True)

