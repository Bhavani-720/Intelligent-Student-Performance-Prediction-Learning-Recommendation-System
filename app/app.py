"""
TREKVERSE AI — Student Academic Management & Early-Warning System
Main Application Entrypoint
"""

import os
import sys
import json
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Add project root to sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from database.database import init_db, get_kpis, get_all_students, authenticate_user
from src.prediction.predictor import predictor
from src.clustering.student_segments import StudentSegmenter

# Page Configuration
st.set_page_config(
    page_title="Trekverse AI | Student Intelligence & Early-Warning Hub",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize Database on First Launch
init_db()

# Custom Modern Styling
st.markdown("""
<style>
    /* Global styles */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Header Card */
    .trek-header {
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
        padding: 2.2rem 2.4rem;
        border-radius: 16px;
        color: #ffffff;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 2rem;
    }
    .trek-title {
        font-size: 2.2rem;
        font-weight: 800;
        letter-spacing: -0.025em;
        margin: 0;
        background: linear-gradient(to right, #ffffff, #c7d2fe);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .trek-subtitle {
        font-size: 1.05rem;
        color: #94a3b8;
        margin-top: 0.4rem;
        font-weight: 400;
    }
    
    /* KPI Cards */
    .kpi-card {
        background: #ffffff;
        border-radius: 12px;
        padding: 1.25rem 1.4rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
    .kpi-label {
        font-size: 0.82rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin-bottom: 0.35rem;
    }
    .kpi-value {
        font-size: 2.0rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.1;
    }
    .kpi-sub {
        font-size: 0.8rem;
        color: #94a3b8;
        margin-top: 0.35rem;
    }
    
    /* Risk Badges */
    .badge-high {
        background-color: #fee2e2;
        color: #991b1b;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-block;
    }
    .badge-mod {
        background-color: #fef3c7;
        color: #92400e;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-block;
    }
    .badge-low {
        background-color: #d1fae5;
        color: #065f46;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-block;
    }
    
    /* Notice Callout */
    .sim-disclaimer {
        background-color: #eff6ff;
        border-left: 4px solid #3b82f6;
        padding: 0.85rem 1.1rem;
        border-radius: 0 8px 8px 0;
        color: #1e40af;
        font-size: 0.88rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Session State for Authentication
if "user" not in st.session_state:
    st.session_state.user = {
        "id": "usr-admin",
        "username": "admin",
        "role": "ADMIN",
        "name": "Dr. Suresh Kumar",
        "department": "Administration"
    }

# Sidebar Navigation & Role Management
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80", use_container_width=True)
    st.markdown("### 🎓 Trekverse AI Portal")
    st.caption("Student Intelligence & Early-Warning Platform")
    
    st.divider()
    
    # Active User Profile & Role Switcher
    current_role = st.session_state.user["role"]
    st.markdown(f"**Logged in as:** {st.session_state.user['name']}")
    role_badge_class = "badge-low" if current_role == "ADMIN" else ("badge-mod" if current_role == "FACULTY" else "badge-high")
    st.markdown(f"<span class='{role_badge_class}'>Role: {current_role}</span>", unsafe_allow_html=True)
    
    st.markdown("#### 🔄 Quick Role Switcher")
    col_r1, col_r2, col_r3 = st.columns(3)
    with col_r1:
        if st.button("Admin", use_container_width=True):
            st.session_state.user = {
                "id": "usr-admin", "username": "admin", "role": "ADMIN",
                "name": "Dr. Suresh Kumar", "department": "Administration"
            }
            st.rerun()
    with col_r2:
        if st.button("Faculty", use_container_width=True):
            st.session_state.user = {
                "id": "usr-faculty", "username": "faculty", "role": "FACULTY",
                "name": "Prof. Ananya Sharma", "department": "Computer Science & AI"
            }
            st.rerun()
    with col_r3:
        if st.button("Student", use_container_width=True):
            st.session_state.user = {
                "id": "usr-student-2", "username": "stu1024", "role": "STUDENT",
                "name": "Rohan Mehta (STU1024)", "department": "Computer Science & AI",
                "student_id": "STU1024"
            }
            st.rerun()

    st.divider()
    st.info("💡 Tip: Use the **Pages** menu above to access role-specific dashboards, analytics, simulations, and PDF report downloads.")

# Header Banner
st.markdown("""
<div class="trek-header">
    <div class="trek-title">TREKVERSE AI ACADEMY</div>
    <div class="trek-subtitle">Student Academic Management & Early-Warning Diagnostic Hub</div>
</div>
""", unsafe_allow_html=True)

# Key Performance Indicators
kpis = get_kpis()

col1, col2, col3, col4, col5 = st.columns(5)
with col1:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-label">Total Cohort</div>
        <div class="kpi-value">{kpis['total_students']}</div>
        <div class="kpi-sub">Active Enrolled</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-label">Class Avg CGPA</div>
        <div class="kpi-value">{kpis['avg_cgpa']}</div>
        <div class="kpi-sub">Target: &ge; 7.50</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-label">Attendance Avg</div>
        <div class="kpi-value">{kpis['avg_attendance']}%</div>
        <div class="kpi-sub">Threshold: &ge; 75%</div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown(f"""
    <div class="kpi-card" style="border-left: 4px solid #ef4444;">
        <div class="kpi-label">Students at Risk</div>
        <div class="kpi-value" style="color: #dc2626;">{kpis['high_risk']}</div>
        <div class="kpi-sub">&ge; 40 Risk Score</div>
    </div>
    """, unsafe_allow_html=True)

with col5:
    st.markdown(f"""
    <div class="kpi-card" style="border-left: 4px solid #f59e0b;">
        <div class="kpi-label">Moderate Risk</div>
        <div class="kpi-value" style="color: #d97706;">{kpis['moderate_risk']}</div>
        <div class="kpi-sub">Close Monitoring</div>
    </div>
    """, unsafe_allow_html=True)

st.write("")

# Main View: Cohort Overview & Executive Analytics
tabs = st.tabs(["📊 Performance Analytics", "⚠️ Early-Warning Risk Distribution", "🧠 AI Study & Intervention Matrix", "🗺️ System Architecture"])

with tabs[0]:
    st.subheader("Academic Cohort Performance Trends")
    df_students = get_all_students()
    
    c_left, c_right = st.columns([2, 1])
    with c_left:
        # CGPA vs Attendance scatter colored by Risk Level
        color_map = {"High": "#ef4444", "Moderate": "#f59e0b", "Low": "#10b981"}
        fig_scatter = px.scatter(
            df_students,
            x="attendance",
            y="cgpa",
            color="risk_level",
            color_discrete_map=color_map,
            hover_name="name",
            hover_data=["student_id", "department", "study_hours", "backlogs", "predicted_score"],
            title="Attendance vs. Cumulative CGPA (Colored by Risk Tier)",
            labels={"attendance": "Attendance Rate (%)", "cgpa": "Current CGPA (10.0 Scale)"},
            template="plotly_white"
        )
        fig_scatter.add_vline(x=75, line_dash="dash", line_color="#ef4444", annotation_text="Mandatory 75% Attendance")
        fig_scatter.add_hline(y=6.5, line_dash="dash", line_color="#f59e0b", annotation_text="Academic Probation Line (6.5)")
        fig_scatter.update_layout(height=420, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_scatter, use_container_width=True)

    with c_right:
        # Risk Stratification Donut
        risk_counts = df_students["risk_level"].value_counts().reset_index()
        risk_counts.columns = ["Risk Level", "Count"]
        fig_donut = px.pie(
            risk_counts,
            values="Count",
            names="Risk Level",
            color="Risk Level",
            color_discrete_map=color_map,
            hole=0.55,
            title="Cohort Risk Stratification"
        )
        fig_donut.update_layout(height=420, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_donut, use_container_width=True)

with tabs[1]:
    st.subheader("Early-Warning Diagnostic System")
    st.markdown("""
    The early-warning engine monitors multi-dimensional parameters including:
    **Attendance**, **Prior Backlogs**, **Continuous Study Hours**, **Internal Marks**, and **Assignment Submissions**.
    """)
    
    col_f1, col_f2 = st.columns([1, 3])
    with col_f1:
        risk_sel = st.selectbox("Filter Risk Category:", ["All", "High", "Moderate", "Low"])
        dept_sel = st.selectbox("Department:", ["All"] + sorted(list(df_students["department"].unique())))
    
    with col_f2:
        df_filtered = get_all_students(risk_filter=risk_sel, dept_filter=dept_sel)
        st.dataframe(
            df_filtered[["student_id", "name", "department", "semester", "attendance", "cgpa", "backlogs", "study_hours", "risk_level", "predicted_score", "weak_subject"]],
            use_container_width=True,
            height=340
        )

with tabs[2]:
    st.subheader("AI Recommendation & Behavioral Segmentation Engine")
    segmenter = StudentSegmenter(n_clusters=4)
    df_clustered = segmenter.fit_predict(df_students)
    profiles = segmenter.get_cluster_profiles(df_clustered)
    
    c_p1, c_p2 = st.columns([1, 1])
    with c_p1:
        st.markdown("#### K-Means Behavioral Personas")
        for p in profiles:
            with st.expander(f"{p['badge']} {p['name']} ({p['count']} students / {p['pct_cohort']}%)"):
                st.write(f"**Profile:** {p['description']}")
                st.write(f"**Recommended Action:** {p['action']}")
                st.write(f"• Avg Attendance: `{p['avg_attendance']}%` | Avg Study: `{p['avg_study_hours']}h/d` | Avg CGPA: `{p['avg_cgpa']}`")

    with c_p2:
        st.markdown("#### 2D Behavioral Feature Projection (PCA)")
        fig_pca = px.scatter(
            df_clustered,
            x="pca_x",
            y="pca_y",
            color="cluster_persona",
            hover_name="name",
            hover_data=["student_id", "attendance", "study_hours", "cgpa"],
            title="Student Cohort Behavioral Embeddings",
            template="plotly_white"
        )
        fig_pca.update_layout(height=400, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_pca, use_container_width=True)

with tabs[3]:
    st.subheader("Production System Architecture")
    st.code("""
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                                 TREKVERSE AI ACADEMY                                   ║
║                         Student Success Intelligence Hub                               ║
╠════════════════════════════════════════════════════════════════════════════════════════╣
║ Presentation Layer: Streamlit Multi-Role Dashboards (Admin / Faculty / Student)        ║
║                                          ↓                                             ║
║ Analytics & Diagnostic Engine: Early-Warning System (🟢 Low, 🟡 Moderate, 🔴 High)    ║
║                                          ↓                                             ║
║ Machine Learning Pipeline: Linear Reg → Random Forest → XGBoost → LightGBM → CatBoost  ║
║                                          ↓                                             ║
║ Explainable AI: SHAP TreeExplainer Local & Global Feature Attributions                ║
║                                          ↓                                             ║
║ Action Layer: Personalized Weekly Study Planner + Automated Vector PDF Report Engine   ║
║                                          ↓                                             ║
║ Persistence: SQLite Database (trekverse.db) with schema.sql & ORM Access Layer         ║
╚════════════════════════════════════════════════════════════════════════════════════════╝
    """, language="text")

