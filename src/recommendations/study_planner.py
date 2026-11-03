"""
TREKVERSE AI Personalized Study Planner & Intervention Engine
Generates tailored weekly study schedules and faculty intervention steps
based on weak subjects, backlog history, attendance gaps, and target score.
"""

from typing import Dict, List, Any

SUBJECT_TOPIC_BANK = {
    "Mathematics": [
        "Differential Equations & Calculus Foundations",
        "Linear Algebra & Matrix Eigenvalues",
        "Probability Distributions & Hypothesis Testing",
        "Previous Year Problem Sets & Integration Techniques",
        "Timed Calculus Assessment & Formula Sheet Review"
    ],
    "Programming": [
        "Data Structures: Trees, Graphs, & Recursion",
        "Dynamic Programming & Greedy Algorithms",
        "Object-Oriented Design & System Architecture",
        "LeetCode / HackerRank Problem Solving Workshop",
        "Mock Coding Assessment & Complexity Analysis"
    ],
    "DBMS": [
        "Relational Algebra & Normalization (BCNF / 3NF)",
        "SQL Query Optimization & Indexing Strategies",
        "Transaction Management, ACID Properties & Concurrency",
        "NoSQL Database Architectures & Key-Value Modeling",
        "End-to-End SQL Practice Test & Schema Design"
    ],
    "Computer Networks": [
        "OSI & TCP/IP Protocol Stack Deep-Dive",
        "Subnetting, IP Routing (OSPF, BGP) & CIDR",
        "Transport Layer: Congestion Control & Sockets",
        "Network Security, Cryptography & TLS Handshake",
        "Wireshark Packet Analysis & Protocol Quiz"
    ],
    "Electronics": [
        "Boolean Algebra & Karnaugh Map Simplification",
        "Combinational & Sequential Circuits (Flip-Flops)",
        "Microprocessor 8086 Architecture & Assembly",
        "Digital Signal Basics & ADC/DAC Converters",
        "Circuit Simulation & Timed Practical Problem Solving"
    ]
}

def generate_weekly_study_plan(
    weak_subject: str = "DBMS",
    cgpa: float = 6.8,
    attendance: float = 71.0,
    daily_capacity_hours: float = 2.0
) -> Dict[str, str]:
    """
    Construct dynamic weekly study schedule customized to student's weak area.
    """
    subject = weak_subject if weak_subject in SUBJECT_TOPIC_BANK else "Mathematics"
    topics = SUBJECT_TOPIC_BANK[subject]

    scale = max(1.0, min(1.8, daily_capacity_hours / 2.0))

    plan = {
        "Monday": f"{subject}: {1.5 * scale:.1f} hours ({topics[0]})",
        "Tuesday": f"Hands-on Practice: {1.0 * scale:.1f} hour ({topics[1]})",
        "Wednesday": f"{subject} Core Revision: {1.0 * scale:.1f} hour ({topics[2]})",
        "Thursday": f"Previous Year Questions Bank: {1.5 * scale:.1f} hours ({topics[3]})",
        "Friday": f"Timed Mock Assessment: {45} minutes ({topics[4]})",
        "Saturday": f"Faculty Clinic & Doubt Resolution: {1.0 * scale:.1f} hour (Peer group discussion)",
        "Sunday": "Weekly Self-Review & Rest: 30 minutes (Log progress on Trekverse Hub)"
    }
    return plan

def generate_intervention_actions(
    risk_level: str,
    attendance: float,
    weak_subject: str,
    backlogs: int
) -> List[str]:
    """Faculty intervention recommendations."""
    actions = []
    if risk_level == "High":
        actions.append("🚨 Schedule urgent 1-on-1 counseling with Academic Advisor within 48 hours")
        actions.append("📋 Issue mandatory attendance recovery contract to target >= 75%")
        actions.append(f"👨‍🏫 Assign peer tutor for intensive catch-up in {weak_subject}")
        actions.append("📞 Send official bi-weekly attendance & performance digest to parent/guardian")
    elif risk_level == "Moderate":
        actions.append(f"💡 Recommend weekly tutorial clinic attendance for {weak_subject}")
        actions.append("📈 Set intermediate milestone: achieve >= 70% in upcoming internal quiz")
        if attendance < 75.0:
            actions.append("⚠️ Monitor weekly lecture attendance to prevent dropping into high-risk zone")
    else:
        actions.append("🌟 Eligible for Honors Track and Department Research Assistantship")
        actions.append(f"🤝 Encourage peer-tutoring leadership for classmates in {weak_subject if weak_subject != 'None (Consistent)' else 'Core Subjects'}")

    return actions

