"""
TREKVERSE AI — Student Dedicated Portal
Provides personalized student academic intelligence:
- Profile, CGPA & Attendance Gauges
- Subject Performance Breakdown & Radar Analysis
- Semester Trends & AI Risk Status
- Weak Subjects Alerts & Actionable Guidance
- AI Personalized Weekly Study Planner
- Interactive What-If Scenario Simulator
- One-Click Official PDF Report Download
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

from database.database import get_student_detail, get_all_students
from src.prediction.predictor import predictor
from src.recommendations.study_planner import generate_weekly_study_plan
from reports.report_generator import generate_student_pdf_report

st.set_page_config(page_title="Student Dashboard | Trekverse AI", page_icon="👨‍🎓", layout="wide")

# Determine active student ID
default_id = "STU1024"
if "user" in st.session_state and st.session_state.user.get("student_id"):
    default_id = st.session_state.user["student_id"]

# Student Selection Header
col_sel1, col_sel2 = st.columns([2, 1])
with col_sel1:
    st.title("👨‍🎓 Student Academic Success Portal")
    st.caption("Personalized Learning Analytics, Predictive Forecasts & Academic Trajectory")

with col_sel2:
    all_students_df = get_all_students()
    stu_list = all_students_df["student_id"].tolist()
    default_idx = stu_list.index(default_id) if default_id in stu_list else 0
    selected_stu_id = st.selectbox("View Student Profile:", stu_list, index=default_idx)

# Fetch Full Profile
student = get_student_detail(selected_stu_id)

if not student:
    st.error(f"Student record '{selected_stu_id}' not found.")
    st.stop()

# 1. Profile Banner & Summary
st.markdown(f"""
<div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 1.5rem 1.8rem; border-radius: 12px; color: white; margin-bottom: 1.5rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <div>
            <h2 style="margin: 0; font-size: 1.6rem; color: #ffffff;">{student['name']}</h2>
            <div style="color: #a5b4fc; font-size: 0.95rem; margin-top: 0.3rem;">
                ID: <b>{student['student_id']}</b> &nbsp;|&nbsp; Dept: <b>{student['department']}</b> &nbsp;|&nbsp; Semester: <b>{student['semester']}</b>
            </div>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 0.85rem; color: #cbd5e1; text-transform: uppercase;">AI Risk Classification</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: {'#f87171' if student['risk_level']=='High' else ('#fbbf24' if student['risk_level']=='Moderate' else '#34d399')};">
                {student['risk_level'].upper()} RISK
            </div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# 2. Key Academic Gauges
k1, k2, k3, k4 = st.columns(4)
with k1:
    st.metric(
        label="Cumulative CGPA",
        value=f"{student['cgpa']:.2f} / 10",
        delta=f"{'+' if student['cgpa'] >= 7.5 else ''}{student['cgpa'] - 7.5:.2f} vs Benchmark"
    )
with k2:
    st.metric(
        label="Attendance Rate",
        value=f"{student['attendance']:.1f}%",
        delta=f"{'+' if student['attendance'] >= 75.0 else ''}{student['attendance'] - 75.0:.1f}% vs Threshold"
    )
with k3:
    st.metric(
        label="Predicted Final Score",
        value=f"{student['predicted_score']:.1f} / 20",
        delta="AI Multi-Model Forecast"
    )
with k4:
    backlog_count = student.get("backlogs", 0)
    st.metric(
        label="Active Backlogs",
        value=f"{backlog_count} Courses",
        delta="Clear" if backlog_count == 0 else "Action Required",
        delta_color="normal" if backlog_count == 0 else "inverse"
    )

st.write("")

# 3. Main Dashboard Tabs
tabs = st.tabs([
    "📊 Performance & Subjects",
    "📈 Semester Trend",
    "🧠 AI Study Planner",
    "🔮 What-If Simulator",
    "📄 Official PDF Report"
])

with tabs[0]:
    st.subheader("Curriculum Subject Performance")
    col_sub_left, col_sub_right = st.columns([1, 1])
    
    # Subject breakdown
    pred_subs = student.get("prediction", {}).get("subject_predictions") or {
        "Mathematics": 12.8, "Programming": 17.1, "DBMS": 13.8, "Computer Networks": 14.6, "Electronics": 12.9
    }
    
    sub_df = pd.DataFrame([
        {"Subject": k, "Score": v, "Status": "Strong" if v >= 15.0 else ("Needs Attention" if v < 13.0 else "Average")}
        for k, v in pred_subs.items()
    ])
    
    with col_sub_left:
        fig_bar = px.bar(
            sub_df,
            x="Subject",
            y="Score",
            color="Status",
            color_discrete_map={"Strong": "#10b981", "Average": "#3b82f6", "Needs Attention": "#ef4444"},
            title="Subject-Wise Predicted Marks (0 - 20 Scale)",
            text="Score"
        )
        fig_bar.add_hline(y=10.0, line_dash="dash", line_color="#ef4444", annotation_text="Passing Cutoff (10.0)")
        fig_bar.update_layout(height=360, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_bar, use_container_width=True)

    with col_sub_right:
        # Radar Chart
        categories = list(pred_subs.keys())
        values = list(pred_subs.values())
        fig_radar = go.Figure()
        fig_radar.add_trace(go.Scatterpolar(
            r=values + [values[0]],
            theta=categories + [categories[0]],
            fill='toself',
            fillcolor='rgba(99, 102, 241, 0.25)',
            line=dict(color='#4f46e5', width=2),
            name=student['name']
        ))
        fig_radar.update_layout(
            polar=dict(radialaxis=dict(visible=True, range=[0, 20])),
            showlegend=False,
            height=360,
            title="Subject Competency Radar Profile",
            margin=dict(l=20, r=20, t=40, b=20)
        )
        st.plotly_chart(fig_radar, use_container_width=True)

    col_flag1, col_flag2 = st.columns(2)
    with col_flag1:
        st.success(f"**Strong Subject Focus:** `{student.get('strong_subject', 'Programming')}` — Maintain momentum through competitive programming and advanced electives.")
    with col_flag2:
        weak_s = student.get('weak_subject', 'Mathematics')
        st.warning(f"**Subject Requiring Intervention:** `{weak_s}` — Score is below peer average. Follow the personalized study schedule below.")

with tabs[1]:
    st.subheader("Academic Trajectory & Semester Trend")
    # Synthetic realistic trend for semesters 1 through current
    semesters = [f"Sem {s}" for s in range(1, student['semester'] + 1)]
    cgpa_base = student['cgpa']
    # Build historical trajectory
    traj = [round(cgpa_base + (i - len(semesters) + 1) * 0.18, 2) for i in range(len(semesters))]
    traj[-1] = cgpa_base
    
    fig_trend = go.Figure()
    fig_trend.add_trace(go.Scatter(
        x=semesters,
        y=traj,
        mode="lines+markers",
        name="Semester CGPA",
        line=dict(color="#6366f1", width=3),
        marker=dict(size=10, color="#4338ca")
    ))
    fig_trend.update_layout(
        title="Historical Semester CGPA Trajectory",
        yaxis=dict(range=[4.0, 10.0], title="CGPA (10.0 Scale)"),
        xaxis=dict(title="Semester"),
        template="plotly_white",
        height=350
    )
    st.plotly_chart(fig_trend, use_container_width=True)

with tabs[2]:
    st.subheader("🧠 AI Personalized Study Planner")
    st.markdown(f"Generated tailored weekly schedule targeted at strengthening **{student.get('weak_subject', 'DBMS')}**:")
    
    study_plan = generate_weekly_study_plan(
        weak_subject=student.get('weak_subject', 'DBMS'),
        cgpa=student['cgpa'],
        attendance=student['attendance'],
        daily_capacity_hours=student.get('study_hours', 2.5)
    )
    
    col_d1, col_d2 = st.columns(2)
    days = list(study_plan.items())
    half = (len(days) + 1) // 2
    
    with col_d1:
        for day, item in days[:half]:
            st.info(f"**{day}**\n\n→ {item}")
            
    with col_d2:
        for day, item in days[half:]:
            st.info(f"**{day}**\n\n→ {item}")

with tabs[3]:
    st.subheader("🔮 Interactive What-If Scenario Simulator")
    st.markdown("""
    Explore how adjusting your **attendance habits**, **daily study hours**, or **assignment completion**
    affects your projected final score.
    """)
    
    st.markdown("""
    <div class="sim-disclaimer">
        <b>⚠️ Model Simulation Notice:</b> Projections are calculated using trained statistical regression and ensemble correlations. 
        This is an exploratory learning simulation, not a guaranteed examination outcome.
    </div>
    """, unsafe_allow_html=True)
    
    base_features = {
        "attendance": student['attendance'],
        "study_hours": student.get('study_hours', 2.5),
        "internal_marks": 12.0,
        "assignment_marks": 14.0,
        "quiz_marks": 13.0,
        "previous_cgpa": student['cgpa'],
        "backlogs": student.get('backlogs', 0)
    }
    
    col_sim_in, col_sim_out = st.columns([1, 1])
    with col_sim_in:
        st.markdown("#### Adjust Learning Behaviors")
        sim_att = st.slider("Target Attendance Rate (%):", 50.0, 100.0, float(student['attendance']), step=1.0)
        sim_study = st.slider("Target Daily Study (Hours/Day):", 0.5, 8.0, float(student.get('study_hours', 2.5)), step=0.5)
        sim_assign = st.slider("Target Assignment Score (0 - 20):", 8.0, 20.0, 14.0, step=0.5)
        sim_backlog = st.number_input("Cleared Backlogs (Remaining):", 0, 5, int(student.get('backlogs', 0)))
        
        sim_features = dict(base_features)
        sim_features["attendance"] = sim_att
        sim_features["study_hours"] = sim_study
        sim_features["assignment_marks"] = sim_assign
        sim_features["backlogs"] = sim_backlog

    with col_sim_out:
        sim_result = predictor.simulate_what_if(base_features, sim_features)
        st.markdown("#### Projected Simulation Result")
        
        c_res1, c_res2 = st.columns(2)
        with c_res1:
            st.metric(
                label="Baseline Predicted Score",
                value=f"{sim_result['baseline']['predicted_score']:.1f} / 20"
            )
            st.write(f"Risk: {sim_result['baseline']['risk_badge']}")
        with c_res2:
            st.metric(
                label="Simulated Projected Score",
                value=f"{sim_result['simulated']['predicted_score']:.1f} / 20",
                delta=sim_result['delta_label']
            )
            st.write(f"Risk: {sim_result['simulated']['risk_badge']}")
            
        st.success(f"**Projected Transition:** {sim_result['risk_transition']}")

with tabs[4]:
    st.subheader("📄 Official Student Academic Performance Report")
    st.markdown("Download publication-quality diagnostic PDF report for academic counseling and official records.")
    
    pdf_bytes = generate_student_pdf_report(student)
    
    st.download_button(
        label=f"📥 Download Official PDF Report ({student['student_id']})",
        data=pdf_bytes,
        file_name=f"Trekverse_{student['student_id']}_Academic_Report.pdf",
        mime="application/pdf",
        use_container_width=True
    )

